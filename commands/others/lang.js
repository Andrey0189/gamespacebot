const func = require('../../func.js');
const Discord = require('discord.js');
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
let lang_phrases = {
    'ru': {
        'done': 'Готово!',
        'successful': 'Язык изменен на `Русский` успешно!',
    },
    'ua': {
        'done': 'Готово!',
        'successful': 'Мова змінена на `Українська` успішно!',
    },
    'en': {
        'done': 'Success!',
        'successful': 'Language changed to `English` successfully',
    },
    'pl': {
        'done': 'Sukces!',
        'successful': 'Język został zmieniony na `Polski`',
    }
};
module.exports.run = async function (client, message, command, args, info, language) {
    message.delete();
    let lang = '';
    args[0] = args[0].replace(/`/g, "`" + String.fromCharCode(8203));
    if (args[0].match(/([uу][aа]|укр?([ао]ин(ский|а))?|uk(ra?i?n?(e|ian)?)?|укра[їіi]н(ський|[аa]))/im)) lang = 'ua';
    else if (args[0].match(/([rр][uу]|рус?с?к?и?й?|рос?с?и?я?|russ?ian?|р[оу]сс?[іi](йський|я))/im)) lang = 'ru';
    else if (args[0].match(/([eеэа][nн]|англ?([иіi](я|йсь?кий))?|амер[иіi]кан(сь?кий)?|(вел[иіi]ко-? ?)?бр[иіi]тан(ия|сь?кий)|eng?(lish)?|american?|(great-? ?)?britain(ian)?|[iіиеэє]нгл[iіие][шж])/im)) lang = 'en';
    else if (args[0].match(/([pп][lл]|pol(i(sh|sz))?|пол(иш|ь?ский|ян[дт]ский|ян[дт])?|polskiy?)/im)) lang = 'pl';
    else return message.channel.send(func.generateErrorMessage(language, client, `Ошибка! Помилка! Error! Pomyłka!`, `Язык \`${args[0]}\` не существует!\n[^]Мова \`${args[0]}\` не існує!\n[^]Language \`${args[0]}\` not exists!\n[^]Język \`${args[0]}\` nie istnieje!`));
    request('http://'+process.env.SITE_DOMAIN+'/set_lang.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id+'&lang='+lang, function (error, response, body) {
        if (lang === 'ru') {
            if (client.langs.has(message.author.id)) client.langs.delete(message.author.id);
        } else {
            client.langs.set(message.author.id, lang);
        }
        let words = lang_phrases[lang];
        message.channel.send(new Discord.RichEmbed().setColor('77B255').setTitle(words['done']).setDescription(`✅ ${words['successful']}`))
    });
};