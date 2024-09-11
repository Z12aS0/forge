import appdata from "../app.json";

export async function CheckForUpdate() {
    try {
        let latest = await fetch('https://api.github.com/repos/z12as0/forge/releases/latest')
            .then((response) => response.json());
        let version = appdata.expo.version;
        let latestVersion = latest.tag_name.replace('v', '');

        if (latestVersion > version) {
            return true;
        } else {
            return false;
        }
    }
    catch (e) {

    }
    //
}