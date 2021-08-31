import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView , {Marker} from 'react-native-maps';
import { useState , useEffect } from 'react';
import * as Location from 'expo-location';
import db, { storeLocation, getNearestDrivers, requestDriver } from '../../config/firebase';
import { Button } from 'react-native-paper';

export default function DriverRideScreen(){
    const [driverReg,setDriverReg] = useState()
    const [userReg,setUserReg] = useState()
    const [dropOffReg,setDropOffReg] = useState()
    const [rideStatus,setRideStatus] = useState(false)
    const [dropOffLoc,setDropOffLoc] = useState('')
    const [isDone,setIsDone] = useState(false)

    useEffect(()=>{

        db.collection('users').doc('PQRTGpIElkUmPuNCnNbn3Oj0EDC3').onSnapshot((doc)=>{
            const data = doc.data()
            console.log("driver drop off",data.dropOffLoc.dropOffRegions)
            setDriverReg({
                latitude:data.acceptedRequest.lat,
                longitude:data.acceptedRequest.lng,
                latitudeDelta:0.0022,
                longitudeDelta:0.0021
            })
            setUserReg({
                latitude:data.lat,
                longitude:data.lng,
                latitudeDelta:0.0022,
                longitudeDelta:0.0021
            })
            setDropOffReg({
                latitude:data.dropOffLoc.dropOffRegions.latitude,
                longitude:data.dropOffLoc.dropOffRegions.longitude,
                latitudeDelta:0.0022,
                longitudeDelta:0.0021
            })
            // if(driverReg === userReg){
            //     Alert.alert('driver arrived')
            // }
            if(driverReg === driverReg){
                Alert.alert('Ride Completed')
            }
            setDropOffLoc(data.dropOffLoc.dropOffLoc)
        })
    },[])
    console.log(driverReg)
    console.log(userReg)

    return(
        <>
        {/* <Button title="hellloo"/> */}
        <MapView style={styles.map} region={driverReg}>

            {userReg && <Marker coordinate={userReg} title='user pick up'
            icon={require('../../../assets/marker1.jpg')}
            />}

            {driverReg && <Marker coordinate={dropOffReg}
            icon={require('../../../assets/Black.jpg')}
            title='Me'
            />}

            {dropOffReg &&  <Marker coordinate={dropOffReg} title='user drop Off'
            icon={require('../../../assets/marker1.jpg')}
            /> }

        </MapView>

        <Button
         style={{height:40,width:300,alignSelf:'center',marginTop:15 }}
         mode="contained"
         color="#0a3338"
         onPress={()=>Alert.alert('Your Ride has been started',`We are going  ${dropOffLoc}`)}
        >
        START RIDE
        </Button>
    
        </>
    )
}

const styles = StyleSheet.create({
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height * 0.8,
        },
    });