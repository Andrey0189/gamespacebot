const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.run = function (member) {
    let days = Math.ceil(Math.abs(new Date().getTime() - member.user.createdAt.getTime()) / (1000 * 3600 * 24));
    let att = new Discord.Attachment(member.user.avatarURL, 'avatar.png');
    let embed = new Discord.RichEmbed()
        .setColor('2ECC71')
        .setTitle('Зашел на сервер')
        .setDescription(`${member}  \`${member.user.tag}\`\n${member.user.id}\nЗарегистрирован: ${member.user.createdAt.toISOString().replace(/[TZ]/g, ' ')} UTC\n**${days}** ${func.declOfNum(days, ['день', 'дня', 'дней'])} в Discord\n\n**${member.guild.memberCount}** ${func.declOfNum(member.guild.memberCount, ['участник', 'участника', 'участников'])} на сервере`)
        .attachFile(att)
        .setThumbnail('attachment://avatar.png')
        .setTimestamp(new Date());
    member.client.channels.get(member.client.log_channels.join_leave).send(embed);
};