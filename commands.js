var commands = {};
var fs = require('fs');
var commandDate = new Date();
var imoutoFilePath	=	"./Imouto-chan/imouto.json";

var urlPath 		= './Imouto-chan/';
//var imagePath 		= './Imouto-chan/Images/';
var suffix = ', desu!';

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

//---------------------------------------------------------------------------------------



function triforceCheck(message, reward) {
	if(!global.imouto.minigames.treasure[message.author.id].triforceCount) {
		global.imouto.minigames.treasure[message.author.id].triforceCount = 0;
	}
	
	var triforceShards = global.imouto.minigames.treasure[message.author.id].triforceCount;
	
	if(global.triforceList.indexOf(reward) > -1) {
		triforceShards++;
		global.imouto.minigames.treasure[message.author.id].triforceCount = triforceShards;
	}

	if (triforceShards == 3) {
		message.channel.send("You have completed the Triforce" + suffix);
		global.imouto.minigames.treasure[message.author.id].triforceCount = 0;
		
		for (shard in global.triforceList) {
			global.imouto.goldLoot.push(global.triforceList[shard]);
			global.imouto.minigames.treasure[message.author.id].inventory.splice(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(global.triforceList[shard]), 1);
		}
		
		if (!global.imouto[message.author.id]) {
			global.imouto[message.author.id] = {};
		}
		if (!global.imouto[message.author.id].badges) {
			global.imouto[message.author.id].badges = [];
		}
		
		global.imouto[message.author.id].badges.push("Obtained the Triforce");
	}
}

function theBossCheck(message, reward) {
	if(!global.imouto.minigames.treasure[message.author.id].theBossCount) {
		global.imouto.minigames.treasure[message.author.id].theBossCount = 0;
	}
	
	var theBossItems = global.imouto.minigames.treasure[message.author.id].theBossCount;
	
	if(global.theBossList.indexOf(reward) > -1) {
		theBossItems++;
		global.imouto.minigames.treasure[message.author.id].theBossCount = theBossItems;
	}

	if (theBossItems == 2) {
		message.channel.send("You have inherited The Will of The Boss" + suffix);
		global.imouto.minigames.treasure[message.author.id].theBossCount = 0;
		
		for (item in global.theBossList) {
			global.imouto.goldLoot.push(global.theBossList[item]);
			global.imouto.minigames.treasure[message.author.id].inventory.splice(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(global.theBossList[item]), 1);
		}
		
		if (!global.imouto[message.author.id]) {
			global.imouto[message.author.id] = {};
		}
		if (!global.imouto[message.author.id].badges) {
			global.imouto[message.author.id].badges = [];
		}
		
		global.imouto[message.author.id].badges.push("Inherited The Will of the Boss");
	}
}

function fierceDeityCheck(message, reward) {
	if(!global.imouto.minigames.treasure[message.author.id].collectibleMasks) {
		global.imouto.minigames.treasure[message.author.id].collectibleMasks = 0;
	}
	
	var masksCollected = global.imouto.minigames.treasure[message.author.id].collectibleMasks;
	
	if(global.collectibleMaskList.indexOf(reward) > -1) {
		masksCollected++;
		global.imouto.minigames.treasure[message.author.id].collectibleMasks = masksCollected;
	}

	if (masksCollected == 20) {
		message.channel.send("You have collected all 20 Collectible Masks" + suffix);
		global.imouto.minigames.treasure[message.author.id].collectibleMasks = 0;
		
		for (mask in global.collectibleMaskList) {
			global.imouto.loot.push(global.collectibleMaskList[mask]);
			global.imouto.minigames.treasure[message.author.id].inventory.splice(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(global.collectibleMaskList[mask]), 1);
		}
		
		if (!global.imouto[message.author.id]) {
			global.imouto[message.author.id] = {};
		}
		if (!global.imouto[message.author.id].badges) {
			global.imouto[message.author.id].badges = [];
		}
		
		global.imouto[message.author.id].badges.push("Obtained the Fierce Deity Mask");
		global.imouto.minigames.treasure[message.author.id].inventory.push("Fierce Deity Mask");
	}
}

function phatCheckCheck(message, reward) {
	if(!global.imouto.minigames.treasure[message.author.id].partyhatCount) {
		global.imouto.minigames.treasure[message.author.id].partyhatCount = 0;
	}
	
	var phatsCollected = global.imouto.minigames.treasure[message.author.id].partyhatCount;
	
	if(global.partyhatList.indexOf(reward) > -1) {
		phatsCollected++;
		global.imouto.minigames.treasure[message.author.id].partyhatCount = phatsCollected;
	}

	if (phatsCollected == 6) {
		message.channel.send("You have collected all 6 Party Hats" + suffix);
		global.imouto.minigames.treasure[message.author.id].partyhatCount = 0;
		
		for (hat in global.partyhatList) {
			global.imouto.loot.push(global.partyhatList[hat]);
			global.imouto.minigames.treasure[message.author.id].inventory.splice(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(global.partyhatList[hat]), 1);
		}
		
		if (!global.imouto[message.author.id]) {
			global.imouto[message.author.id] = {};
		}
		if (!global.imouto[message.author.id].badges) {
			global.imouto[message.author.id].badges = [];
		}
		
		global.imouto[message.author.id].badges.push("Shameless Party Animal");
	}
}

