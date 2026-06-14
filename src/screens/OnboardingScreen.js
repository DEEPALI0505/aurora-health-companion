import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    icon: '🌿', label: 'WELCOME',
    title: 'Understand yourself\n', accent: 'better', end: ' every day.',
    sub: 'Your intelligent health companion that learns, guides, and grows with you.',
    accentColor: '#00C4A7',
    btnColors: ['#00F5D4', '#00C4A7'],
    orb1: 'rgba(0,245,212,0.18)', orb2: 'rgba(177,151,252,0.12)',
  },
  {
    icon: '💧', label: 'TRACK',
    title: 'Every drop,\nevery hour of ', accent: 'rest.', end: '',
    sub: 'Track hydration, sleep, habits, and nutrition — all in one place.',
    accentColor: '#3B8BF5',
    btnColors: ['#74C0FC', '#3B8BF5'],
    orb1: 'rgba(116,192,252,0.2)', orb2: 'rgba(0,245,212,0.1)',
  },
  {
    icon: '✨', label: 'INSIGHTS',
    title: 'Insights that\n', accent: 'actually', end: ' make sense.',
    sub: 'Personalized daily insights powered by your own health data.',
    accentColor: '#8B5CF6',
    btnColors: ['#B197FC', '#8B5CF6'],
    orb1: 'rgba(177,151,252,0.2)', orb2: 'rgba(255,143,171,0.12)',
  },
  {
    icon: '🔥', label: 'HABITS',
    title: 'Small steps,\n', accent: 'lasting', end: ' change.',
    sub: 'Build healthier routines through daily consistency and gentle nudges.',
    accentColor: '#F43F5E',
    btnColors: ['#FF8FAB', '#F43F5E'],
    orb1: 'rgba(255,143,171,0.18)', orb2: 'rgba(255,217,125,0.12)',
  },
  {
    icon: '🧠', label: 'MEMORY',
    title: 'Aurora ', accent: 'learns', end: '\nyour patterns.',
    sub: 'The more you use it, the more personal and precise it becomes.',
    accentColor: '#F59E0B',
    btnColors: ['#FFD97D', '#F59E0B'],
    orb1: 'rgba(255,217,125,0.2)', orb2: 'rgba(177,151,252,0.12)',
  },
];

export default function OnboardingScreen({ onDone }) {
  const [cur, setCur] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const autoRef = useRef(null);

  useEffect(() => {
    autoRef.current = setInterval(() => {
      if (cur < slides.length - 1) animNext(cur + 1);
    }, 3200);
    return () => clearInterval(autoRef.current);
  }, [cur]);

  const animNext = (next) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setCur(next);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]).start();
    });
  };

  const goNext = () => {
    clearInterval(autoRef.current);
    if (cur < slides.length - 1) {
      animNext(cur + 1);
    } else {
      finish();
    }
  };

  const finish = async () => {
    clearInterval(autoRef.current);
    await AsyncStorage.setItem('aurora_onboarding_done', 'true');
    onDone();
  };

  const slide = slides[cur];

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={s.whiteBg} />
      <View style={[s.orb, { backgroundColor: slide.orb1, top: -80, right: -60, width: 320, height: 320 }]} />
      <View style={[s.orb, { backgroundColor: slide.orb2, bottom: 120, left: -80, width: 280, height: 280 }]} />

      <SafeAreaView style={s.safe}>
        <Animated.View style={[s.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient colors={[slide.btnColors[0] + '33', slide.btnColors[1] + '22']} style={s.logoBox} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={s.logoIcon}>{slide.icon}</Text>
          </LinearGradient>
          <Text style={s.label}>{slide.label}</Text>
          <Text style={s.title}>
            {slide.title}
            <Text style={[s.titleAccent, { color: slide.accentColor }]}>{slide.accent}</Text>
            {slide.end}
          </Text>
          <Text style={s.sub}>{slide.sub}</Text>
        </Animated.View>

        <View style={s.bottom}>
          {/* Dots */}
          <View style={s.dots}>
            {slides.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => { clearInterval(autoRef.current); setCur(i); }}>
                <LinearGradient
                  colors={i === cur ? slide.btnColors : ['#DDDDDD', '#DDDDDD']}
                  style={[s.dot, { width: i === cur ? 24 : 8 }]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Colored gradient button */}
          <TouchableOpacity onPress={goNext} activeOpacity={0.88}>
            <LinearGradient
              colors={slide.btnColors}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.mainBtn}
            >
              <Text style={s.mainBtnText}>
                {cur === slides.length - 1 ? 'Get Started 🚀' : 'Next →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={finish} style={s.skipBtn}>
            <Text style={s.skipText}>Skip intro</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  whiteBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F8F9FF' },
  orb: { position: 'absolute', borderRadius: 200 },
  safe: { flex: 1, justifyContent: 'space-between', padding: 32, paddingTop: 20 },
  content: { flex: 1, justifyContent: 'center', paddingTop: 50 },
  logoBox: { width: 74, height: 74, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  logoIcon: { fontSize: 32 },
  label: { fontSize: 11, letterSpacing: 2.5, color: '#BBBBBB', fontWeight: '700', marginBottom: 12 },
  title: { fontSize: 38, fontWeight: '700', color: '#0A0618', lineHeight: 48, marginBottom: 16 },
  titleAccent: { fontWeight: '700' },
  sub: { fontSize: 16, color: '#777', lineHeight: 26, maxWidth: 290 },
  bottom: { gap: 14 },
  dots: { flexDirection: 'row', gap: 7, alignItems: 'center', marginBottom: 4 },
  dot: { height: 6, borderRadius: 3 },
  mainBtn: { borderRadius: 18, paddingVertical: 18, alignItems: 'center', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  mainBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { color: '#BBBBBB', fontSize: 14 },
});
