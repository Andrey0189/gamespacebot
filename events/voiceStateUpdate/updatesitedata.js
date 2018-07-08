const Discord = require('discord.js');
const func = require('../../func.js');
const request = require('request');

module.exports.run = function (oldm, newm) {
func.updVoiceData(oldm.client, request)
};