const Discord = require('discord.js');
const request = require("request");
const rgbcolor = require('rgbcolor');
const getImageColors = require('get-image-colors');
const inspect  = require("util");
const vm = require("vm");
const codeContext =  {};
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
require('./func.js');

client.commands = new Discord.Collection();
client.categories = [];

fs.readdir("./categories/", (err, files) => {

    let commandCount = 0;

    if (err) console.error(err);
    if (files.length <= 0) {
        console.log("Категорий нет.");
        return;
    }
    files.forEach((c) => {
    console.log(`Категория ${c} загружена`);
    client.categories.push(c);
    fs.readdir("./commands/"+c+"/", (err, cmds) => {
    jsfile = cmds.filter(c => c.endsWith('.js'));
    jsfile.forEach((f) => {
        let props = require(`./commands/${c}/${f}`);
        let commandName = f.slice(-2);

        console.log(`Команда ${f} загружена`);
        commandCount++;
props.info.code = props;
props.info.category = c;
        client.commands.set(props.info.command, props.info );
    });
    });
    });
    console.log(`-----\nБот запущен\nВсего ${commandCount} ${declOfNum(commandCount, ['команда', 'команды', 'команд'])}`);
});