function dragonBallCheck(message, reward) {
	var inventory = global.imouto.minigames.treasure[message.author.id].inventory;
	
	if(!global.imouto.minigames.treasure[message.author.id].dragonBallCount) {
		global.imouto.minigames.treasure[message.author.id].dragonBallCount = 0;
	}

	var dragonBalls = global.imouto.minigames.treasure[message.author.id].dragonBallCount;
	
	if(global.dragonBallList.indexOf(reward) > -1) {
		dragonBalls++;
		global.imouto.minigames.treasure[message.author.id].dragonBallCount = dragonBalls;
	}
	
	if (dragonBalls === 7) {
		message.channel.send("You have obtained all seven Dragon Balls" + suffix);
		global.imouto.minigames.treasure[message.author.id].dragonBallCount = 0;
		
		for (ball in global.dragonBallList) {
			global.imouto.loot.push(global.dragonBallList[ball]);
			global.imouto.minigames.treasure[message.author.id].inventory.splice(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(global.dragonBallList[ball]), 1);
		}
		
		if (!global.imouto[message.author.id]) {
			global.imouto[message.author.id] = {};
		}
		if (!global.imouto[message.author.id].badges) {
			global.imouto[message.author.id].badges = [];
		}
		
		global.imouto[message.author.id].badges.push("Summoned Shenron");
				
	}
}

function showOneDigitOnly(message, myNumber) {
	if (myNumber < 10) {
		message.channel.send("The second number is " +
		myNumber + suffix);
	}
	else {
		if (Math.random() < 0.5) { // 50% probability
		//show first digit
		message.channel.send("The first number is " + Math.floor(myNumber / 10 ) + suffix);
		}
		else {
		//show second digit
		message.channel.send("The second number is " + myNumber % 10);
		}
	}
}


function showOneDigitEvenOdd(message, myNumber) {
	if (myNumber < 10) {
		if (myNumber % 2 == 0) {
			message.channel.send("The second number is even" + suffix);
		}
		else {
			message.channel.send("The second number is odd" + suffix);
		}
	}
	else {
		if (Math.random() < 0.5) { // 50% probability
			if (Math.floor(myNumber/10)%2 == 0 ) {
				message.channel.send("The first number is even" + suffix);
			}
			else {
				message.channel.send("The first number is odd" + suffix);
			}
		}		
		else {
			if ((myNumber%10)%2 == 0) {
				message.channel.send("The second number is even" + suffix);
			}
			else {
				message.channel.send("The second number is odd" + suffix);
			}
		}
	}
}

function lockGreaterLesser(message, hintNumber) {
	
	var lesserHint = hintNumber + 1;
	var greaterHint = hintNumber - 1;
	
	if (global.chestLock >= hintNumber) {
					message.channel.send("The number is greater than " + greaterHint + suffix);
				}
				else {
					message.channel.send("The number is less than " + lesserHint + suffix);
				}
	
}

function lockNumberRange(message, hintNumber) {
	var highNumber = Math.ceil(Math.random()*(99 - hintNumber) + hintNumber);
	var lowNumber = Math.ceil(Math.random()*(hintNumber - 1));
	message.channel.send("The number is between " + lowNumber + " and " + highNumber + suffix);
	
}

function unlockBronze(message) {
		global.imouto.minigames.treasure[message.author.id].chestsOpened++;
		
	if(global.imouto.minigames.treasure[message.author.id].chestsOpened % 5 == 0) {
			
		if (!global.imouto.minigames.treasure[message.author.id].silverKeys) {
		global.imouto.minigames.treasure[message.author.id].silverKeys = 0;
		}
			
		global.imouto.minigames.treasure[message.author.id].silverKeys++;
			
		message.channel.send("You've obtained a silver key" + suffix);
		
	}
}

function unlockSilver(message) {
	var lootList = global.imouto.loot;
	
	if (!global.imouto.minigames.treasure[message.author.id].silverChestsOpened) {
		global.imouto.minigames.treasure[message.author.id].silverChestsOpened = 0;
	}

	global.imouto.minigames.treasure[message.author.id].silverChestsOpened++;

	if(global.imouto.minigames.treasure[message.author.id].silverChestsOpened % 5 == 0) {

		if(!global.imouto.minigames.treasure[message.author.id].goldKeys) {
			global.imouto.minigames.treasure[message.author.id].goldKeys = 0;
		}

		global.imouto.minigames.treasure[message.author.id].goldKeys++;

		message.channel.send("You've obtained a gold key" + suffix);
	}
	
	if(lootList.length > 0) {
		var itemObtained = Math.floor(Math.random()*lootList.length);
		
		if(!global.imouto.minigames.treasure[message.author.id].inventory) {
			global.imouto.minigames.treasure[message.author.id].inventory = [];
		}
		
		global.imouto.minigames.treasure[message.author.id].inventory.push(lootList[itemObtained]);
		
		message.channel.send("You've obtained: " + lootList[itemObtained]);
		
		if (!global.imouto.minigames.treasure[message.author.id].dragonBallCount) {
			global.imouto.minigames.treasure[message.author.id].dragonBallCount = 0;
		}
		
		if (global.dragonBallList.indexOf(lootList[itemObtained]) > -1) {
			global.imouto.minigames.treasure[message.author.id].dragonBallCount++;
		}
		
		if (!global.imouto.minigames.treasure[message.author.id].collectibleMaskCount) {
			global.imouto.minigames.treasure[message.author.id].collectibleMasks = 0;
		}
		
		if (global.collectibleMaskList.indexOf(lootList[itemObtained]) > -1) {
			global.imouto.minigames.treasure[message.author.id].collectibleMasks++;
		}
		
		
		dragonBallCheck(message, itemObtained);
		fierceDeityCheck(message, itemObtained);
			
		global.imouto.loot.splice(itemObtained, 1);
	}
	else {
		message.channel.send("There are no items left in the silver chests!  You got an additional " + global.coinAmount + " copper" + suffix);
		global.imouto.minigames.treasure[message.author.id].currency = Number(global.imouto.minigames.treasure[message.author.id].currency) + global.coinAmount;
	}
}


