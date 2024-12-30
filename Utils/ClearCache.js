import { SaveData } from "./SecureStore";

export function clearcache() {
    for (let i = 0; i < 5; i++) {
        SaveData(`cachetime${i}`, "");
        SaveData(`cachename${i}`, "");
    }
}