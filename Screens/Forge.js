import React from 'react';
import {
  ActivityIndicator, Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';

import { Notify } from '../Utils/Notifications';
import { GetData, SaveData } from '../Utils/SecureStore';
import { Warn } from '../Utils/Toast';

import forgedata_ from '../forgedata.json';

let titletext;
const forgeendtime = [];
const forgeuntil = [];
const forgeid = [];
const forgeend = [];
const cachetime = [];
const cachename = [];
const timeleft = [];
let heavypearldisplay; let heavypearldisplay1; let godpotdisplay; let quickforge;

const forgedata = forgedata_[0];

function Button1({ onPress, title }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default class Forge extends React.Component {
  state = {
    isLoading: true,
    uuid: '',
    profiledata: '',

  };

  getdata = async () => {
    try {
      const uuid = await GetData('uuid');
      const apikey = await GetData('apikey');
      for (let i = 0; i < 5; i++) {
        cachetime.push(await GetData(`cachetime${i}`));
        cachename.push(await GetData(`cachename${i}`));
      }

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
            uuidsuccess = 'Invalid'; uuid = ''; profiledata = '';
          } else if (profiledata1.cause == 'Invalid API key') {
            alert('Invalid api key');
            apikeysuccess = 'Invalid'; uuid = ''; profiledata = '';
          }
        } catch (a) {
          if (a == 'TypeError: Network request failed') {
            Warn('No internet connection');
          } else {
            alert(`Api request failed\nError: ${a}`);
          }
          // something failed
          this.setState({
            isLoading: false,
            profiledata: '',
            uuid,
            cache: {
              cachename, cachetime,
            },
          });
          return;
        }
        // success
        this.setState({
          isLoading: false,
          profiledata,
          uuid,
          cache: {
            cachename, cachetime,
          },
        });
      } else {
        // no uuid or(and) api key
        this.setState({
          isLoading: false,
          profiledata: '',
          uuid: '',
          cache: {
            cachename, cachetime,
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    this.getdata();
  }

  render() {
    const moment = require('moment');
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 40 }}>
          <Text style={{ textAlign: 'center', color: '#bcc3cf' }}>Loading...</Text>
          <ActivityIndicator />
        </View>
      );
    }
    if (this.state.uuid && this.state.profiledata) {
      const profiledata = this.state.profiledata.members[this.state.uuid];
      const forge = profiledata.forge.forge_processes.forge_1;

      // matriarch
      if (profiledata.nether_island_player_data.matriarch.last_attempt) {
        heavypearldisplay = moment(profiledata.nether_island_player_data.matriarch.last_attempt).fromNow();
      }

      // god pot
      if (profiledata.active_effects.length > 28) {
        godpotdisplay = Math.round((profiledata.active_effects[0].ticks_remaining / 20 / 60 / 60) * 100) / 100;
      }

      // quickforge
      if (profiledata.mining_core.nodes.forge_time) {
        const quickforge_ = profiledata.mining_core.nodes.forge_time;
        if (profiledata.mining_core.nodes.forge_time < 20) {
          quickforge = (0.9 - quickforge_ * 0.005);
        } else {
          quickforge = 0.7;
        }
      } else { quickforge = 1; }

      for (let i = 0; i < 5; i++) {
        forgeend.push(forge[i + 1].startTime + 3600000 * quickforge * forgedata[forge[i + 1].id].duration);
        forgeid.push(forge[i + 1].id.toLowerCase());
        forgeendtime.push(moment(new Date(forgeend[i])).format('hh:mm A'));
        forgeuntil.push(moment(forgeend[i]).fromNow());
        if (forgeend[i] - Date.now() > 0) {
          timeleft.push((forgeend[i] - 180000 - Date.now()) / 1000);
        } else {
          timeleft.push('1');
        }
      }

      for (let i = 0; i < 5; i++) {
        SaveData(`cachetime${i}`, forgeend[i].toString());
        SaveData(`cachename${i}`, forgeid[i]);
      }
      titletext = 'Dwarven Forge';
      Notify(timeleft[0]);
    } else {
      try {
        titletext = 'Dwarven Forge(Cache)';
        const { cache } = this.state;
        for (let i = 0; i < 5; i++) {
          forgeid.push(cache.cachename[i]);
          forgeendtime.push(moment(new Date(parseInt(cache.cachetime[i]))).format('hh:mm A'));
          forgeuntil.push(moment(new Date(parseInt(cache.cachetime[i]))).fromNow());
        }

        Warn('Cache mode');
      } catch (e) { console.log(e); }
    }

    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: "#242323", marginTop: 10 }}>
        <Text style={{ paddingTop: 20, fontSize: 20, fontStyle: "bold", color: "cyan", fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>{titletext}</Text>
        <Text style={styles.text}>{forgeid[0]} ending at: {forgeendtime[0]} ({forgeuntil[0]}) </Text>
        <Text style={styles.text}>{forgeid[1]} ending at: {forgeendtime[1]} ({forgeuntil[1]}) </Text>
        <Text style={styles.text}>{forgeid[2]} ending at: {forgeendtime[2]} ({forgeuntil[2]}) </Text>
        <Text style={styles.text}>{forgeid[3]} ending at: {forgeendtime[3]} ({forgeuntil[3]}) </Text>
        <Text style={styles.text}>{forgeid[4]} ending at: {forgeendtime[4]} ({forgeuntil[4]}) </Text>
        <View style={{ marginTop: 10 }}></View>
        <Text style={styles.text}>God potion remaining: {godpotdisplay}h</Text>
        <Text style={styles.text}>Heavy Pearls: {heavypearldisplay1} {heavypearldisplay}</Text>
        <View style={{ marginTop: 20 }}>
          <Button1
            title="Config"
            onPress={() => this.props.navigation.navigate('Config')}
          ></Button1>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button1
            title="Bazaar"
            onPress={() => this.props.navigation.navigate('Bazaar')}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Button1

            title="Forge recipes"
            buttonStyle={styles.button}
            titleStyle={{ color: '#ffffff' }}
            onPress={() => this.props.navigation.navigate('Recipes')}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Button1
            title="Reload data(spamming => invalid api key)"
            style={{ textAlign: 'center', backgroundColor: 'gray' }}
            onPress={() => {
              this.getdata();
              this.render();
              Warn('Data Reloaded');
            }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({

  view:
  {
    backgroundColor: 'gray',
    textAlign: 'center',
  },
  text:
  {
    fontSize: 15,
    marginBottom: 8,
    color: '#bcc3cf',
    textAlign: 'center',
    fontFamily: 'sans-serif',

  },
  button: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    width: '85%',
  },

});
