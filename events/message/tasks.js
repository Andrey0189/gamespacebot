const Discord = require('discord.js');
const func = require('../../func');
const request = require("request");
module.exports.run = function (message) {
    function newLines (text) {
        let arr = text.split(/\n|\\n+/g);
        arr.forEach((item, num) => {arr[num] = arr[num].trim()});
        return arr;
    }
    let lang = {

    };
    let client = message.client;
    let tasks = client.tasks;
    tasks.filter(task => task[0] === message.author.id).forEach((task) => {
        if (task[2]['action']['action'] === 'send_message') {
            if (task[2]['action']['content_type'] === 'regex') {
                if (message.content.match(new RegExp(task[2]['action']['content'], 'i'))) {
                    request('http://' + process.env.SITE_DOMAIN + '/do_task.php?secret=' + encodeURIComponent(process.env.SECRET_KEY) + '&user=' + task[0] + '&task=' + task[1], function (error, response, body) {
                        try {
                            let arr = JSON.parse(body);
                            // message.reply(task[2]['action']['content']).then(msg => {msg.delete(1000)});
                            if (arr[0] !== arr[1] && task[2]['action']['content'] !== '(.*?)') message.reply('выполнено: **' + arr[0] + '**/**' + arr[1] + '**').then(msg => msg.delete(3000));
                            else if (arr[0] === arr[1]) {
                                let item = arr[2];
                                console.log(arr);
                                let money = client.emojis.get('422055316792803349');
                                let blank = client.emojis.get('465052189774315540');
                                let all = ['**' + item['name'] + '**', newLines(item['task']).join('\n'), '🏆 Награда: **' + item['reward'] + '**' + money, '✅ __***Задание выполнено!***__'];
                                message.author.send({
                                    embed: (new Discord.RichEmbed()
                                            .setColor('36393E')
                                            .setTitle('❗ Задание завершено')
                                            .setDescription(`${all[0]}\n${blank}\n${all[1]}\n${blank}\n${all[3]}\n${all[2]}`)
                                    )
                                });
                                message.reply('задание выполнено.').then(msg => msg.delete(3000));
                            }
                        } catch (e) {
                            message.guild.channels.get(client.log_channels.errors).send(func.generateErrorMessage('ru', client, 'Ошибка выполнения дейлика', e));
                        }
                    });

                }
            }
        }
    });
};