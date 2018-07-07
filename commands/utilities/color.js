const Discord = require('discord.js');
const rgbcolor = require('rgbcolor');
const func = require('../../func.js');

module.exports.info = {
    command: '^((s(how)?)?c(olor)?|цвет)$',
    name: 'color [HEX|RGB]',
    lang: {
        'ru': {
            description: 'Команда для отображения и конвертации цвета',
        },
        'ua': {
            description: 'Команда для відображення і конвертації кольору',
        },
        'en': {
            description: 'Command for displaying and converting colors',
        },
        'pl': {
            description: 'Polecenie do wyświetlania i konwersji kolorów',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
    if (!args[0]) return;
    let color = new rgbcolor(args.join(' '));
    if (!color.ok) return;
    const att = new Discord.Attachment('http://'+process.env.SITE_DOMAIN+'/color.php?red='+color.r+'&green='+color.g+'&blue='+color.b+'&secret='+encodeURIComponent(process.env.SECRET_KEY), 'color.png');
    const embed = new Discord.RichEmbed()
        .setTitle(`${args.join(' ')}`)
        .attachFile(att)
        .setImage('attachment://color.png')
        .setDescription(`Hex: \`${color.toHex()}\`\nRGB: \`${color.toRGB()}\``)
        .setColor(color.toHex());
    message.reply({embed});
    message.delete();
};