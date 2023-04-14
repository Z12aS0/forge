import React from 'react';
import {ActivityIndicator, Text, View,StyleSheet, TextInput, Button, ToastAndroid, FlatList, TouchableOpacity} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import forgeconvert from "./forgeconvert.json";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as Network from 'expo-network';

const BACKGROUND_FETCH_TASK = 'Forge-Background-Task';

const Stack = createNativeStackNavigator();

var titletext,forgetime,forgeendtime1,forgeendtime2,forgeendtime3,forgeendtime4,forgeendtime5,forgeuntil1,forgeuntil2,forgeuntil3,forgeuntil4,forgeuntil5,forgetime1,forgetime2,forgetime3,forgetime4,forgetime5,forgeid1,forgeid2,forgeid3,forgeid4,forgeid5,forgeend1,forgeend2,forgeend3,forgeend4,forgeend5,midnightReset,heavypearldisplay,pearlsReset, heavypearldisplay1, godpotdisplay;
var timeleft = 1;





async function notify(timeleft = 1, text = "Forge is ready", noToast = 0){
  await Notifications.scheduleNotificationAsync({
    content: {
    title: "Forge",
    body: text,
    priority:'max',
    data: { data: 'collect forge' },
    },trigger: { seconds: timeleft }});
    if(!noToast){
    setTimeout(() => {
      ToastAndroid.show('Notification set', ToastAndroid.SHORT);
    }, 5000)}}
async function registertask(interval=8){

    let a = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    if(!a){
    BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60*60*interval, //8h default
      stopOnTerminate: false, startOnBoot: true});
    ToastAndroid.show('Toggled on(interval:' + interval + "h)", ToastAndroid.SHORT);
  }else{
    BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    ToastAndroid.show('Toggled off', ToastAndroid.SHORT);
   }
   
}
async function savedata(item,value){
  try {await SecureStore.setItemAsync(item,value)} catch (e) {console.log(e)}}


async function getapikey(apikey){
  try {
    var apikey1 = await fetch("https://api.hypixel.net/key?key=" + apikey).then((response) => response.json())
    if(apikey1.success == true)
    {savedata('apikey', apikey)
    ToastAndroid.show('api key saved: ' + apikey,ToastAndroid.SHORT);}
    else{ToastAndroid.show('Invalid api key', ToastAndroid.SHORT); 
      if(apikey == "")
      {savedata('apikey',"")}}
  } catch (e) {ToastAndroid.show('Error, failed to check api key validity.', ToastAndroid.SHORT);}}


async function getuuid(username){
  try {
    var uuid1 = await fetch("https://api.mojang.com/users/profiles/minecraft/" + username).then((response) => response.json())
    if(uuid1 == "")
    {ToastAndroid.show('Invalid username', ToastAndroid.SHORT); // not possible but whatever
    }
    else{
    savedata('uuid', uuid1.id)
    ToastAndroid.show('uuid saved: ' + uuid1.id,ToastAndroid.SHORT);}} catch (e) {
      ToastAndroid.show('Invalid username', ToastAndroid.SHORT);}}



export default function App() {
  return (
    <NavigationContainer theme={{colors:{background:'#242323', backgroundColor:'#242323',card:'#242323',text:'#bcc3cf'}}}>
     <Stack.Navigator>
      <Stack.Screen name="Forge" component={Home}/>
      <Stack.Screen name="Config" component={Config}/>
      <Stack.Screen name="Bazaar" component={Bazaar}/>
     </Stack.Navigator>
    </NavigationContainer>
  );
}





Notifications.setNotificationHandler({
  handleNotification: () => {
  return {
  shouldShowAlert: true
  }}
  })

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  if((await Network.getNetworkStateAsync()).isConnected)
  {
    background();
    return BackgroundFetch.BackgroundFetchResult.NewData; //???? what does this even do lmao
  } 
  else 
  {
    waitForConnection()
    return;
  }
});

async function waitForConnection(){
  if((await Network.getNetworkStateAsync()).isConnected){
    background();
    return;
  }
  else{
    setTimeout(waitForConnection, 300000); //5min
    return;
  }
}

