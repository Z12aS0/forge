import { SaveData, GetData } from "./SecureStore";
import { Warn } from "./Toast";

async function getforgedata(force = 0) {
    try {
        let data = await GetData("forgedata");
        let site = `https://raw.githubusercontent.com/Z12aS0/forge/refs/heads/master/forgedata.json`

        if (force) {

            const materials = await fetch(site)
                .then((response) => response.json());
            SaveData("forgedata", materials)
            Warn("Forge data refreshed")
            return materials
        } else if (data == null) {
            const materials = await fetch(site)
                .then((response) => response.json());
            SaveData("forgedata", materials)
            return materials
        } else {
            return data
        }
    } catch (e) {
    }
}
export { getforgedata }