const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.info = {
    command: '^{une(mb[ae]d(say)?)?|[уа]н[еэ]мб[еэ]д(сей)?)$',
    name: 'embed',
    lang: {
        'ru': {
            description: '',
        },
        'ua': {
            description: '',
        },
        'en': {
            description: '',
        },
        'pl': {
            description: '',
        }
    },
    access: {
        type: 'any_roles',
        params: ['419562566512017415', '450336165430689793', '417267817763831808']
        //own sr.own sr.admin
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
    message.channel.fetchMessage(args[0]).then(msg => {
        let embed = msg.embeds[0];
        let text = '.embed ';
        if (embed.title) text += `{title: ${embed.title}}`;
        if (embed.description) text += `{description: ${embed.description}}`;
        if (embed.image) text += `{image: ${embed.image.url}}`;
        if (embed.thumbnail) text += `{thumbnail: ${embed.thumbnail.url}}`;
        if (embed.timestamp) text += `{timestamp: ${embed.timestamp}}`;
        if (embed.color) text += `{color: ${embed.color}}`;
        if (embed.footer) {
            let ttext = '';
            if (embed.footer.iconURL)
                ttext = ' | icon: '+embed.footer.iconURL;
            text += `{footer: ${embed.footer.text}${ttext}}`
        }
        if (embed.author) {
            let ttext = '';
            if (embed.author.iconURL)
                ttext += ' | icon: '+embed.footer.iconURL;
            if (embed.author.url)
                ttext += ' | url: '+embed.footer.url;
            text += `{footer: ${embed.footer.text}${ttext}}`
        }
        message.author.send('```'+text+'```')
    })
};