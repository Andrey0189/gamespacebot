const func = require('../../func.js');
const Discord = require('discord.js');
const request = require("request");
module.exports.info = {
    command: '^(reset_lang)$',
    name: 'reset_lang',
    lang: {
        hidden: true
    }
};
module.exports.run = async function (client, message, command, args, info, language) {
    message.member.removeRoles(['465560566015066115', '465560714770382858', '465560712677294091', '465560915203588106']).catch();
};