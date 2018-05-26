/*
*
* WARNING!
* Использование этого кода в полной мере или частично позволяется только на некоммерческих основаниях после разрешения автора.
* Для связи с автором можете использовать данные реквизиты:
* Discord: zziger#8040
* Telegramm: @zziger
* VK: https://vk.com/zziger (автор тут бывает редко)
*
* Бот написан специально для сервера GameSpace в Discord.
* Ссылка-приглашение на сервер: https://discord.io/gspace
*
* Репозиторий SpaceBot Moderator: https://github.com/zziger/gamespacemoderator
*
* Copyright 2018 © GameSpace. Все права защищены.
* Нарушение авторских прав преследуется законом.
*
* CC-BY-NC-SA
* http://creativecommons.org/licenses/by-nc-sa/4.0/
*
* */

// Подключение Discord.js
const Discord = require('discord.js');
// Подключение request
const request = require("request");
// Подключение rgbcolor
const rgbcolor = require('rgbcolor');
// Подключение get-image-colors
const getImageColors = require('get-image-colors');
// Подключение util
const { inspect } = require("util");
// Подключение vm
const vm = require("vm");
// Создание нового контекста
const codeContext =  {};
vm.createContext(codeContext);
// Создание клиента Discord
const client = new Discord.Client({ autofetch: [
    'MESSAGE_CREATE',
    'MESSAGE_UPDATE',
    'MESSAGE_REACTION_ADD',
    'MESSAGE_REACTION_REMOVE',
]});
// Основные роли, предоставляющие некоторые права
const rule = {
    own: "419562566512017415",
    trusted_own: "430006994607538201",
    ban_hammer: "417267817763831808",
    game_admin: "417312252463677451",
    moder: "426411685595578382"
};
// Массив людей, обходящих основные права бота
// Eclipse, спасибо тебе за помощь, бот перенесен на хост, так что дальше я сам.
const creators = ['421030089732653057'];
// Основные эмодзи, доступные боту
const emojis = {
    up:'418748638081318912',
    stop:'418748635820326912',
    shuffle:'418748638173462528',
    repeat1:'418748637531865089',
    repeat:'418748637649174535',
    play:'418748635765800961',
    pause:'418748635329855489',
    ok:'418748637502504972',
    forward:'418748554899881994',
    down:'418748613733122058',
    back:'418748554014752770',
    ABCD:'418748554518069249',
    abcd:'418748553985261568',
    abc:'418748552802598927',
    protiv:'419121914959626240',
    neznayu:'419121999277719562',
    za:'419122029854457866',
    obnimayu:'421647583551684609',
    money:'422055316792803349',
    error: '424467513578094592',
    facepalm: '429211566756462592',
    hugl: '449573567852707841'
};
// Люди, которые получили опыт в течении минуты
const talkedRecently = new Set();
// Люди, которые уже обращались к боту. Используется для создания кд в 15 секунд
const commandCooldown = new Set();
// Каналы, в которых разрешено уведомление о новом левле
const newLevelNotificationChannels = ['417266234032390155', '418096126957453337', '421625843320750080', '421664477662937098', '417674070046277632', '421558850681044993'];
// Переменная, отключаящая функции, которые связаны с сайтом
let siteOff = false;
// Каналы, в которых бот имеет право выполнять все команды
const botFullRights = ['418096126957453337', '421558850681044993'];
// Массив ролей за уровни
const level_roles = [[2, '417389665042169876'], [5, '417391646863523858'], [10, '417391865038635010'], [15, '417392325405442058'], [20, '417393247162204160'], [23, '417392902872891393'], [25, '417392121541296128'], [28, '417392180747829249'], [30, '417392444750168075']];
// Основные каналы
const channels = {'errs': '432071031356915722'};
let tasks = [];

// безразмерная пустота " ⃠ "


/** @namespace process.env.PREFIX */
/** @namespace process.env.BOT_TOKEN */
/** @namespace process.env.SITE_DOMAIN */
/** @namespace process.env.SECRET_KEY */
/** @namespace process.env.WEBHOOK_ID */
/** @namespace process.env.WEBHOOK_TOKEN */
/** @namespace process.env.WEB_MEMORY */
/** @namespace process.env.MEMORY_AVAILABLE */
/** @namespace process.env.POSLANIYE */
/** @namespace process.env.DYNO */
/** @namespace process.env.PORT */