async function background(){
  try{
    var uuid = await SecureStore.getItemAsync('uuid');
    var apikey = await SecureStore.getItemAsync('apikey');
    var profiledata1 = await fetch('https://api.hypixel.net/skyblock/profiles?uuid=' + uuid + '&key=' + apikey )
    .then((response) => response.json())
    if(profiledata1.success == true) //is something invalid?
    {
    for(let i = 0; i < 69; i++) //get selected profile
    {
      if(profiledata1.profiles[i].selected == true)
      {
        var profiledata = profiledata1.profiles[i].members[uuid]; //success
        break;
      }
    }
  } else {
    if(profiledata1.cause == "Malformed UUID")
    { notify(undefined,"Failed to execute auto notification: invalid UUID",1); return}

    else if(profiledata1.cause == "Invalid API key")
    {notify(undefined,"Failed to execute auto notification: Invalid API key",1); return}
    else{setTimeout(background,5000); return;}} // "Hypixel api is under maintenance" :nerd: :nerd: :clown:

  } catch (a){
    if(a == 'TypeError: Network request failed')
    {waitForConnection()}
  }

  if(!profiledata)return
    var forge = profiledata.forge.forge_processes.forge_1;

  if(profiledata.mining_core.nodes.forge_time){
    var forgetime_ = profiledata.mining_core.nodes.forge_time;
    if(profiledata.mining_core.nodes.forge_time < 20)
      {forgetime = (0.9 - forgetime_*0.005)}else{forgetime = 0.7}}
    else{forgetime = 1} //quickforge stuff

if(forge['1']){
  forgeid1 = forge['1'].id.toLowerCase();
  forgetime1 = 3600000*forgetime*forgeconvert[forge['1'].id];
  forgeend1 = forge['1'].startTime + forgetime1;
  if(forgeend1 - Date.now() > 0){ 
  timeleft = (forgeend1 - 180000 - Date.now())/1000; } else { timeleft = 1; }}
  if(forge['2']){
    forgeid2 = forge['2'].id.toLowerCase();
    forgetime2 = 3600000*forgetime*forgeconvert[forge['2'].id];
    forgeend2 = forge['2'].startTime + forgetime2;
    if(forgeend2 - Date.now() > 0){ 
    timeleft = (forgeend2 - 180000 - Date.now())/1000; } else { timeleft = 1; }}
  
  if(forge['3']){
    forgeid3 = forge['3'].id.toLowerCase();
    forgetime3 = 3600000*forgetime*forgeconvert[forge['3'].id];
    forgeend3 = forge['3'].startTime + forgetime3;
    if(forgeend3 - Date.now() > 0){
    timeleft = (forgeend3 - 180000 - Date.now())/1000; } else { timeleft = 1; }}
  
  if(forge['4']){
    forgeid4 = forge['4'].id.toLowerCase();
    forgetime4 = 3600000*forgetime*forgeconvert[forge['4'].id];
    forgeend4 = forge['4'].startTime + forgetime4;
    if(forgeend4 - Date.now() > 0){ 
    timeleft = (forgeend4 - 180000 - Date.now())/1000; } else { timeleft = 1; }}
  
  if(forge['5']){
    forgeid5 = forge['5'].id.toLowerCase();
    forgetime5 = 3600000*forgetime*forgeconvert[forge['5'].id];
    forgeend5 = forge['5'].startTime + forgetime5;
    if(forgeend5 - Date.now() > 0){
    timeleft = (forgeend5 - 180000 - Date.now())/1000; } else { timeleft = 1; }} 


  notify(timeleft);
}