function unlockGold(message) {
	var goldLootList = global.imouto.goldLoot;
	
	if (!global.imouto.minigames.treasure[message.author.id].goldChestsOpened) {
		global.imouto.minigames.treasure[message.author.id].goldChestsOpened = 0;
	}

	global.imouto.minigames.treasure[message.author.id].goldChestsOpened++;

	/*if(global.imouto.minigames.treasure[message.author.id].goldChestsOpened % 5 == 0) {

	}*/
	
	if(goldLootList.length > 0) {
		var itemObtained = Math.floor(Math.random()*goldLootList.length);
		
		if(!global.imouto.minigames.treasure[message.author.id].inventory) {
			global.imouto.minigames.treasure[message.author.id].inventory = [];
		}
		
		global.imouto.minigames.treasure[message.author.id].inventory.push(goldLootList[itemObtained]);
		
		message.channel.send("You've obtained: " + goldLootList[itemObtained]);
		
		if (!global.imouto.minigames.treasure[message.author.id].triforceCount) {
			global.imouto.minigames.treasure[message.author.id].triforceCount = 0;
		}
			
		if (global.triforceList.indexOf(goldLootList[itemObtained]) > -1) {
			global.imouto.minigames.treasure[message.author.id].triforceCount++;
		}
		
		if (!global.imouto.minigames.treasure[message.author.id].theBossCount) {
			global.imouto.minigames.treasure[message.author.id].theBossCount = 0;
		}
		
		if (global.theBossList.indexOf(goldLootList[itemObtained]) > -1) {
			global.imouto.minigames.treasure[message.author.id].theBossCount++;
		}
			
		global.imouto.goldLoot.splice(itemObtained, 1);
		triforceCheck(message, itemObtained);
		theBossCheck(message, itemObtained);
	}
	else {
		message.channel.send("There are no items left in the gold chests!  You got an additional " + global.coinAmount + " copper" + suffix);
		global.imouto.minigames.treasure[message.author.id].currency = Number(global.imouto.minigames.treasure[message.author.id].currency) + global.coinAmount;
	}
}

function unlockRoulette(message) {
	
	if(!global.imouto.rouletteLoot) {
		global.imouto.routetteLoot = [];
	}
	
	var rouletteLootList = global.imouto.rouletteLoot;
	
	if (!global.imouto.minigames.treasure[message.author.id].rouletteChestsOpened) {
		global.imouto.minigames.treasure[message.author.id].rouletteChestsOpened = 0;
	}

	global.imouto.minigames.treasure[message.author.id].rouletteChestsOpened++;

	/*if(global.imouto.minigames.treasure[message.author.id].goldChestsOpened % 5 == 0) {

	}*/
	
  if (!rouletteLootList) { rouletteLootList = []; }
	if(rouletteLootList.length > 0) {
		var itemObtained = Math.floor(Math.random()*goldLootList.length);
		
		if(!global.imouto.minigames.treasure[message.author.id].inventory) {
			global.imouto.minigames.treasure[message.author.id].inventory = [];
		}
		
		global.imouto.minigames.treasure[message.author.id].inventory.push(rouletteLootList[itemObtained]);
		
		message.channel.send("You've obtained: " + rouletteLootList[itemObtained] + ".  The chest took " + global.rouletteGuesses + suffix);
		
			
		global.imouto.rouletteLoot.splice(itemObtained, 1);
	}
	else {
		message.channel.send("There are no items left in the roulette chests!  You got an additional " + global.coinAmount + " copper" + suffix);
		global.imouto.minigames.treasure[message.author.id].currency = Number(global.imouto.minigames.treasure[message.author.id].currency) + global.coinAmount;
	}
	
	global.rouletteGuess = 0;
	global.rouletteGuesses = 0;
}

function correctChestLock(message) {
	var unlockedDate = new Date();
	var nextChestDate = new Date();
	var chestTimer = Math.ceil(Math.random()*4) + 5;
		
	global.alertSent = false;
			
	message.channel.send("Congratulations, " + getNameForUser(message.author, message.guild) + suffix +
	"\r\n \r\n You obtained " + global.coinAmount + " copper coins" + suffix);
			
	global.imouto.minigames.treasure[message.author.id].currency = Number(global.imouto.minigames.treasure[message.author.id].currency) + global.coinAmount;
		

	nextChestDate.setHours(unlockedDate.getHours() + chestTimer);

	global.imouto.minigames.treasure.chestProperties.nextChest = nextChestDate;

	if (global.chestType === "bronze") {
		unlockBronze(message);
	}
	else if (global.chestType === "silver") {
		unlockSilver(message);
	}	
	else if (global.chestType === "gold") {
		unlockGold(message);
	}
	else if (global.chestType === "roulette") {
		unlockRoulette(message);
	}
	
	global.chestSummoned = false;
	global.hintsRemaining = 4;
}

