module.exports.info = {
	command: 'testt?t?o?'
};
module.exports.run = async function (client, message, command, args, commandinfo) {
message.channel.send(command);
};