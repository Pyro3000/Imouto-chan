var neko = {};

var urlPath 	= './Imouto-chan/';
var imagePath 	= './Imouto-chan/Images/Neko/';
var naniPath 	= imagePath + 'Nani/';
var hypePath	= imagePath + 'Nani/';
var petPath 	= imagePath + 'Nani/';

var naniFiles 	= ['Nani0.jpg'];
var petFiles	= ['NekoPet0.png'];
var hypeFiles	= ['hype0.gif'];

var fs = require('fs');
var suggestionFile = urlPath + '/suggestions.txt';

var suffix = ', nyaa!';

/*function getImage(bot, message, args, fileList, filePath, commandName) {
	var fileNum = parseInt(args[0]) - 1;
	
	if (fileNum >=0 && fileNum < fileList.length) {
		message.channel.sendFile(filePath+fileList[fileNum]);
	} else if (fileNum > fileList.length || fileNum < 0) {
		message.channel.send('There are only ' + fileList.length +
		' ' + commandName +' images' + suffix + '  Imouto-chan has resorted to random' + suffix);
		i = Math.floor(Math.random()*fileList.length);
		message.channel.sendFile(filePath+fileList[i]);
	} else {
		i = Math.floor(Math.random()*fileList.length);
		message.channel.sendFile(filePath+fileList[i]);
	}
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
	message.delete(message, args);
	message.channel.send(phrase);
}

neko.help = function(bot, message, args) {
	var help = ["**Command List**"];
	for(var com in neko) {
		help.push("`$` "+com);
	}
	message.channel.send(help.join("\n"));
}

neko.say = function(bot, message, args) {
	if (message.author.id === '208165377358823425') {
		message.delete(message, args);
		message.channel.send(args.join(" ") + suffix);
	}
	else {
		message.channel.send("Imouto-chan hardly even knows you, nyaa!");
	}
}

neko.suggest = function(bot, message, args) {
	fs.appendFile(suggestionFile, args.join(" ") + '\r\n', (err) => {
		if (err) throw err;

		message.channel.send('Imouto-chan wrote down your suggestion' + suffix);
		console.log("Imouto received a suggestion" + suffix); 
	});
}

neko.nyaa = function(bot, message, args) {
	var phrase = 'Nyaa!';
	
	sayWord(bot, message, args, phrase);
}

neko.nani = function(bot, message, args) {
	var commandName = 'nani';
	var filePath = naniPath;
	var fileList = naniFiles;
	
	message.channel.send('Nyaani?');
	getImage(bot, message, args, fileList, filePath, commandName);
}

neko.imouto = function(bot, message, args) {
	message.channel.send("Imouto wa Imouto, desu!");
	global.personality = 0;
	global.suffix = ", desu!";
}

module.exports = neko;