function failedChestLock(message, guess) {
	
	if (!global.imouto.minigames.treasure[message.author.id].lastGuess) {
		global.imouto.minigames.treasure[message.author.id].lastGuess = 0;
				
	}
		
	var guessTime = new Date(global.imouto.minigames.treasure[message.author.id].lastGuess);
	var userNextGuess = new Date();
			
	userNextGuess.setMinutes(userNextGuess.getMinutes() + 15);
			
	message.reply("You have guessed incorrectly.  Try again in 15 minutes" + suffix);
	

	if (global.chestLock > guess) {
					message.channel.send("The number is greater than " + guess + suffix);
				}
				else {
					message.channel.send("The number is less than " + guess + suffix);
				}
	
		
	if (!global.imouto.minigames.treasure[message.author.id]) {
		global.imouto.minigames.treasure[message.author.id];
	}
		
	
		
	if (!global.imouto.minigames.treasure[message.author.id].nextGuess) {
		global.imouto.minigames.treasure[message.author.id].nextGuess = 0;
	}
				
	global.imouto.minigames.treasure[message.author.id].nextGuess = userNextGuess;
	global.imouto.minigames.treasure[message.author.id].lastGuess = guessTime;
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
  return user.username;
}

function automaticTackle(message, offPlayer, defPlayer) {
	message.reply("you have stolen the gnomeball" + suffix);
	global.imouto.gnomeball = offPlayer.id;

}

function tacklingLevelUp(message, offPlayer, expGain) {
	var skillExp = Number(global.imouto.minigames.gnomeball[offPlayer.id].stats.tacklingExp) + expGain;
	var skillLevel = Number(global.imouto.minigames.gnomeball[offPlayer.id].stats.tacklingLevel);
	var expRequired = (skillLevel + 1) * 2.5;
	
	if (skillLevel < 99) {
		while (skillExp > expRequired) {
			skillExp -= expRequired;
			skillLevel++;
			expRequired += 2.5;
		}
	}
	
	global.imouto.minigames.gnomeball[offPlayer.id].stats.tacklingLevel = skillLevel;
	global.imouto.minigames.gnomeball[offPlayer.id].stats.tacklingExp = skillExp;
	
	saveImouto();
}

function fortitudeLevelUp(message, defPlayer, expGain) {
	var skillExp = Number(global.imouto.minigames.gnomeball[defPlayer.id].stats.fortitudeExp) + 10;
	var skillLevel = Number(global.imouto.minigames.gnomeball[defPlayer.id].stats.fortitudeLevel);
	var expRequired = (skillLevel + 1) * 2.5;
	var userMaxHP = Number(global.imouto.minigames.gnomeball[defPlayer.id].stats.userMaxHealth);
	
	if (skillLevel < 99) {
		while (skillExp > expRequired) {
			skillExp -= expRequired;
			skillLevel++;
			expRequired += 2.5;
			userMaxHP += 2.5;
			
		}
	}
	
	global.imouto.minigames.gnomeball[defPlayer.id].stats.fortitudeLevel = skillLevel;
	global.imouto.minigames.gnomeball[defPlayer.id].stats.fortitudeExp = skillExp;
	global.imouto.minigames.gnomeball[defPlayer.id].stats.userMaxHealth = (skillLevel + 1) * 2.5;
	
	saveImouto();
}

function tackleSuccess(message, offPlayer, defPlayer, damageDealt) {
	var newHP;
	var currentHP = Number(global.imouto.minigames.gnomeball[defPlayer.id].stats.userHealth);
	var defMaxHP = Number(global.imouto.minigames.gnomeball[defPlayer.id].stats.userMaxHealth);
	var levelDifference = Number(global.imouto.minigames.gnomeball[defPlayer.id].stats.fortitudeLevel) - 
		Number(global.imouto.minigames.gnomeball[offPlayer.id].stats.tacklingLevel);
	var expGained;
	var defExpGain = Number(global.imouto.minigames.gnomeball[defPlayer.id].stats.fortitudeLevel) * 10;
	var healDate = new Date();
	
	
	
	newHP = Math.ceil(currentHP - damageDealt);

	if (levelDifference <= 0) {
		levelDifference = 0;
	}
	
	if (newHP <= 0) {
		newHP = 0;
		global.imouto.gnomeball = message.author.id;
		message.reply("stole the gnomeball" + suffix);
		expGained = 10 + levelDifference;
		tacklingLevelUp(message, offPlayer, expGained);
		fortitudeLevelUp(message, defPlayer, defExpGain);
		healDate.setHours(healDate.getHours() + 1);
		global.imouto.minigames.gnomeball[defPlayer.id].stats.startHealing = healDate;
		if(currentHP <= 0) {
			if(!global.imouto.minigames.gnomeball[message.author.id].yellowCards) {
					global.imouto.minigames.gnomeball[message.author.id].yellowCards = 0;
				}
				
				var yellowCards = global.imouto.minigames.gnomeball[message.author.id].yellowCards;
				message.channel.send("The referee gives you a yellow card for harassing an exhausted player" + suffix);
				yellowCards++;
				global.imouto.minigames.gnomeball[message.author.id].yellowCards = yellowCards;
				
				if(yellowCards >= 3) {
					var redCardDate = new Date();
					message.reply("you've gotten 3 yellow cards.  The referee hands you a red card and bans you from gnomeball for 24 hours");
					global.imouto.minigames.gnomeball[message.author.id].yellowCards = 0;
					redCardDate.setDate(redCardDate.getDate() + 1);
					global.imouto.minigames.gnomeball[message.author.id].redCardExpires = redCardDate;
				}
				
				saveImouto();
		}
	}
	else {
		message.channel.send(getNameForUser(defPlayer, message.guild) +
			" is hit and is now at " + newHP + "/" + defMaxHP + suffix);
		tacklingLevelUp(message, offPlayer, 10);
	}
	
	global.imouto.minigames.gnomeball[defPlayer.id].stats.userHealth = newHP;
	console.log(currentHP + " currentHP");
	console.log(levelDifference + " levelDif");
	console.log(defExpGain + " defExPgain");
	console.log(expGained + " expgain");
}



