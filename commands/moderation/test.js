const request = require("request");
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
    message.delete();
    let lang = args[0].replace(/([uу][aа]|укр?([ао]ин(ский|а))?|uk(ra?i?n?(e|ian)?)?)/im, 'ua').replace(/([rр][uу]|рус?с?к?и?й?|рос?с?и?я?|russ?ian?)/im, 'ru');
    if (!lang.match(/([uу][aа]|[eеа][nн])/))
    request('http://'+process.env.SITE_DOMAIN+'/set_lang.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id, function (error, response, body) {

    });
};