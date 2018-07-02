module.exports.info = {
	command: '^testt?t?o?$',
	name: 'test',
    lang: {
        'ru': {
            description: 'Тестовая команда',
        },
        'ua': {
            description: 'Тестова команда',
        },
        'en': {
            description: 'Test command',
        },
        'pl': {
            description: 'Polecenie testowe',
        }
    }
};
module.exports.run = async function (client, message, command, args, commandinfo) {
    message.channel.send(command);
};