import * as SecureStore from 'expo-secure-store';

async function SaveData(item, value) {
  try {
    await SecureStore.setItemAsync(item, value);
  } catch (e) {

  }
}
async function GetData(item) {
  try {
    const data = await SecureStore.getItemAsync(item);
    if (data) {
      return data;
    }
    return null;
  } catch (e) {

  }
}

export { SaveData, GetData };
