// ─────────────────────────────────────────
// Water Screen
// ─────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Defs, ClipPath, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors } from '../theme';
import { SectionLabel, ProgressBar } from '../components';
import { useAurora } from '../store';

const { width } = Dimensions.get('window');
const BARS_WATER = [65, 90, 74, 55, 100, 80, 70];
const DAYS = ['M','T','W','T','F','S','Su'];

export function WaterScreen({ navigation }) {
  const { state, dispatch, waterPct } = useAurora();
  const [custom, setCustom] = useState('');

  const add = async (ml) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch({ type: 'ADD_WATER', ml });
  };

  const bottleH = Math.round((state.waterMl / state.goals.water) * 100);

  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.bg, '#130b2e', '#0a1020']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(116,192,252,0.3)', top: -80, right: -40 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}>
            <Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={ss.title}>💧 Hydration</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <BlurView intensity={50} tint="dark" style={ss.card}>
            <View style={ss.cardShine} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12 }}>
              {/* Bottle SVG */}
              <Svg width={80} height={140} viewBox="0 0 90 148">
                <Defs>
                  <ClipPath id="bc">
                    <Path d="M28 12 Q18 12 14 22 L6 40 L6 130 Q6 140 16 140 L74 140 Q84 140 84 130 L84 40 L76 22 Q72 12 62 12 Z" />
                  </ClipPath>
                  <SvgGrad id="wg" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="rgba(116,192,252,0.9)" />
                    <Stop offset="100%" stopColor="rgba(116,192,252,0.45)" />
                  </SvgGrad>
                </Defs>
                <Path d="M28 12 Q18 12 14 22 L6 40 L6 130 Q6 140 16 140 L74 140 Q84 140 84 130 L84 40 L76 22 Q72 12 62 12 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(116,192,252,0.35)" strokeWidth="1.5" />
                <Rect x="6" y="40" width="78" height="100" fill="rgba(116,192,252,0.07)" clipPath="url(#bc)" />
                <Rect x="6" y={140 - (bottleH / 100) * 100} width="78" height={(bottleH / 100) * 100} fill="url(#wg)" clipPath="url(#bc)" />
              </Svg>
              <View style={{ alignItems: 'center' }}>
                <Text style={[ss.bigNum, { color: Colors.blue }]}>{state.waterMl.toLocaleString()}</Text>
                <Text style={ss.bigSub}>of {state.goals.water.toLocaleString()} ml</Text>
                <Text style={[ss.pctText, { color: Colors.teal }]}>{waterPct}%</Text>
                <ProgressBar percent={waterPct} color={Colors.blue} style={{ width: 140 }} />
              </View>
            </View>
            <View style={ss.quickRow}>
              {[150, 250, 350, 500].map(ml => (
                <TouchableOpacity key={ml} onPress={() => add(ml)} style={ss.quickBtn}>
                  <Text style={ss.quickBtnText}>+{ml} ml</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={ss.customRow}>
              <TextInput
                value={custom}
                onChangeText={setCustom}
                placeholder="Custom ml"
                placeholderTextColor={Colors.text3}
                keyboardType="numeric"
                style={ss.customInput}
              />
              <TouchableOpacity onPress={() => { if (custom) { add(parseInt(custom)); setCustom(''); }}} style={ss.customBtn}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </BlurView>

          <SectionLabel style={{ marginVertical: 10 }}>📊 Weekly trend</SectionLabel>
          <BlurView intensity={50} tint="dark" style={ss.card}>
            <View style={ss.cardShine} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 72, marginBottom: 8, paddingTop: 8 }}>
              {BARS_WATER.map((v, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                  <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
                    <LinearGradient colors={[Colors.blue, Colors.blue + '66']} style={[{ width: '100%', borderRadius: 4, height: `${v}%` }]} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} />
                  </View>
                  <Text style={ss.barDay}>{DAYS[i]}</Text>
                </View>
              ))}
            </View>
          </BlurView>

          <SectionLabel style={{ marginVertical: 10 }}>📋 Today's log</SectionLabel>
          <BlurView intensity={50} tint="dark" style={ss.card}>
            <View style={ss.cardShine} />
            {state.waterLog.map((item, i) => (
              <View key={i} style={[ss.logRow, i < state.waterLog.length - 1 && ss.logBorder]}>
                <Text style={ss.logLabel}>{item.label}</Text>
                <Text style={[ss.logVal, { color: Colors.blue }]}>+{item.ml}ml · {item.time}</Text>
              </View>
            ))}
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// Sleep Screen
// ─────────────────────────────────────────
export function SleepScreen({ navigation }) {
  const { state, sleepPct } = useAurora();
  const BARS = state.sleepLogs.map(l => Math.round((l.hours / 8) * 100));
  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.bg, '#130b2e', '#0a1020']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(177,151,252,0.3)', top: -80, right: -40 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}><Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text></TouchableOpacity>
          <Text style={ss.title}>🌙 Sleep</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <BlurView intensity={50} tint="dark" style={ss.card}>
            <View style={ss.cardShine} />
            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              <Text style={[ss.bigNum, { color: Colors.violet, fontSize: 52 }]}>6:45</Text>
              <Text style={ss.bigSub}>hours · last night</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <BlurView intensity={30} tint="dark" style={ss.sleepBadge}><Text style={{ color: Colors.violet, fontSize: 12, fontWeight: '600' }}>82% Quality</Text></BlurView>
                <BlurView intensity={30} tint="dark" style={ss.sleepBadge}><Text style={{ color: Colors.text2, fontSize: 12 }}>11:15 → 6:00</Text></BlurView>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 72, marginBottom: 8 }}>
              {BARS.map((v, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                  <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
                    <LinearGradient colors={[Colors.violet, Colors.violet + '66']} style={{ width: '100%', borderRadius: 4, height: `${v}%`, borderWidth: i === 6 ? 1.5 : 0, borderColor: Colors.violet }} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} />
                  </View>
                  <Text style={ss.barDay}>{['M','T','W','T','F','S','Su'][i]}</Text>
                </View>
              ))}
            </View>
          </BlurView>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            {[
              { val: '7h 22m', label: 'Weekly avg', color: Colors.violet },
              { val: '82%', label: 'Consistency', color: Colors.teal },
              { val: '11 PM', label: 'Avg bedtime', color: Colors.amber },
            ].map((s, i) => (
              <BlurView key={i} intensity={40} tint="dark" style={{ flex: 1, borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.glassBorder, overflow: 'hidden' }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: s.color }}>{s.val}</Text>
                <Text style={ss.bigSub}>{s.label}</Text>
              </BlurView>
            ))}
          </View>
          <BlurView intensity={50} tint="dark" style={[ss.card, { marginTop: 12 }]}>
            <View style={ss.cardShine} />
            <Text style={{ color: Colors.text, fontWeight: '600', marginBottom: 8 }}>💡 Insight</Text>
            <Text style={{ color: Colors.text2, fontSize: 13, lineHeight: 20 }}>You sleep better when you go to bed before 11 PM. Last week your average improved by 18 minutes. Keep it up!</Text>
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// Habits Screen
// ─────────────────────────────────────────
export function HabitsScreen({ navigation }) {
  const { state, dispatch, habitsDone, habitsTotal, habitPct } = useAurora();
  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.bg, '#130b2e', '#0a1020']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(0,245,212,0.22)', top: -80, right: -40 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}><Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text></TouchableOpacity>
          <Text style={ss.title}>⚡ Habits</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <BlurView intensity={50} tint="dark" style={ss.card}>
            <View style={ss.cardShine} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
              <View style={{ alignItems: 'center' }}><Text style={[ss.bigNum, { color: Colors.teal }]}>{habitsDone}</Text><Text style={ss.bigSub}>Done</Text></View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
              <View style={{ alignItems: 'center' }}><Text style={[ss.bigNum, { color: Colors.text2 }]}>{habitsTotal - habitsDone}</Text><Text style={ss.bigSub}>Left</Text></View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
              <View style={{ alignItems: 'center' }}><Text style={[ss.bigNum, { color: Colors.amber }]}>🔥21</Text><Text style={ss.bigSub}>Best</Text></View>
            </View>
            <ProgressBar percent={habitPct} color={Colors.teal} />
          </BlurView>
          <View style={{ marginTop: 12, gap: 8 }}>
            {state.habits.map(h => (
              <TouchableOpacity key={h.id} onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                dispatch({ type: 'TOGGLE_HABIT', id: h.id });
              }} activeOpacity={0.85}>
                <BlurView intensity={40} tint="dark" style={ss.habitRow}>
                  <View style={[ss.habCheck, h.done && { backgroundColor: Colors.teal, borderColor: Colors.teal }]}>
                    {h.done && <Text style={{ fontSize: 12, color: '#060918' }}>✓</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[ss.habName, h.done && { textDecorationLine: 'line-through', opacity: 0.5 }]}>{h.name}</Text>
                    <Text style={ss.habDur}>{h.duration} · Daily</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: h.streak > 0 ? Colors.amber : Colors.text3 }}>
                    {h.streak > 0 ? `🔥${h.streak}` : `${h.streak} days`}
                  </Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// Nutrition Screen