//Подбор формы слова в зависимости от числительного
function declOfNum(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

//Провека, является строка числом или нет
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//Генератор случайного числа между min и max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Функция, добавляющая несколько реакций под сообщением
async function multipleReact(message, arr) {
    if (arr !== []) {
        await message.react(arr.shift()).catch(console.error).then(function () {multipleReact(message,arr).catch();});
    }
}

//Функция для очистки определенного кол-ва сообщений в чате
function clear_count (channel, count, count_all = 0) {
    if (count > 100) {
        count_all = count_all + 100;
        channel.bulkDelete(100).then(() => {clear_count(channel, count-100, count_all)});
    } else {
        channel.bulkDelete(count).then(messages => {
            count_all = count_all + messages.size;
            channel.send(`Удалено ${count_all} ${declOfNum(count_all, ['сообщение','сообщения','сообщений'])}.`).then((msg) => {msg.delete(3000);});
        });
    }
}

//Функция, возвращая обьект RichEmbed, который стилизирован под ошибку
function embed_error(text) {
    let error_emoji = client.emojis.get(emojis.error);
    return new Discord.RichEmbed()
        .setTitle('Ошибка')
        .setColor('#C34E4E')
        .setFooter('Game🌀Space')
        .setDescription(`${error_emoji} ${text}`);
}

//Функция, которая добавляет команду
function add_command(aliases, onlyInBotChat, message, command, args, access_type, access_params, command_function, pattern = null, description = null) {
    if (onlyInBotChat) {
        if (!botFullRights.includes(message.channel.id)) return;
    }
    if (typeof aliases !== 'object')
        return console.error('Error: command aliases aren\'n array');
    let embed;
    let error = false;
    if (!creators.includes(message.author.id) && !message.member.roles.has('419562566512017415'))
    if (access_type === 'rules') {
        let rights_arr = [];
        let err = false;
        access_params.forEach(function (item) {
            if (!message.member.hasPermission(item, false, true, true)) {
                err = true;
                rights_arr.push(item);
            }
        });
        if (err === true) {
            let a = '';
            let required = 'которые требуются';
            let rigths = rights_arr.join('`, `');
            if (access_params.length === 1) {
                a = 'а';
                required = 'которое требуется';
            }
            embed = embed_error(`${message.author} (\`${message.author.tag}\`), извините, но у Вас нет прав${a} \`${rigths}\`, ${required} для выполнения данной команды\n\nЕсли Вы считаете, что это не так - обратитесь к <@421030089732653057>`);
            error = true;
        }
    } else if (access_type === 'roles') {
        if (!message.member.roles.some(r=>access_params.includes(r.id))) {
            let a = 'ни одной из ролей';
            let roles = '';
            let required = 'которые требуются';
            access_params.forEach(function (item, number, arr) {
                if (number === arr.size-2)
                roles = roles + message.guild.roles.get(item) + 'или ';
                else
                roles = roles + message.guild.roles.get(item) + ', ';
            });
            if (access_params.length === 1) {
                a = 'роли';
                required = 'которая требуется';
            }
            embed = embed_error(`${message.author} (\`${message.author.tag}\`), извините, но у Вас нет ${a} ${roles}${required} для выполнения данной команды\n\nЕсли Вы считаете, что это не так - обратитесь к <@421030089732653057>`);
            error = true;
        }
    } else if (access_type === 'beta') {
        if (!message.member.roles.has('448443783785349120')) {
            embed = embed_error(`${message.author} (\`${message.author.tag}\`), извините, но Вы должны быть бета-тестером бота для выполнения данной команды\n\nЕсли Вы хотите стать бета-тестером - обратитесь к <@421030089732653057>`);
            error = true;
        }
    } else if (access_type === 'creat') {
        embed = embed_error(`${message.author} (\`${message.author.tag}\`), извините, но Вы должны быть создателем бота для выполнения данной команды\n\nЕсли Вы считаете, что это не так - обратитесь к <@421030089732653057>`);
        error = true;
    }
    if (!error && pattern !== 'hid') {
        let cmd = '';
        if (pattern !== null)
            cmd = cmd + `\`${aliases[0]} ${pattern}\``;
        else
            cmd = cmd + `\`${aliases[0]}\``;

        if (description !== null)
            cmd = cmd + ` — ${description}`;
        help_commands.push(cmd);
    }
    if (!aliases.includes(command)) return;
    if (error) return message.channel.send({embed});
    if (!message.member.roles.some(r=>[rule.game_admin, rule.ban_hammer].includes(r.id)))
    if (!commandCooldown.has(message.author.id)) {
        commandCooldown.add(message.author.id);
        setTimeout(() => {
            commandCooldown.delete(message.author.id);
        }, 10000);
    } else {
        return message.channel.send('Хэй-хэй, '+message.author+', остынь! Тебе нужно немного подождать, чтоб еще раз обратится ко мне :D');
    }
    command_function();
}

// function getSizeCoef (text) {
//     let cap = text.match(/[A-ZА-ЯІЇЄ]/g);
//     if (!cap) cap = [];
//     let sma = text.match(/[ a-zа-яії'є\-]/g);
//     if (!sma) sma = [];
//     let emo = text.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug);
//     if (!emo) emo = [];
//     let tot = text.length - (cap.length + sma.length + emo.length);
//     return cap.length + sma.length * 0.5 + emo.length * 2 + tot;
// }

function newLines (text) {
    let arr = text.split(/\n|\\n+/g);
    arr.forEach((item, num) => {arr[num] = arr[num].trim()});
    return arr;
}


String.prototype.replaceAll = function(search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

setInterval(function(){
    client.guilds.get('417266233562365952').members.filter(memb => memb.displayName.startsWith('!')).forEach(member => member.setNickname(member.displayName.replace(/^!+/gi, '')).catch())
}, 300000);

client.on("messageUpdate", (old_mess, new_mess) => {
    if (old_mess.channel.id === '445108574688116746' && !old_mess.author.bot) {new_mess.delete();return new_mess.author.send(`${client.emojis.get(emojis.error)} В канале ${new_mess.channel} нельзя изменять сообщения!`);}
});

client.on("guildMemberUpdate", (old_memb, new_memb) => {
    if (new_memb.displayName.startsWith('!')) new_memb.setNickname(new_memb.displayName.replace(/^!+/gi, '')).catch();
});

client.on("userUpdate", (old_user, new_user) => {
    if (client.guilds.get('417266233562365952').members.get(new_user.id).displayName.startsWith('!')) client.guilds.get('417266233562365952').members.get(new_user.id).setNickname(client.guilds.get('417266233562365952').members.get(new_user.id).displayName.replace(/^!+/gi, '')).catch();
});

client.on("presenceUpdate", (old_user, new_user) => {
    if (!old_user.roles.some(r=>['432401348903043073'].includes(r.id))) return;
    if (!new_user.presence.game) return;
    if (old_user.presence.game) {
        if (old_user.presence.game.streaming) return;
    }
    if (!new_user.presence.game.streaming) return;
    client.channels.get('417266234032390155').send(`📺 Хей, ребят! ${old_user.user} начал стрим! Заходим! ${new_user.presence.game.url}`);
});

client.on('ready', () => {
	console.log('//------------------//');
    console.log('Бот запущен успешно.');
    console.log('');
    console.log('Краткая информация:');
    console.log('- Авторизован как ' + client.user.tag);
    console.log('- Бот является участником ' + client.guilds.size + ' ' + declOfNum(client.guilds.size, ['сервера', 'серверов', 'серверов']));
    console.log('- Команды, для работы которых требуется сайт ' + (siteOff ? 'выключены' : 'включены'));
    console.log('');
    client.fetchUser('421030089732653057').then(user => {
        console.log('Автор ' +  user.tag );
        console.log('Специально для сервера GameSpace. https://discord.io/gspace');
        console.log('//------------------//');
    });
});
client.on('ready', () => {
    client.user.setPresence({ game: { name: `по сторонам`, type: 3 } }).catch();
    request('http://'+process.env.SITE_DOMAIN+'/get_active_tasks.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+client.user.id, function (error, response, body) {
        try {tasks = JSON.parse(body);} catch (e) {console.log('//--- tasks get failed: '+e);}
    });
});

setInterval(() => {
    request('http://'+process.env.SITE_DOMAIN+'/get_active_tasks.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+client.user.id, function (error, response, body) {
        try {tasks = JSON.parse(body);} catch (e) {console.log('//--- tasks get failed: '+e);}
    });
}, 20000);

client.on("guildMemberAdd", member => {
    const embed = new Discord.RichEmbed()
        .setTitle('Приветствую тебя на нашем укромном уголочке!')
        .setColor("#3B024D")
        .setDescription("На нашем сервере ты сможешь пообщаться или найти новых друзей для совместной игры. Присутствует услуга приватной комнаты, по вашей просьбе мы сделаем специально для вас отдельный уголок в категории players_rooms ( Вы сможете полностью настраивать один канал ).\n" +
        "***Мы рады, что вы решили посетить нас.***\n" +
        "P.S - По всем вопросам, обращаться к @\\🎮GameAdmin\\🎮 .\n" +
        `На данный момент на сервере **${member.guild.memberCount} ${declOfNum(member.guild.memberCount, ['человек', 'человека', 'человек'])}**\n\nhttps://discord.io/gspace/`)
        .setFooter("Game🌀Space")
        .setThumbnail(member.guild.iconURL)
        .setImage('https://cdn.discordapp.com/attachments/416813030702055425/421732235549605909/e16f6ad2e888203e52ea7b204c8d3feb.png')
        .setTimestamp();
    member.send({embed});
});

