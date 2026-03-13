import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSelector, useDispatch } from 'react-redux';
import { selectExpenses, selectTotalAmount, deleteExpense } from '../store/slices/expenseSlice';
import { Colors, Shadows } from '../theme/colors';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

// Category icon map
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

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const expenses = useSelector(selectExpenses);
  const totalAmount = useSelector(selectTotalAmount);

  // Header animation
  const headerAnim = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(fabAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderExpenseItem = ({ item, index }: { item: any; index: number }) => {
    const itemAnim = new Animated.Value(0);
    Animated.spring(itemAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      delay: index * 80,
      useNativeDriver: true,
    }).start();

    const color = Colors.categories[item.category] || Colors.categories.Other;

    return (
      <Animated.View
        style={[
          styles.expenseItem,
          {
            opacity: itemAnim,
            transform: [
              {
                translateY: itemAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
          <Ionicons
            name={categoryIcons[item.category] || 'ellipsis-horizontal'}
            size={22}
            color={color}
          />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseCategory}>{item.category}</Text>
        </View>
        <View style={styles.expenseRight}>
          <Text style={styles.expenseAmount}>
            ${item.amount.toFixed(2)}
          </Text>
          <Text style={styles.expenseDate}>
            {new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => dispatch(deleteExpense(item.id))}
          style={styles.deleteBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="wallet-outline" size={80} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No Expenses Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button to add your first expense
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header Card ───────────────────────── */}
      <Animated.View
        style={[
          styles.headerCard,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-40, 0],
                }),
              },
              {
                scale: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerLabel}>Total Expenses</Text>
            <Text style={styles.headerAmount}>
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.headerIconContainer}>
            <Ionicons name="trending-up" size={28} color={Colors.primary} />
          </View>
        </View>
        <View style={styles.headerDivider} />
        <View style={styles.headerBottom}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{expenses.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {expenses.length > 0
                ? `$${(totalAmount / expenses.length).toFixed(2)}`
                : '$0.00'}
            </Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>
      </Animated.View>

      {/* ── Section Title ─────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {expenses.length > 0 && (
          <Text style={styles.sectionCount}>{expenses.length} items</Text>
        )}
      </View>

      {/* ── Expense List ──────────────────────── */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={[
          styles.listContent,
          expenses.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
      />

      {/* ── FAB ───────────────────────────────── */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [
              {
                scale: fabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddExpense')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header ──────────────────────
  headerCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerAmount: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 4,
    letterSpacing: -1,
  },
  headerIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 18,
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },

  // ── Section ──────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionCount: {
    fontSize: 13,
    color: Colors.textMuted,
  },

  // ── List ─────────────────────────
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
    marginLeft: 14,
  },
  expenseTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  expenseCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  expenseRight: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accent,
  },
  expenseDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },

  // ── Empty State ──────────────────
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },

  // ── FAB ──────────────────────────
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 24,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.button,
  },
});
