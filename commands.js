<<<<<<< HEAD
var commands = {};
var fs = require('fs');
var commandDate = new Date();
var imoutoFilePath	=	"./Imouto-chan/imouto.json";
var mysql = require('mysql');
var dbLogin			= 	require('./dbLogin.json');
var dbConnection 	= 	mysql.createConnection(dbLogin);

var urlPath 		= './Imouto-chan/';
var imagePath 		= './Imouto-chan/Images/';
var suffix = ', desu!';
var Scraper = require('images-scraper');

const google = new Scraper({
	puppeteer: {
		headless: true
	}
})

/*function cleanString(x) {
	return x.replace(/[^A-Za-z0-9_]/g,"");
}*/

function getImage(bot, message, args, fileList, filePath, commandName) {
	var fileNum = parseInt(args[0]) - 1;
	var fileSelection;
	
	if (args[0] == 'f') {
		if (!global.imouto.commands[commandName]) {
			console.log("enters this one");
			global.imouto.commands[commandName] = {};
			message.channel.send("You haven't set a favorite for " + commandName + suffix);
		}
		else if (!global.imouto.commands[commandName][message.author.id]) {
			console.log("enters the other one");
			console.log(global.imouto.commands);
			message.channel.send("You haven't set a favorite for " + commandName + suffix);
		}
		else {
			fileNum = global.imouto.commands[commandName][message.author.id] - 1;
		}
	}
	
	if (fileNum >=0 && fileNum < fileList.length) {
		message.channel.send({
			files: [{
				attachment: './Imouto-chan/Images/' + filePath+fileList[fileNum],
				name: fileList[fileNum]
			}]
		});
	} else if (fileNum >= fileList.length || fileNum < 0) {
		message.channel.send('There are only ' + fileList.length +
		' ' + commandName +' images' + suffix + '  Imouto-chan has resorted to random' + suffix);
		fileSelection = Math.floor(Math.random()*fileList.length);
		message.channel.send({
			files: [{
				attachment: './Imouto-chan/Images/' + filePath+fileList[fileSelection],
				name: fileList[fileSelection]
			}]
		});
	} else {
		fileSelection = Math.floor(Math.random()*fileList.length);
		message.channel.send({
			files: [{
				attachment: './Imouto-chan/Images/' + filePath+fileList[fileSelection],
				name: fileList[fileSelection]
			}]
		});
	}
}

function sayWord(bot, message, args, phrase) {
	message.delete(message);
	message.channel.send(phrase);
	console.log(phrase);
}

commands.favorite = function(bot, message, args) {
	var fCommand = args[0];
	var fSelection = args[1];

	if (isNaN(args[1])) {
		message.channel.send("Baka!  You have to use $favorite <command> <number>" + suffix);
	}
	else if (!args[1]) {
		message.channel.send("Baka!  You have to use $favorite <command> <number>" + suffix);
	}
	else {
		
		for(var com in commands) {
			
			if (com == fCommand) {
				if (!global.imouto.commands) {
					global.imouto.commands = {};
				}
		
				if (!global.imouto.commands[fCommand]) {
					global.imouto.commands[fCommand] = {};
				}
				
				global.imouto.commands[fCommand][message.author.id] = fSelection;
					message.channel.send(getNameForUser(message.author, message.guild) + ", you have registered a new favorite for " +
					fCommand + suffix);
					saveImouto();
					break;
			}
		}
	}
	console.log(args);
	console.log(getNameForUser(message.author, message.guild));
}


//-------------------------------------------------------------------------------------

/*function loadImouto() {
  fs.readFile(
      imoutoFilePath,
      function(err, data) {
        if (err) {
          console.log(imoutoFilePath + " not found; ignoring" + suffix);
        } else {
          imouto = JSON.parse(data);
	console.log(imouto);
        }
      });
}*/

function saveImouto() {
	//console.log("in saveWallet: " + wallet["money"]);
  fs.writeFileSync(
      imoutoFilePath,
      JSON.stringify(global.imouto, null, 2));
}

/*----------------------------------------------------------------------------------------*/
function getNameForUserID(id, guild){
	var user = global.bot.users.cache.get(id);
	if (user === null || user === undefined) {
		return "[User Not In Channel]"
	}
	return "[unknown issue]"
}

function getNameForUser(user, guild) {
	if (user === null || user === undefined) {
 		return "[Someone who left the channel]";
	}
  	if (guild !== null && guild !== undefined) {
		var foundUser = guild.members.cache.get(user.id);
		if (foundUser && foundUser.nickname) {
			return foundUser.nickname;
		}
	}
	//return getNameForUserID(user, guild);
	return user.username;
}

function gnomeballChangeHands(message, offPlayer, defPlayer) {
	dbConnection.query(`UPDATE stats SET hasGnomeball = 0 WHERE discordID = ?`, [defPlayer.discordID]);
	dbConnection.query(`UPDATE stats SET hasGnomeball = 1 WHERE discordID = ?`, [offPlayer.discordID]);
}

function tacklingLevelUp(message, offPlayer, expGain) {
	var skillExp = offPlayer.tacklingExp + expGain;
	var skillLevel = offPlayer.tacklingLevel;
	var expRequired = (skillLevel + 1) * 2.5;
	
	if (skillLevel < 99) {
		while (skillExp > expRequired) {
			skillExp -= expRequired;
			skillLevel++;
			expRequired += 2.5;
		}
	}
	dbConnection.query(`UPDATE stats SET tacklingLevel = ?, tacklingExp = ? WHERE discordID = ?`,
		[skillLevel, skillExp, offPlayer.discordID]);
}

function fortitudeLevelUp(message, defPlayer, expGain) {
	var skillExp = defPlayer.fortitudeExp + 10;
	var skillLevel = defPlayer.fortitudeLevel;
	var expRequired = (skillLevel + 1) * 2.5;
	var userMaxHP = defPlayer.userMaxHealth;
	
	if (skillLevel < 99) {
		while (skillExp > expRequired) {
			skillExp -= expRequired;
			skillLevel++;
			expRequired += 2.5;
			userMaxHP += 2.5;
			
		}
	}

	var maxHealth = (skillLevel + 1) * 2.5;
	dbConnection.query(`UPDATE stats SET fortitudeLevel = ?, fortitudeExp = ?, userMaxHealth = ?  WHERE discordID = ?`,
			[skillLevel, skillExp, maxHealth, defPlayer.discordID]);
}

function tackleSuccess(message, offPlayer, defPlayer, damageDealt) {
	var newHP;
	var currentHP = defPlayer.userHealth;
	var defMaxHP = defPlayer.userMaxHealth;
	var levelDifference = defPlayer.fortitudeLevel - offPlayer.tacklingLevel;
	var expGained;
	var defExpGain = defPlayer.fortitudeLevel * 10;
	var healDate = new Date();
	
	
	
	newHP = Math.ceil(currentHP - damageDealt);

	if (levelDifference <= 0) {
		levelDifference = 0;
	}
	
	if (newHP <= 0) {
		newHP = 0;
		defPlayer.hasGnomeball = false;
		offPlayer.hasGnomeball = true;
		message.reply("stole the gnomeball" + suffix);
		expGained = 10 + levelDifference;
		tacklingLevelUp(message, offPlayer, expGained);
		fortitudeLevelUp(message, defPlayer, defExpGain);
		healDate.setMinutes(healDate.getMinutes() + 10);
		dbConnection.query(`UPDATE stats SET healDate = ?, userHealth = 0  WHERE discordID = ?`,[healDate, defPlayer.discordID] ,function (error, results, fields) {
			if(error) throw error; {
				console.log(error);
			}
		});
		if(currentHP <= 0) {	
			message.channel.send("The referee gives you a yellow card for harassing an exhausted player" + suffix);
			increaseYellowCards(message, offPlayer);
		}
		gnomeballChangeHands(message, offPlayer, defPlayer);
	}
	else {
		message.channel.send(getNameForUser(defPlayer, message.guild) +
			" is hit and is now at " + newHP + "/" + defMaxHP + suffix);
		dbConnection.query(`UPDATE stats SET healDate = ?, userHealth = ? WHERE discordID = ?`, [healDate, newHP, defPlayer.discordID]);
		tacklingLevelUp(message, offPlayer, 10);
	}
	
	defPlayer.userHealth = newHP; //make changeHealth(); function
	
	console.log(currentHP + " currentHP");
	console.log(levelDifference + " levelDif");
	console.log(defExpGain + " defExPgain");
	console.log(expGained + " expgain");
}

function extraGnomeball (message, offPlayer) {
	var change = Math.random()*100+1;

	if (change <= 15) {
		message.reply("Somehow, you find a gnomeball has appeared in your inventory anyway" + suffix);
		dbConnection.query(`UPDATE stats SET hasGnomeball = 1 WHERE discordID = ?`, [message.author.id]);
	}
}

function failedTackle(message, offPlayer, tackleDate) {
	tacklingLevelUp(message, offPlayer, 5);
	message.reply("you have failed to make any impact" + suffix + "\r\nTry again in 5 minutes" + suffix);
	tackleDate.setMinutes(tackleDate.getMinutes() + 5);
	offPlayer.failedTackle = tackleDate;
	dbConnection.query(`UPDATE stats SET failedTackle = ? WHERE discordID = ?`, [offPlayer.failedTackle, offPlayer.discordID]);
	extraGnomeball(message, offPlayer);
}

