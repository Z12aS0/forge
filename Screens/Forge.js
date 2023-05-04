import React from "react";
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { Notify } from "../Utils/Notifications";
import { GetData, SaveData } from "../Utils/SecureStore";
import { Warn } from "../Utils/Toast";

import forgedata_ from "../forgedata.json";
import { GetProfile } from "../Utils/ApiUtils";

let titletext;
let forgeendtime;
let forgeuntil;
let forgeid;
let forgeend;

let heavypearldisplay;
let godpotdisplay;
let quickforge;

const moment = require("moment");
const forgedata = forgedata_[0];

function Button1({ onPress, title }) {
  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

function FlatList1({ data }) {
  let hasForges = true
  if (data == "") hasForges = false
  return (
    <View>
      {hasForges ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.time}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.text}>
                {item.forgeid} ending at: {item.forgeendtime} ({item.forgeuntil})
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.text}>Forge is empty :(</Text>
      )}
    </View>

  );
}

export default class Forge extends React.Component {
  state = {
    isLoading: true,
    uuid: "",
    profiledata: "",
  };

  getdata = async () => {
    try {
      const cachetime = [];
      const cachename = [];

      const uuid = await GetData("uuid");
      const apikey = await GetData("apikey");

      for (let i = 0; i < 5; i++) {
        cachetime.push(await GetData(`cachetime${i}`));
        cachename.push(await GetData(`cachename${i}`));
      }

      const profiledata = await GetProfile(uuid, apikey);
      this.setState({
        isLoading: false,
        profiledata,
        uuid,
        cache: {
          cachename,
          cachetime,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    this.getdata();
  }


  render() {
    const timeleft = [];
    const displaydata = [];
    const uniqueforges = [];

    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 40 }}>
          <Text style={{ textAlign: "center", color: "#bcc3cf" }}>
            Loading...
          </Text>
          <ActivityIndicator />
        </View>
      );
    }
    if (this.state.uuid != null && this.state.profiledata != null) {
      const profiledata = this.state.profiledata.members[this.state.uuid];
      const forge = profiledata.forge.forge_processes.forge_1;

      // matriarch
      if (profiledata.nether_island_player_data.matriarch.last_attempt) {
        heavypearldisplay = moment(
          profiledata.nether_island_player_data.matriarch.last_attempt
        ).fromNow();
      }

      // god pot
      if (profiledata.active_effects.length > 28) {
        godpotdisplay = Math.round((profiledata.active_effects[0].ticks_remaining / 72000) * 100) / 100;
      }

      // quickforge
      if (profiledata.mining_core.nodes.forge_time) {
        const quickforge_ = profiledata.mining_core.nodes.forge_time;
        if (profiledata.mining_core.nodes.forge_time < 20) {
          quickforge = 0.9 - quickforge_ * 0.005;
        } else {
          quickforge = 0.7;
        }
      } else {
        quickforge = 1;
      }

      // data
      for (let i = 0; i < 5; i++) {
        if (!forge[i + 1]) return
        forgeend = forge[i + 1].startTime + 3600000 * quickforge * forgedata[forge[i + 1].id].duration;
        forgeid = forge[i + 1].id.toLowerCase();
        forgeendtime = moment(new Date(forgeend)).format("hh:mm A");
        forgeuntil = moment(forgeend).fromNow();
        if (forgeend - Date.now() > 0) {
          timeleft.push((forgeend - 180000 - Date.now()) / 1000);
        } else {
          timeleft.push(1);
        }
        /// ///////
        displaydata.push({
          forgeid,
          forgeendtime,
          forgeuntil,
          time: forgeend,
        });
        displaydata.slice(0, 5);

        /// //////
        if (!uniqueforges[forgeid]) {
          uniqueforges[forgeid] = {
            count: 1,
            timeLeft: timeleft[i],
            id: forgeid,
          };
        } else {
          uniqueforges[forgeid].count++;
          uniqueforges[forgeid].timeleft = timeleft[i];
        }
        /// //////
        SaveData(`cachetime${i}`, forgeend.toString());
        SaveData(`cachename${i}`, forgeid);
      }

      for (const unique in uniqueforges) {
        Notify(
          uniqueforges[unique].timeleft,
          `${uniqueforges[unique].count} ${uniqueforges[unique].id} is ready!`
        );
      }

      titletext = "Dwarven Forge";
    } else {
      try {
        titletext = "Dwarven Forge(Cache)";
        const { cache } = this.state;
        for (let i = 0; i < 5; i++) {
          forgeid = cache.cachename[i];
          forgeendtime = moment(new Date(parseInt(cache.cachetime[i]))).format(
            "hh:mm A"
          );
          forgeuntil = moment(new Date(parseInt(cache.cachetime[i]))).fromNow();

          displaydata.push({
            forgeid,
            forgeendtime,
            forgeuntil,
            time: cache.cachetime[i],
          });
        }
      } catch (e) {
        console.log(e);
      }
    }

    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "#242323",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            paddingTop: 20,
            fontSize: 20,
            color: "cyan",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {titletext}
        </Text>
        <FlatList1 data={displaydata} />
        <View style={{ marginTop: 10 }} />
        <Text style={styles.text}>
          God potion remaining:
          {`${godpotdisplay}h`}
        </Text>
        <Text style={styles.text}>
          Heavy Pearls: {heavypearldisplay}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Button1
            title="Config"
            onPress={() => this.props.navigation.navigate("Config")}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Button1
            title="Bazaar"
            onPress={() => this.props.navigation.navigate("Bazaar")}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Button1
            title="Forge recipes"
            buttonStyle={styles.button}
            titleStyle={{ color: "#ffffff" }}
            onPress={() => this.props.navigation.navigate("Recipes")}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Button1
            title="Reload data(spamming => invalid api key)"
            style={{ textAlign: "center", backgroundColor: "gray" }}
            onPress={() => {
              this.getdata();
              this.render();
              Warn("Data Reloaded");
            }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  view: {
    backgroundColor: "gray",
    textAlign: "center",
  },
  text: {
    fontSize: 15,
    marginBottom: 8,
    color: "#bcc3cf",
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  button: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    width: "85%",
  },
});
