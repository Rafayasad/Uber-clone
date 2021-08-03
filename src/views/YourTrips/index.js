import * as React from 'react';
import { View, Text, Button } from 'react-native';

export default function YourTrips({navigation}){
    return(
        <View>
            <Text style={{fontSize:50}}>YourTrips SCREEN</Text>
            <Button
            title="goto trip details screen"
            onPress={()=>navigation.navigate('TripsDetails')}
            />
        </View>
    )
}