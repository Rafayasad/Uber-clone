import * as React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView , {Marker} from 'react-native-maps';
import { useState , useEffect } from 'react';
import * as Location from 'expo-location';
import db, { storeLocation, getNearestDrivers, requestDriver } from '../../config/firebase';

export default function RideScreen(){
    const [driverReg,setDriverReg] = useState()
    const [userReg,setUserReg] = useState()

    useEffect(()=>{

        db.collection('users').doc('PQRTGpIElkUmPuNCnNbn3Oj0EDC3').onSnapshot((doc)=>{
            const data = doc.data()
            setDriverReg({
                lat:data.acceptedRequest.lat,
                lng:data.acceptedRequest.lng,
                latDelta:0.0022,
                lngDelta:0.0021
            })
            setUserReg({
                lat:data.lat,
                lng:data.lng,
                latDelta:0.0022,
                lngDelta:0.0021
            })
        })

    },[])

    return(
        <>
        <MapView style={styles.map} region={driverReg}>
            {/* <Marker 
            // title={currentLocName}
            
            /> */}
            {driverReg && <Marker coordinate={driverReg}/>}
        </MapView>
        </>
    )
}

const styles = StyleSheet.create({
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height * 0.5,
        },
    });