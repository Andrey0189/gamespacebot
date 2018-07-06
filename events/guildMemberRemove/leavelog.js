const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.run = function (member) {
    let days = Math.ceil(Math.abs(new Date().getTime() - member.user.createdAt.getTime()) / (1000 * 3600 * 24));
    let days_s = Math.ceil(Math.abs(new Date().getTime() - member.joinedAt.getTime()) / (1000 * 3600 * 24));
    let att = new Discord.Attachment(member.user.avatarURL, 'avatar.png');
    let embed = new Discord.RichEmbed()
        .setColor('E74C3C')
        .setTitle('Вышел с сервера')
        .setDescription(`${member}  \`${member.user.tag}\`\n${member.user.id}\nЗарегистрирован: ${member.user.createdAt.toISOString().replace(/[TZ]/g, ' ')} UTC\n**${days}** ${func.declOfNum(days, ['день', 'дня', 'дней'])} в Discord\nЗашел на сервер: ${member.joinedAt.toISOString().replace(/[TZ]/g, ' ')} UTC\nПровел **${days}** ${func.declOfNum(days, ['день', 'дня', 'дней'])} на сервере\n\n**${member.guild.memberCount}** ${func.declOfNum(member.guild.memberCount, ['участник', 'участника', 'участников'])} на сервере`)
        .attachFile(att)
        .setThumbnail('attachment://avatar.png')
        .setTimestamp(new Date());
    member.client.channels.get(member.client.log_channels.join_leave).send(embed);
};