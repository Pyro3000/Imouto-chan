var mafia = {};
var fs = require('fs');

var jailedPlayer;
var targetedPlayer;
var protectedPlayer;
var trackedPlayer;
var investigatedPlayer;
var killTarget;
var bulletproofPlayer;
var roleblockedPlayer;

var roleblockerName;
var jailerName;
var doctorName;
var detectiveName;
var bulletproofName;
var trackerName;

var attackerName = null;

var doctorAction = "did nothing.";
var mafiaAction = "did nothing.";

function disableRole(role) {
	if (role === roleblockerName) {
		global.roleblockerExists = false;
		roleblockerName = null;
	}
	else if (role === jailerName) {
		global.jailerExists = false;
		jailerName = null;
	}
	else if (role === doctorName) {
		global.doctorExists = false;
		doctorName = null;
	}
	else if (role === detectiveName) {
		global.detectiveExists = false;
		detectiveName = null;
	}
	else if (role === trackerName) {
		global.trackerExists = false;
		trackerName = null;
	}
	else {
		console.log("Victim had no special role");
	}
}

function assignVillagers(message) {
	
	while (global.players.length > 0 ) {
		global.villagers.push(global.players[0]);
		global.players.splice(0, 1);
	}
	
	startGame(message);
}

function startGame(message) {
	message.channel.send("Game has begun.  Please use $role in PM");
	global.gameStarted = true;
}

function assignRoles(message) {
	
	if (global.players.length === 9) {
		assignMatrix6Roles(message);
	}
	else if (global.players.length >= 7 && global.players.length < 9) {
		roleblockerExists = true;
		setPie7Roles(message);
		setMafia(message);
	}
	else if (global.players.length <= 5 && global.players.length > 0){
		
		var chosenMafia = Math.floor(Math.random()*players.length);
		console.log(chosenMafia);
		global.mafiaPlayer1 = global.players[chosenMafia];
		global.mafiaScum.push(global.players[chosenMafia]);
		global.players.splice(chosenMafia, 1);

		assignVillagers(message);
		}
	else {
		message.channel.send("Invalid Player Ammount.  Maximum game size is currently 10." +
			"  Some players will have to sit out.");
		
	}
}

function setMafia(message) {
	console.log("SetMafia() leads to setExtraMafia()");
	var chosenMafia = Math.floor(Math.random()*players.length);
	console.log(chosenMafia);
	global.mafiaPlayer1 = global.players[chosenMafia];
	global.mafiaScum.push(global.players[chosenMafia]);
	global.players.splice(chosenMafia, 1);

	
	setExtraMafia(message);
	
}

function setPie7Roles(message) {
	detectiveExists = true;
	doctorExists = true;
	roleblockerExists = true;
	setMafia(message);
}
	

function setJailer(message) {
	console.log("setJailer() leads to setDetective()");
	if (global.jailerExists === true) {
		var jailerPick = Math.floor(Math.random()*players.length);
		
		jailerName = global.players[jailerPick];
		global.villagers.push(global.players[jailerPick]);
		global.players.splice(jailerPick, 1);
		
		
		setDetective(message);
		
	}
	else {
		
		setDetective(message);
	
	}
}

function setDetective(message) {
	console.log("setDetective leads to setDoctor");
	if (global.detectiveExists === true) {
		var detectivePick = Math.floor(Math.random()*players.length);
	
		detectiveName = global.players[detectivePick];
		global.villagers.push(global.players[detectivePick]);
		global.players.splice(detectivePick, 1);
		
		
		setDoctor(message);
		
	}
	else {
		
		setDoctor(message);
		
	}
}

function setDoctor(message) {
	console.log("setDoctor leads to setTracker");
	if (global.doctorExists === true) {
		var doctorPick = Math.floor(Math.random()*players.length);
	
		doctorName = global.players[doctorPick];
		global.villagers.push(global.players[doctorPick]);
		global.players.splice(doctorPick, 1);
		
		
			setTracker(message);
		
	}
	else {
		
			setTracker(message);
		
	}
}

function setTracker(message) {
	console.log("setTracker leads to setBulletproof");
	if (global.trackerExists === true) {
		var trackerPick = Math.floor(Math.random()*players.length);
	
		trackerName = global.players[trackerPick];
		global.villagers.push(global.players[trackerPick]);
		global.players.splice(trackerPick, 1);
		
		
			setBulletproof(message);
		
	}
	else {
		
			setBulletproof(message);
		
	}
}

