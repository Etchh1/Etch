import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '../hooks/useAuth'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen'
import SignInScreen from '../screens/SignInScreen'
import SignUpScreen from '../screens/SignUpScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen'
import CreateServiceScreen from '../screens/CreateServiceScreen'
import BookingsScreen from '../screens/BookingsScreen'
import MessagesScreen from '../screens/MessagesScreen'
import SearchScreen from '../screens/SearchScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ title: 'Discover' }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetailsScreen}
        options={{ title: 'Service Details' }}
      />
      <Stack.Screen 
        name="CreateService" 
        component={CreateServiceScreen}
        options={{ title: 'Create Service' }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ title: 'Search Services' }}
      />
    </Stack.Navigator>
  )
}

export default function AppNavigator() {
  const { session } = useAuth()

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline'
            } else if (route.name === 'Bookings') {
              iconName = focused ? 'calendar' : 'calendar-outline'
            } else if (route.name === 'Messages') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline'
            }

            return <Ionicons name={iconName as any} size={size} color={color} />
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Bookings" 
          component={BookingsScreen}
          options={{ title: 'My Bookings' }}
        />
        <Tab.Screen 
          name="Messages" 
          component={MessagesScreen}
          options={{ title: 'Messages' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'My Profile' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
} 