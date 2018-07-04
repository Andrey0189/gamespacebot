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
]});
// const rule = {
//     own: "419562566512017415",
//     trusted_own: "430006994607538201",
//     ban_hammer: "417267817763831808",
//     game_admin: "417312252463677451",
//     moder: "426411685595578382"
// };

const cooldown = [];
const func = require('./func.js');

client.commands = new Discord.Collection();
client.categories = new Discord.Collection();
client.langs = new Discord.Collection();
client.channel_settings = new Discord.Collection();

client.channel_settings.set('417266234032390155', {notificationsAllowed: true});
client.channel_settings.set('418096126957453337', {notificationsAllowed: true});
client.channel_settings.set('448815323840380929', {notificationsAllowed: true, add_level: false});
client.channel_settings.set('421664477662937098', {notificationsAllowed: true});

const level_roles = [
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

const log_channels = {
    errors: '432071031356915722'
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
});

fs.readdir("./commands/", (err, files) => {

    let commandCount = 0;

    if (err) console.error(err);
    if (files.length <= 0) {
        console.log("Категорий нет.");
        return;
    }
    files.forEach((c, ci, ca) => {
        if (!fs.existsSync(`./commands/${c}/config.json`)) return console.error(`Категория ${c} не загружена: не обнаружен файл конфигурации категории.`);
        let cat_info = require("./commands/"+c+"/config.json");
        console.log(`Категория ${c} загружена`);
        client.categories.set(c, cat_info);
        fs.readdir("./commands/"+c+"/", (err, cmds) => {
        let jsfile = cmds.filter(c => c.endsWith('.js'));
            jsfile.forEach((f, fi, fa) => {
                let props = require(`./commands/${c}/${f}`);
                let commandName = f.replace(/\.js$/i, '');

                console.log(`Команда ${commandName} загружена`);
                commandCount++;
                props.info.code = props;
                props.info.category = c;
                client.commands.set(props.info.command, props.info );
                if (fi === fa.length - 1 && ci === ca.length - 1)
                    console.log(`-----\nБот запущен\nВсего загружен${func.declOfNum(commandCount, ['а', 'о', 'о'])} ${commandCount} ${func.declOfNum(commandCount, ['команда', 'команды', 'команд'])}`);
            });
        });
    });
    
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
client.on('message', async (message) => {
    let lang = client.langs.get(message.author.id) || 'ru';
    let l = lang_phrases[lang];
    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    if (!cooldown.includes(message.author.id)) {
        if (message.author.bot) return;
        request('http://'+process.env.SITE_DOMAIN+'/add.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+message.author.id, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                if (body.startsWith('<br')) { return message.guild.channels.get(log_channels.errors).send(func.generateErrorMessage('ru', client, `Произошла ошибка!`, `Ошибка добавления уровня пользователю ${message.author} (${message.author.tag}). Содержание ошибки:\n`+body.replace(/<br \/>/g, '\n').replace(/<b>/g, '**').replace(/<\/b>/g, '**')));}
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
        cooldown.push(message.author.id);
        setTimeout(() => {
            cooldown.splice(cooldown.indexOf(message.author.id),1);
        }, 60000);
    }
    
    if (command.match(/^(h[eaа]lp[eе]?|п[а|о]м[а|о]([щ|ш]ь?|ги)|х[эаеaeє]лп)/im)) {
        message.delete();
        let cmds = '';
        client.categories.forEach((cat_info, cat) => {
            if (client.commands.filter(m => m.category === cat && !m.hidden).length === 0) return;
            cmds += cat_info['name'][lang] + ':\n';
            client.commands.filter(m => m.category === cat && !m.hidden).forEach(cmd => {
                cmds += ' ' + prefix + cmd.name + ' — ' + cmd.lang[lang].description + '\n';
            })
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
client.login(process.env.BOT_TOKEN).catch(console.error);
process.env.BOT_TOKEN = process.env.POSLANIYE;