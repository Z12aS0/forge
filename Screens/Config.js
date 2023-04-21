import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Text } from 'react-native';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { registertask, getapikey, getuuid, background, waitForConnection } from "../Functions"

const BACKGROUND_FETCH_TASK = 'Forge-Background-Task';

const Button1 = ({ onPress, title }) => {
    return (
        <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default class Config extends React.Component {
    state = {
        interval: 8 //default value
    }
    render() {
        return (
            <View style={{ marginTop: 20, backgroundColor: '#242323' }}>
                <View style={{ alignItems: "center" }}>
                    <TextInput style={styles.textinput} placeholder={"api key"} onSubmitEditing={event => { getapikey(event.nativeEvent.text) }}>
                    </TextInput>
                    <TextInput style={styles.textinput} placeholder={"username"} onSubmitEditing={event => { getuuid(event.nativeEvent.text) }}>
                    </TextInput>
                </View>

                <Button1
                    title="Clear scheduled notifications"
                    onPress={async () => {
                        await Notifications.cancelAllScheduledNotificationsAsync();
                        ToastAndroid.show('Notifications cleared', ToastAndroid.SHORT)
                    }}
                ></Button1>
                <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <Button1
                        title="Toggle auto notification"
                        style={{ textAlign: 'center', backgroundColor: 'gray' }}
                        onPress={() => {
                            registertask(this.state.interval)
                        }}
                    ></Button1>
                </View>
                <View style={{ alignItems: "center" }}>
                    <TextInput style={styles.textinput} placeholder={"Custom auto notification inverval"} onSubmitEditing={event => {
                        this.setState({ interval: event.nativeEvent.text })
                    }}>
                    </TextInput>
                </View>
            </View>
        )
    }
}


TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    if ((await Network.getNetworkStateAsync()).isConnected) {
        background();
        return BackgroundFetch.BackgroundFetchResult.NewData;
    }
    else {
        waitForConnection()
        return;
    }
});



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
    textinput:
    {
        backgroundColor: '#595959',
        textAlign: "center",
        width: "85%",
        borderRadius: 5,
        color: 'white',
        padding: 5,
        fontSize: 16,
        margin: 5
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