import { Warn } from './Toast';

async function getapikey(apikey) {
  try {
    const apikey1 = await fetch(`https://api.hypixel.net/key?key=${apikey}`).then((response) => response.json());
    if (apikey1.success == true) {
      savedata('apikey', apikey);
      Warn(`api key saved: ${apikey}`);
    } else {
      Warn('Invalid api key');
      if (apikey == '') {
        savedata('apikey', '');
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
      savedata('uuid', uuid1.id);
      Warn(`uuid saved: ${uuid1.id}`);
    }
  } catch (e) {
    Warn('Invalid username');
  }
}
export { getapikey, getuuid };
