import React from 'react';
import {ActivityIndicator, Text, View,StyleSheet, TextInput, Button, Image} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import forgeconvert from "./forgeconvert.json";
var forgetime,forgeendtime1,forgeendtime2,forgeendtime3,forgeendtime4,forgeendtime5,forgeuntil1,forgeuntil2,forgeuntil3,forgeuntil4,forgeuntil5,forgetime1,forgetime2,forgetime3,forgetime4,forgetime5;


  
Notifications.setNotificationHandler({
handleNotification: () => {
return {
shouldShowAlert: true
}}
})

export default class App extends React.Component {
  
  state ={
    isLoading:true,
    uuid:'',
    profiledata:'',
    pisc:'',
    apsc:'',
    uisc:''
  }
  


    

  
  
      
  
    


  
  getdata = async () => {
    try {
      var profileidsuccess = 'no';
      var uuidsuccss = 'no';
      var apikeysuccess = 'no';
      const profileid = await SecureStore.getItemAsync('profileid');
      const uuid = await SecureStore.getItemAsync('uuid');
      const apikey = await SecureStore.getItemAsync('apikey');
      if(profileid) {  profileidsuccess = 'yes'}
      if(uuid) { uuidsuccss = 'yes'}
      if(apikey) { apikeysuccess = 'yes'}
      if(uuid && profileid && apikey)
      {
      fetch('https://api.hypixel.net/skyblock/profile?key=' + apikey + '&profile=' + profileid)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading:false,
          profiledata: responseJson,
          uuid: uuid,
          pisc: profileidsuccess,
          uisc: uuidsuccss,
          apsc: apikeysuccess,
        }, function(){
        });
        
      })
      .catch((error) =>{
        alert('No internet connection or invalid api key/profile id');
      });
    }
    else{
      this.setState({
        isLoading:false,
        profiledata: null,
        uuid: uuid,
        pisc: profileidsuccess,
        uisc: uuidsuccss,
        apsc: apikeysuccess
      });
    }
    } catch (e) {
      console.log(e);
    }
  
  };

  savedata = async (item,value) => {
    try {
      await SecureStore.setItemAsync(item,value);
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
      <View style={{flex: 1, padding: 20}}>
      <ActivityIndicator/>
      </View>
    )
  }
  try{
    var profiledata = this.state.profiledata.profile.members[this.state.uuid];
  }
  catch(a)
  {
    this.savedata('apikey','')
    this.savedata('profileid','')
    this.savedata('uuid','')
  }
 
  if(this.state.uuid && this.state.profiledata)
  {
    var forge = profiledata.forge.forge_processes.forge_1;
    var timeleft;
  if(profiledata.mining_core.nodes.forge_time){
    var forgetime_ = profiledata.mining_core.nodes.forge_time;
  if(profiledata.mining_core.nodes.forge_time < 20)
  {
    forgetime = (0.9 - forgetime_*0.005)
  }
  else
  {
    forgetime = 0.7
  }
}
else
{
  forgetime = 1
}





if(forge['1']){
  forgetime1 = 3600000*forgetime*forgeconvert[forge['1'].id];
  forgeendtime1 = moment(new Date(forge['1'].startTime + forgetime1)).format('hh:mm A');
  forgeuntil1 =  moment(forge['1'].startTime + forgetime1).fromNow();
}
if(forge['2']){
  forgetime2 = 3600000*forgetime*forgeconvert[forge['2'].id];
  forgeendtime2 = moment(new Date(forge['2'].startTime + forgetime2)).format('hh:mm A');
  forgeuntil2 =  moment(forge['2'].startTime + forgetime2).fromNow();
}
if(forge['3']){
  forgetime3 = 3600000*forgetime*forgeconvert[forge['3'].id];
  forgeendtime3 = moment(new Date(forge['3'].startTime + forgetime3)).format('hh:mm A');
  forgeuntil3 =  moment(forge['3'].startTime + forgetime3).fromNow();
}
if(forge['4']){
  forgetime4 = 3600000*forgetime*forgeconvert[forge['4'].id];
  forgeendtime4 = moment(new Date(forge['4'].startTime + forgetime4)).format('hh:mm A');
  forgeuntil4 =  moment(forge['4'].startTime + forgetime4).fromNow();
}
if(forge['5']){
  forgetime5 = 3600000*forgetime*forgeconvert[forge['5'].id];
  forgeendtime5 = moment(new Date(forge['5'].startTime + forgetime5)).format('hh:mm A');
  forgeuntil5 =  moment(forge['5'].startTime + forgetime5).fromNow();
}
if(forge['1'])
{
if(forge['1'].startTime + forgetime1 - Date.now() > 0)
{ timeleft = (forge['1'].startTime + forgetime1 - 180000 - Date.now())/1000; } else { timeleft = 1; }
} else if(forge['2'])
{ if(forge['2'].startTime + forgetime2 - Date.now() > 0)
{ timeleft = (forge['2'].startTime + forgetime2 - 180000 - Date.now())/1000; } else { timeleft = 1; }
} else if(forge['3'])
{ if(forge['3'].startTime + forgetime3 - Date.now() > 0)
{ timeleft = (forge['3'].startTime + forgetime3 - 180000 - Date.now())/1000; } else { timeleft = 1; }
} else if(forge['4'])
{ if(forge['4'].startTime + forgetime4 - Date.now() > 0)
{ timeleft = (forge['4'].startTime + forgetime4 - 180000 - Date.now())/1000; } else { timeleft = 1; }
} else if(forge['5'])
{ if(forge['5'].startTime + forgetime5 - Date.now() > 0)
{ timeleft = (forge['5'].startTime + forgetime5 - 180000 - Date.now())/1000; } else { timeleft = 1; }
} else { timeleft = 1; alert('No forge processes active'); }

    
 

  Notifications.scheduleNotificationAsync({
    content: {
    title: "Forge - ",
    body: 'Forge is ready',
    priority:'max',
    data: { data: 'collect forge' },
    },
    trigger: { seconds: timeleft },
    });

  }

    
  return(
<View style={{flex:1, flexDirection: 'column', backgroundColor:"#242323"}}>
    <Text style={{paddingTop:50,fontSize:20,fontStyle:"bold",color:"cyan",fontWeight: 'bold',margin:5, textAlign:'center'}}>Mithril Plate times</Text>
    
        
        
        <Text style={styles.plate}>{forge['1'].id.toLowerCase()} ending at: {forgeendtime1} ({forgeuntil1}) </Text>
        <Text style={styles.plate}>{forge['2'].id.toLowerCase()} ending at: {forgeendtime2} ({forgeuntil2}) </Text>
        <Text style={styles.plate}>{forge['3'].id.toLowerCase()} ending at: {forgeendtime3} ({forgeuntil3}) </Text>
        <Text style={styles.plate}>{forge['4'].id.toLowerCase()} ending at: {forgeendtime4} ({forgeuntil4}) </Text>
        <Text style={styles.plate}>{forge['5'].id.toLowerCase()} ending at: {forgeendtime5} ({forgeuntil5}) </Text>
        <TextInput style={styles.textinput1} placeholder={"api key: " + this.state.apsc} onSubmitEditing={event =>
         {alert('api key saved: ' + event.nativeEvent.text )
      this.savedata("apikey", event.nativeEvent.text)}}>
    </TextInput>
    <TextInput style={styles.textinput1} placeholder={"profile id: " + this.state.pisc} onSubmitEditing={event =>
         {alert('profile id saved: ' + event.nativeEvent.text )
      this.savedata("profileid", event.nativeEvent.text)}}>
    </TextInput>
    <TextInput style={styles.textinput1} placeholder={"uuid: " + this.state.uisc} onSubmitEditing={event =>
         {alert('uuid saved: ' + event.nativeEvent.text )
      this.savedata("uuid", event.nativeEvent.text)}}>
    </TextInput>
    <Button
    title="Clear notifications"
    style={{textAlign:'center',backgroundColor:'gray' }}
    onPress={() => {
     Notifications.cancelAllScheduledNotificationsAsync();
     alert('Notifications cleared')
    }}
    ></Button>
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
plate:
{ 
   fontSize: 15,
   marginBottom:8,
    color:'white',
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
  fontSize: 25,
   marginBottom:15,
   backgroundColor:"gray",
    color:'white',
    placeholderTextColor:'white',
    textAlign:'center',
    fontFamily: 'sans-serif',
    fontStyle: 'italic',
},
powder:
{
  fontSize: 30,
  marginTop:30,
   color:'#fc2828',
   textAlign:'center',
   fontFamily: 'sans-serif',
   fontStyle: 'italic',

},
powder1:
{
  left:70,
  fontSize: 20,
  marginTop:10,
   color:'green',
   textAlign:'left',
   fontFamily: 'sans-serif',
   fontStyle: 'italic',

},
powder2:
{
  left:70,
  fontSize: 20,
  marginTop:8,
   color:'#f533cb',
   textAlign:'left',
   fontFamily: 'sans-serif',
   fontStyle: 'italic',

}
});
