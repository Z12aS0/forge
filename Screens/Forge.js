import React from "react";
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";



import { Notify } from "../Utils/Notifications";
import { GetData, SaveData } from "../Utils/SecureStore";
import { Warn } from "../Utils/Toast";

import forgedata_ from "../forgedata.json";
import { GetProfile } from "../Utils/ApiUtils";

//import { Button1 } from "../Renders/Button";
import { FlatList1 } from "../Renders/FlatList"

let titletext;
let forgeendtime;
let forgeuntil;
let forgeid;
let forgeend;

let heavypearldisplay = "";
let godpotdisplay = "";
let quickforge;
let emptyForge;

const moment = require("moment");
const forgedata = forgedata_[0];



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

      for (let i = 0; i < 5; i++) {
        cachetime.push(await GetData(`cachetime${i}`));
        cachename.push(await GetData(`cachename${i}`));
      }

      const profiledata = await GetProfile(uuid);
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
      const forge = profiledata.forge?.forge_processes?.forge_1;
      if (forge == undefined) {
        emptyForge = true
      }

      // matriarch
      if (profiledata.nether_island_player_data?.matriarch?.last_attempt) {
        heavypearldisplay = moment(
          profiledata.nether_island_player_data.matriarch.last_attempt
        ).fromNow();
      }

      // god pot
      if (profiledata.active_effects?.length > 28) {
        godpotdisplay = (Math.round((profiledata.active_effects[0].ticks_remaining / 72000) * 100) / 100) + "h";
      }

      // quickforge
      if (profiledata.mining_core?.nodes?.forge_time) {
        const quickforge_ = profiledata.mining_core.nodes.forge_time;
        if (quickforge_ < 20) {
          quickforge = 0.9 - quickforge_ * 0.005;
        } else {
          quickforge = 0.7;
        }
      } else {
        quickforge = 1;
      }
      if (!emptyForge) {
        // data
        for (let i = 0; i < 5; i++) {
          if (!forge[i + 1]) continue
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
              timeleft: timeleft[i],
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
          const { timeleft, count, id } = uniqueforges[unique]
          Notify(timeleft, `${count} ${id} is ready!`);
        }
      }
      titletext = "Dwarven Forge";
    } else {
      try {
        titletext = "Dwarven Forge(Cache)";
        const { cache } = this.state;
        for (let i = 0; i < 5; i++) {
          forgeid = cache.cachename[i];
          forgeendtime = moment(new Date(parseInt(cache.cachetime[i]))).format("hh:mm A");
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
        style={{ flex: 1, flexDirection: "column", backgroundColor: "#242323", marginTop: 10, }}>
        <Text style={styles.title}>{titletext}</Text>
        <FlatList1 data={displaydata} />
        <View style={{ marginTop: 10 }} />
        <Text style={styles.text}>
          God potion remaining:
          {`${godpotdisplay}`}
        </Text>
        <Text style={styles.text}>
          Heavy Pearls: {heavypearldisplay}
        </Text>
        <View style={{ position: "absolute", top: "45%", left: "20%" }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Bazaar")}>
            <Text style={styles.text}>Bazaar</Text>
            <Image
              source={require('../assets/bazaar.png')}
              style={{ height: 100, width: 100 }}
            />
          </TouchableOpacity>
        </View>


        <View style={{ position: "absolute", top: "45%", left: "60%" }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Recipes")}>
            <Text style={styles.text}>Recipes</Text>
            <Image
              source={require('../assets/forge.png')}
              style={{ height: 100, width: 100 }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ position: "absolute", top: 0, left: 10 }}>
          <TouchableOpacity onPress={() => {
            this.setState({ isLoading: true })
            this.getdata();
            this.render();
            Warn("Data Reloaded");
          }}>
            <Image
              source={require('../assets/reload.png')}
              style={{ height: 35, width: 35 }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ position: 'absolute', top: 0, left: "90%" }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Config")}>
            <Image
              style={{ width: 35, height: 35 }}
              source={require('../assets/settings.png')} />
          </TouchableOpacity>
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
  title: {
    paddingTop: 20,
    fontSize: 20,
    color: "cyan",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
