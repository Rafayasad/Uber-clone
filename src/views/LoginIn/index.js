import * as React from 'react';
import { useState } from 'react';
import { View,Text , Alert , Image , StatusBar, ImageBackground} from 'react-native';
import { Button } from 'react-native-paper';
import * as Facebook from 'expo-facebook';
import MainNavigation from '../../config/navigation/MainNavigation';
import Dashboard from '../Dashboard';
import DrawerContent from '../../components/DrawerContent';
import { storeFbData , fBUser } from '../../config/firebase';

export default function LoginIn({setIsSignedIn,setIsSelect}){
 
  const [userinfo,setUserInfo] = useState()

  const image = {uri:'https://www.cnet.com/a/img/qM6L34ZY5r7yAme0oVL6-Xake_M=/940x0/2018/07/16/f59d213a-564b-43f7-8184-0cb7a88a7bd3/gettyimages-917398252.jpg'}

  return(
    <View style={{alignSelf:'center',justifyContent:'center',flex:1,width:1000}}>
      <>
      <ImageBackground source={image} resizeMode="cover" style={{flex:1,justifyContent:'center'}}>
    {/* <Text style={{fontSize:50,textAlign:'center'}}>Uber App</Text>  */}
      <Button
      style={{height:40,width:300,alignSelf:'center',marginTop:15 }}
      mode="contained"
      color="#0a3338"
      onPress={UserFBLogIn}
      >
        CONNECT AS A USER
      </Button>
      <Button
      style={{height:40,width:300,alignSelf:'center',marginTop:15,marginBottom:150 }}
      mode="contained"
      color="#0a3338"
      onPress={DriverFBLogIn}
      >
        CONNECT AS A DRIVER
      </Button>
      </ImageBackground>
      </>
      </View>
            )
            
            async function UserFBLogIn () {
              try {
                await Facebook.initializeAsync({
                  appId: '883166882299900',
                });
                const {
                  type,
                  token,
                  expirationDate,
            permissions,
            declinedPermissions,
          } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile'],
          });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`);
            const userinfo = await response.json();
            setUserInfo(userinfo)
            try{
              await fBUser('2lZRkZDbPLOjsjpnmZkU',userinfo);
              console.log("fb data stored")
            }
            catch(e){
              console.log("fb data not stored",e)
            }
            setIsSignedIn(true)
            setIsSelect(false)
            console.log('user==>',userinfo)
            // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
          } 
          else {
            // type === 'cancel'
          }
        } 
        catch ({ message }) {
          // alert(`Facebook Login Error: ${message}`);
        }
}

async function DriverFBLogIn () {
  try {
    await Facebook.initializeAsync({
      appId: '883166882299900',
    });
    const {
      type,
      token,
      expirationDate,
permissions,
declinedPermissions,
} = await Facebook.logInWithReadPermissionsAsync({
permissions: ['public_profile'],
});
if (type === 'success') {
// Get the user's name using Facebook's Graph API
const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`);
const userinfo = await response.json();
setUserInfo(userinfo)
try{
  await storeFbData(undefined,userinfo);
  console.log("fb data stored")
}
catch(e){
  console.log("fb data not stored",e)
}
setIsSignedIn(true)
setIsSelect(true)
console.log('user==>',userinfo)
// Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
} 
else {
// type === 'cancel'
}
} 
catch ({ message }) {
// alert(`Facebook Login Error: ${message}`);
}
}
      
}
