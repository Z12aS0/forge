# forge
hypixel skyblock android app to notify when forge ended

built in react native javascript expo

has auto notification

if you think its virus just build yourself smh, also I dont even know how to make virus lol

combine with a phone minecraft launcher for best results

(i recommend PojavLauncher https://github.com/PojavLauncherTeam/PojavLauncher#getting-pojavlauncher)


# screenshots

<img src="https://cdn.discordapp.com/attachments/601086858021306398/1098644446863691816/Screenshot_20230420_192012_forge.jpg" width="180" height="320" alt="Main page"> <img src="https://cdn.discordapp.com/attachments/601086858021306398/1098644446356177016/Screenshot_20230420_192029_forge.jpg" width="180" height="320" alt="Bazaar">
<img src="https://cdn.discordapp.com/attachments/601086858021306398/1098644446079357018/Screenshot_20230420_192034_forge.jpg" width="180" height="320" alt="Forge recipes"> <img src="https://cdn.discordapp.com/attachments/601086858021306398/1098644446599463022/Screenshot_20230420_192016_forge.jpg" width="180" height="320" alt="Config">




# features

access bazaar data quickly on your phone

view forge recipes and their profit(only items in bazaar bc i aint making api spammer to get ah data

automatically set notification in background(if no internet retries every 5 minutes until internet and if hypixel api fails it retries after 5 sec)


# config
get api key from hypixel(/api new)

supports all forge items and their durations

most dead discord server ever: https://discord.gg/ssEuNYkzpe


# how to build yourself
make new expo project

```npx create-expo-app forge```

install dependancies(some stuff are already installed)

```npm install <each thing in packages.json>``` one by one

download the repo and paste it over the files previously made


build using 

```eas build --profile production --platform android```

you will need eas profile to do that which takes very little time to set up