function setBulletproof(message) {
	console.log("setBulletproof leads to setRoleblocker");
	if (global.bulletproofExists === true) {
		var bulletproofPick = Math.floor(Math.random()*players.length);
	
		bulletproofName = global.players[bulletproofPick];
		bulletproofPlayer = global.players[bulletproofPick];
		global.villagers.push(global.players[bulletproofPick]);
		global.players.splice(bulletproofPick, 1);
		
		
			setRoleblocker(message);
		
	}
	else {
		
			setRoleblocker(message);
		
	}
}

function setRoleblocker(message) {
	console.log("setRoleblocker leads to assignVillagers");
	if (global.roleblockerExists === true) {
		roleblockerName = global.mafiaPlayer2;
		
			assignVillagers(message);
		
	}
	else {
		
			assignVillagers(message);
		
	}
}

function setExtraMafia(message) {
	console.log("setExtraMafia() leads to setJailer");
	var chosenMafia = Math.floor(Math.random()*players.length);
	console.log(chosenMafia);
	global.mafiaPlayer2 = global.players[chosenMafia];
	global.mafiaScum.push(global.players[chosenMafia]);
	global.players.splice(chosenMafia, 1);
	
	setJailer(message);
}

function assignMatrix6Roles(message) {
	
	var gametype = Math.ceil(Math.random()*6);
	
	if (gametype === 1) {
		global.jailerExists = true;
	}
	else if (gametype === 2) {
		global.roleblockerExists = true;
		global.detectiveExists = true;
		global.doctorExists = true;
	}
	else if (gametype === 3) {
		global.bulletproofExists = true;
		global.trackerExists = true;
	}
	else if (gametype === 4) {
		global.bullerproofExists = true;
		global.jailerExists = true;
	}
	else if (gametype === 5) {
		global.detectiveExists = true;
	}
	else if (gametype === 6) {
		global.doctorExists = true;
		global.trackerExists = true;
	}
	
	setMafia(message);
	
}

function investigatePlayer() {
	if (global.villagers.indexOf(args) > -1 || doctorName === args || jailerName === args || trackerName === args) {
		message.channel.send(args + " is villager.");
	}
	else if (global.mafiaScum.indexOf(args) > -1) {
		message.channel.send(args + " is mafia.");
	}
	else {
		message.channel.send("Not a valid player.  Player usernames are case sensitive " +
			"and may not be the same as their channel nickname.");
	}
}

function trackEvent(message) {
	if (trackedPlayer === doctorName) {
		message.channel.send(doctorsAction);
	}
	else if (trackedPlayer === attackerName) {
		message.channel.send(mafiaAction);
	}
	else {
		message.channel.send(trackedPlayer + " did nothing.");
	}
		
}

function getRole(roleOwner) {
	
	if (roleOwner === roleblockerName) {
		return "Mafia Roleblocker";
	}
	else if (roleOwner === global.mafiaPlayer1 || roleOwner === global.mafiaPlayer2) {
		return "Mafia Goon";
	}
	else if (roleOwner === jailerName) {
		return "Jailkeeper";
	}
	else if (roleOwner === doctorName) {
		return "Doctor";
	}
	else if (roleOwner === detectiveName) {
		return "Detective";
	}
	else if (roleOwner === bulletproofName) {
		return "Bulletproof Villager";
	}
	else if (roleOwner === trackerName) {
		return "Village Tracker";
	}
	else {
		return "Villager";
	}
	
}

function concludeDay(bot) {
	
	if (killTarget === jailedPlayer) {
		bot.channels.get("209076220971712512").send("No one has died");
	}
	else if (killTarget === protectedPlayer) {
		bot.channels.get("209076220971712512").send(protectedPlayer +
			" was attacked but has been stitched back together");
	}
	else if (killTarget === bulletproofPlayer) {
		bot.channels.get("209076220971712512").send(bulletproofPlayer + " was shot, but survived!  " +
			"Unfortunately their bulletproof vest seems to have broken");
		bulletproofPlayer = null;
	}
	else {
		bot.channels.get("209076220971712512").send(killTarget + " the " + getRole(killTarget) + " has died");
		global.villagers.splice(killTarget, 1);
		disableRole(killTarget);
	}
	
	doctorAction = "did nothing.";
	mafiaAction = "did nothing.";
	attackerName = null;
	
	global.dayPhase = 0;
}