class Home extends React.Component{
  state ={
    isLoading:true,
    uuid:'',
    profiledata:'',

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
      if(uuid && apikey)
      {
      try{
      var profiledata1 = await fetch('https://api.hypixel.net/skyblock/profiles?uuid=' + uuid + '&key=' + apikey )
      .then((response) => response.json())
      if(profiledata1.success == true) //is something invalid?
      {
      for(let i = 0; i < 69; i++) //get selected profile
      {
        if(profiledata1.profiles[i].selected == true)
        {
          var profiledata = profiledata1.profiles[i];
          break;
        }
      }
    } else {
      if(profiledata1.cause == "Malformed UUID"){ alert('Invalid UUID');
    uuidsuccess ="Invalid"; uuid = ""; profiledata = ""; }
      else if(profiledata1.cause == "Invalid API key"){ alert('Invalid api key');
      apikeysuccess ="Invalid"; uuid = ""; profiledata = ""; }}
    } catch (a){
      if(a == 'TypeError: Network request failed')
      {
        ToastAndroid.show('No internet connection',ToastAndroid.SHORT)
      }
      else{
        alert('Api request failed\nError: ' + a);
      }
      //something failed
      this.setState({
        isLoading:false,
        profiledata: "",
        uuid: uuid,
        cache: {i1:i1,i2:i2,i3:i3,i4:i4,i5:i5,e1:e1,e2:e2,e3:e3,e4:e4,e5:e5}
      });
      return;
    }
      //success
      this.setState({
        isLoading:false,
        profiledata: profiledata,
        uuid: uuid,
        cache: {i1:i1,i2:i2,i3:i3,i4:i4,i5:i5,e1:e1,e2:e2,e3:e3,e4:e4,e5:e5}
      })
      }
    else{
      //no uuid or(and) api key
      this.setState({
        isLoading:false,
        profiledata: "",
        uuid: "",
        cache: {i1:i1,i2:i2,i3:i3,i4:i4,i5:i5,e1:e1,e2:e2,e3:e3,e4:e4,e5:e5}
      });
    }
    } catch (e) {
      console.log(e);
    }
  
  };
   
  componentDidMount()
  {
    this.getdata();
  }


 render() 
 {
  var moment = require('moment');
  if (this.state.isLoading) {
    return(
      <View style={{flex: 1, paddingTop: 40}}>
        <Text style={{textAlign:"center",color:'#bcc3cf'}}>Loading...</Text>
      <ActivityIndicator/>
      </View>
    )
  }
  if(this.state.uuid && this.state.profiledata)
  {
    var profiledata = this.state.profiledata.members[this.state.uuid];
    var forge = profiledata.forge.forge_processes.forge_1;
    if(profiledata.nether_island_player_data.matriarch.last_attempt)
  {
      heavypearldisplay = moment(profiledata.nether_island_player_data.matriarch.last_attempt).fromNow();
  }
    if(profiledata.active_effects.length > 28) //have a god pot
    {
      godpotdisplay = Math.round((profiledata.active_effects[0].ticks_remaining / 20 / 60 / 60) * 100) / 100;
    }

  if(profiledata.mining_core.nodes.forge_time){
    var forgetime_ = profiledata.mining_core.nodes.forge_time;
    if(profiledata.mining_core.nodes.forge_time < 20)
      {forgetime = (0.9 - forgetime_*0.005)}else{forgetime = 0.7}}
    else{forgetime = 1} //quickforge stuff

if(forge['1']){
  forgeid1 = forge['1'].id.toLowerCase();
  forgetime1 = 3600000*forgetime*forgeconvert[forge['1'].id];
  forgeend1 = forge['1'].startTime + forgetime1;
  forgeendtime1 = moment(new Date(forgeend1)).format('hh:mm A');
  forgeuntil1 =  moment(forgeend1).fromNow();
  if(forgeend1 - Date.now() > 0){ 
  timeleft = (forgeend1 - 180000 - Date.now())/1000; } else { timeleft = 1; }} 

if(forge['2']){
  forgeid2 = forge['2'].id.toLowerCase();
  forgetime2 = 3600000*forgetime*forgeconvert[forge['2'].id];
  forgeend2 = forge['2'].startTime + forgetime2;
  forgeendtime2 = moment(new Date(forgeend2)).format('hh:mm A');
  forgeuntil2 =  moment(forgeend2).fromNow();
  if(forgeend2 - Date.now() > 0){ 
  timeleft = (forgeend2 - 180000 - Date.now())/1000; } else { timeleft = 1; }}

if(forge['3']){
  forgeid3 = forge['3'].id.toLowerCase();
  forgetime3 = 3600000*forgetime*forgeconvert[forge['3'].id];
  forgeend3 = forge['3'].startTime + forgetime3;
  forgeendtime3 = moment(new Date(forgeend3)).format('hh:mm A');
  forgeuntil3 =  moment(forgeend3).fromNow();
  if(forgeend3 - Date.now() > 0){
  timeleft = (forgeend3 - 180000 - Date.now())/1000; } else { timeleft = 1; }}

if(forge['4']){
  forgeid4 = forge['4'].id.toLowerCase();
  forgetime4 = 3600000*forgetime*forgeconvert[forge['4'].id];
  forgeend4 = forge['4'].startTime + forgetime4;
  forgeendtime4 = moment(new Date(forgeend4)).format('hh:mm A');
  forgeuntil4 =  moment(forgeend4).fromNow();
  if(forgeend4 - Date.now() > 0){ 
  timeleft = (forgeend4 - 180000 - Date.now())/1000; } else { timeleft = 1; }}

if(forge['5']){
  forgeid5 = forge['5'].id.toLowerCase();
  forgetime5 = 3600000*forgetime*forgeconvert[forge['5'].id];
  forgeend5 = forge['5'].startTime + forgetime5;
  forgeendtime5 = moment(new Date(forgeend5)).format('hh:mm A');
  forgeuntil5 =  moment(forgeend5).fromNow();
  if(forgeend5 - Date.now() > 0){
  timeleft = (forgeend5 - 180000 - Date.now())/1000; } else { timeleft = 1; }} 

    savedata('i1',forgeid1)
    savedata('i2',forgeid2)
    savedata('i3',forgeid3)
    savedata('i4',forgeid4)
    savedata('i5',forgeid5)
    savedata('e1', forgeend1.toString())
    savedata('e2', forgeend2.toString())
    savedata('e3', forgeend3.toString())
    savedata('e4', forgeend4.toString())
    savedata('e5', forgeend5.toString())


      titletext = 'Dwarven Forge'

      notify(timeleft);
      } else {
        try{
        titletext = 'Dwarven Forge(Cache)'
        forgeid1 = this.state.cache.i1;
        forgeid2 = this.state.cache.i2;
        forgeid3 = this.state.cache.i3;
        forgeid4 = this.state.cache.i4;
        forgeid5 = this.state.cache.i5;
        forgeendtime1 = moment(new Date(parseInt(this.state.cache.e1))).format('hh:mm A');
        forgeendtime2 = moment(new Date(parseInt(this.state.cache.e2))).format('hh:mm A');
        forgeendtime3 = moment(new Date(parseInt(this.state.cache.e3))).format('hh:mm A');
        forgeendtime4 = moment(new Date(parseInt(this.state.cache.e4))).format('hh:mm A');
        forgeendtime5 = moment(new Date(parseInt(this.state.cache.e5))).format('hh:mm A');
        forgeuntil1 = moment(new Date(parseInt(this.state.cache.e1))).fromNow();
        forgeuntil2 = moment(new Date(parseInt(this.state.cache.e2))).fromNow();
        forgeuntil3 = moment(new Date(parseInt(this.state.cache.e3))).fromNow();
        forgeuntil4 = moment(new Date(parseInt(this.state.cache.e4))).fromNow();
        forgeuntil5 = moment(new Date(parseInt(this.state.cache.e5))).fromNow();
        ToastAndroid.show('Cache mode', ToastAndroid.SHORT)
        }catch(e){console.log(e)}
      }
      
    
  
  return(
<View style={{flex:1, flexDirection: 'column', backgroundColor:"#242323", marginTop:10}}>
    <Text style={{paddingTop:20,fontSize:20,fontStyle:"bold",color:"cyan",fontWeight: 'bold', textAlign:'center',marginBottom:20}}>{titletext}</Text>
        <Text style={styles.text1}>{forgeid1} ending at: {forgeendtime1} ({forgeuntil1}) </Text>
        <Text style={styles.text1}>{forgeid2} ending at: {forgeendtime2} ({forgeuntil2}) </Text>
        <Text style={styles.text1}>{forgeid3} ending at: {forgeendtime3} ({forgeuntil3}) </Text>
        <Text style={styles.text1}>{forgeid4} ending at: {forgeendtime4} ({forgeuntil4}) </Text>
        <Text style={styles.text1}>{forgeid5} ending at: {forgeendtime5} ({forgeuntil5}) </Text>
        <View style={{marginTop:10}}></View>
        <Text style={styles.text1}>God potion remaining: {godpotdisplay}h</Text>
        <Text style={styles.text1}>Heavy Pearls: {heavypearldisplay1} {heavypearldisplay}</Text>
    
    <View style={{marginTop:20}}>
    <Button
    title="Config"
    style={{textAlign:'center',backgroundColor:'gray' }}
    onPress={() => this.props.navigation.navigate('Config')}
    ></Button>
    </View>
    <View style={{marginTop:20}}>
    <Button
    title="Bazaar"
    style={{textAlign:'center',backgroundColor:'gray' }}
    onPress={() => this.props.navigation.navigate('Bazaar')}
    ></Button>
    </View>
    <View style={{marginTop:20}}>
    <Button
    title="Test notification"
    style={{textAlign:'center',backgroundColor:'gray' }}
    onPress={async () => {
      notify(undefined,undefined,1)
        ToastAndroid.show('Tested notification', ToastAndroid.SHORT);
    }}
    ></Button>
    </View>
    <View style={{marginTop:20}}>
    <Button
    title="Reload data(spamming => invalid api key)"
    style={{textAlign:'center',backgroundColor:'gray' }}
    onPress={() => {
      this.getdata();
      this.render();
      ToastAndroid.show('Data reloaded', ToastAndroid.TOP)
    }}
    ></Button>
    </View>
    </View>
  );
}  

}



