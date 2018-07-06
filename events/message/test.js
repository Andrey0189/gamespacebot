module.exports.run = function (message) {
    if (message.content === 'test') message.channel.send('test');
};