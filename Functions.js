
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import * as Network from 'expo-network';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { ToastAndroid } from 'react-native';
const BACKGROUND_FETCH_TASK = 'Forge-Background-Task';
Notifications.setNotificationHandler({
    handleNotification: () => {
        return {
            shouldShowAlert: true
        }
    }
})

async function notify(timeleft = 1, text = "Forge is ready", noToast = 0) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Forge",
            body: text,
            priority: 'max',
            data: { data: 'collect forge' },
        }, trigger: { seconds: timeleft }
    });
    if (!noToast) {
        setTimeout(() => {
            ToastAndroid.show('Notification set', ToastAndroid.SHORT);
        }, 5000)
    }
}
async function registertask(interval = 8) {

    let a = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    if (!a) {
        BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 60 * 60 * interval, //8h default
            stopOnTerminate: false, startOnBoot: true
        });
        ToastAndroid.show('Toggled on(interval:' + interval + "h)", ToastAndroid.SHORT);
    } else {
        BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
        ToastAndroid.show('Toggled off', ToastAndroid.SHORT);
    }

}
async function savedata(item, value) {
    try { await SecureStore.setItemAsync(item, value) } catch (e) { console.log(e) }
}


async function getapikey(apikey) {
    try {
        var apikey1 = await fetch("https://api.hypixel.net/key?key=" + apikey).then((response) => response.json())
        if (apikey1.success == true) {
            savedata('apikey', apikey)
            ToastAndroid.show('api key saved: ' + apikey, ToastAndroid.SHORT);
        }
        else {
            ToastAndroid.show('Invalid api key', ToastAndroid.SHORT);
            if (apikey == "") { savedata('apikey', "") }
        }
    } catch (e) { ToastAndroid.show('Error, failed to check api key validity.', ToastAndroid.SHORT); }
}


async function getuuid(username) {
    try {
        var uuid1 = await fetch("https://api.mojang.com/users/profiles/minecraft/" + username).then((response) => response.json())
        if (uuid1 != "") {
            savedata('uuid', uuid1.id)
            ToastAndroid.show('uuid saved: ' + uuid1.id, ToastAndroid.SHORT);
        }
    } catch (e) {
        ToastAndroid.show('Invalid username', ToastAndroid.SHORT);
    }
}
function formatNumber(num) {

    const formattedNumber = num.toLocaleString();
    if (num >= 1000 && num < 1000000) {
        return (num / 1000).toFixed(2) + "K";
    }
    else if (num >= 1000000 && num < 1000000000) {
        return (num / 1000000).toFixed(2) + "M";
    }

    else if (num >= 1000000000) {
        return (num / 1000000000).toFixed(3) + "B";
    }
    else if (num <= -1000 && num > -1000000) {
        return (num / 1000).toFixed(2) + "K";
    }
    else if (num <= -1000000 && num > -1000000000) {
        return (num / 1000000).toFixed(2) + "M";
    }
    else if (num <= -1000000000) {
        return (num / 1000000000).toFixed(3) + "B";
    }
    else {
        return Math.floor(formattedNumber);
    }
}

async function waitForConnection() {
    if ((await Network.getNetworkStateAsync()).isConnected) {
        background();
        return;
    }
    else {
        setTimeout(waitForConnection, 300000); //5min
        return;
    }
}

async function background() {
    try {
        var uuid = await SecureStore.getItemAsync('uuid');
        var apikey = await SecureStore.getItemAsync('apikey');
        var profiledata1 = await fetch('https://api.hypixel.net/skyblock/profiles?uuid=' + uuid + '&key=' + apikey)
            .then((response) => response.json())
        if (profiledata1.success == true) //is something invalid?
        {
            for (let i = 0; i < 69; i++) //get selected profile
            {
                if (profiledata1.profiles[i].selected == true) {
                    var profiledata = profiledata1.profiles[i].members[uuid]; //success
                    break;
                }
            }
        } else {
            if (profiledata1.cause == "Malformed UUID") { notify(undefined, "Failed to execute auto notification: invalid UUID", 1); return }

            else if (profiledata1.cause == "Invalid API key") { notify(undefined, "Failed to execute auto notification: Invalid API key", 1); return }
            else { setTimeout(background, 5000); return; }
        } // "Hypixel api is under maintenance" :nerd: :nerd: :clown:

    } catch (a) {
        if (a == 'TypeError: Network request failed') { waitForConnection() }
    }

    if (!profiledata) return
    var forge = profiledata.forge.forge_processes.forge_1;

    if (profiledata.mining_core.nodes.forge_time) {
        var forgetime_ = profiledata.mining_core.nodes.forge_time;
        if (profiledata.mining_core.nodes.forge_time < 20) { forgetime = (0.9 - forgetime_ * 0.005) } else { forgetime = 0.7 }
    }
    else { forgetime = 1 } //quickforge stuff

    if (forge['1']) {
        forgeid1 = forge['1'].id.toLowerCase();
        forgetime1 = 3600000 * forgetime * forgedata[forge['1'].id].duration;
        forgeend1 = forge['1'].startTime + forgetime1;
        if (forgeend1 - Date.now() > 0) {
            timeleft = (forgeend1 - 180000 - Date.now()) / 1000;
        } else { timeleft = 1; }
    }
    if (forge['2']) {
        forgeid2 = forge['2'].id.toLowerCase();
        forgetime2 = 3600000 * forgetime * forgedata[forge['2'].id].duration;
        forgeend2 = forge['2'].startTime + forgetime2;
        if (forgeend2 - Date.now() > 0) {
            timeleft = (forgeend2 - 180000 - Date.now()) / 1000;
        } else { timeleft = 1; }
    }

    if (forge['3']) {
        forgeid3 = forge['3'].id.toLowerCase();
        forgetime3 = 3600000 * forgetime * forgedata[forge['3'].id].duration;
        forgeend3 = forge['3'].startTime + forgetime3;
        if (forgeend3 - Date.now() > 0) {
            timeleft = (forgeend3 - 180000 - Date.now()) / 1000;
        } else { timeleft = 1; }
    }

    if (forge['4']) {
        forgeid4 = forge['4'].id.toLowerCase();
        forgetime4 = 3600000 * forgetime * forgedata[forge['4'].id].duration;
        forgeend4 = forge['4'].startTime + forgetime4;
        if (forgeend4 - Date.now() > 0) {
            timeleft = (forgeend4 - 180000 - Date.now()) / 1000;
        } else { timeleft = 1; }
    }

    if (forge['5']) {
        forgeid5 = forge['5'].id.toLowerCase();
        forgetime5 = 3600000 * forgetime * forgedata[forge['5'].id].duration;
        forgeend5 = forge['5'].startTime + forgetime5;
        if (forgeend5 - Date.now() > 0) {
            timeleft = (forgeend5 - 180000 - Date.now()) / 1000;
        } else { timeleft = 1; }
    }
    notify(timeleft);
}

export { notify, registertask, savedata, getapikey, getuuid, formatNumber, background, waitForConnection };