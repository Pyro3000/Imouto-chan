var pet = {};
var fs = require('fs');
var imoutoFilePath	=	"./Imouto-chan/imouto.json";
var suffix = ', desu!';



//will likely need a function to determine if user has a pet that runs in most commands

function saveImouto() {
	//console.log("in saveWallet: " + wallet["money"]);
  fs.writeFile(
      imoutoFilePath,
      JSON.stringify(global.imouto, null, 2));
}

function getNameForUser(user, guild) {
  if (guild.members.find("id", user.id).nickname) {
    return guild.members.find("id", user.id).nickname;
  }
  return user.username;
}

pet.wallet = function(bot, message, args) {
	var silverKeyAmount = "";
	var goldKeyAmount = "";
	var silverString = "";
	var goldString = "";
	var copperString = "";

	
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
	
	if (copperAmount > 0) {
		copperString = " " + copperAmount + " copper";
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

pet.inventory = function(bot, message, args) {
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

pet.help = function(bot, message, args) {
	var petHelp = ["**Command List**"];
	for(var com in pet) {
		petHelp.push("`$` "+com);
	}
	message.channel.send(petHelp.join("\n"));
}

pet.incubate = function(bot, message, args) {
	//NEEDS UPDATED
	var eggName = args.join(" ");
	var dateOfIncubation = new Date();
	var hatchingTime = new Date();
	
	if(global.imouto.minigames.pets[message.author.id].hasPet === false) {
		if(global.petEggs.indexOf(eggName) > -1) {
			if(global.imouto.minigames.pets[message.author.id].incubator === null) {
				if(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(eggName) > -1) {
					message.reply("you put the " + eggName + " in the incubator" + suffix);
					global.imouto.minigames.treasure[message.author.id].inventory.splice(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(eggName), 1);
					global.imouto.minigames.pets[message.author.id].incubator = eggName;
					global.imouto.minigames.pets[message.author.id].incubationDate = new Date();
					hatchingTime.setHours(dateOfIncubation.getHours() + 1);
					global.imouto.minigames.pets[message.author.id].hatchDate = hatchingTime;
					saveImouto();
				}
				else {
					message.reply("you don't have any " + eggName + "s" + suffix);
				}
			}
			else {
				message.reply("you already have an egg in the incubator" + suffix);
			}
		}
		else {
			message.reply("use $incubate <egg name> to incubate an egg" + suffix);
		}
	}
	else {
		message.reply("you already have a pet" + suffix);
	}
}

pet.feed = function(bot, message, args) {
	message.reply("Please look forward to it" + suffix);
	//user needs item from petFood in their inventory
	//args should be the food
	//need to find way to make "things like this" count as one item. .join(" ")
}

pet.pet = function(bot, message, args) {
	//NEEDS UPDATED
	if(global.imouto.minigames.pets[message.author.id].hasPet === true) {
		if(!global.imouto.minigames.pets[message.author.id].lastPet) {
			global.imouto.minigames.pets[message.author.id].lastPet = 0;
		}
		
		var lastPet = new Date(global.imouto.minigames.pets[message.author.id].lastPet);
		var currentPet = new Date();
		var petAffection = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.affection;

		if(lastPet <= currentPet) {
			petAffection += 5;
			
			if(petAffection < 10) {
				message.reply("your pet acts worried when you touch them with your hand.");
			}
			else if(petAffection < 20) {
				message.reply("your pet seems to be getting used to your touch.");
			}
			else if(petAffection < 30) {
				message.reply("your pet no longer seems to be afraid of you.");
			}
			else if(petAffection < 40) {
				message.reply("your pet seems calmed by your touch.");
			}
			else if(petAffection < 75) {
				message.reply("your pet reacts happily.");
			}
			else if(petAffection <= 90) {
				message.reply("your pet snuggles up against you.");
			}
			else if(petAffection <= 99) {
				message.reply("your pet seems to adore you.");
			}
			else if(petAffection >= 100) {
				petAffection = 100;
				message.reply("There is no greater connection than the one between you and your pet");
			}
			else {
				message.reply("your pet hates you. (This isn't supposed to be possible.  Something has gone wrong.)");
			}
			lastPet = new Date(currentPet);
			lastPet.setHours(currentPet.getHours() + 1);
			global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.affection = petAffection;
			global.imouto.minigames.pets[message.author.id].lastPet = lastPet;
			saveImouto();
		}
		else {
			message.reply("you should probably leave them alone for a while" + suffix);
		}
	}
	else {
		message.reply("you do not have a pet" + suffix);
	}
}

pet.name = function(bot, message, args) {
	//NEEDS UPDATED
	if(args[0] === undefined) {
		message.reply("use $name <name>" + suffix);
	}
	else {
		if(global.imouto.minigames.pets[message.author.id].hasPet === true) {
			var petName = global.imouto.minigames.pets[message.author.id].pet.frozenPets.frozenNames;
			if(petName.indexOf(args[0]) > -1) {
				message.reply("you already have a pet with that name" + suffix);
			}
			else {
				message.reply("Your pet's name is now " + args[0] + suffix);
				global.imouto.minigames.pets[message.author.id].pet.activePet.petName = args[0];
				saveImouto();
			}
		}
		else {
			message.reply("you do not have a pet" + suffix);
		}
	}
}

pet.freeze = function(bot, message, args) {
	//NEEDS UPDATED
	var totalTubes = global.imouto.minigames.pets[message.author.id].cryotubeCount;
	var filledTubes = global.imouto.minigames.pets[message.author.id].pet.frozenPets.frozenNames.length;
	var emptyTubes = totalTubes - filledTubes;
	var petName = global.imouto.minigames.pets[message.author.id].pet.activePet.petName;

	if(global.imouto.minigames.pets[message.author.id].hasPet === true) {
		var birthday = global.imouto.minigames.pets[message.author.id].pet.activePet.petBirthday;
		var species = global.imouto.minigames.pets[message.author.id].pet.activePet.petType;
		var gender = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.gender;
		var stamina = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.stamina;
		var power = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.power;
		var speed = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.speed;
		var intelligence = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.intelligence;
		var affection = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.affection;
		var skillUpAvailable = global.imouto.minigames.pets[message.author.id].pet.activePet.skillUpAvailable;

		if(emptyTubes > 0) {
			if(petName === null) {
				message.reply("you need to name your pet first" + suffix);
			}
			else {
				global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName] = { "petBirthday": birthday, "petType": species,
					"gender": gender, "stamina": stamina, "power": power, "speed":speed, "intelligence": intelligence,
					"affection": affection, "skillUpAvailable": skillUpAvailable}
				global.imouto.minigames.pets[message.author.id].frozenPets++;
				global.imouto.minigames.pets[message.author.id].pet.frozenPets.frozenNames.push(petName);
				global.imouto.minigames.pets[message.author.id].hasPet = false;
				message.reply("you have frozen " + petName + suffix);
				saveImouto();
			}
		}
		else {
			message.reply("You do not have any available cryotubes" + suffix);
		}
	}
	else {
		message.reply("you do not have a pet" + suffix);
	}
}


pet.thaw = function(bot, message, args) {
	//NEEDS UPDATED
	var totalTubes = global.imouto.minigames.pets[message.author.id].cryotubeCount;
	var filledTubes = global.imouto.minigames.pets[message.author.id].pet.frozenPets.frozenNames.length;
	var emptyTubes = totalTubes - filledTubes;
	var petName = args[0];//global.imouto.minigames.pets[message.author.id].pet.activePet.petName;
	
	
	if(global.imouto.minigames.pets[message.author.id].incubator === null) {
		if(global.imouto.minigames.pets[message.author.id].hasPet === false) {
			frozenNames = global.imouto.minigames.pets[message.author.id].pet.frozenPets.frozenNames;

			if(frozenNames.length > 0) {
				if(frozenNames.indexOf(petName) > -1) {
					//global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName]
					var birthday = global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName].petBirthday;
					var species = global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName].petType;
					var gender = global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName].gender;
					var stamina = global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName].stamina;
					var power = global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName].power;
					var speed = global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName].speed;
					var intelligence = global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName].intelligence;
					var affection = global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName].affection;
					var skillUpAvailable = global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName].skillUpAvailable;
					
					global.imouto.minigames.pets[message.author.id].pet.activePet.petBirthday = birthday;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petType = species;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.gender = gender;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.stamina = stamina;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.power = power;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.speed = speed;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.intelligence = intelligence;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.affection = affection;
					global.imouto.minigames.pets[message.author.id].pet.activePet.skillUpAvailable = skillUpAvailable;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petName = petName;
					
					delete global.imouto.minigames.pets[message.author.id].pet.frozenPets[petName];
					global.imouto.minigames.pets[message.author.id].frozenPets--;
					global.imouto.minigames.pets[message.author.id].pet.frozenPets.frozenNames.splice(global.imouto.minigames.pets[message.author.id].pet.frozenPets.frozenNames.indexOf(petName), 1);
					global.imouto.minigames.pets[message.author.id].hasPet = true;
					message.reply("you have thawed " + petName + suffix);
					saveImouto();
				}
				else {
					message.reply("you don't have any frozen pets by that name" + suffix);
				}
			}
			else {
				message.reply("you don't have any frozen pets" + suffix);
			}
		}
		else {
			message.reply("you can't thaw out a pet while you still have one with you" + suffix);
		}
	}
	else {
		message.reply("you can't thaw out a pet while an egg is incubating" + suffix);
	}
}