// ─────────────────────────────────────────
export function NutritionScreen({ navigation }) {
  const { state, calPct } = useAurora();
  const macros = [
    { label: 'Protein', val: `${state.protein}g`, pct: 54, color: Colors.rose },
    { label: 'Carbs', val: `${state.carbs}g`, pct: 71, color: Colors.teal },
    { label: 'Fat', val: `${state.fat}g`, pct: 48, color: Colors.blue },
    { label: 'Fiber', val: `${state.fiber}g`, pct: 72, color: Colors.violet },
  ];
  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.bg, '#130b2e', '#0a1020']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(255,217,125,0.25)', top: -80, right: -40 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}><Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text></TouchableOpacity>
          <Text style={ss.title}>🥗 Nutrition</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <BlurView intensity={50} tint="dark" style={ss.card}>
            <View style={ss.cardShine} />
            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <Text style={[ss.bigNum, { color: Colors.amber, fontSize: 44 }]}>{state.calories.toLocaleString()}</Text>
              <Text style={ss.bigSub}>of {state.goals.calories.toLocaleString()} kcal · {calPct}%</Text>
              <ProgressBar percent={calPct} color={Colors.amber} style={{ width: '80%', marginTop: 8 }} />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {macros.map(m => (
                <BlurView key={m.label} intensity={30} tint="dark" style={{ width: (width - 60) / 2, borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)', overflow: 'hidden' }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: m.color }}>{m.val}</Text>
                  <Text style={ss.bigSub}>{m.label}</Text>
                  <ProgressBar percent={m.pct} color={m.color} />
                </BlurView>
              ))}
            </View>
          </BlurView>
          <SectionLabel style={{ marginVertical: 10 }}>🍽️ Today's meals</SectionLabel>
          <BlurView intensity={50} tint="dark" style={ss.card}>
            <View style={ss.cardShine} />
            {state.meals.map((m, i) => (
              <View key={i} style={[ss.mealRow, i < state.meals.length - 1 && ss.logBorder]}>
                <View><Text style={{ fontSize: 13, fontWeight: '500', color: Colors.text }}>{m.type}</Text><Text style={ss.bigSub}>{m.food}</Text></View>
                <Text style={{ fontSize: 13, color: Colors.amber }}>{m.kcal} kcal</Text>
              </View>
            ))}
            <View style={[ss.mealRow, { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed', borderRadius: 14, marginTop: 8 }]}>
              <Text style={{ color: Colors.text3, fontSize: 13 }}>+ Log dinner</Text>
            </View>
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// Notifications Screen
// ─────────────────────────────────────────
import { scheduleWaterReminders, scheduleSleepReminder, scheduleHabitReminders, scheduleDailyInsight, sendTestNotification } from '../notifications';

export function NotificationsScreen({ navigation }) {
  const { state, dispatch } = useAurora();

  const handleWaterToggle = async () => {
    const next = !state.notifWater;
    dispatch({ type: 'SET_NOTIF_WATER', value: next });
    await scheduleWaterReminders(state.waterInterval, next);
  };
  const handleSleepToggle = async () => {
    const next = !state.notifSleep;
    dispatch({ type: 'SET_NOTIF_SLEEP', value: next });
    await scheduleSleepReminder(next);
  };
  const handleHabitToggle = async () => {
    const next = !state.notifHabits;
    dispatch({ type: 'SET_NOTIF_HABITS', value: next });
    await scheduleHabitReminders(next);
  };
  const handleInsightToggle = async () => {
    const next = !state.notifInsight;
    dispatch({ type: 'SET_NOTIF_INSIGHT', value: next });
    await scheduleDailyInsight(next);
  };
  const handleInterval = async (hrs) => {
    dispatch({ type: 'SET_WATER_INTERVAL', value: hrs });
    if (state.notifWater) await scheduleWaterReminders(hrs, true);
  };

  const ivBody = { 1: "Stay hydrated. 750ml away!", 2: "Time for your water break!", 3: "Don't forget to hydrate." };

  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.bg, '#130b2e', '#0a1020']} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}><Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text></TouchableOpacity>
          <Text style={ss.title}>🔔 Notifications</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Water */}
          <BlurView intensity={50} tint="dark" style={[ss.card, { marginBottom: 12, borderColor: Colors.blue + '33' }]}>
            <LinearGradient colors={['rgba(116,192,252,0.1)', 'rgba(116,192,252,0.04)']} style={StyleSheet.absoluteFillObject} />
            <View style={ss.cardShine} />
            <View style={ss.notifTop}>
              <BlurView intensity={30} tint="dark" style={[ss.notifIcon, { borderColor: Colors.blue + '44' }]}><Text>💧</Text></BlurView>
              <View style={{ flex: 1 }}><Text style={ss.notifTitle}>Water reminders</Text><Text style={ss.bigSub}>Customizable interval</Text></View>
              <TouchableOpacity onPress={handleWaterToggle}>
                <View style={[ss.tog, { backgroundColor: state.notifWater ? Colors.teal : 'rgba(255,255,255,0.15)' }]}>
                  <View style={[ss.togKnob, { left: state.notifWater ? 22 : 2 }]} />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={[ss.bigSub, { marginBottom: 8, marginTop: 12 }]}>REMINDER INTERVAL</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {[1, 2, 3].map(h => (
                <TouchableOpacity key={h} onPress={() => handleInterval(h)} style={[ss.ivBtn, state.waterInterval === h && { backgroundColor: Colors.teal + '25', borderColor: Colors.teal + '66' }]}>
                  <Text style={[ss.ivBtnText, { color: state.waterInterval === h ? Colors.teal : Colors.text2 }]}>Every {h} hr{h > 1 ? 's' : ''}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Preview */}
            <BlurView intensity={40} tint="dark" style={ss.notifPreview}>
              <View style={[ss.notifIcon, { backgroundColor: Colors.blue + '22', borderColor: Colors.blue + '33' }]}><Text>💧</Text></View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text }}>Aurora · Health</Text>
                  <Text style={ss.bigSub}>now</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text, marginTop: 2 }}>Time to drink water 💧</Text>
                <Text style={[ss.bigSub, { marginTop: 1 }]}>{ivBody[state.waterInterval]}</Text>
              </View>
            </BlurView>
            <TouchableOpacity onPress={sendTestNotification} style={ss.testBtn}>
              <LinearGradient colors={['rgba(177,151,252,0.85)', 'rgba(0,245,212,0.7)']} style={ss.testBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>🔔 Test notification</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
          {/* Sleep, Habits, Insight */}
          {[
            { icon: '🌙', title: 'Sleep reminder', sub: 'Bedtime wind-down', val: state.notifSleep, toggle: handleSleepToggle, color: Colors.violet,
              rows: [{ l: 'Bedtime reminder', r: '10:30 PM', c: Colors.violet }, { l: 'Wind-down alert', r: '30 min before', c: Colors.violet }] },
            { icon: '⚡', title: 'Habit reminders', sub: 'Daily nudges', val: state.notifHabits, toggle: handleHabitToggle, color: Colors.teal,
              rows: [{ l: 'Morning habits', r: '7:00 AM', c: Colors.teal }, { l: 'Evening habits', r: '8:00 PM', c: Colors.teal }, { l: 'Streak alerts', r: 'On', c: Colors.teal }] },
            { icon: '✦', title: 'Daily insight', sub: 'Morning briefing · 8:00 AM', val: state.notifInsight, toggle: handleInsightToggle, color: Colors.amber, rows: [] },
          ].map((item, idx) => (
            <BlurView key={idx} intensity={50} tint="dark" style={[ss.card, { marginBottom: 12 }]}>
              <View style={ss.cardShine} />
              <View style={ss.notifTop}>
                <BlurView intensity={30} tint="dark" style={[ss.notifIcon, { borderColor: item.color + '44' }]}><Text>{item.icon}</Text></BlurView>
                <View style={{ flex: 1 }}><Text style={ss.notifTitle}>{item.title}</Text><Text style={ss.bigSub}>{item.sub}</Text></View>
                <TouchableOpacity onPress={item.toggle}>
                  <View style={[ss.tog, { backgroundColor: item.val ? item.color : 'rgba(255,255,255,0.15)' }]}>
                    <View style={[ss.togKnob, { left: item.val ? 22 : 2 }]} />
                  </View>
                </TouchableOpacity>
              </View>
              {item.rows.map((r, ri) => (
                <View key={ri} style={[ss.twRow, ri < item.rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' }]}>
                  <Text style={{ fontSize: 13, color: Colors.text2 }}>{r.l}</Text>
                  <Text style={{ fontSize: 13, color: r.c }}>{r.r}</Text>
                </View>
              ))}
            </BlurView>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// AI Screen
// ─────────────────────────────────────────
export function AIScreen({ navigation }) {
  const { state, dispatch, waterPct, habitPct } = useAurora();
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hey ${state.user.name}! 👋 Habits are ${state.habits.filter(h=>h.done).length}/${state.habits.length} done. Hydration at ${waterPct}% — need ${state.goals.water - state.waterMl}ml more. How are you feeling?`, time: '9:14 AM' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = React.useRef(null);

  const RESPONSES = {
    water: 'Added! 💧 Hydration updated — closer to your daily goal!',
    sleep: 'Sleep logged! 🌙 Solid rest. Consistent sleep is your superpower.',
    habit: 'Habit noted! ⚡ Consistency is magic. Keep going!',
    week: `Your week 📊: Hydration ${waterPct}%, habits ${habitPct}% complete. Aurora Score ${state.auroraScore} — trending up! 🔥`,
    focus: 'Finish your evening walk tonight — last habit + improves sleep quality. Two wins! 🌿',
    default: ['Got it! Aurora logged that. Keep going 🌿', 'Noted! Great momentum today ✨', 'Done! Small steps = big wins 🌱'],
  };

  const send = async (txt) => {
    const msg = txt || input.trim();
    if (!msg) return;
    setInput('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { role: 'user', text: msg, time: now }]);
    const lo = msg.toLowerCase();
    let rep;
    if (lo.includes('water') || lo.includes('ml') || lo.includes('drink')) {
      rep = RESPONSES.water;
      const match = msg.match(/(\d+)/);
      if (match) dispatch({ type: 'ADD_WATER', ml: parseInt(match[1]) });
    } else if (lo.includes('sleep') || lo.includes('slept')) rep = RESPONSES.sleep;
    else if (lo.includes('habit') && (lo.includes('creat') || lo.includes('journal'))) rep = RESPONSES.habit;
    else if (lo.includes('week') || lo.includes('doing')) rep = RESPONSES.week;
    else if (lo.includes('focus') || lo.includes('today')) rep = RESPONSES.focus;
    else rep = RESPONSES.default[Math.floor(Math.random() * 3)];
    setTimeout(() => {
      setMessages(m => [...m, { role: 'bot', text: rep, time: now }]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

  const CHIPS = ['How am I doing this week?', 'I slept 8 hours', 'Focus tip', 'I drank 300ml of water', 'New habit'];

  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.bg, '#130b2e', '#0a1020']} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[ss.header, { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.12)' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}><Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text></TouchableOpacity>
          <BlurView intensity={40} tint="dark" style={ss.aiAvatar}><Text style={{ fontSize: 17 }}>🌿</Text></BlurView>
          <View><Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text }}>Aurora AI</Text><Text style={{ fontSize: 10, color: Colors.teal }}>● Online · Health companion</Text></View>
        </View>
        <ScrollView ref={scrollRef} style={{ flex: 1, padding: 14 }} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {messages.map((m, i) => (
            <View key={i} style={[{ marginBottom: 10 }, m.role === 'user' ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
              <BlurView intensity={40} tint="dark" style={[ss.bubble, m.role === 'user' ? ss.bubbleUser : ss.bubbleBot]}>
                {m.role === 'bot' && <View style={ss.cardShine} />}
                <Text style={{ fontSize: 13, color: Colors.text, lineHeight: 20 }}>{m.text}</Text>
              </BlurView>
              <Text style={[ss.bigSub, { marginTop: 4, paddingHorizontal: 4 }]}>{m.time}</Text>
            </View>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}>
          {CHIPS.map(c => <TouchableOpacity key={c} onPress={() => send(c)}><BlurView intensity={40} tint="dark" style={ss.chip}><Text style={{ fontSize: 12, color: Colors.text2 }}>{c}</Text></BlurView></TouchableOpacity>)}
        </ScrollView>
        <View style={ss.inputRow}>
          <BlurView intensity={40} tint="dark" style={ss.inputWrap}>
            <TextInput value={input} onChangeText={setInput} placeholder="Ask Aurora anything…" placeholderTextColor={Colors.text3} style={ss.input} onSubmitEditing={() => send()} returnKeyType="send" />
          </BlurView>
          <TouchableOpacity onPress={() => send()} activeOpacity={0.85}>
            <LinearGradient colors={['rgba(177,151,252,0.85)', 'rgba(116,192,252,0.75)']} style={ss.sendBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// Profile Screen
// ─────────────────────────────────────────
export function ProfileScreen({ navigation, user, onLogout }) {
  const { state } = useAurora();
  // Use auth user name if available, fallback to store
  const displayName = user?.full_name || state.user.name || 'User';
  const displayEmail = user?.email || state.user.email || '';
  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.bg, '#130b2e', '#0a1020']} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}><Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text></TouchableOpacity>
          <Text style={ss.title}>Profile</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <BlurView intensity={40} tint="dark" style={ss.profileAvatar}><Text style={{ fontSize: 30 }}>👤</Text></BlurView>
            <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.text, marginTop: 10 }}>{state.user.name} Johnson</Text>
            <Text style={ss.bigSub}>{state.user.email}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <BlurView intensity={30} tint="dark" style={[ss.badgePill, { borderColor: Colors.amber + '44' }]}><Text style={{ color: Colors.amber, fontSize: 12, fontWeight: '600' }}>🔥 {state.dayStreak} streak</Text></BlurView>
              <BlurView intensity={30} tint="dark" style={[ss.badgePill, { borderColor: Colors.teal + '44' }]}><Text style={{ color: Colors.teal, fontSize: 12, fontWeight: '600' }}>⭐ Score {state.auroraScore}</Text></BlurView>
            </View>
          </View>
          {[
            { label: 'Personal info', rows: [{ l: '🎂 Age', r: `${state.user.age} years` }, { l: '⚖️ Weight', r: `${state.user.weight} kg` }, { l: '📏 Height', r: `${state.user.height} cm` }] },
            { label: 'Goals', rows: [{ l: '💧 Water goal', r: `${state.goals.water.toLocaleString()} ml`, c: Colors.blue }, { l: '🌙 Sleep target', r: `${state.goals.sleep} hours`, c: Colors.violet }, { l: '🎯 Focus', r: 'Sleep better', c: Colors.teal }] },
          ].map((sec, si) => (
            <View key={si} style={{ marginBottom: 12 }}>
              <SectionLabel style={{ marginBottom: 8 }}>{sec.label}</SectionLabel>
              <BlurView intensity={50} tint="dark" style={ss.card}>
                <View style={ss.cardShine} />
                {sec.rows.map((r, ri) => (
                  <View key={ri} style={[ss.twRow, ri < sec.rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' }]}>
                    <Text style={{ fontSize: 13, color: Colors.text2 }}>{r.l}</Text>
                    <Text style={{ fontSize: 13, color: r.c || Colors.text }}>{r.r}</Text>
                  </View>
                ))}
              </BlurView>
            </View>
          ))}
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} activeOpacity={0.85}>
            <LinearGradient colors={['rgba(177,151,252,0.85)', 'rgba(0,245,212,0.7)']} style={ss.profileBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>🔔 Manage notifications</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────
const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  orb: { position: 'absolute', width: 280, height: 280, borderRadius: 200, opacity: 0.5 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text },
  card: { borderRadius: 22, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', overflow: 'hidden', marginBottom: 2 },
  cardShine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', zIndex: 1 },
  bigNum: { fontSize: 44, fontWeight: '700', color: Colors.text },
  bigSub: { fontSize: 11, color: Colors.text3, marginTop: 2 },
  pctText: { fontSize: 14, fontWeight: '600', marginTop: 6 },
  quickRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 },
  quickBtn: { backgroundColor: 'rgba(116,192,252,0.12)', borderWidth: 1, borderColor: 'rgba(116,192,252,0.25)', borderRadius: 50, paddingHorizontal: 16, paddingVertical: 8 },
  quickBtnText: { color: Colors.blue, fontSize: 12, fontWeight: '600' },
  customRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  customInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, color: Colors.text, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  customBtn: { backgroundColor: Colors.teal, borderRadius: 14, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  barDay: { fontSize: 9, color: Colors.text3 },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9 },
  logBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  logLabel: { fontSize: 13, color: Colors.text },
  logVal: { fontSize: 13 },
  sleepBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  habitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)', overflow: 'hidden' },
  habCheck: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  habName: { fontSize: 14, fontWeight: '500', color: Colors.text },
  habDur: { fontSize: 11, color: Colors.text3, marginTop: 2 },
  mealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  notifTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  notifIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, overflow: 'hidden' },
  notifTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  notifPreview: { borderRadius: 16, padding: 13, flexDirection: 'row', gap: 10, alignItems: 'flex-start', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  testBtn: { marginTop: 12, borderRadius: 14, overflow: 'hidden' },
  testBtnGrad: { padding: 13, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 14 },
  ivBtn: { flex: 1, padding: 10, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  ivBtnText: { fontSize: 12, fontWeight: '600' },
  twRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11 },
  tog: { width: 44, height: 24, borderRadius: 12, position: 'relative', justifyContent: 'center' },
  togKnob: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  aiAvatar: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(177,151,252,0.3)', overflow: 'hidden' },
  bubble: { maxWidth: '84%', padding: 12, borderRadius: 18, overflow: 'hidden' },
  bubbleBot: { borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start' },
  bubbleUser: { borderBottomRightRadius: 4, borderWidth: 1, borderColor: 'rgba(177,151,252,0.28)', backgroundColor: 'rgba(177,151,252,0.15)', alignSelf: 'flex-end' },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', overflow: 'hidden', marginRight: 4 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center', padding: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' },
  inputWrap: { flex: 1, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  input: { padding: 10, paddingHorizontal: 16, color: Colors.text, fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  profileAvatar: { width: 76, height: 76, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(177,151,252,0.35)', overflow: 'hidden' },
  badgePill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  profileBtn: { borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
});
