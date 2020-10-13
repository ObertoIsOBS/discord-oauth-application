/*
   ____  ____   _____  _____          _      
  / __ \|  _ \ / ____|/ ____|        | |     
 | |  | | |_) | (___ | |     ___   __| | ___ 
 | |  | |  _ < \___ \| |    / _ \ / _` |/ _ \
 | |__| | |_) |____) | |___| (_) | (_| |  __/
  \____/|____/|_____/ \_____\___/ \__,_|\___|
Discord Oauth2 Staff Application
Author: OBS
Apache License 2.0, January 2004
*/                                            
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const uniqid = require("shortid");
const fetch = require('node-fetch');
const FormData = require('form-data');
const config = require('./config.json');

try {
  mongoose.connect(config.mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch (err) {
  console.log(err);
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected!");
});

var applicantScheme = new mongoose.Schema({
  _id: { type: String, default: mongoose.Types.ObjectId },
  user: Object,
});

var applicant = mongoose.model("applicant", applicantScheme);

app.get('/api/callback', async function (req, res) {

   if (!config.open) return res.send("Sorry! The application is closed.");
   
  var Discord = require('discord.js');
  var client = new Discord.Client();

  await client.login(config.client_token);

  client.on('ready', () => {
    client.user.setStatus("invisible");
  });

  const url = require("url");

  const urlObj = url.parse(req.url, true);

  const accessCode = urlObj.query.code;
  if (!accessCode) return res.send('Invalid oauth2');
  const data = new FormData();

  data.append('client_id', `${client.user.id}`);
  data.append('client_secret', config.client_secret);
  data.append('grant_type', 'authorization_code');
  data.append('redirect_uri', `${config.rootURL}${config.port === 80 ? '' : ':' + config.port}/api/callback`);
  data.append('scope', 'identify');
  data.append('code', accessCode);

  var infoRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: data
  })

  var info = await infoRes.json();

  if (!info.access_token) return res.send('Your authorization has expired, relog.')

  var token_type = info.token_type;
  var token = info.access_token;


  var results = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${token_type} ${token}`,
    },
  })

  if (!results) return res.send('Whoops! The authorization failed. :/ 60');

  var user = await results.json();

  if (!user) return res.send('Whoops! The authorization failed. :/ 50');

  var alreadyApplied = await applicant.findOne({ user: user.id });

  if (alreadyApplied) return res.send('You can only apply once.');

  var guild = await client.guilds.fetch(config.guild, true);

  if (!guild) return res.send('Authorization Error 10');

  var member = await guild.members.cache.get(user.id);

  if (!member) return res.send('You are not a member of this server.');

  var roles = config.allowedRoles;

  if (roles.length > 0 && !roles.some(r => member.roles.cache.get(r))) return res.send("You are not allowed to apply for this position.");
  
  var mustHaveRoles = config.requiredRoles;
  
  if (mustHaveRoles.length > 0 && !mustHaveRoles.some(r => member.roles.cache.get(r))) return res.send("You are not allowed to apply for this position.");
  
  var staffRoles = config.blockedRoles;

  if (staffRoles.length > 0 && staffRoles.some(r => member.roles.cache.get(r))) return res.send("You are not allowed to apply for this position.");

  res.send(`<p>You meet the basic requirements, please be aware that once you start the application you cannot leave/reload and renter it. If you are ready click <a href="/api/application?id=${user.id}&access_token=${token}&token_type=${token_type}">here</a>, otherwise wait till you are.</p>`);

  client.destroy();

  return;
});

app.get('/api/application', async function (req, res) {

  var token = req.query.access_token;
  var token_type = req.query.token_type;

  var ress = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${token_type} ${token}`,
    },
  })

  if (!ress) return res.send('Whoops! The authorization failed. :/');

  var userRes = await ress.json();

  if (!userRes) return res.send('Whoops! The authorization failed. :/');

  await new applicant({ user: userRes.id }).save();

  res.sendFile(path.join(__dirname + '/apply.html'));
});

const constructURL = require("construct-url");
 
var oauthURL = constructURL("http://discord.com/", {
  queryParams: {
     client_id: config.client_id,
     redirect_uri: `${config.rootURL}${config.port === 80 ? '' : ':' + config.port}/api/callback`,
     response_type: "code",
     scope: "identify"
  },
  path: "/api/oauth2/authorize",
  lowercase: true,
  protocol: "https",
});


app.listen(config.port, () => {
  console.log("Server started.");
  console.log(`The URL is: ${oauthURL}`);
})
