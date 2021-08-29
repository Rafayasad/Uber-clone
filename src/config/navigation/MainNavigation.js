import * as React from 'react';
import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Dashboard from '../../views/Dashboard';
import DropOffs from '../../views/DropOffs';
import FavouriteLocations from '../../views/FavouriteLocations';
import PreviousLocations from '../../views/PreviousLocation';
import YourTrips from '../../views/YourTrips';
import TripsDetails from '../../views/TripsDetails';
import DrawerContent from '../../components/DrawerContent';
import LoginIn from '../../views/LoginIn';
import SelectCars from '../../views/SelectCars';
import DriverDashboard from '../../views/DriverDashboard';
import RideScreen from '../../views/RideScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

export default function MainNavigator() {

  // console.log('isSigned In', isSignedIn)
  const [isSignedIn,setIsSignedIn] = useState(false)
  const [isSelect,setIsSelect] = useState(false)

  return <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
              {
                  !isSignedIn ?
              <Stack.Screen name="Auth" component={()=><AuthNavigator setIsSignedIn={setIsSignedIn} setIsSelect={setIsSelect} />} />
              :
              <>
              {
                !isSelect ?
                <Stack.Screen name="App" component={AppNavigator} />
              :
              <Stack.Screen name="App" component={DriverNavigator} />
            }
            </>
            }
          </Stack.Navigator>
  </NavigationContainer>
}

function AuthNavigator({setIsSignedIn,setIsSelect}){
  return <Stack.Navigator screenOptions={{headerShown:true}}>
    <Stack.Screen 
    name='login'
    component={()=><LoginIn setIsSignedIn={setIsSignedIn} setIsSelect={setIsSelect}/>} 
    />
  </Stack.Navigator>
}


function AppNavigator(){
  // const [isSelect,setIsSelect] = useState(false)

  return(
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>}>
      <Drawer.Screen name="Dashboard Stack" component={DashboardStack} />
      <Drawer.Screen name="Trips Stack" component={TripsStack} /> 
  </Drawer.Navigator>
  )
}

function DriverNavigator(){
  return(
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>}>
      <Drawer.Screen name="Dashboard Driver Stack" component={DriverDashboard} />
      <Drawer.Screen name="Trips Driver Stack" component={TripsStack} /> 
  </Drawer.Navigator>
  )
}

function DashboardStack(){
    return <Stack.Navigator screenOptions={{headerShown:false}} >
        <Stack.Screen name="RideScreen" component={RideScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="DropOffs" component={DropOffs} />
        <Stack.Screen name="CarSelection" component={SelectCars} />
    </Stack.Navigator>
}

function DashboardTabs(){
    return <Stack.Navigator>
    {/* <Stack.Screen name="DashboardTab" component={Dashboard} /> */}
     {/* <Stack.Screen name="FavouriteLocationsTabs" component={FavouriteLocations} />  */}
     {/* <Tab.Screen name="PreviousLocationsTabs" component={PreviousLocations} />  */}
  </Stack.Navigator>
}

function TripsStack(){
    return <Stack.Navigator>
        <Stack.Screen name="YourTrips" component={YourTrips} />
        <Stack.Screen name="TripsDetails" component={TripsDetails} />
    </Stack.Navigator>
}



