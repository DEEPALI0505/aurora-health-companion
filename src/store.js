import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: { name: 'Alex', age: 28, weight: 72, height: 178, email: '' },
  goals: { water: 2500, sleep: 8, calories: 2000 },
  waterMl: 1750,
  waterLog: [
    { label: 'Morning glass ☀️', ml: 300, time: '7:00 AM' },
    { label: 'Green tea 🫖', ml: 200, time: '9:15 AM' },
    { label: 'Bottle 💧', ml: 750, time: '11:30 AM' },
    { label: 'Lunch 💧', ml: 500, time: '1:00 PM' },
  ],
  sleepHours: 6.75,
  sleepQuality: 82,
  sleepLogs: [
    { day: 'Mon', hours: 6.5 }, { day: 'Tue', hours: 7.5 },
    { day: 'Wed', hours: 7.0 }, { day: 'Thu', hours: 8.0 },
    { day: 'Fri', hours: 6.5 }, { day: 'Sat', hours: 8.5 },
    { day: 'Sun', hours: 6.75 },
  ],
  habits: [
    { id: 1, name: 'Morning meditation', duration: '10 min', done: true, streak: 12 },
    { id: 2, name: 'Read 20 minutes', duration: '20 min', done: true, streak: 7 },
    { id: 3, name: 'Morning stretch', duration: '5 min', done: true, streak: 5 },
    { id: 4, name: 'Evening walk', duration: '20 min', done: false, streak: 3 },
    { id: 5, name: 'Supplements', duration: 'Morning', done: true, streak: 21 },
  ],
  calories: 1240, protein: 68, carbs: 142, fat: 38, fiber: 18,
  meals: [
    { type: 'Breakfast 🌅', food: 'Oats, banana, coffee', kcal: 420 },
    { type: 'Lunch ☀️', food: 'Chicken rice bowl', kcal: 820 },
  ],
  dayStreak: 21, waterStreak: 14, auroraScore: 87,
  notifWater: true, notifSleep: true, notifHabits: true, notifInsight: true,
  waterInterval: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.data } };
    case 'ADD_WATER':
      const newMl = Math.min(state.waterMl + action.ml, state.goals.water);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { ...state, waterMl: newMl, waterLog: [...state.waterLog, { label: 'Water 💧', ml: action.ml, time: now }] };
    case 'TOGGLE_HABIT':
      return { ...state, habits: state.habits.map(h => h.id === action.id ? { ...h, done: !h.done } : h) };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, { id: Date.now(), name: action.name, duration: 'Daily', done: false, streak: 0 }] };
    case 'SET_NOTIF_WATER': return { ...state, notifWater: action.value };
    case 'SET_NOTIF_SLEEP': return { ...state, notifSleep: action.value };
    case 'SET_NOTIF_HABITS': return { ...state, notifHabits: action.value };
    case 'SET_NOTIF_INSIGHT': return { ...state, notifInsight: action.value };
    case 'SET_WATER_INTERVAL': return { ...state, waterInterval: action.value };
    case 'HYDRATE': return { ...state, ...action.data };
    default: return state;
  }
};

const AuroraContext = createContext(null);

export const AuroraProvider = ({ children, user: authUser }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem('aurora_health_state').then(saved => {
      if (saved) {
        try { dispatch({ type: 'HYDRATE', data: JSON.parse(saved) }); } catch {}
      }
    });
  }, []);

  // Sync auth user into store so profile name = registered name
  useEffect(() => {
    if (authUser?.full_name) {
      dispatch({ type: 'SET_USER', data: { name: authUser.full_name, email: authUser.email } });
    }
  }, [authUser?.full_name]);

  useEffect(() => {
    AsyncStorage.setItem('aurora_health_state', JSON.stringify(state));
  }, [state]);

  const waterPct = Math.round((state.waterMl / state.goals.water) * 100);
  const habitsDone = state.habits.filter(h => h.done).length;
  const habitsTotal = state.habits.length;
  const habitPct = Math.round((habitsDone / habitsTotal) * 100);
  const sleepPct = Math.round((state.sleepHours / state.goals.sleep) * 100);
  const calPct = Math.round((state.calories / state.goals.calories) * 100);
  const overallScore = Math.round(waterPct * 0.4 + habitPct * 0.3 + sleepPct * 0.2 + calPct * 0.1);

  return (
    <AuroraContext.Provider value={{ state, dispatch, waterPct, habitsDone, habitsTotal, habitPct, sleepPct, calPct, overallScore }}>
      {children}
    </AuroraContext.Provider>
  );
};

export const useAurora = () => useContext(AuroraContext);
