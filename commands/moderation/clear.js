const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.info = {
    command: '^(c(le?a?r)?|del(ete?)?|prune?|очист(ить?|ка)?|удал(ить?|ение)?)$',
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
    },
    access: {
        type: 'right',
        params: 'MANAGE_MESSAGES',
    }

};
module.exports.run = async function (client, message, command, args, info, language) {

    let lang = {
        'ru': {
            'successfully_cleared': 'Успешно удалено',
            'arr': ['сообщение', 'сообщения', 'сообщений']
        },
        'ua': {
            'successfully_cleared': 'Успішно видалено',
            'arr': ['повідомлення', 'повідомлення', 'повідомлень']
        },
        'en': {
            'successfully_cleared': 'Successfully deleted',
            'arr': ['message', 'messages', 'messages']
        },
        'pl': {
            'successfully_cleared': 'Pomyślnie usunięto',
            'arr': ['wiadomość', 'postów', 'postów']
        }
    };
    lang = lang[language];
    message.delete().then(() => {
        func.clear_count(lang['successfully_cleared'], lang['arr'], message.channel, parseInt(args[0]));
    });
};