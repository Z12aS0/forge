import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import Network from 'expo-network';
import { GetData, SaveData } from './SecureStore';
import { Warn } from './Toast';
import { Notify } from './Notifications';
import forgedata_ from '../forgedata.json';

const BACKGROUND_FETCH_TASK = 'Forge-Background-Task';
const forgedata = forgedata_[0];
const moment = require('moment');

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  if ((await Network.getNetworkStateAsync()).isConnected) {
    background();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  }

  waitForConnection();
});

export async function RegisterTask(interval = 8) {
  const a = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
  if (!a) {
    BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 60 * interval, // 8h default
      stopOnTerminate: false,
      startOnBoot: true,
    });
    Warn(`Toggled on(interval:${interval}h)`);
  } else {
    BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    Warn('Toggled off');
  }
}

async function waitForConnection() {
  if ((await Network.getNetworkStateAsync()).isConnected) {
    background();
  } else {
    setTimeout(waitForConnection, 300000); // 5min
  }
}

async function background() {
  try {
    const uuid = await GetData('uuid');
    const apikey = await GetData('apikey');
    const profiledata1 = await fetch(`https://api.hypixel.net/skyblock/profiles?uuid=${uuid}&key=${apikey}`)
      .then((response) => response.json());
    if (profiledata1.success == true) // is something invalid?
    {
      for (let i = 0; i < 69; i++) // get selected profile
      {
        if (profiledata1.profiles[i].selected == true) {
          var profiledata = profiledata1.profiles[i].members[uuid]; // success
          break;
        }
      }
    } else {
      if (profiledata1.cause == 'Malformed UUID') { Notify(undefined, 'Failed to execute auto notification: invalid UUID', 1); return; }

      if (profiledata1.cause == 'Invalid API key') { Notify(undefined, 'Failed to execute auto notification: Invalid API key', 1); return; }
      setTimeout(background, 5000); return;
    } // "Hypixel api is under maintenance" :nerd: :nerd: :clown:
  } catch (a) {
    if (a == 'TypeError: Network request failed') { waitForConnection(); }
  }

  if (!profiledata) return;
  const forge = profiledata.forge.forge_processes.forge_1;

  // quickforge
  let quickforge;
  if (profiledata.mining_core.nodes.forge_time) {
    const quickforge_ = profiledata.mining_core.nodes.forge_time;
    if (profiledata.mining_core.nodes.forge_time < 20) {
      quickforge = (0.9 - quickforge_ * 0.005);
    } else {
      quickforge = 0.7;
    }
  } else { quickforge = 1; }

  const forgeendtime = [];
  const forgeuntil = [];
  const forgeid = [];
  const forgeend = [];
  const timeleft = [];
  for (let i = 0; i < 5; i++) {
    forgeend.push(forge[i + 1].startTime + 3600000 * quickforge * forgedata[forge[i + 1].id].duration);
    forgeid.push(forge[i + 1].id.toLowerCase());
    forgeendtime.push(moment(new Date(forgeend[i])).format('hh:mm A'));
    forgeuntil.push(moment(forgeend[i]).fromNow());
    if (forgeend[i] - Date.now() > 0) {
      timeleft.push((forgeend[i] - 180000 - Date.now()) / 1000);
    } else {
      timeleft.push('1');
    }
  }

  for (let i = 0; i < 5; i++) {
    SaveData(`cachetime${i}`, forgeend[i].toString());
    SaveData(`cachename${i}`, forgeid[i]);
  }
  titletex3t = 'Dwarven Forge';
  Notify(timeleft[0]);
}
