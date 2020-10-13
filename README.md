# Discord Oauth2 Staff Application System
A very simple system for adding Discord authentication to your moderator applications.
# Requirements
- A mongodb database (Must be publicly hosted for Heroku)
- A location to host (Server or Heroku)
- A Discord Account
# Setup
- Create a new application [here](https://discord.com/developers) and add a bot to it.
- Fill in the following fields in [config.json](https://github.com/ObertoIsOBS/discord-oauth-application/blob/main/config.json) with the information from your bot.
  - client_id
  - client_secret
  - client_token
 - Go to Oauth2 and create a bot invite link and copy it.
 ![inviteExample](https://cdn.obs.wtf/images/oauthinviteExp.png)
 - Fill in the rest of [config.json](https://github.com/ObertoIsOBS/discord-oauth-application/blob/main/config.json) with help from the information below.
# Config Guide
This section explains what each field in the [config.json](https://github.com/ObertoIsOBS/discord-oauth-application/blob/main/config.json) is for.

__client_id__ The ID of your Discord application.

__client_secret__ The client secret of your Discord applications.

__client_token__ The token of your Discord application. **Do not share this, keep your repository private!**

__guild__ The ID of the server the applications are for.

__requiredRoles__ An array of role IDs applicants must have. **They must have all the roles here.**

__allowedRoles__ An array of role IDs applicants must have at least one of.

__blockedRoles__ An array od role IDs that applicants cannot have.

__open__ Whether or not the application is open.

__formLink__ The link to your google form. Change `viewform?usp=sf_link` in the link to `viewform?embedded=true`. **Do not use a shortened link!**

__rootURL__ The root url the application will be hosted on **without the port**.

__port__ The port the application will be hosted on, use 80 if none.
