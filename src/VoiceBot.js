import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  TextInput, ScrollView, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Colors } from './theme';

const { width } = Dimensions.get('window');

const AURORA_RESPONSES = {
  water: (ml) => `Done! Added ${ml || 250}ml to your hydration. Keep drinking to hit your goal!`,
  sleep: () => `Sleep logged! That's solid rest. Your pattern tonight looks good — aim for 8 hours.`,
  habits: () => `Habits checked! You're building great consistency. Keep the streak alive!`,
  week: () => `Your week looks great — hydration 70%, habits 80% done, sleep improving. Aurora Score: 87!`,
  feeling: () => `I see your data — you're doing better than you think! Water is the main thing to focus on today.`,
  help: () => `I can help you log water, check your progress, get health tips, and track your habits. Just ask!`,
  greet: (name) => `Hey ${name || 'there'}! I'm Aurora, your personal health companion. How can I help you today?`,
  default: () => {
    const opts = [
      "Got it! I've noted that for you.",
      "Based on your patterns, try to drink more water today.",
      "I'm here to help! Your health is improving every day.",
      "Keep going! Consistency is what builds great health over time.",
    ];
    return opts[Math.floor(Math.random() * opts.length)];
  },
};

const getReply = (text, userName) => {
  const lo = text.toLowerCase();
  if (lo.includes('hi') || lo.includes('hello') || lo.includes('hey')) return AURORA_RESPONSES.greet(userName);
  if (lo.includes('help') || lo.includes('what can')) return AURORA_RESPONSES.help();
  if (lo.includes('week') || lo.includes('doing') || lo.includes('progress') || lo.includes('how')) return AURORA_RESPONSES.week();
  if (lo.includes('feel') || lo.includes('energy') || lo.includes('tired')) return AURORA_RESPONSES.feeling();
  if (lo.includes('sleep') || lo.includes('slept') || lo.includes('nap')) return AURORA_RESPONSES.sleep();
  if (lo.includes('habit') || lo.includes('exercise') || lo.includes('walk')) return AURORA_RESPONSES.habits();
  if (lo.includes('water') || lo.includes('ml') || lo.includes('drink')) {
    const match = text.match(/(\d+)/);
    return AURORA_RESPONSES.water(match ? match[1] : null);
  }
  return AURORA_RESPONSES.default();
};

const speakReply = (text) => {
  Speech.stop();
  Speech.speak(text, {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.95,
  });
};

export default function VoiceBotScreen({ userName = 'there' }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: `Hey ${userName}! I'm Aurora. Tap the mic or type to talk to me!`, time: 'now' },
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const scrollRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (listening) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.25, duration: 600, useNativeDriver: true }),
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

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: msg, time: getTime() }]);
    setTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    setTimeout(() => {
      const reply = getReply(msg, userName);
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply, time: getTime() }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      setSpeaking(true);
      speakReply(reply);
      setTimeout(() => setSpeaking(false), 4000);
    }, 900 + Math.random() * 400);
  }, [input, userName]);

  const toggleMic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (listening) {
      setListening(false);
      setTimeout(() => sendMessage('How am I doing this week?'), 300);
    } else {
      Speech.stop();
      setListening(true);
      setTimeout(() => {
        setListening(false);
        setTimeout(() => sendMessage('I drank 300ml of water'), 300);
      }, 3000);
    }
  };

  const quickReplies = ['How am I doing?', 'Log 500ml water', 'Log my sleep', 'What to focus on?'];

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <LinearGradient colors={['#FFFFFF', '#F0F4FF', '#E8EEFF']} style={StyleSheet.absoluteFillObject} />

      {/* Soft orbs */}
      <View style={[s.orb, { backgroundColor: 'rgba(0,196,167,0.10)', top: -60, right: -40, width: 220, height: 220 }]} />
      <View style={[s.orb, { backgroundColor: 'rgba(124,92,191,0.08)', bottom: 100, left: -40, width: 200, height: 200 }]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <LinearGradient colors={['rgba(0,196,167,0.2)', 'rgba(124,92,191,0.15)']} style={s.avatar}>
            <Text style={{ fontSize: 22 }}>🌿</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Aurora AI</Text>
            <Text style={s.headerSub}>
              {listening ? '🔴 Listening...' : speaking ? '🔊 Speaking...' : '● Your health companion'}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(m => (
            <View key={m.id} style={[{ marginBottom: 8 }, m.role === 'user' ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
              <View style={[s.bubble, m.role === 'user' ? s.bubbleUser : s.bubbleBot]}>
                <Text style={[s.bubbleText, { color: m.role === 'user' ? '#fff' : Colors.text }]}>{m.text}</Text>
              </View>
              <Text style={s.bubbleTime}>{m.time}</Text>
            </View>
          ))}
          {typing && (
            <View style={{ alignItems: 'flex-start', marginBottom: 8 }}>
              <View style={[s.bubble, s.bubbleBot, { paddingVertical: 14 }]}>
                <TypingDots />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick replies */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}>
          {quickReplies.map(q => (
            <TouchableOpacity key={q} onPress={() => sendMessage(q)} style={s.qrBtn}>
              <Text style={s.qrText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mic button */}
        <View style={s.micRow}>
          <TouchableOpacity onPress={toggleMic} activeOpacity={0.85}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <LinearGradient
                colors={listening ? ['#E8637A', '#F43F5E'] : ['#00C4A7', '#7C5CBF']}
                style={s.micBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <Text style={{ fontSize: 28 }}>{listening ? '⏹️' : '🎙️'}</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
          <Text style={s.micHint}>{listening ? 'Tap to stop' : 'Tap to speak'}</Text>
        </View>

        {/* Text input */}
        <View style={s.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={listening ? 'Listening... 🎙️' : 'Type to Aurora...'}
            placeholderTextColor="rgba(0,0,0,0.3)"
            style={s.textInput}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            editable={!listening}
          />
          <TouchableOpacity onPress={() => sendMessage()} activeOpacity={0.85}>
            <LinearGradient colors={['#00C4A7', '#7C5CBF']} style={s.sendBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

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
    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
      {[d1, d2, d3].map((d, i) => (
        <Animated.View key={i} style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.teal, opacity: d }} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  orb: { position: 'absolute', borderRadius: 300 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  avatar: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,196,167,0.25)' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  headerSub: { fontSize: 11, color: Colors.teal, marginTop: 2 },
  bubble: { maxWidth: '82%', padding: 12, borderRadius: 18 },
  bubbleBot: { backgroundColor: '#F0F4FF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  bubbleUser: { borderBottomRightRadius: 4, borderWidth: 0 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTime: { fontSize: 10, color: 'rgba(0,0,0,0.3)', marginTop: 3, paddingHorizontal: 4 },
  qrBtn: { backgroundColor: 'rgba(0,196,167,0.10)', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(0,196,167,0.25)' },
  qrText: { fontSize: 12, color: Colors.teal, fontWeight: '600' },
  micRow: { alignItems: 'center', paddingVertical: 16 },
  micBtn: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', shadowColor: '#00C4A7', shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  micHint: { fontSize: 12, color: 'rgba(0,0,0,0.4)', marginTop: 8, fontWeight: '500' },
  inputRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  textInput: { flex: 1, backgroundColor: '#F0F4FF', borderRadius: 50, paddingHorizontal: 18, paddingVertical: 11, fontSize: 14, color: Colors.text, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  sendBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});