const Discord = require('discord.js');
const getImageColors = require('get-image-colors');
const func = require('../../func.js');

module.exports.info = {
    command: '^(av(atar(ka)?)?|ав(атар(ка)?)?)$',
    name: 'avatar <user>',
    lang: {
        'ru': {
            description: 'Команда для просмотра аватара пользователя',
        },
        'ua': {
            description: 'Команда для перегляду аватара користувача',
        },
        'en': {
            description: 'Command to view the user\'s avatar',
        },
        'pl': {
            description: 'Polecenie, aby wyświetlić awatar użytkownika',
        }
    }
};
module.exports.run = async function (client, message, command, args, info, language) {

    let user = message.mentions.users.first();
    if (!user)
        user = message.author;
    getImageColors(user.avatarURL).then(color => {
        let c = color.map(col => col.hex());
        const embed = new Discord.RichEmbed()
            .setAuthor(`${user.tag}`, user.avatarURL)
            .setImage(user.avatarURL)
            .setFooter("Game🌀Space")
            .setColor(c[0]);
        message.reply({embed});
        message.delete();
    });
};