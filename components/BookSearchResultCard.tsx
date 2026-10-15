import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types';
import { Colors, Fonts } from '../constants/theme';
import { BookCover } from './BookCover';
import { UserAvatar } from './UserAvatar';
import { PageTurnBadge } from './PageTurnBadge';

interface BookSearchResultCardProps {
  book: Book;
  onPress: () => void;
  onSwap: () => void;
  onBorrow: () => void;
  onMessage: () => void;
  onToggleLike?: () => void;
}

export const BookSearchResultCard: React.FC<BookSearchResultCardProps> = ({
  book,
  onPress,
  onSwap,
  onBorrow,
  onMessage,
  onToggleLike,
}) => {
  // Determine Availability Badge
  const getAvailabilityInfo = () => {
    if (book.isExchangeable && book.isLendable) {
      return {
        text: 'Available for Swap & Borrow',
        icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
        type: 'success',
      };
    }
    if (book.isExchangeable) {
      return {
        text: 'Available to Swap',
        icon: 'swap-horizontal' as keyof typeof Ionicons.glyphMap,
        type: 'success',
      };
    }
    if (book.isLendable) {
      return {
        text: 'Available to Borrow',
        icon: 'book-outline' as keyof typeof Ionicons.glyphMap,
        type: 'accent',
      };
    }
    return {
      text: 'Currently Unavailable',
      icon: 'time-outline' as keyof typeof Ionicons.glyphMap,
      type: 'muted',
    };
  };

  const avail = getAvailabilityInfo();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Top Main Section: Cover + Book Info */}
      <View style={styles.topSection}>
        <BookCover
          title={book.title}
          author={book.author}
          coverId={book.coverResId}
          coverUrl={book.coverUrl}
          style={styles.cover}
        />

        <View style={styles.bookInfo}>
          {/* Genre and Like Button */}
          <View style={styles.genreRow}>
            <PageTurnBadge text={book.genre} isAccent />
            {onToggleLike && (
              <TouchableOpacity
                onPress={onToggleLike}
                style={styles.heartBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={book.isLiked ? 'heart' : 'heart-outline'}
                  size={18}
                  color={book.isLiked ? Colors.alertAccent : Colors.secondaryText}
                />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            by {book.author}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{book.rating.toFixed(1)} / 5.0</Text>
          </View>

          {/* Availability Status Badge */}
          <View
            style={[
              styles.availPill,
              avail.type === 'success' && styles.availPillSuccess,
              avail.type === 'accent' && styles.availPillAccent,
              avail.type === 'muted' && styles.availPillMuted,
            ]}
          >
            <Ionicons
              name={avail.icon}
              size={13}
              color={
                avail.type === 'success'
                  ? Colors.successAccent
                  : avail.type === 'accent'
                  ? Colors.primaryAccent
                  : Colors.secondaryText
              }
            />
            <Text
              style={[
                styles.availPillText,
                avail.type === 'success' && styles.availPillTextSuccess,
                avail.type === 'accent' && styles.availPillTextAccent,
                avail.type === 'muted' && styles.availPillTextMuted,
              ]}
              numberOfLines={1}
            >
              {avail.text}
            </Text>
          </View>
        </View>
      </View>

      {/* Middle Section: Uploader Profile Card */}
      <View style={styles.uploaderCard}>
        <UserAvatar name={book.ownerName} size={36} />
        <View style={styles.uploaderDetails}>
          <Text style={styles.uploaderLabel}>
            {book.isOwned ? 'YOUR SHELF' : 'UPLOADED BY'}
          </Text>
          <Text style={styles.uploaderName}>
            {book.ownerName} {book.isOwned ? '(You)' : ''}
          </Text>
          <Text style={styles.uploaderDistance}>
            📍 {book.ownerDistance} • {book.ownerRating}★ Owner Rating
          </Text>
        </View>
      </View>

      {/* Bottom Section: Related Action Options */}
      <View style={styles.actionRow}>
        {!book.isOwned ? (
          <>
            {/* Swap Button */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.swapBtn,
                !book.isExchangeable && styles.btnDisabled,
              ]}
              onPress={book.isExchangeable ? onSwap : undefined}
              disabled={!book.isExchangeable}
              activeOpacity={0.8}
            >
              <Ionicons
                name="swap-horizontal"
                size={16}
                color={book.isExchangeable ? '#FFFFFF' : Colors.secondaryText}
              />
              <Text
                style={[
                  styles.btnText,
                  book.isExchangeable ? styles.btnTextPrimary : styles.btnTextDisabled,
                ]}
              >
                {book.isExchangeable ? 'Swap' : 'No Swap'}
              </Text>
            </TouchableOpacity>

            {/* Borrow Button */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.borrowBtn,
                !book.isLendable && styles.btnDisabled,
              ]}
              onPress={book.isLendable ? onBorrow : undefined}
              disabled={!book.isLendable}
              activeOpacity={0.8}
            >
              <Ionicons
                name="book-outline"
                size={15}
                color={book.isLendable ? Colors.primaryAccent : Colors.secondaryText}
              />
              <Text
                style={[
                  styles.btnText,
                  book.isLendable ? styles.btnTextAccent : styles.btnTextDisabled,
                ]}
              >
                {book.isLendable ? 'Borrow' : 'No Borrow'}
              </Text>
            </TouchableOpacity>

            {/* Message Button */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.messageBtn]}
              onPress={onMessage}
              activeOpacity={0.8}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={15}
                color={Colors.primaryText}
              />
              <Text style={[styles.btnText, styles.btnTextDark]}>Message</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.ownedBadgeContainer}>
            <Ionicons name="bookmark" size={15} color={Colors.primaryAccent} />
            <Text style={styles.ownedBadgeText}>Uploaded by You • In Your Library</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(234, 235, 237, 0.8)',

    // Soft Elevation Shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  topSection: {
    flexDirection: 'row',
  },
  cover: {
    width: 82,
    height: 124,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  genreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  heartBtn: {
    padding: 4,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    lineHeight: 20,
  },
  author: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryText,
    marginLeft: 4,
  },
  availPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  availPillSuccess: {
    backgroundColor: 'rgba(112, 138, 129, 0.14)',
    borderColor: 'rgba(112, 138, 129, 0.3)',
  },
  availPillTextSuccess: {
    color: Colors.successAccent,
  },
  availPillAccent: {
    backgroundColor: 'rgba(193, 140, 93, 0.14)',
    borderColor: 'rgba(193, 140, 93, 0.3)',
  },
  availPillTextAccent: {
    color: Colors.primaryAccent,
  },
  availPillMuted: {
    backgroundColor: 'rgba(85, 85, 85, 0.08)',
    borderColor: Colors.border,
  },
  availPillTextMuted: {
    color: Colors.secondaryText,
  },
  availPillText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 5,
  },
  uploaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  uploaderDetails: {
    marginLeft: 10,
    flex: 1,
  },
  uploaderLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.secondaryText,
    letterSpacing: 0.8,
  },
  uploaderName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 1,
  },
  uploaderDistance: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  swapBtn: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  borrowBtn: {
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    borderColor: 'rgba(193, 140, 93, 0.3)',
  },
  messageBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
  },
  btnDisabled: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderColor: Colors.border,
    opacity: 0.6,
  },
  btnText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  btnTextPrimary: {
    color: '#FFFFFF',
  },
  btnTextAccent: {
    color: Colors.primaryAccent,
  },
  btnTextDark: {
    color: Colors.primaryText,
  },
  btnTextDisabled: {
    color: Colors.secondaryText,
  },
  ownedBadgeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(193, 140, 93, 0.1)',
    paddingVertical: 9,
    borderRadius: 20,
  },
  ownedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryAccent,
    marginLeft: 6,
  },
});
