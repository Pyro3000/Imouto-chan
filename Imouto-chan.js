const Discord = require('discord.js');
const bot = new Discord.Client({autoReconnect:true});
var fs = require('fs');

var date = new Date();

var mysql 			= 	require('mysql');
var dbLogin			= 	require('./dbLogin.json');
var dbConnection 	= 	mysql.createConnection(dbLogin);

var imoutoFilePath		=	"./Imouto-chan/imouto.json";
var imoutoCommands 		= 	require("./commands");
var tenshiCommands 		= 	require("./tenshi");
var nekoCommands 		= 	require("./neko");
var mafiaCommands		=	require("./mafia");
var auctionCommands 		=	require("./auction");
var petCommands			=	require("./pet");
var commandPrefix 		= 	"$";
var userRoles 			= 	require("./roles.json");
var hasRights;
var livingTheDream 		= 	true;
var LoginToken			= 	require("./token.json");
personality 		= 	0;
var suffix 			= 	', desu!';
imouto				=	{};
items				= 	require('./items.json');
var imageFilePath		=	"./Imouto-chan/Images/";
var nobodyCares		=	"nobodycares.jpg";
var payingAttention =   false;

/*dbConnection.connect();
dbConnection.query('SELECT * FROM users', function (error, results, fields) {
	if (error) throw error;
	console.log(results);
});*/

zombieKilled		=	 true;
zombieActive 		=	 false;
zombieTimeOfDeath	 =	 24;

dragonBallList = ["One Star Dragon Ball","Two Star Dragon Ball", "Three Star Dragon Ball",
	"Four Star Dragon Ball", "Five Star Dragon Ball","Six Star Dragon Ball",
	"Seven Star Dragon Ball"];
triforceList = ["Triforce of Power","Triforce of Wisdom","Triforce of Courage"];
partyhatList = ["White partyhat","Blue partyhat","Red partyhat","Green partyhat","Yellow partyhat","Purple partyhat"];
theBossList = ["The Boss' Patriot","The Boss' Sneaking Suit"];
collectibleMaskList = ["Great Fairy's Mask","Kafei's Mask","Bremen Mask","Kamaro's Mask","Blast Mask","Bunny Hood","Keaton Mask","Postman's Hat","Mask of Truth","Mask of Scents","Don Gero's Mask",
	"Romani's Mask","Garo's Mask","Captain's Hat","Stone Mask","Troupe Leader's Mask","All-Night Mask","Gibdo Mask",
	"Couple's Mask", "Giant's Mask"];

	/*imouto.loot.push("Great Fairy's Mask","Kafei's Mask","Bremen Mask","Kamaro's Mask","Blast Mask","Bunny Hood","Keaton Mask","Postman's Hat","Mask of Truth","Mask of Scents","Don Gero's Mask",
	"Romani's Mask","Garo's Mask","Captain's Hat","Stone Mask","Troupe Leader's Mask","All-Night Mask","Gibdo Mask",
	"Couple's Mask", "Giant's Mask");
	imouto.goldLoot.push("Triforce of Power","Triforce of Wisdom","Triforce of Courage","The Boss' Patriot","The Boss' Sneaking Suit","White partyhat","Blue partyhat","Red partyhat","Green partyhat","Yellow partyhat","Purple partyhat");
	*/

eventParticipants = [];

petEggs = ["alluring egg","slimey egg","scaley egg","stone egg","metal egg","rainbow egg"];
seeds = ["potato seed","corn seed"];

function determineSuffix() {
	switch(personality) {
		case 0:
			suffix = ', desu!';
			break;
		case 1:
			suffix = '.';
			break;
		case 2:
			suffix = ', nyaa!';
			break;
		default:
			suffix =', desu!';
			console.log('ERROR: default suffix used' + suffix);
	}
}

function getNameForUser(user, guild) {
  if (guild !== null && guild.members.find("id", user.id).nickname) {
    return guild.members.find("id", user.id).nickname;
  }
  return user.username;
}

