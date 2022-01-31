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

		if(interaction.user.id == '208165377358823425') {

			console.log('slash say command attempted');
			const input = interaction.options.getString("input");
			await interaction.reply(input + ', desu!');
			console.log('user ID: ' + interaction.user.id);
		}
		else {
			await interaction.reply({ content: 'Only Master can use that command, desu!',
				ephemeral: true });
		}
	},
};
