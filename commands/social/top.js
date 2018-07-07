const Discord = require('discord.js');
const func = require('../../func.js');
const request = require("request");

module.exports.info = {
    command: '^(топы?|tops?|leader(board)?s?)$',
    name: 'rank <user>',
    lang: {
        'ru': {
            description: 'Команда для просмотра топа людей',
        },
        'ua': {
            description: 'Команда для перегляду топу людей',
        },
        'en': {
            description: 'Command for viewing people\'s top',
        },
        'pl': {
            description: 'Polecenie do przeglądania topu ludzi',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {

    let lang = {
        'ru': {
            'page': 'Страница',
            'level': 'уровень',
            'totally': 'опыта всего',
        },
        'ua': {
            'page': 'Сторінка',
            'level': 'рівень',
            'totally': 'опиту всього',
        },
        'en': {
            'page': 'Page',
            'level': 'level',
            'totally': 'XP totally',
        },
        'pl': {
            'page': 'Strona',
            'level': 'poziom',
            'totally': 'doświadczenia ogółem',
        }
    };
    lang = lang[language];
    message.delete();
    let users = [];
    request('http://'+process.env.SITE_DOMAIN+'/top.php?page='+encodeURIComponent(parseInt(args[0]).toString())+'&secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id, function (error, response, body) {
        try {
            let data = JSON.parse(body);
            let footer = lang['page']+' '+data[3]+'/'+data[2];
            let usrs = data[4];
            usrs.forEach(function (item) {
                if (!message.guild.members.get(item['id'].toString())) return;
                users.push(message.guild.members.get(item['id'].toString()).toString() + ` (\`${message.guild.members.get(item['id'].toString()).user.tag}\`) - ${item['level']} ${lang['level']}, ${item['xp']} ${lang['totally']}`);
            });
            let embed = new Discord.RichEmbed()
                .setDescription(users.join('\n'))
                .setFooter(footer);
            message.channel.send({embed}).then(() => {message.channel.stopTyping(true)});

        }
    });
};