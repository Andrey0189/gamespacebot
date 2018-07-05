const Discord = require('discord.js');
const func = require('../../func.js');
const request = require("request");

module.exports.info = {
    command: '^(ран[кг]|ran[kg]|le?ve?l|л[еэ]?в[еэа]?л)$',
    name: 'rank <user>',
    lang: {
        'ru': {
            description: 'Команда для просмотра своей или чужой информации про уровень, опыт, позицию в топе',
        },
        'ua': {
            description: 'Команда для перегляду своєї або чужої інформації про рівень, опит, позицію в топі',
        },
        'en': {
            description: 'Command for viewing their own or others\` information about the level, experience, position in the top',
        },
        'pl': {
            description: 'Polecenie, aby wyświetlić informacje o sobie lub innych na temat poziomu, doświadczenia, pozycji na szczycie',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {

    let lang = {
        'ru': {
            'error': 'Ошибка!',
            'error_level': 'Ошибка отображения уровня',
            'level': 'Уровень',
            'rank': 'Ранг',
            'xp': 'Опыт',
        },
        'ua': {
            'error': 'Помилка!',
            'error_level': 'Помилка відображення рівня',
            'level': 'Рівень',
            'rank': 'Ранг',
            'xp': 'Опит',
        },
        'en': {
            'error': 'Error!',
            'error_level': 'Error while displaying level',
            'level': 'Level',
            'rank': 'Rank',
            'xp': 'XP',
        },
        'pl': {
            'error': 'Pomyłka!',
            'error_level': 'Pomyłka wyświetlania poziomu',
            'level': 'Poziom',
            'rank': 'Ranga',
            'xp': 'Doświadczenie',
        }
    };
    lang = lang[language];
    message.delete();
    let ment_member = message.mentions.members.first();
    let member = message.member;
    if (ment_member)
        member = ment_member;
    request('http://'+process.env.SITE_DOMAIN+'/rank.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+member.user.id, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (body.startsWith('<br')) { message.channel.stopTyping(true);message.channel.send(func.generateErrorMessage(language, client, lang['error'], lang['error_level'])); return message.guild.channels.get(client.log_channels.errors).send(func.generateErrorMessage('ru', client, 'Ошибка', `Ошибка отображения уровня пользователя ${message.author} (${message.author.tag}). Содержание ошибки:\n`+body.replace(/<br \/>/g, '\n').replace(/<\/?b>/g, '**')));}
            const arr = JSON.parse(body);
            const embed = new Discord.RichEmbed()
                .setTitle(lang['level'])
                .addField(lang['rank'], arr[2], true)
                .addField(lang['level'], arr[0], true)
                .addField(lang['xp'], arr[1], true)
                .setDescription(`${member.user} (\`${message.author.tag}\`)`)
                .setFooter("Game🌀Space")
                .setColor(parseInt(func.getRandomInt(0,16777214)));
            if (member.user.id === message.author.id) {
                message.channel.send({embed});
            } else {
                message.reply({embed});
            }
        }
    });
};