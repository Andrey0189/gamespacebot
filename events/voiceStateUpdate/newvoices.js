module.exports.run = function (old_m, new_m) {
    new_m.client.channels.get('466602142774329345').children.filter(c => c.id !== '466601087072206858').forEach((channel, id) => {
        if (channel.members.size === 0) {
            setTimeout(() => {
                if (channel.members.size === 0) {
                    channel.delete();
                }
            }, 60000)
        }
    });
    if (new_m.voiceChannelID === '466601087072206858') {
        if (new_m.roles.has('466621050340507649')) return new_m.setVoiceChannel(new_m.guild.afkChannelID);
        new_m.guild.createChannel('Созвездие '+new_m.displayName, 'voice', [{
            id: new_m.id,
            allow: ['MANAGE_CHANNELS']
        },{id: new_m.guild.roles.find('name', '@everyone'), deny: ['VIEW_CHANNEL']}]).then(channel => {channel.setParent('466602142774329345').catch();new_m.setVoiceChannel(channel.id).catch()})
    }
};