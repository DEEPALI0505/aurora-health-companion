import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Dimensions, Animated, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../theme';
import { GlassCard, RingProgress, ProgressBar, SectionLabel, Badge } from '../components';
import { useAurora } from '../store';

const { width } = Dimensions.get('window');
const CARD_W = 160;
const CARD_GAP = 16;

const WJ_DATA = {
  w: { vals: [65,90,74,55,100,80,70], color: Colors.blue, avg: '77%', best: '100%', streak: '🔥 5' },
  s: { vals: [60,85,70,95,65,100,72], color: Colors.violet, avg: '78%', best: '100%', streak: '🔥 3' },
  h: { vals: [80,60,100,80,100,80,80], color: Colors.teal, avg: '83%', best: '100%', streak: '🔥 7' },
};
const DAYS = ['M','T','W','T','F','S','Su'];

export default function HomeScreen({ navigation }) {
  const { state, waterPct, habitsDone, habitsTotal, habitPct, sleepPct, calPct, overallScore } = useAurora();
  const [activeCard, setActiveCard] = useState(0);
  const [wjMode, setWjMode] = useState('w');
  const flatRef = useRef(null);
  const autoTimer = useRef(null);

  const carouselCards = [
    { label: 'Sleep', value: `${state.sleepHours}h`, pct: sleepPct, color: Colors.violet, screen: 'Sleep' },
    { label: 'Habits', value: `${habitsDone}/${habitsTotal} done`, pct: habitPct, color: Colors.teal, screen: 'Habits' },
    { label: 'Nutrition', value: `${state.calories} kcal`, pct: calPct, color: Colors.amber, screen: 'Nutrition' },
    { label: 'Water', value: `${state.waterMl.toLocaleString()} ml`, pct: waterPct, color: Colors.blue, screen: 'Water' },
  ];

  useEffect(() => {
    autoTimer.current = setInterval(() => {
      const next = (activeCard + 1) % carouselCards.length;
      setActiveCard(next);
      flatRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3500);
    return () => clearInterval(autoTimer.current);
  }, [activeCard]);

  const handleCardPress = (i) => {
    clearInterval(autoTimer.current);
    if (i === activeCard) {
      navigation.navigate(carouselCards[i].screen);
    } else {
      setActiveCard(i);
      flatRef.current?.scrollToIndex({ index: i, animated: true });
    }
  };

  const getPredMsg = () => {
    if (overallScore >= 80) return { msg: "You're on the right track! 🌟", sub: "Sleep + habits strong. Push hydration to finish.", color: Colors.teal };
    if (overallScore >= 60) return { msg: "Good progress today! Keep going 💪", sub: "Your water goal needs attention. Drink more!", color: Colors.blue };
    if (overallScore >= 40) return { msg: "You need to take care more 🌿", sub: "Hydration low & habits behind. Small steps count!", color: Colors.amber };
    return { msg: "Aurora is watching out for you 🤍", sub: "Low scores. Let's refocus together.", color: Colors.rose };
  };
  const pred = getPredMsg();
  const wj = WJ_DATA[wjMode];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = (state.user.name || 'Alex').split(' ')[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <LinearGradient colors={['#FFFFFF', '#F0F4FF', '#E8EEFF']} style={StyleSheet.absoluteFillObject} />

      {/* Mesh orbs — these make glass effect visible */}
      <View style={[styles.orb, { backgroundColor: 'rgba(124,92,191,0.18)', top: -80, right: -60, width: 300, height: 300 }]} />
      <View style={[styles.orb, { backgroundColor: 'rgba(0,196,167,0.14)', top: 200, left: -60, width: 260, height: 260 }]} />
      <View style={[styles.orb, { backgroundColor: 'rgba(232,99,122,0.12)', top: 450, right: 20, width: 220, height: 220 }]} />
      <View style={[styles.orb, { backgroundColor: 'rgba(58,143,212,0.12)', bottom: 200, left: -40, width: 200, height: 200 }]} />

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name}>
              {firstName}{' '}
              <Text style={{ color: Colors.teal }}>✦</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <BlurView intensity={60} tint="light" style={styles.avatar}>
              <Text style={{ fontSize: 18 }}>👤</Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <SectionLabel style={{ marginHorizontal: 18, marginBottom: 8 }}>Today's scores</SectionLabel>

          {/* Carousel */}
          <FlatList
            ref={flatRef}
            data={carouselCards}
            horizontal
            keyExtractor={(_, i) => i.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
            snapToInterval={CARD_W + CARD_GAP}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const i = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + CARD_GAP));
              setActiveCard(i);
            }}
            renderItem={({ item, index }) => {
              const isActive = index === activeCard;
              const scale = isActive ? 1.08 : Math.abs(index - activeCard) === 1 ? 0.87 : 0.74;
              const opacity = isActive ? 1 : Math.abs(index - activeCard) === 1 ? 0.62 : 0.3;
              return (
                <TouchableOpacity onPress={() => handleCardPress(index)} activeOpacity={0.9}>
                  <Animated.View style={{ transform: [{ scale }], opacity }}>
                    <BlurView intensity={65} tint="light" style={[styles.carouselCard, { borderColor: item.color + '55' }]}>
                      <LinearGradient colors={[item.color + '25', item.color + '08']} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                      <View style={styles.cardShine} />
                      <View style={{ alignItems: 'center', marginBottom: 12 }}>
                        <RingProgress percent={item.pct} color={item.color} size={88}>
                          <Text style={[styles.ringPct, { color: item.color }]}>{item.pct}%</Text>
                        </RingProgress>
                      </View>
                      <Text style={styles.cardLabel}>{item.label.toUpperCase()}</Text>
                      <Text style={[styles.cardValue, { color: item.color }]}>{item.value}</Text>
                    </BlurView>
                  </Animated.View>
                </TouchableOpacity>
              );
            }}
          />

          {/* Dots */}
          <View style={styles.dots}>
            {carouselCards.map((c, i) => (
              <View key={i} style={[styles.dot, {
                width: i === activeCard ? 22 : 7,
                backgroundColor: i === activeCard ? carouselCards[i].color : 'rgba(0,0,0,0.12)',
              }]} />
            ))}
          </View>

          {/* 2x2 Mini Cards */}
          <View style={styles.grid}>
            {[
              { emoji: '💧', label: 'Hydration', value: `${state.waterMl.toLocaleString()}`, unit: ' ml', pct: waterPct, color: Colors.blue, screen: 'Water', badge: `${waterPct}%` },
              { emoji: '🌙', label: 'Sleep', value: `${state.sleepHours}h`, unit: '', pct: sleepPct, color: Colors.violet, screen: 'Sleep', badge: '6h 45m' },
              { emoji: '⚡', label: 'Habits', value: `${habitPct}`, unit: '% done', pct: habitPct, color: Colors.teal, screen: 'Habits', badge: `${habitsDone}/${habitsTotal}` },
              { emoji: '🥗', label: 'Nutrition', value: `${state.calories}`, unit: ' kcal', pct: calPct, color: Colors.amber, screen: 'Nutrition', badge: '2 meals' },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.miniCard} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.85}>
                <BlurView intensity={60} tint="light" style={styles.miniCardInner}>
                  <LinearGradient colors={[item.color + '15', 'transparent']} style={StyleSheet.absoluteFillObject} />
                  <View style={styles.cardShine} />
                  <View style={styles.miniCardTop}>
                    <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                    <Badge label={item.badge} color={item.color} bg={item.color + '18'} border={item.color + '44'} />
                  </View>
                  <SectionLabel style={{ marginBottom: 2 }}>{item.label}</SectionLabel>
                  <Text style={[styles.miniVal, { color: item.color }]}>
                    {item.value}<Text style={styles.miniUnit}>{item.unit}</Text>
                  </Text>
                  <ProgressBar percent={item.pct} color={item.color} />
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>

          {/* AI Prediction Board */}
          <View style={styles.section}>
            <SectionLabel style={{ marginBottom: 8 }}>✦ Aurora AI prediction</SectionLabel>
            <BlurView intensity={60} tint="light" style={styles.predCard}>
              <LinearGradient colors={['rgba(124,92,191,0.10)', 'rgba(0,196,167,0.06)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.cardShine} />
              <View style={styles.predHeader}>
                <View style={styles.predScoreWrap}>
                  <Svg width={72} height={72} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
                    <Circle cx={36} cy={36} r={30} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={5} />
                    <Circle cx={36} cy={36} r={30} fill="none" stroke={pred.color} strokeWidth={5}
                      strokeLinecap="round" strokeDasharray={188.5} strokeDashoffset={188.5 * (1 - overallScore/100)} />
                  </Svg>
                  <Text style={[styles.predScore, { color: pred.color }]}>{overallScore}</Text>
                </View>
                <View style={styles.predInfo}>
                  <Text style={styles.predMeta}>Aurora sees your data</Text>
                  <Text style={[styles.predMsg, { color: pred.color }]}>{pred.msg}</Text>
                  <Text style={styles.predSub}>{pred.sub}</Text>
                </View>
              </View>
              <View style={styles.predDivider} />
              {[
                { icon: '💧', title: waterPct >= 80 ? 'Water goal on track! 💧' : 'Miss water goal today', sub: waterPct >= 80 ? 'Great hydration!' : `${state.goals.water - state.waterMl}ml remaining`, pct: waterPct >= 80 ? 38 : 72, good: waterPct >= 80 },
                { icon: '⚡', title: habitPct >= 80 ? 'Habit streak secure! ⚡' : 'Habit streak at risk', sub: habitPct >= 80 ? 'All habits on schedule' : 'Evening walk not done yet', pct: habitPct >= 80 ? 32 : 58, good: habitPct >= 80 },
                { icon: '🌙', title: 'Good sleep predicted', sub: 'Pattern shows 7h+ tonight', pct: 81, good: true },
              ].map((row, i) => (
                <BlurView key={i} intensity={40} tint="light" style={[styles.predRow, { borderColor: row.good ? Colors.teal + '33' : Colors.rose + '33' }]}>
                  <View style={[styles.predIcon, { borderColor: row.good ? Colors.teal + '44' : Colors.rose + '44', backgroundColor: row.good ? Colors.teal + '12' : Colors.rose + '12' }]}>
                    <Text>{row.icon}</Text>
                  </View>
                  <View style={styles.predRowText}>
                    <Text style={styles.predRowTitle}>{row.title}</Text>
                    <Text style={styles.predRowSub}>{row.sub}</Text>
                  </View>
                  <View style={[styles.predTag, { backgroundColor: row.good ? Colors.teal + '15' : Colors.rose + '15', borderColor: row.good ? Colors.teal + '44' : Colors.rose + '44' }]}>
                    <Text style={[styles.predTagText, { color: row.good ? Colors.teal : Colors.rose }]}>{row.good ? '✓' : '⚠'} {row.pct}%</Text>
                  </View>
                </BlurView>
              ))}
            </BlurView>
          </View>

          {/* Weekly Journey */}
          <View style={styles.section}>
            <SectionLabel style={{ marginBottom: 8 }}>📅 Weekly journey</SectionLabel>
            <BlurView intensity={60} tint="light" style={styles.wjCard}>
              <View style={styles.cardShine} />
              <View style={styles.wjHeader}>
                <Text style={styles.wjTitle}>This week</Text>
                <View style={styles.wjTabs}>
                  {[['w','Water',Colors.blue],['s','Sleep',Colors.violet],['h','Habits',Colors.teal]].map(([k,l,c]) => (
                    <TouchableOpacity key={k} onPress={() => setWjMode(k)} style={[styles.wjTab, wjMode === k && { backgroundColor: c + '22', borderColor: c + '66' }]}>
                      <Text style={[styles.wjTabText, { color: wjMode === k ? c : 'rgba(0,0,0,0.35)' }]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.wjBars}>
                {wj.vals.map((v, i) => (
                  <View key={i} style={styles.wjBarCol}>
                    <View style={styles.wjBarBg}>
                      <LinearGradient colors={[wj.color, wj.color + '66']} style={[styles.wjBar, { height: `${v}%` }]} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} />
                    </View>
                    <Text style={styles.wjDay}>{DAYS[i]}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.wjStats}>
                <View style={styles.wjStat}><Text style={[styles.wjStatVal, { color: wj.color }]}>{wj.avg}</Text><Text style={styles.wjStatLabel}>Avg</Text></View>
                <View style={styles.wjStat}><Text style={[styles.wjStatVal, { color: Colors.teal }]}>{wj.best}</Text><Text style={styles.wjStatLabel}>Best</Text></View>
                <View style={styles.wjStat}><Text style={[styles.wjStatVal, { color: Colors.amber }]}>{wj.streak}</Text><Text style={styles.wjStatLabel}>Streak</Text></View>
              </View>
            </BlurView>
          </View>

          {/* AI Banner */}
          <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('AI')} activeOpacity={0.85}>
            <BlurView intensity={60} tint="light" style={styles.aiBanner}>
              <LinearGradient colors={['rgba(124,92,191,0.12)', 'rgba(58,143,212,0.08)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.cardShine} />
              <BlurView intensity={40} tint="light" style={styles.aiBannerIcon}><Text style={{ fontSize: 19 }}>🌿</Text></BlurView>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiBannerTitle}>Talk to Aurora AI</Text>
                <Text style={styles.aiBannerSub}>Ask anything about your health</Text>
              </View>
              <Text style={{ color: 'rgba(0,0,0,0.3)', fontSize: 18 }}>→</Text>
            </BlurView>
          </TouchableOpacity>

          {/* Streaks */}
          <View style={[styles.section, { marginBottom: 30 }]}>
            <BlurView intensity={60} tint="light" style={styles.streaksCard}>
              <View style={styles.cardShine} />
              {[
                { val: state.dayStreak, label: 'Day streak', color: Colors.amber },
                { val: state.waterStreak, label: 'Water days', color: Colors.teal },
                { val: state.auroraScore, label: 'Score', color: Colors.violet },
              ].map((s, i) => (
                <View key={i} style={[styles.streakItem, i < 2 && { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.4)' }]}>
                  <Text style={[styles.streakVal, { color: s.color }]}>{s.val}</Text>
                  <Text style={styles.streakLabel}>{s.label}</Text>
                </View>
              ))}
            </BlurView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safe: { flex: 1 },
  orb: { position: 'absolute', borderRadius: 300 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 18, paddingBottom: 10, paddingTop: 8 },
  greeting: { fontSize: 10, letterSpacing: 1.8, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', fontWeight: '500' },
  name: { fontSize: 25, fontWeight: '700', color: Colors.text, marginTop: 3 },
  // Avatar — glass
  avatar: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' },
  // Carousel
  carouselContainer: { paddingHorizontal: (width - CARD_W) / 2 - CARD_GAP / 2, gap: CARD_GAP, paddingVertical: 12 },
  carouselCard: { width: CARD_W, borderRadius: 26, padding: 20, borderWidth: 1, overflow: 'hidden' },
  cardShine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 1 },
  ringPct: { fontSize: 19, fontWeight: '700' },
  cardLabel: { fontSize: 10, color: 'rgba(0,0,0,0.45)', textAlign: 'center', letterSpacing: 1.2, marginBottom: 4 },
  cardValue: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 6 },
  dot: { height: 5, borderRadius: 3 },
  // Mini grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16, marginBottom: 14 },
  miniCard: { width: (width - 42) / 2, borderRadius: 22, overflow: 'hidden' },
  miniCardInner: { padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', borderRadius: 22, overflow: 'hidden' },
  miniCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  miniVal: { fontSize: 19, fontWeight: '700' },
  miniUnit: { fontSize: 10, color: 'rgba(0,0,0,0.4)', fontWeight: '400' },
  section: { paddingHorizontal: 16, marginBottom: 14 },
  // Pred card
  predCard: { borderRadius: 22, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', overflow: 'hidden' },
  predHeader: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'center' },
  predScoreWrap: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  predScore: { fontSize: 18, fontWeight: '700' },
  predInfo: { flex: 1 },
  predMeta: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 3 },
  predMsg: { fontSize: 14, fontWeight: '600', lineHeight: 20, marginBottom: 3 },
  predSub: { fontSize: 12, color: 'rgba(0,0,0,0.5)', lineHeight: 17 },
  predDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.6)', marginBottom: 12 },
  predRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 8, borderRadius: 14, borderWidth: 1, marginBottom: 8, overflow: 'hidden' },
  predIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  predRowText: { flex: 1 },
  predRowTitle: { fontSize: 12, fontWeight: '600', color: Colors.text },
  predRowSub: { fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 2 },
  predTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  predTagText: { fontSize: 10, fontWeight: '700' },
  // Weekly journey
  wjCard: { borderRadius: 22, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', overflow: 'hidden' },
  wjHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  wjTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  wjTabs: { flexDirection: 'row', gap: 5 },
  wjTab: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.4)' },
  wjTabText: { fontSize: 10, fontWeight: '600' },
  wjBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 72, marginVertical: 14 },
  wjBarCol: { flex: 1, alignItems: 'center', gap: 4 },
  wjBarBg: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  wjBar: { width: '100%', borderRadius: 5 },
  wjDay: { fontSize: 9, color: 'rgba(0,0,0,0.4)' },
  wjStats: { flexDirection: 'row', justifyContent: 'space-around' },
  wjStat: { alignItems: 'center' },
  wjStatVal: { fontSize: 16, fontWeight: '700' },
  wjStatLabel: { fontSize: 10, color: 'rgba(0,0,0,0.4)', marginTop: 2 },
  // AI Banner
  aiBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', overflow: 'hidden' },
  aiBannerIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' },
  aiBannerTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  aiBannerSub: { fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 2 },
  // Streaks
  streaksCard: { flexDirection: 'row', borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)' },
  streakItem: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  streakVal: { fontSize: 24, fontWeight: '700' },
  streakLabel: { fontSize: 10, color: 'rgba(0,0,0,0.4)', marginTop: 3 },
});
