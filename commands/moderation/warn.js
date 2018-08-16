const Discord = require('discord.js');
const func = require('../../func.js');
const request = require('request');

module.exports.info = {
    command: '^(warn|(за)?варни?т?ь?)$',
    name: 'warn',
    lang: {
        'ru': {
            description: 'Команда для выдачи предупрежденяи пользователю',
        }
    }
};

module.exports.run = async function (client, message, command, args, info) {
    message.delete();
    let member = message.mentions.members.first();
    if (!member) return message.channel.send(func.generateErrorMessage('ru', client, 'Произошла ошибка!', 'Данный пользователь не является участником сервера!'));
    args.shift();
    let reason = args.join();
    let reasontext = ' по причине `'+reason+'`';
    if (!reason) {
        reason = 'Причина не указана';
        reasontext = ';'
    }
    func.confirm(client, message, `Вы уверены, что хотите выдать предупреждение пользователю \`${member.displayName}#${member.user.discriminator}\`?`, () => {
        request(`'http://${process.env.SITE_DOMAIN}/?action=warn&moderator=${message.author.id}&user=${member.user.id}`, (err, response, data) => {
            // noinspection EqualityComparisonWithCoercionJS
            if (err) {  client.channels.get(client.log_channels.errors).send(func.generateErrorMessage('ru', client, `Произошла ошибка при выдаче предупреждения ${message.author} -> ${member}`, err)); return message.channel.send(func.generateErrorMessage('ru', client, 'Произошла ошибка!', 'Не удалось выдать варн.'));}
            message.channel.send(`Пользователь ${member} получил предупреждение${reasontext} от модератора ${message.author}`)
        })
    })
};