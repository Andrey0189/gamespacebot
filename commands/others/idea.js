const Discord = require('discord.js');
const request = require("request");
const func = require('../../func.js');
const getImageColors = require('get-image-colors');

module.exports.info = {
    command: '^(idey?a|идея|п?р?о?голосова(ни[ея]|ть)|votes?)$',
    name: 'idea [text]',
    lang: {
        'ru': {
            description: 'Команда для предложения идеи серверу',
        },
        'ua': {
            description: 'Команда для пропозиції ідеї серверу',
        },
        'en': {
            description: 'Command to suggest an idea to the server',
        },
        'pl': {
            description: 'Polecenie sugerujące pomysł serwerowi',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
    let lang = {
        'ru': {
            'no_text': 'Вы не указали текст идеи',
            'started': 'Голосование успешно начато!'
        },
        'ua': {
            'no_text': 'Ви не вказали текст ідеї',
            'started': 'Голосування успішно розпочато!'
        },
        'en': {
            'no_text': 'You did not enter the text of the idea',
            'started': 'Voting has been successfully started!'
        },
        'pl': {
            'no_text': 'Nie wpisałeś tekstu pomysłu',
            'started': 'Głosowanie zostało pomyślnie rozpoczęte!'
        }
    };
    lang = lang[language];
    let text = args.join(' ').trim();
    if (text === '' || typeof text === 'undefined' || text === null) return message.author.send(func.generateErrorMessage(language, client, 'err', ''));
    getImageColors(message.author.avatarURL).then(color => {
        let c = color.map(col => col.hex());
        let embed = new Discord.RichEmbed()
            .setDescription(args.join(' '))
            .addField('Author', message.author + ` (\`${message.author.tag}\`)`)
            .setColor(c[0]);
        let nick = message.author.username;
        if (message.member.nickname != null) nick = message.member.nickname;
        message.guild.channels.get(client.log_channels.ideas).createWebhook(nick, message.author.avatarURL).then(webhook => {
            webhook.send('', {embeds: [embed]}).then(async (msg)=>{
                request('http://'+process.env.SITE_DOMAIN+'/idea.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id+'&message='+msg.id+'&text='+encodeURIComponent(args.join(' ')));
                webhook.delete();
                await msg.react('419122029854457866');
                await msg.react('419121999277719562');
                await msg.react('419121914959626240');
            }).catch(console.error);
        }).catch(console.error);
        message.channel.send(lang['started']).then(msg => msg.delete(5000));
        message.delete();
    });
};