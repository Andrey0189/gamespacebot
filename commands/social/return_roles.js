const Discord = require('discord.js');
const func = require('../../func.js');
const request = require("request");

module.exports.info = {
    command: '^((recover|restore|return)[-_]?roles?|(восстановить|вернуть)[-_]?рол[ьи])$',
    name: 'recover_roles',
    lang: {
        'ru': {
            description: 'Команда для восстановления ролей за уровень, если они были утеряны',
        },
        'ua': {
            description: 'Команда для відновлення ролей за рівень, якщо вони були загублені',
        },
        'en': {
            description: 'Command to restore roles per level, if they were lost',
        },
        'pl': {
            description: 'Polecenie przywrócenia ról na poziom, jeśli zostały utracone',
        }
    }
};

module.exports.run = async function (client, message, command, args, info, language) {

    let lang = {
        'ru': {
            'error': 'Ошибка!',
            'error_recovery': 'Ошибка восстановления ролей',
            'got_role': 'Вы получили роль',
            'success': 'Успех',
            'roles_recovered': 'Роли были восстановлены',
            'not_roles': 'Нет ролей для восстановления'
        },
        'ua': {
            'error': 'Помилка!',
            'error_recovery': 'Помилка відновлення ролей',
            'got_role': 'Ви отримали роль',
            'success': 'Успіх',
            'roles_recovered': 'Ролі були відновлені',
            'not_roles': 'Немає ролей для відновлення'
        },
        'en': {
            'error': 'Error!',
            'error_recovery': 'Error while recovering roles',
            'got_role': 'You got the role',
            'success': 'Success',
            'roles_recovered': 'Roles were recovered',
            'not_roles': 'No roles to recover'
        },
        'pl': {
            'error': 'Pomyłka!',
            'error_recovery': 'Nie udało się przywrócić ról',
            'got_role': 'Masz tę rolę',
            'success': 'Sukces',
            'roles_recovered': 'Role zostały przywrócone',
            'not_roles': 'Brak ról do przywrócenia'
        }
    };
    lang = lang[language];
    message.delete();
    let member = message.mentions.members.first();
    if (member) {
        let access = func.hasMemberRights(message.channel, member, 'right', 'MANAGE_MESSAGES', language);
        if (!access.access)
            return message.channel.send(access.message);
    } else {
        member = message.member;
    }
    request('http://'+process.env.SITE_DOMAIN+'/rank.php?secret='+encodeURIComponent(process.env.SECRET_KEY)+'&user='+member.user.id, function (error, response, body) {
        if (body.startsWith('<br')) {message.channel.stopTyping(true); message.channel.send(func.generateErrorMessage(language, client, lang['error'], lang['error_recovery'])); return message.guild.channels.get(client.log_channels.errors).send(func.generateErrorMessage('ru', client, 'Произошла ошибка', `Ошибка восстановления ролей пользователя ${message.author} (${message.author.tag}). Содержание ошибки:\n`+body.replace(/<br \/>/g, '\n').replace(/<b>/g, '**').replace(/<\/b>/g, '**')));}
        const arr = JSON.parse(body);
        let bool = false;
        client.level_roles.forEach(function (item) {
            if (arr[0] >= item[0]) {
                if (!member.roles.has(item[1])) {
                    member.addRole(item[1]).catch(console.error);
                    member.send(`${lang['got_role']} \`${message.guild.roles.get(item[1]).name}\``);
                    bool = true;
                }
            } else {
                if (member.roles.has(item[1])) {
                    member.removeRole(item[1]).catch(console.error);
                }
            }
        });
        let embed;
        if (bool)
            embed = new Discord.RichEmbed()
                .setDescription(`:white_check_mark: ${lang['success']}\n${lang['roles_recovered']}`)
                .setColor('3FB97C');
        else
            embed = new Discord.RichEmbed()
                .setDescription(`:white_check_mark: ${lang['success']}\n${lang['not_roles']}`)
                .setColor('C34E4E');

        message.reply({embed});
    });
};