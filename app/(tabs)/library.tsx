import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Fonts } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../../components/BookCover';
import { PageTurnBadge } from '../../components/PageTurnBadge';
import { BookDetailsSheet } from '../../components/modals/BookDetailsSheet';

export default function LibraryScreen() {
  const { books, selectedBook, selectBook, toggleLikeBook, createExchangeRequest } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
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
        </ScrollView>

        {/* Books Grid */}
        <View style={styles.grid}>
          {filteredBooks.map(book => (
            <TouchableOpacity
              key={book.id}
              style={styles.gridItem}
              onPress={() => selectBook(book)}
            >
              <BookCover title={book.title} author={book.author} coverId={book.coverResId} coverUrl={book.coverUrl} style={styles.cover} />
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>

              <View style={styles.badgeRow}>
                {book.isExchangeable && <PageTurnBadge text="Exchange" isSuccess style={{ marginTop: 4 }} />}
                {book.isWishlist && <PageTurnBadge text="Wishlist" isAccent style={{ marginTop: 4 }} />}
              </View>
            </TouchableOpacity>
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
          onToggleLike={() => toggleLikeBook(selectedBook)}
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
    paddingBottom: 40,
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
