const Discord = require('discord.js');
const func = require('../../func.js');
const request = require("request");

module.exports.info = {
    command: '^(sel(e[cg][dt]([-_=]t[auo]sk)?)?|выбрать?и?([-_=](задание|д[еэ]йлик|завдання))?)$',
    name: 'select [number]',
    lang: {
        'ru': {
            description: 'Команда для активации ежедневного задания',
        },
        'ua': {
            description: 'Команда для активації щоденного завдання',
        },
        'en': {
            description: 'Command to activate the daily task',
        },
        'pl': {
            description: 'Polecenie aktywowania codziennego zadania',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {

    let lang = {
        'ru': {
            'succ': 'Задание `',
            'succ1': '` активировано успешно!',
            'already': 'У вас уже есть активное задание!',
            'err': 'Произошла ошибка',
        },
        'ua': {
            'succ': 'Завдання `',
            'succ1': '` активовано успішно!',
            'already': 'Ви вже маєте активоване завдання!',
            'err': 'Сталася помилка',
        },
        'en': {
            'succ': 'Task `',
            'succ1': '` was activated successfully!',
            'already': 'You already have an active task!',
            'err': 'There is an error',
        },
        'pl': {
            'succ': 'Zadanie `',
            'succ1': '` zostało pomyślnie aktywowane!',
            'already': 'Masz już aktywne zadanie!',
            'err': 'Wystąpiła pomyłka',
        }
    };
    lang = lang[language];
    message.delete();
    let arr = [1, 2, 3];
    let num = parseInt(args[0]);
    if (!arr.includes(num)) return message.channel.send(lang['err']);
    request('http://' + process.env.SITE_DOMAIN + '/action=select_task&task=' + encodeURIComponent(num) + '&secret=' + encodeURIComponent(process.env.SECRET_KEY) + '&user=' + message.author.id, function (error, response, body) {
        try {
            if (body === '') {
                message.channel.send(lang['succ']+num+lang['succ1']);
            } else if (body === 'err') {
                console.error('Получен код \'err\' от сайта', 'выбора дейлика');
                return message.channel.send(lang['err'])
            } else {
                return message.channel.send(lang['already']);
            }
        } catch (e) {console.error(e)}
    });
    request('http://'+process.env.SITE_DOMAIN+'/get_active_tasks.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+client.user.id, function (error, response, body) {
        try {client.tasks = JSON.parse(body);} catch (e) {console.log('--- tasks get failed: '+e);console.log(body)}
    });
};