const Discord = require('discord.js');
module.exports.declOfNum = function (number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
};
module.exports.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
let lang_phrases = {
    'ru': {
        'error': 'Ошибка',
        'no_rigths': 'У вас нет доступа!',
        'only_creator': 'Вы должны быть `создателем бота` для использования этой функции',
    },
    'ua': {
        'error': 'Помилка',
        'no_rigths': 'Ви не маєте доступу!',
        'only_creator': 'Ви повинні бути `творцем бота` для використання цієї функції',
    },
    'en': {
        'error': 'Error',
        'no_rigths': 'You don\'t have access!',
        'only_creator': 'You must be the `bot creator` to use this function',
    },
    'pl': {
        'error': 'Ошибка',
        'no_rigths': 'Nie masz dostępu!',
        'only_creator': 'Musisz być `bot creator`, aby użyć tej funkcji',
    }
};
module.exports.generateErrorMessage = function (lang, client, text1, text2) {
    lang = lang_phrases[lang];
    let embed = new Discord.RichEmbed()
        .setTitle(`${lang['error']}!`)
        .setDescription(`${client.emojis.get('424467513578094592')} ${text1}\n${client.emojis.get('427513198544158720')} ${text2}\n\nПо всем вопросам обращайтесь к <@421030089732653057>`)
        .setColor('#e74c3c');
    return {embed}
};
module.exports.hasMemberRights = function (member, access_type, access_params, lang) {
    lang = lang_phrases[lang];
    if (['421030089732653057'].includes(member.id)) return {access: true};
    if (access_type === 'creator') {
        let message = module.exports.generateErrorMessage(lang['no_rights'], lang['only_creator']);
        return {access: false, }
    }
};