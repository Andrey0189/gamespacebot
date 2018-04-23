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
* Copyright 2018 © GameSpace. Все права защищены.
* Нарушение авторских прав преследуется законом.
*
* CC-BY-NC-SA
* http://creativecommons.org/licenses/by-nc-sa/4.0/
*
* */
const Discord = require('discord.js');
const util = require("util");
const https = require("https");
const request = require("request");
const querystring = require('querystring');
const rgbcolor = require('rgbcolor');
const getImageColors = require('get-image-colors');
const client = new Discord.Client({ autofetch: [
        'MESSAGE_CREATE',
        'MESSAGE_UPDATE',
        'MESSAGE_REACTION_ADD',
        'MESSAGE_REACTION_REMOVE',
    ] });
const rule = {game_admin: "417312252463677451", game_owner: "417267817763831808", content_maker: "417267817763831808", game_sponsor: "417396657668358165", own: "419562566512017415"};
// Эклипс вернулся
const creators = ['178404926869733376', '168255014282854401', '421030089732653057'];
// Аккаунт zziger#8809 в бане...
// Проверка коммита с нетбука
// const music_channels = ['', '415577705636167694', '415578104724193300', '415578300505915393', '415578533511823370', '415578661023121408'];
const jvbot_channel = '421260737281785856';
const emojis = {up:'418748638081318912', stop:'418748635820326912', shuffle:'418748638173462528', repeat1:'418748637531865089', repeat:'418748637649174535', play:'418748635765800961', pause:'418748635329855489', ok:'418748637502504972', forward:'418748554899881994', down:'418748613733122058', back:'418748554014752770', ABCD:'418748554518069249', abcd:'418748553985261568', abc:'418748552802598927', protiv:'419121914959626240', neznayu:'419121999277719562', za:'419122029854457866', obnimayu:'421647583551684609', money:'422055316792803349', error: '424467513578094592', facepalm: '429211566756462592'};
// let music_bot_messages = ['', '', '', '', '', ''];
// let music_bot_channels = ['', '', '', '', '', ''];
const talkedRecently = new Set();
const commandCooldown = new Set();
const newLevelNotificationChannels = ['417266234032390155', '418096126957453337', '421625843320750080', '421664477662937098', '417674070046277632', '421558850681044993'];
const siteOff = false;
const botFullRights = ['418096126957453337', '421558850681044993'];
let help_commands = [];
const level_roles = [['2', '417389665042169876'], ['5', '417391646863523858'], ['10', '417391865038635010'], ['15', '417392325405442058'], ['20', '417393247162204160'], ['23', '417392902872891393'], ['25', '417392121541296128'], ['28', '417392180747829249'], ['30', '417392444750168075']];
const channels = {'errs': '432071031356915722'};


// безразмерная пустота " ⃠ "

/*
/embed {title:Советуйте наш сервер друзьям!}{description:Передавайте друзьям **ссылку** на наш сервер, или **QR** код!

*Ссылка:*
https://discord.io/gspace

*QR код:*}{image:https://discord.io/gspace/qr}{color:37074E}
*/


/** @namespace process.env.PREFIX */
/** @namespace process.env.BOT_TOKEN */
/** @namespace process.env.SITE_DOMAIN */
/** @namespace process.env.SECRET_KEY */
/** @namespace process.env.WEBHOOK_ID */
/** @namespace process.env.WEBHOOK_TOKEN */

