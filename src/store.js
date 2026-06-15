import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: { name: '', age: null, weight: null, height: null, email: '' },
  goals: { water: 2500, sleep: 8, calories: 2000 },
  waterMl: 0,
  waterLog: [],
  sleepHours: 0,
  sleepQuality: 0,
  sleepLogs: [
    { day: 'Mon', hours: 0 }, { day: 'Tue', hours: 0 },
    { day: 'Wed', hours: 0 }, { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 0 }, { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 },
  ],
  habits: [],
  calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
  meals: [],
  dayStreak: 0, waterStreak: 0, auroraScore: 0,
  notifWater: true, notifSleep: true, notifHabits: true, notifInsight: true,
  waterInterval: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.data } };
    case 'SET_GOALS':
      return { ...state, goals: { ...state.goals, ...action.data } };
    case 'ADD_WATER': {
      const newMl = Math.min(state.waterMl + action.ml, state.goals.water);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { ...state, waterMl: newMl, waterLog: [...state.waterLog, { label: 'Water 💧', ml: action.ml, time: now }] };
    }
    case 'LOG_SLEEP':
      return {
        ...state,
        sleepHours: action.hours,
        sleepQuality: action.quality || 0,
        sleepLogs: state.sleepLogs.map((l, i) => i === 6 ? { ...l, hours: action.hours } : l),
      };
    case 'LOG_MEAL':
      return {
        ...state,
        meals: [...state.meals, action.meal],
        calories: state.calories + (action.meal.kcal || 0),
        protein: state.protein + (action.meal.protein || 0),
        carbs: state.carbs + (action.meal.carbs || 0),
        fat: state.fat + (action.meal.fat || 0),
        fiber: state.fiber + (action.meal.fiber || 0),
      };
    case 'TOGGLE_HABIT':
      return { ...state, habits: state.habits.map(h => h.id === action.id ? { ...h, done: !h.done } : h) };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, { id: Date.now(), name: action.name, duration: action.duration || 'Daily', done: false, streak: 0 }] };
    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter(h => h.id !== action.id) };
    case 'SET_NOTIF_WATER': return { ...state, notifWater: action.value };
    case 'SET_NOTIF_SLEEP': return { ...state, notifSleep: action.value };
    case 'SET_NOTIF_HABITS': return { ...state, notifHabits: action.value };
    case 'SET_NOTIF_INSIGHT': return { ...state, notifInsight: action.value };
    case 'SET_WATER_INTERVAL': return { ...state, waterInterval: action.value };
    case 'RESET_ALL':
      return { ...initialState };
    case 'HYDRATE':
      return { ...state, ...action.data };
    default:
      return state;
  }
};

const AuroraContext = createContext(null);

export const AuroraProvider = ({ children, user: authUser }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem('aurora_v3_state').then(saved => {
      if (saved) {
        try { dispatch({ type: 'HYDRATE', data: JSON.parse(saved) }); } catch {}
      }
    });
  }, []);

  useEffect(() => {
    if (authUser?.full_name) {
      dispatch({ type: 'SET_USER', data: { name: authUser.full_name, email: authUser.email || '' } });
    }
  }, [authUser?.full_name]);

  useEffect(() => {
    AsyncStorage.setItem('aurora_v3_state', JSON.stringify(state));
  }, [state]);

  const waterPct = state.goals.water > 0 ? Math.round((state.waterMl / state.goals.water) * 100) : 0;
  const habitsDone = state.habits.filter(h => h.done).length;
  const habitsTotal = state.habits.length;
  const habitPct = habitsTotal > 0 ? Math.round((habitsDone / habitsTotal) * 100) : 0;
  const sleepPct = state.goals.sleep > 0 ? Math.round((state.sleepHours / state.goals.sleep) * 100) : 0;
  const calPct = state.goals.calories > 0 ? Math.round((state.calories / state.goals.calories) * 100) : 0;
  const overallScore = Math.round(waterPct * 0.4 + habitPct * 0.3 + sleepPct * 0.2 + calPct * 0.1);

  return (
    <AuroraContext.Provider value={{ state, dispatch, waterPct, habitsDone, habitsTotal, habitPct, sleepPct, calPct, overallScore }}>
      {children}
    </AuroraContext.Provider>
  );
};

export const useAurora = () => useContext(AuroraContext);
