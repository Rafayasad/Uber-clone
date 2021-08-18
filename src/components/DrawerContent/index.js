import React from 'react';
import { View , StatusBar} from 'react-native';
import { 
    DrawerContentScrollView ,
    DrawerItem 
} from '@react-navigation/drawer';
import {
    Avatar,
    Title,
    Text,
    Switch,
    Drawer,
} from 'react-native-paper'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginIn from '../../views/LoginIn';
import { log } from 'react-native-reanimated';
// import { Item } from 'react-native-paper/lib/typescript/components/List/List';

export default function DrawerContent(props){

    return (
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                {console.log('drawaerprops==>',props)}
                <View style={{flex:1}}>
                <StatusBar animated='auto'/>
                <Drawer.Section style={{marginTop:-5,backgroundColor:'black'}}>
                    <View style={{paddingLeft:20,marginBottom:100}}>
                        <View style={{flexDirection:'row',marginTop:15}}>
                            <Avatar.Image
                            source={{
                                uri:'https://scontent.fkhi1-1.fna.fbcdn.net/v/t1.6435-9/206794796_1817102075127261_8372042873344739012_n.jpg?_nc_cat=110&ccb=1-4&_nc_sid=09cbfe&_nc_eui2=AeG3xSkRvTa-ez3MCmYIeUYSy51BI-AXwuPLnUEj4BfC4yhRvsbQcGKE65aleXmJVSQ56yct5CALeKmG-bRgflzl&_nc_ohc=R59fC4IqGSYAX-FRzsP&_nc_ht=scontent.fkhi1-1.fna&oh=f1a18042d07df659ba1cb7140bfe956e&oe=613803CE'
                            }}
                            size={70}
                            />
                        <View style={{marginLeft:15}}>
                            <Title style={{fontSize:17,marginTop:15,color:'white'}}>Rafay Asad</Title>
                        </View>
                        </View>
                    </View>
                    </Drawer.Section>

                    <Drawer.Section style={{marginTop:15}}>
                        <DrawerItem
                        icon={({color,size})=>(
                            <Icon
                            name='home-outline'
                            color={color}
                            size={size}
                            />
                            )}
                            label="Dashboard"
                            onPress={()=>{props.navigation.navigate('Dashboard Stack')}}
                            />

                         <DrawerItem
                        icon={({color,size})=>(
                            <Icon
                            name='car'
                            color={color}
                            size={size}
                            />
                            )}
                            label="Trips Details"
                            onPress={()=>{props.navigation.navigate('Trips Stack')}}
                            />
                    </Drawer.Section>

                </View>
            </DrawerContentScrollView>
        </View>
    )
}