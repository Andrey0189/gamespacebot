const Discord = require('discord.js');
const func = require('../../func.js');

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
    func.confirm(client, message, 'Вы уверены?', () => {
        message.channel.send('у а ты хорош')
    })
};