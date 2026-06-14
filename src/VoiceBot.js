// Aurora Voice AI Bot — Floating Corner Popup
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  TextInput, ScrollView, Dimensions, Platform, KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const AURORA_RESPONSES = {
  water: (ml) => `Done! ✅ Added ${ml || 250}ml to your hydration. Keep drinking to hit your goal! 💧`,
  sleep: () => `Sleep logged! 🌙 That's solid rest. Your pattern tonight looks good — aim for 8 hours.`,
  habits: () => `Habits checked! ⚡ You're building great consistency. Keep the streak alive!`,
  week: () => `Your week looks great 📊 — hydration 70%, habits 80% done, sleep improving. Aurora Score: 87 🔥`,
  feeling: () => `I see your data — you're doing better than you think! 💪 Water is the main thing to focus on today.`,
  help: () => `I can help you:\n• Log water (say "I drank 250ml")\n• Check progress ("How am I doing?")\n• Get tips ("What should I focus on?")\n• Habit reminders ("Remind me to walk")`,
  greet: (name) => `Hey ${name || 'there'}! 👋 I'm Aurora, your personal health companion. How can I help you today?`,
  default: () => {
    const opts = [
      "Got it! I've noted that for you 🌿",
      "Interesting! Based on your patterns, try to drink more water today 💧",
      "I'm here to help! Your health is improving every day 📈",
      "Keep going! Consistency is what builds great health over time ✨",
    ];
    return opts[Math.floor(Math.random() * opts.length)];
  },
};

const getReply = (text, userName) => {
  const lo = text.toLowerCase();
  if (lo.includes('hi') || lo.includes('hello') || lo.includes('hey') || lo.includes('hello')) return AURORA_RESPONSES.greet(userName);
  if (lo.includes('help') || lo.includes('what can')) return AURORA_RESPONSES.help();
  if (lo.includes('week') || lo.includes('doing') || lo.includes('progress') || lo.includes('how')) return AURORA_RESPONSES.week();
  if (lo.includes('feel') || lo.includes('energy') || lo.includes('tired') || lo.includes('tired')) return AURORA_RESPONSES.feeling();
  if (lo.includes('sleep') || lo.includes('sleep') || lo.includes('slept') || lo.includes('nap')) return AURORA_RESPONSES.sleep();
  if (lo.includes('habit') || lo.includes('exercise') || lo.includes('walk')) return AURORA_RESPONSES.habits();
  if (lo.includes('water') || lo.includes('ml') || lo.includes('drink') || lo.includes('water') || lo.includes('drink')) {
    const match = text.match(/(\d+)/);
    return AURORA_RESPONSES.water(match ? match[1] : null);
  }
  return AURORA_RESPONSES.default();
};

