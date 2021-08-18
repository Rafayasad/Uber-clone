import * as React from 'react';
import {View,Dimensions , Text, SectionList, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity,Alert } from 'react-native';
import MapView , {Marker} from 'react-native-maps';
import { useState , useRef } from 'react';
import { List , Button } from 'react-native-paper';
import MapViewDirections from 'react-native-maps-directions';

export default function SelectCars({route}){
    
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



    return(
        <>

        <View style={{marginTop:5}}>
            <Text style={{textAlign:'center'}}>Pick-Up Location : {pickUpLoc}</Text>
            <Text style={{textAlign:'center'}}>Drop-Off Location : {dropOffLoc}</Text>
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
              
            {/* <MapViewDirections
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

        <View style={{marginTop:300}}>
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
        color="grey"
        onPress={() => Alert.alert('Ride Confirmation', `Your Ride Has Been Confirmed.`)}>
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
     height:300,
     width:400,
     justifyContent:'flex-end',
     alignItems:'center',
     marginTop:50
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