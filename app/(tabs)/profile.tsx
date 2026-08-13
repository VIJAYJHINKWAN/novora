import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../../components/UserAvatar';
import { PageTurnBadge } from '../../components/PageTurnBadge';
import { PageTurnButton } from '../../components/PageTurnButton';
import { BookCover } from '../../components/BookCover';
import { EditProfileModal } from '../../components/modals/EditProfileModal';
import { SubscriptionModal } from '../../components/modals/SubscriptionModal';

export default function ProfileScreen() {
  const { userProfile, books, updateUserProfile, selectBook } = useApp();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  const myOwnedBooks = books.filter(b => b.isOwned || b.ownerName === 'Me');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Reader Profile</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => setShowEditProfile(true)}>
          <Ionicons name="create-outline" size={20} color={Colors.primaryAccent} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card Header */}
        <View style={styles.profileHeader}>
          <UserAvatar name={userProfile.name} size={72} />

          <View style={styles.nameRow}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            {userProfile.verificationStatus && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.primaryAccent} style={{ marginLeft: 4 }} />
            )}
          </View>

          <Text style={styles.location}>📍 {userProfile.location}</Text>
          <Text style={styles.bio}>{userProfile.bio}</Text>
        </View>

        {/* Gamification / Reading Score Banner */}
        <View style={styles.scoreBanner}>
          <View style={styles.scoreCol}>
            <Text style={styles.scoreNum}>{userProfile.readingScore}</Text>
            <Text style={styles.scoreLabel}>Reading Score</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.scoreCol}>
            <Text style={styles.scoreNum}>🔥 {userProfile.streak}</Text>
            <Text style={styles.scoreLabel}>Day Streak</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.scoreCol}>
            <Text style={styles.scoreNum}>{userProfile.monthlyProgress}/{userProfile.monthlyGoal}</Text>
            <Text style={styles.scoreLabel}>Monthly Goal</Text>
          </View>
        </View>

        {/* Subscription Premium Banner Button */}
        <TouchableOpacity style={styles.subBanner} onPress={() => setShowSubscription(true)}>
          <View style={styles.subLeft}>
            <View style={styles.subIconBg}>
              <Ionicons name="sparkles" size={20} color="#FFD700" />
            </View>
            <View style={styles.subMeta}>
              <View style={styles.subBadgeRow}>
                <Text style={styles.subBadgeTitle}>Litverse VIP Pass</Text>
                <View style={styles.subBadgePill}>
                  <Text style={styles.subBadgePillText}>₹59/mo</Text>
                </View>
              </View>
              <Text style={styles.subDesc}>Unlimited chats • Host events • RSVP access</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.primaryAccent} />
        </TouchableOpacity>

        {/* Badges */}
        <Text style={styles.sectionTitle}>Earned Community Badges</Text>
        <View style={styles.badgesRow}>
          {userProfile.badges.map(b => (
            <PageTurnBadge key={b} text={b} isAccent style={{ marginRight: 8, marginBottom: 8 }} />
          ))}
        </View>

        {/* Genres & Goals */}
        <Text style={styles.sectionTitle}>Favorite Genres</Text>
        <Text style={styles.infoText}>{userProfile.genres}</Text>

        <Text style={styles.sectionTitle}>Reading Goal (2026)</Text>
        <Text style={styles.infoText}>{userProfile.goals}</Text>

        {/* Personal Shelf Section */}
        <Text style={styles.sectionTitle}>My Home Shelf ({myOwnedBooks.length} Books)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shelfRow}>
          {myOwnedBooks.map(book => (
            <TouchableOpacity key={book.id} style={styles.shelfBook} onPress={() => selectBook(book)}>
              <BookCover title={book.title} author={book.author} coverId={book.coverResId} style={styles.cover} />
              <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <PageTurnButton
          text="Edit Profile Information"
          isSecondary
          onPress={() => setShowEditProfile(true)}
          iconName="options"
          style={{ marginTop: 24 }}
        />
      </ScrollView>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          profile={userProfile}
          onDismiss={() => setShowEditProfile(false)}
          onSave={updateUserProfile}
        />
      )}

      {/* Subscription Modal */}
      {showSubscription && (
        <SubscriptionModal onDismiss={() => setShowSubscription(false)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: Colors.secondaryBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  editBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  userName: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  location: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  bio: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 10,
  },
  scoreBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 16,
  },
  scoreCol: {
    alignItems: 'center',
  },
  scoreNum: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  scoreLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 14,
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.secondaryText,
  },
  shelfRow: {
    marginTop: 8,
  },
  shelfBook: {
    width: 90,
    marginRight: 12,
  },
  cover: {
    height: 130,
    width: '100%',
  },
  bookTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryText,
    marginTop: 4,
  },
  subBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(193, 140, 93, 0.3)',
    marginVertical: 12,
  },
  subLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(193, 140, 93, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subMeta: {
    marginLeft: 12,
    flex: 1,
  },
  subBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subBadgeTitle: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  subBadgePill: {
    backgroundColor: Colors.primaryAccent,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 6,
  },
  subBadgePillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  subDesc: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
});
