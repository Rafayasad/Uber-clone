import * as React from 'react';
import {View,Dimensions , Text, SectionList, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import MapView , {Marker} from 'react-native-maps';
import { useState , useEffect } from 'react';
import { List , Button } from 'react-native-paper';
import MapViewDirections from 'react-native-maps-directions';
import db, { storeLocation, getNearestDrivers, requestDriver , acceptRequest , storeDropOffLoc } from '../../config/firebase';
import { geohashForLocation, geohashQueryBounds, distanceBetween} from 'geofire-common';

export default function SelectCars({route,navigation}){
    
    const {pickUpLoc , dropOffLoc , pickUpReg , dropOffReg} = route.params;
    var lat1 = pickUpReg.latitude;
    var lon1 = pickUpReg.longitude;
    var lat2 = dropOffReg.latitude;
    var lon2 = dropOffReg.longitude;

    const [reg,setReg] = useState({
      latitude:lat1,
      longitude:lon1,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0921
    })

    const [reg2,setReg2] = useState({
      latitude:lat2,
      longitude:lon2,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0921
    })

    const [isSelectRide,setisSelectRide] = useState('')
    const [cars,setCars] = useState('')
    const [carSelection,setCarSelection] = useState(false)
    const [loadingText,setLoadingText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const radiusInM = 5000;
    const center = [lat1, lon1];

    const Item = ({ title }) => (
            <TouchableOpacity>
            <View>
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
        </View>
            </View>
            </TouchableOpacity>
      );
        console.log('pick region==>',pickUpReg,pickUpReg.longitude)
        console.log('drop region==>',dropOffReg.latitude,dropOffReg.longitude)
        console.log('cal==>',Math.round(getDistanceFromLatLonInKm()))

        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            var lat1 = pickUpReg.latitude;
            var lon1 = pickUpReg.longitude;
            var lat2 = dropOffReg.latitude;
            var lon2 = dropOffReg.longitude;
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2-lat1);  // deg2rad below
            var dLon = deg2rad(lon2-lon1); 
            var a = 
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2)
              ; 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c; // Distance in km
            return d;
          }
          
          function deg2rad(deg) {
            return deg * (Math.PI/180)
          }



          //fetching our drivers
        const fetchDrivers = async () =>{
          setIsLoading(true);
          const bounds = geohashQueryBounds(center, radiusInM);
          const promises = [];
          for(const b of bounds) {
            const q = getNearestDrivers(b)
            promises.push(q.get());
          }


          const snapshots = await Promise.all(promises)
          console.log('snapshots==>',snapshots)
          const matchingDocs = [];
    
          for(const snap of snapshots) {
            for(const doc of snap.docs){
              const lat = doc.get('lat');
              const lng = doc.get('lng');
              console.log("doc===>",doc)
    

          //calculating a distance
          const distanceInKm = distanceBetween([lat,lng], center);
          console.log('distance, radiusINM ***', distanceInKm, radiusInM);
          const distanceInM = distanceInKm * 1000;
          if(distanceInM <= radiusInM) {
              matchingDocs.push({...doc.data(), id: doc.id, distanceInKm});
            } 
          }
        }
        setLoadingText(`${matchingDocs.length} Drivers found`)
        setIsLoading(false)
          console.log("matchingDocs ===>", matchingDocs);
          requestDrivers(matchingDocs)
        }
        
        //requesting driver for matching
        const requestDrivers = async (matchingDocs) =>{
          const lat = lat1
          const lng = lon1
          await requestDriver(matchingDocs[currentIndex].id,{
            userId: "PQRTGpIElkUmPuNCnNbn3Oj0EDC3",
            lat: lat,
            lng: lng
          })
          console.log("1 driver requested")
          listenToRequestedDriver(matchingDocs[currentIndex].id)
        }
        
        //listening driver request
        const listenToRequestedDriver = (driverId) =>{
          db.collection('driver').doc(driverId).onSnapshot((doc)=>{
            const data = doc.data();
            if(!data.currentRequest){
              setLoadingText("1 driver rejected! Finding another driver");
              setCurrentIndex(currentIndex + 1);
              requestDrivers();
            }
           db.collection('users').doc('PQRTGpIElkUmPuNCnNbn3Oj0EDC3').onSnapshot((doc)=>{
             const data = doc.data();
             if(data.acceptedRequest){
              setLoadingText("1 driver accepted!");
              storeDropOffLoc("PQRTGpIElkUmPuNCnNbn3Oj0EDC3",dropOffReg)
              navigation.navigate('RideScreen')
             }
           })
          })
        }

        useEffect(()=>{
          (async()=>{
            const lat = lat1
            const lng = lon1
            try{
              const hash = geohashForLocation([lat,lng]);
              await storeLocation(undefined, {
                geohash: hash, lat, lng
              })
              console.log("loction stored==>");
            }
            catch(e){
              console.log("unable to store",e)
            }
          })();
        },[]);


    return(
        <>

        <View style={{marginTop:5}}>
            <Text style={{textAlign:'center'}}>Pick-Up Location : {pickUpLoc}</Text>
            <Text style={{textAlign:'center'}}>Drop-Off Location : {dropOffLoc}</Text>
        </View>

        <View>
        {isLoading ? <>
          <ActivityIndicator animating={true} color='black' />
            </>
            :
            <>
            <Text style={{textAlign:'center'}}>{loadingText}</Text>
            </>
          }
        </View>

        <View style={styles.containers}>
            <MapView
            // style={StyleSheet.absoluteFill}
            style={styles.map}
            initialRegion={reg}
            >
              <Marker 
              coordinate={reg}
              title={pickUpLoc}
              />
              <Marker 
              coordinate={reg2}
              title={dropOffLoc}
              />

            {/* 
         ******   FOR DRAW A LINE BETWEEN TWO COORDS LIKE => PICKUP TO DROPOFF *****
            <MapViewDirections
            origin={pickUpReg}
            destination={dropOffReg}
            apikey="AIzaSyA3jrGJUfGBVf5T_JkbgtrE2zdtVJe-V0I"
            strokeWidth={3}
            strokeColor='black'
            optimizeWaypoints={true}
            onReady={result=>{
              mapRef.current.fitToCoordinates(result.coordinates,{
                edgePadding:{
                  right:30,
                  bottom:300,
                  left:30,
                  top:100
                }
              }) 
            }}
            /> */}
            </MapView>
        </View>

        <View style={{marginTop:260}}>
        <List.Section>
        <List.Subheader>Select Your Ride</List.Subheader>
        <List.Item 
          style={{backgroundColor:'#C3C7C8'}}
          title='Mini' 
          left={() => <List.Icon icon="car" />} 
          onPress={()=>{{
            setisSelectRide(25*Math.round(getDistanceFromLatLonInKm()))
            setCars('Mini')
            setCarSelection(true)
          }}
        }
          />
        
        <List.Item
          style={{backgroundColor:'#C3C7C8',marginTop:2}}
          title='Go'
          left={() => <List.Icon color="#000" icon="car-side" />}
          onPress={()=>{{
            setisSelectRide(45*Math.round(getDistanceFromLatLonInKm()))
            setCars('Go')
            setCarSelection(true)
          }}
        }
        />
        
        <List.Item
        style={{backgroundColor:'#C3C7C8',marginTop:2}}
        title='Business'
        left={() => <List.Icon color="#000" icon="car-sports" />}
        onPress={()=>{{
          setisSelectRide(60*Math.round(getDistanceFromLatLonInKm()))
          setCars('Business')
          setCarSelection(true)
        }}
        }
      />
        </List.Section>
        </View>

        <View style={{marginTop:5,padding:5,alignItems:'center'}}>
         <Button
        style={{height:40,width:300}}
        mode="contained"
        color="#0a3338"
        onPress={fetchDrivers}
        // onPress={() => Alert.alert('Ride Confirmation', `Your Ride Has Been Confirmed.`)}
        >
          {carSelection ?
         <> {cars} {isSelectRide} PKR </>
          :
          <>Select Your Ride</>
        }
        </Button>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      marginHorizontal: 16
    },
    containers: {
     ...StyleSheet.absoluteFillObject,
     height:270,
     width:400,
     justifyContent:'flex-end',
     alignItems:'center',
     marginTop:70
    },
    item: {
      backgroundColor: "#1D1E21",
      padding: 15,
      marginVertical: 8,
    },
    header: {
      fontSize: 20,
      backgroundColor: "#fff",
      textAlign:'center'

    },
    title: {
      fontSize: 24,
      color:'white'
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    }
  });