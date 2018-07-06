const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.info = {
    command: '^(c(le?a?r)|del(ete?)?|prune?|очист(ить?|ка)|удал(ить?|ение))$',
    name: 'clear [num]',
    lang: {
        'ru': {
            description: 'Команда для очистки определенного кол-ва сообщений в чате',
        },
        'ua': {
            description: 'Команда для очищення певної кількості повідомлень в чаті',
        },
        'en': {
            description: 'A command to clear a certain number of messages in a chat',
        },
        'pl': {
            description: 'Polecenie wyczyszczenia pewnej liczby wiadomości na czacie',
        }
    }
};
module.exports.run = async function (client, message, command, args, info, language) {
    message.delete().then(() => {
        func.clear_count(message.channel, parseInt(args[0]));
    });
};