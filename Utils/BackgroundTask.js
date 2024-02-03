import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Network from "expo-network"
import { GetData, SaveData } from './SecureStore';
import { Warn } from './Toast';
import { Notify } from './Notifications';
import forgedata_ from '../forgedata.json';

const BACKGROUND_FETCH_TASK = 'Forge-Background-Task';
const forgedata = forgedata_[0];
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  if (await Network.getNetworkStateAsync.isInternetReachable) {
    background();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  }

  waitForConnection();
});





export async function RegisterTask(interval = 8) {
  let a = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
  if (!a) {
    BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 60 * interval, //8h default
      stopOnTerminate: false, startOnBoot: true
    });
    Warn(`Toggled on(interval:${interval}h)`);
  } else {
    BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    Warn('Toggled off');
  }

}

async function waitForConnection() {
  if (await Network.getNetworkStateAsync.isInternetReachable) {
    background();
  } else {
    setTimeout(waitForConnection, 300000); // 5min
  }
}

async function background() {
  try {
    const uuid = await GetData('uuid');
    if (!uuid) return;
    const profiledata1 = await fetch(`https://api.hypixel.net/skyblock/profiles?uuid=${uuid}&key=4e927d63a1c34f71b56428b2320cbf95`)
      .then((response) => response.json());
    if (profiledata1.success == true && profiledata1.profiles != null) // is something invalid?
    {
      for (let i = 0; i < 69; i++) // get selected profile
      {
        if (profiledata1.profiles[i].selected == true) {
          const profiledata = profiledata1.profiles[i].members[uuid]; // success
          break;
        }

      }
    } else {
      if (profiledata1.cause == 'Malformed UUID') { Notify(undefined, 'Failed to execute auto notification: invalid UUID', 1); return; }
      if (profiledata1.cause == 'Invalid API key') { Notify(undefined, 'Failed to execute auto notification: Invalid API key', 1); return; }

      setTimeout(background, 5000);
      return;
    } // "Hypixel api is under maintenance" :nerd: :nerd: :clown:
  } catch (a) {
    if (a == 'TypeError: Network request failed') { waitForConnection(); }
  }

  if (!profiledata) return;
  const forge = profiledata.forge?.forge_processes?.forge_1;

  // quickforge
  let quickforge;
  if (profiledata.mining_core?.nodes?.forge_time) {
    const quickforge_ = profiledata.mining_core.nodes.forge_time;
    if (quickforge_ < 20) {
      quickforge = (0.9 - quickforge_ * 0.005);
    } else {
      quickforge = 0.7;
    }
  } else { quickforge = 1; }

  let forgeid;
  let forgeend;
  const timeleft = [];
  let uniqueforges = [];
  for (let i = 0; i < 5; i++) {
    if (!forge[i + 1]) return;
    forgeend = forge[i + 1].startTime + 3600000 * quickforge * forgedata[forge[i + 1].id].duration;
    forgeid = forge[i + 1].id.toLowerCase();
    if (forgeend - Date.now() > 0) {
      timeleft.push((forgeend - 180000 - Date.now()) / 1000);
    } else {
      timeleft.push('1');
    }

    if (!uniqueforges[forgeid]) {
      uniqueforges[forgeid] = {
        count: 1,
        timeleft: timeleft[i],
        id: forgeid,
      };
    } else {
      uniqueforges[forgeid].count++;
      uniqueforges[forgeid].timeleft = timeleft[i];
    }


    SaveData(`cachetime${i}`, forgeend.toString()); SaveData(`cachename${i}`, forgeid);
  }

  for (const unique in uniqueforges) {
    const { timeleft, count, id } = uniqueforges[unique];
    Notify(timeleft, `${count} ${id} is ready!`);
  }
}