module.exports.run = function (reaction, user) {
    if (reaction.message.id !== '466113074512789524') return;
    if (reaction.emoji.name !== '🆗') return;
    let react = reaction.message.reactions.filter(r => r.users.has(user.id));
    if (!react) reaction.remove(user);
    console.log(react);
    reaction.remove(user);
};