function automaticTackle(message, offPlayer, defPlayer) {
	message.reply("you have stolen the gnomeball" + suffix);
	global.imouto.gnomeball = offPlayer.id;

}
//test
function checkPriv(message) {
	//NEEDS TO CHECK USER LEVEL IN DATABASE
	console.log(message);
	//if (userRoles.hasOwnProperty(sender)) {
	if (message.member.roles.cache.some(r => r.name === "ADMINISTRATOR")) {
		hasRights = true;
	} else {
		hasRights = false;
	}
}

function loadImouto() {
	//NEEDS TO PULL DATA FROM DATABASE INSTEAD OF JSON
	//POTENTIALLY KEEP FOR SMALL JSON
	//MAY NEED REWORKED TO PASS VARIABLE NAMES
  fs.readFile(
      imoutoFilePath,
      function(err, data) {
        if (err) {
          console.log(imoutoFilePath + " not found; ignoring" + suffix);
        } else {
          imouto = JSON.parse(data);
	//console.log(imouto);
        }
      });
}

function saveImouto() {
	//WILL WRITE DATA TO DATABASE
	//console.log("in saveWallet: " + wallet["money"]);
  fs.writeFileSync(
      imoutoFilePath,
      JSON.stringify(imouto, null, 2));
}


/*function trollZnath(message) {

	console.log("entered trollZnath");
	console.log(messagesCount);
	
	if (messagesCount < 7) {
		console.log("entered trollZnath()");
		global.messagesCount++;
		console.log(messagesCount);
	}
	else if (messagesCount >= 7) {
		console.log('Znath Triggered');
		message.channel.send('How very interesting' + suffix);
		message.channel.sendFile(imageFilePath + nobodyCares);
		global.messagesCount = 0;
	}
}*/

function checkFertilizer(message) {
/*	var currentDate = new Date();
	var oldDate = new Date(imouto.minigames.gardening[message.author.id].fertilizerDate);
	var fertilizerActive = imouto.minigames.gardening[message.author.id].fertilizerUsed;
	
	if(oldDate <= currentDate && fertilizerActive === true) {
		message.reply("your fertilizer has worn off" + suffix);
		imouto.minigames.gardening[message.author.id].fertilizerUsed = false;
	}
}

function summonZombie(message) {

	message.channel.send('Much to Jackstick\'s dismay, a zombie has appeared' + suffix);
	message.channel.send({file: [imageFilePath + 'Zombie/zombie0.gif']});
	

*/}

