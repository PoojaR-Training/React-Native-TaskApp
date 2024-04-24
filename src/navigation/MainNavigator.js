import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import NotificationList from '../Screens/NotificationList';
import NotificationScreen from '../Screens/NotificationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const MainNavigator=()=>{
    const Stack = createNativeStackNavigator();
    return(
        <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen name='NotificationScreen' component={NotificationScreen}/>
                <Stack.Screen name='NotificationList' component={NotificationList}/>
            </Stack.Navigator>
            </NavigationContainer>
    )
}
export default MainNavigator