pet.check = function(bot, message, args) {
	//NEEDS UPDATED
	if(global.imouto.minigames.pets[message.author.id].hasPet === true) {
		message.reply("Your pet:\r\n" +
			"Name: " + global.imouto.minigames.pets[message.author.id].pet.activePet.petName +
			"\r\nBirthday: " + global.imouto.minigames.pets[message.author.id].pet.activePet.petBirthday +
			"\r\nSpecies: " + global.imouto.minigames.pets[message.author.id].pet.activePet.petType +
			"\r\nGender: " + global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.gender +
			"\r\nStamina: " + global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.stamina +
			"\r\nPower: " + global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.power +
			"\r\nSpeed: " + global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.speed +
			"\r\nIntelligence: " + global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.intelligence);
	}
	else {
		message.reply("you do not have a pet" + suffix);
	}
}

pet.enter = function(bot, message, args) {
	//NEEDS UPDATED
	message.reply("please look forward to it" + suffix);
	if(!global.imouto.minigames.pets.eventParticipants) {
		global.imouto.minigames.pets.eventParticipants = [];
	}
	//add check to make sure event has not started
	if(global.imouto.minigames.pets[message.author.id].hasPet === true) { //change to if hasPet === true
		var userID = message.author;
		var userName = getNameForUser(message.author, message.guild);
		var power = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.power;
		var speed = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.speed;
		var intelligence = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.intelligence;
		var stamina = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.stamina;//have pet enter next event
		
		global.imouto.minigames.pets.eventParticipants.push([userID, userName, power, speed, intelligence, stamina]);//args0 should be event type (race, tournament)
		//a function will need to be made to make martial arts tournaments give results every minute or so
		saveImouto();
	
	}
}

