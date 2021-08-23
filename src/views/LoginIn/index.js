import * as React from 'react';
import { useState } from 'react';
import { View, Button ,Text , Alert , Image , StatusBar} from 'react-native';
import * as Facebook from 'expo-facebook';
import MainNavigation from '../../config/navigation/MainNavigation';
import Dashboard from '../Dashboard';
import DrawerContent from '../../components/DrawerContent';
import { storeFbData , fBUser } from '../../config/firebase';

export default function LoginIn({setIsSignedIn,setIsSelect}){
 
  const [userinfo,setUserInfo] = useState([])

  return(
    <View>
      <>
  
    <Text style={{fontSize:50,textAlign:'center'}}>Uber Clone</Text> 
      <Button 
      title="connect with facebook"
      onPress={UserFBLogIn}
      />
      <Text>Connect as a Driver</Text>
       <Button 
      title="connect with facebook"
      onPress={DriverFBLogIn}
      />
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
              await fBUser(undefined,userinfo);
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
