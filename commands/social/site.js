const Discord = require('discord.js');

module.exports.info = {
	command: '^(site?|са[йи]т|сите)$',
	name: 'site',
    lang: {
	    'ru': {
	        description: 'Команда для получения ссылки на сайт',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
  message.channel.send('https://gamespace.ml/profile')
};