pet.train = function(bot, message, args) {
	//NEEDS UPDATED
	if(global.imouto.minigames.pets[message.author.id].hasPet === true) {
		if(!global.imouto.minigames.pets[message.author.id].lastTrain) {
			global.imouto.minigames.pets[message.author.id].lastTrain = 0;
		}
		
		if(!global.imouto.minigames.pets[message.author.id].pet.activePet.skillUpAvailable) {
			global.imouto.minigames.pets[message.author.id].pet.activePet.skillUpAvailable = 30;
		}
		
		var skillIncreaseLimit = global.imouto.minigames.pets[message.author.id].pet.activePet.skillUpAvailable;
		
		var lastTrain = new Date(global.imouto.minigames.pets[message.author.id].lastTrain);
		var currentTrain = new Date();
		
		if(lastTrain <= currentTrain) {
			var skills = ["power","speed","stamina","intelligence"];
			var chosenSkill = args[0];
			var affection = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.affection;
			var petSpecies = global.imouto.minigames.pets[message.author.id].pet.activePet.petType;
			var trainedSkill = 0;
			var originalStat = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats[chosenSkill];
			
			if(skills.indexOf(chosenSkill) > -1) {
				
				
				if(affection <= 34) {
					trainedSkill += 1;
				}
				else if(affection <= 90) {
					trainedSkill += 2;
				}
				else if (affection >= 91) {
					trainedSkill += 3;
				}
				
				//"slimey egg","scaley egg","stone egg","metal egg","rainbow egg"
				if(petSpecies === "succubus") {
					if(chosenSkill === "intelligence") {
						trainedSkill += 3;
					}
				}
				else if (petSpecies === "slime") {
					if(chosenSkill === "stamina") {
						trainedSkill += 3;
					}
				}
				else if (petSpecies === "lamia") {
					if(chosenSkill === "power") {
						trainedSkill += 2;
					}
					else if(chosenSkill === "intelligence") {
						trainedSkill += 2;
					}
				}
				else if (petSpecies === "golem") {
					if(chosenSkill === "stamina") {
						trainedSkill += 2;
					}
					if(chosenSkill === "power") {
						trainedSkill += 2;
					}
				}
				else if (petSpecies === "dullahan") {
					if(chosenSkill === "stamina") {
						trainedSkill += 1;
					}
					if(chosenSkill === "power") {
						trainedSkill += 1;
					}
					if(chosenSkill === "speed") {
						trainedSkill += 1;
					}
				}
				else if (petSpecies === "unicorn") {
					if(chosenSkill === "intelligence") {
							trainedSkill += 2;
					}
					else if(chosenSkill === "speed") {
							trainedSkill += 2;
					}
				}
				
				if(skillIncreaseLimit >= trainedSkill) {
					skillIncreaseLimit -= trainedSkill;
				}
				else if(skillIncreaseLimit === 0 || isNaN(skillIncreaseLimit)) {
					message.reply("Your pet doesn't seem to benefit from training anymore" + suffix);
					trainedSkill = 0;
					currentTrain = new Date(0)
				}
				else if(trainedSkill > skillIncreaseLimit) {
					trainedSkill = skillIncreaseLimit;
					skillIncreaseLimit = "empty";
				}
				else {
					message.reply("an error has occured" + suffix);
					trainedSkill = 0;
					currentTrain = new Date(0);
				}
				
				console.log(trainedSkill);
				
				var newLevel = trainedSkill + originalStat;
				
				message.reply("your pet's " + chosenSkill + " has increased by " + trainedSkill + suffix);
				
				lastTrain = new Date(currentTrain);
				lastTrain.setHours(currentTrain.getHours() + 18);
				global.imouto.minigames.pets[message.author.id].pet.activePet.petStats[chosenSkill] = newLevel;
				global.imouto.minigames.pets[message.author.id].lastTrain = lastTrain;
				global.imouto.minigames.pets[message.author.id].pet.activePet.skillUpAvailable = skillIncreaseLimit;
				
				saveImouto();
				
				

			}
			else {
				message.reply("that isn't a trainable skill" + suffix);
			}
		}
		else {
			message.reply("you can only train once per day" + suffix);
		}
	}
	else {
		message.reply("you do not have a pet" + suffix);
	}
}

