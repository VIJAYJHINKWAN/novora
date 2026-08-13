import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { PageTurnButton } from '../PageTurnButton';

interface SubscriptionModalProps {
  onDismiss: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onDismiss }) => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    setSubscribed(true);
    setTimeout(() => {
      Alert.alert(
        '🎉 Welcome to Litverse VIP Pass!',
        'Your subscription for ₹59/month is active. Enjoy unlimited chats, event registrations, and RSVP access!',
        [{ text: 'Great!', onPress: onDismiss }]
      );
    }, 600);
  };

  const features = [
    {
      icon: 'chatbubbles',
      title: 'Unlimited Reader Chats',
      desc: 'No more 10 messages/day limit. Talk to book lovers endlessly.',
    },
    {
      icon: 'calendar',
      title: 'Register & Host Events',
      desc: 'Create your own book clubs, swap meets, and literary circles.',
    },
    {
      icon: 'ticket',
      title: 'Attend Events RSVP',
      desc: 'Get priority RSVP passes to exclusive reader workshops & meetups.',
    },
  ];

  return (
    <Modal animationType="slide" transparent visible onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss} />

        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <Ionicons name="sparkles" size={16} color="#FFD700" />
              <Text style={styles.badgeText}>LITVERSE VIP PASS</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
              <Ionicons name="close" size={22} color={Colors.primaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Hero Price Display */}
            <View style={styles.priceContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <Text style={styles.priceAmount}>59</Text>
              <Text style={styles.pricePeriod}>/ month</Text>
            </View>

            <Text style={styles.planSubtext}>Unlock full access to the literary community</Text>

            {/* Feature List */}
            <View style={styles.featuresContainer}>
              {features.map((feat, index) => (
                <View key={index} style={styles.featureRow}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={feat.icon as any} size={20} color={Colors.primaryAccent} />
                  </View>

                  <View style={styles.featureMeta}>
                    <Text style={styles.featureTitle}>{feat.title}</Text>
                    <Text style={styles.featureDesc}>{feat.desc}</Text>
                  </View>

                  <Ionicons name="checkmark-circle" size={20} color={Colors.successAccent} />
                </View>
              ))}
            </View>

            {/* Guarantee Note */}
            <View style={styles.noteBox}>
              <Ionicons name="shield-checkmark-outline" size={16} color={Colors.secondaryText} />
              <Text style={styles.noteText}>Cancel anytime. Safe & secure payment via Google Pay / UPI.</Text>
            </View>
          </ScrollView>

          {/* Action CTA Button */}
          <View style={styles.footer}>
            <PageTurnButton
              text={subscribed ? "Subscription Activated!" : "Subscribe Now for ₹59/month"}
              onPress={handleSubscribe}
              iconName={subscribed ? "checkmark" : "card"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(193, 140, 93, 0.14)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    paddingBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 8,
  },
  currencySymbol: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginRight: 2,
  },
  priceAmount: {
    fontFamily: Fonts.serif,
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  pricePeriod: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 6,
    fontWeight: '600',
  },
  planSubtext: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.secondaryText,
    marginBottom: 20,
  },
  featuresContainer: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureMeta: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  featureDesc: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
    lineHeight: 15,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 12,
    padding: 12,
  },
  noteText: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    marginTop: 8,
  },
});