function attemptTackle(message, offPlayer, defPlayer) {
	var tackling = Number(global.imouto.minigames.gnomeball[offPlayer.id].stats.tacklingLevel);
	var fortitude = Number(global.imouto.minigames.gnomeball[defPlayer.id].stats.fortitudeLevel);
	var offenseBuff = (Math.random()*1) + 1;
	var defenseBuff = (Math.random()*0.5) + 1.5;
	var damageDealt = (tackling * offenseBuff) - (fortitude * defenseBuff);
	var tackleDate = new Date();
	
	if(!global.imouto.minigames.gnomeball[offPlayer.id]) {
		global.imouto.minigames.gnomeball[offPlayer.id] = {};
	}
	
	if(!global.imouto.minigames.gnomeball[offPlayer.id].stats.nextTackle) {
		global.imouto.minigames.gnomeball[offPlayer.id].stats.nextTackle = new Date();
	}
	
	var availableTackle = new Date(global.imouto.minigames.gnomeball[offPlayer.id].stats.nextTackle);
	
	if (availableTackle < tackleDate) {
		if (damageDealt > 0) {
			tackleSuccess(message, offPlayer, defPlayer, damageDealt);
		}
		else {
			if(!global.imouto.minigames.gnomeball[offPlayer.id].stats.nextTackle) {
				global.imouto.minigames.gnomeball[offPlayer.id].stats.nextTackle = new Date();
			}
			tacklingLevelUp(message, offPlayer, 5);
			message.reply("you have failed to make any impact" + suffix + "\r\nTry again in 10 minutes" + suffix);
			tackleDate.setMinutes(tackleDate.getMinutes() + 10);
			global.imouto.minigames.gnomeball[offPlayer.id].stats.nextTackle = tackleDate;
			//leveluphere
		}
	}
	else {
		var diff = Math.abs(availableTackle - tackleDate);
		var minutesLeft = Math.floor((diff/1000)/60);
		
		message.channel.send("You still have " + minutesLeft + " minutes until you can try again" + suffix);//message about tackle minutes
	}
}

function generateValues (bot, message, args) {
	var placeholderDate = new Date();
	
	if (!global.imouto.minigames.gnomeball) {
		global.imouto.minigames.gnomeball = {};
	}
	if (!global.imouto.minigames.gnomeball[message.mentions.users.array()[0].id]) {
		global.imouto.minigames.gnomeball[message.mentions.users.array()[0].id] = {};
	}
	if (!global.imouto.minigames.gnomeball[message.mentions.users.array()[0].id].stats) {
		global.imouto.minigames.gnomeball[message.mentions.users.array()[0].id].stats = {totalTime: placeholderDate, longestTime: 0,
			startTime: placeholderDate, nextTackle: placeholderDate, tacklingLevel: 1, tacklingExp: 0, passingLevel: 1, passingExp: 0,
		fortitudeLevel: 1, fortitudeExp: 0, startHealing: placeholderDate, userHealth: 5, userMaxHealth: 5}
	}
}

/*commands.fix = function(bot, message, args) {
	
//	USE THIS TO FIX BROKEN USERS IN TREASURE MINIGAME.
//  DELETE USER'S LASTGUESS AND NEXTGUESS FROM JSON FILE

		if (!global.imouto.minigames.treasure[message.author.id].lastGuess) {
		global.imouto.minigames.treasure[message.author.id].lastGuess = 0;
				
		}
		
		if (!global.imouto.minigames.treasure[message.author.id].nextGuess) {
			global.imouto.minigames.treasure[message.author.id].nextGuess = 0;
		}
		
	var guessTime = new Date(global.imouto.minigames.treasure[message.author.id].lastGuess);
	var userNextGuess = new Date();
			
	userNextGuess.setMinutes(guessTime.getMinutes() + 15);
			
	message.reply("You have guessed incorrectly.  Try again in 15 minutes" + suffix);
		
	if (!global.imouto.minigames.treasure[message.author.id]) {
		global.imouto.minigames.treasure[message.author.id];
	}
		
	
		
	if (!global.imouto.minigames.treasure[message.author.id].nextGuess) {
		global.imouto.minigames.treasure[message.author.id].nextGuess = 0;
	}
				
	global.imouto.minigames.treasure[message.author.id].nextGuess = userNextGuess;
	global.imouto.minigames.treasure[message.author.id].lastGuess = guessTime;
	
	saveImouto();
	
}*/