function conductTackle(message, offPlayer, defPlayer) {
	var offenseBuff = (Math.random()*1) + 1;
	var defenseBuff = (Math.random()*0.5) + 1.5;
	var damageDealt = (offPlayer.tacklingLevel * offenseBuff) - (defPlayer.fortitudeLevel * defenseBuff);
	var tackleDate = new Date();
	
	var availableTackle = new Date(offPlayer.failedTackle);
	
	if (availableTackle < tackleDate) {
		console.log("available tackle: " + availableTackle);
		console.log("tackle date: " + tackleDate);
		if (damageDealt > 0) {
			tackleSuccess(message, offPlayer, defPlayer, damageDealt);
		}
		else {
			failedTackle(message, offPlayer, tackleDate);
		}
	}
	else {
		var diff = Math.abs(availableTackle - tackleDate);
		var minutesLeft = Math.floor((diff/1000)/60);
		
		message.channel.send("You still have " + minutesLeft + " minutes until you can try again" + suffix);//message about tackle minutes
	}
}

function generateValues (bot, message, args) {

	dbConnection.query(`SELECT * FROM stats WHERE discordID = '${message.author.id}'`, (error, results) => {
		if(error) {
			console.log(error);
		}
		if(!results.length) {
			dbConnection.query(`INSERT INTO stats (discordID) VALUES ('${message.author.id}')`);
			console.log('New user has been registered into stats as ' + message.author.id);
		}
		else{
			console.log('user already registered in database');
		}
	});
}

function increaseYellowCards(message, offPlayer) {
	if (offPlayer.yellowCards >= 2) {
		var banDate = new Date();
		banDate.setHours(banDate.getHours() + 8);
		dbConnection.query(`UPDATE stats SET yellowCards = 0 WHERE discordID = ?`, [offPlayer.discordID]);
		message.reply("you've gotten 3 yellow cards.  The referee hands you a red card and bans you from gnomeball for 8 hours");
		dbConnection.query(`UPDATE stats SET unbanDate = ? WHERE discordID = ?`, [banDate, offPlayer.discordID]);
	}
	else {
		dbConnection.query(`UPDATE stats SET yellowCards = yellowCards + 1 WHERE discordID = ?`,[offPlayer.discordID]);
		message.reply("A referee hands you a yellow card" + suffix);
	}	
}

function attemptTackle(message, offPlayer, defPlayer) {
	var attemptedTackleDate = new Date();
	var banDate = new Date(offPlayer.unbanDate); //get unban date from offPlayer object and convert it to a proper JS date object
	
	if(banDate > attemptedTackleDate) {
		message.reply("you are currently banned from gnomeball" + suffix);
	}
	else {
		if (Number(offPlayer.userHealth) > 0) {
			if (defPlayer.discordID === message.author.id) {
				message.channel.send("You cannot tackle yourself" + suffix);
			}
			else if (defPlayer.hasGnomeball) {
				if (message.mentions.users.array()[0].status !== "offline") {
					conductTackle(message, offPlayer, defPlayer);
				}
				else {
					gnomeballChangeHands(message, offPlayer, defPlayer);
				}
			}
			else {
					message.channel.send(getNameForUser(defPlayer, message.guild) + " doesn't have the gnomeball" + suffix);
					increaseYellowCards(message, offPlayer);			
			}
		}
		else {
			message.reply("you are too tired to tackle right now" + suffix)
			message.reply("You have " + offPlayer.userHealth + "HP" + suffix);
		}
	}
}

function getTackleStats(bot, message, args){
						
	var queryLine = `SELECT * FROM stats WHERE discordID = ?`; 
	var defQueryLine = `SELECT * FROM stats WHERE discordID = ?`;
	
	dbConnection.query(queryLine, [message.author.id], function (error, results, fields) { //query for Offensive Player

		if (results.length > 0) {
			var offPlayer = {
				username:	message.author.username,
				nickname:	message.author.nickname,
				discordID: 	message.author.id,
				id:		message.author.id,
				userHealth:	results[0].userHealth,
				tacklingLevel:	results[0].tacklingLevel,
				tacklingExp:	results[0].tacklingExp,
				yellowCards:	results[0].yellowCards,
				unbanDate:	results[0].unbanDate,
				failedTackle:	results[0].failedTackle,
				hasGnomeball:	results[0].hasGnomeball
			};
		console.log("offPlayer: " + offPlayer.userHealth);
		}

		dbConnection.query(defQueryLine, [message.mentions.users.array()[0].id], function (error, results, fields) { //query for Defensive Player

			if(results.length > 0) {
			var defPlayer = {
				username:	message.mentions.users.array()[0].username,
				nickname:	message.mentions.users.array()[0].nickname,
				discordID:	message.mentions.users.array()[0].id,
				id:		message.mentions.users.array()[0].id,
				userHealth:	results[0].userHealth,
				userMaxHealth:	results[0].userMaxHealth,
				fortitudeLevel:	results[0].fortitudeLevel,
				fortitudeExp:	results[0].fortitudeExp,
				hasGnomeball:	results[0].hasGnomeball
			};

			attemptTackle(message, offPlayer, defPlayer);
			}
		});
	});
}

commands.tackle = function(bot, message, args) {
	if (message.channel.id === '814148824989171772') {
		if(message.mentions.users.size === 0) {
			message.reply("use $tackle @user to tackle" + suffix);
		}
		else {
			getTackleStats(bot, message, args);
		}
	}
	else {
		message.channel.send("Gnomeball has been restricted to <#814148824989171772>" + suffix);
	}
}

commands.pass = function(bot, message, args) {

	if (message.channel.id === '814148824989171772') {
		var passingPlayer = {
			username: message.author.username,
			nickname: message.author.nickname,
			discordID: message.author.id,
			id: message.author.id,
			hasGnomeball: false
		};
		var receivingPlayer ={
			username: message.mentions.users.array()[0].username,
			nickname: message.mentions.users.array()[0].nickname,
			discordID: message.mentions.users.array()[0].id,
			id: message.mentions.users.array()[0].id,
			hasGnomeball: false
		};
		dbConnection.query(`SELECT hasGnomeball FROM stats WHERE discordID = ?`, [passingPlayer.discordID], function (error, results, fields) {
			console.log("results: " + results);
			if(results) {
				if (results[0].hasGnomeball === 1) {
	
					if (message.mentions.users.size > 1) {
						message.channel.send("You can only pass to one person" + suffix);
					}
					else if (message.mentions.users.size === 0 || message.mentions.users.array()[0].presence.status === "offline") {
						message.channel.send(getNameForUser(message.author, message.guild) + " throws the gnomeball out into the open" + suffix +
							"\r\nA Gnomeball Referee throws it back to you and mumbles something about bug abusers" + suffix);
	
					}
					else if (message.mentions.users.array()[0].id === message.author.id) {
						message.channel.send("Don't be a ballhog" + suffix);
					}
					else if (message.mentions.users.array()[0].id=== '209166316035244033' || message.mentions.users.array()[0].id === '211522387471106048') {
						message.channel.send("Bots don't know how to play Gnomeball" + suffix);
					}
					else {
						dbConnection.query(`SELECT hasGnomeball FROM stats WHERE discordID = ?`, [receivingPlayer.discordID], function (error, results, fields) {
							if (results.length > 0) {
								receivingPlayer.discordID = message.mentions.users.array()[0].id;
								message.channel.send(getNameForUser(message.author, message.guild) + " passed the gnomeball to " +
									getNameForUser(message.mentions.users.array()[0], message.guild) + suffix);
								gnomeballChangeHands(message, receivingPlayer, passingPlayer);
							}
							else {
								message.reply(getNameForUser(message.mentions.users.array()[0], message.guild) + " is not in the database" + suffix);
							}
						});
					}
				}
				else {
					message.reply("You don't have the gnomeball" + suffix);
					console.log("Tried to pass gnomeball but didn't have it: " + results);
					console.log(results);
					console.log("results printed: " + results[0]);
				}
			}
			else {
				message.reply("You don't have the gnomeball" + suffix);
			}
	
		});
	}
	else {
		message.channel.send("Gnomeball has been restricted to <#814148824989171772>" + suffix);
	}
}

commands.valheim = function(bot, message, args) {
	message.channel.send("server name: rvheim\nserver address: pyroichiban.com:2456\nserver password: rvcord");
}

commands.fix = function(bot, message, args) {
//COMMAND RESERVED FOR DATA ERRORS	
}

commands.test = function(bot, message, args) {
//COMMAND RESERVED FOR FUNCTION TESTS
}

commands.register = function(bot, message, args) {
	var registrant = message.author.id;
	var storedUsername = message.author;
	if(args[0]) {
		dbConnection.query(queryLine, [args[0]], function (error, results, fields) {
		
		if (error) throw error; {
			console.log(error);
		}

		storedUsername = results[0].username;
		
		});
		queryLine = "UPDATE users SET discordID = ? WHERE email = ?";
		dbConnection.query(queryLine, [message.author.id, args[0]], function (error, results, fields) {
			if (error) throw error; {
				console.log(error);
			}
			message.channel.send("User registered as: " + storedUsername + suffix);
	});
	}
	else {
		message.channel.send("Please format command as \"$register \'email\' \"" + suffix);
		console.log("testing error");
	}
	
	console.log("message: " + message);
	console.log("author: " + message.author.username);
	console.log("args: " + args);

}

commands.image = function(bot, message, args) {
	if(args[0]) {
		//message.channel.send("framework successful");
		const imageQuery = args.join(' ');
		console.log("imageQuery: " + imageQuery);
		async function getImage(bot, message, imageQuery) {
			console.log("async function entered");
			const imageResults = await google.scrape(imageQuery, 1);
			console.log("image results: " + imageResults);
			if (imageResults.length >= 1){
				if(!imageResults[0].url.includes("fbsbx")){
					message.channel.send(imageResults[0].url);
					console.log("url: " + imageResults[0].url);
				}
				else {
					message.channel.send("fbsbx query detected from '" + imageQuery +"'" + suffix);
				}

			}
			else {
				message.channel.send("no results found for: " + imageQuery + suffix);
			}
		};
		getImage(bot, message, imageQuery);

	}
	else{
		message.reply("You need to add a search item" + suffix);
	}
}

