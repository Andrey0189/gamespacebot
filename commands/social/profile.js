const Discord = require('discord.js');
const func = require('../../func.js');

module.exports.info = {
	command: '^(проф(ай|[иеу])ль?|profile?)$',
	name: 'profile <user>',
    lang: {
	    'ru': {
	        description: 'Команда для просмотра своего профиля или профиля другого пользователя',
        },
        'ua': {
            description: 'Команда для перегляду своєго профілю або профілю іншого користувача',
        },
        'en': {
            description: 'Сommand for viewing your profile or another user\'s profile',
        },
        'pl': {
            description: 'Polecenie do przeglądania profilu lub profilu innego użytkownika',
        }
    },
    access: {
        type: 'any_roles',
        params: ['419562566512017415', '450336165430689793', '417267817763831808', '417312252463677451']
        //own sr.own sr.admin admin
    }
};

module.exports.run = async function (client, message, command, args, info, language) {
    let ment_member = message.mentions.members.first();
    let member = message.member;
    if (ment_member)
        member = ment_member;
    let text = '';
    if (member.user.id !== message.author.id)
        text = message.author.toString();
    message.channel.send(text,{files: [{
            attachment: 'http://'+process.env.SITE_DOMAIN+'/new_profile.php?user='+member.user.id+'&nick='+encodeURIComponent(member.nickname)+'&secret='+encodeURIComponent(process.env.SECRET_KEY),
            name: 'file.png'
        }]});
    message.delete();
};