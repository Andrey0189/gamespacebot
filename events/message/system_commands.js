const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.run = function (message) {
    if (message.channel.id !== '421260737281785856') return;
    if (!message.author.bot) return;
    if (message.author.discriminator !== '0000') return;
    if (message.content.indexOf('.') !== 0) return;
    const args = message.content.slice('.'.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let games = {
        'rl': 'Rocket League',
        'd2': 'Dota 2',
        'cs': 'CS:GO',
        'll': 'League of Legends'
    };

    let lang = {
        'ru': 'Для того, чтобы присоединится к игрокам в **'+games[args[1]]+'**, и войти в один голосовой канал с ними вам нужно нажать на эту ссылку:\n<',
        'ua': 'Для того, щоб приєднається до гравців в **'+games[args[1]]+', і увійти в один голосовий канал з ними вам потрібно натиснути на це посилання:\n<',
        'en': 'In order to join players of **'+games[args[1]]+'**, and to enter one voice channel with them you need to click on this link:\n<',
        'pl': 'Aby dołączyć do graczy w **'+games[args[1]]+'** i wprowadzić jeden kanał głosowy za ich pomocą, musisz kliknąć ten link:\n<',
    };


    let lang_code = message.client.langs.get(args[0]) || 'ru';
    lang = lang[lang_code];

    let invites = {
        'ru': {
            'rl': 'https://discord.gg/naDAzVw',
            'cs': 'https://discord.gg/N6AmUn',
            'd2': 'https://discord.gg/8zhPVRb',
            'll': 'https://discord.gg/ZDjYSXG'
        },
        'ua': {
            'rl': 'https://discord.gg/naDAzVw',
            'cs': 'https://discord.gg/N6AmUn',
            'd2': 'https://discord.gg/8zhPVRb',
            'll': 'https://discord.gg/ZDjYSXG'
        },
        'en': {
            'rl': 'https://discord.gg/qgHYh4y',
            'cs': 'https://discord.gg/7s7JMGA',
            'd2': 'https://discord.gg/aC5y9MA',
            'll': 'https://discord.gg/zW2nC98'
        },
        'pl': {
            'rl': 'https://discord.gg/qgHYh4y',
            'cs': 'https://discord.gg/7s7JMGA',
            'd2': 'https://discord.gg/aC5y9MA',
            'll': 'https://discord.gg/zW2nC98'
        }
    };

    if (command === 'connect') {
        message.guild.members.get(args[0]).send(lang+invites[lang_code][args[1]]+'>')
    }
    if (command === 'nick') {
        message.guild.members.get(args[0]).setNickname(args[1]).catch();
    }

    if (command === 'color') {
        let role = message.guild.roles.get(args[1]);
        if (!role.name.startsWith('🎨')) return;
        let member = message.guild.members.get(args[0]);
        if (!member) return;
        member.roles.filter(r => r.name.startsWith('🎨')).forEach(role => member.removeRole(role).catch(console.error));
        member.addRole(role).catch();
    }

    if (command === 'games') {
        try {
            let member = message.guild.members.get(args.shift());
            if (!member) return;
            let arr = JSON.parse(args.join(' '));
            for (let game in arr) {
                if (arr.hasOwnProperty(game)) {
                    let value = arr[game];
                    let role = message.guild.roles.get(game);
                    if (!role) return;
                    if (value) member.addRole(role).catch(console.error);
                    else member.removeRole(role).catch(console.error)

                }
            }
        } catch (e) {console.error(e)}
    }
};