function handleCommand(message) {
	
	determineSuffix();
	// Easy access to message author
	var sender = message.author; 
	
	// Easy access to text of the message
	var content = message.content.trim(); 
		
	// Split up the text of the message by " "  
	var parts = content.split(" ");
	
	// Get rid of the first part (the command name)
	var args = parts.slice(1, parts.length); 
	
	// Take the first part (the command name)
	var commandWord = parts[0].replace(commandPrefix, ""); 
	
	var command = commandWord.toLowerCase();
	
	var commandDate = new Date();
	
	var messageMonth = commandDate.getMonth();
	var messageDate = commandDate.getDate();
	
	console.log(command + " command was used by " + sender.username + " with '"+ content +"'" + suffix);
	
	
	if (message.channel.id === '238089575292076032') {
		//SEE IF BETTER WAY TO  WORK ALTERNATE CHANNELS
		if(auctionCommands[command] !== undefined) {
			auctionCommands[command](bot, message, args);
		} else {
			message.reply("That's not a valid command" + suffix);
		}
	}
	else if (message.channel.id === '238089685782626304') {
		if(petCommands[command] !== undefined) {
			petCommands[command](bot, message, args);
		} else {
			message.reply("That's not a valid command" + suffix);
		}
	}
	else if (command === 'awaken') {
		checkPriv(message); //enables Pyro3000, Jaron, and Topsummoner to disable/enable bot
		if (hasRights = true) {
			livingTheDream = true;
			message.channel.send("*stretches and gives a warm smile*");
			console.log("Imouto-chan has been enabled" + suffix);
		} else { console.log("check failed"); }
	}
	else if (command === 'sleep') {
		checkPriv(message);
		if (hasRights = true) {
			livingTheDream = false;
			message.channel.send("Imouto-chan will take a quiet rest now, desu.");
			console.log("Imouto-chan has been disabled" + suffix);
		} else { console.log("check failed"); }
	}
	else if(messageMonth === 9 && messageDate === 13 && command !== 'stopzombie' && command !== 'inventory' && command !== 'wallet') {
		imoutoCommands['traumatized'](bot, message, args);
	}
	else if (!isNaN(command) && command > 0) {
		//UPDATE AND TEST
		var stolenGoods = parseInt(command);
		console.log(command);
		var diceRoll = Math.floor(Math.random() * 99);
		var previousBalance;
		
		if (diceRoll < 20) {
			
			console.log("previous balance altered: " + imouto["money"]);
			imouto["money"] += stolenGoods;
			message.channel.send("Thank you for your donation" + suffix + "  " +
			"$" + stolenGoods + " has been added to my account" + suffix);
			console.log("in main block " + imouto["money"]);
			saveImouto();
		}
	}
	else if (this.personality === 0 && livingTheDream === true) {
		console.log('personality and dream meet requirements');
		if(imoutoCommands[command] !== undefined) {
			// Run the command
			console.log('command should run normally');
			imoutoCommands[command](bot, message, args);
		} else {
			// The command doesn't exist!
			message.reply("wakarimasen!");
			
			var diceRoll = Math.floor(Math.random() * 99);
		
			if (diceRoll < 21) {
				message.channel.send({file: ["./Imouto-chan/Images/wakarimasen0.gif"]});
			}
		}
	}

	//DETERMINE IF ALT PERSONAS STILL NECESSARY
	else if (this.personality === 1 && livingTheDream === true) {
		if(tenshiCommands[command] !== undefined) {
			// Run the command
			tenshiCommands[command](bot, message, args);
		} else {
			// The command doesn't exist!
			message.reply("Imouto-chan does not understand.");
		}	
	}
	else if (this.personality === 2 && livingTheDream === true) {
		if(nekoCommands[command] !== undefined) {
			// Run the command
			nekoCommands[command](bot, message, args);
		} else {
			// The command doesn't exist!
			message.reply("nyaa?");
		}	
	}
		else if (this.personality === 3 && livingTheDream === true) {
		if(mafiaCommands[command] !== undefined) {
			// Run the command
			mafiaCommands[command](bot, message, args);
		} else {
			// The command doesn't exist!
			message.reply(message, "Invalid Command");
		}	
	}
	else{
		console.log('no requirements being met');
	}
}

function healUser(message) {	
	//UPDDATED BUT NEEDS TESTED
	var currentTime = new Date();
	dbConnection.query(`SELECT * FROM stats WHERE discordID = ?`, [message.author.id], (error, results) => {
		if(error) {
			console.log("ERROR in healUser");
		}
		var healingTime = new Date(results[0].healDate);
		var userHP = results[0].userHealth;
		var userMaxHP = results[0].userMaxHealth;
		
		if(userMaxHP > userHP) {
			if(currentTime > healingTime) {
				var diff = Math.abs(Number(healingTime) - Number(currentTime));

				var minDiff = Math.floor((diff/1000)/60);
				
				userHP += (minDiff * (userMaxHP/10));
				
				if(userHP > userMaxHP) {
					userHP = userMaxHP;
				}
				
				console.log("Healing " + message.author.username);
				dbConnection.query(`UPDATE stats SET userHealth = ? WHERE discordID = ?`, [userHP, message.author.id]);
			}
			else {
				console.log("time constraints not met for " + message.author.username);
			}
		}
		else {
			console.log("HP comparison not met for " + message.author.username);
			console.log("userHP: " + userHP + " userMaxHP " + userMaxHP);
		}
	});
}