function plantSeed(message, plot, plotDate, seedID, seedDate) {
	dbConnection.query(`UPDATE garden SET ` + plot +` = ? ` + plotDate + ` = ? WHERE id = ?`,
		[seedID, seedDate, message.author.id]); //plants seed into passed plot with timer
}

function checkPlots(message, gardeningLevel, seedID, seedDate) {
	//checks for empty plots and checks level
	dbConnection.query(`SELECT * FROM garden WHERE id = ?`, [message.author.id] function (error, results, fields) {
		if (results[0].plot1 === null) {
			plantSeed(message, 'plot1', 'plot1Date', seedID, seedDate);
		}
		else if (results[0].plot2 === null && gardeningLevel >= 10) {
			plantSeed(message, 'plot2', 'plot2Date', seedID, seedDate);
		}
		else if (results[0].plot3 === null && gardeningLevel >= 20) {
			plantSeed(message, 'plot3', 'plot3Date', seedID, seedDate);
		}
		else if (results[0].plot4 === null && gardeningLevel >= 30) {
			plantSeed(message, 'plot4', 'plot4Date', seedID, seedDate);
		}
		else if (results[0].plot5 === null && gardeningLevel >= 40) {
			plantSeed(message, 'plot5', 'plot5Date', seedID, seedDate));
		}
		else {
			message.reply("You don't have any available plots" + suffix);
		}
	});
}

pet.plant = function(bot, message, args) {
	var seedName = args.join(" ");
	var gardeningLevel;
	dbConnection.query(`SELECT gardeningLevel FROM stats WHERE discordID = ?`, [message.author.id], function (error, results, fields) {
		gardeningLevel = results[0].gardeningLevel;
		dbConnection.query(`SELECT * FROM inventory WHERE name = ? AND id = ?`, [seedName, message.author.id], function (error,
			results, fields) {
			if(!error) {
				dbConnection.query(`SELECT * FROM items WHERE type = 'seed' AND name = ?`, [seedName], function (error, results, fields) {
					if(!error) {
						var seedID = results[0].id;
						var seedDate = new Date()
						seedDate.setHours(seedDate.getHours() + results[0].itemDate);
	
						checkPlots(message, gardeningLevel, seedID, seedDate);
					}
					else {
						message.reply("That's not a plantable item" + suffix);
					}
				});
			}
			else {
				message.reply("You don't have a " + seedName + suffix);
			}
		});
	});
}