/*commands.test = function(bot, message, args) {
		message.channel.sendFile(urlPath + '/suggestions.txt');

}*/

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
	message.channel.send({files: [urlPath + '/imoutoReadme.txt']});
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
	message.channel.send({file: ["./Imouto-chan/Images/lastorderrage.gif"]});
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
	const fileList 	  = ['smug0.jpg','smug1.jpg','smug2.jpg','smug3.jpg','smug4.jpg','smug5.png'];
	
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
	var currentGuess = new Date();
	
	if (!global.imouto.minigames.treasure[message.author.id]) {
		global.imouto.minigames.treasure[message.author.id] = {"inventory": [],
		"currency": 0, "chestsOpened": 0, "lastGuess": 0, "nextGuess": 0, "silverKeys": 0, "goldKeys": 0};
	}
	if (!global.imouto.minigames.treasure[message.author.id].silverKeys) {
		global.imouto.minigames.treasure[message.author.id].silverKeys = 0;
	}
	if (!global.imouto.minigames.treasure[message.author.id].goldKeys) {
		global.imouto.minigames.treasure[message.author.id].goldKeys = 0;
	}
	
	var silverKeyCount = global.imouto.minigames.treasure[message.author.id].silverKeys;
	var goldKeyCount = global.imouto.minigames.treasure[message.author.id].goldKeys;
	
	if (global.chestSummoned === true) {
		if (args[0] === "key") {
			if (global.chestType === "silver") {
				if (silverKeyCount > 0) {
					global.imouto.minigames.treasure[message.author.id].silverKeys--;
					correctChestLock(message);
				}
				else {
					message.channel.send("You don't have any silver keys" + suffix);
				}
			}
			else if (global.chestType === "gold") {
				if  (goldKeyCount > 0) {
					global.imouto.minigames.treasure[message.author.id].goldKeys--;
					correctChestLock(message);
				}
				else {
					message.channel.send("You don't have any gold keys" + suffix);
				}
			}
			else {
				message.channel.send("This chest type doesn't take keys" + suffix);
			}
			saveImouto();
		}
		else {
			var guessedNumber = parseInt(args[0]);
			
			if(global.chestType === 'roulette') {
				if (args[0]) {
					message.channel.send("Roulette chests only use $unlock and don't require a number" + suffix);
				}
				
				guessedNumber = global.rouletteGuess;
				global.rouletteGuesses++;
				var gap = global.chestLock - guessedNumber;
				
				message.channel.send("You have guessed " + guessedNumber + suffix);
				
				if (gap >= 10) {
					var skipChance = Math.random()*gap;
					if (skipChance >= 10) {
						global.rouletteGuess += Math.floor(Math.random()*gap);
					}
				}
				else {
					global.rouletteGuess++;
				}
				
				if (guessedNumber >= global.chestLock) {
					guessedNumber = global.chestLock;
				}
			}
				
			if (!global.imouto.minigames.treasure[message.author.id]) {
				global.imouto.minigames.treasure[message.author.id] = {"inventory": [],
				"currency": 0, "chestsOpened": 0, "lastGuess": 0, "nextGuess": 0};
			
			}

			var upcomingGuess = new Date(global.imouto.minigames.treasure[message.author.id].nextGuess);
			
			var upcomingMinutes = upcomingGuess;
			var currentMinutes = currentGuess;
			
			var diff = Math.abs(upcomingGuess - currentGuess);
			var minutesLeft = Math.floor((diff/1000)/60);
			
			var currentMillis = currentGuess.getTime();
			var upcomingMillis = upcomingGuess.getTime();
			
			if (upcomingGuess < currentGuess || guessedNumber < 0 || guessedNumber > 99) {
				if (isNaN(guessedNumber)) {
					message.channel.send("Please enter a number from 0-99" + suffix);
				}
				else if (guessedNumber == global.chestLock) {
					correctChestLock(message);
				}
				else {
					failedChestLock(message, guessedNumber);
				}
				saveImouto();
			}
			else {
				message.channel.send("You still have " + minutesLeft + " minutes until you can try again" + suffix);
			}
		}
	}
	else {
		message.channel.send("There is no chest to unlock");
	}
}


commands.hint = function(bot, message, args) {
	console.log("hint");
	
	if (global.chestSummoned == true) {
		if (global.hintsRemaining > 0) {
			var hintTestNumber = Math.floor(Math.random()*100);
			
			console.log(hintTestNumber);
			
			switch(global.hintsRemaining) {
				case 4 : lockGreaterLesser(message, hintTestNumber);
							break;
				case 1: showOneDigitOnly(message, global.chestLock);
							break;
				case 3: showOneDigitEvenOdd(message, global.chestLock);
							break;
				case 2: lockNumberRange(message, global.chestLock);
							break;		
			}
			
			global.hintsRemaining--;
			global.coinAmount = Math.floor(coinAmount * (4/5));
		}
		else {
			message.channel.send("There are no remaining hints");
		}
	}
	else {
		message.channel.send("There is no chest to unlock right now" + suffix) ;
	}
}

