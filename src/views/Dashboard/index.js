import * as React from 'react';
import { View, Text, Button } from 'react-native';
import AppWeb from '../../components/Webview';

export default function Dashboard({navigation}){
    return(
        <>
        <View>    
            <Text style={{fontSize:40}}>DASHBOARD SCREEN</Text>
            <Button 
            title="goto dropOff screen"
            onPress={()=>navigation.navigate('DropOffs')}
            />
        </View>
            <AppWeb />
    </>
    )
}