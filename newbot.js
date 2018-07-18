const Discord = require('discord.js');
const request = require("request");
// const rgbcolor = require('rgbcolor');
// const getImageColors = require('get-image-colors');
// const inspect  = require("util");
const vm = require("vm");
const fs = require ("fs");
const util = require('util');
const codeContext =  {};
const prefix = ".";
vm.createContext(codeContext);
const client = new Discord.Client({ autofetch: [
    'MESSAGE_CREATE',
    'MESSAGE_UPDATE',
    'MESSAGE_REACTION_ADD',
    'MESSAGE_REACTION_REMOVE',
], ws: {
    compress: false
}});
// const rule = {
//     own: "419562566512017415",
//     trusted_own: "430006994607538201",
//     ban_hammer: "417267817763831808",
//     game_admin: "417312252463677451",
//     moder: "426411685595578382"
// };

client.cooldown = new Set();
const func = require('./func.js');

client.commands = new Discord.Collection();
client.categories = new Discord.Collection();
client.langs = new Discord.Collection();
client.channel_settings = new Discord.Collection();
client.tasks = [];
client.privateChannels = new Discord.Collection();

client.channel_settings.set('417266234032390155', {notificationsAllowed: true});
client.channel_settings.set('418096126957453337', {notificationsAllowed: true});
client.channel_settings.set('448815323840380929', {notificationsAllowed: true, add_level: false});
client.channel_settings.set('421664477662937098', {notificationsAllowed: true});


client.level_roles = [
    [2, '417389665042169876'],
    [5, '417391646863523858'],
    [10, '417391865038635010'],
    [15, '417392325405442058'],
    [20, '417393247162204160'],
    [23, '417392902872891393'],
    [25, '417392121541296128'],
    [28, '417392180747829249'],
    [30, '417392444750168075']
];

client.log_channels = {
    errors: '432071031356915722',
    join_leave: '464702070902095873',
    ideas: '466590820611522591'
};

console.color = (params, text) => {
    const colors = {
        'reset': "0",
        'bright': "1",
        'dim': "2",
        'underscore': "4",
        'blink': "5",
        'reverse': "7",
        'hidden': "8",
        'black': "30",
        'red': "31",
        'green': "32",
        'yellow': "33",
        'blue': "34",
        'magenta': "35",
        'cyan': "36",
        'white': "37",
        'crimson': "38",
        'bgBlack': "40",
        'bgRed': "41",
        'bgGreen': "42",
        'bgYellow': "43",
        'bgBlue': "44",
        'bgMagenta': "45",
        'bgCyan': "46",
        'bgWhite': "47",
        'bgCrimson': "48"
    };
    for (let color in colors) {
        let num= colors[color];
        params = params.replace(new RegExp(color), num)
    }
    let arr = text.split('\n');
    return `\x1b[${params}m`+arr.join(`\x1b[0m\n\x1b[${params}m`)+'\x1b[0m';
};

console.error = (text, name) => {
    let error_name = '';
    if (name) error_name = console.color('bgRed;bright;yellow', ' '+name);
    let end = '';
    let center = ' ';
    if (typeof text !== 'string') text = JSON.stringify(text, null, 2);
    if (text.match(/\n/) || text.length > 200) {
        end = '\n'+console.color('bgRed;bright;white', '-----');
        center = '\n';
    }
    console.log(console.color('bgRed;bright;white', '× Произошла ошибка')+error_name+console.color('bgRed;white', ':')+center+console.color('bright;red', text)+end)
};

console.warning = (text) => {
    let end = '';
    let center = ' ';
    if (typeof text !== 'string') text = JSON.stringify(text, null, 2);
    if (text.match(/\n/) || text.length > 200) {
        end = '\n'+console.color('bgYellow;bright;white', '-----');
        center = '\n';
    }
    console.log(console.color('bgYellow;bright;white', '! Внимание:')+center+console.color('bright;yellow', text)+end)
};

console.success = (text) => {
    let end = '';
    let center = ' ';
    if (typeof text !== 'string') text = JSON.stringify(text, null, 2);
    if (text.match(/\n/) || text.length > 200) {
        end = '\n'+console.color('bgGreen;bright;white', '-----');
        center = '\n';
    }
    console.log(console.color('bgGreen;bright;white', '√ Успех:')+center+console.color('bright;green', text)+end)
};

