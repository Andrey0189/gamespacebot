const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.info = {
	command: '^(ping|п[и|і|i]нг)$'
};
module.exports.run = async function (client, message, command, args, info) {
	message.delete();
	const color = parseInt(func.getRandomInt(0, 16777214));
	const apiping = Math.round(client.ping)
    const embed = new Discord.RichEmbed()
        .setTitle('Пинг')
        .setDescription(`\nОсновной сервер: **Расчет...**\nAPI сервер: **${apiping}**мс`)
        .setFooter('Внимание! Этот пинг отностится только к боту!')
        .setColor(color);
    message.channel.send({embed}).then(m => {
        const embed_req = new Discord.RichEmbed()
            .setTitle('Пинг')
            .setDescription(`\nОсновной сервер: **${m.createdTimestamp - message.createdTimestamp}**мс\nAPI сервер: **${apiping}**мс`)
            .setFooter('Внимание! Этот пинг отностится только к боту!')
            .setColor(color);
        m.edit({embed: embed_req});
    });
}