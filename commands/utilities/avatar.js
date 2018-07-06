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


    lang = lang[language];
    let member = message.mentions.members.first();
    if (!member)
        member = message.member;
    let colors = getImageColors(message.mentions.users.first().avatarURL).then(color => {
        let c = color.map(col => col.hex());
        const embed = new Discord.RichEmbed()
            .setAuthor(`${member.user.tag}`, member.user.avatarURL)
            .setImage(member.user.avatarURL)
            .setFooter("Game🌀Space")
            .setColor(c[0]);
        message.reply({embed});
        message.delete();
    });
};