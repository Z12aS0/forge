import { Warn } from './Toast';
import { SaveData } from './SecureStore';



async function getuuid(username) {
  try {
    SaveData('uuid', username);
    Warn('Username saved: ' + username)
  } catch (e) {
  }
}

async function GetProfile(uuid) {
  try {
    if (uuid) {
      try {
        const profiledata = await fetch(`https://sky.shiiyu.moe/api/v2/profile/${uuid}`)
          .then((response) => response.json());
        if (profiledata.profiles != null) // is something invalid?
        {
          const profilesArray = Object.values(profiledata.profiles)
          return profilesArray.find(profile => profile.current)

        } else {
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
    } else {
      return null;
    }

  } catch (e) {

  }
}

export { getuuid, GetProfile };