// setInterval (function () {
//     client.channels.get('417266234032390155').fetchMessages({limit: 20}).then(messages => {
//         messages.forEach(function (message) {
//             message.embeds.forEach(function (embed) {
//                 if (!embed || embed.title !== 'Советуйте наш сервер своим друзьям!' || message.author.id !== client.user.id) {
//                     const embed = new Discord.RichEmbed()
//                         .setTitle('Советуйте наш сервер своим друзьям!')
//                         .setColor(parseInt(getRandomInt(0,16777214)))
//                         .setDescription('Передавайте друзьям **ссылку** на наш сервер, или **QR** код!\n' +
//                             '\n' +
//                             '*Ссылка:*\n' +
//                             'https://discord.io/gspace\n' +
//                             '\n' +
//                             '*QR код:*')
//                         .setImage('https://discord.io/gspace/qr');
//                     let msg = client.channels.get('417266234032390155').send({embed});
//                     console.log('Share_message was sent. ID: '+msg.id);
//                 }
//             })
//         });
//     });
//
// }, 3600000);

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
        await message.react(arr.shift()).catch(console.error).then(function () {multipleReact(message,arr).catch(console.error);});
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
    if (!creators.includes(message.author.id))
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
            access_params.forEach(function (item) {
                roles = roles + message.guild.roles.get(item);
            });
            if (access_params.length === 1) {
                a = 'роли';
                required = 'которая требуется';
            }
            embed = embed_error(`${message.author} (\`${message.author.tag}\`), извините, но у Вас нет ${a} ${roles}, ${required} для выполнения данной команды\n\nЕсли Вы считаете, что это не так - обратитесь к <@421030089732653057>`);
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

    if (!message.member.roles.some(r=>[rule.game_owner, rule.game_owner, rule.own].includes(r.id)))
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
 
