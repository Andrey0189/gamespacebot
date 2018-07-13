const Discord = require('discord.js');
const func = require('../../func.js');
const request = require('request');

module.exports.info = {
    command: '^(kiss?|поцел[уй|овать])$',
    name: 'say [msg]',
    lang: {
        'ru': {
            description: 'Поцеловать пользователя',
        },
        'ua': {
            description: 'Поцілувати користувача',
        },
        'en': {
            description: 'Kiss a user',
        },
        'pl': {
            description: 'Pocałuj użytkownika',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
    let lang = {
        'ru': {
            'loading': 'Загрузка',
            'kissed': 'поцеловел(а)',
        },
        'ua': {
            'loading': 'Завантаження',
            'kissed': 'поцілував(ла)',
        },
        'en': {
            'loading': 'Loading',
            'kissed': 'kissed',
        },
        'pl': {
            'loading': 'Ładowanie',
            'kissed': 'pocałował(a)',
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
        request('https://nekos.life/api/v2/img/kiss', function (error, response, body) {
            try {
                let arr = JSON.parse(body);
                let embed = new Discord.RichEmbed()
                    .setTitle(':3')
                    .setDescription(`${user} ${lang['kissed']} ${user1}`)
                    .setImage(arr['url'])
                    .setColor('RANDOM');
                msg.edit(`${user1}`, {embed});
            } catch (e) {console.log(e)}
        });
    });
};