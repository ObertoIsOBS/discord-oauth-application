# Discord Oauth2 Staff Application System
A very simple system for adding Discord authentication to your moderator applications.
# Requirements
- A mongodb database (Must be publicly hosted for Heroku)
- A location to host (Server or Heroku)
- A Discord Account
# Setup
- Create a new application [here](https://discord.com/developers) and add a bot to it.
- Fill in the following fields in [config.json](https://github.com/ObertoIsOBS/discord-oauth-application/config.json) with the information from your bot.
  - client_id
  - client_secret
  - client_token
 - Go to Oauth2 and create a bot invite link and copy it.
 ![inviteExample](https://cdn.obs.wtf/images/oauthinviteExp.png)