client.on("message", async message => {
    //Системные команды
    if (message.channel.id === '421260737281785856') {
        if(!message.author.bot) return;
        if(message.author.discriminator !== '0000') return;
        if(message.content.indexOf(process.env.PREFIX) !== 0) return;
        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (command === 'update_games') {
            if (!args[0]) return;
            let user = message.guild.members.get(args.shift());
            let json = args.join(' ');
            if (!user) return;
            if (json.startsWith('<br')) { return message.guild.channels.get(channels.errs).send({embed: embed_error(`Ошибка обновления игровых ролей пользователя ${message.author} (${message.author.tag}). Содержание ошибки:\n`+json.replace(/<br \/>/g, '\n').replace(/<b>/g, '**').replace(/<\/b>/g, '**'))});}
            let array = JSON.parse(json);
            array.forEach(function (item) {
                if (item[1] === '1') {
                    if (!user.roles.has(item[0]))
                        user.addRole(item[0]).catch(console.error);
                } else {
                    if (user.roles.has(item[0]))
                        user.removeRole(item[0]).catch(console.error);
                }
            })
        }

        if (command === 'set_color') {
            if (!args[0]) return;
            let user = message.guild.members.get(args[0]);
            if (!user) return;
            if (!args[1]) return;
            let role1 = message.guild.roles.get(args[1]);
            if (!role1) return;
            if (!role1.name.startsWith('✨')) return;
            user.roles.filter(role => role.name.startsWith('✨')).forEach(function (role) {
                user.removeRole(role).catch(console.error);
            });
            user.addRole(args[1]).catch(console.error);
        }
        return;
    }


    if (message.channel.id === '445108574688116746' && !message.author.bot) {
        message.channel.fetchMessages({limit: 2}).then(msgs => {
            if (msgs.last().author.id === message.author.id) {message.author.send(`${client.emojis.get(emojis.error)} Играть самому с собой нельзя :D`).then((msg) => {message.delete();});return;}
            let word = msgs.last().edits.pop().content.match(/([А-Яа-яa-zA-Zё\-]+).?(.*?)?/im)[1];
            if (!word) {message.author.send(`${client.emojis.get(emojis.error)} Где слово?? о_О`).then((msg) => {message.delete();});return;}
            let charAt = 1;
            while (['ъ', 'ь', 'ы', '-', '', ' '].includes(word.charAt(word.length - charAt).toLowerCase())) {
                charAt++;
            }
            if (charAt >= word.length) {message.author.send(`${client.emojis.get(emojis.error)} Где слово?? о_О`).then((msg) => {message.delete();});return;}
            if (word.charAt(word.length - charAt).toLowerCase() !== message.content.match(/([А-Яа-яa-zA-Zё\-]+).?(.*?)?/im)[1].charAt(0).toLowerCase()) {
                message.author.send(`${client.emojis.get(emojis.error)} Ваше слово должно начинаться с \`${word.charAt(word.length - charAt).toLowerCase()}\``).then((msg) => {
                    message.delete();
                });
            }

        });
        return;
    }

    //Выставление реакций в #votes
    if (message.channel.id === '421287649995784193') {
        return multipleReact(message, [emojis.za, emojis.neznayu, emojis.protiv]).catch();
    }

    //Игнорирование некоторых типов каналов
    if (['dm', 'group', 'category', 'voice'].includes(message.channel.type)) return;

    //Авто-покидание чужих серверов
    if (!['417266233562365952', '416813030232424462', '432496701614325762'].includes(message.guild.id)) {
        message.guild.leave().catch();
        return;
    }
    //Добавление опыта
    if (!siteOff)
    if (!talkedRecently.has(message.author.id)) {
        if (message.author.bot) return;
        request('http://'+process.env.SITE_DOMAIN+'/add.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                if (body.startsWith('<br')) { return message.guild.channels.get(channels.errs).send({embed: embed_error(`Ошибка добавления уровня пользователю ${message.author} (${message.author.tag}). Содержание ошибки:\n`+body.replace(/<br \/>/g, '\n').replace(/<b>/g, '**').replace(/<\/b>/g, '**'))});}
                let lvls = JSON.parse(body);
                if (parseInt(lvls[0]) !== parseInt(lvls[1])) {
                    let msg = `Ура, ${message.author} получил ${lvls[1]} уровень! Поздравьте его`;
                    if (newLevelNotificationChannels.includes(message.channel.id)) {
                        message.channel.send(msg);
                    } else {
                        client.channels.get('417266234032390155').send(msg);
                    }
                    level_roles.forEach(function (item) {
                        if (lvls[1] >= item[0]) {
                            if (!message.member.roles.has(item[1])) {
                                message.member.addRole(item[1]).catch(console.error);
                                message.author.send(`Вы получили роль \`${message.guild.roles.get(item[1]).name}\``);
                            }
                        } else {
                            if (message.member.roles.has(item[1])) {
                                message.member.removeRole(item[1]).catch(console.error);
                            }
                        }
                    });
                }
            }
        });
        talkedRecently.add(message.author.id);
        setTimeout(() => {
            talkedRecently.delete(message.author.id);
        }, 60000);
    }

    //Игнорирование ботов
	if(message.author.bot) return;

    tasks.filter(task => task[0] === message.author.id).forEach((task) => {
        if (task[2]['action']['action'] !== 'send_message') return;
        if (task[2]['action']['content_type'] === 'regex') {
            if (message.content.match(new RegExp(task[2]['action']['content'], 'i'))) {
                request('http://'+process.env.SITE_DOMAIN+'/do_task.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+task[0]+'&task='+task[1], function (error, response, body) {
                    try {
                        let arr = JSON.parse(body);
                        if (arr[0] !== arr[1]) message.reply('выполнено: **'+arr[0]+'**/**'+arr[1]+'**').then(msg=>msg.delete(5000));
                        else if (arr[0] === arr[1]) {
                            request('http://' + process.env.SITE_DOMAIN + '/get_user_tasks.php?secret=' + encodeURIComponent(process.env.SECRET_KEY) + '&user=' + message.author.id, function (error, response, body1) {
                                try {
                                    let tasks_data = JSON.parse(body1);
                                    tasks_data[task[1]] = arr[2];
                                    let money = client.emojis.get(emojis.money);
                                    let blank = client.emojis.get('435119671143038986');
                                    let all = [];
                                    tasks_data.forEach((item, num) => {
                                        if (item !== null) {
                                            let done;
                                            if (item['active']) item['name'] = '*__' + item['name'] + '__*';
                                            if (item['active']) done = '✅ Выполнено: **' + item['done'] + '**/**' + item['count'] + '**'; else done = blank;
                                            all[num] = ['**' + item['name'] + '**', newLines(item['task']).join('\n'), '🏆 Награда: **' + item['reward'] + '**' + money, done];
                                        }
                                        else
                                            all[num] = [blank.toString(), 'Задания нет.\nПриходи завтра!', blank, blank]
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
                                    all[task[1]][3] = '✅ __***Задание выполнено!***__';
                                    message.author.send({
                                        embed: (new Discord.RichEmbed()
                                                .setColor('36393E')
                                                .setTitle(':bell: Ежедневные задания')
                                                .addField('Задание 1', `${all[0][0]}\n${blank}\n${all[0][1]}\n\n${blank}\n${all[0][3]}\n${all[0][2]}`, true)
                                                .addField('Задание 2', `${all[1][0]}\n${blank}\n${all[1][1]}\n${blank}\n${all[1][3]}\n${all[1][2]}`, true)
                                                .addField('Задание 3', `${all[2][0]}\n${blank}\n${all[2][1]}\n${blank}\n${all[2][3]}\n${all[2][2]}`, true)
                                        )
                                    });
                                } catch (e) {}
                            });
                        }
                    } catch(e) {message.guild.channels.get(channels.errs).send({embed: embed_error(`Ошибка отображения топа пользователей. Содержание ошибки:\n`+e)});}
                });

            }
        }
    });

    //Проверка на содержания сообщением префикса, создание констант args и command
    if(message.content.indexOf(process.env.PREFIX) !== 0) return;
	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();

  	//Массив, содержащий в себе все команды, которые доступны пользователю
  	help_commands = [''];

  	/*----- START COMMANDS -----*/
    add_command(['скажи', 'say', 's'], false, message, command, args, 'roles', [rule.ban_hammer, rule.game_admin], function () {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{});
        const embed = embed_error(`${message.author}, неизвестная ошибка отправки сообщения в чат`);
        let msg = message.channel.send(sayMessage).catch(()=>{message.reply({embed});});
    }, '[текст]', 'написать сообщение от имени бота');

    add_command(['очистить', 'clear', 'del', 'clr'], false, message, command, args, 'rules', ['MANAGE_MESSAGES'], function () {
        message.delete().then(() => {
            clear_count(message.channel, parseInt(args[0]));
        });

    }, '[кол-во]', 'очистить определенное количество сообщений');

    add_command(['аватарка', 'avatar', 'av', 'ав'], false, message, command, args, 'e', null, function() {
        let member = message.mentions.members.first();
        const error = embed_error(`${message.author}, человек, у которого вы пыталисть взять аватарку не является участником сервера`);
        if (!member)
            return message.channel.send({embed: error});
        let colors = getImageColors(message.mentions.users.first().avatarURL).then(color => {
            let c = color.map(col => col.hex());
            const embed = new Discord.RichEmbed()
                .setTitle(`Аватарка пользователя ${member.user.tag}`)
                .setImage(member.user.avatarURL)
                .setFooter("Game🌀Space")
                .setColor(c[0])
                .setDescription('Аватарка предоставлена по запросу '+ message.author + ' (`'+message.author.tag+'`)');
            message.channel.send({embed});
            message.delete();
        });
    }, '[пользователь]', 'отобразить аватарку пользователя');

    add_command(['игры', 'games'], false, message, command, args, 'e', null, function () {
        const embed = new Discord.RichEmbed()
            .setTitle('')
            .setColor(parseInt(getRandomInt(0,16777214)))
            .setDescription('**Бои петухов ~~не админов~~\n' +
                'Чтобы участвовать в боях петухов, вы должны приобрести собственного петуха.\n' +
                '- Приобрести собственного петуха `s!buy-item Chicken`(Цена- 1500 Jd💸)\n' +
                'После вы можете участвовать в петушиных боях.\n' +
                '- Участвовать в петушиных боях `s!cock-fight {Ставка}`\n' +
                '\n' +
                ' Рулетка:\n' +
                'Вы можете поставить ставку в игре.\n' +
                '- Поставить ставку `s!roulette \{сумма\} \{игровая площадка\}`\n' +
                '\n' +
                'Игровые площадки:\n' +
                '[x36]** Номера { любой номер от 1-36}\n' +
                '**[x 3]** Множества`{1-12} {13-24} {25-36}`\n' +
                '**[x 3]** Столбцы `{1st} {2nd} {3rd}`\n' +
                '**[x 2]** Половины `{1} {2}`\n' +
                '**[x 2]** Нечетный - `{odd}` , четный - `{even}`\n' +
                '**[x 2]** Цвета `{red} {black}`\n' +
                '\n' +
                '**x** - умножение вашей ставки при победе.\n' +
                '\n' +
                '***Примеры:***\n' +
                '`s!roulette 200 odd`\n' +
                '`s!roulette 600 2nd`**');
        message.reply({embed});
        message.delete();
    }, '', 'информация об играх');

    add_command(['экономика', 'economy'], false, message, command, args, 'e', null, function () {
        const embed = new Discord.RichEmbed()
            .setTitle('')
            .setColor(parseInt(getRandomInt(0,16777214)))
            .setDescription('***FAQ по экономике на сервере***\n' +
                '**Для чего она нужна?\n' +
                'За внутрисерверную валюту вы можете купить цветные роли и предметы.\n' +
                '\n' +
                'Команды бота\n' +
                '- Проверка вашего баланса.  `s!money`\n' +
                '- Передать деньги участнику `s!give-money <@ник> <сумма>`\n' +
                'cash** - *кол-во наличных денег.*\n' +
                '**bank** - *счет в банке.*\n' +
                '(P.S- Не стоит хранить все деньги на счету cash, эти деньги у вас могут украсть!(\n' +
                '\n' +
                '**Банковская система:\n' +
                'Банк хранит деньги под небольшим процентом ( каждые 12 часов от всей сумму на счету прибавляется 1.5% )\n' +
                '- Информация о банке и его проценте `s!bank`\n' +
                '- Вы можете положить деньги на счет в банке `s!deposit <сумма>`\n' +
                '- А так же обналичить счет `s!withdraw <сумма>`**\n' +
                '\n' +
                '**Способы получения денег**\n' +
                '**- Писать сообщения в чате (2-5 Jd 🍍)**\n' +
                '*P.S- Можете не спамить, установлена спам-защита. Деньги не будут начисляются.*\n' +
                '**- Работа `s!work`\n' +
                '- Удача `s!slut`**\n' +
                '*P.S- имеет шанс 80% на удачу*\n' +
                '***Успешно- вы получите (200-500 🍍)***\n' +
                '**Провал- у вас заберут до 10% имеющихся денег\n' +
                '- Криминал [s!crime]**\n' +
                '*P.S- имеет шанс 50% на удачу.*\n' +
                '***Успешно- вы получите (400-1500 🍍)***\n' +
                '**Провал- у вас заберут до 40% имеющихся денег**\n' +
                '~~**- Кража денег у других игроков [s!rob @ник]**~~\n' +
                '\n' +
                '**Существуют различные игры, о них вы можете узнать введя команду `.игры` **');
        message.reply({embed});
        message.delete();
    }, '', 'информация об экономике');

    add_command(['remote_say', 'rs'], false, message, command, args, 'roles', [rule.ban_hammer], function () {
        if (message.channel.id = undefined) {
            const error = embed_error('Ошибка отправки сообщения.');
            return message.channel.send({error});
        }
        let new_args = args;
        const chat = new_args.shift();
        const sayMessage = new_args.join(" ");
        message.guild.channels.get(chat).send(sayMessage).catch(()=>{message.reply('ты ебобо?');});
        message.delete().catch(O_o=>{});
    }, 'hid');

    add_command(['статус', 'status', 'presence', 'пресенс'], false, message, command, args, 'creat', null, function () {
        let new_args = args;
        if (new_args[0].toLowerCase() === 'играет' && new_args[1].toLowerCase() === 'в') {
            new_args[0] = 'играет в';
            new_args.splice(1, 1);
        }
        let type = new_args.shift();
        let real_type;
        if (['играет в', 'играет', 'play', 'playing', '0'].includes(type.toLowerCase()))
            real_type = 0;
        else if (['слушает', 'hear', 'hearing', '2'].includes(type.toLowerCase()))
            real_type = 2;
        else if (['смотрит', 'watch', 'watching', '3'].includes(type.toLowerCase()))
            real_type = 3;
        else return message.channel.send(`Ошибка. Тип \`${type.replace(/` /g, "\'")}\` не существует`);
        const status = new_args.join(" ");
        client.user.setPresence({ game: { name: status, type: real_type } }).catch();
        let status_word;
        if (real_type === 0)
            status_word = 'Играет в';
        else if (real_type === 2)
            status_word = 'Слушает';
        else if (real_type === 3)
            status_word = 'Смотрит';

        const embed = new Discord.RichEmbed()
            .setTitle('Статус изменен на:')
            .setDescription(`${status_word} **${status.replace(/` /g, "\\\'")}**`)
            .setFooter('Game🌀Space');
        message.channel.send({embed});
        message.delete();
    }, '[тип] [текст]', 'сменить Presence бота');
	
	add_command(['чекнуть_инвайты', 'checkinvite'], false, message, command, args, 'roles', [rule.moder, rule.ban_hammer, rule.game_admin], function () {
		
    const members = message.guild.members.filter(member => member.user.presence.game && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.game.name));

		const send = new Discord.RichEmbed()
            .setTitle('Проверка ссылки в статусе:')
            .setDescription(members.map(member => `\`${member.id}\` ${member.displayName}`).join("\n") || "Никто не имеет ссылки на приглашение в качестве названия игры.")
            .setFooter('Game🌀Space');
		
		const okkkk = new Discord.RichEmbed()
            .setTitle('Уведомление:')
            .setDescription(`${message.author}, проверьте свои личные сообщения`)
            .setFooter('Game🌀Space');
		
	message.author.send({embed: send});
		message.channel.send({embed: okkkk});
        message.delete();
    }, '', 'узнать, у кого есть ссылка на сервер в статусе');


    add_command(['идея', 'vote', 'votes', 'idea', 'ideas', 'poll', 'голосование', 'голос', 'воте', 'вотес', 'вотэ', 'вотэс', 'голоса'], false, message, command, args, 'e', null, function () {
        let text = args.join(' ').trim();
        if (text === '' || typeof text === 'undefined' || text === null) return getImageColors(message.author.avatarURL).then(color => {
            let c = color.map(col => col.hex());
            const embed = new Discord.RichEmbed()
                .setTitle('Идеи')
                .setDescription(`Вы можете предложить свою идею нашему серверу!\nДля этого вам нужно написать:\n\n \`${process.env.PREFIX}${command} [содержание идеи]\`\n\n\n**Внимание! Идеи не по теме - мут на 2 часа!**`)
                .setColor(c[0])
                .setFooter("Game🌀Space");
            message.reply({embed});
            message.delete();
        });
        getImageColors(message.author.avatarURL).then(color => {
            let c = color.map(col => col.hex());
            let embed = new Discord.RichEmbed()
                .setDescription(args.join(' '))
                .addField('Автор', message.author + ` (\`${message.author.tag}\`)`)
                .setColor(c[0]);
            let nick = message.author.username;
            if (message.member.nickname != null) nick = message.member.nickname;
            client.fetchWebhook(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN).then(webhook => {
                webhook.send('', {username: nick, avatarURL: message.author.avatarURL, embeds: [embed]}).catch(console.error);
            }).catch(console.error);
            message.channel.send(`🗳 Голосование пользователя ${message.author} успешно начато`);
            message.delete();
        });
    }, '[текст]', 'добавить идею в <#421287649995784193>');

    add_command(['eval', 'emulate', 'terminal', 'эмулировать', 'эвал', 'терминал', 'evaluate'], false, message, command, args, 'creat', null, function () {
	    const code = args.join(" ");
        const token = client.token.split("").join("[^]{0,2}");
        const rev = client.token.split("").reverse().join("[^]{0,2}");
        const filter = new RegExp(`${token}|${rev}`, "g");
        try {
            let output = eval(code);
            if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = output;
            output = inspect(output, { depth: 0, maxArrayLength: null });
            output = output.replace(filter, "[TOKEN]");
            output = clean(output);
            if (output.length < 1950) {
                //Отправляет пользователю данные эмуляции.
                message.author.send(`\`\`\`js\n${output}\n\`\`\``);
                //Ставит реакцию (выполнено).
                message.react("✅")
            } else {
                message.author.send(`${output}`, {split:"\n", code:"js"});
            }
        } catch (error) {
            //Захватывает ошибку и говорит об этом.
            message.channel.send(`Произошла ошибка \`\`\`js\n${error}\`\`\``);
            //Ставит реакцию (Ошибка).
            message.react("❎")
        }

        function clean(text)  {
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
        }
    }, 'hid');

    add_command(['руны', 'runic', 'runic_translate', 'рунический', 'рунический_перевод'], true, message, command, args, 'e', null, function () {
        let text = args.join(" ");
        let new_text = '';
        for(let x = 0, sym=''; sym = text.charAt(x); x++) {
            if (sym !== undefined)
                switch (sym.toLowerCase()) {
                    case 'a':
                        new_text += 'ᚨ';
                        break;
                    case 'b':
                        new_text += 'ᛒ';
                        break;
                    case 'c':
                        new_text += 'ᚲ';
                        break;
                    case 'd':
                        new_text += 'ᛞ';
                        break;
                    case 'e':
                        new_text += 'ᛖ';
                        break;
                    case 'f':
                        new_text += 'ᚠ';
                        break;
                    case 'g':
                        new_text += 'ᚷ';
                        break;
                    case 'h':
                        new_text += 'ᚺ';
                        break;
                    case 'i':
                        new_text += 'ᛁ';
                        break;
                    case 'j':
                        new_text += 'ᛃ';
                        break;
                    case 'k':
                        new_text += 'ᚴ';
                        break;
                    case 'l':
                        new_text += 'ᛚ';
                        break;
                    case 'm':
                        new_text += 'ᛗ';
                        break;
                    case 'n':
                        new_text += 'ᚾ';
                        break;
                    case 'o':
                        new_text += 'ᛟ';
                        break;
                    case 'p':
                        new_text += 'ᛈ';
                        break;
                    case 'q':
                        new_text += 'ᛩ';
                        break;
                    case 'r':
                        new_text += 'ᚱ';
                        break;
                    case 's':
                        new_text += 'ᛋ';
                        break;
                    case 't':
                        new_text += 'ᛏ';
                        break;
                    case 'u':
                        new_text += 'ᚢ';
                        break;
                    case 'v':
                        new_text += 'ᚡ';
                        break;
                    case 'w':
                        new_text += 'ᚹ';
                        break;
                    case 'x':
                        new_text += 'ᛪ';
                        break;
                    case 'y':
                        new_text += 'ᚤ';
                        break;
                    case 'z':
                        new_text += 'ᛉ';
                        break;
                    case '`':
                        new_text += '\'';
                        break;
                    case undefined:
                        break;
                    default:
                        new_text += sym;
                }
        }
        const embed = new Discord.RichEmbed()
            .setTitle('📝 Транслитератор текста в рунический алфавит')
            .setDescription(`Оригинал: \` `+ text.replace(/` /g, "\'") +` \`\nРезультат: \` `+ new_text.replace(/` /g, "\'") +` \`\n\nПеревод был проведён по запросу ${message.author}`);
        message.channel.send({embed});
        message.delete();
    }, '[текст]', 'транслитерировать текст в рунический алфавит');

    add_command(['ping', 'пинг'], true, message, command, args, 'e', null, function () {
    const color = parseInt(getRandomInt(0, 16777214));
    const embed = new Discord.RichEmbed()
        .setTitle('Пинг?')
        .setColor(color);
    message.channel.send({embed}).then(m => {
        const embed_req = new Discord.RichEmbed()
            .setTitle('Понг!')
            .setDescription(`\nОсновной сервер: ${m.createdTimestamp - message.createdTimestamp}ms.\nAPI сервер: ${Math.round(client.ping)}ms`)
            .setColor(color);
        m.edit({embed: embed_req});
    });
    }, '', 'проверка запроса на сервер');

    if (!siteOff)
    add_command(['профиль', 'п', 'profile', 'p', 'prof'], true, message, command, args, 'e', null, function () {
        let ment_member = message.mentions.members.first();
        let member = message.member;
        if (ment_member)
            member = ment_member;
        let text = '';
        if (member.user.id !== message.author.id)
            text = 'По запросу '+message.author;
        message.channel.send(text,{files: [{
                attachment: 'http://'+process.env.SITE_DOMAIN+'/profile.php?user='+member.user.id+'&nick='+encodeURIComponent(member.nickname)+'&secret='+encodeURIComponent(process.env.SECRET_KEY),
                name: 'file.png'
            }]}).then(() => {message.channel.stopTyping(true)});
        message.delete();
    }, '<пользователь>', 'отобразить Ваш профиль, или профиль другого пользователя');

    add_command(['думоть', 'think', 'думать'], true, message, command, args, 'e', null, function () {
        let question = args.join(' ');
        if (question.trim() === '') return;
        message.channel.send(`Думою над вопросом \` ${question.replace(/` /g, "\'")} \`, который задал ${message.author}\n\n⠀⠰⡿⠿⠛⠛⠻⠿⣷ \n` +
            '⠀⠀⠀⠀⠀⠀⣀⣄⡀⠀⠀⠀⠀⢀⣀⣀⣤⣄⣀⡀ \n' +
            '⠀⠀⠀⠀⠀⢸⣿⣿⣷⠀⠀⠀⠀⠛⠛⣿⣿⣿⡛⠿⠷ \n' +
            '⠀⠀⠀⠀⠀⠘⠿⠿⠋⠀⠀⠀⠀⠀⠀⣿⣿⣿⠇ \n' +
            '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁ \n' +
            '\n' +
            '⠀⠀⠀⠀⣿⣷⣄⠀⢶⣶⣷⣶⣶⣤⣀ \n' +
            '⠀⠀⠀⠀⣿⣿⣿⠀⠀⠀⠀⠀⠈⠙⠻⠗ \n' +
            '⠀⠀⠀⣰⣿⣿⣿⠀⠀⠀⠀⢀⣀⣠⣤⣴⣶⡄ \n' +
            '⠀⣠⣾⣿⣿⣿⣥⣶⣶⣿⣿⣿⣿⣿⠿⠿⠛⠃ \n' +
            '⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄ \n' +
            '⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡁ \n' +
            '⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁ \n' +
            '⠀⠀⠛⢿⣿⣿⣿⣿⣿⣿⡿⠟ \n' +
            '⠀⠀⠀⠀⠀⠉⠉⠉');
        message.delete();
    }, '[вопрос]', 'хорошо обдумоть вопрос');

    // add_command(['обнимашки', 'hug', 'обними', 'hugs'], false, message, command, args, 'e', null, function() {
    //     const emoj = client.emojis.get(emojis.obnimayu);
    //     message.channel.send(`${emoj} ${message.author}`);
    // }, '', 'обнять бота');

    if (!siteOff)
    add_command(['цвет', 'color', 'show_color', 'sc', 'покажи_цвет'], true, message, command, args, 'e', null, function () {
        if (!args[0]) return;
        let color = new rgbcolor(args.join(' '));
        if (!color.ok) return;
        const att = new Discord.Attachment('http://'+process.env.SITE_DOMAIN+'/color.php?red='+color.r+'&green='+color.g+'&blue='+color.b+'&secret='+encodeURIComponent(process.env.SECRET_KEY), 'color.png');
        const embed = new Discord.RichEmbed()
            .setTitle(`Цвет: ${args.join(' ')}`)
            .attachFile(att)
            .setImage('attachment://color.png')
            .setDescription(`Hex: \`${color.toHex()}\`\nRGB: \`${color.toRGB()}\``)
            .setColor(color.toHex());
        message.reply({embed});
        message.delete();
    }, '[цвет]', 'посмотреть на цвет');

    add_command(['invite', 'i', 'инвайт', 'приглос', 'приглашение'], false, message, command, args, 'e', null, function () {
        const embed = new Discord.RichEmbed()
            .setTitle('Советуйте наш сервер своим друзьям!')
            .setColor(parseInt(getRandomInt(0, 16777214)))
            .setDescription('Передавайте друзьям **ссылку** на наш сервер, или **QR** код!\n' +
                '\n' +
                '*Ссылка:*\n' +
                'https://discord.io/gspace\n' +
                '\n' +
                '*QR код:*')
            .setImage('https://discord.io/gspace/qr');
        message.reply({embed});
        message.delete();
    }, '', 'получить ссылку-приглашение');

    if (!siteOff)
    add_command(['уровень', 'level', 'lvl', 'leval', 'l', 'левел', 'левал', 'лвл', 'л', 'rank', 'rang', 'ранг', 'ранк'], true, message, command, args, 'e', null, function () {
        message.delete();
        let ment_member = message.mentions.members.first();
        let member = message.member;
        if (ment_member)
            member = ment_member;
        request('http://'+process.env.SITE_DOMAIN+'/rank.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+member.user.id, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                if (body.startsWith('<br')) { message.channel.stopTyping(true);message.channel.send({embed: embed_error(`Ошибка отображения уровня`)}); return message.guild.channels.get(channels.errs).send({embed: embed_error(`Ошибка отображения уровня пользователя ${message.author} (${message.author.tag}). Содержание ошибки:\n`+body.replace(/<br \/>/g, '\n').replace(/<b>/g, '**').replace(/<\/b>/g, '**'))});}
                const arr = JSON.parse(body);
                const embed = new Discord.RichEmbed()
                    .setTitle('Уровень')
                    .addField('Ранг', arr[2], true)
                    .addField('Уровень', arr[0], true)
                    .addField('Опыт', arr[1], true)
                    .setDescription(`${member.user} (\`${message.author.tag}\`)`)
                    .setFooter("Game🌀Space")
                    .setColor(parseInt(getRandomInt(0,16777214)));
                if (member.user.id === message.author.id) {
                    message.channel.send({embed});
                } else {
                    message.reply({embed});
                }
            }
        });
    }, '<пользователь>', 'отобразить Ваш уровень, или уровень другого пользователя');

    if (!siteOff)
    add_command(['balance', 'bal', 'b', 'балланс', 'баланс', 'бал', 'б', 'money', 'деньги', 'бабло', 'бабки', 'mon', 'm'], true, message, command, args, 'e', null, function () {
        message.delete();
        let ment_member = message.mentions.members.first();
        let member = message.member;
        if (ment_member)
            member = ment_member;
        request('http://'+process.env.SITE_DOMAIN+'/balance.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+member.user.id, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                if (body.startsWith('<br')) { message.channel.send({embed: embed_error(`Ошибка отображения баланса`)}); return message.guild.channels.get(channels.errs).send({embed: embed_error(`Ошибка отображения баланса пользователя ${message.author} (${message.author.tag}). Содержание ошибки:\n`+body.replace(/<br \/>/g, '\n').replace(/<b>/g, '**').replace(/<\/b>/g, '**'))});}
                const money = client.emojis.get(emojis.money);
                const embed = new Discord.RichEmbed()
                    .setTitle('Баланс')
                    .setDescription(`${member.user} (\`${member.user.tag}\`)\n\n${money}${body}`)
                    .setFooter("Game🌀Space")
                    .setColor(parseInt(getRandomInt(0,16777214)));
                if (member.user.id === message.author.id) {
                    message.channel.send({embed});
                } else {
                    message.reply({embed});
                }
            }
        });
    }, '<пользователь>', 'отобразить Ваш баланс, или баланс другого пользователя');

    if (!siteOff)
    add_command(['топ', 'топы', 'т', 'лидеры', 'лидер', 'лидерборд', 'лидербоард', 'top', 'leader', 'leaders', 'leaderboard', 'tops'], true, message, command, args, 'e', null, function () {
        message.delete();
        let users = [];
        request('http://'+process.env.SITE_DOMAIN+'/top.php?page='+encodeURIComponent(parseInt(args[0]).toString())+'&secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id, function (error, response, body) {
            if (body.startsWith('<br')) { message.channel.stopTyping(true);message.channel.send({embed: embed_error(`Ошибка отображения топа пользователей`)}); return message.guild.channels.get(channels.errs).send({embed: embed_error(`Ошибка отображения топа пользователей. Содержание ошибки:\n`+body.replace(/<br \/>/g, '\n').replace(/<b>/g, '**').replace(/<\/b>/g, '**'))});}
            let data = JSON.parse(body);
            let footer = 'Страница '+data[3]+'/'+data[2];
            let usrs = data[4];
            usrs.forEach(function (item) {
                if (!message.guild.members.get(item['id'].toString())) return;
                users.push(message.guild.members.get(item['id'].toString()).toString() + ` (\`${message.guild.members.get(item['id'].toString()).user.tag}\`) - ${item['level']} уровень, ${item['xp']} опыта всего`);
            });
            let embed = new Discord.RichEmbed()
                .setTitle('Топ-10')
                .setDescription(users.join('\n'))
                .setFooter(footer);
            message.channel.send({embed}).then(() => {message.channel.stopTyping(true)});
        });
    }, '', 'вывести таблицу лидеров');

    if (!siteOff)
    add_command(['update_roles', 'обновить_роли', 'восстановить_роли', 'recover_roles', 'rr', 'ur'], true, message, command, args, 'e', null, function () {
        message.delete();
        let member = message.mentions.members.first();
        if (member) {
            if (!message.member.hasPermission('MANAGE_MESSAGES', false, true, true) && member.id !== message.author.id)
                return message.channel.send({embed: embed_error('Вы не имеете права `MANAGE_MESSAGES`, которое требуется для просмотра чужих нарушений\n\nЕсли Вы считаете, что это не так - обратитесь к <@421030089732653057>')});
        } else {
            member = message.member;
        }
        request('http://'+process.env.SITE_DOMAIN+'/rank.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+member.user.id, function (error, response, body) {
            if (body.startsWith('<br')) {message.channel.stopTyping(true); message.channel.send({embed: embed_error(`Ошибка восстановления ролей`)}); return message.guild.channels.get(channels.errs).send({embed: embed_error(`Ошибка восстановления ролей пользователя ${message.author} (${message.author.tag}). Содержание ошибки:\n`+body.replace(/<br \/>/g, '\n').replace(/<b>/g, '**').replace(/<\/b>/g, '**'))});}
            const arr = JSON.parse(body);
            let bool = false;
            level_roles.forEach(function (item) {
                if (arr[0] >= item[0]) {
                    if (!member.roles.has(item[1])) {
                        member.addRole(item[1]).catch(console.error);
                        member.send(`Вы получили роль \`${message.guild.roles.get(item[1]).name}\``);
                        bool = true;
                    }
                } else {
                    if (member.roles.has(item[1])) {
                        member.removeRole(item[1]).catch(console.error);
                    }
                }
            });
            let embed;
            if (bool)
                embed = new Discord.RichEmbed()
                    .setDescription(`${member}, ваши роли за уровни были успешно восстановлены`)
                    .setColor('3FB97C');
            else
                embed = new Discord.RichEmbed()
                    .setDescription(`${member}, у вас уже есть все ваши роли за уровни`)
                    .setColor('C34E4E');

            message.channel.send({embed})
        });
    }, '', 'восстановить роли за уровень, в случае их удаления');

    if (!siteOff)
    add_command(['noxp'], false, message, command, args, 'roles', [rule.game_admin], function () {
        message.delete();
        let new_args = args;
        new_args.shift();
        let reason = new_args.join(' ').trim();

        let user = message.mentions.members.first();
        if (!user) return message.channel.send({embed: embed_error(`${message.author}, извините, но пользователь, которого вы упомянули, не является участником сервера или не существует`)});
        if (user.user.id === message.author.id) return message.channel.send({embed: embed_error(`${user.user}, извините, но вы не можете отключить опыт у самого себя`)});
        if (user.user.bot) return message.channel.send({embed: embed_error(`${message.author}, извините, но вы не можете отключить опыт у бота`)});
        let accepting = message.channel.send(`Вы уверены, что хотите отключить опыт пользователю \`${user.user.tag}\`? **Это действие необратимо!**\n\n**Напишите \`да\`, чтобы подтведить.**`);
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
        collector.on('collect', msg => {
            if (['да', 'ага', 'кнш', 'конечно', 'конешно', 'давай', 'йес', 'yes', 'y', 'aga', 'go', 'da', 'го'].includes(msg.content.toLowerCase())) {
                message.delete();
                request(`https://${process.env.SITE_DOMAIN}/noxp.php?id=${user.user.id}&secret=${encodeURIComponent(process.env.SECRET_KEY)}&user=${message.author.id}`, function (error, response, body) {
                    let footer = 'Game🌀Space';
                    let embed = new Discord.RichEmbed()
                        .setTitle('Отключение опыта')
                        .addField('Пользователь', `${user.user} (\`${user.user.tag}\`)`, true)
                        .addField('Модератор', `${message.author} (\`${message.author.tag}\`)`, true)
                        .setFooter(footer)
                        .setColor('C34E4E');
                    message.channel.send(`${user.user}`, {embed}).then(() => {message.channel.stopTyping(true)});
                    message.guild.channels.get('426756919777165312').send({embed});
                });
            }
            collector.stop();
        });
    }, '[пользователь]', 'отключить опыт пользователю');

    add_command(['статистка', 'stats', 'аптайм', 'uptime'], false, message, command, args, 'creat', null, function () {
        const embed = new Discord.RichEmbed()
            .setColor(parseInt(getRandomInt(0, 16777215)))
            .setTitle('Статистика')
            .setThumbnail(client.user.avatarURL);
        embed.addField('Пинг', client.ping, true);
        embed.addField('ОЗУ', process.env.WEB_MEMORY + 'мб / ' + process.env.MEMORY_AVAILABLE + 'мб', true);
        embed.addField('Сервер', process.env.DYNO, true);
        embed.addField('Порт', process.env.PORT, true);
        let guilds = [];
        client.guilds.forEach(function (guild) {guilds.push(guild.name)});
        embed.addField('Гильдии', '```'+guilds.join('\n')+'```');
        message.author.send(embed);
        message.delete();
    }, 'hid');


    add_command(['invites', 'приглашения'], false, message, command, args, 'e', null, function () {
        message.guild.fetchInvites().then(invites => {
            let invites_list = '';
            invites.filter(invite => invite.inviter.id === message.author.id).forEach((item) => {
                invites_list = invites_list + item.code + ' – ';
                if (item.temporary) {invites_list = invites_list + 'до ' + item.expiresAt + ', '} else {invites_list = invites_list + '∞ срок действия, '}
                invites_list = invites_list + ' ' + item.uses + ' ' + declOfNum(item.uses, ['использование', 'использования', 'использований']) + '\n';
            });
            const embed = new Discord.RichEmbed()
                .setTitle('Ваши ссылки-приглашения:')
                .setDescription(invites_list)
                .setFooter('Game🌀Space');
            message.author.send({embed});
            message.delete();
        });
    }, '', 'увидеть свои ссылки-приглашения');

    add_command(['omegalul', 'lul', 'omegalol', 'lol', 'лол', 'лул', 'омегалул', 'омегалол'], false, message, command, args, 'e', null, function () {
        message.channel.send(`${client.emojis.get('439014894453522432')}${client.emojis.get('439014894453522432')}${client.emojis.get('439014894453522432')}${client.emojis.get('439014894453522432')}${client.emojis.get('439014894453522432')}${client.emojis.get('439014894453522432')}`).then(msg => {
            msg.react(client.emojis.get('439014894453522432'));
            msg.react(client.emojis.get('439411257099943946'));
            msg.react(client.emojis.get('439411283402424322'));
            msg.react(client.emojis.get('439411860954021900'));
            msg.react(client.emojis.get('439411897146671105'));
            msg.react(client.emojis.get('439411919582003211'));
        })
    }, 'hid');
	
	add_command(['us'], false, message, command, args, 'creat', null, function () {
        if (message.guild.members.get === undefined) {
            return message.channel.send({embed: embed_error(`Ошибка отправки сообщения`)});
        }
        let new_args = args;
        const userse = new_args.shift();
        const UsersayMessage = new_args.join(" ");
        console.log(userse);
               message.guild.members.get(userse).send(UsersayMessage);message.delete();
    }, 'hid');

    add_command(['embedsay'], false, message, command, args, 'roles', [rule.game_admin], function () {
        try {
            let text = args.join(" ").replace(/\n/g, "\\n");
            let embed = new Discord.RichEmbed();
            let footer = text.match(/{footer:(.*?)( \| icon: ?(.*?))?}/i);
            if (footer !== null) {
                embed.setFooter(footer[1], footer[3])
            }
            let image = text.match(/{image: ?(.*?)}/i);
            if (image !== null) {
                embed.attachFile({
                    attachment: image[1],
                    file: image[1].substring(image[1].lastIndexOf('/') + 1)
                }).setImage('attachment://'+image[1].substring(image[1].lastIndexOf('/') + 1));
            }
            let thumb = text.match(/{thumbnail: ?(.*?)}/i);
            if (thumb !== null) {
                embed.attachFile({
                    attachment: thumb[1],
                    file: thumb[1].substring(thumb[1].lastIndexOf('/') + 1)
                }).setThumbnail('attachment://'+thumb[1].substring(thumb[1].lastIndexOf('/') + 1));
            }
            let author = text.match(/{author:(.*?)( \| icon: ?(.*?))?( \| url: ?(.*?))?}/i);
            if (author !== null) {
                embed.setAuthor(author[1], author[3], author[5])
            }
            let title = text.match(/{title:(.*?)}/i);
            if (title !== null) {
                embed.setTitle(title[1])
            }
            let url = text.match(/{url: ?(.*?)}/i);
            if (url !== null) {
                embed.setURL(url[1])
            }
            let description = text.match(/{description:(.*?)}/i);
            if (description !== null) {
                embed.setDescription(description[1].replace(/\\n/g, '\n'))
            }
            let color = text.match(/{colou?r: ?(.*?)}/i);
            if (color !== null) {
                embed.setColor(color[1])
            }
            let timestamp = text.match(/{timestamp(: ?(.*?))?}/i);
            if (timestamp !== null) {
                if (timestamp[2] === undefined || timestamp[2] === null)
                embed.setTimestamp(new Date());
                else
                embed.setTimestamp(new Date(timestamp[2]));
            }
            let fields = text.match(/{field: ?(.*?) \| value: ?(.*?)( \| inline)?}/gi);
            if (fields !== null) {
                fields.forEach((item) => {
                if (item[1] == null || item[2] == null || typeof item[1] === "undefined" || typeof item[2] === "undefined") return;
                let matches = item.match(/{field: ?(.*?) \| value: ?(.*?)( \| inline)?}/i);
                embed.addField(matches[1], matches[2], (matches[3] != null));
            });}
            message.channel.send({embed});
            message.delete();
        } catch(e) {
            message.channel.send({embed: embed_error('Ошибка отправки эмбэда')}).then(msg => msg.delete(3000));
            console.error(e);
        }
    }, 'hid');

    add_command(['daily'], false, message, command, args, 'beta', null, function () {
        let money = client.emojis.get(emojis.money);
        let blank = client.emojis.get('435119671143038986');
        let all = [];
        message.delete(100);
        message.channel.send('Загрузка...').then((msg) => {
            request('http://' + process.env.SITE_DOMAIN + '/get_user_tasks.php?secret=' + encodeURIComponent(process.env.SECRET_KEY) + '&user=' + message.author.id, function (error, response, body) {
                msg.edit(message.author + ', загляни в лс :D').then(msg => msg.delete(3000));
                try {
                    let tasks_data = JSON.parse(body);
                    tasks_data.forEach((item, num) => {
                        if (item !== null) {
                            let done;
                            if (item['active']) item['name'] = '*__' + item['name'] + '__*';
                            if (item['active']) done = '✅ Выполнено: **'+item['done']+'**/**'+item['count']+'**'; else done = blank;
                            all[num] = ['**' + item['name'] + '**', newLines(item['task']).join('\n'), '🏆 Награда: **' + item['reward'] + '**' + money, done];
                        }
                        else
                            all[num] = [blank.toString(), 'Задания нет.\nПриходи завтра!', blank, blank]
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
                                .setTitle(':bell: Ежедневные задания')
                                .addField('Задание 1', `${all[0][0]}\n${blank}\n${all[0][1]}\n\n${blank}\n${all[0][3]}\n${all[0][2]}`, true)
                                .addField('Задание 2', `${all[1][0]}\n${blank}\n${all[1][1]}\n${blank}\n${all[1][3]}\n${all[1][2]}`, true)
                                .addField('Задание 3', `${all[2][0]}\n${blank}\n${all[2][1]}\n${blank}\n${all[2][3]}\n${all[2][2]}`, true)
                        )
                    });
                } catch (e) {
                    console.log(`Get ${message.author.id} tasks error: ${e}`)
                }
            });
        });
    }, 'hid');

    add_command(['hug', 'обнять', 'обнимашки', 'hugs', 'хуг', 'хугс', 'хаг', 'хагс'], false, message, command, args, 'e', null, function () {
        message.delete();
        let user = message.author;
        let user1 = message.mentions.users.first();
        if (!user1 || user1.id === user.id) {
            user = client.user;
            user1 = message.author;
        }
        message.channel.send('Загрузка...').then(msg => {
            request('https://nekos.life/api/v2/img/hug', function (error, response, body) {
                try {
                    let arr = JSON.parse(body);
                    let embed = new Discord.RichEmbed()
                        .setTitle(':3')
                        .setDescription(`${client.emojis.get(emojis.obnimayu)} ${user} обнял(а) ${user1} ${client.emojis.get(emojis.hugl)}`)
                        .setImage(arr['url'])
                        .setColor('RANDOM');
                    msg.edit(`${user1}`, {embed});
                } catch (e) {console.log(e)}
            });
        });
    }, '<пользователь>', 'обнять пользователя');

    add_command(['pat', 'погладить', 'успокоить'], false, message, command, args, 'e', null, function () {
        message.delete();
        let user = message.author;
        let user1 = message.mentions.users.first();
        if (!user1 || user1.id === user.id) {
            user = client.user;
            user1 = message.author;
        }
        message.channel.send('Загрузка...').then(msg => {
            request('https://nekos.life/api/v2/img/pat', function (error, response, body) {
                try {
                    let arr = JSON.parse(body);
                    let embed = new Discord.RichEmbed()
                        .setTitle(':3')
                        .setDescription(`${client.emojis.get(emojis.obnimayu)} ${user} погладил(а) по голове ${user1} ${client.emojis.get(emojis.hugl)}`)
                        .setImage(arr['url'])
                        .setColor('RANDOM');
                    msg.edit(`${user1}`, {embed});
                } catch (e) {console.log(e)}
            });
        });
    }, '<пользователь>', 'погладить пользователя по голове');

    add_command(['kiss', 'поцеловать', 'поцелуй'], false, message, command, args, 'e', null, function () {
        message.delete();
        let user = message.author;
        let user1 = message.mentions.users.first();
        if (!user1 || user1.id === user.id) {
            user = client.user;
            user1 = message.author;
        }
        message.channel.send('Загрузка...').then(msg => {
            request('https://nekos.life/api/v2/img/kiss', function (error, response, body) {
                try {
                    let arr = JSON.parse(body);
                    let embed = new Discord.RichEmbed()
                        .setTitle(':3')
                        .setDescription(`${client.emojis.get(emojis.obnimayu)} ${user} поцеловал(а) ${user1} ${client.emojis.get(emojis.hugl)}`)
                        .setImage(arr['url'])
                        .setColor('RANDOM');
                    msg.edit(`${user1}`, {embed});
                } catch (e) {console.log(e)}
            });
        });
    }, '<пользователь>', 'поцеловать пользователя');

    add_command(['slap', 'пощёчина'], false, message, command, args, 'e', null, function () {
        message.delete();
        let user = message.author;
        let user1 = message.mentions.users.first();
        if (!user1 || user1.id === user.id) {
            user = client.user;
            user1 = message.author;
        }
        message.channel.send('Загрузка...').then(msg => {
            request('https://nekos.life/api/v2/img/slap', function (error, response, body) {
                try {
                    let arr = JSON.parse(body);
                    let embed = new Discord.RichEmbed()
                        .setTitle('>:{')
                        .setDescription(`${client.emojis.get(emojis.obnimayu)} ${user} дал(а) пощёчину ${user1} ${client.emojis.get(emojis.hugl)}`)
                        .setImage(arr['url'])
                        .setColor('RANDOM');
                    msg.edit(`${user1}`, {embed});
                } catch (e) {console.log(e)}
            });
        });
    }, '<пользователь>', 'дать пользователю пощёчину');

    add_command(['fuck', 'sex', 'трахнуть', 'секс', 'выебать'], false, message, command, args, 'e', null, function () {
        message.delete();
        if (!message.channel.nsfw) return message.channel.send('Такое можно только в <#421664477662937098>!').then(msg => msg.delete(5000));
        let user = message.author;
        let user1 = message.mentions.users.first();
        if (!user1 || user1.id === user.id) {
            return message.reply('Укажите, с кем хотите заняться сексом');
        }
        let arr1 = ['anal', 'classic'];
        let url = 'https://nekos.life/api/v2/img/'+arr1[getRandomInt(0, arr1.length)];
        message.channel.send('Загрузка...').then(msg => {
            request(url, function (error, response, body) {
                try {
                    let arr = JSON.parse(body);
                    let embed = new Discord.RichEmbed()
                        .setTitle('...')
                        .setDescription(`${client.emojis.get(emojis.obnimayu)} ${user} выебал(а) ${user1} ${client.emojis.get(emojis.hugl)}`)
                        .setImage(arr['url'])
                        .setColor('RANDOM');
                    msg.edit(`${user1}`, {embed});
                } catch (e) {console.log(e)}
            });
        });
    }, '<пользователь>', 'заняться сексом с пользователем');

    add_command(['gasm', 'orgasm'], false, message, command, args, 'e', null, function () {
        message.delete();
        message.channel.send('Загрузка...').then(msg => {
            request('https://nekos.life/api/v2/img/gasm', function (error, response, body) {
                try {
                    msg.delete();
                    let arr = JSON.parse(body);
                    message.channel.send({files: [{
                        attachment: arr['url'],
                        name: arr['url'].substring(arr['url'].lastIndexOf('/')+1)
                    }]});
                } catch (e) {console.log(e)}
            });
        });
    }, '', 'отправить картинку оргазма');

    /*----- END COMMANDS -----*/

    //Команда help. Все остальные команды должны быть определены до неё.
    add_command(['help', 'h', 'he', 'hel', 'помощь', 'помощ', 'помащ', 'помащь', 'памоги', 'помаги', 'помоги', 'памаги', 'хелп', 'хэлп'], false, message, command, args, 'e', null, function () {
        let limit = 8;
        let all_pages = Math.ceil(help_commands.length/limit);
        let current_page = parseInt(args[0]);
        if (current_page > all_pages || current_page < 1 || !isNumeric(args[0]))
            current_page = 1;
        let curr_commands = help_commands.slice(1+((current_page-1)*limit), (limit+1)+((current_page-1)*limit)).join('\n');
        let all_commands = '';
        if (!botFullRights.includes(message.channel.id))
            all_commands = '***Внимание!*** В этом списке отображены команды, которые доступны в этом чате. Чтобы получить доступ ко всем командам, идите в <#418096126957453337>\n';
        let newPage = '';
        if (current_page < all_pages)
            newPage = `\n\n**Для просмотра следующей страницы напишите \`${process.env.PREFIX}${command} ${current_page+1}\`**`;

        const embed = new Discord.RichEmbed()
            .setTitle(`Помощь`)
            .setDescription(`Данные предоставлены, учитывая права ${message.member} (\`${message.author.tag}\`) в чате ${message.channel.toString()} (\`#${message.channel.name}\`)\n`+
                `${all_commands}\n\`[...]\` — обязательный параметр,\n\`<...>\` — не обязательный параметр.\n\n`+
                `${curr_commands}${newPage}`)
            .setFooter(`Страница ${current_page}/${all_pages}`)
            .setThumbnail('https://cdn.discordapp.com/attachments/416813030702055425/424645334556344342/Help.png');
        message.channel.send({embed});
    }, 'hid');

});

//Авторизация бота токеном.
client.login(process.env.BOT_TOKEN).catch(console.error);
//Защита от кражи токена.
process.env.BOT_TOKEN = process.env.POSLANIYE;
