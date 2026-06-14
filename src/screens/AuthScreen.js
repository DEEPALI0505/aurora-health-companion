import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
  ActivityIndicator, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signIn, signUp } from '../supabase';

const { width } = Dimensions.get('window');

export default function AuthScreen({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleAuth = async () => {
    if (mode === 'signup' && !name.trim()) {
      return Alert.alert('Name required', 'Please enter your full name');
    }
    if (!email.trim()) return Alert.alert('Email required', 'Please enter your email address');
    if (password.length < 6) return Alert.alert('Weak password', 'Password must be at least 6 characters');

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password, name);
        Alert.alert(
          'Account created! 🎉',
          'Please check your email to confirm your account, then log in.',
          [{ text: 'Go to Login', onPress: () => { setMode('login'); setPassword(''); } }]
        );
      } else {
        const data = await signIn(email, password);
        if (data?.user) onAuthSuccess(data.user);
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials')) {
        Alert.alert('Login failed', 'Incorrect email or password. Please try again.');
      } else if (msg.includes('User already registered')) {
        Alert.alert('Already registered', 'This email is already in use. Please log in instead.');
      } else if (msg.includes('Email not confirmed')) {
        Alert.alert('Email not confirmed', 'Please check your email and click the confirmation link first.');
      } else {
        Alert.alert('Something went wrong', msg || 'Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Background orbs */}
      <View style={[s.orb, { backgroundColor: 'rgba(0,245,212,0.15)', top: -100, right: -80, width: 300, height: 300 }]} />
      <View style={[s.orb, { backgroundColor: 'rgba(177,151,252,0.12)', bottom: 80, left: -80, width: 280, height: 280 }]} />
      <View style={[s.orb, { backgroundColor: 'rgba(255,143,171,0.10)', bottom: -60, right: -40, width: 220, height: 220 }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Logo */}
            <View style={s.logoWrap}>
              <LinearGradient colors={['rgba(0,245,212,0.25)', 'rgba(177,151,252,0.2)']} style={s.logoBox} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={s.logoIcon}>🌿</Text>
              </LinearGradient>
              <Text style={s.appName}>aurora</Text>
              <Text style={s.appTagline}>Your personal health companion</Text>
            </View>

            {/* Card */}
            <View style={s.card}>

              {/* Tab switcher */}
              <View style={s.tabs}>
                <TouchableOpacity style={[s.tab, mode === 'login' && s.tabActive]} onPress={() => setMode('login')}>
                  <Text style={[s.tabText, mode === 'login' && s.tabTextActive]}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.tab, mode === 'signup' && s.tabActive]} onPress={() => setMode('signup')}>
                  <Text style={[s.tabText, mode === 'signup' && s.tabTextActive]}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <Text style={s.cardTitle}>
                {mode === 'login' ? 'Welcome back 👋' : 'Create your account 🌿'}
              </Text>
              <Text style={s.cardSub}>
                {mode === 'login'
                  ? 'Log in to continue your health journey'
                  : 'Join Aurora and start understanding yourself better'}
              </Text>

              {/* Full Name — signup only */}
              {mode === 'signup' && (
                <View style={s.inputWrap}>
                  <Text style={s.inputLabel}>FULL NAME</Text>
                  <View style={s.inputBox}>
                    <Text style={s.inputIcon}>👤</Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="e.g. Alex Johnson"
                      placeholderTextColor="#BBBBBB"
                      style={s.input}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              {/* Email */}
              <View style={s.inputWrap}>
                <Text style={s.inputLabel}>EMAIL ADDRESS</Text>
                <View style={s.inputBox}>
                  <Text style={s.inputIcon}>✉️</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="#BBBBBB"
                    style={s.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={s.inputWrap}>
                <Text style={s.inputLabel}>PASSWORD</Text>
                <View style={s.inputBox}>
                  <Text style={s.inputIcon}>🔒</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                    placeholderTextColor="#BBBBBB"
                    style={[s.input, { flex: 1 }]}
                    secureTextEntry={!showPass}
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ paddingLeft: 8 }}>
                    <Text style={{ fontSize: 16 }}>{showPass ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot password */}
              {mode === 'login' && (
                <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 16, marginTop: -4 }}>
                  <Text style={{ fontSize: 12, color: '#00C4A7', fontWeight: '500' }}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              {/* Primary button */}
              <TouchableOpacity onPress={handleAuth} disabled={loading} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#00F5D4', '#B197FC']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={s.submitBtn}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.submitText}>
                        {mode === 'login' ? 'Log In →' : 'Create Account →'}
                      </Text>
                  }
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={s.dividerRow}>
                <View style={s.dividerLine} />
                <Text style={s.dividerText}>or continue with</Text>
                <View style={s.dividerLine} />
              </View>

              {/* Social buttons */}
              <View style={s.socialRow}>
                <TouchableOpacity
                  style={s.socialBtn}
                  onPress={() => Alert.alert('Google Sign In', 'Set up Google OAuth in your Supabase dashboard under Authentication → Providers → Google')}
                >
                  <Text style={s.socialIcon}>G</Text>
                  <Text style={s.socialText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.socialBtn}
                  onPress={() => Alert.alert('Apple Sign In', 'Set up Apple OAuth in your Supabase dashboard under Authentication → Providers → Apple')}
                >
                  <Text style={s.socialIcon}>🍎</Text>
                  <Text style={s.socialText}>Apple</Text>
                </TouchableOpacity>
              </View>

              {/* Switch mode */}
              <View style={s.switchRow}>
                <Text style={s.switchText}>
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                </Text>
                <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'signup' : 'login'); setPassword(''); }}>
                  <Text style={s.switchLink}>
                    {mode === 'login' ? 'Sign up' : 'Log in'}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>

            {/* Terms */}
            <Text style={s.terms}>
              By continuing, you agree to Aurora's{' '}
              <Text style={{ color: '#00C4A7' }}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={{ color: '#00C4A7' }}>Privacy Policy</Text>
            </Text>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  orb: { position: 'absolute', borderRadius: 300 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 32 },

  logoWrap: { alignItems: 'center', marginBottom: 28 },
  logoBox: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0,245,212,0.3)' },
  logoIcon: { fontSize: 32 },
  appName: { fontSize: 26, fontWeight: '700', color: '#0A0618', letterSpacing: 1 },
  appTagline: { fontSize: 13, color: '#999', marginTop: 4 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22,
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 }, elevation: 5,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },

  tabs: { flexDirection: 'row', backgroundColor: '#F0F0F6', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '500', color: '#999' },
  tabTextActive: { color: '#0A0618', fontWeight: '600' },

  cardTitle: { fontSize: 20, fontWeight: '700', color: '#0A0618', marginBottom: 5 },
  cardSub: { fontSize: 13, color: '#888', marginBottom: 18, lineHeight: 18 },

  inputWrap: { marginBottom: 14 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: '#AAA', marginBottom: 6, letterSpacing: 1 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5FA', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: '#EBEBF5' },
  inputIcon: { fontSize: 15, marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: '#0A0618' },

  submitBtn: { borderRadius: 15, paddingVertical: 15, alignItems: 'center', marginTop: 4, marginBottom: 16, shadowColor: '#00F5D4', shadowOpacity: 0.25, shadowRadius: 12, elevation: 4 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#EEEEEE' },
  dividerText: { fontSize: 12, color: '#BBB', marginHorizontal: 10 },

  socialRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#E8E8F0', backgroundColor: '#FAFAFA' },
  socialIcon: { fontSize: 16, fontWeight: '800', color: '#555' },
  socialText: { fontSize: 14, fontWeight: '600', color: '#333' },

  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchText: { fontSize: 13, color: '#888' },
  switchLink: { fontSize: 13, color: '#00C4A7', fontWeight: '700' },

  terms: { textAlign: 'center', fontSize: 11, color: '#BBB', marginTop: 16, lineHeight: 17, paddingHorizontal: 10 },
});
