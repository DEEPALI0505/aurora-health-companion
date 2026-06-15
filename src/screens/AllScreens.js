import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, StatusBar, Alert, Modal
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
const DAYS = ['M','T','W','T','F','S','Su'];

const GLASS = {
  borderRadius: 22, padding: 18, borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.75)', overflow: 'hidden', marginBottom: 2,
};
const SHINE = {
  position: 'absolute', top: 0, left: 0, right: 0,
  height: 1.5, backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 1,
};

// ─────────────────────────────────────────
// Water Screen
// ─────────────────────────────────────────
export function WaterScreen({ navigation }) {
  const { state, dispatch, waterPct } = useAurora();
  const [custom, setCustom] = useState('');
  const bottleH = Math.min(Math.round((state.waterMl / state.goals.water) * 100), 100);

  const add = async (ml) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch({ type: 'ADD_WATER', ml });
  };

  return (
    <View style={ss.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F0F4FF', '#E8EEFF']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(58,143,212,0.20)', top: -80, right: -40 }]} />
      <View style={[ss.orb, { backgroundColor: 'rgba(0,196,167,0.14)', bottom: 100, left: -60 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}>
            <Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={ss.title}>💧 Hydration</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <BlurView intensity={65} tint="light" style={GLASS}>
            <View style={SHINE} />
            <LinearGradient colors={['rgba(58,143,212,0.10)', 'transparent']} style={StyleSheet.absoluteFillObject} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12 }}>
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
                <Path d="M28 12 Q18 12 14 22 L6 40 L6 130 Q6 140 16 140 L74 140 Q84 140 84 130 L84 40 L76 22 Q72 12 62 12 Z" fill="rgba(255,255,255,0.55)" stroke="rgba(116,192,252,0.5)" strokeWidth="1.5" />
                <Rect x="6" y={140 - (bottleH / 100) * 100} width="78" height={(bottleH / 100) * 100} fill="url(#wg)" clipPath="url(#bc)" />
              </Svg>
              <View style={{ alignItems: 'center' }}>
                <Text style={[ss.bigNum, { color: Colors.blue }]}>{state.waterMl > 0 ? state.waterMl.toLocaleString() : '0'}</Text>
                <Text style={ss.bigSub}>of {state.goals.water.toLocaleString()} ml</Text>
                <Text style={[ss.pctText, { color: Colors.teal }]}>{waterPct}%</Text>
                <ProgressBar percent={waterPct} color={Colors.blue} style={{ width: 140 }} />
              </View>
            </View>
            {/* Quick add */}
            <View style={ss.quickRow}>
              {[150, 250, 350, 500].map(ml => (
                <TouchableOpacity key={ml} onPress={() => add(ml)} style={ss.quickBtn}>
                  <Text style={ss.quickBtnText}>+{ml} ml</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Custom input */}
            <View style={ss.customRow}>
              <BlurView intensity={40} tint="light" style={ss.customInputWrap}>
                <TextInput
                  value={custom} onChangeText={setCustom}
                  placeholder="Custom ml..." placeholderTextColor={Colors.text3}
                  keyboardType="numeric" style={ss.customInput}
                />
              </BlurView>
              <TouchableOpacity onPress={() => { if (custom) { add(parseInt(custom)); setCustom(''); }}} style={ss.customBtn}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </BlurView>

          <SectionLabel style={{ marginVertical: 10 }}>📊 Weekly trend</SectionLabel>
          <BlurView intensity={65} tint="light" style={GLASS}>
            <View style={SHINE} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 72, paddingTop: 8, marginBottom: 8 }}>
              {state.sleepLogs.map((_, i) => {
                const v = Math.round(Math.random() * 60 + 30);
                return (
                  <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                    <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
                      <LinearGradient colors={[Colors.blue, Colors.blue + '66']} style={{ width: '100%', borderRadius: 4, height: `${v}%` }} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} />
                    </View>
                    <Text style={ss.barDay}>{DAYS[i]}</Text>
                  </View>
                );
              })}
            </View>
          </BlurView>

          <SectionLabel style={{ marginVertical: 10 }}>📋 Today's log</SectionLabel>
          <BlurView intensity={65} tint="light" style={GLASS}>
            <View style={SHINE} />
            {state.waterLog.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 24, marginBottom: 8 }}>💧</Text>
                <Text style={{ fontSize: 13, color: Colors.text3, textAlign: 'center' }}>No entries yet{'\n'}Tap a button above to log water!</Text>
              </View>
            ) : (
              state.waterLog.map((item, i) => (
                <View key={i} style={[ss.logRow, i < state.waterLog.length - 1 && ss.logBorder]}>
                  <Text style={ss.logLabel}>{item.label}</Text>
                  <Text style={[ss.logVal, { color: Colors.blue }]}>+{item.ml}ml · {item.time}</Text>
                </View>
              ))
            )}
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// Sleep Screen — with manual log
// ─────────────────────────────────────────
export function SleepScreen({ navigation }) {
  const { state, dispatch, sleepPct } = useAurora();
  const [showLog, setShowLog] = useState(false);
  const [hours, setHours] = useState('');
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const BARS = state.sleepLogs.map(l => l.hours > 0 ? Math.round((l.hours / 8) * 100) : 0);

  const logSleep = () => {
    if (!hours) { Alert.alert('Error', 'Please enter sleep hours'); return; }
    dispatch({ type: 'LOG_SLEEP', hours: parseFloat(hours), quality: 80 });
    setShowLog(false);
    setHours(''); setBedtime(''); setWakeTime('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={ss.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F0F4FF', '#E8EEFF']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(124,92,191,0.20)', top: -80, right: -40 }]} />
      <View style={[ss.orb, { backgroundColor: 'rgba(232,99,122,0.12)', bottom: 100, left: -40 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}>
            <Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={ss.title}>🌙 Sleep</Text>
          {/* Log button top right */}
          <TouchableOpacity onPress={() => setShowLog(true)} style={ss.addIconBtn}>
            <Text style={{ color: Colors.violet, fontWeight: '700', fontSize: 13 }}>+ Log</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <BlurView intensity={65} tint="light" style={GLASS}>
            <View style={SHINE} />
            <LinearGradient colors={['rgba(124,92,191,0.10)', 'transparent']} style={StyleSheet.absoluteFillObject} />
            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              {state.sleepHours > 0 ? (
                <>
                  <Text style={[ss.bigNum, { color: Colors.violet, fontSize: 52 }]}>
                    {Math.floor(state.sleepHours)}:{String(Math.round((state.sleepHours % 1) * 60)).padStart(2,'0')}
                  </Text>
                  <Text style={ss.bigSub}>hours · last night</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                    <BlurView intensity={50} tint="light" style={ss.sleepBadge}>
                      <Text style={{ color: Colors.violet, fontSize: 12, fontWeight: '600' }}>{state.sleepQuality}% Quality</Text>
                    </BlurView>
                  </View>
                </>
              ) : (
                <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                  <Text style={{ fontSize: 36, marginBottom: 8 }}>🌙</Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.text3, marginBottom: 4 }}>No sleep logged</Text>
                  <Text style={{ fontSize: 12, color: Colors.text3, textAlign: 'center', marginBottom: 16 }}>Tap "+ Log" to add your sleep</Text>
                  <TouchableOpacity onPress={() => setShowLog(true)} style={[ss.quickBtn, { backgroundColor: Colors.violet + '20', borderColor: Colors.violet + '44' }]}>
                    <Text style={{ color: Colors.violet, fontWeight: '700', fontSize: 13 }}>+ Log Sleep</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Quick log buttons */}
            <View style={{ marginTop: 8 }}>
              <Text style={[ss.bigSub, { marginBottom: 8, textAlign: 'center' }]}>QUICK LOG</Text>
              <View style={ss.quickRow}>
                {[6, 6.5, 7, 7.5, 8].map(h => (
                  <TouchableOpacity key={h} onPress={() => {
                    dispatch({ type: 'LOG_SLEEP', hours: h, quality: h >= 7 ? 85 : 70 });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }} style={[ss.quickBtn, { borderColor: Colors.violet + '44', backgroundColor: Colors.violet + '12' }]}>
                    <Text style={{ color: Colors.violet, fontSize: 11, fontWeight: '700' }}>{h}h</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bar chart */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 72, marginTop: 16, marginBottom: 8 }}>
              {BARS.map((v, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                  <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
                    {v > 0 ? (
                      <LinearGradient colors={[Colors.violet, Colors.violet + '66']} style={{ width: '100%', borderRadius: 4, height: `${v}%` }} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} />
                    ) : (
                      <View style={{ width: '100%', borderRadius: 4, height: '8%', backgroundColor: 'rgba(0,0,0,0.06)' }} />
                    )}
                  </View>
                  <Text style={ss.barDay}>{DAYS[i]}</Text>
                </View>
              ))}
            </View>
          </BlurView>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            {[
              { val: state.sleepHours > 0 ? `${state.sleepHours}h` : '--', label: 'Last night', color: Colors.violet },
              { val: sleepPct > 0 ? `${sleepPct}%` : '--', label: 'Of goal', color: Colors.teal },
              { val: state.goals.sleep + 'h', label: 'Target', color: Colors.amber },
            ].map((s, i) => (
              <BlurView key={i} intensity={65} tint="light" style={{ flex: 1, borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', overflow: 'hidden' }}>
                <View style={SHINE} />
                <Text style={{ fontSize: 17, fontWeight: '700', color: s.color }}>{s.val}</Text>
                <Text style={ss.bigSub}>{s.label}</Text>
              </BlurView>
            ))}
          </View>

          <BlurView intensity={65} tint="light" style={[GLASS, { marginTop: 12 }]}>
            <View style={SHINE} />
            <Text style={{ color: Colors.text, fontWeight: '600', marginBottom: 8 }}>💡 Insight</Text>
            <Text style={{ color: Colors.text2, fontSize: 13, lineHeight: 20 }}>
              {state.sleepHours >= 7
                ? 'Great sleep! Consistent 7+ hours improves memory and mood significantly.'
                : state.sleepHours > 0
                  ? 'Try to get at least 7 hours. Going to bed 30 min earlier can help!'
                  : 'Log your sleep to get personalized insights from Aurora.'}
            </Text>
          </BlurView>
        </ScrollView>
      </SafeAreaView>

      {/* Sleep Log Modal */}
      <Modal visible={showLog} transparent animationType="slide">
        <View style={ss.modalOverlay}>
          <BlurView intensity={80} tint="light" style={ss.modalCard}>
            <View style={SHINE} />
            <Text style={ss.modalTitle}>🌙 Log Sleep</Text>
            <Text style={ss.modalLabel}>Hours slept</Text>
            <BlurView intensity={40} tint="light" style={ss.modalInput}>
              <TextInput value={hours} onChangeText={setHours} placeholder="e.g. 7.5" placeholderTextColor={Colors.text3} keyboardType="decimal-pad" style={ss.inputText} />
            </BlurView>
            <Text style={ss.modalLabel}>Bedtime (optional)</Text>
            <BlurView intensity={40} tint="light" style={ss.modalInput}>
              <TextInput value={bedtime} onChangeText={setBedtime} placeholder="e.g. 11:00 PM" placeholderTextColor={Colors.text3} style={ss.inputText} />
            </BlurView>
            <Text style={ss.modalLabel}>Wake time (optional)</Text>
            <BlurView intensity={40} tint="light" style={ss.modalInput}>
              <TextInput value={wakeTime} onChangeText={setWakeTime} placeholder="e.g. 6:30 AM" placeholderTextColor={Colors.text3} style={ss.inputText} />
            </BlurView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity onPress={() => setShowLog(false)} style={[ss.modalBtn, { backgroundColor: 'rgba(0,0,0,0.06)' }]}>
                <Text style={{ color: Colors.text2, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={logSleep} style={[ss.modalBtn, { backgroundColor: Colors.violet }]}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}

// ─────────────────────────────────────────
// Habits Screen — with add + notes
// ─────────────────────────────────────────
export function HabitsScreen({ navigation }) {
  const { state, dispatch, habitsDone, habitsTotal, habitPct } = useAurora();
  const [showAdd, setShowAdd] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitDur, setHabitDur] = useState('');
  const [habitNote, setHabitNote] = useState('');

  const addHabit = () => {
    if (!habitName.trim()) { Alert.alert('Error', 'Please enter habit name'); return; }
    dispatch({ type: 'ADD_HABIT', name: habitName.trim(), duration: habitDur || 'Daily' });
    setHabitName(''); setHabitDur(''); setHabitNote('');
    setShowAdd(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={ss.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F0F4FF', '#E8EEFF']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(0,196,167,0.20)', top: -80, right: -40 }]} />
      <View style={[ss.orb, { backgroundColor: 'rgba(124,92,191,0.12)', bottom: 100, left: -40 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}>
            <Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={ss.title}>⚡ Habits</Text>
          <TouchableOpacity onPress={() => setShowAdd(true)} style={ss.addIconBtn}>
            <Text style={{ color: Colors.teal, fontWeight: '700', fontSize: 20 }}>+</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <BlurView intensity={65} tint="light" style={GLASS}>
            <View style={SHINE} />
            <LinearGradient colors={['rgba(0,196,167,0.10)', 'transparent']} style={StyleSheet.absoluteFillObject} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
              <View style={{ alignItems: 'center' }}><Text style={[ss.bigNum, { color: Colors.teal }]}>{habitsDone}</Text><Text style={ss.bigSub}>Done</Text></View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.6)' }} />
              <View style={{ alignItems: 'center' }}><Text style={[ss.bigNum, { color: Colors.text2 }]}>{habitsTotal - habitsDone}</Text><Text style={ss.bigSub}>Left</Text></View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.6)' }} />
              <View style={{ alignItems: 'center' }}><Text style={[ss.bigNum, { color: Colors.amber }]}>{habitsDone}</Text><Text style={ss.bigSub}>Today</Text></View>
            </View>
            <ProgressBar percent={habitPct} color={Colors.teal} />
          </BlurView>

          {habitsTotal === 0 ? (
            <BlurView intensity={50} tint="light" style={[GLASS, { alignItems: 'center', marginTop: 12 }]}>
              <View style={SHINE} />
              <Text style={{ fontSize: 32, marginBottom: 10 }}>⚡</Text>
              <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.text3, marginBottom: 6 }}>No habits yet</Text>
              <Text style={{ fontSize: 12, color: Colors.text3, textAlign: 'center', marginBottom: 16 }}>Add your daily habits and track them here!</Text>
              <TouchableOpacity onPress={() => setShowAdd(true)} style={[ss.quickBtn, { backgroundColor: Colors.teal + '20', borderColor: Colors.teal + '44', paddingHorizontal: 24 }]}>
                <Text style={{ color: Colors.teal, fontWeight: '700', fontSize: 13 }}>+ Add first habit</Text>
              </TouchableOpacity>
            </BlurView>
          ) : (
            <View style={{ marginTop: 12, gap: 8 }}>
              {state.habits.map(h => (
                <TouchableOpacity key={h.id} onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  dispatch({ type: 'TOGGLE_HABIT', id: h.id });
                }} activeOpacity={0.85}>
                  <BlurView intensity={60} tint="light" style={ss.habitRow}>
                    <View style={SHINE} />
                    <LinearGradient colors={[h.done ? 'rgba(0,196,167,0.08)' : 'transparent', 'transparent']} style={StyleSheet.absoluteFillObject} />
                    <View style={[ss.habCheck, h.done && { backgroundColor: Colors.teal, borderColor: Colors.teal }]}>
                      {h.done && <Text style={{ fontSize: 12, color: '#fff' }}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[ss.habName, h.done && { textDecorationLine: 'line-through', opacity: 0.5 }]}>{h.name}</Text>
                      <Text style={ss.habDur}>{h.duration} · Daily</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                      Alert.alert('Delete habit', `Delete "${h.name}"?`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => dispatch({ type: 'DELETE_HABIT', id: h.id }) }
                      ]);
                    }}>
                      <Text style={{ color: Colors.text3, fontSize: 16, paddingHorizontal: 4 }}>×</Text>
                    </TouchableOpacity>
                  </BlurView>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowAdd(true)} style={[ss.habitRow, { justifyContent: 'center', borderStyle: 'dashed', borderColor: Colors.teal + '44', backgroundColor: 'rgba(0,196,167,0.05)' }]}>
                <Text style={{ color: Colors.teal, fontWeight: '700', fontSize: 14 }}>+ Add habit</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Add Habit Modal */}
      <Modal visible={showAdd} transparent animationType="slide">
        <View style={ss.modalOverlay}>
          <BlurView intensity={80} tint="light" style={ss.modalCard}>
            <View style={SHINE} />
            <Text style={ss.modalTitle}>⚡ New Habit</Text>
            <Text style={ss.modalLabel}>Habit name *</Text>
            <BlurView intensity={40} tint="light" style={ss.modalInput}>
              <TextInput value={habitName} onChangeText={setHabitName} placeholder="e.g. Morning walk" placeholderTextColor={Colors.text3} style={ss.inputText} />
            </BlurView>
            <Text style={ss.modalLabel}>Duration</Text>
            <BlurView intensity={40} tint="light" style={ss.modalInput}>
              <TextInput value={habitDur} onChangeText={setHabitDur} placeholder="e.g. 20 min, 30 min" placeholderTextColor={Colors.text3} style={ss.inputText} />
            </BlurView>
            <Text style={ss.modalLabel}>Notes (optional)</Text>
            <BlurView intensity={40} tint="light" style={[ss.modalInput, { height: 70 }]}>
              <TextInput value={habitNote} onChangeText={setHabitNote} placeholder="Any notes or reminders..." placeholderTextColor={Colors.text3} style={[ss.inputText, { height: 60 }]} multiline />
            </BlurView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity onPress={() => setShowAdd(false)} style={[ss.modalBtn, { backgroundColor: 'rgba(0,0,0,0.06)' }]}>
                <Text style={{ color: Colors.text2, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addHabit} style={[ss.modalBtn, { backgroundColor: Colors.teal }]}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}

// ─────────────────────────────────────────
// Nutrition Screen — with + log meal
// ─────────────────────────────────────────
export function NutritionScreen({ navigation }) {
  const { state, dispatch, calPct } = useAurora();
  const [showAdd, setShowAdd] = useState(false);
  const [mealType, setMealType] = useState('');
  const [mealFood, setMealFood] = useState('');
  const [mealKcal, setMealKcal] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealCarbs, setMealCarbs] = useState('');
  const [mealFat, setMealFat] = useState('');

  const macros = [
    { label: 'Protein', val: `${state.protein}g`, pct: state.goals.calories > 0 ? Math.min(Math.round((state.protein / 50) * 100), 100) : 0, color: Colors.rose },
    { label: 'Carbs',   val: `${state.carbs}g`,   pct: state.goals.calories > 0 ? Math.min(Math.round((state.carbs / 200) * 100), 100) : 0, color: Colors.teal },
    { label: 'Fat',     val: `${state.fat}g`,     pct: state.goals.calories > 0 ? Math.min(Math.round((state.fat / 65) * 100), 100) : 0,   color: Colors.blue },
    { label: 'Fiber',   val: `${state.fiber}g`,   pct: state.goals.calories > 0 ? Math.min(Math.round((state.fiber / 25) * 100), 100) : 0, color: Colors.violet },
  ];

  const logMeal = () => {
    if (!mealFood.trim() || !mealKcal) { Alert.alert('Error', 'Please enter food and calories'); return; }
    dispatch({
      type: 'LOG_MEAL',
      meal: {
        type: mealType || 'Meal',
        food: mealFood.trim(),
        kcal: parseInt(mealKcal) || 0,
        protein: parseInt(mealProtein) || 0,
        carbs: parseInt(mealCarbs) || 0,
        fat: parseInt(mealFat) || 0,
        fiber: 0,
      }
    });
    setMealType(''); setMealFood(''); setMealKcal('');
    setMealProtein(''); setMealCarbs(''); setMealFat('');
    setShowAdd(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={ss.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F0F4FF', '#E8EEFF']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(200,134,10,0.18)', top: -80, right: -40 }]} />
      <View style={[ss.orb, { backgroundColor: 'rgba(232,99,122,0.12)', bottom: 100, left: -40 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}>
            <Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={ss.title}>🥗 Nutrition</Text>
          <TouchableOpacity onPress={() => setShowAdd(true)} style={ss.addIconBtn}>
            <Text style={{ color: Colors.amber, fontWeight: '700', fontSize: 20 }}>+</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <BlurView intensity={65} tint="light" style={GLASS}>
            <View style={SHINE} />
            <LinearGradient colors={['rgba(200,134,10,0.10)', 'transparent']} style={StyleSheet.absoluteFillObject} />
            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <Text style={[ss.bigNum, { color: Colors.amber, fontSize: 44 }]}>
                {state.calories > 0 ? state.calories.toLocaleString() : '0'}
              </Text>
              <Text style={ss.bigSub}>of {state.goals.calories.toLocaleString()} kcal · {calPct}%</Text>
              <ProgressBar percent={calPct} color={Colors.amber} style={{ width: '80%', marginTop: 8 }} />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {macros.map(m => (
                <BlurView key={m.label} intensity={40} tint="light" style={{ width: (width - 72) / 2, borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', overflow: 'hidden' }}>
                  <View style={SHINE} />
                  <Text style={{ fontSize: 18, fontWeight: '700', color: m.color }}>{m.val}</Text>
                  <Text style={ss.bigSub}>{m.label}</Text>
                  <ProgressBar percent={m.pct} color={m.color} />
                </BlurView>
              ))}
            </View>
          </BlurView>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
            <SectionLabel>🍽️ Today's meals</SectionLabel>
            <TouchableOpacity onPress={() => setShowAdd(true)} style={[ss.quickBtn, { borderColor: Colors.amber + '44', backgroundColor: Colors.amber + '12' }]}>
              <Text style={{ color: Colors.amber, fontWeight: '700', fontSize: 11 }}>+ Log meal</Text>
            </TouchableOpacity>
          </View>

          <BlurView intensity={65} tint="light" style={GLASS}>
            <View style={SHINE} />
            {state.meals.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 24, marginBottom: 8 }}>🥗</Text>
                <Text style={{ fontSize: 13, color: Colors.text3, textAlign: 'center', marginBottom: 16 }}>No meals logged yet{'\n'}Tap + to add your first meal!</Text>
                <TouchableOpacity onPress={() => setShowAdd(true)} style={[ss.quickBtn, { borderColor: Colors.amber + '44', backgroundColor: Colors.amber + '12', paddingHorizontal: 20 }]}>
                  <Text style={{ color: Colors.amber, fontWeight: '700', fontSize: 12 }}>+ Log first meal</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {state.meals.map((m, i) => (
                  <View key={i} style={[ss.mealRow, i < state.meals.length - 1 && ss.logBorder]}>
                    <View>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.text }}>{m.type}</Text>
                      <Text style={ss.bigSub}>{m.food}</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: Colors.amber, fontWeight: '600' }}>{m.kcal} kcal</Text>
                  </View>
                ))}
                <TouchableOpacity onPress={() => setShowAdd(true)} style={[ss.mealRow, { borderWidth: 1, borderColor: Colors.amber + '33', borderStyle: 'dashed', borderRadius: 14, marginTop: 8, justifyContent: 'center' }]}>
                  <Text style={{ color: Colors.amber, fontWeight: '700', fontSize: 13 }}>+ Add another meal</Text>
                </TouchableOpacity>
              </>
            )}
          </BlurView>
        </ScrollView>
      </SafeAreaView>

      {/* Add Meal Modal */}
      <Modal visible={showAdd} transparent animationType="slide">
        <View style={ss.modalOverlay}>
          <BlurView intensity={80} tint="light" style={ss.modalCard}>
            <View style={SHINE} />
            <Text style={ss.modalTitle}>🥗 Log Meal</Text>

            <Text style={ss.modalLabel}>Meal type</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(t => (
                <TouchableOpacity key={t} onPress={() => setMealType(t)}
                  style={[ss.mealTypeBtn, mealType === t && { backgroundColor: Colors.amber + '25', borderColor: Colors.amber + '66' }]}>
                  <Text style={[{ fontSize: 11, fontWeight: '600', color: Colors.text3 }, mealType === t && { color: Colors.amber }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={ss.modalLabel}>Food name *</Text>
            <BlurView intensity={40} tint="light" style={ss.modalInput}>
              <TextInput value={mealFood} onChangeText={setMealFood} placeholder="e.g. Chicken rice bowl" placeholderTextColor={Colors.text3} style={ss.inputText} />
            </BlurView>

            <Text style={ss.modalLabel}>Calories *</Text>
            <BlurView intensity={40} tint="light" style={ss.modalInput}>
              <TextInput value={mealKcal} onChangeText={setMealKcal} placeholder="e.g. 450" placeholderTextColor={Colors.text3} keyboardType="numeric" style={ss.inputText} />
            </BlurView>

            <Text style={ss.modalLabel}>Macros (optional)</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <BlurView intensity={40} tint="light" style={[ss.modalInput, { flex: 1 }]}>
                <TextInput value={mealProtein} onChangeText={setMealProtein} placeholder="Protein g" placeholderTextColor={Colors.text3} keyboardType="numeric" style={ss.inputText} />
              </BlurView>
              <BlurView intensity={40} tint="light" style={[ss.modalInput, { flex: 1 }]}>
                <TextInput value={mealCarbs} onChangeText={setMealCarbs} placeholder="Carbs g" placeholderTextColor={Colors.text3} keyboardType="numeric" style={ss.inputText} />
              </BlurView>
              <BlurView intensity={40} tint="light" style={[ss.modalInput, { flex: 1 }]}>
                <TextInput value={mealFat} onChangeText={setMealFat} placeholder="Fat g" placeholderTextColor={Colors.text3} keyboardType="numeric" style={ss.inputText} />
              </BlurView>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity onPress={() => setShowAdd(false)} style={[ss.modalBtn, { backgroundColor: 'rgba(0,0,0,0.06)' }]}>
                <Text style={{ color: Colors.text2, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={logMeal} style={[ss.modalBtn, { backgroundColor: Colors.amber }]}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}

// ─────────────────────────────────────────
// Notifications Screen
// ─────────────────────────────────────────
import { scheduleWaterReminders, scheduleSleepReminder, scheduleHabitReminders, scheduleDailyInsight, sendTestNotification } from '../notifications';

export function NotificationsScreen({ navigation }) {
  const { state, dispatch } = useAurora();

  const handleWaterToggle = async () => { const next = !state.notifWater; dispatch({ type: 'SET_NOTIF_WATER', value: next }); await scheduleWaterReminders(state.waterInterval, next); };
  const handleSleepToggle = async () => { const next = !state.notifSleep; dispatch({ type: 'SET_NOTIF_SLEEP', value: next }); await scheduleSleepReminder(next); };
  const handleHabitToggle = async () => { const next = !state.notifHabits; dispatch({ type: 'SET_NOTIF_HABITS', value: next }); await scheduleHabitReminders(next); };
  const handleInsightToggle = async () => { const next = !state.notifInsight; dispatch({ type: 'SET_NOTIF_INSIGHT', value: next }); await scheduleDailyInsight(next); };
  const handleInterval = async (hrs) => { dispatch({ type: 'SET_WATER_INTERVAL', value: hrs }); if (state.notifWater) await scheduleWaterReminders(hrs, true); };

  return (
    <View style={ss.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F0F4FF', '#E8EEFF']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(124,92,191,0.16)', top: -80, right: -40 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}><Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text></TouchableOpacity>
          <Text style={ss.title}>🔔 Notifications</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <BlurView intensity={65} tint="light" style={[GLASS, { marginBottom: 12 }]}>
            <LinearGradient colors={['rgba(58,143,212,0.10)', 'transparent']} style={StyleSheet.absoluteFillObject} />
            <View style={SHINE} />
            <View style={ss.notifTop}>
              <BlurView intensity={50} tint="light" style={[ss.notifIcon, { borderColor: Colors.blue + '44' }]}><Text>💧</Text></BlurView>
              <View style={{ flex: 1 }}><Text style={ss.notifTitle}>Water reminders</Text><Text style={ss.bigSub}>Customizable interval</Text></View>
              <TouchableOpacity onPress={handleWaterToggle}>
                <View style={[ss.tog, { backgroundColor: state.notifWater ? Colors.teal : 'rgba(0,0,0,0.10)' }]}>
                  <View style={[ss.togKnob, { left: state.notifWater ? 22 : 2 }]} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 14 }}>
              {[1, 2, 3].map(h => (
                <TouchableOpacity key={h} onPress={() => handleInterval(h)} style={[ss.ivBtn, state.waterInterval === h && { backgroundColor: Colors.teal + '25', borderColor: Colors.teal + '66' }]}>
                  <Text style={[ss.ivBtnText, { color: state.waterInterval === h ? Colors.teal : Colors.text2 }]}>Every {h}hr</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={sendTestNotification} style={ss.testBtn}>
              <LinearGradient colors={['rgba(124,92,191,0.85)', 'rgba(0,196,167,0.7)']} style={ss.testBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>🔔 Test notification</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>

          {[
            { icon: '🌙', title: 'Sleep reminder', sub: 'Bedtime wind-down', val: state.notifSleep, toggle: handleSleepToggle, color: Colors.violet },
            { icon: '⚡', title: 'Habit reminders', sub: 'Daily nudges', val: state.notifHabits, toggle: handleHabitToggle, color: Colors.teal },
            { icon: '✦', title: 'Daily insight', sub: 'Morning briefing · 8:00 AM', val: state.notifInsight, toggle: handleInsightToggle, color: Colors.amber },
          ].map((item, idx) => (
            <BlurView key={idx} intensity={65} tint="light" style={[GLASS, { marginBottom: 12 }]}>
              <View style={SHINE} />
              <View style={ss.notifTop}>
                <BlurView intensity={50} tint="light" style={[ss.notifIcon, { borderColor: item.color + '44' }]}><Text>{item.icon}</Text></BlurView>
                <View style={{ flex: 1 }}><Text style={ss.notifTitle}>{item.title}</Text><Text style={ss.bigSub}>{item.sub}</Text></View>
                <TouchableOpacity onPress={item.toggle}>
                  <View style={[ss.tog, { backgroundColor: item.val ? item.color : 'rgba(0,0,0,0.10)' }]}>
                    <View style={[ss.togKnob, { left: item.val ? 22 : 2 }]} />
                  </View>
                </TouchableOpacity>
              </View>
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
    { role: 'bot', text: `Hey ${state.user.name || 'there'}! 👋 I'm Aurora. How are you feeling today?`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = React.useRef(null);

  const send = async (txt) => {
    const msg = txt || input.trim();
    if (!msg) return;
    setInput('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { role: 'user', text: msg, time: now }]);
    const lo = msg.toLowerCase();
    let rep;
    if (lo.includes('water') || lo.includes('ml')) { rep = 'Stay hydrated! 💧 Try to drink water every hour.'; const match = msg.match(/(\d+)/); if (match) dispatch({ type: 'ADD_WATER', ml: parseInt(match[1]) }); }
    else if (lo.includes('sleep')) rep = 'Sleep is crucial! 🌙 Try to get 7-8 hours every night.';
    else if (lo.includes('habit')) rep = 'Great habit tracking! ⚡ Consistency is the key to success.';
    else if (lo.includes('score') || lo.includes('doing')) rep = `Your Aurora score reflects your daily wellness. Keep logging to improve! 🌿`;
    else rep = ['Got it! Keep going 🌿', 'Great progress today ✨', 'Small steps = big wins 🌱'][Math.floor(Math.random() * 3)];
    setTimeout(() => { setMessages(m => [...m, { role: 'bot', text: rep, time: now }]); scrollRef.current?.scrollToEnd({ animated: true }); }, 800);
  };

  const CHIPS = ['How am I doing?', 'I slept 8 hours', 'Water tip', 'I drank 300ml', 'Habit advice'];

  return (
    <View style={ss.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F0F4FF', '#E8EEFF']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(0,196,167,0.16)', top: -60, right: -40 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <BlurView intensity={70} tint="light" style={[ss.header, { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.7)' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}><Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text></TouchableOpacity>
          <BlurView intensity={50} tint="light" style={ss.aiAvatar}><Text style={{ fontSize: 17 }}>🌿</Text></BlurView>
          <View><Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text }}>Aurora AI</Text><Text style={{ fontSize: 10, color: Colors.teal }}>● Online</Text></View>
        </BlurView>
        <ScrollView ref={scrollRef} style={{ flex: 1, padding: 14 }} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {messages.map((m, i) => (
            <View key={i} style={[{ marginBottom: 10 }, m.role === 'user' ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
              <BlurView intensity={55} tint="light" style={[ss.bubble, m.role === 'user' ? ss.bubbleUser : ss.bubbleBot]}>
                <Text style={{ fontSize: 13, color: Colors.text, lineHeight: 20 }}>{m.text}</Text>
              </BlurView>
              <Text style={[ss.bigSub, { marginTop: 4, paddingHorizontal: 4 }]}>{m.time}</Text>
            </View>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}>
          {CHIPS.map(c => <TouchableOpacity key={c} onPress={() => send(c)}><BlurView intensity={55} tint="light" style={ss.chip}><Text style={{ fontSize: 12, color: Colors.text2 }}>{c}</Text></BlurView></TouchableOpacity>)}
        </ScrollView>
        <BlurView intensity={70} tint="light" style={ss.inputRow}>
          <BlurView intensity={50} tint="light" style={ss.inputWrap}>
            <TextInput value={input} onChangeText={setInput} placeholder="Ask Aurora anything…" placeholderTextColor={Colors.text3} style={ss.input} onSubmitEditing={() => send()} returnKeyType="send" />
          </BlurView>
          <TouchableOpacity onPress={() => send()} activeOpacity={0.85}>
            <LinearGradient colors={['rgba(124,92,191,0.85)', 'rgba(0,196,167,0.75)']} style={ss.sendBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────
// Profile Screen — with edit form
// ─────────────────────────────────────────
export function ProfileScreen({ navigation, user, onLogout }) {
  const { state, dispatch } = useAurora();
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editWaterGoal, setEditWaterGoal] = useState('');
  const [editSleepGoal, setEditSleepGoal] = useState('');

  const firstName = (user?.full_name || state.user.name || '').split(' ')[0];
  const displayEmail = user?.email || state.user.email || '';

  const openEdit = () => {
    setEditName(state.user.name || '');
    setEditAge(state.user.age ? String(state.user.age) : '');
    setEditWeight(state.user.weight ? String(state.user.weight) : '');
    setEditHeight(state.user.height ? String(state.user.height) : '');
    setEditWaterGoal(String(state.goals.water));
    setEditSleepGoal(String(state.goals.sleep));
    setShowEdit(true);
  };

  const saveEdit = () => {
    dispatch({ type: 'SET_USER', data: {
      name: editName || state.user.name,
      age: editAge ? parseInt(editAge) : state.user.age,
      weight: editWeight ? parseFloat(editWeight) : state.user.weight,
      height: editHeight ? parseFloat(editHeight) : state.user.height,
    }});
    dispatch({ type: 'SET_GOALS', data: {
      water: editWaterGoal ? parseInt(editWaterGoal) : state.goals.water,
      sleep: editSleepGoal ? parseFloat(editSleepGoal) : state.goals.sleep,
    }});
    setShowEdit(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={ss.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F0F4FF', '#E8EEFF']} style={StyleSheet.absoluteFillObject} />
      <View style={[ss.orb, { backgroundColor: 'rgba(124,92,191,0.18)', top: -80, right: -40 }]} />
      <View style={[ss.orb, { backgroundColor: 'rgba(0,196,167,0.12)', bottom: 120, left: -40 }]} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ss.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={ss.backBtn}><Text style={{ color: Colors.text2, fontSize: 16 }}>←</Text></TouchableOpacity>
          <Text style={ss.title}>Profile</Text>
          <TouchableOpacity onPress={openEdit} style={ss.addIconBtn}>
            <Text style={{ color: Colors.violet, fontWeight: '700', fontSize: 13 }}>✏️ Edit</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <BlurView intensity={60} tint="light" style={ss.profileAvatar}>
              <LinearGradient colors={['rgba(124,92,191,0.2)', 'rgba(0,196,167,0.15)']} style={StyleSheet.absoluteFillObject} />
              <Text style={{ fontSize: 30 }}>👤</Text>
            </BlurView>
            <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.text, marginTop: 10 }}>{firstName || 'Your Name'}</Text>
            <Text style={ss.bigSub}>{displayEmail}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <BlurView intensity={50} tint="light" style={[ss.badgePill, { borderColor: Colors.amber + '55' }]}><Text style={{ color: Colors.amber, fontSize: 12, fontWeight: '600' }}>🔥 {state.dayStreak} streak</Text></BlurView>
              <BlurView intensity={50} tint="light" style={[ss.badgePill, { borderColor: Colors.teal + '55' }]}><Text style={{ color: Colors.teal, fontSize: 12, fontWeight: '600' }}>⭐ Score {state.auroraScore}</Text></BlurView>
            </View>
          </View>

          <SectionLabel style={{ marginBottom: 8 }}>Personal info</SectionLabel>
          <BlurView intensity={65} tint="light" style={GLASS}>
            <View style={SHINE} />
            {[
              { l: '🎂 Age',    r: state.user.age    ? `${state.user.age} years`  : 'Not set', c: state.user.age    ? Colors.text : Colors.text3 },
              { l: '⚖️ Weight', r: state.user.weight ? `${state.user.weight} kg`  : 'Not set', c: state.user.weight ? Colors.text : Colors.text3 },
              { l: '📏 Height', r: state.user.height ? `${state.user.height} cm`  : 'Not set', c: state.user.height ? Colors.text : Colors.text3 },
            ].map((r, ri) => (
              <View key={ri} style={[ss.twRow, ri < 2 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.55)' }]}>
                <Text style={{ fontSize: 13, color: Colors.text2 }}>{r.l}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: r.c }}>{r.r}</Text>
              </View>
            ))}
          </BlurView>

          <SectionLabel style={{ marginBottom: 8, marginTop: 12 }}>Goals</SectionLabel>
          <BlurView intensity={65} tint="light" style={GLASS}>
            <View style={SHINE} />
            {[
              { l: '💧 Water goal',   r: `${state.goals.water.toLocaleString()} ml`, c: Colors.blue },
              { l: '🌙 Sleep target', r: `${state.goals.sleep} hours`,               c: Colors.violet },
            ].map((r, ri) => (
              <View key={ri} style={[ss.twRow, ri < 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.55)' }]}>
                <Text style={{ fontSize: 13, color: Colors.text2 }}>{r.l}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: r.c }}>{r.r}</Text>
              </View>
            ))}
          </BlurView>

          <TouchableOpacity onPress={openEdit} activeOpacity={0.85} style={{ marginTop: 12 }}>
            <BlurView intensity={50} tint="light" style={[GLASS, { alignItems: 'center', padding: 14 }]}>
              <Text style={{ color: Colors.violet, fontWeight: '700', fontSize: 14 }}>✏️ Edit profile & goals</Text>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} activeOpacity={0.85} style={{ marginTop: 10 }}>
            <LinearGradient colors={['rgba(124,92,191,0.85)', 'rgba(0,196,167,0.7)']} style={ss.profileBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>🔔 Manage notifications</Text>
            </LinearGradient>
          </TouchableOpacity>

          {onLogout && (
            <TouchableOpacity onPress={() => {
              Alert.alert('Logout', 'Kya aap logout karna chahti hain?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: onLogout }
              ]);
            }} activeOpacity={0.85} style={{ marginTop: 10 }}>
              <BlurView intensity={50} tint="light" style={ss.logoutBtn}>
                <Text style={{ color: Colors.rose, fontWeight: '700', fontSize: 14 }}>🚪 Logout</Text>
              </BlurView>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Edit Profile Modal */}
      <Modal visible={showEdit} transparent animationType="slide">
        <View style={ss.modalOverlay}>
          <BlurView intensity={80} tint="light" style={[ss.modalCard, { maxHeight: '85%' }]}>
            <View style={SHINE} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={ss.modalTitle}>✏️ Edit Profile</Text>

              <Text style={ss.modalLabel}>Name</Text>
              <BlurView intensity={40} tint="light" style={ss.modalInput}>
                <TextInput value={editName} onChangeText={setEditName} placeholder="Your name" placeholderTextColor={Colors.text3} style={ss.inputText} />
              </BlurView>

              <Text style={ss.modalLabel}>Age</Text>
              <BlurView intensity={40} tint="light" style={ss.modalInput}>
                <TextInput value={editAge} onChangeText={setEditAge} placeholder="e.g. 25" placeholderTextColor={Colors.text3} keyboardType="numeric" style={ss.inputText} />
              </BlurView>

              <Text style={ss.modalLabel}>Weight (kg)</Text>
              <BlurView intensity={40} tint="light" style={ss.modalInput}>
                <TextInput value={editWeight} onChangeText={setEditWeight} placeholder="e.g. 65" placeholderTextColor={Colors.text3} keyboardType="decimal-pad" style={ss.inputText} />
              </BlurView>

              <Text style={ss.modalLabel}>Height (cm)</Text>
              <BlurView intensity={40} tint="light" style={ss.modalInput}>
                <TextInput value={editHeight} onChangeText={setEditHeight} placeholder="e.g. 165" placeholderTextColor={Colors.text3} keyboardType="numeric" style={ss.inputText} />
              </BlurView>

              <Text style={[ss.modalLabel, { marginTop: 8, color: Colors.violet, fontWeight: '700' }]}>Goals</Text>

              <Text style={ss.modalLabel}>Daily water goal (ml)</Text>
              <BlurView intensity={40} tint="light" style={ss.modalInput}>
                <TextInput value={editWaterGoal} onChangeText={setEditWaterGoal} placeholder="e.g. 2500" placeholderTextColor={Colors.text3} keyboardType="numeric" style={ss.inputText} />
              </BlurView>

              <Text style={ss.modalLabel}>Sleep target (hours)</Text>
              <BlurView intensity={40} tint="light" style={ss.modalInput}>
                <TextInput value={editSleepGoal} onChangeText={setEditSleepGoal} placeholder="e.g. 8" placeholderTextColor={Colors.text3} keyboardType="decimal-pad" style={ss.inputText} />
              </BlurView>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                <TouchableOpacity onPress={() => setShowEdit(false)} style={[ss.modalBtn, { backgroundColor: 'rgba(0,0,0,0.06)' }]}>
                  <Text style={{ color: Colors.text2, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveEdit} style={[ss.modalBtn, { backgroundColor: Colors.violet }]}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}

// ─────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────
const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  orb: { position: 'absolute', width: 280, height: 280, borderRadius: 200 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)' },
  addIconBtn: { marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text },
  bigNum: { fontSize: 44, fontWeight: '700', color: Colors.text },
  bigSub: { fontSize: 11, color: Colors.text3, marginTop: 2 },
  pctText: { fontSize: 14, fontWeight: '600', marginTop: 6 },
  quickRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 },
  quickBtn: { backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 7 },
  quickBtnText: { color: Colors.blue, fontSize: 12, fontWeight: '600' },
  customRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  customInputWrap: { flex: 1, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)' },
  customInput: { paddingHorizontal: 14, paddingVertical: 10, color: Colors.text, fontSize: 14 },
  customBtn: { backgroundColor: Colors.teal, borderRadius: 14, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  barDay: { fontSize: 9, color: Colors.text3 },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9 },
  logBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.55)' },
  logLabel: { fontSize: 13, color: Colors.text },
  logVal: { fontSize: 13 },
  sleepBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' },
  habitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', overflow: 'hidden' },
  habCheck: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.15)', alignItems: 'center', justifyContent: 'center' },
  habName: { fontSize: 14, fontWeight: '500', color: Colors.text },
  habDur: { fontSize: 11, color: Colors.text3, marginTop: 2 },
  mealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  mealTypeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.10)', backgroundColor: 'rgba(255,255,255,0.55)' },
  notifTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  notifIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, overflow: 'hidden' },
  notifTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  testBtn: { marginTop: 12, borderRadius: 14, overflow: 'hidden' },
  testBtnGrad: { padding: 13, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', borderRadius: 14 },
  ivBtn: { flex: 1, padding: 10, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', backgroundColor: 'rgba(255,255,255,0.35)', alignItems: 'center' },
  ivBtnText: { fontSize: 12, fontWeight: '600' },
  twRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11 },
  tog: { width: 44, height: 24, borderRadius: 12, position: 'relative', justifyContent: 'center' },
  togKnob: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  aiAvatar: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' },
  bubble: { maxWidth: '84%', padding: 12, borderRadius: 18, overflow: 'hidden' },
  bubbleBot: { borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', alignSelf: 'flex-start' },
  bubbleUser: { borderBottomRightRadius: 4, borderWidth: 1, borderColor: 'rgba(124,92,191,0.35)', backgroundColor: 'rgba(124,92,191,0.12)', alignSelf: 'flex-end' },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', overflow: 'hidden', marginRight: 4 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center', padding: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' },
  inputWrap: { flex: 1, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' },
  input: { padding: 10, paddingHorizontal: 16, color: Colors.text, fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  profileAvatar: { width: 76, height: 76, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', overflow: 'hidden' },
  badgePill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  profileBtn: { borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  logoutBtn: { borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(232,99,122,0.35)', overflow: 'hidden' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', overflow: 'hidden' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 16, textAlign: 'center' },
  modalLabel: { fontSize: 11, fontWeight: '600', color: Colors.text3, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
  modalInput: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', marginBottom: 12 },
  inputText: { paddingHorizontal: 14, paddingVertical: 11, color: Colors.text, fontSize: 14 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 14, alignItems: 'center' },
});
