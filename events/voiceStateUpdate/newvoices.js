module.exports.run = function (old_m, new_m) {
    new_m.client.channels.get('466602142774329345').children.filter(c => c.id !== '466601087072206858').forEach((channel, id) => {
        if (channel.members.size === 0) {
            setTimeout(() => {
                if (channel.members.size === 0) {
                    channel.delete();
                    new_m.client.privateChannels.remove(channel.id);
                }
            }, 60000)
        }
    });
    if (new_m.voiceChannelID === '466601087072206858') {
        if (new_m.client.privateChannels.find('id', new_m.user.id)) new_m.setVoiceChannel(new_m.client.privateChannels.find('id', new_m.user.id).channel).catch();
        if (new_m.roles.has('466621050340507649')) return new_m.setVoiceChannel(new_m.guild.afkChannelID);
        new_m.guild.createChannel('Созвездие '+new_m.displayName, 'voice', [{
            id: new_m.id,
            allow: ['MANAGE_CHANNELS']
        },{id: new_m.guild.roles.find('name', '@everyone'), deny: ['VIEW_CHANNEL']},{id: '465560566015066115', allow: ['VIEW_CHANNEL']},{id: '465560714770382858', allow: ['VIEW_CHANNEL']},{id: '465560712677294091', allow: ['VIEW_CHANNEL']},{id: '465560915203588106', allow: ['VIEW_CHANNEL']}]).then(channel => {
            channel.setParent('466602142774329345').catch();
            new_m.setVoiceChannel(channel.id).catch();
            new_m.client.privateChannels.set(channel.id, {id: new_m.user.id, channel: channel.id});
        })
    }
};