mafia.investigate = function(bot, message, args) {
	
	if (detectiveName === message.author.username) {
		if (global.dayPhase === 3) {
			if (roleblockedPlayer != detectiveName && jailedPlayer != detectiveName) {
				if (global.villagers.indexOf(args) > -1 || global.mafiaScum.indexOf(args) > -1) {
					if (message.author.username != args) {
						investigatedPlayer = args;
						global.dayPhase++;
					}
					else {
						message.channel.send("You cannot target yourself");
					}
				}
				else {
				message.channel.send("Invalid player username");
				}
			}
			else {
				message.channel.send("You have been roleblocked!");
			}
		}
		else {
			message.channel.send("You can only investigate at night!");
		}
	}
	else {
		message.channel.send("You are not the detective!");
	}
}

mafia.protect = function(bot, message, args) {

	if (doctorName === message.author.username) {
		if (global.dayPhase === 4) {
			if (roleblockedPlayer != doctorName && jailedPlayer != doctorName) {
				if (global.villagers.indexOf(args) > -1 || global.mafiaScum.indexOf(args) > -1) {
					if (message.author.username != args) {
						protectedPlayer = args;
						doctorAction = doctorName + " visited " + protectedPlayer;
						global.dayPhase++;
					}
					else {
						message.channel.send("You cannot target yourself");
					}
				}
				else {
				message.channel.send("Invalid player username");
				}
			}
			else {
				message.channel.send("You have been roleblocked!");
			}
		}
		else {
			message.channel.send("You can only protect at night!");
		}
	}
	else {
		message.channel.send("You are not the doctor!");
	}
}

mafia.jail = function(bot, message, args) {
	
	if (jailerName === message.author.username) {
		if (global.dayPhase === 2) {
			if (roleblockedPlayer != jailerName) {
				if (global.villagers.indexOf(args) > -1 || global.mafiaScum.indexOf(args) > -1) {
					if (message.author.username != args) {
						jailedPlayer = args;
						if (jailedPlayer === roleblockerName) {
							roleblockedPlayer = "";
							global.dayPhase++;
						}
						else {
							console.log("Roleblocker was not jailed.");
						}
					}
					else {
						message.channel.send("You cannot target yourself");
					}
				}
				else {
					message.channel.send("Invalid player username");
				}
			}
			else {
				console.log("Jailer was roleblocked");
			}
		}
		else {
			message.channel.send("You can only jail at night!");
		}
	}
	else {
		message.channel.send("You are not the jailer!");
	}
	
}

mafia.roleblock = function(bot, message, args) {
	
	if (roleblockerName === message.author.username) {
		if (global.dayPhase === 1) {
			if (global.villagers.indexOf(args) > -1 || global.mafiaScum.indexOf(args) > -1) {
				if (message.author.username != args) {
					roleblockedPlayer = args;
					global.dayPhase++;
				}
				else {
					message.channel.send("You cannot target yourself");
				}
			}
			else {
			message.channel.send("Invalid player username");
			}
		}
		else {
			message.channel.send("You can only roleblock at night!");
		}
	}
	else {
		message.channel.send("You are not the roleblocker!");
	}
}

mafia.track = function(bot, message, args) {
	
	if (trackerName === message.author.username) {
		if (global.dayPhase === 6) {
			if (roleblockedPlayer != trackerName && jailedPlayer != trackerName) {
				if (global.villagers.indexOf(args) > -1 || global.mafiaScum.indexOf(args) > -1) {
					if (message.author.username != args) {
						trackedPlayer = args;
						trackEvent(message);
						global.dayPhase++;
					}
					else {
						message.channel.send("You cannot target yourself");
					}
				}
				else {
				message.channel.send("Invalid player username");
				}
			}
			else {
				message.channel.send("You have been roleblocked!");
			}
		}
		else {
			message.channel.send("You can only track at night!");
		}
	}
	else {
		message.channel.send("You are not the tracker!");
	}
	
}

mafia.help = function(bot, message, args) {
	var help = ["**Command List**"];
	for(var com in mafia) {
		help.push("`$` "+com);
	}
	message.channel.send(help.join("\n"));
}

mafia.register = function(bot, message, args) {

	global.players.push(message.author.username);
	console.log(message.author.username);
	message.reply("You have been registered");
}

mafia.restart = function(bot, message, args) {
	global.players = []; // clear this after testing
	global.villagers = [];
	global.mafiaScum = [];
	global.registeredPlayers = ["players:"];
	global.mafiaPlayer1 = "";
	global.mafiaPlayer2 = "";
	global.roleblockerExists = false;
	global.jailerExists = false;
	global.detectiveExists = false;
	global.doctorExists = false;
	global.trackerExists = false;
	global.bulletproofExists = false;
	global.dayPhase = 0;
	roleblockerName = null;
	jailerName = null;
	doctorName = null;
	detectiveName = null;
	bulletproofName = null;
	trackerName = null;
	bulletproofPlayer = null;
	doctorAction = "did nothing.";
	mafiaAction = "did nothing.";
	bot.channels.get("209076220971712512").send("User lists have been cleared.");
}

