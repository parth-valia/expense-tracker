import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { addExpense } from '../store/slices/expenseSlice';
import { CATEGORIES } from '../types/expense';
import { Colors, Shadows } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddExpense'>;

export default function AddExpenseScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = () => {
    // Validate
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter an expense title.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a category.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    setIsSubmitting(true);
    Keyboard.dismiss();

    // Brief animation delay for polish
    setTimeout(() => {
      dispatch(addExpense({
        title: title.trim(),
        category: selectedCategory,
        amount: parsedAmount,
      }));
      setIsSubmitting(false);
      navigation.goBack();
    }, 400);
  };

  const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Food: 'fast-food',
    Transport: 'car',
    Shopping: 'cart',
    Entertainment: 'game-controller',
    Bills: 'receipt',
    Health: 'medkit',
    Education: 'school',
    Other: 'ellipsis-horizontal',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* ── Header ──────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-down" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* ── Amount Input ────────────── */}
            <View style={styles.amountContainer}>
              <Text style={styles.currencySign}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                returnKeyType="done"
              />
            </View>

            {/* ── Title Input ─────────────── */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={Colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Morning coffee"
                  placeholderTextColor={Colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                  returnKeyType="done"
                  maxLength={50}
                />
              </View>
            </View>

            {/* ── Category Selector ───────── */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const color =
                    Colors.categories[cat] || Colors.categories.Other;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        isSelected && {
                          backgroundColor: color + '25',
                          borderColor: color,
                        },
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={categoryIcons[cat] || 'ellipsis-horizontal'}
                        size={18}
                        color={isSelected ? color : Colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.categoryLabel,
                          isSelected && { color },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* ── Submit Button ────────────── */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitText}>Adding...</Text>
            ) : (
              <>
                <Ionicons name="add-circle" size={22} color="#FFF" />
                <Text style={styles.submitText}>Add Expense</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },

  // ── Header ──────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },

  // ── Scroll Content ──────────────
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // ── Amount ──────────────────────
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencySign: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.textPrimary,
    minWidth: 120,
    textAlign: 'center',
  },

  // ── Input Group ──────────────────
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 16,
  },

  // ── Category Grid ─────────────────
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },

  // ── Bottom Bar ──────────────────
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    gap: 8,
    ...Shadows.button,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
});