console.info= (text, name) => {
    let info_name = '';
    if (name) info_name = console.color('bgBlue;bright;yellow', ' '+name);
    let end = '';
    let center = ' ';
    if (typeof text !== 'string') text = JSON.stringify(text, null, 2);
    if (text.match(/\n/) || text.length > 200) {
        end = '\n'+console.color('bgBlue;bright;white', '-----');
        center = '\n';
    }
    console.log(console.color('bgBlue;white', 'i Информация')+info_name+console.color('bgBlue;bright;white', ':')+center+console.color('bright;white', text)+end)
};

client.on('ready', () => {
    request('http://'+process.env.SITE_DOMAIN+'/langs.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+client.user.id, function (error, response, body) {
        try {
            let arr = JSON.parse(body);
            arr.forEach((obj) => {
                client.langs.set(obj.id, obj.lang);
            });
        } catch (e) {console.error(e)}
    });
    func.updVoiceData(client, request);
    request('http://'+process.env.SITE_DOMAIN+'/get_active_tasks.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+client.user.id, function (error, response, body) {
        try {client.tasks = JSON.parse(body);} catch (e) {console.log('--- tasks get failed: '+e);console.log(body)}
    });
    client.channels.get('466113074512789524').fetchMessage('466113221464424459');
});

fs.readdir("./commands/", (err, files) => {

    let commandCount = 0;

    if (err) console.error(err);
    if (files.length <= 0) {
        console.log(console.color('bgYellow;white', 'Категорий нет.'));
        return;
    }
    files.forEach((c, ci, ca) => {
        if (!fs.existsSync(`./commands/${c}/config.json`)) return console.error(`Категория ${console.color('reset', c)} ${console.color('bright;red', 'не загружена: не обнаружен файл конфигурации категории.')}`);
        let cat_info = require("./commands/"+c+"/config.json");
        console.log(console.color('bright;green', `Категория `) + c + console.color('bright;green', ` загружена`));
        client.categories.set(c, cat_info);
        fs.readdir("./commands/"+c+"/", (err, cmds) => {
        let jsfile = cmds.filter(c => c.endsWith('.js') && !c.startsWith('-'));
            jsfile.forEach((f, fi, fa) => {
                let props = require(`./commands/${c}/${f}`);
                let commandName = f.replace(/\.js$/i, '');

                console.log(console.color('bright;green', `Команда `) + commandName + console.color('bright;green', ` загружена`));
                commandCount++;
                props.info.code = props;
                props.info.category = c;
                client.commands.set(props.info.command, props.info );
                if (fi === fa.length - 1 && ci === ca.length - 1)
                    console.log(console.color('bgGreen;white', `Загружен${func.declOfNum(commandCount, ['а', 'о', 'о'])} ${commandCount} ${func.declOfNum(commandCount, ['команда', 'команды', 'команд'])}`));
            });
        });
    });
    
});
fs.readdir("./events/", (err, files) => {
    files.forEach((event) => {
        if (!event.startsWith('-'))
        fs.readdir(`./events/${event}/`, (err, listeners) => {
            listeners.filter(f => f.endsWith('.js')).forEach(listener => {
                let code = require(`./events/${event}/${listener}`);
                client.on(event, code.run);
                console.log(console.color('bright;green', `Загружен слушатель `)+listener.replace(/\.js$/i, '')+console.color('bright;green', ` ивента `)+event);
            })
        })
    })
});
let lang_phrases = {
    'ru': {
        'help': {
            'list': 'Список команд',
        }
    },
    'ua': {
        'help': {
            'list': 'Список команд',
        }
    },
    'en': {
        'help': {
            'list': 'List of commands',
        }
    },
    'pl': {
        'help': {
            'list': 'Lista poleceń',
        }
    }
};
// process
//     .on('unhandledRejection', (reason, p) => {
//         console.error(reason, 'Unhandled Rejection at Promise', p);
//     })
//     .on('uncaughtException', err => {
//         console.error(err, 'Uncaught Exception thrown');
//     });
client.on('message', async (message) => {
    let lang = client.langs.get(message.author.id) || 'ru';
    let l = lang_phrases[lang];
    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    console.log(client.cooldown);

    if (!['448815323840380929', '465557872097492993'].includes(message.channel.id))
    if (!client.cooldown.has(message.author.id)) {
        if (message.author.bot) return;
        request('http://'+process.env.SITE_DOMAIN+'/add.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                try {
                    let lvls = JSON.parse(body);
                    if (parseInt(lvls[0]) !== parseInt(lvls[1])) {
                        let msgs = [
                            `Ура, ${message.author} получил **${lvls[1]}** уровень! Поздравьте его!`,
                            `Вы же уже знаете, что у ${message.author} уже аж **${lvls[1]}** уровень?!)`,
                            `${message.author}, а ты хорош! У тебя **${lvls[1]}** уровень! Не ожидал от тебя такого о_О`,
                            `${message.author}, поздравляю с **${lvls[1]}** уровенем!`,
                        ];
                        let msg = msgs[func.getRandomInt(1,msgs.length)-1];
                        if (client.channel_settings.get(message.channel.id) && client.channel_settings.get(message.channel.id).notificationsAllowed) {
                            message.channel.send(msg);
                        } else {
                            client.channels.get('417266234032390155').send(msg);
                        }
                        client.level_roles.forEach(function (item) {
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
                } catch (e) {console.error(e)}
            }
        });
        client.cooldown.add(message.author.id);
        setTimeout(() => {
            client.cooldown.delete(message.author.id);
        }, 60000);
    }
    
    if (command.match(/^(h[eaа]lp[eе]?|п[а|о]м[а|о]([щ|ш]ь?|ги)|х[эаеaeє]лп|допомо(га?|жи)|pom[oó]c)/im)) {
        message.delete();
        let cmds = '';
        client.categories.forEach((cat_info, cat) => {
            if (client.commands.filter(m => m.category === cat && !m.hidden).length === 0) return;
            let smallcmds = '';
            let count = 0;
            smallcmds += '= '+cat_info['name'][lang] + ':\n';
            client.commands.filter(m => m.category === cat && !m.hidden).forEach(cmd => {
                let access;
                if (cmd.access)
                    access = func.hasMemberRights(message.channel, message.member, cmd.access.type, cmd.access.params, lang);
                else access = {access: true, message: {}};
                if (access.access) {
                    smallcmds += ' ' + prefix + cmd.name + ' — ' + cmd.lang[lang].description + '\n';
                    count++;
                }
            });
            if (count > 0 ) cmds += smallcmds;
        });
        message.channel.send(`\`\`\`asciidoc\n${message.member.displayName}#${message.author.discriminator} [${lang.toUpperCase()}]\n:: ${l['help']['list']} ::\n\n${cmds}\`\`\``);
        return;
    }
    if (command.match(/^(e[vb][aoe]l|[эеe][вб][аое]л)$/im)) {
        let access = func.hasMemberRights(message.channel, message.member, 'creator', null, 'ru');
        if (access.access) {
            const code = args.join(" ");
            try {
                let output = eval(code);
                output = util.inspect(output, {depth: 0, maxArrayLength: null});
                output = clean(output);
                if (output.length < 1950) {
                    message.author.send(`\`\`\`js\n${output}\n\`\`\``);
                    message.react("✅").catch()
                } else {
                    message.author.send(`${output}`, {split: "\n", code: "js"});
                }
            } catch (error) {
                message.channel.send(`Произошла ошибка: \`\`\`js\n${error}\`\`\``);
                message.react("❎").catch()
            }

            function clean(text) {
                return text
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
            }
        } else {
            message.reply(access.message);
        }
    }
    let commandfile = client.commands.filter(m => {
        return command.match(new RegExp(m.command, 'im'));
    }).first();
    console.log(commandfile);
    if (commandfile) {
        let access;
        if (commandfile.access)
        access = func.hasMemberRights(message.channel, message.member, commandfile.access.type, commandfile.access.params, lang);
        else access = {access: true, message: {}};
        if (access.access)
        commandfile.code.run(client, message, command, args, commandfile.info, lang).catch();
        else message.reply(access.message);
    }
});
client.on('disconnect', () => {
    client.login(process.env.BOT_TOKEN).catch(console.error);
});
client.login(process.env.BOT_TOKEN).catch(console.error);
process.env.BOT_TOKEN = process.env.POSLANIYE;