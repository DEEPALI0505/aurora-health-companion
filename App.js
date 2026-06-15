import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuroraProvider } from './src/store';
import { Colors } from './src/theme';
import {
  registerForPushNotifications,
  scheduleWaterReminders,
  scheduleSleepReminder,
  scheduleHabitReminders,
  scheduleDailyInsight,
} from './src/notifications';
import { onAuthChange, getUserProfile } from './src/supabase';

import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import VoiceBotScreen from './src/VoiceBot';
import {
  WaterScreen, SleepScreen, HabitsScreen, NutritionScreen,
  NotificationsScreen, AIScreen, ProfileScreen,
} from './src/screens/AllScreens';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: 'Home', icon: '🏠' },
  { name: 'Water', icon: '💧' },
  { name: 'Habits', icon: '⚡' },
  { name: 'Aurora', icon: '🌿' },
  { name: 'Notifications', icon: '🔔' },
];

function MainTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderTopColor: 'rgba(0,0,0,0.08)',
          borderTopWidth: 1,
          paddingBottom: 20,
          paddingTop: 10,
          height: 82,
        },
        tabBarBackground: () => (
          <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFillObject} />
        ),
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          const cfg = TAB_CONFIG.find(t => t.name === route.name);
          return (
            <View style={{ alignItems: 'center', gap: 3 }}>
              <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{cfg?.icon}</Text>
              <Text style={{ fontSize: 9, fontWeight: '600', letterSpacing: 0.5, color: focused ? Colors.teal : 'rgba(0,0,0,0.35)' }}>
                {route.name.toUpperCase()}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Water" component={WaterScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      <Tab.Screen name="Aurora">
        {(props) => <VoiceBotScreen {...props} userName={user?.full_name?.split(' ')[0] || 'there'} />}
      </Tab.Screen>
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

function AppCore({ user, onLogout }) {
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: Colors.teal,
          background: '#FFFFFF',
          card: '#FFFFFF',
          text: Colors.text,
          border: 'rgba(0,0,0,0.08)',
          notification: Colors.teal,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="MainTabs">
          {(props) => <MainTabs {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen name="Sleep" component={SleepScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Nutrition" component={NutritionScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="AI" component={AIScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Profile">
          {(props) => <ProfileScreen {...props} user={user} onLogout={onLogout} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [appState, setAppState] = useState('loading');
  const [user, setUser] = useState(null);

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const init = async () => {
      const onboardingDone = await AsyncStorage.getItem('aurora_onboarding_done');
      const { data: { subscription } } = onAuthChange(async (session) => {
        if (session?.user) {
          const profile = await getUserProfile();
          setUser(profile);
          setAppState('main');
        } else {
          setUser(null);
          if (onboardingDone) {
            setAppState('auth');
          } else {
            setAppState('onboarding');
          }
        }
      });
      try {
        const granted = await registerForPushNotifications();
        if (granted) {
          await scheduleWaterReminders(1, true);
          await scheduleSleepReminder(true);
          await scheduleHabitReminders(true);
          await scheduleDailyInsight(true);
        }
      } catch (e) {}
      return () => subscription?.unsubscribe();
    };
    init();
  }, []);

  const handleOnboardingDone = () => setAppState('auth');

  const handleAuthSuccess = async () => {
    const profile = await getUserProfile();
    setUser(profile);
    setAppState('main');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('auth');
  };

  if (appState === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }} onLayout={onLayoutRootView}>
        <LinearGradient colors={['rgba(0,196,167,0.25)', 'rgba(124,92,191,0.2)']} style={{ width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 32 }}>🌿</Text>
        </LinearGradient>
        <Text style={{ color: Colors.text, fontSize: 22, fontWeight: '700', letterSpacing: 1 }}>aurora</Text>
        <ActivityIndicator color={Colors.teal} style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <AuroraProvider user={user}>
          <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
          {appState === 'onboarding' && <OnboardingScreen onDone={handleOnboardingDone} />}
          {appState === 'auth' && <AuthScreen onAuthSuccess={handleAuthSuccess} />}
          {appState === 'main' && <AppCore user={user} onLogout={handleLogout} />}
        </AuroraProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}