const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.info = {
	command: '^(sa?y?|ска(жи|за(ть|л)?)?)$',
	name: 'say [msg]',
    lang: {
	    'ru': {
	        description: 'Команда для отправки сообщения от имени бота',
        },
        'ua': {
            description: 'Команда для відправки повідомлення від імені бота',
        },
        'en': {
            description: 'Command to send a message as a bot',
        },
        'pl': {
            description: 'Polecenie wysłania wiadomości jako bota',
        }
    },
    access: {
        type: 'any_roles',
        params: ['419562566512017415', '430006994607538201', '417267817763831808', '417312252463677451']
        //own trustedown banhammer admin
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
    let lang = {
        'ru': {
            'send_error': 'Ошибка отправки сообщения',
        },
        'ua': {
            'send_error': 'Помилка відправки повідомлення',
        },
        'en': {
            'send_error': 'Error sending message',
        },
        'pl': {
            'send_error': 'Pomyłka podczas wysyłania wiadomości',
        }
    };
    lang = lang[language];
    let err = func.generateErrorMessage(language, client, 'err', lang['send_error']);
    message.channel.send(args.join(' ')).catch(()=>{message.author.send(err)});
    message.delete().catch(O_o=>{});
};