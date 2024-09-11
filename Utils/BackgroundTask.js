import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Network from "expo-network"
import { GetData, SaveData } from './SecureStore';
import { Warn } from './Toast';
import { Notify } from './Notifications';
import forgedata from '../forgedata.json';

const BACKGROUND_FETCH_TASK = 'Forge-Background-Task';
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  if ((await Network.getNetworkStateAsync()).isInternetReachable) {
    background();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  }

  waitForConnection();
});





export async function RegisterTask(interval = 8) {
  if (interval == "test") { interval = 0.0003 } // 1 second
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
  if ((await Network.getNetworkStateAsync()).isInternetReachable) {
    background();
  } else {
    setTimeout(waitForConnection, 300000); // 5min
  }
}

async function background() {
  let profiledata
  try {
    const uuid = await GetData('uuid');
    if (!uuid) return;

    const profiledata1 = await fetch(`https://sky.shiiyu.moe/api/v2/profile/${uuid}`)
      .then((response) => response.json());
    if (profiledata1.profiles != null) // is something invalid?
    {
      const profilesArray = Object.values(profiledata1.profiles)
      profiledata = profilesArray.find(profile => profile.current)
    } else {
      setTimeout(background, 5000);
      return;
    } // "Hypixel api is under maintenance" :nerd: :nerd: :clown:
  } catch (a) {
    if (a == 'TypeError: Network request failed') { waitForConnection(); }
  }

  if (!profiledata) return;
  profiledata = profiledata.raw

  const forge = Object.values(profiledata.forge?.forge_processes?.forge_1);
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
    if (!forge[i]) return;
    forgeend = forge[i].startTime + 3600000 * quickforge * forgedata[forge[i].id].duration;
    forgeid = forge[i].id.toLowerCase();
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
export { background };