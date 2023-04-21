import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import { notify, savedata } from "../Functions"
import * as SecureStore from 'expo-secure-store';
import forgedata_ from "../forgedata.json"
var titletext, forgetime, forgeendtime1, forgeendtime2, forgeendtime3, forgeendtime4, forgeendtime5, forgeuntil1, forgeuntil2, forgeuntil3, forgeuntil4, forgeuntil5, forgetime1, forgetime2, forgetime3, forgetime4, forgetime5, forgeid1, forgeid2, forgeid3, forgeid4, forgeid5, forgeend1, forgeend2, forgeend3, forgeend4, forgeend5, heavypearldisplay, heavypearldisplay1, godpotdisplay;
var timeleft = 1;
const forgedata = forgedata_[0]

const Button1 = ({ onPress, title }) => {
    return (
        <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default class Forge extends React.Component {
    state = {
        isLoading: true,
        uuid: '',
        profiledata: '',

    }
    getdata = async () => {
        try {
            var uuid = await SecureStore.getItemAsync('uuid');
            var apikey = await SecureStore.getItemAsync('apikey');
            var i1 = await SecureStore.getItemAsync('i1');
            var i2 = await SecureStore.getItemAsync('i2');
            var i3 = await SecureStore.getItemAsync('i3');
            var i4 = await SecureStore.getItemAsync('i4');
            var i5 = await SecureStore.getItemAsync('i5');
            var e1 = await SecureStore.getItemAsync('e1');
            var e2 = await SecureStore.getItemAsync('e2');
            var e3 = await SecureStore.getItemAsync('e3');
            var e4 = await SecureStore.getItemAsync('e4');
            var e5 = await SecureStore.getItemAsync('e5');
            if (uuid && apikey) {
                try {
                    var profiledata1 = await fetch('https://api.hypixel.net/skyblock/profiles?uuid=' + uuid + '&key=' + apikey)
                        .then((response) => response.json())
                    if (profiledata1.success == true) //is something invalid?
                    {
                        for (let i = 0; i < 69; i++) //get selected profile
                        {
                            if (profiledata1.profiles[i].selected == true) {
                                var profiledata = profiledata1.profiles[i];
                                break;
                            }
                        }
                    } else {
                        if (profiledata1.cause == "Malformed UUID") {
                            alert('Invalid UUID');
                            uuidsuccess = "Invalid"; uuid = ""; profiledata = "";
                        }
                        else if (profiledata1.cause == "Invalid API key") {
                            alert('Invalid api key');
                            apikeysuccess = "Invalid"; uuid = ""; profiledata = "";
                        }
                    }
                } catch (a) {
                    if (a == 'TypeError: Network request failed') {
                        ToastAndroid.show('No internet connection', ToastAndroid.SHORT)
                    }
                    else {
                        alert('Api request failed\nError: ' + a);
                    }
                    //something failed
                    this.setState({
                        isLoading: false,
                        profiledata: "",
                        uuid: uuid,
                        cache: { i1: i1, i2: i2, i3: i3, i4: i4, i5: i5, e1: e1, e2: e2, e3: e3, e4: e4, e5: e5 }
                    });
                    return;
                }
                //success
                this.setState({
                    isLoading: false,
                    profiledata: profiledata,
                    uuid: uuid,
                    cache: { i1: i1, i2: i2, i3: i3, i4: i4, i5: i5, e1: e1, e2: e2, e3: e3, e4: e4, e5: e5 }
                })
            }
            else {
                //no uuid or(and) api key
                this.setState({
                    isLoading: false,
                    profiledata: "",
                    uuid: "",
                    cache: { i1: i1, i2: i2, i3: i3, i4: i4, i5: i5, e1: e1, e2: e2, e3: e3, e4: e4, e5: e5 }
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
        var moment = require('moment');
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 40 }}>
                    <Text style={{ textAlign: "center", color: '#bcc3cf' }}>Loading...</Text>
                    <ActivityIndicator />
                </View>
            )
        }
        if (this.state.uuid && this.state.profiledata) {
            var profiledata = this.state.profiledata.members[this.state.uuid];
            var forge = profiledata.forge.forge_processes.forge_1;
            if (profiledata.nether_island_player_data.matriarch.last_attempt) {
                heavypearldisplay = moment(profiledata.nether_island_player_data.matriarch.last_attempt).fromNow();
            }
            if (profiledata.active_effects.length > 28) //have a god pot
            {
                godpotdisplay = Math.round((profiledata.active_effects[0].ticks_remaining / 20 / 60 / 60) * 100) / 100;
            }

            if (profiledata.mining_core.nodes.forge_time) {
                var forgetime_ = profiledata.mining_core.nodes.forge_time;
                if (profiledata.mining_core.nodes.forge_time < 20) { forgetime = (0.9 - forgetime_ * 0.005) } else { forgetime = 0.7 }
            }
            else { forgetime = 1 } //quickforge stuff

            if (forge['1']) {
                forgeid1 = forge['1'].id.toLowerCase();
                forgetime1 = 3600000 * forgetime * forgedata[forge['1'].id].duration;
                forgeend1 = forge['1'].startTime + forgetime1;
                forgeendtime1 = moment(new Date(forgeend1)).format('hh:mm A');
                forgeuntil1 = moment(forgeend1).fromNow();
                if (forgeend1 - Date.now() > 0) {
                    timeleft = (forgeend1 - 180000 - Date.now()) / 1000;
                } else { timeleft = 1; }
            }

            if (forge['2']) {
                forgeid2 = forge['2'].id.toLowerCase();
                forgetime2 = 3600000 * forgetime * forgedata[forge['2'].id].duration;
                forgeend2 = forge['2'].startTime + forgetime2;
                forgeendtime2 = moment(new Date(forgeend2)).format('hh:mm A');
                forgeuntil2 = moment(forgeend2).fromNow();
                if (forgeend2 - Date.now() > 0) {
                    timeleft = (forgeend2 - 180000 - Date.now()) / 1000;
                } else { timeleft = 1; }
            }

            if (forge['3']) {
                forgeid3 = forge['3'].id.toLowerCase();
                forgetime3 = 3600000 * forgetime * forgedata[forge['3'].id].duration;
                forgeend3 = forge['3'].startTime + forgetime3;
                forgeendtime3 = moment(new Date(forgeend3)).format('hh:mm A');
                forgeuntil3 = moment(forgeend3).fromNow();
                if (forgeend3 - Date.now() > 0) {
                    timeleft = (forgeend3 - 180000 - Date.now()) / 1000;
                } else { timeleft = 1; }
            }

            if (forge['4']) {
                forgeid4 = forge['4'].id.toLowerCase();
                forgetime4 = 3600000 * forgetime * forgedata[forge['4'].id].duration;
                forgeend4 = forge['4'].startTime + forgetime4;
                forgeendtime4 = moment(new Date(forgeend4)).format('hh:mm A');
                forgeuntil4 = moment(forgeend4).fromNow();
                if (forgeend4 - Date.now() > 0) {
                    timeleft = (forgeend4 - 180000 - Date.now()) / 1000;
                } else { timeleft = 1; }
            }

            if (forge['5']) {
                forgeid5 = forge['5'].id.toLowerCase();
                forgetime5 = 3600000 * forgetime * forgedata[forge['5'].id].duration;
                forgeend5 = forge['5'].startTime + forgetime5;
                forgeendtime5 = moment(new Date(forgeend5)).format('hh:mm A');
                forgeuntil5 = moment(forgeend5).fromNow();
                if (forgeend5 - Date.now() > 0) {
                    timeleft = (forgeend5 - 180000 - Date.now()) / 1000;
                } else { timeleft = 1; }
            }

            savedata('i1', forgeid1)
            savedata('i2', forgeid2)
            savedata('i3', forgeid3)
            savedata('i4', forgeid4)
            savedata('i5', forgeid5)
            savedata('e1', forgeend1.toString())
            savedata('e2', forgeend2.toString())
            savedata('e3', forgeend3.toString())
            savedata('e4', forgeend4.toString())
            savedata('e5', forgeend5.toString())


            titletext = 'Dwarven Forge'

            notify(timeleft);
        } else {
            try {
                titletext = 'Dwarven Forge(Cache)'
                const { cache } = this.state
                forgeid1 = cache.i1;
                forgeid2 = cache.i2;
                forgeid3 = cache.i3;
                forgeid4 = cache.i4;
                forgeid5 = cache.i5;
                forgeendtime1 = moment(new Date(parseInt(cache.e1))).format('hh:mm A');
                forgeendtime2 = moment(new Date(parseInt(cache.e2))).format('hh:mm A');
                forgeendtime3 = moment(new Date(parseInt(cache.e3))).format('hh:mm A');
                forgeendtime4 = moment(new Date(parseInt(cache.e4))).format('hh:mm A');
                forgeendtime5 = moment(new Date(parseInt(cache.e5))).format('hh:mm A');
                forgeuntil1 = moment(new Date(parseInt(cache.e1))).fromNow();
                forgeuntil2 = moment(new Date(parseInt(cache.e2))).fromNow();
                forgeuntil3 = moment(new Date(parseInt(cache.e3))).fromNow();
                forgeuntil4 = moment(new Date(parseInt(cache.e4))).fromNow();
                forgeuntil5 = moment(new Date(parseInt(cache.e5))).fromNow();
                ToastAndroid.show('Cache mode', ToastAndroid.SHORT)
            } catch (e) { console.log(e) }
        }



        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: "#242323", marginTop: 10 }}>
                <Text style={{ paddingTop: 20, fontSize: 20, fontStyle: "bold", color: "cyan", fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>{titletext}</Text>
                <Text style={styles.text}>{forgeid1} ending at: {forgeendtime1} ({forgeuntil1}) </Text>
                <Text style={styles.text}>{forgeid2} ending at: {forgeendtime2} ({forgeuntil2}) </Text>
                <Text style={styles.text}>{forgeid3} ending at: {forgeendtime3} ({forgeuntil3}) </Text>
                <Text style={styles.text}>{forgeid4} ending at: {forgeendtime4} ({forgeuntil4}) </Text>
                <Text style={styles.text}>{forgeid5} ending at: {forgeendtime5} ({forgeuntil5}) </Text>
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
                    ></Button1>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Button1

                        title="Forge recipes"
                        buttonStyle={styles.button}
                        titleStyle={{ color: '#ffffff' }}
                        onPress={() => this.props.navigation.navigate('Recipes')}
                    ></Button1>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Button1
                        title="Reload data(spamming => invalid api key)"
                        style={{ textAlign: 'center', backgroundColor: 'gray' }}
                        onPress={() => {
                            this.getdata();
                            this.render();
                            ToastAndroid.show('Data reloaded', ToastAndroid.TOP)
                        }}
                    ></Button1>
                </View>
            </View>
        );
    }

}
const styles = StyleSheet.create({


    view:
    {
        backgroundColor: 'gray',
        textAlign: 'center'
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
        width: "85%",
    },

});