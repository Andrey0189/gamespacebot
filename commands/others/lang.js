const func = require('../../func.js');
const request = require("request");
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
let lang = {
    'ru': {
        'main_server': 'Основной сервер',
        'api_server': 'API сервер',
        'ms': 'мс',
        'ping': 'Пинг',
        'calculation': 'Расчет',
        'only_bots': 'Внимание! Это пинг бота, а не Ваш!',
    },
    'ua': {
        'main_server': 'Основний сервер',
        'api_server': 'API сервер',
        'ms': 'мс',
        'ping': 'Пінг',
        'calculation': 'Розрахунек',
        'only_bots': 'Увага! Це пінг бота, а не Ваш!',
    },
    'en': {
        'main_server': 'Main server',
        'api_server': 'API server',
        'ms': 'ms',
        'ping': 'Ping',
        'calculation': 'Calculation',
        'only_bots': 'Attention! This is ping of bot, not yours!',
    },
    'pl': {
        'main_server': 'Główny serwer',
        'api_server': 'API serwer',
        'ms': 'ms',
        'ping': 'Ping',
        'calculation': 'Obliczanie',
        'only_bots': 'Uwaga, proszę! Ten ping bota, nie twój!',
    }
};
module.exports.run = async function (client, message, command, args, info, language) {
    message.delete();
    let lang = '';
    if (args[0].match(/([uу][aа]|укр?([ао]ин(ский|а))?|uk(ra?i?n?(e|ian)?)?|укра[їіi]н(ський|[аa]))/im)) lang = 'ua';
    else if (args[0].match(/([rр][uу]|рус?с?к?и?й?|рос?с?и?я?|russ?ian?|р[оу]сс?[іi](йський|я))/im)) lang = 'ru';
    else if (args[0].match(/([eеэа][nн]|англ?([иіi](я|йсь?кий))?|амер[иіi]кан(сь?кий)?|(вел[иіi]ко-? ?)?бр[иіi]тан(ия|сь?кий)|eng?(lish)?|american?|(great-? ?)?britain(ian)?|[iіиеэє]нгл[iіие][шж])/im)) lang = 'en';
    else if (args[0].match(/([pп][lл]|pol(i(sh|sz))?|пол(иш|ь?ский|ян[дт]ский|ян[дт])?|polskiy?)/im)) lang = 'pl';
    else return message.channel.send(func.generateErrorMessage());
    request('http://'+process.env.SITE_DOMAIN+'/set_lang.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id+'&lang='+lang, function (error, response, body) {
        if (lang === 'ru') {
            if (client.langs.has(message.author.id)) client.langs.delete(message.author.id);
        } else {
            client.langs.set(message.author.id, lang);
        }
    });
};