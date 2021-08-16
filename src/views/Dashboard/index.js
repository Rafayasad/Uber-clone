import * as React from 'react';
import { View, Text, Button , StyleSheet , Dimensions , Platform} from 'react-native';
import AppWeb from '../../components/Webview';
import MapView , {Marker} from 'react-native-maps';
import { useState , useEffect } from 'react';
import * as Location from 'expo-location';
import { storeLoction } from '../../config/firebase';

export default function Dashboard({navigation}){
    const [region,setRegion] = useState({
            latitude: 24.9121428,
            longitude:  67.0545419,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
        })

        const [location, setLocation] = useState(null);
        const [errorMsg, setErrorMsg] = useState(null);
        const [currentLocName,setCurrentLocName] = useState('');
        const [check,setCheck] = useState(false)
      
        useEffect(() => {
          (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
            
            //watch live current position method
            // Location.watchPositionAsync({
            //     distanceInterval:0.01
            // },location=>{
            //         const {coords:{latitude,longitude}} = location
            //         setRegion({...region,latitude,longitude})
            //         console.log("location===>",location)
            //     })

            let location = await Location.getCurrentPositionAsync({});
            const {coords:{latitude,longitude}} = location
            console.log('loc======>',location)
            setRegion({...region,latitude,longitude})
            setLocation(location);
            try{
              await storeLoction(undefined,location);
              console.log("stored")
            }
            catch(e){
              console.log("not done",e)
            }
            
            fetch('https://api.foursquare.com/v2/venues/search?client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=24.9121428,67.0545419&v=20180323')
            .then(res => res.json())
            .then(res => setCurrentLocName(res.response.venues[0].name))
            setCheck(true)
                   
          })();
          }, []);

        useEffect(()=>{
          // (async () => {

          //   let { status } = await Location.requestForegroundPermissionsAsync();
          //   if (status !== 'granted') {
          //     setErrorMsg('Permission to access location was denied');
          //     return;
          //   }

          //   let location = await Location.getCurrentPositionAsync({});
          //   const {coords:{latitude,longitude}} = location
          //   console.log('loc======>',location)
          //   setRegion({...region,latitude,longitude})
          //   setLocation(location);
            

          fetch(`https://api.foursquare.com/v2/venues/search?
          client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&
          client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=${region.latitude},${region.longitude}&v=20180323`)
          .then(res => res.json())
          .then(res => console.log("==>",res)) 
          console.log("reg lat==>",region.latitude)
          
        // })();
        },[region])

        let text = 'Waiting..';
        if (errorMsg) {
          text = errorMsg;
        } else if (location) {
          text = JSON.stringify(location);
        }

    return(
        <>
        <View>    
         {/* <Text style={{fontSize:40}}>DASHBOARD SCREEN</Text> */}
           <Button 
            title="goto dropOff screen"
            onPress={()=>navigation.navigate('DropOffs')}
            />


        </View>
        {check ?  
                //CurrentLocName.response.venues[0].name
            <View>
                <Text style={{textAlign:'center'}}>{currentLocName}</Text>
            </View>
        : 
        <></> 
        }
        <MapView style={styles.map} region={region}>
            <Marker 
            title={currentLocName}
            coordinate={region}
            draggable={true}
            onDragStart={(e)=>console.log('drag start',region)}
            onDragEnd={(e)=>
              setRegion({
                ...region,
                latitude:e.nativeEvent.coordinate.latitude,
                longitude:e.nativeEvent.coordinate.longitude
              })
            }
            />
        </MapView>
    </>
    )
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
  });