commands.wallet = function(bot, message, args) {
	var silverKeyAmount = "";
	var goldKeyAmount = "";

	
	if (!global.imouto.minigames.treasure[message.author.id]) {
		global.imouto.minigames.treasure[message.author.id] = {"inventory": [],
		"currency": 0, "chestsOpened": 0, "lastGuess": 0, "nextGuess": 0, "silverKeys": 0, "goldKeys": 0};
	}
	var userCurrency = Number(global.imouto.minigames.treasure[message.author.id].currency);
	var copperAmount = Math.floor(userCurrency % 1000);
	var copperString = "";
	var silverAmount = Math.floor((userCurrency / 1000) % 1000);
	var silverString = "";
	var goldAmount = Math.floor((userCurrency / 1000000) % 1000);
	var goldString = "";
	var platinumString = "";
	var platinumAmount = Math.floor(userCurrency / 1000000000);
	
	if (platinumAmount > 0) {
		platinumString = " " + platinumAmount + " platinum";
	}
	
	if (goldAmount > 0) {
		goldString = " " + goldAmount + " gold";
	}
	
	if (silverAmount > 0) {
		silverString = " " + silverAmount + " silver";
	}
	
	if (copperAmount > 0 && userCurrency > 0) {
		copperString = " " + copperAmount + " copper";
	}
	
	if(userCurrency === 0) {
		copperString = " 0 copper";
	}
	
	
	if (!global.imouto.minigames.treasure[message.author.id].silverKeys) {
		global.imouto.minigames.treasure[message.author.id].silverKeys = 0;
	}
	if(!global.imouto.minigames.treasure[message.author.id].goldKeys) {
		global.imouto.minigames.treasure[message.author.id].goldKeys = 0;
	}

	var silverKeyCount = Number(global.imouto.minigames.treasure[message.author.id].silverKeys);
	var goldKeyCount = Number(global.imouto.minigames.treasure[message.author.id].goldKeys);

	if (silverKeyCount > 0) {
		silverKeyAmount = "\r\nSilver Keys: " + silverKeyCount;
	}
	
	if (goldKeyCount > 0) {
		goldKeyAmount = "\r\nGold Keys: " + goldKeyCount;
	}
	
	message.channel.send("You have" + platinumString +
		goldString + silverString + copperString + suffix + silverKeyAmount + goldKeyAmount);
	
	saveImouto();
}

commands.inventory = function(bot, message, args) {
	var lootList = [];
	var inventoryMap = {};
	var finalList = [];
	
	if (!global.imouto.minigames.treasure[message.author.id].inventory) {
		global.imouto.minigames.treasure[message.author.id].inventory = [];
	}
	
	var inventoryList = global.imouto.minigames.treasure[message.author.id].inventory;
	
	if (inventoryList.length > 0) {
		for(var item in inventoryList) {
			if(!inventoryMap[inventoryList[item]]) {
				inventoryMap[inventoryList[item]] = 1;
				lootList.push(inventoryList[item]);
			}
			else {
				inventoryMap[inventoryList[item]]++;
			}
		}
			
		for(var item in lootList) {
			if(inventoryMap[inventoryList[item]] > 1) {
				finalList.push(lootList[item] + " x " + inventoryMap[lootList[item]]);
			}
			else {
				finalList.push(lootList[item]);
			}
		}

		message.reply("your inventory has: \r\n" + finalList.join("\n"));
	}
	else {
		message.reply("you haven't gotten any items yet" + suffix);
	}
	
	console.log(inventoryMap);
	saveImouto();
}

