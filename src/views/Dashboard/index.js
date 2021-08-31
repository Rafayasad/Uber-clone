import * as React from 'react';
import { View, Text , StyleSheet , Dimensions , Platform, ActivityIndicator} from 'react-native';
import AppWeb from '../../components/Webview';
import MapView , {Marker} from 'react-native-maps';
import { useState , useEffect } from 'react';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';
import { storeLoction } from '../../config/firebase';
import db, { storeLocation, getNearestDrivers, requestDriver } from '../../config/firebase';
import { geohashForLocation, geohashQueryBounds, distanceBetween} from 'geofire-common';

export default function Dashboard({navigation}){
    const [region,setRegion] = useState({
            latitude: 24.91213242,
            longitude:  67.054324234,
            // latitude: 24.9121428,
            // longitude:  67.0545419,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
        })

        const [location, setLocation] = useState(null);
        const [errorMsg, setErrorMsg] = useState(null);
        const [currentLocName,setCurrentLocName] = useState('');
        const [moveToDropOff,setMoveToDropOff] = useState(false)
        const [isLoading, setIsLoading] = useState(false);
        const [loadingText,setLoadingText] = useState('');
        const [currentIndex, setCurrentIndex] = useState(0);
        const center = [region.latitude, region.longitude];
        const radiusInM = 4000; 

        //fetching our drivers
        // const fetchDrivers = async () =>{
        //   setIsLoading(true);
        //   const bounds = geohashQueryBounds(center, radiusInM);
        //   const promises = [];
        //   for(const b of bounds) {
        //     const q = getNearestDrivers(b)
        //     promises.push(q.get());
        //   }


        //   const snapshots = await Promise.all(promises)
        //   console.log('snapshots==>',snapshots)
        //   const matchingDocs = [];
    
        //   for(const snap of snapshots) {
        //     for(const doc of snap.docs){
        //       const lat = doc.get('lat');
        //       const lng = doc.get('lng');
        //       console.log("doc===>",doc)
    

        //   //calculating a distance
        //   const distanceInKm = distanceBetween([lat,lng], center);
        //   console.log('distance, radiusINM ***', distanceInKm, radiusInM);
        //   const distanceInM = distanceInKm * 1000;
        //   if(distanceInM <= radiusInM) {
        //       matchingDocs.push({...doc.data(), id: doc.id, distanceInKm});
        //     } 
        //   }
        // }
        // setLoadingText(`${matchingDocs.length} Drivers found`)
        // setIsLoading(false)
        //   console.log("matchingDocs ===>", matchingDocs);
        //   requestDrivers(matchingDocs)
        // }
        
        // //requesting driver for matching
        // const requestDrivers = async (matchingDocs) =>{
        //   await requestDriver(matchingDocs[currentIndex].id,{
        //     userId: "PQRTGpIElkUmPuNCnNbn3Oj0EDC3",
        //     lat: region.latitude,
        //     lng: region.longitude
        //   })
        //   console.log("driver requested")
        //   listenToRequestedDriver(matchingDocs[currentIndex].id)
        // }
        
        // //listening driver request
        // const listenToRequestedDriver = (driverId) =>{
        //   db.collection('driver').doc(driverId).onSnapshot((doc)=>{
        //     const data = doc.data();
        //     if(!data.currentRequest){
        //       setLoadingText("1 driver rejected! Finding another driver");
        //       setCurrentIndex(currentIndex + 1);
        //       requestDrivers();
        //     }
        //   })
        // }
          
          useEffect(() => {
            (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
           console.log("status==>",status)
            if (status !== 'granted'){
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
            // let location ={
            //   coords: {
            //     latitude: 24.9159168,
            //     longitude: 67.0594378
            //   }
            // }
            console.log("hi")
            try{
              let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
            }
            catch(e){
              console.log("error text",e)
            }
            const {coords:{latitude,longitude}} = location
            console.log('location======>',location)
            setRegion({...region,latitude,longitude})
            // setLocation(location);
            // const lat = latitude
            // const lng = longitude
            // try{
            //   const hash = geohashForLocation([lat,lng]);
            //   await storeLocation(undefined, {
            //     geohash: hash, lat, lng
            //   })
            //   console.log("loction stored==>");
            // }
            // catch(e){
            //   console.log("unable to store",e)
            // }
            
            fetch(`https://api.foursquare.com/v2/venues/search?client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=${latitude},${longitude}&v=20180323`)
            .then(res => res.json())
            .then(res => setCurrentLocName(res.response.venues[0].name))
                   
          })();
          }, []);

        useEffect(()=>{

          fetch(`https://api.foursquare.com/v2/venues/search?client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=${region.latitude},${region.longitude}&v=20180323`)
          .then(res => res.json())
          .then(res => setCurrentLocName(res.response.venues[0].name)) 
          // console.log("reg lat==>",region.latitude)
          
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
          
           <Button
           style={{height:40,width:300,alignSelf:'center',marginTop:5}}
           mode="contained"
           color="#0a3338"
           onPress={()=>navigation.navigate('DropOffs',{
            locName:currentLocName,
            regions:region
           })}
           >
             SELECT YOUR DROP OFF
           </Button>

          {/* 
          onPress={()=>navigation.navigate('DropOffs',{
             locName:currentLocName,
             regions:region
            })}
          {isLoading ? <>
            <ActivityIndicator size="large" color="#00ff00"/>
            </>
            :
            <>
            <Text style={{textAlign:'center'}}>{loadingText}</Text>
            </>
          } */}
            
        <MapView style={styles.map} region={region}>
            <Marker 
            icon={require('../../../assets/marker1.jpg')}
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

        {/* <Button 
          title="GO RIDE"
          onPress={fetchDrivers}
        /> */}
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