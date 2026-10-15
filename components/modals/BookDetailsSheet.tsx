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
  onExchangeRequest?: () => void;
  onBorrowRequest?: () => void;
  onMessageOwner?: () => void;
  onToggleLike?: () => void;
  onToggleAvailability?: (isExchangeable: boolean, isLendable: boolean) => void;
}

export const BookDetailsSheet: React.FC<BookDetailsSheetProps> = ({
  book,
  onDismiss,
  onExchangeRequest,
  onBorrowRequest,
  onMessageOwner,
  onToggleLike,
  onToggleAvailability,
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
              <UserAvatar name={book.ownerName} size={46} />
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>{book.isOwned ? 'YOUR PERSONAL SHELF' : 'UPLOADED BY'}</Text>
                <Text style={styles.ownerName}>{book.ownerName} {book.isOwned ? '(You)' : ''}</Text>
                <Text style={styles.ownerDistance}>📍 {book.ownerDistance} • {book.ownerRating}★ Owner Rating</Text>
              </View>
              {!book.isOwned && onMessageOwner && (
                <TouchableOpacity
                  style={styles.ownerMessageBtn}
                  onPress={onMessageOwner}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.primaryAccent} />
                  <Text style={styles.ownerMessageText}>Message</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Availability Badges */}
            <Text style={styles.sectionTitle}>Availability Status</Text>
            <View style={styles.badgesRow}>
              {book.isExchangeable ? (
                <View style={[styles.statusChip, styles.statusChipSuccess]}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.successAccent} />
                  <Text style={styles.statusChipSuccessText}>Available for Swap</Text>
                </View>
              ) : (
                <View style={[styles.statusChip, styles.statusChipMuted]}>
                  <Ionicons name="close-circle-outline" size={14} color={Colors.secondaryText} />
                  <Text style={styles.statusChipMutedText}>Swap Unavailable</Text>
                </View>
              )}

              {book.isLendable ? (
                <View style={[styles.statusChip, styles.statusChipAccent]}>
                  <Ionicons name="book-outline" size={14} color={Colors.primaryAccent} />
                  <Text style={styles.statusChipAccentText}>Available to Borrow</Text>
                </View>
              ) : (
                <View style={[styles.statusChip, styles.statusChipMuted]}>
                  <Ionicons name="close-circle-outline" size={14} color={Colors.secondaryText} />
                  <Text style={styles.statusChipMutedText}>Borrow Unavailable</Text>
                </View>
              )}

              {book.isOwned && (
                <View style={[styles.statusChip, styles.statusChipNeutral]}>
                  <Ionicons name="bookmark-outline" size={14} color={Colors.secondaryText} />
                  <Text style={styles.statusChipNeutralText}>Personal Shelf</Text>
                </View>
              )}
            </View>

            {/* Owner Availability Decision Toggles */}
            {book.isOwned && onToggleAvailability && (
              <View style={styles.ownerManageBox}>
                <Text style={styles.ownerManageHeading}>Your Book Availability Controls</Text>
                <Text style={styles.ownerManageSubtext}>
                  Tap below to toggle whether readers can request a swap or borrow:
                </Text>

                <View style={styles.ownerToggleRow}>
                  {/* Toggle Swap */}
                  <TouchableOpacity
                    style={[
                      styles.ownerToggleChip,
                      book.isExchangeable ? styles.ownerToggleChipActiveSwap : styles.ownerToggleChipInactive,
                    ]}
                    onPress={() => onToggleAvailability(!book.isExchangeable, book.isLendable)}
                    activeOpacity={0.75}
                  >
                    <Ionicons
                      name={book.isExchangeable ? 'checkmark-circle' : 'close-circle-outline'}
                      size={16}
                      color={book.isExchangeable ? Colors.successAccent : Colors.secondaryText}
                    />
                    <Text
                      style={[
                        styles.ownerToggleChipText,
                        book.isExchangeable && styles.ownerToggleChipTextSwap,
                      ]}
                    >
                      {book.isExchangeable ? 'Swap: Available ✓' : 'Swap: Off ✕'}
                    </Text>
                  </TouchableOpacity>

                  {/* Toggle Borrow */}
                  <TouchableOpacity
                    style={[
                      styles.ownerToggleChip,
                      book.isLendable ? styles.ownerToggleChipActiveBorrow : styles.ownerToggleChipInactive,
                    ]}
                    onPress={() => onToggleAvailability(book.isExchangeable, !book.isLendable)}
                    activeOpacity={0.75}
                  >
                    <Ionicons
                      name={book.isLendable ? 'checkmark-circle' : 'close-circle-outline'}
                      size={16}
                      color={book.isLendable ? Colors.primaryAccent : Colors.secondaryText}
                    />
                    <Text
                      style={[
                        styles.ownerToggleChipText,
                        book.isLendable && styles.ownerToggleChipTextBorrow,
                      ]}
                    >
                      {book.isLendable ? 'Borrow: Available ✓' : 'Borrow: Off ✕'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Summary */}
            <Text style={styles.sectionTitle}>Summary & Synopsis</Text>
            <Text style={styles.summaryText}>{book.summary}</Text>

            {/* CTA Action Buttons */}
            <View style={styles.ctaContainer}>
              {!book.isOwned ? (
                <>
                  {book.isExchangeable && onExchangeRequest && (
                    <PageTurnButton
                      text="Request Book Swap"
                      onPress={onExchangeRequest}
                      iconName="swap-horizontal"
                      style={styles.actionBtn}
                    />
                  )}

                  {book.isLendable && onBorrowRequest && (
                    <PageTurnButton
                      text="Request to Borrow"
                      isSecondary={book.isExchangeable}
                      onPress={onBorrowRequest}
                      iconName="book-outline"
                      style={[styles.actionBtn, { marginTop: 10 }]}
                    />
                  )}

                  {onMessageOwner && (
                    <TouchableOpacity
                      style={styles.messageOwnerRowBtn}
                      onPress={onMessageOwner}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="chatbubble-ellipses" size={18} color={Colors.primaryAccent} />
                      <Text style={styles.messageOwnerRowText}>Message {book.ownerName}</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View style={styles.ownedActionCard}>
                  <View style={styles.ownedActionHeader}>
                    <Ionicons name="sparkles" size={18} color={Colors.primaryAccent} />
                    <Text style={styles.ownedActionTitle}>Your Shelf Status</Text>
                  </View>
                  <Text style={styles.ownedActionDesc}>
                    {book.isExchangeable && book.isLendable
                      ? 'This book is actively available to community readers for both Swap & Borrow.'
                      : book.isExchangeable
                      ? 'This book is currently available for Swap only.'
                      : book.isLendable
                      ? 'This book is currently available for Borrow only.'
                      : 'This book is currently marked as Unavailable to other readers.'}
                  </Text>
                  {onToggleAvailability && (
                    <View style={styles.quickStatusActionRow}>
                      <TouchableOpacity
                        style={styles.quickMakeAvailableBtn}
                        onPress={() => onToggleAvailability(true, true)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                        <Text style={styles.quickMakeAvailableText}>Enable Swap & Borrow</Text>
                      </TouchableOpacity>

                      {(book.isExchangeable || book.isLendable) && (
                        <TouchableOpacity
                          style={styles.quickMakeUnavailableBtn}
                          onPress={() => onToggleAvailability(false, false)}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="lock-closed-outline" size={15} color={Colors.alertAccent} />
                          <Text style={styles.quickMakeUnavailableText}>Mark Unavailable</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
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
    marginTop: 6,
    marginBottom: 10,
  },
  badgeItem: {
    marginRight: 8,
    marginTop: 6,
  },
  ownerMessageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.primaryAccent,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 'auto',
  },
  ownerMessageText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryAccent,
    marginLeft: 4,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  statusChipSuccess: {
    backgroundColor: 'rgba(112, 138, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(112, 138, 129, 0.3)',
  },
  statusChipSuccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.successAccent,
    marginLeft: 5,
  },
  statusChipAccent: {
    backgroundColor: 'rgba(193, 140, 93, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(193, 140, 93, 0.3)',
  },
  statusChipAccentText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryAccent,
    marginLeft: 5,
  },
  statusChipMuted: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusChipMutedText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.secondaryText,
    marginLeft: 5,
  },
  statusChipNeutral: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusChipNeutralText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primaryText,
    marginLeft: 5,
  },
  ctaContainer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionBtn: {
    width: '100%',
  },
  messageOwnerRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(193, 140, 93, 0.1)',
    borderRadius: 24,
    paddingVertical: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(193, 140, 93, 0.3)',
  },
  messageOwnerRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryAccent,
    marginLeft: 6,
  },
  ownedInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(112, 138, 129, 0.12)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(112, 138, 129, 0.25)',
  },
  ownedInfoText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.successAccent,
    marginLeft: 8,
  },
  ownerManageBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  ownerManageHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  ownerManageSubtext: {
    fontSize: 11.5,
    color: Colors.secondaryText,
    marginBottom: 10,
    lineHeight: 16,
  },
  ownerToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ownerToggleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  ownerToggleChipActiveSwap: {
    backgroundColor: 'rgba(112, 138, 129, 0.12)',
    borderColor: Colors.successAccent,
  },
  ownerToggleChipActiveBorrow: {
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    borderColor: Colors.primaryAccent,
  },
  ownerToggleChipInactive: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    opacity: 0.7,
  },
  ownerToggleChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
    color: Colors.secondaryText,
  },
  ownerToggleChipTextSwap: {
    color: Colors.successAccent,
  },
  ownerToggleChipTextBorrow: {
    color: Colors.primaryAccent,
  },
  ownedActionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ownedActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ownedActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginLeft: 6,
  },
  ownedActionDesc: {
    fontSize: 12.5,
    color: Colors.secondaryText,
    lineHeight: 17,
    marginBottom: 14,
  },
  quickStatusActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickMakeAvailableBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryAccent,
    borderRadius: 20,
    paddingVertical: 10,
  },
  quickMakeAvailableText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  quickMakeUnavailableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(163, 74, 61, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(163, 74, 61, 0.3)',
  },
  quickMakeUnavailableText: {
    color: Colors.alertAccent,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
