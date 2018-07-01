const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.info = {
	command: '^(ping|п[и|і|i]нг)$',
	name: 'ping',
    lang: {
	    'ru': {
	        description: 'Команда для просмотра пинга бота к основному и API серверам Discord',
        },
        'ua': {
            description: 'Команда для перегляду пінга бота до основного і API серверів Discord',
        },
        'en': {
            description: 'Command for viewing the bot ping to the main and API Discord servers',
        },
        'pl': {
            description: 'Polecenie do przeglądania pingu bota do głównych i API serwerów Discord',
        }
    }
};
let lang = {
    'ru': {
        'main_server': 'Основной сервер',
        'api_server': 'Основной сервер',
        'ms': 'мс',
        'ping': 'Пинг',
        'calculation': 'Расчет',
        'only_bots': 'Внимание! Это пинг бота, а не Ваш!',
    },
    'ua': {
        'main_server': 'Основний сервер',
        'api_server': 'API сервер',
        'ms': 'мс',
        'ping': 'Пінг',
        'calculation': 'Розрахунек',
        'only_bots': 'Увага! Це пінг бота, а не Ваш!',
    },
    'en': {
        'main_server': 'Main server',
        'api_server': 'API server',
        'ms': 'ms',
        'ping': 'Ping',
        'calculation': 'Calculation',
        'only_bots': 'Attention! This is ping of bot, not yours!',
    },
    'pl': {
        'main_server': 'Główny serwer',
        'api_server': 'API serwer',
        'ms': 'ms',
        'ping': 'Ping',
        'calculation': 'Obliczanie',
        'only_bots': 'Uwaga, proszę! Ten ping bota, nie twój!',
    }
};
module.exports.run = async function (client, message, command, args, info, language) {
    lang = lang[language];
	message.delete();
	const color = parseInt(func.getRandomInt(0, 16777214));
	const apiping = Math.round(client.ping);
    const embed = new Discord.RichEmbed()
        .setTitle(lang['ping'])
        .setDescription(`\n${lang['main_server']}: **${lang['calculation']}...**\n${lang['api_server']}: **${apiping}**${lang['ms']}`)
        .setFooter(lang['only_bots'])
        .setColor(color);
    message.channel.send({embed}).then(m => {
        const embed_req = new Discord.RichEmbed()
            .setTitle(lang['ping'])
            .setDescription(`\n${lang['main_server']}: **${m.createdTimestamp - message.createdTimestamp}**${lang['ms']}\n${lang['api_server']}: **${apiping}**${lang['ms']}`)
            .setFooter(lang['only_bots'])
            .setColor(color);
        m.edit({embed: embed_req});
    });
};