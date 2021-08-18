import * as React from 'react';
import { View, Text, SectionList, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

export default function SelectCars({route}){
    
    const {pickUpLoc , dropOffLoc , pickUpReg , dropOffReg} = route.params;
    var lat1 = pickUpReg.latitude;
    var lon1 = pickUpReg.longitude;
    var lat2 = dropOffReg.latitude;
    var lon2 = dropOffReg.longitude;

    const CARS = [
        {
          title: "CAR SELECTIONS",
          data: ["Mini", "Go", "Business"]
        }
    ]

    const Item = ({ title }) => (
            <TouchableOpacity>
            <View>
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
        </View>
            </View>
            </TouchableOpacity>
      );
        console.log('pick region==>',pickUpReg.latitude,pickUpReg.longitude)
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
        <View>
            <Text style={{textAlign:'center'}}>Pick-Up Location : {pickUpLoc}</Text>
            <Text style={{textAlign:'center'}}>Drop-Off Location : {dropOffLoc}</Text>
        </View>
        <View>
            <SafeAreaView>
                <SectionList
                 sections={CARS}
                 keyExtractor={(item, index) => item + index}
                 renderItem={({ item }) => <Item title={item} />}
                 renderSectionHeader={({ section: { title } }) => (
                   <Text style={styles.header}>{title}</Text>
                 )}
                />
            </SafeAreaView>
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
    item: {
      backgroundColor: "black",
      padding: 20,
      marginVertical: 8,
    },
    header: {
      fontSize: 30,
      backgroundColor: "#fff",
      textAlign:'center'

    },
    title: {
      fontSize: 24,
      color:'white'
    }
  });