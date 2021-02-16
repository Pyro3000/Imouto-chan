var tenshi = {};

var urlPath = '/home/imouto/Imouto-chan/';
var imagePath = '/home/imouto/Imouto-chan/Images/Neko/';

var fs = require('fs');
var suggestionFile = urlPath + '/suggestions.txt';

var tofuPath ="/home/imouto/Imouto-chan/Images/Tenshi/Tofu/";
tofuFiles = ['Tofu0.png', 'Tofu1.jpg', 'Tofu2.jpg'];

var suffix = '.';

function getImage(bot, message, args, fileList, filePath, commandName) {
	var fileNum = parseInt(args[0]) - 1;
	
	if (fileNum >=0 && fileNum < fileList.length) {
		message.channel.sendFile({
			files: [{
				attachment: filePath+fileList[fileNum],
				name: fileList[fileNum]
			}]
		});
	} else if (fileNum > fileList.length || fileNum < 0) {
		message.channel.send('There are only ' + fileList.length +
		' ' + commandName +' images.  Imouto-chan has resorted to random.');
		i = Math.floor(Math.random()*fileList.length);
		message.channel.sendFile(filePath+fileList[i]);
	} else {
		i = Math.floor(Math.random()*fileList.length);
		message.channel.sendFile(filePath+fileList[i]);
	}
}

function sayWord(bot, message, args, phrase) {
	bot.deleteMessage(message, args);
	message.channel.send(phrase);
}

tenshi.help = function(bot, message, args) {
	var help = ["**Command List**"];
	for(var com in tenshi) {
		help.push("`$` "+com);
	}
	message.channel.send(help.join("\n"));
}

tenshi.say = function(bot, message, args) {
	if (message.author.id === '208165377358823425') {
		message.deleteMessage(message);
		message.channel.send(args.join(" ") + suffix);
	}
	else {
		message.channel.send("Imouto-chan has no interest in speaking with you.");
	}
}

tenshi.suggest = function(bot, message, args) {
	fs.appendFile(suggestionFile, args.join(" ") + '\r\n', (err) => {
		if (err) throw err;
		
		message.channel.send('Imouto-chan has written down your suggestion' + suffix);
		console.log("Imouto received a suggestion" + suffix); 
	});
}

tenshi.pet = function(bot, message, args) {
	message.channel.sendFile("./Imouto-chan/Images/Tenshi/Pet/Pet0.gif");
}

tenshi.tofu = function(bot, message, args) {
	var commandName = 'tofu';
	var filePath = tofuPath;
	var fileList = tofuFiles;
	
	getImage(bot, message, args, fileList, filePath, commandName);
}

tenshi.imouto = function(bot, message, args) {
	message.channel.send("Imouto wa Imouto, desu!");
	global.personality = 0;
	global.suffix = ", desu!";
}

module.exports = tenshi;
