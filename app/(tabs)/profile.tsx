import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../../components/UserAvatar';
import { PageTurnBadge } from '../../components/PageTurnBadge';
import { PageTurnButton } from '../../components/PageTurnButton';
import { BookCover } from '../../components/BookCover';
import { BookDetailsSheet } from '../../components/modals/BookDetailsSheet';
import { EditProfileModal } from '../../components/modals/EditProfileModal';
import { SubscriptionModal } from '../../components/modals/SubscriptionModal';
import { SlideIndicatorScrollView } from '../../components/SlideIndicatorScrollView';

export default function ProfileScreen() {
  const {
    userProfile,
    books,
    updateUserProfile,
    selectedBook,
    selectBook,
    updateBookAvailability,
    updateBookCover,
    deleteBook,
    promptDeleteBook,
    refreshAppData,
    toggleLikeBook,
  } = useApp();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAppData();
    } finally {
      setRefreshing(false);
    }
  };

  const myOwnedBooks = books.filter(b =>
    b.isOwned ||
    b.ownerName === 'Me' ||
    b.ownerName === 'You' ||
    (userProfile.name && b.ownerName.toLowerCase() === userProfile.name.toLowerCase())
  );

  const handleDeleteBook = (book: any) => {
    if (book.isOwned || book.ownerName === 'You' || book.ownerName === 'Me' || (userProfile.name && book.ownerName.toLowerCase() === userProfile.name.toLowerCase())) {
      promptDeleteBook(book);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Reader Profile</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => setShowEditProfile(true)}>
          <Ionicons name="create-outline" size={20} color={Colors.primaryAccent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primaryAccent]}
            tintColor={Colors.primaryAccent}
          />
        }
      >
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

          {/* Points Pill Badge */}
          <View style={styles.pointsBadgeRow}>
            <View style={styles.pointsPill}>
              <Ionicons name="star" size={14} color="#D97706" />
              <Text style={styles.pointsPillText}>
                {userProfile.points ?? (userProfile.readingScore || 120)} Community Points
              </Text>
            </View>
          </View>
        </View>

        {/* Gamification / Reading Score & Points Banner */}
        <View style={styles.scoreBanner}>
          <View style={styles.scoreCol}>
            <Text style={styles.scoreNum}>{userProfile.readingScore}</Text>
            <Text style={styles.scoreLabel}>Reading Score</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.scoreCol}>
            <Text style={[styles.scoreNum, styles.pointsHighlight]}>
              ⭐ {userProfile.points ?? (userProfile.readingScore || 120)}
            </Text>
            <Text style={styles.scoreLabel}>Points</Text>
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
        <View style={styles.shelfHeaderRow}>
          <Text style={styles.sectionTitle}>My Home Shelf ({myOwnedBooks.length} Books)</Text>
          <Text style={styles.shelfSubtext}>Your added books & physical copies</Text>
        </View>

        {myOwnedBooks.length === 0 ? (
          <View style={styles.emptyShelfCard}>
            <Ionicons name="book-outline" size={30} color={Colors.primaryAccent} />
            <Text style={styles.emptyShelfText}>No books added to your shelf yet.</Text>
            <Text style={styles.emptyShelfSubtext}>Tap + on the Home screen to add your books with cover photos!</Text>
          </View>
        ) : (
          <SlideIndicatorScrollView
            style={styles.shelfRow}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {myOwnedBooks.map(book => (
              <View key={book.id} style={styles.shelfBook}>
                <View style={styles.shelfCoverContainer}>
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={() => selectBook(book)}
                  >
                    <BookCover
                      title={book.title}
                      author={book.author}
                      coverId={book.coverResId}
                      coverUrl={book.coverUrl}
                      style={styles.cover}
                    />
                  </TouchableOpacity>

                  {/* Camera badge if user uploaded photo or coverUrl */}
                  {Boolean(book.coverUrl) && (
                    <View style={styles.photoIndicator} pointerEvents="none">
                      <Ionicons name="camera" size={10} color="#FFFFFF" />
                      <Text style={styles.photoIndicatorText}>Photo</Text>
                    </View>
                  )}

                  {/* Delete button on shelf item */}
                  <TouchableOpacity
                    style={styles.shelfDeleteBtn}
                    onPress={() => handleDeleteBook(book)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash" size={11} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
                <Text style={styles.bookAuthorSmall} numberOfLines={1}>{book.author}</Text>
              </View>
            ))}
          </SlideIndicatorScrollView>
        )}

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

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetailsSheet
          book={selectedBook}
          onDismiss={() => selectBook(null)}
          onToggleLike={() => toggleLikeBook(selectedBook)}
          onToggleAvailability={selectedBook.isOwned ? (isExchangeable, isLendable) => {
            updateBookAvailability(selectedBook.id, isExchangeable, isLendable);
          } : undefined}
          onUpdateCover={selectedBook.isOwned ? (coverUrl) => {
            updateBookCover(selectedBook.id, coverUrl);
          } : undefined}
          onDeleteBook={selectedBook.isOwned ? promptDeleteBook : undefined}
        />
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
    paddingBottom: 100,
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
  pointsBadgeRow: {
    marginTop: 12,
    alignItems: 'center',
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pointsPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 5,
  },
  scoreBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 16,
  },
  scoreCol: {
    alignItems: 'center',
    flex: 1,
  },
  scoreNum: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  pointsHighlight: {
    color: '#D97706',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.secondaryText,
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 28,
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
  shelfHeaderRow: {
    marginTop: 14,
    marginBottom: 4,
  },
  shelfSubtext: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 1,
  },
  emptyShelfCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
    gap: 4,
  },
  emptyShelfText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 4,
  },
  emptyShelfSubtext: {
    fontSize: 11,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 15,
  },
  shelfRow: {
    marginTop: 8,
  },
  shelfBook: {
    width: 96,
    marginRight: 14,
  },
  shelfCoverContainer: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cover: {
    height: 140,
    width: '100%',
    borderRadius: 10,
  },
  photoIndicator: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.92)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  photoIndicatorText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  shelfDeleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  bookTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryText,
    marginTop: 6,
  },
  bookAuthorSmall: {
    fontSize: 10,
    color: Colors.secondaryText,
    marginTop: 1,
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
