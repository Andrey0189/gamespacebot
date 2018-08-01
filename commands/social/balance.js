const Discord = require('discord.js');
const request = require("request");
const func = require('../../func.js');

module.exports.info = {
    command: '^(bal(ance)?|бал(анс)?|mone[yt]|деньги|б[ао]бло)$',
    name: 'balance <user>',
    lang: {
        'ru': {
            description: 'Команда для просмотра баланса',
        },
        'ua': {
            description: 'Команда для перегляду балансу',
        },
        'en': {
            description: 'Command to view the balance',
        },
        'pl': {
            description: 'Polecenie przeglądania bilansu',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
    let lang = {
        'ru': {
            'balance': 'Баланс',
        },
        'ua': {
            'balance': 'Баланс',
        },
        'en': {
            'balance': 'Balance',
        },
        'pl': {
            'balance': 'Bilans',
        }
    };
    lang = lang[language];
    message.delete();
    let ment_member = message.mentions.members.first();
    let member = message.member;
    if (ment_member)
        member = ment_member;
    console.log('http://'+process.env.SITE_DOMAIN+'?action=balance&secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+member.user.id);
    request('http://'+process.env.SITE_DOMAIN+'?action=balance&secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+member.user.id, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const money = client.emojis.get('422055316792803349');
            if (!func.isNumeric(body)) return;
            const embed = new Discord.RichEmbed()
                .setTitle(lang['balance'])
                .setDescription(`${member.user} (\`${member.user.tag}\`)\n\n${money}${body}`)
                .setFooter("Game🌀Space")
                .setColor(parseInt(func.getRandomInt(0,16777214)));
            if (member.user.id === message.author.id) {
                message.channel.send(embed);
            } else {
                message.reply(embed);
            }
        }
    });
};