class Config extends React.Component{
  state = {
    interval:8 //default value
  }
render(){
  return(
      <View style={{marginTop:20, backgroundColor:'#242323'}}>
  <TextInput style={styles.textinput1} placeholder={"api key"} onSubmitEditing={event =>
  {getapikey(event.nativeEvent.text)}}>
  </TextInput>
  <TextInput style={styles.textinput1} placeholder={"username"} onSubmitEditing={event =>
  {getuuid(event.nativeEvent.text)}}>
  </TextInput>
  <Button
  title="Clear scheduled notifications"
  style={{textAlign:'center',backgroundColor:'gray' }}
  onPress={async () => {
   await Notifications.cancelAllScheduledNotificationsAsync();
   ToastAndroid.show('Notifications cleared', ToastAndroid.SHORT)
  }}
  ></Button>
  <View style={{marginTop:20,marginBottom:10}}>
  <Button
  title="Toggle auto notification"
  style={{textAlign:'center',backgroundColor:'gray' }}
  onPress={() => {
    registertask(this.state.interval)
  }}
  ></Button>
  </View>
  <TextInput style={styles.textinput1} placeholder={"Custom auto notification inverval"} onSubmitEditing={event =>
  {
    this.setState({interval:event.nativeEvent.text})
  }}>
  </TextInput>
      </View>
  )
}}

