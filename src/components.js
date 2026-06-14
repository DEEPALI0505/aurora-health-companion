// Aurora UI Components
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from './theme';

const { width } = Dimensions.get('window');

// ── Glass Card ──
export const GlassCard = ({ children, style, onPress, gradient }) => {
  const Inner = (
    <BlurView intensity={60} tint="dark" style={[styles.glassCard, style]}>
      <View style={styles.glassShine} />
      {children}
    </BlurView>
  );
  if (onPress) return <TouchableOpacity onPress={onPress} activeOpacity={0.85}>{Inner}</TouchableOpacity>;
  return Inner;
};

// ── Gradient Button ──
export const GradientButton = ({ title, onPress, style, textStyle, colors }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={style}>
    <LinearGradient
      colors={colors || ['rgba(177,151,252,0.85)', 'rgba(0,245,212,0.7)']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={styles.gradBtn}
    >
      <Text style={[styles.gradBtnText, textStyle]}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// ── Glass Button ──
export const GlassButton = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={style}>
    <BlurView intensity={40} tint="dark" style={styles.glassBtn}>
      <Text style={[styles.glassBtnText, textStyle]}>{title}</Text>
    </BlurView>
  </TouchableOpacity>
);

// ── Ring Progress ──
export const RingProgress = ({ percent, color, size = 92, stroke = 7.5, children }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);
  return (
    <View style={{ width: size, height: size, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <Circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </Svg>
      {children}
    </View>
  );
};

// ── Progress Bar ──
export const ProgressBar = ({ percent, color, style }) => (
  <View style={[styles.pbBg, style]}>
    <View style={[styles.pbFill, { width: `${Math.min(percent, 100)}%`, backgroundColor: color }]} />
  </View>
);

// ── Toggle ──
export const Toggle = ({ value, onToggle, color }) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
    <LinearGradient
      colors={value ? [color || Colors.teal, color ? color + 'CC' : 'rgba(0,245,212,0.7)'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
      style={styles.togWrap}
    >
      <View style={[styles.togKnob, { left: value ? 23 : 3 }]} />
    </LinearGradient>
  </TouchableOpacity>
);

// ── Section Label ──
export const SectionLabel = ({ children, style }) => (
  <Text style={[styles.sectionLabel, style]}>{children}</Text>
);

// ── Badge ──
export const Badge = ({ label, color, bg, border }) => (
  <View style={[styles.badge, { backgroundColor: bg, borderColor: border }]}>
    <Text style={[styles.badgeText, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  glassShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  gradBtn: {
    borderRadius: 50, paddingVertical: 15, paddingHorizontal: 28,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  gradBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  glassBtn: {
    borderRadius: 50, paddingVertical: 13, paddingHorizontal: 24,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.glassBorder, overflow: 'hidden',
  },
  glassBtnText: { color: Colors.text2, fontSize: 14, fontWeight: '500' },
  pbBg: { height: 5, backgroundColor: 'rgba(255,255,255,0.09)', borderRadius: 3, overflow: 'hidden', marginVertical: 8 },
  pbFill: { height: '100%', borderRadius: 3 },
  togWrap: { width: 44, height: 24, borderRadius: 12, position: 'relative', justifyContent: 'center' },
  togKnob: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  sectionLabel: { fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', color: Colors.text3, fontWeight: '500' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '600' },
});
