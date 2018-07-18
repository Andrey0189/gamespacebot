const Discord = require('discord.js');
const func = require('../../func.js');
const request = require('request');

module.exports.info = {
    command: '^(h[ua]g|обн([еи]ма|я)тт?ь?и?)$',
    name: 'hug [msg]',
    lang: {
        'ru': {
            description: 'Обнять пользователя',
        },
        'ua': {
            description: 'Обняти користувача',
        },
        'en': {
            description: 'Hug a user',
        },
        'pl': {
            description: 'Przytulić użytkownika',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
    let lang = {
        'ru': {
            'loading': 'Загрузка',
            'hugged': 'обнял(а)',
        },
        'ua': {
            'loading': 'Завантаження',
            'hugged': 'обняв(ла)',
        },
        'en': {
            'loading': 'Loading',
            'hugged': 'hugged',
        },
        'pl': {
            'loading': 'Ładowanie',
            'hugged': 'przytulił(a)',
        }
    };
    lang = lang[language];
    message.delete();
    let user = message.author;
    let user1 = message.mentions.users.first();
    if (!user1 || user1.id === user.id) {
        user = client.user;
        user1 = message.author;
    }
    message.channel.send(lang['loading']+'...').then(msg => {
        request('https://nekos.life/api/v2/img/hug', function (error, response, body) {
            try {
                let arr = JSON.parse(body);
                let embed = new Discord.RichEmbed()
                    .setTitle(':3')
                    .setDescription(`${user} ${lang['hugged']} ${user1}`)
                    .setImage(arr['url'])
                    .setColor('RANDOM');
                msg.edit(`${user1}`, {embed});
            } catch (e) {console.log(e)}
        });
    });
};