commands.describe = function(bot, message, args) {
	var itemName = args.join(" ");
	if (!global.items[itemName]) {
		message.reply("that isn't a valid item name");
	}
	else if (global.imouto.minigames.treasure[message.author.id].inventory.indexOf(itemName) > -1) {
		message.channel.send(global.items[itemName].description);
	}
	else {
		message.reply("you don't have a " + itemName + suffix);
	}
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

commands.pass = function(bot, message, args) {
	
	if (!global.imouto.gnomeball) {
		global.imouto.gnomeball = message.author.id;
	}
	
	if (global.imouto.gnomeball == message.author.id) {
		if (message.mentions.users.size === 0) {
			message.channel.send("Use @user to pass the gnomeball" + suffix);
		 }
		 else if (message.mentions.users.size > 1) {
			message.channel.send("You can only pass to one person" + suffix);
		 }
		 else if (message.mentions.users.array()[0].id === message.author.id) {
			message.channel.send("Don't be a ballhog" + suffix);
		 }
		 else if (message.mentions.users.array()[0].id=== '209166316035244033' || message.mentions.users.array()[0].id === '211522387471106048') {
			message.channel.send("Bots don't know how to play Gnomeball" + suffix);
		 }
		 else if (message.mentions.users.array()[0].status === "offline") {
			 message.channel.send(getNameForUser(message.author, message.guild) + " throws the gnomeball out into the open" + suffix +
				"\r\nA Gnomeball Referee throws it back to you and mumbles something about bug abusers" + suffix);
		 }
		 else {
			var newBallOwner = message.mentions.users.array()[0].id;

			message.channel.send(getNameForUser(message.author, message.guild) + " passes the gnomeball to "
				+ getNameForUser(message.mentions.users.array()[0], message.guild) + suffix);
				
			global.imouto.gnomeball = newBallOwner;
		 }
	}
	else {
		message.channel.send("You don't have the gnomeball " + getNameForUser(message.author, message.guild) + suffix);
	}
	
	saveImouto();
}

commands.tackle = function(bot, message, args) {
	var placeholderDate = new Date();
	
	var offPlayer = message.author;
	var defPlayer = message.mentions.users.array()[0];
	
	var attemptedTackleDate = new Date();
	
	
	if (!global.imouto.minigames.gnomeball[message.author.id].redCardExpires) {
		global.imouto.minigames.gnomeball[message.author.id].redCardExpires = 0;
	}
	
	var banDate = new Date(global.imouto.minigames.gnomeball[message.author.id].redCardExpires);
	
	if(banDate > attemptedTackleDate) {
		message.reply("you are currently banned from gnomeball" + suffix);
	}
	else if (message.mentions.users.size === 0) {
		message.channel.send("Use @user to tackle a player" + suffix);
	}
	else {
		
		if (!imouto.minigames.gnomeball[defPlayer.id]) {
		imouto.minigames.gnomeball[defPlayer.id] = {};
		}
		
		if (!imouto.minigames.gnomeball[defPlayer.id].stats) {
			imouto.minigames.gnomeball[defPlayer.id].stats = {totalTime: placeholderDate, longestTime: 0,
				startTime: placeholderDate, nextTackle: placeholderDate, tacklingLevel: 1, tacklingExp: 0, passingLevel: 1, passingExp: 0,
			fortitudeLevel: 1, fortitudeExp: 0, startHealing: placeholderDate, userHealth: 5, userMaxHealth: 5}
		}
		
		if(Number(imouto.minigames.gnomeball[offPlayer.id].stats.userHealth) > 0) {
		
			if (defPlayer.id === message.author.id) {
				message.channel.send("You cannot tackle yourself" + suffix);
			}
			else if (global.imouto.gnomeball === defPlayer.id) {
				if (defPlayer.status !== "offline") {
					attemptTackle(message, offPlayer, defPlayer);
				}
				else {
					automaticTackle(message, offPlayer, defPlayer);
				}
				
				saveImouto();
			}
			else {
				
				if(!global.imouto.minigames.gnomeball[message.author.id].yellowCards) {
					global.imouto.minigames.gnomeball[message.author.id].yellowCards = 0;
				}
				
				var yellowCards = global.imouto.minigames.gnomeball[message.author.id].yellowCards;
				message.channel.send(getNameForUser(defPlayer, message.guild) + " doesn't have the gnomeball.\r\n" +
					"The referee gives you a yellow card" + suffix);
				yellowCards++;
				global.imouto.minigames.gnomeball[message.author.id].yellowCards = yellowCards;
				
				if(yellowCards >= 3) {
					var redCardDate = new Date();
					message.reply("you've gotten 3 yellow cards.  The referee hands you a red card and bans you from gnomeball for 24 hours");
					global.imouto.minigames.gnomeball[message.author.id].yellowCards = 0;
					redCardDate.setDate(redCardDate.getDate() + 1);
					global.imouto.minigames.gnomeball[message.author.id].redCardExpires = redCardDate;
				}
				
				saveImouto();
			}
		}
		else {
			message.reply("you are too tired to tackle right now" + suffix);
		}
	}
}

commands.stats = function(bot, message, args) {
	var placeholderDate = new Date();
	
	if (!global.imouto.minigames.gnomeball[message.author.id]) {
		global.imouto.minigames.gnomeball[message.author.id] = {};
	}
		
	if (!global.imouto.minigames.gnomeball[message.author.id].stats) {
		global.imouto.minigames.gnomeball[message.author.id].stats = {totalTime: placeholderDate, longestTime: 0,
			startTime: placeholderDate, nextTackle: placeholderDate, tacklingLevel: 1, tacklingExp: 0, passingLevel: 1, passingExp: 0,
		fortitudeLevel: 1, fortitudeExp: 0, startHealing: placeholderDate, userHealth: 5, userMaxHealth: 5}
	}
	
	if (!imouto.minigames.gnomeball[message.author.id].stats.maxTackling) {
		imouto.minigames.gnomeball[message.author.id].stats.maxTacklingLevel = 1;
		imouto.minigames.gnomeball[message.author.id].stats.maxPassingLevel = 1;
		imouto.minigames.gnomeball[message.author.id].stats.maxFortitudeLevel = 1;
	}
	
	var tacklingValue = global.imouto.minigames.gnomeball[message.author.id].stats.tacklingLevel;
	var fortitudeValue = global.imouto.minigames.gnomeball[message.author.id].stats.fortitudeLevel;
	var passingValue = (tacklingValue+fortitudeValue)/2;
	
	global.imouto.minigames.gnomeball[message.author.id].stats.maxTacklingLevel = tacklingValue;
	global.imouto.minigames.gnomeball[message.author.id].stats.maxFortitudeLevel = fortitudeValue;
	
	var maxTacklingValue = global.imouto.minigames.gnomeball[message.author.id].stats.maxTacklingLevel;
	var maxFortitudeValue = global.imouto.minigames.gnomeball[message.author.id].stats.maxFortitudeLevel;
	var maxPassingValue = global.imouto.minigames.gnomeball[message.author.id].stats.maxPassingLevel;
	
	var gardeningValue = global.imouto.minigames.gnomeball[message.author.id].stats.gardeningLevel;
	
	global.imouto.minigames.gnomeball[message.author.id].stats.passingLevel = passingValue;
	
	message.channel.send(getNameForUser(message.author, message.guild) + " your stats are:\r\nTackling: " +
		tacklingValue + "/" + maxTacklingValue + "\r\nPassing: " + passingValue + "/" + passingValue + "\r\nFortitude: " +
		fortitudeValue + "/" + maxFortitudeValue + "\r\nGardening: " + gardeningValue);

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

commands.wakarimasen = function(bot,message,args) {
	message.channel.send("Watashi wa dochira ka wakarimasen" + suffix);
}

module.exports = commands;