module.exports.run = function (reaction, user) {
    if (reaction.message.id !== '466113221464424459') return;
    console.log(reaction.emoji.name);
    if (reaction.emoji.name !== '🆗') return;
    let react = reaction.message.reactions.filter(r => r.users.has(user.id));
    if (!react) reaction.remove(user);
    console.log(react);
    reaction.remove(user);
};