const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Makes Imouto talk!')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('What you want Imouto to say')
				.setRequired(true)),
	async execute(interaction) {
		console.log('slash say command attempted');
		await interaction.reply('This is a test command, desu!');
	},
};
