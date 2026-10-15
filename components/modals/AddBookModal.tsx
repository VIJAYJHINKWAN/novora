import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { PageTurnTextField } from '../PageTurnTextField';
import { PageTurnButton } from '../PageTurnButton';
import { BookCover } from '../BookCover';
import {
  searchBookSuggestions,
  fetchFullDescription,
  fetchOriginalCover,
  BookSuggestion,
  DEFAULT_APP_GENRES,
} from '../../services/bookSearch';

interface AddBookModalProps {
  onDismiss: () => void;
  onAddBook: (
    title: string,
    author: string,
    genre: string,
    summary: string,
    classification: string,
    coverUrl?: string,
    isExchangeable?: boolean,
    isLendable?: boolean
  ) => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  onDismiss,
  onAddBook,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Indian Lit');
  const [summary, setSummary] = useState('');
  const [classification, setClassification] = useState('Owned');
  const [isExchangeable, setIsExchangeable] = useState(true);
  const [isLendable, setIsLendable] = useState(true);
  const [coverUrl, setCoverUrl] = useState('');

  // Autocomplete suggestions state
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autofilledBookTitle, setAutofilledBookTitle] = useState<string | null>(null);

  // Cover loading state
  const [isCoverLoading, setIsCoverLoading] = useState(false);
  const lastResolvedPairRef = useRef({ title: '', author: '' });

  // Suggested genres apart from standard genres
  const [novelGenres, setNovelGenres] = useState<string[]>([]);

  // Custom genre input state
  const [showCustomGenreInput, setShowCustomGenreInput] = useState(false);
  const [customGenreText, setCustomGenreText] = useState('');

  const classifications = ['Owned', 'Read', 'Currently Reading', 'Wishlist'];
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Authors suggested based on current title search results
  const authorSuggestions = Array.from(
    new Set(
      suggestions
        .map(s => s.author)
        .filter(a => Boolean(a) && a !== 'Unknown Author')
    )
  ).slice(0, 3);

  // Debounced search when title changes
  useEffect(() => {
    // If the title was set by autofill selection, don't re-trigger suggestions search
    if (autofilledBookTitle && title === autofilledBookTitle) {
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmed = title.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchBookSuggestions(trimmed);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [title, autofilledBookTitle]);

  // Automatic cover resolution helper
  const autoResolveOriginalCover = async (bookTitle: string, authorName: string) => {
    const t = (bookTitle || '').trim();
    const a = (authorName || '').trim();
    if (!t || t.length < 2) return;

    lastResolvedPairRef.current = { title: t, author: a };
    setIsCoverLoading(true);

    try {
      const res = await fetchOriginalCover(t, a);
      if (res.coverUrl) {
        setCoverUrl(res.coverUrl);
      }
      if (res.summary && !summary.trim()) {
        setSummary(res.summary);
      }
      if (res.genres && res.genres.length > 0) {
        const novel = res.genres.filter(g => !DEFAULT_APP_GENRES.includes(g));
        if (novel.length > 0) {
          setNovelGenres(prev => Array.from(new Set([...novel, ...prev])));
          // If genre is still default, switch to novel genre
          if (genre === 'Indian Lit' || DEFAULT_APP_GENRES.includes(genre)) {
            setGenre(novel[0]);
          }
        }
      }
    } catch (e) {
    } finally {
      setIsCoverLoading(false);
    }
  };

  // Automatically fetch original cover when BOTH book and author are entered
  useEffect(() => {
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (trimmedTitle.length >= 2 && trimmedAuthor.length >= 2) {
      const last = lastResolvedPairRef.current;
      if (
        last.title.toLowerCase() !== trimmedTitle.toLowerCase() ||
        last.author.toLowerCase() !== trimmedAuthor.toLowerCase()
      ) {
        const timer = setTimeout(() => {
          autoResolveOriginalCover(trimmedTitle, trimmedAuthor);
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [title, author]);

  // Handle selecting a book suggestion
  const handleSelectSuggestion = async (item: BookSuggestion) => {
    setTitle(item.title);
    setAuthor(item.author);
    setAutofilledBookTitle(item.title);
    setShowSuggestions(false);

    // Immediately change the cover to original cover if present on the item
    if (item.coverUrl) {
      setCoverUrl(item.coverUrl);
    }

    setSummary(item.summary || '');

    // Identify genres suggested for this book apart from the default app genres
    const detectedNovelGenres = item.suggestedGenres.filter(
      g => !DEFAULT_APP_GENRES.includes(g)
    );

    if (detectedNovelGenres.length > 0) {
      setNovelGenres(detectedNovelGenres);
      setGenre(detectedNovelGenres[0]);
    } else if (item.suggestedGenres.length > 0) {
      setGenre(item.suggestedGenres[0]);
    }

    // Automatically resolve original high-res cover
    await autoResolveOriginalCover(item.title, item.author);

    // If summary was brief, fetch full description in background
    if (item.workKey && (!item.summary || item.summary.length < 80)) {
      fetchFullDescription(item.workKey).then(fullDesc => {
        if (fullDesc) {
          setSummary(fullDesc);
        }
      });
    }
  };

  // Handle selecting an author suggestion
  const handleSelectAuthor = async (selectedAuthor: string) => {
    setAuthor(selectedAuthor);
    await autoResolveOriginalCover(title, selectedAuthor);
  };

  const handleApplyCustomGenre = () => {
    const trimmed = customGenreText.trim();
    if (trimmed) {
      setGenre(trimmed);
      if (!novelGenres.includes(trimmed) && !DEFAULT_APP_GENRES.includes(trimmed)) {
        setNovelGenres(prev => [trimmed, ...prev]);
      }
      setCustomGenreText('');
      setShowCustomGenreInput(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !author.trim()) return;
    onAddBook(
      title.trim(),
      author.trim(),
      genre,
      summary.trim(),
      classification,
      coverUrl.trim() || undefined,
      isExchangeable,
      isLendable
    );
    onDismiss();
  };

  return (
    <Modal animationType="slide" transparent visible onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss} />
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
            <Ionicons name="close" size={24} color={Colors.primaryText} />
          </TouchableOpacity>

          <Text style={styles.heading}>Add Book to Shelf</Text>
          <Text style={styles.subheading}>
            Select book & author to automatically apply original book cover art.
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Live Book Cover Preview Banner */}
            <View style={styles.previewCard}>
              <BookCover
                title={title || 'Book Title'}
                author={author || 'Author'}
                coverUrl={coverUrl || null}
                style={styles.previewCover}
              />
              <View style={styles.previewInfo}>
                <View style={styles.coverBadgeRow}>
                  {isCoverLoading ? (
                    <View style={styles.loadingBadge}>
                      <ActivityIndicator size="small" color={Colors.primaryAccent} />
                      <Text style={styles.loadingBadgeText}>Finding original cover...</Text>
                    </View>
                  ) : coverUrl ? (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                      <Text style={styles.verifiedText}>Original Cover Applied ✓</Text>
                    </View>
                  ) : (
                    <View style={styles.defaultBadge}>
                      <Ionicons name="sparkles" size={12} color={Colors.primaryAccent} />
                      <Text style={styles.defaultBadgeText}>Live Cover Preview</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.previewTitle} numberOfLines={2}>
                  {title || 'Untitled Book'}
                </Text>
                <Text style={styles.previewAuthor} numberOfLines={1}>
                  {author ? `by ${author}` : 'Author not set'}
                </Text>

                <View style={styles.previewGenrePill}>
                  <Text style={styles.previewGenreText}>{genre}</Text>
                </View>

                {coverUrl ? (
                  <TouchableOpacity
                    style={styles.clearCoverBtn}
                    onPress={() => setCoverUrl('')}
                  >
                    <Ionicons name="refresh-outline" size={12} color={Colors.secondaryText} />
                    <Text style={styles.clearCoverText}>Reset to Gradient Cover</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {/* Book Title Input with Autocomplete */}
            <View style={styles.titleInputContainer}>
              <PageTurnTextField
                label="Book Title *"
                value={title}
                onChangeText={text => {
                  setTitle(text);
                  setAutofilledBookTitle(null);
                }}
                placeholder="e.g. Midnight's Children, Atomic Habits..."
                iconName="book-outline"
                rightIconName={title.length > 0 ? 'close-circle' : undefined}
                onRightIconPress={() => {
                  setTitle('');
                  setAutofilledBookTitle(null);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              />

              {/* Searching Indicator */}
              {isSearching && (
                <View style={styles.searchingRow}>
                  <ActivityIndicator size="small" color={Colors.primaryAccent} />
                  <Text style={styles.searchingText}>Searching titles & original cover art...</Text>
                </View>
              )}

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <View style={styles.suggestionsHeader}>
                    <Ionicons name="sparkles" size={14} color={Colors.primaryAccent} />
                    <Text style={styles.suggestionsHeaderText}>
                      Tap a book to automatically autofill author & original cover:
                    </Text>
                  </View>

                  {suggestions.slice(0, 5).map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.suggestionRow}
                      activeOpacity={0.7}
                      onPress={() => handleSelectSuggestion(item)}
                    >
                      {item.coverUrl ? (
                        <Image
                          source={{ uri: item.coverUrl }}
                          style={styles.suggestionThumbnail}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.suggestionThumbnailPlaceholder}>
                          <Ionicons name="book" size={18} color={Colors.primaryAccent} />
                        </View>
                      )}

                      <View style={styles.suggestionDetails}>
                        <Text style={styles.suggestionTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.suggestionAuthor} numberOfLines={1}>
                          by {item.author}
                          {item.firstPublishYear ? ` (${item.firstPublishYear})` : ''}
                        </Text>

                        {item.suggestedGenres && item.suggestedGenres.length > 0 && (
                          <View style={styles.suggestionTagsRow}>
                            {item.suggestedGenres.slice(0, 2).map((g, idx) => (
                              <View key={idx} style={styles.suggestionMiniTag}>
                                <Text style={styles.suggestionMiniTagText}>{g}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={Colors.secondaryText}
                        style={{ marginLeft: 6 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Author Name Input */}
            <View style={{ position: 'relative' }}>
              <PageTurnTextField
                label="Author Name *"
                value={author}
                onChangeText={text => {
                  setAuthor(text);
                }}
                placeholder="e.g. Salman Rushdie"
                iconName="person-outline"
              />

              {/* Author Quick Suggestion Pills */}
              {authorSuggestions.length > 0 && !author.trim() && (
                <View style={styles.authorSuggestionsBox}>
                  <Text style={styles.authorSuggestionsLabel}>Suggested Author for "{title}":</Text>
                  <View style={styles.authorSuggestionsRow}>
                    {authorSuggestions.map((a, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.authorSuggestChip}
                        onPress={() => handleSelectAuthor(a)}
                      >
                        <Ionicons name="person" size={12} color={Colors.primaryAccent} style={{ marginRight: 4 }} />
                        <Text style={styles.authorSuggestChipText}>{a}</Text>
                        <Ionicons name="arrow-forward-circle" size={14} color={Colors.primaryAccent} style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Genre Classification */}
            <Text style={styles.sectionLabel}>Genre Classification</Text>

            {/* DYNAMIC SUGGESTED GENRES (Apart from standard app genres) */}
            {novelGenres.length > 0 && (
              <View style={styles.suggestedGenreBox}>
                <View style={styles.suggestedGenreHeader}>
                  <Ionicons name="sparkles" size={14} color="#8B5CF6" />
                  <Text style={styles.suggestedGenreTitle}>
                    Suggested for this Book (Apart from Standard Genres):
                  </Text>
                </View>
                <View style={styles.chipsRow}>
                  {novelGenres.map(g => {
                    const isSelected = genre === g;
                    return (
                      <TouchableOpacity
                        key={g}
                        style={[
                          styles.suggestedChip,
                          isSelected && styles.suggestedChipActive,
                        ]}
                        onPress={() => setGenre(g)}
                      >
                        <Ionicons
                          name="sparkles-sharp"
                          size={11}
                          color={isSelected ? '#FFFFFF' : '#8B5CF6'}
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          style={[
                            styles.suggestedChipText,
                            isSelected && styles.suggestedChipTextActive,
                          ]}
                        >
                          {g}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* STANDARD APP GENRES */}
            <Text style={styles.subSectionLabel}>Standard App Genres</Text>
            <View style={styles.chipsRow}>
              {DEFAULT_APP_GENRES.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, genre === g && styles.chipActive]}
                  onPress={() => setGenre(g)}
                >
                  <Text style={[styles.chipText, genre === g && styles.chipTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Add Custom Genre Button */}
              <TouchableOpacity
                style={[styles.chip, styles.customGenreChip]}
                onPress={() => setShowCustomGenreInput(!showCustomGenreInput)}
              >
                <Ionicons
                  name={showCustomGenreInput ? 'close' : 'add'}
                  size={14}
                  color={Colors.primaryAccent}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.customGenreChipText}>Custom Genre</Text>
              </TouchableOpacity>
            </View>

            {/* Custom Genre Input Box */}
            {showCustomGenreInput && (
              <View style={styles.customGenreInputRow}>
                <TextInput
                  value={customGenreText}
                  onChangeText={setCustomGenreText}
                  placeholder="e.g. Cyberpunk, Memoir, Space Opera..."
                  placeholderTextColor="rgba(85, 85, 85, 0.4)"
                  style={styles.customGenreTextInput}
                  onSubmitEditing={handleApplyCustomGenre}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.customGenreAddBtn}
                  onPress={handleApplyCustomGenre}
                  disabled={!customGenreText.trim()}
                >
                  <Text style={styles.customGenreAddBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Community Availability Settings */}
            <Text style={styles.sectionLabel}>Community Availability (Decide Status)</Text>
            <Text style={styles.sectionHelpText}>
              Decide whether this book will be available for swap or borrow by other community readers:
            </Text>

            {/* Quick Preset Buttons */}
            <View style={styles.presetButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  isExchangeable && isLendable && styles.presetBtnActive,
                ]}
                onPress={() => {
                  setIsExchangeable(true);
                  setIsLendable(true);
                }}
                activeOpacity={0.75}
              >
                <Text style={[styles.presetBtnText, isExchangeable && isLendable && styles.presetBtnTextActive]}>
                  ⇄ & 📖 Swap & Borrow
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  isExchangeable && !isLendable && styles.presetBtnActive,
                ]}
                onPress={() => {
                  setIsExchangeable(true);
                  setIsLendable(false);
                }}
                activeOpacity={0.75}
              >
                <Text style={[styles.presetBtnText, isExchangeable && !isLendable && styles.presetBtnTextActive]}>
                  ⇄ Swap Only
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  !isExchangeable && isLendable && styles.presetBtnActive,
                ]}
                onPress={() => {
                  setIsExchangeable(false);
                  setIsLendable(true);
                }}
                activeOpacity={0.75}
              >
                <Text style={[styles.presetBtnText, !isExchangeable && isLendable && styles.presetBtnTextActive]}>
                  📖 Borrow Only
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  !isExchangeable && !isLendable && styles.presetBtnActiveAlert,
                ]}
                onPress={() => {
                  setIsExchangeable(false);
                  setIsLendable(false);
                }}
                activeOpacity={0.75}
              >
                <Text style={[styles.presetBtnText, !isExchangeable && !isLendable && styles.presetBtnTextActiveAlert]}>
                  🔒 Unavailable
                </Text>
              </TouchableOpacity>
            </View>

            {/* Interactive Availability Toggle Cards */}
            <View style={styles.availabilityCardsRow}>
              {/* Swap Toggle Card */}
              <TouchableOpacity
                style={[
                  styles.availCard,
                  isExchangeable ? styles.availCardActiveSwap : styles.availCardInactive,
                ]}
                onPress={() => setIsExchangeable(!isExchangeable)}
                activeOpacity={0.8}
              >
                <View style={styles.availCardHeader}>
                  <View style={[styles.availIconCircle, isExchangeable && styles.availIconCircleSwap]}>
                    <Ionicons
                      name="swap-horizontal"
                      size={18}
                      color={isExchangeable ? Colors.successAccent : Colors.secondaryText}
                    />
                  </View>
                  <View style={[styles.toggleBadge, isExchangeable ? styles.toggleBadgeOn : styles.toggleBadgeOff]}>
                    <Text style={[styles.toggleBadgeText, isExchangeable ? styles.toggleBadgeTextOn : styles.toggleBadgeTextOff]}>
                      {isExchangeable ? 'SWAP: ON' : 'SWAP: OFF'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.availCardTitle}>Available for Swap</Text>
                <Text style={styles.availCardDesc}>
                  Other readers can offer an exchange for this book.
                </Text>
              </TouchableOpacity>

              {/* Borrow Toggle Card */}
              <TouchableOpacity
                style={[
                  styles.availCard,
                  isLendable ? styles.availCardActiveBorrow : styles.availCardInactive,
                ]}
                onPress={() => setIsLendable(!isLendable)}
                activeOpacity={0.8}
              >
                <View style={styles.availCardHeader}>
                  <View style={[styles.availIconCircle, isLendable && styles.availIconCircleBorrow]}>
                    <Ionicons
                      name="book-outline"
                      size={18}
                      color={isLendable ? Colors.primaryAccent : Colors.secondaryText}
                    />
                  </View>
                  <View style={[styles.toggleBadge, isLendable ? styles.toggleBadgeOnAccent : styles.toggleBadgeOff]}>
                    <Text style={[styles.toggleBadgeText, isLendable ? styles.toggleBadgeTextOnAccent : styles.toggleBadgeTextOff]}>
                      {isLendable ? 'BORROW: ON' : 'BORROW: OFF'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.availCardTitle}>Available to Borrow</Text>
                <Text style={styles.availCardDesc}>
                  Other readers can request to borrow this book.
                </Text>
              </TouchableOpacity>
            </View>

            {/* Shelf Status */}
            <Text style={styles.sectionLabel}>Personal Shelf Status</Text>
            <View style={styles.chipsRow}>
              {classifications.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, classification === c && styles.chipActive]}
                  onPress={() => setClassification(c)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      classification === c && styles.chipTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Short Summary / Synopsis */}
            <PageTurnTextField
              label="Short Summary / Synopsis"
              value={summary}
              onChangeText={setSummary}
              placeholder="Brief description of the book (autofilled from catalog if available)..."
              multiline
              numberOfLines={3}
            />

            {/* Add Book Button */}
            <PageTurnButton
              text="Add to Collection (+10 pts)"
              onPress={handleSubmit}
              disabled={!title.trim() || !author.trim()}
              iconName="add-circle"
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
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
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  subheading: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Live Book Cover Preview Card
  previewCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(193, 140, 93, 0.25)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  previewCover: {
    width: 68,
    height: 98,
    borderRadius: 8,
    marginRight: 14,
  },
  previewInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  coverBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  loadingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 6,
  },
  loadingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryAccent,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryAccent,
  },
  previewTitle: {
    fontFamily: Fonts.serif,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 2,
  },
  previewAuthor: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  previewGenrePill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.cardBg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  previewGenreText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryAccent,
  },
  clearCoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  clearCoverText: {
    fontSize: 10,
    color: Colors.secondaryText,
    textDecorationLine: 'underline',
  },

  // Autocomplete Container & Rows
  titleInputContainer: {
    position: 'relative',
    zIndex: 20,
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -4,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  searchingText: {
    fontSize: 11,
    color: Colors.primaryAccent,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.primaryAccent,
    marginTop: 4,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(193, 140, 93, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 6,
  },
  suggestionsHeaderText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryAccent,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionThumbnail: {
    width: 38,
    height: 52,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: Colors.cardBg,
  },
  suggestionThumbnailPlaceholder: {
    width: 38,
    height: 52,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionDetails: {
    flex: 1,
  },
  suggestionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  suggestionAuthor: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  suggestionTagsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  suggestionMiniTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  suggestionMiniTagText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#7C3AED',
  },

  // Author Suggestions Styling
  authorSuggestionsBox: {
    marginTop: -4,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  authorSuggestionsLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  authorSuggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  authorSuggestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(193, 140, 93, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(193, 140, 93, 0.35)',
  },
  authorSuggestChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryAccent,
  },

  // Genre & Suggested Genre styling
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 14,
    marginBottom: 8,
  },
  subSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondaryText,
    marginTop: 8,
    marginBottom: 6,
  },
  suggestedGenreBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.06)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    marginBottom: 10,
  },
  suggestedGenreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  suggestedGenreTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  suggestedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  suggestedChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  suggestedChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
  suggestedChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: Colors.primaryAccent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primaryText,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  customGenreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryAccent,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  customGenreChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryAccent,
  },
  customGenreInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primaryAccent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  customGenreTextInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.primaryText,
    paddingVertical: Platform.OS === 'android' ? 4 : 8,
  },
  customGenreAddBtn: {
    backgroundColor: Colors.primaryAccent,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  customGenreAddBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionHelpText: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 10,
    marginTop: -4,
    lineHeight: 16,
  },
  presetButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  presetBtn: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetBtnActive: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  presetBtnActiveAlert: {
    backgroundColor: 'rgba(163, 74, 61, 0.12)',
    borderColor: Colors.alertAccent,
  },
  presetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  presetBtnTextActive: {
    color: '#FFFFFF',
  },
  presetBtnTextActiveAlert: {
    color: Colors.alertAccent,
  },
  availabilityCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  availCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
  },
  availCardActiveSwap: {
    backgroundColor: 'rgba(112, 138, 129, 0.08)',
    borderColor: Colors.successAccent,
  },
  availCardActiveBorrow: {
    backgroundColor: 'rgba(193, 140, 93, 0.08)',
    borderColor: Colors.primaryAccent,
  },
  availCardInactive: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
    opacity: 0.8,
  },
  availCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  availIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availIconCircleSwap: {
    backgroundColor: 'rgba(112, 138, 129, 0.15)',
  },
  availIconCircleBorrow: {
    backgroundColor: 'rgba(193, 140, 93, 0.15)',
  },
  toggleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  toggleBadgeOn: {
    backgroundColor: Colors.successAccent,
  },
  toggleBadgeOnAccent: {
    backgroundColor: Colors.primaryAccent,
  },
  toggleBadgeOff: {
    backgroundColor: 'rgba(85, 85, 85, 0.12)',
  },
  toggleBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  toggleBadgeTextOn: {
    color: '#FFFFFF',
  },
  toggleBadgeTextOnAccent: {
    color: '#FFFFFF',
  },
  toggleBadgeTextOff: {
    color: Colors.secondaryText,
  },
  availCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  availCardDesc: {
    fontSize: 10.5,
    color: Colors.secondaryText,
    lineHeight: 14,
  },
});