pet.dropoff = function(bot, message, args) {
	var petsInDaycare = global.imouto.minigames.pets[message.author.id].pet.daycarePets.daycareNames.length;
	var petName = global.imouto.minigames.pets[message.author.id].pet.activePet.petName;

	if(global.imouto.minigames.pets[message.author.id].hasPet === true) {
		var birthday = global.imouto.minigames.pets[message.author.id].pet.activePet.petBirthday;
		var species = global.imouto.minigames.pets[message.author.id].pet.activePet.petType;
		var gender = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.gender;
		var stamina = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.stamina;
		var power = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.power;
		var speed = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.speed;
		var intelligence = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.intelligence;
		var affection = global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.affection;
		var skillUpAvailable = global.imouto.minigames.pets[message.author.id].pet.activePet.skillUpAvailable;

		if(petsInDaycare < 2) {
			if(petName === null) {
				message.reply("you need to name your pet first" + suffix);
			}
			else {
				global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName] = { "petBirthday": birthday, "petType": species,
					"gender": gender, "stamina": stamina, "power": power, "speed":speed, "intelligence": intelligence,
					"affection": affection, "skillUpAvailable": skillUpAvailable}
				global.imouto.minigames.pets[message.author.id].pet.daycarePets.daycareNames.push(petName);
				global.imouto.minigames.pets[message.author.id].hasPet = false;
				message.reply("you dropped off " + petName + " at the daycare ranch" + suffix);
				saveImouto();
			}
		}
		else {
			message.reply("The daycare can only hold two pets" + suffix);
		}
	}
	else {
		message.reply("you do not have a pet" + suffix);
	}
}

pet.pickup = function(bot, message, args) {
	var petsInDaycare = global.imouto.minigames.pets[message.author.id].pet.daycarePets.daycareNames.length;
	var petName = args[0];
	
	if(global.imouto.minigames.pets[message.author.id].incubator === null) {
		if(global.imouto.minigames.pets[message.author.id].hasPet === false) {
			frozenNames = global.imouto.minigames.pets[message.author.id].pet.frozenPets.frozenNames;

			if(petsInDaycare > 0) {
				if(global.imouto.minigames.pets[message.author.id].pet.daycarePets.daycareNames.indexOf(petName) > -1) {
					//global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName]
					var birthday = global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName].petBirthday;
					var species = global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName].petType;
					var gender = global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName].gender;
					var stamina = global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName].stamina;
					var power = global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName].power;
					var speed = global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName].speed;
					var intelligence = global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName].intelligence;
					var affection = global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName].affection;
					var skillUpAvailable = global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName].skillUpAvailable;
					
					global.imouto.minigames.pets[message.author.id].pet.activePet.petBirthday = birthday;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petType = species;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.gender = gender;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.stamina = stamina;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.power = power;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.speed = speed;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.intelligence = intelligence;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petStats.affection = affection;
					global.imouto.minigames.pets[message.author.id].pet.activePet.skillUpAvailable = skillUpAvailable;
					global.imouto.minigames.pets[message.author.id].pet.activePet.petName = petName;
					
					delete global.imouto.minigames.pets[message.author.id].pet.daycarePets[petName];
					global.imouto.minigames.pets[message.author.id].daycarePets--;
					global.imouto.minigames.pets[message.author.id].pet.daycarePets.daycareNames.splice(global.imouto.minigames.pets[message.author.id].pet.daycarePets.daycareNames.indexOf(petName), 1);
					global.imouto.minigames.pets[message.author.id].hasPet = true;
					message.reply("you have retrieved " + petName + suffix);
					saveImouto();
				}
				else {
					message.reply("you don't have any pets in daycare by that name" + suffix);
				}
			}
			else {
				message.reply("you don't have any pets in daycare" + suffix);
			}
		}
		else {
			message.reply("you can't retreive a pet while you still have one with you" + suffix);
		}
	}
	else {
		message.reply("you can't retrieve a pet while an egg is incubating" + suffix);
	}
}

pet.use = function(bot, message, args) {
	var fertilizerObj = {"basic fertilizer": {"days": 1},"advanced fertilizer": {"days": 7},"special fertilizer": {"days": 30}};
	var itemUsed = args.join(" ");
	var useableItems = ["basic fertilizer","advanced fertilizer","special fertilizer"];
	var itemUsedDate = new Date();
	
	if(!args[0]) {
		message.reply("use $user <item name> to use an item" + suffix);
	}
	else if(useableItems.indexOf(itemUsed) > -1) {
		if(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(itemUsed) > -1) {
			message.reply("you have used " + itemUsed + suffix);
			global.imouto.minigames.gardening[message.author.id].fertilizerUsed = true;
			global.imouto.minigames.gardening[message.author.id].fertilizerDate = new Date(itemUsedDate.setDate(itemUsedDate.getDate() + fertilizerObj[itemUsed].days));
			global.imouto.minigames.treasure[message.author.id].inventory.splice(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(itemUsed), 1);
		}
		else {
			message.reply("you don't have any " + itemUsed + suffix);
		}
	}
	else {
		message.reply("That isn't a useable item" + suffix);
	}
	
	
}

		
module.exports = pet;
