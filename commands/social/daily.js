const Discord = require('discord.js');
const request = require("request");
const func = require('../../func.js');

module.exports.info = {
    command: '^(tasks?|daily|д[эе]йлики?|задани[яе]|таски?)$',
    name: 'tasks',
    lang: {
        'ru': {
            description: 'Команда для просмотра ежедневных заданий',
        },
        'ua': {
            description: 'Команда для перегляду щоденних завдань',
        },
        'en': {
            description: 'Command for viewing daily tasks',
        },
        'pl': {
            description: 'Polecenie do przeglądania codziennych zadań',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
    let lang = {
        'ru': {
            'loading': 'Загрузка',
            'DM': 'ЛС',
            'done': 'Выполнено',
            'reward': 'Награда',
            'no_task': 'Задания нет.\nПриходи завтра!',
            'daily_tasks': 'Ежедневные задания',
            'task': 'Задание',
        },
        'ua': {
            'loading': 'Завантаження',
            'DM': 'ЛС',
            'done': 'Виконано',
            'reward': 'Нагорода',
            'no_task': 'Завдання немає.\nПриходь завтра!',
            'daily_tasks': 'Щоденні завдання',
            'task': 'Завдання',
        },
        'en': {
            'loading': 'Loading',
            'DM': 'DM',
            'done': 'Done',
            'reward': 'Reward',
            'no_task': 'No task.\nCome tomorrow!',
            'daily_tasks': 'Daily tasks',
            'task': 'Task',
        },
        'pl': {
            'loading': 'Ładowanie',
            'DM': 'ЛС',
            'done': 'Zrobione',
            'reward': 'Nagroda',
            'no_task': 'Niema zadania.\nPrzyjdź jutro!',
            'daily_tasks': 'Codzienne zadania',
            'task': 'Zadanie',
        }
    };
    lang = lang[language];
    let money = client.emojis.get('422055316792803349');
    let blank = client.emojis.get('465052189774315540');
    let all = [];
    message.delete(100);
    message.channel.send(lang['loading'] + '...').then((msg) => {
        request('http://' + process.env.SITE_DOMAIN + '/get_user_tasks.php?secret=' + encodeURIComponent(process.env.SECRET_KEY) + '$lang=' + language + '&user=' + message.author.id, function (error, response, body) {
            msg.edit(message.author + ', ' + lang['DM'] + ' :wink:').then(msg => msg.delete(3000));
            try {
                let tasks_data = JSON.parse(body);
                tasks_data.forEach((item, num) => {
                    if (item !== null) {
                        let done;
                        if (item['active']) item['name'] = '*__' + item['name'] + '__*';
                        if (item['active']) done = '✅ ' + lang['done'] + ': **' + item['done'] + '**/**' + item['count'] + '**'; else done = blank;
                        all[num] = ['**' + item['name'] + '**', func.newLines(item['task']).join('\n'), '🏆 ' + lang['reward'] + ': **' + item['reward'] + '**' + money, done];
                    }
                    else
                        all[num] = [blank.toString(), lang['no_task'], blank, blank]
                });
                let max = 0;
                all.forEach((item, num) => {
                    if (item.size > max) max = item.size;
                });
                all.forEach((item, num) => {
                    if (max > item.size) {
                        let diff = max - item.size;
                        item.concat(Array.from({length: diff}, () => '\n'))
                    }
                });
                message.author.send({
                    embed: (new Discord.RichEmbed()
                            .setColor('36393E')
                            .setTitle('🔔 ' + lang['daily_tasks'])
                            .addField(lang['task'] + ' 1', `${all[0][0]}\n${blank}\n${all[0][1]}\n\n${blank}\n${all[0][3]}\n${all[0][2]}`, true)
                            .addField(lang['task'] + ' 2', `${all[1][0]}\n${blank}\n${all[1][1]}\n${blank}\n${all[1][3]}\n${all[1][2]}`, true)
                            .addField(lang['task'] + ' 3', `${all[2][0]}\n${blank}\n${all[2][1]}\n${blank}\n${all[2][3]}\n${all[2][2]}`, true)
                            .setFooter('Для активирования задания пишите в чат .select [номер задания]')
                    )
                });
            } catch (e) {
                console.log(`Get ${message.author.id} tasks error: ${e}`)
            }
        });
    });
};