class Bazaar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredData: [
        {product_id:"dummydata1",quick_status:{buyPrice:1, sellPrice:1}},
        {product_id:"dummydata2",quick_status:{buyPrice:2, sellPrice:12}}
      ],
      isLoading: true,
    };
  }

  componentDidMount() {
   this.fetchData();
  }

  fetchData = async (a = false) => {
    try {
      const response = await fetch('https://api.hypixel.net/skyblock/bazaar');
      const data = await response.json();
      if(!a){this.setState({ filteredData: Object.values(data.products),data: Object.values(data.products), isLoading: false });
    }
      else{
        this.setState({ data: Object.values(data.products), isLoading: false });
      }
    } catch (error) {
      console.error(error);
    }
    
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.cardContainer} onPress={() => 
      alert("id: " + item.product_id.toLowerCase() + "\nBuy price: " + Math.floor(item.quick_status.sellPrice) + "\nSell price: " + Math.floor(item.quick_status.buyPrice) )}>
        <Text style={styles.text}>{item.product_id.replace(/_/g, ' ').toLowerCase()}</Text>
        <Text style={styles.text}>Buy Price: {this.formatNumber(item.quick_status.sellPrice)}</Text>
        <Text style={styles.text}>Sell Price: {this.formatNumber(item.quick_status.buyPrice)}</Text>
      </TouchableOpacity>
    );
  };
  formatNumber = (num) => {

    const formattedNumber = num.toLocaleString();
    if(num >= 1000 && num < 1000000){
      return (num/1000).toFixed(2) + "K";
    }
    else if (num >= 1000000 && num < 1000000000) {
      return (num / 1000000).toFixed(2) + "M";
    }

    else if (num >= 1000000000) {
      return (num / 1000000000).toFixed(4) + "B";
    }
    else {
      return Math.floor(formattedNumber);
    }
  };
  filterData = (query) => {
    let query1 = query.toLowerCase();
    let filteredData = this.state.data.filter((item) => item.product_id.toLowerCase().replace(/_/g, ' ').includes(query1))
    this.setState({ filteredData:filteredData });
  }

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.textinput1}
          onChangeText={query => this.filterData(query)}
          placeholder="Search items"
        />
        <Button onPress={() => {this.fetchData(1); this.render();}} title='reload data' > 
        </Button>
        {isLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={this.state.filteredData}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.product_id}
            
          />
          
        )}
      </View>
    );
  }
}


const styles = StyleSheet.create({
 
 
  view:
  {
    backgroundColor:'gray',
    textAlign:'center'
  },
  text:
  { 
     fontSize: 18,
     marginBottom:8,
      color:'white',
      textAlign:'center',
      fontFamily: 'sans-serif',
      
  },
  text1:
  { 
     fontSize: 15,
     marginBottom:8,
      color:'#bcc3cf',
      textAlign:'center',
      fontFamily: 'sans-serif',
      
  },
  textinput:
  { 
     fontSize: 25,
     marginTop:60,
     marginBottom:15,
      color:'black',
      placeholderTextColor:'white',
      textAlign:'center',
      fontFamily: 'sans-serif',
      fontStyle: 'italic',
      
  },
  textinput1:
  {
    marginLeft:48,
    marginRight:48,
    fontSize: 20,
     marginBottom:15,
     backgroundColor:"#595959",
      color:'white',
      placeholderTextColor:'white',
      textAlign:'center',
      fontFamily: 'sans-serif',
      fontStyle: 'italic',
  },
  cardContainer: {
    backgroundColor: 'grey',
    borderRadius: 8,
    elevation: 2,
    margin: 10,
    padding: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    color:"bcc3cf"
  },
  });