commands.info = function(bot, message, args) {
	var registeredName;
	var registeredEmail;

	
	var queryLine = 'SELECT * FROM users WHERE discordID = ?'; 
	dbConnection.query(queryLine, [message.author.id], function (error, results, fields) {
		
	if (error) throw error; {
			console.log(error);
	}
	console.log(results);
	message.channel.send("You are registered at pyroichiban.com as: " + "\n" + "User ID: " + results[0].id + "\n" + "Username: " + results[0].username + "\n" + "Email: " + results[0].email + suffix);
		
	});

	
	console.log("message: " + message);
	console.log("author: " + message.author.username);
	console.log("args: " + args);

}

commands.suggest = function(bot, message, args) {
	var suggestionFile 	= urlPath + '/suggestions.txt';
	
	fs.appendFile(suggestionFile, args.join(" ") + ' -' + getNameForUser(message.author, message.guild) + '\r\n', (err) => {
		if (err) throw err;
		message.channel.send("Imouto-chan has received your suggestion" + suffix);
		console.log("Imouto received a suggestion" + suffix); 
	});
}

commands.say = function(bot, message, args) {
	
	if (message.author.id === '208165377358823425') {
		
		var joinedPhrase = args.join(" ");
		var phraseLength = joinedPhrase.length;

		if (joinedPhrase.charAt(phraseLength - 1) != '?'){

		message.delete(message);
		message.channel.send(args.join(" ") + suffix);
		}
		else {

		var cutPhrase = joinedPhrase.slice(0, phraseLength -1);

		message.delete(message);
		message.channel.send(cutPhrase + ', desu ka?');
		}
	}
	/*else if (args.join(" ") === 'Imouto-chan does not talk to strangers, desu!') {
		message.channel.send('You\'re not so clever' + suffix);
	}
	else {
		message.channel.send("Imouto-chan does not talk to strangers" + suffix);
	}*/
	/*else {
		if ( args.indexOf("Pyro") > -1 || args.indexOf("pyro") || args.includes("zac") || args.includes("Zac")) {
		message.channel.send("Imouto-chan refuses" + suffix);
		}*/
	else {
			message.channel.send(args.join(" ") + suffix + "  *-" 
			+ getNameForUser(message.author, message.guild) + "*");
	}
}

commands.help = function(bot, message, args) {
	message.channel.send("You can visit http://pyroichiban.com/Imouto-chan/how-to-use.html to learn more about me" + suffix);
}

commands.gao = function(bot, message, args) {
	var phrase = 'Gao~';
	
	sayWord(bot, message, args, phrase);
}

commands.uguu = function(bot, message, args) {
	var phrase = 'Uguu~';
	
	sayWord(bot, message, args, phrase);
}

commands.kyun = function(bot, message, args) {
	var phrase = 'Kyun~';
	
	sayWord(bot, message, args, phrase);
}

commands.juice = function(bot, message, args) {
	message.channel.send({files: ["./Imouto-chan/Images/juicegif.gif"]});
}

commands.ginandjuice = function(bot, message, args) {
	message.channel.send("I can h-hold my liquor just fine..." + "\n", {
		files: ["./Imouto-chan/Images/drunkanime1.jpg"]});
}

commands.mf = function(bot, message, args) {
	message.channel.send({files: ["./Imouto-chan/Images/lastorderrage.gif"]});
}

commands.ring = function(bot, message, args) {
	message.channel.send("Kyon-kun, denwa!");
}

