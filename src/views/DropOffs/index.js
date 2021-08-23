import * as React from 'react';
import { View, Text , StyleSheet ,Dimensions ,TextInput ,SafeAreaView, Button} from 'react-native';
import MapView , {Marker} from 'react-native-maps';
import { useState , useEffect } from 'react';
import { Searchbar } from 'react-native-paper';
import * as Location from 'expo-location';

export default function DropOffs({route,navigation},props){

    const {locName , regions} = route.params;
    console.log("loc name dropoff===>>>>>>>>>",props)
    const [dropLoc,setDropLoc] = useState(locName)
    const [region,setRegion] = useState(regions)

    const [searchQuery, setSearchQuery] = useState('');

    const onChangeSearch = query => setSearchQuery(query);

    useEffect(()=>{

        fetch(`https://api.foursquare.com/v2/venues/search?client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=${region.latitude},${region.longitude}&v=20180323`)
        .then(res => res.json())
        .then(res => setDropLoc(res.response.venues[0].name)) 

      },[region])


    return(
        <>
        <View>
            <Text style={{textAlign:'center',marginTop:5}}>drop off screen</Text>
            <Text style={{textAlign:'center'}}>Pick-Up Location : {locName}</Text>
            <SafeAreaView>
            <Searchbar
                style={{marginTop:10,padding:5}}
                placeholder="Search Your Drop Location"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
               
            <Button
            title="Select ride"
            onPress={()=>navigation.navigate('CarSelection',{
                pickUpLoc:locName,
                dropOffLoc:dropLoc,
                pickUpReg:regions,
                dropOffReg:region
            })}
            />
            </SafeAreaView>
        </View>
        <View>
        <MapView style={styles.map} region={region}>
            <Marker 
            title={dropLoc}
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
        </View>
    </>
    )
}

const styles = StyleSheet.create({
    map: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        },
    input: {
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
    }
    });