const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.run = function (message) {
    if (message.channel.id !== '421260737281785856') return;
    if (!message.author.bot) return;
    if (message.author.discriminator !== '0000') return;
    if (message.content.indexOf('.') !== 0) return;
    const args = message.content.slice('.'.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let lang = {
        'ru': 'Для того, чтобы присоединится к этим людям, и войти в один голосовой канал с ними вам нужно нажать на эту ссылку:\n<',
        'ua': 'Для того, щоб приєднається до цих людей, і увійти в один голосовий канал з ними вам потрібно натиснути на це посилання:\n<',
        'en': 'In order to join these people, and to enter one voice channel with them you need to click on this link:\n<',
        'pl': 'Aby dołączyć do tych osób i wprowadzić jeden kanał głosowy za ich pomocą, musisz kliknąć ten link:\n<',
    };

    let lang_code = message.client.langs.get(args[0]) || 'ru';
    lang = lang[lang_code];

    let invites = {
        'ru': {
            'rl': 'https://discord.gg/Jvzvx3h',
            'cs': 'https://discord.gg/naDAzVw',
            'd2': 'https://discord.gg/ZDjYSXG',
            'll': 'https://discord.gg/Um6sV7g'
        }
    };

    if (command === 'connect') {
        message.guild.members.get(args[0]).send(lang+invites[lang_code][args[1]]+'>')
    }
};