commands.puhi = function(bot, message, args) {
	const commandName = 'puhi';
	var filePath	  = "Botan/";
	const fileList 	  = ['Botan0.jpg', 'Botan1.jpg', 'Botan2.gif', 'Botan3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.dango = function(bot, message, args) {
	const commandName = 'dango';
	var filePath 	  = "Dango/";
	const fileList 	  = ['dango0.jpg', 'dango1.jpg', 'dango2.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.fuko = function(bot, message, args) {
	const commandName = 'fuko';
	var filePath	  = "Fuko/";
	const fileList 	  = ['fuko0.gif', 'fuko1.gif', 'fuko2.jpg', 'fuko3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.nichijou = function(bot, message, args) {
	const commandName = 'nichijou';
	var filePath	  = "Nichijou/";
	const fileList 	  = ['Nichijou0.gif', 'Nichijou1.gif', 'Nichijou2.gif', 'Nichijou3.gif', 'Nichijou4.gif', 
						 'Nichijou5.gif', 'Nichijou6.gif', 'Nichijou7.gif', 'Nichijou8.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.cry = function(bot, message, args) {
	const commandName = 'cry';
	var filePath	  = "Cry/";
	const fileList 	  = ['cry0.gif', 'cry1.jpg', 'cry2.gif', 'cry3.gif', 'cry4.gif', 'cry5.gif', 'cry6.gif',
						 'cry7.png','cry8.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.baka = function(bot, message, args) {
	const commandName = 'baka';
	var filePath 	  = "Baka/";;
	const fileList 	  = ['baka0.jpg', 'baka1.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.pet = function(bot, message, args) {
	const commandName = 'pet';
	var filePath	  = "Pet/";
	const fileList 	  = ['Pet0.gif', 'Pet1.gif', 'Pet2.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.nani = function(bot, message, args) {
	const commandName = 'nani';
	var filePath	  = "Nani/";
	const fileList 	  = ['Nani0.gif', 'Nani1.png','Nani2.gif'];
	
	message.channel.send('Nani?');
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.bored = function(bot, message, args) {
	const commandName = 'bored';
	var filePath	  = 'Bored/';
	const fileList 	  = ['Bored0.gif', 'Bored1.jpg', 'Bored2.gif', 'Bored3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.ciao = function(bot, message, args) {
	const commandName = 'ciao';
	var filePath	  = "Ciao/";
	const fileList 	  = ['ciao0.jpg','ciao1.gif','ciao2.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.shocked = function(bot, message, args) {
	const commandName = 'shocked';
	var filePath	  = "Shocked/";
	const fileList 	  = ['shocked0.jpg', 'shocked1.jpg', 'shocked2.gif', 'shocked3.png', 'shocked4.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.vuvuzela = function(bot, message, args) {
	const commandName = 'vuvuzela';
	var filePath	  = "Vuvuzela/";
	const fileList 	  = ['vuvuzela0.jpg', 'vuvuzela1.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.teehee = function(bot, message, args) {
	const commandName = 'teehee';
	var filePath	  = "Teehee/";
	const fileList 	  = ['teehee0.jpg','teehee1.gif','teehee2.gif','teehee3.jpg','teehee4.png','teehee5.png'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.smug = function(bot, message, args) {
	const commandName = 'smug';
	var filePath	  = "Smug/";
	const fileList 	  = ['smug0.jpg','smug1.jpg','smug2.jpg','smug3.jpg','smug4.jpg','smug5.png', 'smug6.jpg', 'smug7.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.pout = function(bot, message, args) {
	const commandName = 'pout';
	var filePath	  = "Pout/";
	const fileList 	  = ['pout0.png','pout1.jpg','pout2.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.hype = function(bot, message, args) {
	const commandName = 'hype';
	var filePath	  = "Hype/";
	const fileList 	  = ['hype0.gif','hype1.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.tired = function(bot, message, args) {
	const commandName = 'tired';
	var filePath	  = "Tired/";
	const fileList 	  = ['tired0.gif','tired1.gif','tired2.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.facepalm = function(bot, message, args) {
	const commandName = 'facepalm';
	var filePath	  = "Facepalm/";
	const fileList 	  = ['facepalm0.jpg','facepalm1.png','facepalm2.jpg','facepalm3.png'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.disappointed = function(bot, message, args) {
	const commandName = 'disappointed';
	var filePath	  = "Disappointed/";
	const fileList 	  = ['disappointed0.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.working = function(bot, message, args) {
	const commandName = 'working';
	var filePath	  = "Working/";
	const fileList 	  = ['working0.gif','working1.jpg','working2.jpg','working3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.classified = function(bot, message, args) {
	const commandName = 'classified';
	var filePath	  = "Classified/";
	const fileList 	  = ['classified0.jpg','classified1.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.yandere = function(bot, message, args) {
	const commandName = 'yandere';
	var filePath	  = "Yandere/";
	const fileList 	  = ['yandere0.jpg','yandere1.jpg','yandere2.jpg','yandere3.jpg','yandere4.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.rock = function(bot, message, args) {
	const commandName = 'rock';
	var filePath	  = "Rock/";
	const fileList 	  = ['rock0.gif','rock1.gif','rock2.gif','rock3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.traumatized = function(bot, message, args) {
	const commandName = 'traumatized';
	var filePath	  = "Traumatized/";
	const fileList 	  = ['traumatized0.jpg','traumatized1.gif','traumatized2.gif',
						 'traumatized3.jpg','traumatized4.jpg','traumatized5.gif'];

	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.irritated = function(bot, message, args) {
	const commandName = 'irritated';
	var filePath	  = "Irritated/";
	const fileList 	  = ['irritated0.jpg','irritated1.jpg','irritated2.png','irritated3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.honk = function(bot, message, args) {
	const commandName = 'honk';
	var filePath	  = "Honk/";
	const fileList 	  = ['honk0.jpg','honk1.png'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.maga = function(bot, message, args) {
	const commandName = 'maga';
	var filePath	  = "MAGA/";
	const fileList 	  = ['maga0.jpg','maga1.jpg','maga2.jpg','maga3.jpg','maga4.jpg','maga5.jpg','maga6.jpg','maga7.jpg','maga8.png'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.storm = function(bot, message, args) {
	message.channel.send("Function is currently disabled" + suffix);
	/*const commandName = 'storm';
	var filePath	  = "Storm/";
	const fileList 	  = ['storm0.jpg','storm1.jpg','storm2.png','storm3.jpg','storm4.png'];
	
	getImage(bot, message, args, fileList, filePath, commandName);*/
}

commands.lewd = function(bot, message, args) {
	const commandName = 'lewd';
	var filePath	  = "Lewd/";
	const fileList 	  = ['lewd0.jpg','lewd1.jpg','lewd2.png','lewd3.png','lewd4.gif','lewd5.png','lewd6.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.b = function(bot, message, args) {
	const commandName = 'b';
	var filePath	  = "Ban/";
	const fileList 	  = ['ban0.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.tuturu = function(bot, message, args) {
	const commandName = 'tuturu';
	var filePath	  = "Tuturu/";
	const fileList 	  = ['tuturu0.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.unimpressed = function(bot, message, args) {
	const commandName = 'unimpressed';
	var filePath	  = "Unimpressed/";
	const fileList 	  = ['unimpressed0.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.flex = function(bot, message, args) {
	const commandName = 'flex';
	var filePath	  = "Flex/";
	const fileList 	  = ['flex0.jpg','flex1.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.dab = function(bot, message, args) {
	const commandName = 'dab';
	var filePath	  = "Dab/";
	const fileList 	  = ['dab0.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.tenshi = function(bot, message, args) {
	//bot.setAvatar("./Imouto-chan/Images/Avatars/Kanade.jpg"); stupid discord not allowing avatar changes anymore
	message.channel.send("Transformation complete.");
	global.personality = 1;
}

commands.neko = function(bot, message, args) {
	message.channel.send("Imouto-chan has transformed, nyaa~");
	global.personality = 2;
}

commands.stopzombie = function(bot, message, args) {
	var zombiePath		= "./Imouto-chan/Images/Zombie/";
	
	if (global.zombieActive == true) {
		message.channel.send("You have stopped the zombie threat" + suffix);
		message.channel.send({file: [zombiePath + "stopzombie0.gif"]});
		global.imoutoTimeOfDeath = commandDate.getHours();
		
		if(!global.imouto.minigames.halloween) {
			global.imouto.minigames.halloween = {};
		}
		
		if(!global.imouto.minigames.halloween.zombie) {
			global.imouto.minigames.halloween.zombie = {};
		}
		
		if(!global.imouto.minigames.halloween.zombie.zombiesKilled) {
			global.imouto.minigames.halloween.zombie.zombiesKilled = {};
		}
		
		if (!global.imouto.minigames.halloween.zombie.zombiesKilled[message.author.id]) {
		global.imouto.minigames.halloween.zombie.zombiesKilled[message.author.id] = 0;
		}
	
		global.imouto.minigames.halloween.zombie.zombiesKilled[message.author.id]++;
		global.zombieActive = false;
		global.zombieKilled = true;
		saveImouto();
	}
	else {
		message.channel.send("There are no zombies in the chat" + suffix);
	}
}

commands.unlock = function(bot, message, args) {

}


commands.hint = function(bot, message, args) {

}

commands.wallet = function(bot, message, args) {

}

commands.inventory = function(bot, message, args) {

}

commands.describe = function(bot, message, args) {
	/*var itemName = args.join(" ");
	if (!global.items[itemName]) {
		message.reply("that isn't a valid item name");
	}
	else if (global.imouto.minigames.treasure[message.author.id].inventory.indexOf(itemName) > -1) {
		message.channel.send(global.items[itemName].description);
	}
	else {
		message.reply("you don't have a " + itemName + suffix);
	}*/
}

commands.badges = function(bot, message, args) {
	var badgeList = [];
	
	if (!global.imouto[message.author.id]) {
		global.imouto[message.author.id] = {};
	}
	
	if (!global.imouto[message.author.id].badges) {
		global.imouto[message.author.id].badges = [];
	}
	
	var ownedBadges = global.imouto[message.author.id].badges;
	
	if (ownedBadges.length > 0) {
		for(var badge in ownedBadges) {
			badgeList.push(ownedBadges[badge]);
		}
		message.reply("you have earned the following badges: \r\n" + badgeList.join("\n"));
	}
	else {
		message.reply("you haven't earned any badges yet" + suffix);
	}
	
	saveImouto();
}

function getWallet(currency) {

	var walletAmount	= currency;
	var walletString	= "";
	var copperAmount	= Math.floor(walletAmount % 1000);
	var copperString	= "";
	var silverAmount	= Math.floor((walletAmount / 1000) % 1000);
	var silverString	= "";
	var goldAmount 		= Math.floor((walletAmount / 1000000) % 1000);
	var goldString		= "";
	var platinumAmount	= Math.floor(walletAmount / 1000000000);
	var platinumString	= "";

	if (platinumAmount > 0) {
		platinumString = " *" + platinumAmount + " platinum*";
	}

	if (goldAmount > 0) {
		goldString = " *" + goldAmount + " gold*";
	}

	if (silverAmount > 0) {
		silverString = " *" + silverAmount + " silver*";
	}

	if (copperAmount > 0) {
		copperString = " *" + copperAmount + " copper*";
	}
			
	walletString = platinumString + goldString + silverString + copperString;

	console.log("wallet string: " + walletString);
	return walletString;

}


commands.stats = function(bot, message, args) {
	var userHealthValue;
	var userMaxHealth;
	var tacklingValue;
	
	var queryLine = `SELECT * FROM stats WHERE discordID = ?`; 
	dbConnection.query(queryLine, [args[0]], function (error, results, fields) {
	
	if (error) throw error; {
		console.log(error);
	}

	});
	dbConnection.query(queryLine, [message.author.id], function (error, results, fields) {
		if (error) throw error; {
			console.log(error);
		}
	
		message.channel.send(getNameForUser(message.author, message.guild) + " your stats are:\r\nHealth: " + results[0].userHealth + "/" + results[0].userMaxHealth + "\r\nTackling: " +
			results[0].tacklingLevel + "/" + results[0].tacklingLevel + "\r\nPassing: " + results[0].passingLevel + "/" + results[0].passingLevel + "\r\nFortitude: " +
			results[0].fortitudeLevel + "/" + results[0].fortitudeLevel + "\r\nGardening: " + results[0].gardeningLevel + "\r\nYellow Cards: " + results[0].yellowCards + "\r\nUnban Date: " +results[0].unbanDate + "\r\nWallet: " + getWallet(results[0].currency));
		console.log(results[0]);
	});
}

commands.poll = function(bot,message,args) {
	
	var pollQuestion = "Which feature would you rather see added first?\r\n1. Breeding\r\n2. More Race Types\r\n3. Gardening";
	message.channel.send(pollQuestion);
}

commands.vote = function(bot,message,args) {
	if(!global.imouto.poll) {
		global.imouto.poll = {};
	}
	if(!global.imouto.poll[message.author.id]){
		global.imouto.poll[message.author.id] = {}
	}
	if(!global.imouto.poll[message.author.id].hasVoted) {
		global.imouto.poll[message.author.id].hasVoted = false;
	}
	if(!global.imouto.poll.options) {
		global.imouto.poll.options = {}
	}
	
	var selection = args[0]
	
	if(global.imouto.poll[message.author.id].hasVoted === false) {
		if (selection > 0 && selection < 4) {
			if(selection % 1 === 0) {
				if(!global.imouto.poll.options[selection]) {
					global.imouto.poll.options[selection] = 0;
				}
				message.reply("your vote has been registered" + suffix);
				global.imouto.poll.options[selection]++;
				global.imouto.poll[message.author.id].hasVoted = true;
			}
			else {
				message.reply("no decimals allowed" + suffix);
			}
		}
		else {
			message.reply("enter a number 1-3" + suffix);
		}
	}
	else {
		message.reply("you have already voted" + suffix);
	}
	saveImouto();
}

commands.results = function(bot,message,args) {
	if(!global.imouto.poll) {
		global.imouto.poll = {};
	}
	if(!global.imouto.poll[message.author.id]){
		global.imouto.poll[message.author.id] = {}
	}
	if(!global.imouto.poll[message.author.id].hasVoted) {
		global.imouto.poll[message.author.id].hasVoted = false;
	}
	if(!global.imouto.poll.options) {
		global.imouto.poll.options = {}
	}
	
	var optionOne = global.imouto.poll.options[1];
	var optionTwo = global.imouto.poll.options[2];
	var optionThree = global.imouto.poll.options[3];
	
	if(optionOne === undefined) {
		optionOne = 0;
	}
	if(optionTwo === undefined) {
		optionTwo = 0;
	}
	if(optionThree === undefined) {
		optionThree = 0;
	}
	var totalVotes = optionOne + optionTwo + optionThree;
	var percentOne = Math.floor((optionOne/totalVotes)*100);
	var percentTwo = Math.floor((optionTwo/totalVotes)*100);;
	var percentThree = Math.floor((optionThree/totalVotes)*100);;
	
	message.channel.send("The current results are:\r\n1. Breeding " + optionOne + " " + percentOne +
		"%\r\n2. More Race Types " + optionTwo + " " + percentTwo + "%\r\n3. Gardening " + optionThree + " " + percentThree + "%");
	
}

commands.role = function(bot,message,args) {
	
	//check to see if user has role
	console.log(args);
	for (roleName in args) {
		if (message.guild.roles.cache.find(role => role.name === args[roleName].toLowerCase())) {
			var roleID = message.guild.roles.cache.find(role => role.name === args[roleName].toLowerCase());
			
			if (message.member.roles.cache.find(role => role.name === args[roleName].toLowerCase())) {
				message.member.roles.remove(roleID);
				console.log("had role and removed: " + roleID);
			}
			else {
				message.member.roles.add(roleID);
				//console.log("did not have role and added " + roleID);
				//console.log("else line returned because has(roleID): " + message.member.roles.cache.has(roleID));
				//console.log(".find = " + message.member.roles.cache.find(role => role.name === args[roleName]));
			}
		}
		else {
			message.channel.send(args[roleName].toLowerCase() + " is not a proper role name" + suffix);
		}
	}
}

commands.wakarimasen = function(bot,message,args) {
	message.channel.send("Watashi wa dochira ka wakarimasen" + suffix);
}

module.exports = commands;
=======
var commands = {};
var fs = require('fs');
var commandDate = new Date();
var imoutoFilePath	=	"./Imouto-chan/imouto.json";
var mysql = require('mysql');
var dbLogin			= 	require('./dbLogin.json');
var dbConnection 	= 	mysql.createConnection(dbLogin);

var urlPath 		= './Imouto-chan/';
var imagePath 		= './Imouto-chan/Images/';
var suffix = ', desu!';
var Scraper = require('images-scraper');

const google = new Scraper({
	puppeteer: {
		headless: true
	}
})

/*function cleanString(x) {
	return x.replace(/[^A-Za-z0-9_]/g,"");
}*/

function getImage(bot, message, args, fileList, filePath, commandName) {
	var fileNum = parseInt(args[0]) - 1;
	var fileSelection;
	
	if (args[0] == 'f') {
		if (!global.imouto.commands[commandName]) {
			console.log("enters this one");
			global.imouto.commands[commandName] = {};
			message.channel.send("You haven't set a favorite for " + commandName + suffix);
		}
		else if (!global.imouto.commands[commandName][message.author.id]) {
			console.log("enters the other one");
			console.log(global.imouto.commands);
			message.channel.send("You haven't set a favorite for " + commandName + suffix);
		}
		else {
			fileNum = global.imouto.commands[commandName][message.author.id] - 1;
		}
	}
	
	if (fileNum >=0 && fileNum < fileList.length) {
		message.channel.send({
			files: [{
				attachment: './Imouto-chan/Images/' + filePath+fileList[fileNum],
				name: fileList[fileNum]
			}]
		});
	} else if (fileNum >= fileList.length || fileNum < 0) {
		message.channel.send('There are only ' + fileList.length +
		' ' + commandName +' images' + suffix + '  Imouto-chan has resorted to random' + suffix);
		fileSelection = Math.floor(Math.random()*fileList.length);
		message.channel.send({
			files: [{
				attachment: './Imouto-chan/Images/' + filePath+fileList[fileSelection],
				name: fileList[fileSelection]
			}]
		});
	} else {
		fileSelection = Math.floor(Math.random()*fileList.length);
		message.channel.send({
			files: [{
				attachment: './Imouto-chan/Images/' + filePath+fileList[fileSelection],
				name: fileList[fileSelection]
			}]
		});
	}
}

function sayWord(bot, message, args, phrase) {
	message.delete(message);
	message.channel.send(phrase);
	console.log(phrase);
}

commands.favorite = function(bot, message, args) {
	var fCommand = args[0];
	var fSelection = args[1];

	if (isNaN(args[1])) {
		message.channel.send("Baka!  You have to use $favorite <command> <number>" + suffix);
	}
	else if (!args[1]) {
		message.channel.send("Baka!  You have to use $favorite <command> <number>" + suffix);
	}
	else {
		
		for(var com in commands) {
			
			if (com == fCommand) {
				if (!global.imouto.commands) {
					global.imouto.commands = {};
				}
		
				if (!global.imouto.commands[fCommand]) {
					global.imouto.commands[fCommand] = {};
				}
				
				global.imouto.commands[fCommand][message.author.id] = fSelection;
					message.channel.send(getNameForUser(message.author, message.guild) + ", you have registered a new favorite for " +
					fCommand + suffix);
					saveImouto();
					break;
			}
		}
	}
	console.log(args);
	console.log(getNameForUser(message.author, message.guild));
}


//-------------------------------------------------------------------------------------

/*function loadImouto() {
  fs.readFile(
      imoutoFilePath,
      function(err, data) {
        if (err) {
          console.log(imoutoFilePath + " not found; ignoring" + suffix);
        } else {
          imouto = JSON.parse(data);
	console.log(imouto);
        }
      });
}*/

function saveImouto() {
	//console.log("in saveWallet: " + wallet["money"]);
  fs.writeFileSync(
      imoutoFilePath,
      JSON.stringify(global.imouto, null, 2));
}

/*----------------------------------------------------------------------------------------*/
function getNameForUserID(id, guild){
	var user = global.bot.users.cache.get(id);
	if (user === null || user === undefined) {
		return "[User Not In Channel]"
	}
	return "[unknown issue]"
}

function getNameForUser(user, guild) {
	if (user === null || user === undefined) {
 		return "[Someone who left the channel]";
	}
  	if (guild !== null && guild !== undefined) {
		var foundUser = guild.members.cache.get(user.id);
		if (foundUser && foundUser.nickname) {
			return foundUser.nickname;
		}
	}
	//return getNameForUserID(user, guild);
	return user.username;
}

function gnomeballChangeHands(message, offPlayer, defPlayer) {
	dbConnection.query(`UPDATE stats SET hasGnomeball = 0 WHERE discordID = ?`, [defPlayer.discordID]);
	dbConnection.query(`UPDATE stats SET hasGnomeball = 1 WHERE discordID = ?`, [offPlayer.discordID]);
}

function tacklingLevelUp(message, offPlayer, expGain) {
	var skillExp = offPlayer.tacklingExp + expGain;
	var skillLevel = offPlayer.tacklingLevel;
	var expRequired = (skillLevel + 1) * 2.5;
	
	if (skillLevel < 99) {
		while (skillExp > expRequired) {
			skillExp -= expRequired;
			skillLevel++;
			expRequired += 2.5;
		}
	}
	dbConnection.query(`UPDATE stats SET tacklingLevel = ?, tacklingExp = ? WHERE discordID = ?`,
		[skillLevel, skillExp, offPlayer.discordID]);
}

function fortitudeLevelUp(message, defPlayer, expGain) {
	var skillExp = defPlayer.fortitudeExp + 10;
	var skillLevel = defPlayer.fortitudeLevel;
	var expRequired = (skillLevel + 1) * 2.5;
	var userMaxHP = defPlayer.userMaxHealth;
	
	if (skillLevel < 99) {
		while (skillExp > expRequired) {
			skillExp -= expRequired;
			skillLevel++;
			expRequired += 2.5;
			userMaxHP += 2.5;
			
		}
	}

	var maxHealth = (skillLevel + 1) * 2.5;
	dbConnection.query(`UPDATE stats SET fortitudeLevel = ?, fortitudeExp = ?, userMaxHealth = ?  WHERE discordID = ?`,
			[skillLevel, skillExp, maxHealth, defPlayer.discordID]);
}

function tackleSuccess(message, offPlayer, defPlayer, damageDealt) {
	var newHP;
	var currentHP = defPlayer.userHealth;
	var defMaxHP = defPlayer.userMaxHealth;
	var levelDifference = defPlayer.fortitudeLevel - offPlayer.tacklingLevel;
	var expGained;
	var defExpGain = defPlayer.fortitudeLevel * 10;
	var healDate = new Date();
	
	
	
	newHP = Math.ceil(currentHP - damageDealt);

	if (levelDifference <= 0) {
		levelDifference = 0;
	}
	
	if (newHP <= 0) {
		newHP = 0;
		defPlayer.hasGnomeball = false;
		offPlayer.hasGnomeball = true;
		message.reply("stole the gnomeball" + suffix);
		expGained = 10 + levelDifference;
		tacklingLevelUp(message, offPlayer, expGained);
		fortitudeLevelUp(message, defPlayer, defExpGain);

		healDate.setMinutes(healDate.getMinutes() + 10);

		dbConnection.query(`UPDATE stats SET healDate = ?, userHealth = 0  WHERE discordID = ?`,[healDate, defPlayer.discordID] ,function (error, results, fields) {
			if(error) throw error; {
				console.log(error);
			}
		});
		if(currentHP <= 0) {	
			message.channel.send("The referee gives you a yellow card for harassing an exhausted player" + suffix);
			increaseYellowCards(message, offPlayer);
		}
		gnomeballChangeHands(message, offPlayer, defPlayer);
	}
	else {
		message.channel.send(getNameForUser(defPlayer, message.guild) +
			" is hit and is now at " + newHP + "/" + defMaxHP + suffix);
		dbConnection.query(`UPDATE stats SET healDate = ?, userHealth = ? WHERE discordID = ?`, [healDate, newHP, defPlayer.discordID]);
		tacklingLevelUp(message, offPlayer, 10);
	}
	
	defPlayer.userHealth = newHP; //make changeHealth(); function
	
	console.log(currentHP + " currentHP");
	console.log(levelDifference + " levelDif");
	console.log(defExpGain + " defExPgain");
	console.log(expGained + " expgain");
}

function extraGnomeball (message, offPlayer) {
	var change = Math.random()*100+1;

	if (change <= 15) {
		message.reply("Somehow, you find a gnomeball has appeared in your inventory anyway" + suffix);
		dbConnection.query(`UPDATE stats SET hasGnomeball = 1 WHERE discordID = ?`, [message.author.id]);
	}
}


function failedTackle(message, offPlayer, tackleDate) {
	tacklingLevelUp(message, offPlayer, 5);
	message.reply("you have failed to make any impact" + suffix + "\r\nTry again in 5 minutes" + suffix);
	tackleDate.setMinutes(tackleDate.getMinutes() + 5);
	offPlayer.failedTackle = tackleDate;
	dbConnection.query(`UPDATE stats SET failedTackle = ? WHERE discordID = ?`, [offPlayer.failedTackle, offPlayer.discordID]);
	extraGnomeball(message, offPlayer);
}

function conductTackle(message, offPlayer, defPlayer) {
	var offenseBuff = (Math.random()*1) + 1;
	var defenseBuff = (Math.random()*0.5) + 1.5;
	var damageDealt = (offPlayer.tacklingLevel * offenseBuff) - (defPlayer.fortitudeLevel * defenseBuff);
	var tackleDate = new Date();
	
	var availableTackle = new Date(offPlayer.failedTackle);
	
	if (availableTackle < tackleDate) {
		console.log("available tackle: " + availableTackle);
		console.log("tackle date: " + tackleDate);
		if (damageDealt > 0) {
			tackleSuccess(message, offPlayer, defPlayer, damageDealt);
		}
		else {

			failedTackle(message, offPlayer, tackleDate);

		}
	}
	else {
		var diff = Math.abs(availableTackle - tackleDate);
		var minutesLeft = Math.floor((diff/1000)/60);
		
		message.channel.send("You still have " + minutesLeft + " minutes until you can try again" + suffix);//message about tackle minutes
	}
}

function generateValues (bot, message, args) {

	dbConnection.query(`SELECT * FROM stats WHERE discordID = '${message.author.id}'`, (error, results) => {
		if(error) {
			console.log(error);
		}
		if(!results.length) {
			dbConnection.query(`INSERT INTO stats (discordID) VALUES ('${message.author.id}')`);
			console.log('New user has been registered into stats as ' + message.author.id);
		}
		else{
			console.log('user already registered in database');
		}
	});
}

function increaseYellowCards(message, offPlayer) {
	if (offPlayer.yellowCards >= 2) {
		var banDate = new Date();
		banDate.setHours(banDate.getHours() + 8);
		dbConnection.query(`UPDATE stats SET yellowCards = 0 WHERE discordID = ?`, [offPlayer.discordID]);
		message.reply("you've gotten 3 yellow cards.  The referee hands you a red card and bans you from gnomeball for 8 hours");
		dbConnection.query(`UPDATE stats SET unbanDate = ? WHERE discordID = ?`, [banDate, offPlayer.discordID]);
	}
	else {
		dbConnection.query(`UPDATE stats SET yellowCards = yellowCards + 1 WHERE discordID = ?`,[offPlayer.discordID]);
		message.reply("A referee hands you a yellow card" + suffix);
	}	
}

function attemptTackle(message, offPlayer, defPlayer) {
	var attemptedTackleDate = new Date();
	var banDate = new Date(offPlayer.unbanDate); //get unban date from offPlayer object and convert it to a proper JS date object
	
	if(banDate > attemptedTackleDate) {
		message.reply("you are currently banned from gnomeball" + suffix);
	}
	else {
		if (Number(offPlayer.userHealth) > 0) {
			if (defPlayer.discordID === message.author.id) {
				message.channel.send("You cannot tackle yourself" + suffix);
			}
			else if (defPlayer.hasGnomeball) {
				if (message.mentions.users.array()[0].status !== "offline") {
					conductTackle(message, offPlayer, defPlayer);
				}
				else {
					gnomeballChangeHands(message, offPlayer, defPlayer);
				}
			}
			else {
					message.channel.send(getNameForUser(defPlayer, message.guild) + " doesn't have the gnomeball" + suffix);
					increaseYellowCards(message, offPlayer);			
			}
		}
		else {
			message.reply("you are too tired to tackle right now" + suffix)
			message.reply("You have " + offPlayer.userHealth + "HP" + suffix);
		}
	}
}

function getTackleStats(bot, message, args){
						
	var queryLine = `SELECT * FROM stats WHERE discordID = ?`; 
	var defQueryLine = `SELECT * FROM stats WHERE discordID = ?`;
	
	dbConnection.query(queryLine, [message.author.id], function (error, results, fields) { //query for Offensive Player

		if (results.length > 0) {
			var offPlayer = {
				username:	message.author.username,
				nickname:	message.author.nickname,
				discordID: 	message.author.id,
				id:		message.author.id,
				userHealth:	results[0].userHealth,
				tacklingLevel:	results[0].tacklingLevel,
				tacklingExp:	results[0].tacklingExp,
				yellowCards:	results[0].yellowCards,
				unbanDate:	results[0].unbanDate,
				failedTackle:	results[0].failedTackle,
				hasGnomeball:	results[0].hasGnomeball
			};
		console.log("offPlayer: " + offPlayer.userHealth);
		}

		dbConnection.query(defQueryLine, [message.mentions.users.array()[0].id], function (error, results, fields) { //query for Defensive Player

			if(results.length > 0) {
			var defPlayer = {
				username:	message.mentions.users.array()[0].username,
				nickname:	message.mentions.users.array()[0].nickname,
				discordID:	message.mentions.users.array()[0].id,
				id:		message.mentions.users.array()[0].id,
				userHealth:	results[0].userHealth,
				userMaxHealth:	results[0].userMaxHealth,
				fortitudeLevel:	results[0].fortitudeLevel,
				fortitudeExp:	results[0].fortitudeExp,
				hasGnomeball:	results[0].hasGnomeball
			};

			attemptTackle(message, offPlayer, defPlayer);
			}
		});
	});
}

commands.tackle = function(bot, message, args) {
	if (message.channel.id === '814148824989171772') {
		if(message.mentions.users.size === 0) {
			message.reply("use $tackle @user to tackle" + suffix);
		}
		else {
			getTackleStats(bot, message, args);
		}
	}
	else {
		message.channel.send("Gnomeball has been restricted to <#814148824989171772>" + suffix);
	}
}

commands.pass = function(bot, message, args) {

	if (message.channel.id === '814148824989171772') {
		var passingPlayer = {
			username: message.author.username,
			nickname: message.author.nickname,
			discordID: message.author.id,
			id: message.author.id,
			hasGnomeball: false
		};
		var receivingPlayer ={
			username: message.mentions.users.array()[0].username,
			nickname: message.mentions.users.array()[0].nickname,
			discordID: message.mentions.users.array()[0].id,
			id: message.mentions.users.array()[0].id,
			hasGnomeball: false
		};
		dbConnection.query(`SELECT hasGnomeball FROM stats WHERE discordID = ?`, [passingPlayer.discordID], function (error, results, fields) {
			console.log("results: " + results);
			if(results) {
				if (results[0].hasGnomeball === 1) {
	
					if (message.mentions.users.size > 1) {
						message.channel.send("You can only pass to one person" + suffix);
					}
					else if (message.mentions.users.size === 0 || message.mentions.users.array()[0].presence.status === "offline") {
						message.channel.send(getNameForUser(message.author, message.guild) + " throws the gnomeball out into the open" + suffix +
							"\r\nA Gnomeball Referee throws it back to you and mumbles something about bug abusers" + suffix);
	
					}
					else if (message.mentions.users.array()[0].id === message.author.id) {
						message.channel.send("Don't be a ballhog" + suffix);
					}
					else if (message.mentions.users.array()[0].id=== '209166316035244033' || message.mentions.users.array()[0].id === '211522387471106048') {
						message.channel.send("Bots don't know how to play Gnomeball" + suffix);
					}
					else {
						dbConnection.query(`SELECT hasGnomeball FROM stats WHERE discordID = ?`, [receivingPlayer.discordID], function (error, results, fields) {
							if (results.length > 0) {
								receivingPlayer.discordID = message.mentions.users.array()[0].id;
								message.channel.send(getNameForUser(message.author, message.guild) + " passed the gnomeball to " +
									getNameForUser(message.mentions.users.array()[0], message.guild) + suffix);
								gnomeballChangeHands(message, receivingPlayer, passingPlayer);
							}
							else {
								message.reply(getNameForUser(message.mentions.users.array()[0], message.guild) + " is not in the database" + suffix);
							}
						});
					}
				}
				else {
					message.reply("You don't have the gnomeball" + suffix);
					console.log("Tried to pass gnomeball but didn't have it: " + results);
					console.log(results);
					console.log("results printed: " + results[0]);
				}
			}
			else {
				message.reply("You don't have the gnomeball" + suffix);
			}
	
		});
	}
	else {
		message.channel.send("Gnomeball has been restricted to <#814148824989171772>" + suffix);
	}
}

commands.valheim = function(bot, message, args) {
	message.channel.send("server name: rvheim\nserver address: pyroichiban.com:2456\nserver password: rvcord");
}

commands.fix = function(bot, message, args) {
//COMMAND RESERVED FOR DATA ERRORS	
}


commands.test = function(bot, message, args) {
//COMMAND RESERVED FOR FUNCTION TESTS
}

commands.register = function(bot, message, args) {
	var registrant = message.author.id;
	var storedUsername = message.author;
	if(args[0]) {
		dbConnection.query(queryLine, [args[0]], function (error, results, fields) {
		
		if (error) throw error; {
			console.log(error);
		}

		storedUsername = results[0].username;
		
		});
		queryLine = "UPDATE users SET discordID = ? WHERE email = ?";
		dbConnection.query(queryLine, [message.author.id, args[0]], function (error, results, fields) {
			if (error) throw error; {
				console.log(error);
			}
			message.channel.send("User registered as: " + storedUsername + suffix);
	});
	}
	else {
		message.channel.send("Please format command as \"$register \'email\' \"" + suffix);
		console.log("testing error");
	}
	
	console.log("message: " + message);
	console.log("author: " + message.author.username);
	console.log("args: " + args);

}

commands.image = function(bot, message, args) {
	if(args[0]) {
		//message.channel.send("framework successful");
		const imageQuery = args.join(' ');
		console.log("imageQuery: " + imageQuery);
		async function getImage(bot, message, imageQuery) {
			console.log("async function entered");
			const imageResults = await google.scrape(imageQuery, 1);
			console.log("image results: " + imageResults);
			if (imageResults.length >= 1){
				message.channel.send(imageResults[0].url);
				console.log("url: " + imageResults[0].url);
			}
			else {
				message.channel.send("no results found for: " + imageQuery + suffix);
			}
		};
		getImage(bot, message, imageQuery);

	}
	else{
		message.reply("You need to add a search item" + suffix);
	}
}

commands.info = function(bot, message, args) {
	var registeredName;
	var registeredEmail;

	
	var queryLine = 'SELECT * FROM users WHERE discordID = ?'; 
	dbConnection.query(queryLine, [message.author.id], function (error, results, fields) {
		
	if (error) throw error; {
			console.log(error);
	}
	console.log(results);
	message.channel.send("You are registered at pyroichiban.com as: " + "\n" + "User ID: " + results[0].id + "\n" + "Username: " + results[0].username + "\n" + "Email: " + results[0].email + suffix);
		
	});

	
	console.log("message: " + message);
	console.log("author: " + message.author.username);
	console.log("args: " + args);

}

commands.suggest = function(bot, message, args) {
	var suggestionFile 	= urlPath + '/suggestions.txt';
	
	fs.appendFile(suggestionFile, args.join(" ") + ' -' + getNameForUser(message.author, message.guild) + '\r\n', (err) => {
		if (err) throw err;
		message.channel.send("Imouto-chan has received your suggestion" + suffix);
		console.log("Imouto received a suggestion" + suffix); 
	});
}

commands.say = function(bot, message, args) {
	
	if (message.author.id === '208165377358823425') {
		
		var joinedPhrase = args.join(" ");
		var phraseLength = joinedPhrase.length;

		if (joinedPhrase.charAt(phraseLength - 1) != '?'){

		message.delete(message);
		message.channel.send(args.join(" ") + suffix);
		}
		else {

		var cutPhrase = joinedPhrase.slice(0, phraseLength -1);

		message.delete(message);
		message.channel.send(cutPhrase + ', desu ka?');
		}
	}
	/*else if (args.join(" ") === 'Imouto-chan does not talk to strangers, desu!') {
		message.channel.send('You\'re not so clever' + suffix);
	}
	else {
		message.channel.send("Imouto-chan does not talk to strangers" + suffix);
	}*/
	/*else {
		if ( args.indexOf("Pyro") > -1 || args.indexOf("pyro") || args.includes("zac") || args.includes("Zac")) {
		message.channel.send("Imouto-chan refuses" + suffix);
		}*/
	else {
			message.channel.send(args.join(" ") + suffix + "  *-" 
			+ getNameForUser(message.author, message.guild) + "*");
	}
}

commands.help = function(bot, message, args) {
	message.channel.send("You can visit http://pyroichiban.com/Imouto-chan/how-to-use.html to learn more about me" + suffix);
}

commands.gao = function(bot, message, args) {
	var phrase = 'Gao~';
	
	sayWord(bot, message, args, phrase);
}

commands.uguu = function(bot, message, args) {
	var phrase = 'Uguu~';
	
	sayWord(bot, message, args, phrase);
}

commands.kyun = function(bot, message, args) {
	var phrase = 'Kyun~';
	
	sayWord(bot, message, args, phrase);
}

commands.juice = function(bot, message, args) {
	message.channel.send({files: ["./Imouto-chan/Images/juicegif.gif"]});
}

commands.ginandjuice = function(bot, message, args) {
	message.channel.send("I can h-hold my liquor just fine..." + "\n", {
		files: ["./Imouto-chan/Images/drunkanime1.jpg"]});
}

commands.mf = function(bot, message, args) {
	message.channel.send({files: ["./Imouto-chan/Images/lastorderrage.gif"]});
}

commands.ring = function(bot, message, args) {
	message.channel.send("Kyon-kun, denwa!");
}

commands.puhi = function(bot, message, args) {
	const commandName = 'puhi';
	var filePath	  = "Botan/";
	const fileList 	  = ['Botan0.jpg', 'Botan1.jpg', 'Botan2.gif', 'Botan3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.dango = function(bot, message, args) {
	const commandName = 'dango';
	var filePath 	  = "Dango/";
	const fileList 	  = ['dango0.jpg', 'dango1.jpg', 'dango2.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.fuko = function(bot, message, args) {
	const commandName = 'fuko';
	var filePath	  = "Fuko/";
	const fileList 	  = ['fuko0.gif', 'fuko1.gif', 'fuko2.jpg', 'fuko3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.nichijou = function(bot, message, args) {
	const commandName = 'nichijou';
	var filePath	  = "Nichijou/";
	const fileList 	  = ['Nichijou0.gif', 'Nichijou1.gif', 'Nichijou2.gif', 'Nichijou3.gif', 'Nichijou4.gif', 
						 'Nichijou5.gif', 'Nichijou6.gif', 'Nichijou7.gif', 'Nichijou8.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.cry = function(bot, message, args) {
	const commandName = 'cry';
	var filePath	  = "Cry/";
	const fileList 	  = ['cry0.gif', 'cry1.jpg', 'cry2.gif', 'cry3.gif', 'cry4.gif', 'cry5.gif', 'cry6.gif',
						 'cry7.png','cry8.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.baka = function(bot, message, args) {
	const commandName = 'baka';
	var filePath 	  = "Baka/";;
	const fileList 	  = ['baka0.jpg', 'baka1.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.pet = function(bot, message, args) {
	const commandName = 'pet';
	var filePath	  = "Pet/";
	const fileList 	  = ['Pet0.gif', 'Pet1.gif', 'Pet2.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.nani = function(bot, message, args) {
	const commandName = 'nani';
	var filePath	  = "Nani/";
	const fileList 	  = ['Nani0.gif', 'Nani1.png','Nani2.gif'];
	
	message.channel.send('Nani?');
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.bored = function(bot, message, args) {
	const commandName = 'bored';
	var filePath	  = 'Bored/';
	const fileList 	  = ['Bored0.gif', 'Bored1.jpg', 'Bored2.gif', 'Bored3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.ciao = function(bot, message, args) {
	const commandName = 'ciao';
	var filePath	  = "Ciao/";
	const fileList 	  = ['ciao0.jpg','ciao1.gif','ciao2.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.shocked = function(bot, message, args) {
	const commandName = 'shocked';
	var filePath	  = "Shocked/";
	const fileList 	  = ['shocked0.jpg', 'shocked1.jpg', 'shocked2.gif', 'shocked3.png', 'shocked4.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.vuvuzela = function(bot, message, args) {
	const commandName = 'vuvuzela';
	var filePath	  = "Vuvuzela/";
	const fileList 	  = ['vuvuzela0.jpg', 'vuvuzela1.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.teehee = function(bot, message, args) {
	const commandName = 'teehee';
	var filePath	  = "Teehee/";
	const fileList 	  = ['teehee0.jpg','teehee1.gif','teehee2.gif','teehee3.jpg','teehee4.png','teehee5.png'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.smug = function(bot, message, args) {
	const commandName = 'smug';
	var filePath	  = "Smug/";
	const fileList 	  = ['smug0.jpg','smug1.jpg','smug2.jpg','smug3.jpg','smug4.jpg','smug5.png', 'smug6.jpg', 'smug7.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.pout = function(bot, message, args) {
	const commandName = 'pout';
	var filePath	  = "Pout/";
	const fileList 	  = ['pout0.png','pout1.jpg','pout2.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.hype = function(bot, message, args) {
	const commandName = 'hype';
	var filePath	  = "Hype/";
	const fileList 	  = ['hype0.gif','hype1.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.tired = function(bot, message, args) {
	const commandName = 'tired';
	var filePath	  = "Tired/";
	const fileList 	  = ['tired0.gif','tired1.gif','tired2.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.facepalm = function(bot, message, args) {
	const commandName = 'facepalm';
	var filePath	  = "Facepalm/";
	const fileList 	  = ['facepalm0.jpg','facepalm1.png','facepalm2.jpg','facepalm3.png'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.disappointed = function(bot, message, args) {
	const commandName = 'disappointed';
	var filePath	  = "Disappointed/";
	const fileList 	  = ['disappointed0.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.working = function(bot, message, args) {
	const commandName = 'working';
	var filePath	  = "Working/";
	const fileList 	  = ['working0.gif','working1.jpg','working2.jpg','working3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.classified = function(bot, message, args) {
	const commandName = 'classified';
	var filePath	  = "Classified/";
	const fileList 	  = ['classified0.jpg','classified1.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.yandere = function(bot, message, args) {
	const commandName = 'yandere';
	var filePath	  = "Yandere/";
	const fileList 	  = ['yandere0.jpg','yandere1.jpg','yandere2.jpg','yandere3.jpg','yandere4.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.rock = function(bot, message, args) {
	const commandName = 'rock';
	var filePath	  = "Rock/";
	const fileList 	  = ['rock0.gif','rock1.gif','rock2.gif','rock3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.traumatized = function(bot, message, args) {
	const commandName = 'traumatized';
	var filePath	  = "Traumatized/";
	const fileList 	  = ['traumatized0.jpg','traumatized1.gif','traumatized2.gif',
						 'traumatized3.jpg','traumatized4.jpg','traumatized5.gif'];

	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.irritated = function(bot, message, args) {
	const commandName = 'irritated';
	var filePath	  = "Irritated/";
	const fileList 	  = ['irritated0.jpg','irritated1.jpg','irritated2.png','irritated3.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.honk = function(bot, message, args) {
	const commandName = 'honk';
	var filePath	  = "Honk/";
	const fileList 	  = ['honk0.jpg','honk1.png'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.maga = function(bot, message, args) {
	const commandName = 'maga';
	var filePath	  = "MAGA/";
	const fileList 	  = ['maga0.jpg','maga1.jpg','maga2.jpg','maga3.jpg','maga4.jpg','maga5.jpg','maga6.jpg','maga7.jpg','maga8.png'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.storm = function(bot, message, args) {
	message.channel.send("Function is currently disabled" + suffix);
	/*const commandName = 'storm';
	var filePath	  = "Storm/";
	const fileList 	  = ['storm0.jpg','storm1.jpg','storm2.png','storm3.jpg','storm4.png'];
	
	getImage(bot, message, args, fileList, filePath, commandName);*/
}

commands.lewd = function(bot, message, args) {
	const commandName = 'lewd';
	var filePath	  = "Lewd/";
	const fileList 	  = ['lewd0.jpg','lewd1.jpg','lewd2.png','lewd3.png','lewd4.gif','lewd5.png','lewd6.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.b = function(bot, message, args) {
	const commandName = 'b';
	var filePath	  = "Ban/";
	const fileList 	  = ['ban0.gif'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.tuturu = function(bot, message, args) {
	const commandName = 'tuturu';
	var filePath	  = "Tuturu/";
	const fileList 	  = ['tuturu0.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.unimpressed = function(bot, message, args) {
	const commandName = 'unimpressed';
	var filePath	  = "Unimpressed/";
	const fileList 	  = ['unimpressed0.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.flex = function(bot, message, args) {
	const commandName = 'flex';
	var filePath	  = "Flex/";
	const fileList 	  = ['flex0.jpg','flex1.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.dab = function(bot, message, args) {
	const commandName = 'dab';
	var filePath	  = "Dab/";
	const fileList 	  = ['dab0.jpg'];
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

commands.tenshi = function(bot, message, args) {
	//bot.setAvatar("./Imouto-chan/Images/Avatars/Kanade.jpg"); stupid discord not allowing avatar changes anymore
	message.channel.send("Transformation complete.");
	global.personality = 1;
}

commands.neko = function(bot, message, args) {
	message.channel.send("Imouto-chan has transformed, nyaa~");
	global.personality = 2;
}

commands.stopzombie = function(bot, message, args) {
	var zombiePath		= "./Imouto-chan/Images/Zombie/";
	
	if (global.zombieActive == true) {
		message.channel.send("You have stopped the zombie threat" + suffix);
		message.channel.send({file: [zombiePath + "stopzombie0.gif"]});
		global.imoutoTimeOfDeath = commandDate.getHours();
		
		if(!global.imouto.minigames.halloween) {
			global.imouto.minigames.halloween = {};
		}
		
		if(!global.imouto.minigames.halloween.zombie) {
			global.imouto.minigames.halloween.zombie = {};
		}
		
		if(!global.imouto.minigames.halloween.zombie.zombiesKilled) {
			global.imouto.minigames.halloween.zombie.zombiesKilled = {};
		}
		
		if (!global.imouto.minigames.halloween.zombie.zombiesKilled[message.author.id]) {
		global.imouto.minigames.halloween.zombie.zombiesKilled[message.author.id] = 0;
		}
	
		global.imouto.minigames.halloween.zombie.zombiesKilled[message.author.id]++;
		global.zombieActive = false;
		global.zombieKilled = true;
		saveImouto();
	}
	else {
		message.channel.send("There are no zombies in the chat" + suffix);
	}
}

commands.unlock = function(bot, message, args) {

}


commands.hint = function(bot, message, args) {

}

commands.wallet = function(bot, message, args) {

}

commands.inventory = function(bot, message, args) {

}

commands.describe = function(bot, message, args) {
	/*var itemName = args.join(" ");
	if (!global.items[itemName]) {
		message.reply("that isn't a valid item name");
	}
	else if (global.imouto.minigames.treasure[message.author.id].inventory.indexOf(itemName) > -1) {
		message.channel.send(global.items[itemName].description);
	}
	else {
		message.reply("you don't have a " + itemName + suffix);
	}*/
}

commands.badges = function(bot, message, args) {
	var badgeList = [];
	
	if (!global.imouto[message.author.id]) {
		global.imouto[message.author.id] = {};
	}
	
	if (!global.imouto[message.author.id].badges) {
		global.imouto[message.author.id].badges = [];
	}
	
	var ownedBadges = global.imouto[message.author.id].badges;
	
	if (ownedBadges.length > 0) {
		for(var badge in ownedBadges) {
			badgeList.push(ownedBadges[badge]);
		}
		message.reply("you have earned the following badges: \r\n" + badgeList.join("\n"));
	}
	else {
		message.reply("you haven't earned any badges yet" + suffix);
	}
	
	saveImouto();
}

function getWallet(currency) {

	var walletAmount	= currency;
	var walletString	= "";
	var copperAmount	= Math.floor(walletAmount % 1000);
	var copperString	= "";
	var silverAmount	= Math.floor((walletAmount / 1000) % 1000);
	var silverString	= "";
	var goldAmount 		= Math.floor((walletAmount / 1000000) % 1000);
	var goldString		= "";
	var platinumAmount	= Math.floor(walletAmount / 1000000000);
	var platinumString	= "";

	if (platinumAmount > 0) {
		platinumString = " *" + platinumAmount + " platinum*";
	}

	if (goldAmount > 0) {
		goldString = " *" + goldAmount + " gold*";
	}

	if (silverAmount > 0) {
		silverString = " *" + silverAmount + " silver*";

	}

	if (copperAmount > 0) {
		copperString = " *" + copperAmount + " copper*";
	}
			
	walletString = platinumString + goldString + silverString + copperString;

	console.log("wallet string: " + walletString);
	return walletString;

}


commands.stats = function(bot, message, args) {
	var userHealthValue;
	var userMaxHealth;
	var tacklingValue;
	
	var queryLine = `SELECT * FROM stats WHERE discordID = ?`; 
	dbConnection.query(queryLine, [args[0]], function (error, results, fields) {
	
	if (error) throw error; {
		console.log(error);
	}

	});
	dbConnection.query(queryLine, [message.author.id], function (error, results, fields) {
		if (error) throw error; {
			console.log(error);
		}
	
		message.channel.send(getNameForUser(message.author, message.guild) + " your stats are:\r\nHealth: " + results[0].userHealth + "/" + results[0].userMaxHealth + "\r\nTackling: " +
			results[0].tacklingLevel + "/" + results[0].tacklingLevel + "\r\nPassing: " + results[0].passingLevel + "/" + results[0].passingLevel + "\r\nFortitude: " +

			results[0].fortitudeLevel + "/" + results[0].fortitudeLevel + "\r\nGardening: " + results[0].gardeningLevel + "\r\nYellow Cards: " + results[0].yellowCards + "\r\nUnban Date: " +results[0].unbanDate + "\r\nWallet: " + getWallet(results[0].currency));

		console.log(results[0]);
	});
}

commands.poll = function(bot,message,args) {
	
	var pollQuestion = "Which feature would you rather see added first?\r\n1. Breeding\r\n2. More Race Types\r\n3. Gardening";
	message.channel.send(pollQuestion);
}

commands.vote = function(bot,message,args) {
	if(!global.imouto.poll) {
		global.imouto.poll = {};
	}
	if(!global.imouto.poll[message.author.id]){
		global.imouto.poll[message.author.id] = {}
	}
	if(!global.imouto.poll[message.author.id].hasVoted) {
		global.imouto.poll[message.author.id].hasVoted = false;
	}
	if(!global.imouto.poll.options) {
		global.imouto.poll.options = {}
	}
	
	var selection = args[0]
	
	if(global.imouto.poll[message.author.id].hasVoted === false) {
		if (selection > 0 && selection < 4) {
			if(selection % 1 === 0) {
				if(!global.imouto.poll.options[selection]) {
					global.imouto.poll.options[selection] = 0;
				}
				message.reply("your vote has been registered" + suffix);
				global.imouto.poll.options[selection]++;
				global.imouto.poll[message.author.id].hasVoted = true;
			}
			else {
				message.reply("no decimals allowed" + suffix);
			}
		}
		else {
			message.reply("enter a number 1-3" + suffix);
		}
	}
	else {
		message.reply("you have already voted" + suffix);
	}
	saveImouto();
}

commands.results = function(bot,message,args) {
	if(!global.imouto.poll) {
		global.imouto.poll = {};
	}
	if(!global.imouto.poll[message.author.id]){
		global.imouto.poll[message.author.id] = {}
	}
	if(!global.imouto.poll[message.author.id].hasVoted) {
		global.imouto.poll[message.author.id].hasVoted = false;
	}
	if(!global.imouto.poll.options) {
		global.imouto.poll.options = {}
	}
	
	var optionOne = global.imouto.poll.options[1];
	var optionTwo = global.imouto.poll.options[2];
	var optionThree = global.imouto.poll.options[3];
	
	if(optionOne === undefined) {
		optionOne = 0;
	}
	if(optionTwo === undefined) {
		optionTwo = 0;
	}
	if(optionThree === undefined) {
		optionThree = 0;
	}
	var totalVotes = optionOne + optionTwo + optionThree;
	var percentOne = Math.floor((optionOne/totalVotes)*100);
	var percentTwo = Math.floor((optionTwo/totalVotes)*100);;
	var percentThree = Math.floor((optionThree/totalVotes)*100);;
	
	message.channel.send("The current results are:\r\n1. Breeding " + optionOne + " " + percentOne +
		"%\r\n2. More Race Types " + optionTwo + " " + percentTwo + "%\r\n3. Gardening " + optionThree + " " + percentThree + "%");
	
}

commands.role = function(bot,message,args) {
	
	//check to see if user has role
	console.log(args);
	for (roleName in args) {
		if (message.guild.roles.cache.find(role => role.name === args[roleName].toLowerCase())) {
			var roleID = message.guild.roles.cache.find(role => role.name === args[roleName].toLowerCase());
			
			if (message.member.roles.cache.find(role => role.name === args[roleName].toLowerCase())) {
				message.member.roles.remove(roleID);
				console.log("had role and removed: " + roleID);
			}
			else {
				message.member.roles.add(roleID);
				//console.log("did not have role and added " + roleID);
				//console.log("else line returned because has(roleID): " + message.member.roles.cache.has(roleID));
				//console.log(".find = " + message.member.roles.cache.find(role => role.name === args[roleName]));
			}
		}
		else {
			message.channel.send(args[roleName].toLowerCase() + " is not a proper role name" + suffix);
		}
	}
}

commands.wakarimasen = function(bot,message,args) {
	message.channel.send("Watashi wa dochira ka wakarimasen" + suffix);
}

module.exports = commands;
>>>>>>> aa033f19fcc92bfe6d789c900204e37d2369944f
