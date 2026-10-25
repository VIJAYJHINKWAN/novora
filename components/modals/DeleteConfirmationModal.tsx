import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../../types';
import { Colors, Fonts } from '../../constants/theme';
import { BookCover } from '../BookCover';

interface DeleteConfirmationModalProps {
  visible: boolean;
  book: Book | null;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  book,
  isDeleting = false,
  onConfirm,
  onCancel,
}) => {
  if (!book) return null;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={isDeleting ? undefined : onCancel}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={isDeleting ? undefined : onCancel}
        />

        <View style={styles.dialogContainer}>
          {/* Warning Icon Badge */}
          <View style={styles.warningIconBadge}>
            <Ionicons name="warning" size={32} color="#DC2626" />
          </View>

          {/* Dialog Title */}
          <Text style={styles.dialogTitle}>Are you sure?</Text>
          <Text style={styles.dialogSubtitle}>
            Do you want to permanently delete this book?
          </Text>

          {/* Book Snapshot Preview Card */}
          <View style={styles.bookPreviewCard}>
            <View style={styles.coverThumbnailWrapper}>
              <BookCover
                title={book.title}
                author={book.author}
                coverId={book.coverResId}
                coverUrl={book.coverUrl}
                style={styles.coverThumbnail}
              />
            </View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {book.title}
              </Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>
                by {book.author}
              </Text>
              {Boolean(book.genre) && (
                <View style={styles.genreTag}>
                  <Text style={styles.genreTagText}>{book.genre}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Warning Impact Description */}
          <View style={styles.warningNoticeBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" style={{ marginTop: 1 }} />
            <Text style={styles.warningNoticeText}>
              This book will be removed completely from your shelf, your library, and the community feed of other readers.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onCancel}
              disabled={isDeleting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>No, Keep Book</Text>
            </TouchableOpacity>

            {/* Confirm Delete Button */}
            <TouchableOpacity
              style={[styles.btn, styles.deleteBtn, isDeleting && styles.btnDisabled]}
              onPress={onConfirm}
              disabled={isDeleting}
              activeOpacity={0.8}
            >
              {isDeleting ? (
                <View style={styles.deletingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.deleteBtnText}>Deleting...</Text>
                </View>
              ) : (
                <View style={styles.deletingRow}>
                  <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.deleteBtnText}>Yes, Delete</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialogContainer: {
    width: Math.min(SCREEN_WIDTH - 40, 380),
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  warningIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  dialogTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 6,
    textAlign: 'center',
  },
  dialogSubtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  bookPreviewCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: 14,
  },
  coverThumbnailWrapper: {
    width: 44,
    height: 62,
    borderRadius: 6,
    overflow: 'hidden',
  },
  coverThumbnail: {
    width: 44,
    height: 62,
    borderRadius: 6,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryText,
    lineHeight: 18,
  },
  bookAuthor: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  genreTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(193, 140, 93, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  genreTagText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.primaryAccent,
  },
  warningNoticeBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    gap: 8,
    marginBottom: 20,
  },
  warningNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#B91C1C',
    lineHeight: 16,
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  deleteBtn: {
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  deletingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.7,
  },
});
