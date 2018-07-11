const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.info = {
    command: '^(e(mb[ae]d(say)?)?|[еэ]мб[еэ]д(сей)?)$',
    name: 'embed',
    lang: {
        'ru': {
            description: 'Команда для отправки эмбеда от имени бота',
        },
        'ua': {
            description: 'Команда для відправки ембеду від імені бота',
        },
        'en': {
            description: 'Command for sending the embed on behalf of the bot',
        },
        'pl': {
            description: 'Polecenie wysłania embedu w imieniu bota',
        }
    },
    access: {
        type: 'any_roles',
        params: ['419562566512017415', '450336165430689793', '417267817763831808']
        //own sr.own sr.admin
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
    let lang = {
        'ru': {
            'error': 'Ошибка!',
            'error_embed': 'Ошибка отправки эмбеда'
        },
        'ua': {
            'error': 'Помилка!',
            'error_embed': 'Помилка відправки ембеду'
        },
        'en': {
            'error': 'Error!',
            'error_embed': 'Error while sending embed'
        },
        'pl': {
            'error': 'Pomyłka!',
            'error_embed': 'Pomyłka wysłania embedu'
        }
    };
    lang = lang[language];
    try {
        let text = args.join(" ").replace(/\n/g, "\\n");
        let embed = new Discord.RichEmbed();
        let footer = text.match(/{footer:(.*?)( \| icon: ?(.*?))?}/i);
        if (footer !== null) {
            embed.setFooter(footer[1], footer[3])
        }
        let image = text.match(/{image: ?(.*?)( \| inline)?}/i);
        if (image !== null) {
            if (image[2] !== null)
            embed.attachFile({
                attachment: image[1],
                file: image[1].substring(image[1].lastIndexOf('/') + 1)
            }).setImage('attachment://'+image[1].substring(image[1].lastIndexOf('/') + 1));
            else
                embed.setThumbnail(image[1]);
        }
        let thumb = text.match(/{thumbnail: ?(.*?)( \| inline)?}/i);
        if (thumb !== null) {
            if (thumb[2] !== null)
            embed.attachFile({
                attachment: thumb[1],
                file: thumb[1].substring(thumb[1].lastIndexOf('/') + 1)
            }).setThumbnail('attachment://'+thumb[1].substring(thumb[1].lastIndexOf('/') + 1));
            else
                embed.setThumbnail(thumb[1]);
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
        message.channel.send(func.generateErrorMessage(language, client, lang['error'], lang['error_embed'])).then(msg => msg.delete(3000));
        console.error(e);
    }
};