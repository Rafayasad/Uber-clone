import * as React from 'react';
import { View, Text, Button , StyleSheet , Dimensions , Platform, TouchableOpacity, Image} from 'react-native';
import AppWeb from '../../components/Webview';
import MapView , {Marker} from 'react-native-maps';
import { useState , useEffect } from 'react';
import * as Location from 'expo-location';
import { storeLoction } from '../../config/firebase';
import {storeDriverLocation} from '../../config/firebase'
import { geohashForLocation, geohashQueryBounds, distanceBetween} from 'geofire-common';

export default function DriverDashboard({navigation}){
    const [region,setRegion] = useState({
            latitude: 24.9121428,
            longitude:  67.0545419,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
        })

        const [location, setLocation] = useState(null);
        const [errorMsg, setErrorMsg] = useState(null);
        const [currentLocName,setCurrentLocName] = useState('');
        const [moveToDropOff,setMoveToDropOff] = useState(false)
      
        useEffect(() => {
          (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
            
            Location.watchPositionAsync({
              distanceInterval: 0.01
          }, async(location) => {
              const {coords: {latitude, longitude}} = location
              setRegion({...region, latitude, longitude});
              console.log('location***', location)
              const lat = latitude;
              const lng = longitude;
              try{
                const hash = geohashForLocation([lat,lng]);
                await storeDriverLocation('qVWK8SATpUpYt2urZeqw',{
                  geohash: hash, lat, lng
                })
                console.log("driver data stored")
              }catch(e){
                console.log("driver data not stored",e)
              }
          })

            // let location = await Location.getCurrentPositionAsync({});
            // const {coords:{latitude,longitude}} = location
            // console.log('location======>',location)
            // console.log('location======>')
            // setRegion({...region,latitude,longitude})
            // setLocation(location);
            // try{
            //   await storeLoction(undefined,location);
            //   console.log("stored")
            // }
            // catch(e){
            //   console.log("not done",e)
            // }
            
            fetch(`https://api.foursquare.com/v2/venues/search?client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=${latitude},${longitude}&v=20180323`)
            .then(res => res.json())
            .then(res =>
              setCurrentLocName(res.response.venues[0].name))
            setCheck(true)
                   
          })();
          }, []);

        // useEffect(()=>{

        //   fetch(`https://api.foursquare.com/v2/venues/search?client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=${region.latitude},${region.longitude}&v=20180323`)
        //   .then(res => res.json())
        //   .then(res => setCurrentLocName(res.response.venues[0].name)) 
        //   setCheck(true)
          // console.log("reg lat==>",region.latitude)
          
        // })();
        // },[region])

        let text = 'Waiting..';
        if (errorMsg) {
          text = errorMsg;
        } else if (location) {
          text = JSON.stringify(location);
        }

    return(
        <>    
            <View>
           <Button 
           title="goto dropOff screen"
           onPress={()=>navigation.navigate('DropOffs',{
             locName:currentLocName,
             regions:region
            })}
           />
            
        <MapView style={styles.map} region={region}>
            <Marker 
            icon={require('../../../assets/Black.jpg')}
            title={currentLocName}
            coordinate={region}
            />
        </MapView>

            </View>
</>
)
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
      },
  });