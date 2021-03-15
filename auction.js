var auction = {};
var fs = require('fs');
var mysql 		= 	require('mysql');
var dbLogin 		= 	require('./dbLogin.json');
var dbConnection 	= 	mysql.createConnection(dbLogin);
var imoutoFilePath	=	"./Imouto-chan/imouto.json";
var suffix = ', desu!';
var petShop = {"alluring egg": {"price": 200},"slimey egg": {"price": 200},"scaley egg": {"price": 200},"stone egg": {"price": 200},
				"metal egg": {"price": 200},"rainbow egg": {"price": 200},"cryotube": {"price": 1000},"potato seed": {"price": 20},
				"corn seed": {"price": 50}, "potato": {"price": 40}, "corn": {"price": 100}, "basic fertilizer": {"price": 500},
				"advanced fertilizer": {price: 3000}, "special fertilizer": {"price": 10000}};
shopItems = ["alluring egg","slimey egg","scaley egg","stone egg","metal egg","rainbow egg","cryotube","potato seed","corn seed","carrot seed","tomato seed",
			"potato","corn","carrot","tomato","basic fertilizer","advanced fertilizer","special fertilizer"];


function saveImouto() {
	//console.log("in saveWallet: " + wallet["money"]);
  fs.writeFileSync(
      imoutoFilePath,
      JSON.stringify(global.imouto, null, 2));
}

auction.help = function(bot, message, args) {
	var help = ["**Command List**"];
	for(var com in auction) {
		help.push("`$` "+com);
	}
	message.channel.send(help.join("\n"));
}

auction.shop = function(bot, message, args) {
	var shopList = ["**Shop Inventory**"];

	dbConnection.query(`SELECT name, value FROM items WHERE buyable = 1`, function (error, results, fields) {
		for(stock in results) {
			var itemPrice = results[stock].value;
			var copperAmount = Math.floor(itemPrice % 1000);
			var copperString = "";
			var silverAmount = Math.floor((itemPrice / 1000) % 1000);
			var silverString = "";
			var goldAmount = Math.floor((itemPrice / 1000000) % 1000);
			var goldString = "";
			var platinumString = "";
			var platinumAmount = Math.floor(itemPrice / 1000000000);
	
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
	
			var pricetag = platinumString + goldString + silverString + copperString;
	
			shopList.push(results[stock].name + " " + pricetag);
		}
		message.channel.send(shopList.join("\n"));
	});
}

auction.buy = function(bot, message, args) {
	var itemBought = args.join(" ");

	if(!args[0]) {
		message.reply("use $buy <item name>" + suffix);
	}
	else {
		dbConnection.query(`SELECT * FROM items WHERE name = ?`, [itemBought] function (error, results, fields) {
			if (error) {
				message.reply("that isn't an available item" + suffix);
			}
			else { 
				var itemID = results.indexOf(itemBought);
				var itemPrice = results[itemID].value;
				
				dbConnection.query(`SELECT currency FROM stats WHERE id = ?`, [message.author.id],
					function (error, results, fields) {
					var userCurrency = results[0].currency;
					
					if (userCurrency >= itemPrice) {
						message.reply("you bought a " + itemBought + suffix);
						dbConnection.query(`INSERT INTO inventory VALUES (?, ?)`, [message.author.id, itemID]);		
		
						userCurrency -= itemPrice;
						dbConnection.query(`UPDATE stats SET currency = userCurrency WHERE discordID = ?`, [message.author.id]); 
					}
					else {
						message.reply("you cannot afford that item");
					}
				});
			}
		});
	}
}

auction.sell = function(bot, message, args) {
	var itemSold = args.join(" ");
	var userCurrency = Number(global.imouto.minigames.treasure[message.author.id].currency);
	
	
	if (!global.imouto.minigames.treasure[message.author.id]) {
		global.imouto.minigames.treasure[message.author.id] = {"inventory": [],
		"currency": 0, "chestsOpened": 0, "lastGuess": 0, "nextGuess": 0, "silverKeys": 0, "goldKeys": 0};
	}
	
	if (shopItems.indexOf(itemSold) > -1) {
		if(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(itemSold) > -1) {
			var itemPrice = Number(global.items[itemSold].value)/2;
		
			if (args === "cryotube") {
				message.reply("you can't sell cryotubes" + suffix);
			}
			else {
				message.reply("you sold your " + args + " for " + itemPrice + " copper" + suffix);
				global.imouto.minigames.treasure[message.author.id].inventory.splice(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(itemSold), 1);
				userCurrency += itemPrice;
			}
				
			
			global.imouto.minigames.treasure[message.author.id].currency = userCurrency;	
			saveImouto();
		}
		else {
			message.reply("you don't have any " + args + suffix);
		}
	}
	else {
		message.channel.send("Please enter a valid item name listed in the shop" + suffix);
	}
}

auction.sellall = function(bot, message, args) {
	var itemSold = args.join(" ");
	var userCurrency = Number(global.imouto.minigames.treasure[message.author.id].currency);
	
	
	if (!global.imouto.minigames.treasure[message.author.id]) {
		global.imouto.minigames.treasure[message.author.id] = {"inventory": [],
		"currency": 0, "chestsOpened": 0, "lastGuess": 0, "nextGuess": 0, "silverKeys": 0, "goldKeys": 0};
	}
	
	if (shopItems.indexOf(itemSold) > -1) {
		if(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(itemSold) > -1) {
			var itemPrice = Number(global.items[itemSold].value)/2;
		
			if (args === "cryotube") {
				message.reply("you can't sell cryotubes" + suffix);
			}
			else {
				var numberSold = 0;
				var totalPrice = 0;
				
				while(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(itemSold) > -1) {
					global.imouto.minigames.treasure[message.author.id].inventory.splice(global.imouto.minigames.treasure[message.author.id].inventory.indexOf(itemSold), 1);
					numberSold++;
					totalPrice += itemPrice;
				}
				message.reply("you sold "+ numberSold + " " + args + " for " + totalPrice + " copper" + suffix);
				userCurrency += totalPrice;
			}
				
			
			global.imouto.minigames.treasure[message.author.id].currency = userCurrency;	
			saveImouto();
		}
		else {
			message.reply("you don't have any " + args + suffix);
		}
	}
	else {
		message.channel.send("Please enter a valid item name listed in the shop" + suffix);
	}
}

auction.wallet = function(bot, message, args) {
	var silverKeyAmount = "";
	var goldKeyAmount = "";
	var silverString = "";
	var goldString = "";
	var copperString = "";

	dbConnection.query(`SELECT currency FROM stats WHERE id = ?`, [message.author.id],
		function (error, results, fields) {

		var userCurrency = results[0].currency);
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
	
		message.channel.send("You have" + platinumString + goldString + silverString + copperString + suffix);
	});
}

auction.inventory = function(bot, message, args) {
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

auction.badges = function(bot, message, args) {
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

auction.use = function(bot, message, args) {
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

module.exports = auction;