String.prototype.replaceAll = function(search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


client.on("messageReactionAdd", (reaction, user) => {

    // if (music_channels.indexOf(reaction.message.guild.members.get(user.id).voiceChannelID) !== -1 && music_bot_messages.includes(reaction.message.id) && !user.bot) {
    //     let bot_ = music_bot_messages.indexOf(reaction.message.id);
    //     if (reaction.emoji.id === emojis.play) {
    //         client.channels.get(jvbot_channel).send(`+jvdjbot+${bot_}+getSong`);
    //         reaction.remove(user);
    //     }
    // }
    let memb = reaction.message.guild.members.get(user.id);
    if (user.bot) return;
    if (reaction.message.id === '421324005853888512') {
        if (reaction.emoji.name === '✅') {
            if (memb.roles.has('417373000422391809'))
                memb.removeRole('417373000422391809').catch(console.error);
            if (!memb.roles.has('417312577018789899'))
                memb.addRole('417312577018789899').catch(console.error);
        } else if (reaction.emoji.name === '❌') {
            memb.kick('Не согласен с правилами').catch(console.error);
        }
        reaction.remove(user);
    }
});

// client.on("presenceUpdate", (old_user, new_user) => {
//     if (!old_user.roles.some(r=>['394521558283976705'].includes(r.id))) return;
//     if (!new_user.presence.game) return;
//     if (old_user.presence.game) {
//         if (old_user.presence.game.streaming) return;
//     }
//     if (!new_user.presence.game.streaming) return;
//     client.channels.get('419730941854875660').send(`📺 Хей, ребят! ${old_user.user} начал стрим! Заходим! ${new_user.presence.game.url}`);
// });

client.on('ready', () => {
	console.log('Bot loaded');
	client.user.setPresence({ game: { name: `по сторонам`, type: 3 } }).catch();
    // client.channels.get('417374192418160652').fetchMessage('421324005853888512');
});

client.on("guildMemberAdd", member => {
    const embed = new Discord.RichEmbed()
        .setTitle('Приветствую тебя на нашем укромном уголочке!')
        .setColor("#3B024D")
        .setDescription("На нашем сервере ты сможешь пообщаться или найти новых друзей для совместной игры. Присутсвует услуга приватной комнаты, по вашей просьбе мы сделаем специально для вас отдельный уголок в категории players_rooms ( Вы сможете полностью настраивать один канал ).\n" +
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
            console.log(array);
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

        return;
    }

    //Выставление реакций в #votes
    if (message.channel.id === '421287649995784193') {
        console.log('caught '+message.id);
        return multipleReact(message, [emojis.za, emojis.neznayu, emojis.protiv]).catch();
    }

    //Игнорирование некоторых типов каналов
    if (['dm', 'group', 'category', 'voice'].includes(message.channel.type)) return;

    //Авто-покидание чужих серверов
    if (!['417266233562365952', '416813030232424462'].includes(message.guild.id)) {
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

    //Проверка на содержания сообщением префикса, создание констант args и command
    if(message.content.indexOf(process.env.PREFIX) !== 0) return;
	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();

  	//Массив, содержащий в себе все команды, которые доступны пользователю
  	help_commands = [''];

  	/*----- START COMMANDS -----*/
    add_command(['скажи', 'say', 's'], false, message, command, args, 'roles', [rule.game_owner], function () {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{});
        const embed = embed_error(`${message.author}, неизвестная ошибка отправки сообщения в чат`);
        let msg = message.channel.send(sayMessage).catch(()=>{message.reply({embed});});
    }, '[текст]', 'написать сообщение от имени бота');

    add_command(['очистить', 'clear', 'del', 'clr'], false, message, command, args, 'rules', ['MANAGE_MESSAGES'], function () {
        if (message.mentions.members.first()) {
            let msgs = message.channel.fetchMessages({limit:98}).then(messages => messages.filter().channel.bulkDelete(messages));

        } else {
            let content = message.content.slice(process.env.PREFIX.length + 8);
            let messagecount = parseInt(args[0]);
            let msc = messagecount;
            if (messagecount > 2 && messagecount < 99) {
                message.channel.fetchMessages({limit: messagecount + 1}).then(messages => message.channel.bulkDelete(messages));
                let lol = declOfNum(msc, ['сообщение', 'сообщения', 'сообщений']);
                message.channel.send(`Удалено ${msc} ${lol}!`).then(msg => {msg.delete(5000)});
                message.delete();
            } else {
                const embed = embed_error(`${message.author}, ошибка очистки сообщений, \`${content}\` либо меньше чем 2, либо больше чем 99, либо не является числом`);
                message.channel.send(embed);
            }
        }

    }, '[99 > кол-во > 2 или упоминание]', 'очистить определенное количество сообщений');

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
                '**- Писать сообщения в чате (2-5 Jd \\💸)**\n' +
                '*P.S- Можете не спамить, установлена спам-защита. Деньги не будут начисляются.*\n' +
                '**- Работа `s!work`\n' +
                '- Удача `s!slut`**\n' +
                '*P.S- имеет шанс 80% на удачу*\n' +
                '***Успешно- вы получите (200-500 Jd\\💸)***\n' +
                '**Провал- у вас заберут до 10% имеющихся денег\n' +
                '- Криминал [s!crime]**\n' +
                '*P.S- имеет шанс 50% на удачу.*\n' +
                '***Успешно- вы получите (400-1500 Jd\\💸)***\n' +
                '**Провал- у вас заберут до 40% имеющихся денег**\n' +
                '~~**- Кража денег у других игроков [s!rob @ник]**~~\n' +
                '\n' +
                '**Существуют различные игры, о них вы можете узнать введя команду `.игры` **');
        message.reply({embed});
        message.delete();
    }, '', 'информация об экономике');

    add_command(['remote_say', 'rs'], false, message, command, args, 'roles', [rule.game_owner], function () {
        if (message.channel.id = undefined) {
            const error = embed_error('Ошибка отправки сообщения.');
            return message.channel.send({error});
        }
        let new_args = args;
        const chat = new_args.shift();
        const sayMessage = new_args.join(" ");
        console.log(chat);
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
                webhook.send('', {username: nick, avatarURL: message.author.avatarURL, embeds: [embed]}).catch(err => {
                    console.log(err)
                });
            }).catch(err => {
                console.log(err)
            });
            message.channel.send(`🗳 Голосование пользователя ${message.author} успешно начато`);
            message.delete();
        });
    }, '[текст]', 'добавить идею в <#421287649995784193>');

    add_command(['eval', 'emulate', 'terminal', 'эмулировать', 'эвал', 'терминал', 'evaluate'], false, message, command, args, 'creat', null, function () {
        try {
            let code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = util.inspect(evaled);
            message.guild.channels.get('416509595180072961').send('Был эмулирован код: \n```js\n' + code + '\n```');
        } catch (err) {
            message.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${util.clean(err)}\n\`\`\``);
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
        message.channel.startTyping();
        message.channel.send(text,{files: [{
                attachment: 'https://'+process.env.SITE_DOMAIN+'/profile.php?user='+member.user.id+'&nick='+encodeURIComponent(member.nickname)+'&secret='+encodeURIComponent(process.env.SECRET_KEY),
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

    add_command(['обнимашки', 'hug', 'обними', 'hugs'], false, message, command, args, 'e', null, function() {
        const emoj = client.emojis.get(emojis.obnimayu);
        message.channel.send(`${emoj} ${message.author}`);
    }, '', 'обнять бота');

    if (!siteOff)
    add_command(['цвет', 'color', 'show_color', 'sc', 'покажи_цвет'], true, message, command, args, 'e', null, function () {
        if (!args[0]) return;
        let color = new rgbcolor(args.join(' '));
        if (!color.ok) return;
        const att = new Discord.Attachment('https://'+process.env.SITE_DOMAIN+'/color.php?red='+color.r+'&green='+color.g+'&blue='+color.b+'&secret='+encodeURIComponent(process.env.SECRET_KEY), 'color.png');
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
        message.channel.startTyping();
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
                    message.channel.stopTyping(true);
                } else {
                    message.reply({embed});
                    message.channel.stopTyping(true);
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
        message.channel.startTyping();
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
                    message.channel.stopTyping(true);
                } else {
                    message.reply({embed});
                    message.channel.stopTyping(true);
                }
            }
        });
    }, '<пользователь>', 'отобразить Ваш баланс, или баланс другого пользователя');

    if (!siteOff)
    add_command(['топ', 'топы', 'т', 'лидеры', 'лидер', 'лидерборд', 'лидербоард', 'top', 'leader', 'leaders', 'leaderboard', 'tops'], true, message, command, args, 'e', null, function () {
        message.channel.startTyping();
        message.delete();
        let users = [];
        request('http://'+process.env.SITE_DOMAIN+'/top.php?page='+encodeURIComponent(parseInt(args[0]))+'&secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id, function (error, response, body) {
            if (body.startsWith('<br')) { message.channel.stopTyping(true);message.channel.send({embed: embed_error(`Ошибка отображения топа пользователей`)}); return message.guild.channels.get(channels.errs).send({embed: embed_error(`Ошибка отображения топа пользователей. Содержание ошибки:\n`+body.replace(/<br \/>/g, '\n').replace(/<b>/g, '**').replace(/<\/b>/g, '**'))});}
            let data = JSON.parse(body);
            let footer = 'Страница '+data[3]+'/'+data[2];
            let usrs = data[4];
            console.log(body);
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

    // add_command(['warn', 'варн', 'punish', 'наказать', 'предупреждение', 'наказание', 'предупредить', 'отпороть'], false, message, command, args, 'rules', ['MANAGE_MESSAGES'], function () {
    //     message.delete();
    //     let new_args = args;
    //     new_args.shift();
    //     let reason = new_args.join(' ').trim();
    //
    //     let user = message.mentions.members.first();
    //     if (user.user.id === message.author.id) return message.channel.send({embed: embed_error(`${user.user}, извините, но вы не можете наказать самого себя`)});
    //     if (!user) return message.reply({embed: embed_error('Пользователь не является участником сервера, или не существует')});
    //     let reasontext = '';
    //     if (reason !== null && typeof reason !== undefined && reason !== '') reasontext = ` с причиной \`${reason}\``;
    //     if (reason === null || typeof reason === undefined || reason === '') reason = 'Причина не указана.';
    //     let accepting = message.channel.send(`Вы уверены, что хотите выписать предупреждение пользователю \`${user.user.tag}\`${reasontext}?\n\n**Напишите \`да\`, чтобы подтведить.**`);
    //     const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
    //     collector.on('collect', msg => {
    //         if (['да', 'ага', 'кнш', 'конечно', 'конешно', 'давай', 'йес', 'yes', 'y', 'aga', 'go', 'da', 'го'].includes(msg.content.toLowerCase())) {
    //             message.channel.startTyping();
    //             message.delete();
    //             request(`https://${process.env.SITE_DOMAIN}/warn.php?id=${user.user.id}&reason=${encodeURIComponent(reason)}&secret=${encodeURIComponent(process.env.SECRET_KEY)}&user=${message.author.id}`, function (error, response, body) {
    //                 let data = JSON.parse(body);
    //                 let footer = 'Game🌀Space #'+data.id;
    //                 if (reason === null || typeof reason === 'undefined') reason = 'Причина не указана.';
    //                 let embed = new Discord.RichEmbed()
    //                     .setTitle('Предупреждение')
    //                     // .setDescription(`**Пользователь:** ${user.user}\n**Модератор:** ${message.author}\n**Причина:**\n\n${reason}`)
    //                     .addField('Пользователь', `${user.user} (\`${user.user.tag}\`)`, true)
    //                     .addField('Модератор', `${message.author} (\`${message.author.tag}\`)`, true)
    //                     .setFooter(footer)
    //                     .setColor('F1C40F');
    //                 if (reason !== null && typeof reason !== undefined && reason !== '') embed.addField('Причина', `${reason}`);
    //                 message.channel.send(`${user.user}`, {embed}).then(() => {message.channel.stopTyping(true)});
    //                 message.guild.channels.get('426756919777165312').send({embed});
    //             });
    //         }
    //         console.log(collector);
    //         collector.stop();
    //     });
    // }, '[пользователь] <причина>', 'выписать пользователю предупреждение');
    //
    // add_command(['нарушения', 'наказания', 'варны', 'предупреждения', 'муты', 'punishments', 'warns', 'mutes'], false, message, command, args, 'e', null, function () {
    //     message.delete();
    //     let user = message.mentions.members.first();
    //     let requested = '';
    //     let user_molodec = `${message.author}, можете гордиться, вы - молодец!`;
    //     if (user) {
    //         if (!message.member.hasPermission('MANAGE_MESSAGES', false, true, true))
    //             return message.channel.send({embed: embed_error('Вы не имеете права `MANAGE_MESSAGES`, которое требуется для просмотра чужих нарушений\n\nЕсли Вы считаете, что это не так - обратитесь к <@168255014282854401>')})
    //         requested = `, запрошенные пользователем ${message.author} (\`${message.author.tag}\`)`;
    //         user_molodec = `${user} - молодец!`;
    //     } else {
    //         user = message.member;
    //     }
    //     let page = args[0];
    //     if (!isNumeric(page)) page = 1;
    //     request(`https://${process.env.SITE_DOMAIN}/punishments.php?&secret=${encodeURIComponent(process.env.SECRET_KEY)}&user=${user.user.id}`, function (error, response, body) {
    //         let data1 = JSON.parse(body);
    //         let data = [''].concat(data1);
    //         let punishments = '';
    //         console.log(data1);
    //         let limit = 5;
    //         let all_pages = Math.ceil(data.length/limit);
    //         console.log(all_pages);
    //         let current_page = parseInt(page);
    //         if (current_page > all_pages || current_page < 1 || !isNumeric(page))
    //             current_page = 1;
    //         console.log(current_page);
    //         let all_data = data.slice(1+((current_page-1)*limit), (limit+1)+((current_page-1)*limit));
    //         console.log(all_data);
    //         let user_text = '';
    //         if (user !== message.member) user_text = ` ${user}`;
    //         let next_page = ``;
    //         if (current_page < all_pages) next_page = `Для просмотра следующей страницы введите:\n${process.env.PREFIX}${command} ${current_page+1}${user_text}`;
    //         let footer = 'Стр. '+current_page+'/'+all_pages+'; '+data.filter(pun => pun['type'] === 'warn' && pun['deleted'] === false).length+' '+declOfNum(data.filter(pun => pun['type'] === 'warn' && pun['deleted'] === false).length, ['варн', 'варна', 'варнов'])+'; '+data.filter(pun1=>pun1['type'] === 'mute' && pun1['deleted'] === false).length+' '+declOfNum(data.filter(pun1=>pun1['type'] === 'mute' && pun1['deleted'] === false).length, ['мут', 'мута', 'мутов']);
    //         all_data.forEach(function (item, num) {
    //             if (item['deleted']) return;
    //             if (item === [] || item === '') return;
    //             let type;
    //             switch (item['type']) {
    //                 case 'warn':
    //                     type = 'Варн';
    //                     break;
    //                 default:
    //                     type = 'Варн';
    //             }
    //            punishments = punishments + '***' + type + '***  (ID: `' + item['id'] + '`)\n\n**Модератор:** ' + message.guild.members.get(item['user_from']).toString() + '\n**Причина:** `' + item['reason'].replace(/` /g, '\'') + '`\n\n';
    //         });
    //         if (punishments === '' && current_page === 1) punishments = `Нарушений нет. ${user_molodec} :thumbsup::skin-tone-2:\n\n`;
    //         let embed = new Discord.RichEmbed()
    //             .setTitle('Список нарушений')
    //             .setDescription(`Данные о пользователе ${user.user} (\`${user.user.tag}\`)${requested}\n\n${punishments}${next_page}`)
    //             .setFooter(footer)
    //             .setColor('F1C40F');
    //         message.channel.send(`${user.user}`, {embed}).then(() => {message.channel.stopTyping(true)});
    //     });
    // }, '<страница> <пользователь>', 'просмотреть нарушения');

    if (!siteOff)
    add_command(['update_roles', 'обновить_роли', 'восстановить_роли', 'recover_roles', 'rr', 'ur'], true, message, command, args, 'e', null, function () {
        message.delete();
        message.channel.startTyping();
        request('http://'+process.env.SITE_DOMAIN+'/rank.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id, function (error, response, body) {
            if (body.startsWith('<br')) {message.channel.stopTyping(true); message.channel.send({embed: embed_error(`Ошибка восстановления ролей`)}); return message.guild.channels.get(channels.errs).send({embed: embed_error(`Ошибка восстановления ролей пользователя ${message.author} (${message.author.tag}). Содержание ошибки:\n`+body.replace(/<br \/>/g, '\n').replace(/<b>/g, '**').replace(/<\/b>/g, '**'))});}
            const arr = JSON.parse(body);
            let bool = false;
            level_roles.forEach(function (item) {
                if (arr[0] >= item[0]) {
                    if (!message.member.roles.has(item[1])) {
                        message.member.addRole(item[1]).catch(console.error);
                        message.author.send(`Вы получили роль \`${message.guild.roles.get(item[1]).name}\``);
                        bool = true;
                    }
                } else {
                    if (message.member.roles.has(item[1])) {
                        message.member.removeRole(item[1]).catch(console.error);
                    }
                }
            });
            let embed;
            if (bool)
                embed = new Discord.RichEmbed()
                    .setDescription(`${message.member}, ваши роли за уровни были успешно восстановлены`)
                    .setColor('3FB97C');
            else
                embed = new Discord.RichEmbed()
                    .setDescription(`${message.member}, у вас уже есть все ваши роли за уровни`)
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
                message.channel.startTyping();
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
            console.log(collector);
            collector.stop();
        });
    }, '[пользователь]', 'отключить опыт пользователю');

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
client.login(process.env.BOT_TOKEN).catch(err => {console.log(err)});
process.env.BOT_TOKEN = process.env.POSLANIYE;
