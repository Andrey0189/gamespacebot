module.exports.run = function (reaction, user) {
    console.log(reaction);
    console.log(user);
    if (reaction.message.id !== '466113221464424459') return;
    console.log(reaction.emoji.name);
    if (reaction.emoji.name !== '🆗') return;
    let react = reaction.message.reactions.filter(r => r.users.has(user.id) && r.emoji.name !== '🆗');
    if (!react) reaction.remove(user);
    react.forEach((reaction) => {
        if (reaction.emoji.name === '🇷🇺') {
            reaction.message.guild.members.get(user.id).addRole('465560566015066115').catch();
            reaction.remove(user);
        }
        if (reaction.emoji.name === '🇺🇦') {
            reaction.message.guild.members.get(user.id).addRole('465560714770382858').catch();
            reaction.remove(user);
        }
        if (reaction.emoji.name === '🇬🇧') {
            reaction.message.guild.members.get(user.id).addRole('465560712677294091').catch();
            reaction.remove(user);
        }
        if (reaction.emoji.name === '🇵🇱') {
            reaction.message.guild.members.get(user.id).addRole('465560915203588106').catch();
            reaction.remove(user);
        }
    });
    reaction.remove(user);
};