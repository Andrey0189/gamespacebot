const Discord = require('discord.js');
module.exports.declOfNum = function (number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
};
module.exports.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
module.exports.generateErrorMessage = function (lang, client, text1, text2) {
    let lang_phrases = {
        'ru': {
            'error': 'Ошибка',
            'no_rigths': 'У вас нет доступа!',
            'questions': 'По всем вопросам обращайтесь к',
        },
        'ua': {
            'error': 'Помилка',
            'questions': 'З усіх питань звертайтеся до',
        },
        'en': {
            'error': 'Error',
            'questions': 'For any questions talk to',
        },
        'pl': {
            'error': 'Pomyłka',
            'questions': 'W przypadku wszystkich pytań prosimy o kontakt',
        }
    };
    let language = lang;
    lang = lang_phrases[lang];
    text2 = text2.replace(/\[\^]/gim, client.emojis.get('427513198544158720'));
    let embed = new Discord.RichEmbed()
        .setTitle(`${lang['error']}! [${language.toUpperCase()}]`)
        .setDescription(`${client.emojis.get('424467513578094592')} **${text1}**\n${client.emojis.get('427513198544158720')} ${text2}\n\n${lang['questions']} <@421030089732653057>`)
        .setColor('#e74c3c');
    return {embed}
};
module.exports.hasMemberRights = function (channel, member, access_type, access_params, language) {
    let lang_phrases = {
        'ru': {
            'no_rigths': 'У вас нет доступа!',
            'only_creator': 'Вы должны быть `создателем бота` для использования этой функции',
            '!role': 'Вы должны не иметь роль ',
            'role': 'Вы должны иметь роль ',
            'any_roles': 'Вы должны иметь хотя бы одну из ролей:',
            'all_roles': 'Вы должны иметь все из этих ролей:',
            '!right': 'Вы должны не иметь право ',
            'right': 'Вы должны иметь право ',
            'any_rights': 'Вы должны иметь хотя бы одно из этих прав:',
            'all_rights': 'Вы должны иметь все из этих прав:',
        },
        'ua': {
            'error': 'Помилка',
            'no_rigths': 'Ви не маєте доступу!',
            'only_creator': 'Ви повинні бути `творцем бота` для використання цієї функції',
            '!role': 'Ви повинні не мати роль ',
            'role': 'Ви повинні мати роль ',
            'any_roles': 'Ви повинні мати хоча б одну з ролей:',
            'all_roles': 'Ви повинні мати всі з цих ролей:',
            '!right': 'Ви повинні не мати права ',
            'right': 'Ви повинні мати право ',
            'any_rights': 'Ви повинні мати хоча б одне з цих прав:',
            'all_rights': 'Ви повинні мати всі з цих прав:',
        },
        'en': {
            'error': 'Error',
            'no_rigths': 'You don\'t have access!',
            'only_creator': 'You must be the `bot creator` to use this function',
            '!role': 'You mustn\'t have a role ',
            'role': 'You must have a role ',
            'any_roles': 'You must have at least one of the roles:',
            'all_roles': 'You must have all of these roles:',
            '!right': 'You mustn\'t have a right ',
            'right': 'You must have a right ',
            'any_rights': 'You must have at least one of the rights:',
            'all_rights': 'You must have all of these rights:',
        },
        'pl': {
            'error': 'Pomyłka',
            'no_rigths': 'Nie masz dostępu!',
            'only_creator': 'Musisz być `bot creator`, aby użyć tej funkcji',
            '!role': 'Nie możesz mieć roli ',
            'role': 'Musisz mieć rolę ',
            'any_roles': 'Musisz mieć co najmniej jedną z ról:',
            'all_roles': 'Musisz mieć wszystkie te role:',
            '!right': 'Nie możesz mieć prawa ',
            'right': 'Musisz mieć prawo ',
            'any_rights': 'Musisz mieć co najmniej jedno z tych praw:',
            'all_rights': 'Musisz mieć wszystkie te prawa:',
        }
    };
    let lang = lang_phrases[language];
    if (['421030089732653057'].includes(member.id)) return {access: true};
    if (access_type === 'creator') {
        let message = module.exports.generateErrorMessage(language, member.client, lang['no_rights'], lang['only_creator']);
        return {access: false, message}
    } else if (access_type === 'role') {
        let message = module.exports.generateErrorMessage(language, member.client, lang['no_rights'], lang['role']);
        if (member.roles.has(access_params)) return {access: true};
        else return {access: false, message}
    } else if (access_type === '!role') {
        let message = module.exports.generateErrorMessage(language, member.client, lang['no_rights'], lang['!role']);
        if (!member.roles.has(access_params)) return {access: true};
        else return {access: false, message}
    } else if (access_type === 'any_roles') {
        let access = false;
        access_params.forEach((id) => {
            if (member.roles.has(id)) access = true;
        });
        let message = module.exports.generateErrorMessage(language, member.client, lang['no_rights'], lang['any_roles']);
        if (access) return {access: true};
        else return {access: false, message}
    } else if (access_type === 'all_roles') {
        let access = true;
        access_params.forEach((id) => {
            if (!member.roles.has(id)) access = false;
        });
        let message = module.exports.generateErrorMessage(language, member.client, lang['no_rights'], lang['all_roles']);
        if (access) return {access: true};
        else return {access: false, message}
    } else if (access_type === '!right') {
        let message = module.exports.generateErrorMessage(language, member.client, lang['no_rights'], lang['!right']);
        if (!member.permissionsIn(channel).has(access_params)) return {access: true};
        else return {access: false, message}
    } else if (access_type === 'right') {
        let message = module.exports.generateErrorMessage(language, member.client, lang['no_rights'], lang['right']);
        if (member.permissionsIn(channel).has(access_params)) return {access: true};
        else return {access: false, message}
    } else if (access_type === 'any_rights') {
        let access = false;
        access_params.forEach((rule) => {
            if (!member.permissionsIn(channel).has(rule)) access = true;
        });
        let message = module.exports.generateErrorMessage(language, member.client, lang['no_rights'], lang['any_rights']);
        if (access) return {access: true};
        else return {access: false, message}
    } else if (access_type === 'all_rights') {
        let access = true;
        access_params.forEach((rule) => {
            if (!member.permissionsIn(channel).has(rule)) access = false;
        });
        let message = module.exports.generateErrorMessage(language, member.client, lang['no_rights'], lang['all_rights']);
        if (access) return {access: true};
        else return {access: false, message}
    }
};