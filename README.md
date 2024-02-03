# forge
hypixel skyblock android app to notify when forge ended

built in react native javascript expo

has auto notification

if you think its virus just build yourself smh, also I dont even know how to make virus lol

combine with a phone minecraft launcher for best results

(i recommend PojavLauncher https://github.com/PojavLauncherTeam/PojavLauncher#getting-pojavlauncher)


# screenshots

<img src="https://cdn.discordapp.com/attachments/963099746254336021/1203295715368112188/Screenshot_20240203_130508_forge.jpg" width="180" height="320" alt="Main page"> <img src="https://cdn.discordapp.com/attachments/601086858021306398/1098997662147162202/Screenshot_20230421_184349_forge.jpg" width="180" height="320" alt="Bazaar">
<img src="https://cdn.discordapp.com/attachments/601086858021306398/1098997661723541564/Screenshot_20230421_184354_forge.jpg" width="180" height="320" alt="Forge recipes"> <img src="https://cdn.discordapp.com/attachments/963099746254336021/1203295714986426428/Screenshot_20240203_130518_forge.jpg" width="180" height="320" alt="Config">




# features

access bazaar data quickly on your phone

view forge recipes and their profit

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