mafia.start = function(bot, message, args) {
	
	
	for (var i in players) {
		registeredPlayers.push(players[i]);
		console.log(players[i]);
	}
	
	message.channel.send("There are " + (registeredPlayers.length - 1) + " players.");
	
	message.channel.send(registeredPlayers.join("\n"));
	
	message.channel.send("Assigning roles...");
	
	setTimeout(function(){ assignRoles(message); }, 200);
	
	//global.gameStarted = true;
	//message.channel.send(message, mafiaScum.join("!!"));
}

mafia.list = function(bot, message, args) {
	for (var i in global.players) {
		console.log('Undeleted: ' + global.players[i]);
	}
	for (var i in global.villagers) {
		console.log('Villager: ' + global.villagers[i]);
	}
	for (var i in global.mafiaScum) {
		console.log('Mafia: ' + global.mafiaScum[i]);
	}
	console.log('Roleblocker: ' + roleblockerName);
	console.log('Jailer: ' + jailerName);
	console.log('Detective: ' + detectiveName);
	console.log('Doctor: ' + doctorName);
	console.log('Tracker: ' + trackerName);
	console.log('Bulletproof: ' + bulletproofName);
}


mafia.role = function(bot, message, args) {
	
	
	if (message.author.username === roleblockerName) {
		message.channel.send('You are the Mafia Roleblocker.  ' +
			'Roleblock someone at night with $roleblock <username>.');
	}
	else if (message.author.username === jailerName) {
		message.channel.send('You are the Jailkeeper.  Jail someone at night with $jail <username>.');
	}
	else if (message.author.username === doctorName) {
		message.channel.send('You are the Doctor.  Protect someone at night with $protect <username>.');
	}
	else if (message.author.username === detectiveName) {
		message.channel.send('You are the Detective.  Investigate someone at night with $investigate <username>.');
	}
	else if (message.author.username === bulletproofName) {
		message.channel.send('You are Bulletproof.  You can survive one night attack');
	}
	else if (message.author.username === trackerName) {
		message.channel.send('You are the Tracker.  Follow someone at night with $track <username>.');
	}
	else if (global.mafiaPlayer1 === message.author.username || global.mafiaPlayer2 === message.author.username) {
		message.channel.send("You are mafia.");
	}
	else {
		message.channel.send("You are a standard villager.");
	}
}

mafia.kill = function(bot, message, args) {
	if (global.dayPhase === 0 && global.gameStarted === true && message.channel.id === '209076220971712512') {
		var victimName = args.join("");
		var victim = global.registeredPlayers.indexOf(victimName);
		var mafiaVictim = global.mafiaScum.indexOf(victimName);
		var villagerVictim = global.villagers.indexOf(victimName);

		console.log('args: ' + args);
		console.log('victim: ' + victim);
		console.log('mafiaVictim: ' + mafiaVictim);
		console.log('villagerVictim: ' + villagerVictim);
	
		if (villagerVictim > -1) {
			global.villagers.splice(villagerVictim, 1);
			dayPhase ++;
		}
		else if (mafiaVictim > -1) {
			global.mafiaScum.splice(mafiaVictim, 1);
			dayPhase ++;
		}
		else if (victimName === 'skip') {
			message.channel.send("You have chosen to end the day without killing");
			dayPhase ++;
		}
		else {
			message.channel.send("Player does not exist");
		//registeredPlayers.splice(victim, 1);
		}
		bot.channels.get("209076220971712512").send(victimName + " the " + getRole(victimName) + " has died");

		
	}
	else if (global.dayPhase === 5 && global.mafiaScum.indexOf(message.author.username) > -1) {
			if (roleblockedPlayer != message.author.username && jailedPlayer != message.author.username) {
				if (global.villagers.indexOf(args[0]) > -1 || global.mafiaScum.indexOf(args[0]) > -1) {
					if (message.author.username != args) {
						attackerName = message.author.username;
						killTarget = args;
						mafiaAction = message.author.username + " visited " + killTarget;
						global.dayPhase++;
					}
					else {
						message.channel.send("Suicide is not the answer!");
					}
				}
				else {
				message.channel.send("Invalid player username");
				}
			}
			else {
				message.channel.send("You have been roleblocked!");
			}
	}
	else {
		message.channel.send("It is not time to murder yet!");
	}
}

/*mafia.dayphasetest = function(bot, message, args) {
	dayPhase++;
}*/

module.exports = mafia;
