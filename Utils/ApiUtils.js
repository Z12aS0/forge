import { Warn } from './Toast';
import { SaveData } from './SecureStore';
async function getapikey(apikey) {
  try {
    const apikey1 = await fetch(`https://api.hypixel.net/key?key=${apikey}`).then((response) => response.json());
    if (apikey1.success == true) {
      SaveData('apikey', apikey);
      Warn(`api key saved: ${apikey}`);
    } else {
      Warn('Invalid api key');
      if (apikey == '') {
        SaveData('apikey', '');
      }
    }
  } catch (e) {
    Warn('Error, failed to check api key validity.');
  }
}

async function getuuid(username) {
  try {
    const uuid1 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`).then((response) => response.json());
    if (uuid1 != '') {
      SaveData('uuid', uuid1.id);
      Warn(`uuid saved: ${uuid1.id}`);
    }
  } catch (e) {
    Warn('Invalid username');
  }
}

async function GetProfile(uuid, apikey) {
  try {
    if (uuid && apikey) {
      try {
        const profiledata1 = await fetch(`https://api.hypixel.net/skyblock/profiles?uuid=${uuid}&key=${apikey}`)
          .then((response) => response.json());
        if (profiledata1.success == true) // is something invalid?
        {
          for (let i = 0; i < 69; i++) // get selected profile
          {
            if (profiledata1.profiles[i].selected == true) {
              var profiledata = profiledata1.profiles[i];
              break;
            }
          }
        } else if (profiledata1.cause == 'Malformed UUID') {
          alert('Invalid UUID');
          return null;
        } else if (profiledata1.cause == 'Invalid API key') {
          alert('Invalid api key');
          return null;
        }
      } catch (a) {
        if (a == 'TypeError: Network request failed') {
          Warn('No internet connection');
          return null;
        } else {
          alert(`Api request failed\nError: ${a}`);
          return null;
        }
      }
      // success
      return profiledata;
    } else {
      return null;
    }

  } catch (e) {

  }
}

export { getapikey, getuuid, GetProfile };
