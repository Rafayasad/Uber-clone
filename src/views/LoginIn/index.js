import * as React from 'react';
import { useState } from 'react';
import { View, Button ,Text , Alert , Image , StatusBar} from 'react-native';
import * as Facebook from 'expo-facebook';
import MainNavigation from '../../config/navigation/MainNavigation';
import Dashboard from '../Dashboard';
import DrawerContent from '../../components/DrawerContent';

export default function LoginIn({setIsSignedIn}){
 
  const [userinfo,setUserInfo] = useState({})

  return(
    <View>
      <>
      {/* <Text style={{fontSize:50}}>Login In Screen</Text>
      {!userinfo ?   
      <Button 
      title="connect with facebook"
      onPress={FBLogIn}
      />
      :
      <View style={{alignItems:'center'}}>
      <Text>{userinfo.name}</Text>
      <Image 
      // setUserInfo={setUserInfo}
      source={{uri:userinfo.picture.data.url}}
      style={{borderRadius:50,width:100,height:100}}
      />
      </View>
    } */}
    <Text style={{fontSize:50}}>Login In Screen</Text> 
      <Button 
      title="connect with facebook"
      onPress={FBLogIn}
      />
    {/* <DrawerContent userInformation={userinfo}/> */}
      </>
      </View>
            )
            
            async function FBLogIn () {
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
            setIsSignedIn(true)
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
