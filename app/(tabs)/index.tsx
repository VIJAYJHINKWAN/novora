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
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../../components/UserAvatar';
import { BookCover } from '../../components/BookCover';
import { PageTurnBadge } from '../../components/PageTurnBadge';
import { PageTurnButton } from '../../components/PageTurnButton';
import { BookDetailsSheet } from '../../components/modals/BookDetailsSheet';
import { ReaderProfileSheet } from '../../components/modals/ReaderProfileSheet';
import { NotificationsModal } from '../../components/modals/NotificationsModal';
import { CreateStoryDialog } from '../../components/modals/CreateStoryDialog';
import { StoryViewerModal } from '../../components/modals/StoryViewerModal';
import { AddBookModal } from '../../components/modals/AddBookModal';
import { NearbyMapOverlay } from '../../components/NearbyMapOverlay';
import { BookSearchBar } from '../../components/BookSearchBar';
import { BookSearchResultCard } from '../../components/BookSearchResultCard';
import { ChatScreenOverlay } from '../../components/modals/ChatScreenOverlay';
import { SlideIndicatorScrollView } from '../../components/SlideIndicatorScrollView';

export default function HomeScreen() {
  const router = useRouter();
  const {
    books,
    readers,
    readingStories,
    notificationCount,
    showNotifications,
    setNotificationVisible,
    bookSearchQuery,
    setBookSearchQuery,
    bookAvailabilityFilter,
    setBookAvailabilityFilter,
    selectedGenreFilter,
    setGenreFilter,
    selectedBook,
    selectBook,
    selectedReader,
    selectReader,
    selectedChatId,
    selectChat,
    toggleLikeBook,
    addNewBook,
    updateBookAvailability,
    updateBookCover,
    deleteBook,
    promptDeleteBook,
    refreshAppData,
    createExchangeRequest,
    createBorrowRequest,
    activeStoryIndex,
    openStoryViewer,
    closeStoryViewer,
    showCreateStoryDialog,
    setShowCreateStoryDialog,
    addStory,
    toggleLikeStory,
    startBookChat,
  } = useApp();

  const [showAddBook, setShowAddBook] = useState(false);
  const [showMap, setShowMap] = useState(false);
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

  const defaultGenres = [
    'All',
    'Indian Lit',
    'Modern Fiction',
    'Classic Fiction',
    'Mythological Fiction',
    'Poetry',
    'Epic Drama',
  ];
  const genres = Array.from(
    new Set([...defaultGenres, ...books.map(b => b.genre).filter(Boolean)])
  );

  const isSearchActive = bookSearchQuery.trim().length > 0 || bookAvailabilityFilter !== 'ALL';

  const searchFilteredBooks = books.filter(b => {
    // Text search filter
    if (bookSearchQuery.trim()) {
      const q = bookSearchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchAuthor = b.author.toLowerCase().includes(q);
      const matchGenre = b.genre.toLowerCase().includes(q);
      const matchOwner = b.ownerName.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchGenre && !matchOwner) {
        return false;
      }
    }

    // Availability / Uploader filter
    if (bookAvailabilityFilter === 'OTHERS') {
      return !b.isOwned;
    }
    if (bookAvailabilityFilter === 'SWAP') {
      return b.isExchangeable;
    }
    if (bookAvailabilityFilter === 'BORROW') {
      return b.isLendable;
    }

    return true;
  });

  const filteredBooks = selectedGenreFilter === 'All'
    ? books
    : books.filter(b => b.genre === selectedGenreFilter);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>Litverse</Text>
        </View>

        <TouchableOpacity style={styles.notifBtn} onPress={() => setNotificationVisible(true)}>
          <Ionicons name="notifications-outline" size={24} color={Colors.primaryText} />
          {notificationCount > 0 && (
            <View style={styles.badgeDot}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Designated Book Search Bar Section (No collision with other UI) */}
      <BookSearchBar
        query={bookSearchQuery}
        onChangeQuery={setBookSearchQuery}
        availabilityFilter={bookAvailabilityFilter}
        onChangeFilter={setBookAvailabilityFilter}
        onClear={() => {
          setBookSearchQuery('');
          setBookAvailabilityFilter('ALL');
        }}
        totalResultsCount={searchFilteredBooks.length}
        isSearching={isSearchActive}
      />

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
        {isSearchActive ? (
          /* Search Results View */
          <View style={styles.searchResultsContainer}>
            <View style={styles.searchHeaderRow}>
              <View>
                <Text style={styles.searchSectionTitle}>Community Search Results</Text>
                <Text style={styles.searchSubtitle}>
                  {searchFilteredBooks.length === 1
                    ? '1 book matching your criteria'
                    : `${searchFilteredBooks.length} books matching your criteria`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setBookSearchQuery('');
                  setBookAvailabilityFilter('ALL');
                }}
                style={styles.clearSearchBadge}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={14} color={Colors.alertAccent} />
                <Text style={styles.clearSearchBadgeText}>Clear Search</Text>
              </TouchableOpacity>
            </View>

            {searchFilteredBooks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="book-outline" size={42} color={Colors.primaryAccent} />
                </View>
                <Text style={styles.emptyTitle}>No Books Found</Text>
                <Text style={styles.emptySubtitle}>
                  {bookSearchQuery.trim()
                    ? `No community books found for "${bookSearchQuery}".`
                    : 'No books match the selected availability filter.'}
                </Text>
                <PageTurnButton
                  text="View All Community Books"
                  onPress={() => {
                    setBookSearchQuery('');
                    setBookAvailabilityFilter('ALL');
                  }}
                  style={{ marginTop: 16 }}
                />
              </View>
            ) : (
              <View style={styles.cardsList}>
                {searchFilteredBooks.map(book => (
                  <BookSearchResultCard
                    key={book.id}
                    book={book}
                    onPress={() => selectBook(book)}
                    onSwap={() => createExchangeRequest(book)}
                    onBorrow={() => createBorrowRequest(book)}
                    onMessage={() => startBookChat(book.ownerName, book.title)}
                    onToggleLike={() => toggleLikeBook(book)}
                    onDelete={book.isOwned ? () => handleDeleteBook(book) : undefined}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          /* Standard Home Feed View */
          <>
            {/* Stories / Reading Notes Row */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reading Notes & Spotlights</Text>
            </View>

            <SlideIndicatorScrollView
              style={styles.storiesContainer}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {/* Add Story Button */}
              <TouchableOpacity
                style={styles.addStoryItem}
                onPress={() => setShowCreateStoryDialog(true)}
              >
                <View style={styles.addStoryCircle}>
                  <Ionicons name="add" size={24} color={Colors.primaryAccent} />
                </View>
                <Text style={styles.storyName}>Share Note</Text>
              </TouchableOpacity>

              {/* Stories List */}
              {readingStories.map((story, index) => (
                <TouchableOpacity
                  key={story.id}
                  style={styles.storyItem}
                  onPress={() => openStoryViewer(index)}
                >
                  <View style={styles.storyRing}>
                    <UserAvatar name={story.authorName} size={48} />
                  </View>
                  <Text style={styles.storyName} numberOfLines={1}>
                    {story.authorName.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </SlideIndicatorScrollView>

            {/* Genre Filter Chips */}
            <SlideIndicatorScrollView
              style={styles.chipsContainer}
              contentContainerStyle={{ paddingRight: 24 }}
            >
              {genres.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, selectedGenreFilter === g && styles.chipActive]}
                  onPress={() => setGenreFilter(g)}
                >
                  <Text style={[styles.chipText, selectedGenreFilter === g && styles.chipTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </SlideIndicatorScrollView>

            {/* Featured Readers Nearby */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Featured Readers Nearby</Text>
              <TouchableOpacity style={styles.mapToggleBtn} onPress={() => setShowMap(true)}>
                <Ionicons name="map-outline" size={16} color={Colors.primaryAccent} />
                <Text style={styles.mapToggleText}>Map View</Text>
              </TouchableOpacity>
            </View>

            <SlideIndicatorScrollView
              style={styles.readersContainer}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {readers.map(reader => (
                <TouchableOpacity
                  key={reader.id}
                  style={styles.readerCard}
                  onPress={() => selectReader(reader)}
                >
                  <UserAvatar name={reader.name} size={48} />
                  <View style={styles.readerInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.readerName} numberOfLines={1}>{reader.name}</Text>
                      {reader.verificationBadge && (
                        <Ionicons name="checkmark-circle" size={14} color={Colors.primaryAccent} style={{ marginLeft: 2 }} />
                      )}
                    </View>
                    <Text style={styles.matchScore}>{reader.matchPercentage}% Match • {reader.readingScore} pts</Text>
                    <Text style={styles.readerBio} numberOfLines={2}>{reader.bio}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </SlideIndicatorScrollView>

            {/* Community Shelf Feed */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Community Shelf</Text>
            </View>

            <View style={styles.cardsList}>
              {filteredBooks.map(book => (
                <BookSearchResultCard
                  key={book.id}
                  book={book}
                  onPress={() => selectBook(book)}
                  onSwap={() => createExchangeRequest(book)}
                  onBorrow={() => createBorrowRequest(book)}
                  onMessage={() => startBookChat(book.ownerName, book.title)}
                  onToggleLike={() => toggleLikeBook(book)}
                  onDelete={book.isOwned ? () => handleDeleteBook(book) : undefined}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddBook(true)}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modals */}
      {showNotifications && (
        <NotificationsModal onDismiss={() => setNotificationVisible(false)} />
      )}

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

      {selectedReader && (
        <ReaderProfileSheet
          reader={selectedReader}
          onDismiss={() => selectReader(null)}
          onChatClick={() => {
            startBookChat(selectedReader.name, 'your collection');
          }}
        />
      )}

      {showCreateStoryDialog && (
        <CreateStoryDialog
          onDismiss={() => setShowCreateStoryDialog(false)}
          onPostStory={addStory}
        />
      )}

      {activeStoryIndex !== null && readingStories[activeStoryIndex] && (
        <StoryViewerModal
          story={readingStories[activeStoryIndex]}
          currentIndex={activeStoryIndex}
          totalStories={readingStories.length}
          onDismiss={closeStoryViewer}
          onLikeToggle={() => toggleLikeStory(readingStories[activeStoryIndex].id)}
          onNext={() => openStoryViewer((activeStoryIndex + 1) % readingStories.length)}
          onPrev={() => openStoryViewer((activeStoryIndex - 1 + readingStories.length) % readingStories.length)}
        />
      )}

      {showAddBook && (
        <AddBookModal
          onDismiss={() => setShowAddBook(false)}
          onAddBook={addNewBook}
        />
      )}

      {showMap && (
        <NearbyMapOverlay onDismiss={() => setShowMap(false)} />
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.secondaryBg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  notifBtn: {
    padding: 6,
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: Colors.alertAccent,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  mapToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  mapToggleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  storiesContainer: {
    paddingLeft: 20,
    marginBottom: 10,
  },
  addStoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  addStoryCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: Colors.primaryAccent,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyRing: {
    padding: 2,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.primaryAccent,
  },
  storyName: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.primaryText,
    marginTop: 4,
  },
  chipsContainer: {
    paddingLeft: 20,
    marginVertical: 12,
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
  readersContainer: {
    paddingLeft: 20,
    marginBottom: 10,
  },
  readerCard: {
    width: 220,
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
  },
  readerInfo: {
    marginTop: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  matchScore: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.successAccent,
    marginTop: 2,
  },
  readerBio: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 4,
    lineHeight: 15,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 12,
  },
  bookCover: {
    width: 84,
    height: 120,
  },
  bookDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  bookGenreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginLeft: 4,
  },
  bookTitle: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  bookOwner: {
    fontSize: 11,
    color: Colors.primaryAccent,
    fontWeight: '500',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginLeft: 3,
  },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 84,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  searchResultsContainer: {
    paddingTop: 14,
  },
  searchHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  searchSectionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  searchSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  clearSearchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163, 74, 61, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  clearSearchBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.alertAccent,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    marginTop: 14,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardsList: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
});