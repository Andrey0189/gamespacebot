module.exports.info = {
	command: '^(lang(uage)?|язык|мова|j(ę|en?)zyk)$',
	name: 'lang',
    lang: {
        'ru': {
            description: 'Команда для изменения языка',
        },
        'ua': {
            description: 'Команда для зміни мови',
        },
        'en': {
            description: 'Command for changing language',
        },
        'pl': {
            description: 'Polecenie do zmiany języka',
        }
    }
};
module.exports.run = async function (client, message, command, args, commandinfo) {
message.channel.send(command);
};