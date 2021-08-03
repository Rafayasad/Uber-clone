import * as React from 'react';
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

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Dashboard Stack" component={DashboardStack} />
        <Drawer.Screen name="Trips Stack" component={TripsStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function DashboardStack(){
    return <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={DashboardTabs} />
        <Stack.Screen name="DropOffs" component={DropOffs} />
    </Stack.Navigator>
}

function DashboardTabs(){
    return <Tab.Navigator>
    <Tab.Screen name="DashboardTab" component={Dashboard} />
    <Tab.Screen name="FavouriteLocationsTabs" component={FavouriteLocations} />
    <Tab.Screen name="PreviousLocationsTabs" component={PreviousLocations} />
  </Tab.Navigator>
}

function TripsStack(){
    return <Stack.Navigator>
        <Stack.Screen name="YourTrips" component={YourTrips} />
        <Stack.Screen name="TripsDetails" component={TripsDetails} />
    </Stack.Navigator>
}