export default function VoiceBot({ userName = 'there' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: `Hey ${userName}! 👋 I'm Aurora. Tap the mic or type to talk to me!`, time: 'now' },
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bobAnim = useRef(new Animated.Value(0)).current;

  // Bob the FAB button gently
  useEffect(() => {
    const bob = Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, { toValue: -6, duration: 1800, useNativeDriver: true }),
        Animated.timing(bobAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    bob.start();
    return () => bob.stop();
  }, []);

  // Open/close animation
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: open ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [open]);

  // Mic pulse animation
  useEffect(() => {
    if (listening) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [listening]);

  const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = useCallback((text) => {
    const msg = text?.trim() || input.trim();
    if (!msg) return;
    setInput('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg = { id: Date.now(), role: 'user', text: msg, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    setTimeout(() => {
      const reply = getReply(msg, userName);
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply, time: getTime() }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 900 + Math.random() * 400);
  }, [input, userName]);

  const toggleMic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (listening) {
      setListening(false);
      // Simulate voice result
      setTimeout(() => sendMessage('I drank 300ml of water'), 300);
    } else {
      setListening(true);
      // Auto-stop after 3s (simulated)
      setTimeout(() => {
        setListening(false);
        setTimeout(() => sendMessage('How am I doing this week?'), 300);
      }, 3000);
    }
  };

  const quickReplies = ['How am I doing?', 'Log 500ml water', 'Log my sleep', 'What to focus on?'];

  return (
    <>
      {/* Chat popup */}
      <Animated.View style={[s.popup, {
        opacity: scaleAnim,
        transform: [{ scale: scaleAnim }, { translateY: scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        pointerEvents: open ? 'auto' : 'none',
      }]}>
        <BlurView intensity={60} tint="dark" style={s.popupInner}>
          <LinearGradient colors={['rgba(177,151,252,0.08)', 'rgba(0,245,212,0.05)']} style={StyleSheet.absoluteFillObject} />
          <View style={s.popupShine} />

          {/* Header */}
          <View style={s.popupHeader}>
            <LinearGradient colors={['rgba(177,151,252,0.3)', 'rgba(0,245,212,0.2)']} style={s.botAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={{ fontSize: 16 }}>🌿</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={s.botName}>Aurora AI</Text>
              <Text style={s.botStatus}>{listening ? '🔴 Listening...' : '● Online'}</Text>
            </View>
            <TouchableOpacity onPress={() => setOpen(false)} style={s.closeBtn}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            style={s.msgList}
            contentContainerStyle={{ padding: 12, gap: 10 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(m => (
              <View key={m.id} style={[{ marginBottom: 6 }, m.role === 'user' ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
                <View style={[s.bubble, m.role === 'user' ? s.bubbleUser : s.bubbleBot]}>
                  <Text style={s.bubbleText}>{m.text}</Text>
                </View>
                <Text style={s.bubbleTime}>{m.time}</Text>
              </View>
            ))}
            {typing && (
              <View style={[{ alignItems: 'flex-start', marginBottom: 6 }]}>
                <View style={[s.bubble, s.bubbleBot, { paddingVertical: 12 }]}>
                  <TypingDots />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick replies */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 6, gap: 7 }}>
            {quickReplies.map(q => (
              <TouchableOpacity key={q} onPress={() => sendMessage(q)} style={s.qrBtn}>
                <Text style={s.qrText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={s.inputRow}>
            {/* Mic button */}
            <TouchableOpacity onPress={toggleMic} activeOpacity={0.8}>
              <Animated.View style={[{ transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                  colors={listening ? ['#FF8FAB', '#F43F5E'] : ['rgba(177,151,252,0.4)', 'rgba(116,192,252,0.3)']}
                  style={s.micBtn}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                  <Text style={{ fontSize: 16 }}>{listening ? '⏹️' : '🎙️'}</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>

            {/* Text input */}
            <BlurView intensity={30} tint="dark" style={s.textInputWrap}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder={listening ? 'Listening... 🎙️' : 'Type to Aurora...'}
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={s.textInput}
                onSubmitEditing={() => sendMessage()}
                returnKeyType="send"
                editable={!listening}
              />
            </BlurView>

            {/* Send */}
            <TouchableOpacity onPress={() => sendMessage()} activeOpacity={0.8}>
              <LinearGradient colors={['#B197FC', '#74C0FC']} style={s.sendBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      {/* Floating Aurora FAB */}
      <Animated.View style={[s.fab, { transform: [{ translateY: bobAnim }] }]}>
        <TouchableOpacity onPress={() => { setOpen(o => !o); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }} activeOpacity={0.85}>
          <LinearGradient
            colors={open ? ['#FF8FAB', '#F43F5E'] : ['#B197FC', '#74C0FC']}
            style={s.fabGrad}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <Text style={{ fontSize: 22 }}>{open ? '✕' : '🌿'}</Text>
          </LinearGradient>
          {/* Pulse ring */}
          {!open && (
            <View style={s.fabRing} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

// Typing dots component
function TypingDots() {
  const d1 = useRef(new Animated.Value(0.3)).current;
  const d2 = useRef(new Animated.Value(0.3)).current;
  const d3 = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const anim = (val, delay) => Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(val, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(val, { toValue: 0.3, duration: 400, useNativeDriver: true }),
    ]));
    Animated.parallel([anim(d1, 0), anim(d2, 200), anim(d3, 400)]).start();
  }, []);
  return (
    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
      {[d1, d2, d3].map((d, i) => (
        <Animated.View key={i} style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)', opacity: d }} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  // Popup
  popup: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: Math.min(width - 32, 340),
    height: 420,
    borderRadius: 24,
    overflow: 'hidden',
    zIndex: 999,
    shadowColor: '#B197FC',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 20,
  },
  popupInner: { flex: 1, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  popupShine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.35)', zIndex: 1 },
  popupHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  botAvatar: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(177,151,252,0.3)' },
  botName: { fontSize: 14, fontWeight: '600', color: '#F4F0FF' },
  botStatus: { fontSize: 10, color: '#00F5D4', marginTop: 1 },
  closeBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  msgList: { flex: 1 },
  bubble: { maxWidth: '82%', padding: 10, borderRadius: 16 },
  bubbleBot: { backgroundColor: 'rgba(255,255,255,0.1)', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start' },
  bubbleUser: { backgroundColor: 'rgba(177,151,252,0.25)', borderBottomRightRadius: 4, borderWidth: 1, borderColor: 'rgba(177,151,252,0.3)', alignSelf: 'flex-end' },
  bubbleText: { fontSize: 13, color: '#F4F0FF', lineHeight: 19 },
  bubbleTime: { fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3, paddingHorizontal: 4 },
  qrBtn: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 50, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', marginRight: 4 },
  qrText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center', padding: 10, paddingBottom: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  micBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  textInputWrap: { flex: 1, borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  textInput: { padding: 9, paddingHorizontal: 14, color: '#F4F0FF', fontSize: 13 },
  sendBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },

  // FAB
  fab: { position: 'absolute', bottom: 26, right: 20, zIndex: 1000 },
  fabGrad: {
    width: 56, height: 56, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#B197FC', shadowOpacity: 0.6, shadowRadius: 16, shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
  fabRing: {
    position: 'absolute',
    width: 70, height: 70,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(177,151,252,0.25)',
    top: -7, left: -7,
  },
});
