module.exports.run = function (old_m, new_m) {
    if (new_m.voiceChannelID === '466601087072206858') {
        new_m.guild.createChannel('Созвездие '+new_m.displayName, 'voice', [{
            id: new_m.id,
            allow: ['MANAGE_CHANNELS']
        },{id: new_m.guild.roles.find('name', 'everyone').id, deny: ['VIEW_CHANNEL']}]).then(channel => {channel.setParent('466602142774329345').catch();new_m.setVoiceChannel(channel.id).catch()})
    }
};