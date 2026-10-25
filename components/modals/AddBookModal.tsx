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
  Alert,
} from 'react-native';
import { DevicePhotoPickerModal } from './DevicePhotoPickerModal';
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
  const [actualBookPhoto, setActualBookPhoto] = useState<string | null>(null);
  const [webDerivedCoverUrl, setWebDerivedCoverUrl] = useState<string | null>(null);
  const [customPhotoUri, setCustomPhotoUri] = useState<string | null>(null);
  const [coverSource, setCoverSource] = useState<'web' | 'custom' | 'gradient'>('web');
  const [showDevicePickerModal, setShowDevicePickerModal] = useState(false);

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
  const searchTimeoutRef = useRef<any>(null);

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
        setWebDerivedCoverUrl(res.coverUrl);
        // Only apply web cover if user hasn't explicitly chosen their own custom photo
        if (coverSource !== 'custom') {
          setCoverUrl(res.coverUrl);
          setCoverSource('web');
        }
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

    // Immediately record and apply web cover if present
    if (item.coverUrl) {
      setWebDerivedCoverUrl(item.coverUrl);
      if (coverSource !== 'custom') {
        setCoverUrl(item.coverUrl);
        setCoverSource('web');
      }
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

  // Three community availability states:
  // - Swap selected: can also select Borrow, and vice-versa
  // - Unavailable selected: deselects both Swap and Borrow
  const handleSelectSwap = () => {
    if (!isExchangeable && !isLendable) {
      // Was Unavailable -> now Swap only
      setIsExchangeable(true);
      setIsLendable(false);
    } else if (isExchangeable && !isLendable) {
      // Toggle off -> becomes Unavailable
      setIsExchangeable(false);
    } else if (isExchangeable && isLendable) {
      // Was both -> toggle off swap, leaves borrow
      setIsExchangeable(false);
    } else {
      // Was borrow only -> add swap (both are now active)
      setIsExchangeable(true);
    }
  };

  const handleSelectBorrow = () => {
    if (!isExchangeable && !isLendable) {
      // Was Unavailable -> now Borrow only
      setIsLendable(true);
      setIsExchangeable(false);
    } else if (!isExchangeable && isLendable) {
      // Toggle off -> becomes Unavailable
      setIsLendable(false);
    } else if (isExchangeable && isLendable) {
      // Was both -> toggle off borrow, leaves swap
      setIsLendable(false);
    } else {
      // Was swap only -> add borrow (both are now active)
      setIsLendable(true);
    }
  };

  const handleSelectUnavailable = () => {
    setIsExchangeable(false);
    setIsLendable(false);
  };

  // Photo picker handler: opens the modal to Choose from Gallery or Take Photo
  const handleOpenPhotoPicker = () => {
    setShowDevicePickerModal(true);
  };

  const handleSelectCustomPhoto = (uri: string) => {
    setCustomPhotoUri(uri);
    setActualBookPhoto(uri);
    setCoverSource('custom');
    setCoverUrl(uri);
    setShowDevicePickerModal(false);
  };

  const handleUseWebCover = () => {
    if (webDerivedCoverUrl) {
      setCoverSource('web');
      setCoverUrl(webDerivedCoverUrl);
    }
  };

  const handleUseCustomPhoto = () => {
    if (customPhotoUri) {
      setCoverSource('custom');
      setCoverUrl(customPhotoUri);
    }
  };

  const handleResetToGradient = () => {
    setCoverSource('gradient');
    setCoverUrl('');
  };

  const handleRemoveCustomPhoto = () => {
    setCustomPhotoUri(null);
    setActualBookPhoto(null);
    if (coverSource === 'custom') {
      if (webDerivedCoverUrl) {
        setCoverSource('web');
        setCoverUrl(webDerivedCoverUrl);
      } else {
        setCoverSource('gradient');
        setCoverUrl('');
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !author.trim()) return;
    let finalCover: string | undefined = undefined;
    if (coverSource === 'custom' && customPhotoUri) {
      finalCover = customPhotoUri;
    } else if (coverSource === 'web' && (coverUrl || webDerivedCoverUrl)) {
      finalCover = coverUrl || webDerivedCoverUrl || undefined;
    } else if (coverUrl) {
      finalCover = coverUrl;
    }
    finalCover = (finalCover || '').trim() || undefined;

    onAddBook(
      title.trim(),
      author.trim(),
      genre,
      summary.trim(),
      classification,
      finalCover,
      isExchangeable,
      isLendable
    );
    Alert.alert(
      'Book Added to Collection!',
      '🎉 You earned +10 Community Points! Check your profile to view your updated points.'
    );
    onDismiss();
  };

  return (
    <>
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
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleOpenPhotoPicker}
                style={styles.previewCoverWrapper}
              >
                <BookCover
                  title={title || 'Book Title'}
                  author={author || 'Author'}
                  coverUrl={coverUrl || null}
                  style={styles.previewCover}
                />
                <View style={styles.previewCoverCameraBadge}>
                  <Ionicons name="camera" size={12} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              <View style={styles.previewInfo}>
                <View style={styles.coverBadgeRow}>
                  {isCoverLoading ? (
                    <View style={styles.loadingBadge}>
                      <ActivityIndicator size="small" color={Colors.primaryAccent} />
                      <Text style={styles.loadingBadgeText}>Finding original cover...</Text>
                    </View>
                  ) : coverSource === 'custom' && customPhotoUri ? (
                    <View style={styles.customPhotoBadge}>
                      <Ionicons name="camera" size={13} color="#10B981" />
                      <Text style={styles.customPhotoBadgeText}>Your Own Photo Cover ✓</Text>
                    </View>
                  ) : coverSource === 'web' && coverUrl ? (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={13} color="#059669" />
                      <Text style={styles.verifiedText}>Web Cover Art Applied ✓</Text>
                    </View>
                  ) : (
                    <View style={styles.defaultBadge}>
                      <Ionicons name="sparkles" size={12} color={Colors.primaryAccent} />
                      <Text style={styles.defaultBadgeText}>Gradient Cover</Text>
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

                <View style={styles.coverQuickActionsRow}>
                  <TouchableOpacity
                    style={styles.quickPhotoBtn}
                    onPress={handleOpenPhotoPicker}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="camera-outline" size={12} color={Colors.primaryAccent} />
                    <Text style={styles.quickPhotoBtnText}>
                      {customPhotoUri ? 'Change Photo' : 'Upload Your Photo'}
                    </Text>
                  </TouchableOpacity>

                  {coverSource === 'custom' && webDerivedCoverUrl ? (
                    <TouchableOpacity
                      style={styles.switchCoverBtn}
                      onPress={handleUseWebCover}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="image-outline" size={12} color={Colors.secondaryText} />
                      <Text style={styles.switchCoverBtnText}>Use Web Cover</Text>
                    </TouchableOpacity>
                  ) : null}

                  {coverSource === 'web' && customPhotoUri ? (
                    <TouchableOpacity
                      style={styles.switchCoverBtn}
                      onPress={handleUseCustomPhoto}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="camera" size={12} color={Colors.secondaryText} />
                      <Text style={styles.switchCoverBtnText}>Use My Photo</Text>
                    </TouchableOpacity>
                  ) : null}

                  {coverUrl ? (
                    <TouchableOpacity
                      style={styles.clearCoverBtn}
                      onPress={handleResetToGradient}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="refresh-outline" size={11} color={Colors.secondaryText} />
                      <Text style={styles.clearCoverText}>Reset</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
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
                  cursorColor={Colors.primaryAccent}
                  selectionColor="rgba(193, 140, 93, 0.3)"
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
            <Text style={styles.sectionLabel}>Community Availability</Text>

            {/* Exactly 3 Availability Boxes: 1 Swap, 2 Borrow, 3 Unavailable */}
            <View style={styles.availOptionsRow}>
              {/* Box 1: Swap */}
              <TouchableOpacity
                style={[
                  styles.availOptionBtn,
                  isExchangeable && styles.availOptionBtnActive,
                ]}
                onPress={handleSelectSwap}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={20}
                  color={isExchangeable ? Colors.primaryAccent : Colors.secondaryText}
                />
                <Text
                  style={[
                    styles.availOptionBtnText,
                    isExchangeable && styles.availOptionBtnTextActive,
                  ]}
                >
                  Swap{isExchangeable ? ' ✓' : ''}
                </Text>
              </TouchableOpacity>

              {/* Box 2: Borrow */}
              <TouchableOpacity
                style={[
                  styles.availOptionBtn,
                  isLendable && styles.availOptionBtnActive,
                ]}
                onPress={handleSelectBorrow}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={isLendable ? Colors.primaryAccent : Colors.secondaryText}
                />
                <Text
                  style={[
                    styles.availOptionBtnText,
                    isLendable && styles.availOptionBtnTextActive,
                  ]}
                >
                  Borrow{isLendable ? ' ✓' : ''}
                </Text>
              </TouchableOpacity>

              {/* Box 3: Unavailable */}
              <TouchableOpacity
                style={[
                  styles.availOptionBtn,
                  !isExchangeable && !isLendable && styles.availOptionBtnActiveAlert,
                ]}
                onPress={handleSelectUnavailable}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={!isExchangeable && !isLendable ? Colors.alertAccent : Colors.secondaryText}
                />
                <Text
                  style={[
                    styles.availOptionBtnText,
                    !isExchangeable && !isLendable && styles.availOptionBtnTextActiveAlert,
                  ]}
                >
                  Unavailable{!isExchangeable && !isLendable ? ' ✓' : ''}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Upload Photos Section */}
            <View style={styles.photoUploadSection}>
              <Text style={styles.sectionLabel}>Upload Photos</Text>

              {customPhotoUri ? (
                <View style={styles.uploadedPhotoCard}>
                  <Image source={{ uri: customPhotoUri }} style={styles.uploadedPhotoImg} resizeMode="cover" />
                  <View style={styles.uploadedPhotoInfo}>
                    <View style={styles.uploadedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                      <Text style={styles.uploadedBadgeText}>Photo Attached ✓</Text>
                    </View>
                    <Text style={styles.uploadedPhotoHint}>
                      {coverSource === 'custom'
                        ? 'Applied as your book cover picture.'
                        : 'Your photo is attached to this book.'}
                    </Text>
                    <View style={styles.uploadedPhotoActions}>
                      {coverSource !== 'custom' ? (
                        <TouchableOpacity
                          style={styles.setCoverBtn}
                          onPress={handleUseCustomPhoto}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="sparkles" size={12} color={Colors.primaryAccent} />
                          <Text style={styles.setCoverBtnText}>Set as Cover</Text>
                        </TouchableOpacity>
                      ) : (
                        webDerivedCoverUrl ? (
                          <TouchableOpacity
                            style={styles.switchWebBtn}
                            onPress={handleUseWebCover}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="globe-outline" size={12} color={Colors.secondaryText} />
                            <Text style={styles.switchWebBtnText}>Use Web Cover</Text>
                          </TouchableOpacity>
                        ) : null
                      )}
                      <TouchableOpacity
                        style={styles.changePhotoBtn}
                        onPress={handleOpenPhotoPicker}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="images-outline" size={13} color={Colors.primaryAccent} />
                        <Text style={styles.changePhotoBtnText}>Change</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removePhotoBtn}
                        onPress={handleRemoveCustomPhoto}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="trash-outline" size={13} color={Colors.alertAccent} />
                        <Text style={styles.removePhotoBtnText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.singlePhotoUploadCard}
                  onPress={handleOpenPhotoPicker}
                  activeOpacity={0.8}
                >
                  <View style={styles.photoIconCircle}>
                    <Ionicons name="camera" size={22} color={Colors.primaryAccent} />
                  </View>
                  <View style={styles.singlePhotoUploadContent}>
                    <Text style={styles.singlePhotoUploadTitle}>Add Photo</Text>
                    <Text style={styles.singlePhotoUploadSubtitle}>
                      Tap to choose from gallery or take photo
                    </Text>
                  </View>
                  <View style={styles.singlePhotoUploadAddIcon}>
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              )}
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
    <DevicePhotoPickerModal
      visible={showDevicePickerModal}
      onDismiss={() => setShowDevicePickerModal(false)}
      onSelectPhoto={(uri) => {
        handleSelectCustomPhoto(uri);
      }}
    />
  </>
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
  previewCoverWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  previewCover: {
    width: 68,
    height: 98,
    borderRadius: 8,
  },
  previewCoverCameraBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.primaryAccent,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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
  customPhotoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  customPhotoBadgeText: {
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
  coverQuickActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  quickPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  quickPhotoBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryAccent,
  },
  switchCoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 3,
  },
  switchCoverBtnText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.secondaryText,
  },
  clearCoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 3,
    gap: 2,
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
    borderWidth: 0,
    backgroundColor: 'transparent',
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
  availOptionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  availOptionBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  availOptionBtnActive: {
    backgroundColor: 'rgba(193, 140, 93, 0.1)',
    borderColor: Colors.primaryAccent,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  availOptionBtnActiveAlert: {
    backgroundColor: 'rgba(163, 74, 61, 0.08)',
    borderColor: Colors.alertAccent,
  },
  availOptionBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.secondaryText,
    marginTop: 6,
  },
  availOptionBtnTextActive: {
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
  availOptionBtnTextActiveAlert: {
    color: Colors.alertAccent,
    fontWeight: '700',
  },
  // Photo Upload Section
  photoUploadSection: {
    marginBottom: 18,
  },
  singlePhotoUploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(193, 140, 93, 0.35)',
    borderStyle: 'dashed',
    padding: 16,
    marginTop: 6,
    gap: 14,
  },
  photoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  singlePhotoUploadContent: {
    flex: 1,
  },
  singlePhotoUploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  singlePhotoUploadSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  singlePhotoUploadAddIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedPhotoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#10B981',
    padding: 12,
    marginTop: 6,
    alignItems: 'center',
  },
  uploadedPhotoImg: {
    width: 65,
    height: 90,
    borderRadius: 10,
    backgroundColor: Colors.cardBg,
  },
  uploadedPhotoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  uploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  uploadedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 5,
  },
  uploadedPhotoHint: {
    fontSize: 11,
    color: Colors.secondaryText,
    lineHeight: 15,
    marginBottom: 8,
  },
  uploadedPhotoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  setCoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(193, 140, 93, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  setCoverBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryAccent,
  },
  switchWebBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  switchWebBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  changePhotoBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryAccent,
    marginLeft: 4,
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  removePhotoBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.alertAccent,
    marginLeft: 4,
  },
});
