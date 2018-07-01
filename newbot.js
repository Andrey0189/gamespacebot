const Discord = require('discord.js');
const request = require("request");
const rgbcolor = require('rgbcolor');
const getImageColors = require('get-image-colors');
const inspect  = require("util");
const vm = require("vm");
const fs = require ("fs");
const codeContext =  {};
const prefix = ".";
vm.createContext(codeContext);
const client = new Discord.Client({ autofetch: [
    'MESSAGE_CREATE',
    'MESSAGE_UPDATE',
    'MESSAGE_REACTION_ADD',
    'MESSAGE_REACTION_REMOVE',
]});
const rule = {
    own: "419562566512017415",
    trusted_own: "430006994607538201",
    ban_hammer: "417267817763831808",
    game_admin: "417312252463677451",
    moder: "426411685595578382"
};
const func = require('./func.js');

client.commands = new Discord.Collection();
client.categories = [];

fs.readdir("./commands/", (err, files) => {

    let commandCount = 0;

    if (err) console.error(err);
    if (files.length <= 0) {
        console.log("Категорий нет.");
        return;
    }
    files.forEach((c, ci, ca) => {
    console.log(`Категория ${c} загружена`);
    client.categories.push(c);
    fs.readdir("./commands/"+c+"/", (err, cmds) => {
    jsfile = cmds.filter(c => c.endsWith('.js'));
    jsfile.forEach((f, fi, fa) => {
        let props = require(`./commands/${c}/${f}`);
        let commandName = f.replace(/\.js$/i, '');

        console.log(`Команда ${commandName} загружена`);
        commandCount++;
props.info.code = props;
props.info.category = c;
        client.commands.set(props.info.command, props.info );
        if (fi == fa.length - 1 && ci == ca.length - 1) {
        	let letter;
        	if (commandCount == 1) letter = 'а'; else letter = 'о';
        console.log(`-----\nБот запущен\nВсего загружен${func.declOfNum(commandCount, ['а', 'о', 'о'])} ${commandCount} ${func.declOfNum(commandCount, ['команда', 'команды', 'команд'])}`);}
    });
    });
    });
    
});
client.on('message', async (message) => {
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if (command.match(/^(h[e|a]lpe?|п[а|о]м[а|о]([щ|ш]ь?|ги))/im)) {
    	message.delete();
        let cmds = '';
        client.categories.forEach((category) => {
            cmds += category + ':\n';
            client.commands.filter(m => m.category == category).forEach(cmd => {
	            cmds += '    '+prefix+cmd.name+'\n';
            })
        });
        message.channel.send(`\`\`\`asciidoc\nСписок команд:\n\n${cmds}\`\`\``);
        return;
    }
    let commandfile = client.commands.filter(m => command.match(new RegExp(m.command, 'im'))).first();
    console.log(commandfile);
    if (commandfile) commandfile.code.run(client, message, command, args, commandfile.info);
});
client.login(process.env.BOT_TOKEN).catch(console.error);
process.env.BOT_TOKEN = process.env.POSLANIYE;