function generateValues(message) {
	// -DETERMINE WHAT MUST GO IN NEW DATABASE AND DELETE ENTIRETY OR MAJORITY OF FUNCTION


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

function gardeningLevelUp(message, plantExp) {
/*	//UPDATE TO WORK WITH DATABASE
	var skillExp = Number(global.imouto.minigames.gnomeball[message.author.id].stats.gardeningExp) + plantExp;
	var originalLevel = Number(global.imouto.minigames.gnomeball[message.author.id].stats.gardeningLevel);
	var skillLevel = Number(global.imouto.minigames.gnomeball[message.author.id].stats.gardeningLevel);
	var expRequired = (skillLevel) * 100;
	
	if (skillLevel < 99) {
		while (skillExp > expRequired) {
			skillExp -= expRequired;
			skillLevel++;
		}
	}
	
	if (skillLevel > originalLevel) {
		message.channel.send("You are now level " + skillLevel + " gardening" + suffix);
	}
	
	if (skillLevel >= 99) {
		global.imouto.minigames.gardening[message.author.id].landPlots = 5;
	}
	else if (skillLevel >= 75) {
		global.imouto.minigames.gardening[message.author.id].landPlots = 4;
	}
	else if (skillLevel >= 50) {
		global.imouto.minigames.gardening[message.author.id].landPlots = 3;
	}
	else if (skillLevel >= 25) {
		global.imouto.minigames.gardening[message.author.id].landPlots = 2;
	}
	else {
		global.imouto.minigames.gardening[message.author.id].landPlots = 1;
	}
	
	
	global.imouto.minigames.gnomeball[message.author.id].stats.gardeningLevel = skillLevel;
	global.imouto.minigames.gnomeball[message.author.id].stats.gardeningExp = skillExp;
	
	saveImouto();
*/}

function generatePlant(message, currentSeed) {
/*	//REWRITE AND SIMPLIFY
	var plantObject = {"potato seed": "potato","corn seed": "corn"};
	//[seedName, seedTypes[seedName].maxProduce, seedTypes[seedName].expValue, growingTime]
	var plantProduce = items[currentSeed[0]].product;
	var plantYield = Math.ceil(Math.random() * items[currentSeed[0]].maxYield);
	var plantExp = items[currentSeed[0]].expGain;
	var usedPlots = imouto.minigames.gardening[message.author.id].usedPlots;
	plantExp = plantExp * plantYield;
	
	if(imouto.minigames.gardening[message.author.id].fertilizerUsed === true) {
		plantYield = items[currentSeed[0]].maxYield;
    plantExp = plantExp * plantYield; // recalculate exp after max-yielding it
		plantExp += 10;
	}

	//message.reply("your " +  currentSeed[0] + " has finished growing and given off " + plantYield + " items" + suffix);
  // Say in pet-garden instead:
  bot
      .channels.cache.get("238089685782626304")
      .send("<@" + message.author.id + ">, your " + currentSeed[0] + " has finished growing and given off " + plantYield + " items" + suffix);
	
	usedPlots--;
	imouto.minigames.gardening[message.author.id].usedPlots = usedPlots;
	for(i = 0; i < plantYield; i++) {
		imouto.minigames.treasure[message.author.id].inventory.push(plantProduce);
	}
	gardeningLevelUp(message, plantExp);
*/}

function growSeed(message) {
	//REWORK TO WORK WITH DATABASE AND WEBSITE
/*	for(seed in imouto.minigames.gardening[message.author.id].plantedSeeds) {
		var plantedSeeds = imouto.minigames.gardening[message.author.id].plantedSeeds;
		var currentSeed = plantedSeeds[seed];
		var growDate = new Date(plantedSeeds[seed][1]);
		var growAttemptDate = new Date();
		
		if(growAttemptDate > growDate) {
			generatePlant(message, currentSeed);
			imouto.minigames.gardening[message.author.id].plantedSeeds.splice(seed, 1);
		}
	}*/
}

function generatePet(message) {
	/*POTENTIAL FINE?
	//"petBirthday": null,"petName": null,"petType":null,"petStats":{"age":0, "affection":0,"gender":null,"stamina":0,"power":0,"speed":0,"intelligence":0}}}};
	var eggHatched = imouto.minigames.pets[message.author.id].incubator;
	var petSpecies = {"alluring egg":"succubus","slimey egg":"slime","scaley egg":"lamia","stone egg":"golem","metal egg":"dullahan","rainbow egg":"unicorn"}
	var newPetStats = {"succubus": {"stats": {"age":0, "affection":0,"gender":"female","stamina":3,"power":1,"speed":2,"intelligence":4}},
		"slime": {"stats": {"age":0, "affection":0,"gender":"neutral","stamina":4,"power":2,"speed":2,"intelligence":2}},
		"lamia": {"stats": {"age":0, "affection":0,"gender":"female","stamina":2,"power":3,"speed":2,"intelligence":3}},
		"golem": {"stats": {"age":0, "affection":0,"gender":"male","stamina":4,"power":4,"speed":1,"intelligence":1}},
		"dullahan": {"stats": {"age":0, "affection":0,"gender":"male","stamina":3,"power":3,"speed":1,"intelligence":3}},
		"unicorn": {"stats": {"age":0, "affection":0,"gender":"male","stamina":2,"power":2,"speed":3,"intelligence":3}}}

	message.reply("your " +  eggHatched + " has hatched into a " + petSpecies[eggHatched] + suffix);
	//SECTION NEEDS REWORKED FOR DATABASE
	imouto.minigames.pets[message.author.id].pet.activePet.petBirthday = new Date();
	imouto.minigames.pets[message.author.id].pet.activePet.petType = petSpecies[eggHatched];
	imouto.minigames.pets[message.author.id].pet.activePet.petStats.gender = newPetStats[petSpecies[eggHatched]].stats.gender;
	imouto.minigames.pets[message.author.id].pet.activePet.petStats.stamina = newPetStats[petSpecies[eggHatched]].stats.stamina;
	imouto.minigames.pets[message.author.id].pet.activePet.petStats.power = newPetStats[petSpecies[eggHatched]].stats.power;
	imouto.minigames.pets[message.author.id].pet.activePet.petStats.speed = newPetStats[petSpecies[eggHatched]].stats.speed;
	imouto.minigames.pets[message.author.id].pet.activePet.petStats.intelligence = newPetStats[petSpecies[eggHatched]].stats.intelligence;
	imouto.minigames.pets[message.author.id].incubator = null;
	imouto.minigames.pets[message.author.id].hasPet = true;
	imouto.minigames.pets[message.author.id].pet.activePet.petStats.affection = 0;
	imouto.minigames.pets[message.author.id].pet.activePet.skillUpAvailable = 30;
	imouto.minigames.pets[message.author.id].pet.activePet.petName = null;
	
	saveImouto();*/
}

function hatchPet(message) {
	/*REVIEW
	var hatchDate = new Date(imouto.minigames.pets[message.author.id].hatchDate);
	var hatchAttemptDate = new Date();
	
	if(hatchAttemptDate > hatchDate) {
		generatePet(message);
	}
	else {
		console.log(message.author.username + " egg not ready to hatch yet");
	}*/
}

function fieldRace(bot, message, eventParticipants) {
	//POTENTIALL DROPPED
	/*bot.channels.cache.get("238089685782626304").send("The field race has begun" + suffix);
	imouto.minigames.pets.eventActive = true;
	
	var raceDate = new Date();
	
	winnerPlaces = []
	function raceTimeout(raceUser, raceTimer, place, nickname) {
		setTimeout(function() {
			bot.channels.cache.get("238089685782626304").send("User: " + nickname + " has finished the race at Place: " + place);}, raceTimer);
		winnerPlaces.push(raceUser);
	}

	console.log(eventParticipants);
	
	raceTimes =[]
	
	for(pet in eventParticipants.sort()) {
		var distance = 990;
		var id = eventParticipants[pet][0];
		var time = Math.ceil(distance/eventParticipants[pet][3]);
		var nickname = eventParticipants[pet][1];
		raceTimes.push([time, id, nickname]);
	}

	console.log(raceTimes);
	
	for(pet in raceTimes.sort()) {
		var raceTimer = raceTimes[pet][0] * 1000;
		var raceUser = raceTimes[pet][1];
		var nickname = raceTimes[pet][2];
		
		raceTimeout(raceUser, raceTimer, Number(pet) + 1, nickname);
		
		console.log("raceTimer: " + raceTimer);
		console.log("raceUser: " + raceUser);
	}
	
	imouto.minigames.pets.eventActive = false;
	imouto.minigames.pets.eventDate = raceDate.setHours(raceDate.getHours()+5);
	
	console.log(winnerPlaces);*/
}

function puzzleChallenge(bot, message, eventParticipants) {
	
}

function mountainClimb(bot, message, eventParticipants) {
	
}

function chooseEvent(bot, message, eventParticipants) {
/*	//REVIEW
	eventParticipants = [];
	//[userID, power, speed, intelligence, stamina]
	
	for (pet in imouto.minigames.pets.eventParticipants) {
		eventParticipants.push(imouto.minigames.pets.eventParticipants[pet]);
	}
	
	global.imouto.minigames.pets.eventParticipants = [];
	
	var eventNumber = Math.ceil(Math.random()*1);
	
	switch(eventNumber) {
		case 1: fieldRace(bot, message, eventParticipants);
				break;
		case 2: puzzleChallenge(bot, message, eventParticipants);
				break;
		case 3: mountainClimb(bot, message, eventParticipants);
				break;
	}
	
	saveImouto();
*/	
}
bot.on("ready",	function() {
		if(!payingAttention) {
		bot.channels.cache.get("238089685782626304").send("Imouto is booting up again" + suffix);
		payingAttention = true;
	}
});

bot.on('message', function(message) {
	if(!imouto.isLoaded) {
		console.log("Imouto is still loading, desu!");
	}
	else {
		generateValues(message);
		healUser(message);
		
		var botDateObject = new Date();
		
		var currentMonth = botDateObject.getMonth();
		var currentDate = botDateObject.getDate();;
		
		
		
		determineSuffix();
		
		/*switch(message.author.id) {
			case '210613844513390592' : trollZnath(message);
				console.log('Znath has made ' + messagesCount +
				' messages in a row' + suffix);
				break;
			default: messagesCount = 0;
				break;
		}*/

		if(message.content.startsWith(commandPrefix) && !message.author.bot) {

			console.log('handleCommand entered: ' + message);
			handleCommand(message);
			
		}
		else if (message.mentions.has(bot.user) && message.author.id !== "211522387471106048" && currentMonth === 9 && currentDate === 13) {
			message.channel.send("Please... no... I don't want to remember...");
		}
		else if (message.mentions.has(bot.user) && message.author.id !== "211522387471106048" && message.author.id !=="209166316035244033") {
			message.reply("hello" + suffix + " \r\n \r\n" +
			"You can leave a suggestion by using $suggest <suggestion> in order " +
			"to leave a suggestion to Pyro3000 if he is offline or at work and " +
			"unable to immediately implement it" + suffix);// + " \r\n \r\n" +
			//"New image commands: \r\n \r\n $classified and $rock" + suffix + " \r\n \r\n" +
			//"New minigame added: Treasure.  Use $wallet to see how much you've earned! \r\n \r\n" +
			//"Temporary Command: $stopzombie has been activated.  Beware the undead.");
		}
		
		
		if (message.channel.id == 208498021078401025 && currentMonth == 9) {
			console.log('zombie path entered');
			
			var zombieCheck = Math.ceil(Math.random()*(310 - botDateObject.getDate()*10 + 1));
			var zombieHours = botDateObject.getHours();
			var zombieTime = date.getDate()*10;
			
			
			console.log(zombieCheck);
			
			if (zombieCheck === 1 && zombieKilled === false) {
				summonZombie(message);
				zombieActive = true;
				console.log('Zombie summoned!');
				zombieKilled = true;
				zombieTimeOfDeath = zombieHours;
			}
			else if (zombieKilled == true && zombieTimeOfDeath != zombieHours) {
				console.log('Zombie ready to respawn');
				zombieKilled = false;
			}
		}
		//REVIEW ALL BELOW CODE		
		console.log("Month: " +currentMonth);
		console.log("Date: " + currentDate);
		
		var eventDate = new Date(imouto.minigames.pets.eventDate);
		var messageDate = new Date();
		var eventActive = imouto.minigames.pets.eventActive;
		
		if(eventActive === false && eventDate < messageDate) {
			chooseEvent(bot, message);
		}
		
		/*if(imouto.minigames.pets[message.author.id].hasPet === false && imouto.minigames.pets[message.author.id].incubator !== null) {
			hatchPet(message);
		}*/ //COMMENTED TO MAKE IMOUTO RUN
		
		growSeed(message);
		checkFertilizer(message);
		
		console.log("eventDate: " + eventDate);
		console.log(eventActive);
		console.log("currentDate: " + currentDate);
		console.log("messageDate: " + messageDate);
	}

});

loadImouto();
bot.login(LoginToken.token);
console.log("Imouto-chan is online and running on " + process.cwd() + suffix);

