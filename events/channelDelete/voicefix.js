module.exports.run = function (channel) {
    if (channel.type !== 'voice') return;
    if (!channel.parentID) return;
    if (channel.parentID !== '466602142774329345') return;
    if (channel.client.privateChannels.has(channel.id))
    channel.client.privateChannels.delete(channel.id);
};