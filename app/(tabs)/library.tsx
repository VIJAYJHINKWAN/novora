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
import { BookCover } from '../../components/BookCover';
import { PageTurnBadge } from '../../components/PageTurnBadge';
import { BookDetailsSheet } from '../../components/modals/BookDetailsSheet';
import { ChatScreenOverlay } from '../../components/modals/ChatScreenOverlay';
import { SlideIndicatorScrollView } from '../../components/SlideIndicatorScrollView';

export default function LibraryScreen() {
  const {
    books,
    selectedBook,
    selectBook,
    toggleLikeBook,
    createExchangeRequest,
    createBorrowRequest,
    startBookChat,
    selectedChatId,
    selectChat,
    updateBookAvailability,
    updateBookCover,
    deleteBook,
    promptDeleteBook,
    refreshAppData,
  } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAppData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteBook = (book: any) => {
    if (book.isOwned) {
      promptDeleteBook(book);
    }
  };

  const filters = ['All', 'My Shelf', 'Read', 'Wishlist', 'Exchangeable', 'Lendable'];

  const filteredBooks = books.filter(book => {
    switch (activeFilter) {
      case 'My Shelf':
        return book.isOwned;
      case 'Read':
        return book.isRead;
      case 'Wishlist':
        return book.isWishlist;
      case 'Exchangeable':
        return book.isExchangeable;
      case 'Lendable':
        return book.isLendable;
      default:
        return true;
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Literary Library</Text>
        <Text style={styles.headerSubtitle}>Manage your shelf, wishlist, and active swaps.</Text>
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
        {/* Filter Chips with slide indicator arrow */}
        <SlideIndicatorScrollView
          style={styles.chipsContainer}
          contentContainerStyle={{ paddingRight: 24 }}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.chip, activeFilter === filter && styles.chipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.chipText, activeFilter === filter && styles.chipTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </SlideIndicatorScrollView>

        {/* Books Grid */}
        <View style={styles.grid}>
          {filteredBooks.map(book => (
            <View key={book.id} style={styles.gridItem}>
              <View style={styles.gridCoverWrapper}>
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => selectBook(book)}
                >
                  <BookCover title={book.title} author={book.author} coverId={book.coverResId} coverUrl={book.coverUrl} style={styles.cover} />
                </TouchableOpacity>
                {book.isOwned && (
                  <TouchableOpacity
                    style={styles.gridDeleteBtn}
                    onPress={() => handleDeleteBook(book)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash" size={11} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>

              <View style={styles.badgeRow}>
                {book.isExchangeable && <PageTurnBadge text="Exchange" isSuccess style={{ marginTop: 4 }} />}
                {book.isWishlist && <PageTurnBadge text="Wishlist" isAccent style={{ marginTop: 4 }} />}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetailsSheet
          book={selectedBook}
          onDismiss={() => selectBook(null)}
          onExchangeRequest={() => {
            createExchangeRequest(selectedBook);
            selectBook(null);
          }}
          onBorrowRequest={() => {
            createBorrowRequest(selectedBook);
            selectBook(null);
          }}
          onMessageOwner={() => {
            startBookChat(selectedBook.ownerName, selectedBook.title);
            selectBook(null);
          }}
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

      {selectedChatId && (
        <ChatScreenOverlay
          chatId={selectedChatId}
          onDismiss={() => selectChat(null)}
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
  header: {
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
  headerSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  chipsContainer: {
    paddingLeft: 20,
    marginVertical: 14,
  },
  chip: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.primaryAccent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
  },
  gridItem: {
    width: '33.33%',
    padding: 6,
    marginBottom: 12,
  },
  gridCoverWrapper: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridDeleteBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cover: {
    height: 140,
    width: '100%',
  },
  bookTitle: {
    fontFamily: Fonts.serif,
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 6,
  },
  bookAuthor: {
    fontSize: 10,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
