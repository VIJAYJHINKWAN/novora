import React from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../../types';
import { Colors, Fonts } from '../../constants/theme';
import { BookCover } from '../BookCover';
import { PageTurnButton } from '../PageTurnButton';
import { PageTurnBadge } from '../PageTurnBadge';
import { UserAvatar } from '../UserAvatar';

interface BookDetailsSheetProps {
  book: Book;
  onDismiss: () => void;
  onExchangeRequest: () => void;
  onToggleLike?: () => void;
}

export const BookDetailsSheet: React.FC<BookDetailsSheetProps> = ({
  book,
  onDismiss,
  onExchangeRequest,
  onToggleLike,
}) => {
  return (
    <Modal animationType="slide" transparent visible onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss} />
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />
          
          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
            <Ionicons name="close" size={24} color={Colors.primaryText} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Header / Cover */}
            <View style={styles.headerRow}>
              <BookCover title={book.title} author={book.author} coverId={book.coverResId} coverUrl={book.coverUrl} style={styles.cover} />
              
              <View style={styles.metaCol}>
                <PageTurnBadge text={book.genre} isAccent style={{ marginBottom: 6 }} />
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.author}>by {book.author}</Text>
                
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{book.rating.toFixed(1)} / 5.0</Text>
                </View>

                {onToggleLike && (
                  <TouchableOpacity style={styles.likeRow} onPress={onToggleLike}>
                    <Ionicons
                      name={book.isLiked ? "heart" : "heart-outline"}
                      size={20}
                      color={book.isLiked ? Colors.alertAccent : Colors.secondaryText}
                    />
                    <Text style={styles.likeCount}>{book.likesCount} readers liked</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Owner Details Card */}
            <View style={styles.ownerCard}>
              <UserAvatar name={book.ownerName} size={42} />
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>OFFERED BY</Text>
                <Text style={styles.ownerName}>{book.ownerName}</Text>
                <Text style={styles.ownerDistance}>📍 {book.ownerDistance} • {book.ownerRating}★ Owner Rating</Text>
              </View>
            </View>

            {/* Summary */}
            <Text style={styles.sectionTitle}>Summary & Synopsis</Text>
            <Text style={styles.summaryText}>{book.summary}</Text>

            {/* Availability Badges */}
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.badgesRow}>
              {book.isExchangeable && <PageTurnBadge text="Available for Exchange" isSuccess style={styles.badgeItem} />}
              {book.isLendable && <PageTurnBadge text="Available for Lending" isAccent style={styles.badgeItem} />}
              {book.isOwned && <PageTurnBadge text="On Personal Shelf" isOutline style={styles.badgeItem} />}
            </View>

            {/* CTA */}
            <PageTurnButton
              text="Request Book Swap / Borrow"
              onPress={onExchangeRequest}
              iconName="swap-horizontal"
              style={{ marginTop: 24 }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 10,
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cover: {
    width: 100,
    height: 150,
  },
  metaCol: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  author: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryText,
    marginLeft: 4,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  likeCount: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginLeft: 6,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  ownerInfo: {
    marginLeft: 12,
  },
  ownerLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.secondaryText,
    letterSpacing: 1,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  ownerDistance: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 12,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.secondaryText,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badgeItem: {
    marginRight: 8,
    marginTop: 6,
  },
});
