import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

export type AvailabilityFilterType = 'ALL' | 'OTHERS' | 'SWAP' | 'BORROW';

interface BookSearchBarProps {
  query: string;
  onChangeQuery: (text: string) => void;
  availabilityFilter: AvailabilityFilterType;
  onChangeFilter: (filter: AvailabilityFilterType) => void;
  onClear: () => void;
  totalResultsCount?: number;
  isSearching: boolean;
}

export const BookSearchBar: React.FC<BookSearchBarProps> = ({
  query,
  onChangeQuery,
  availabilityFilter,
  onChangeFilter,
  onClear,
  totalResultsCount,
  isSearching,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const filters: { key: AvailabilityFilterType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'ALL', label: 'All Shelf', icon: 'grid-outline' },
    { key: 'OTHERS', label: 'Uploaded by Others', icon: 'people-outline' },
    { key: 'SWAP', label: 'Available to Swap', icon: 'swap-horizontal' },
    { key: 'BORROW', label: 'Available to Borrow', icon: 'book-outline' },
  ];

  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          isSearching && styles.inputContainerActive,
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={isFocused || isSearching ? Colors.primaryAccent : Colors.secondaryText}
          style={styles.searchIcon}
        />

        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={onChangeQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search books, authors, or uploaders..."
          placeholderTextColor="rgba(85, 85, 85, 0.45)"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        {query.trim().length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={onClear}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={18} color={Colors.secondaryText} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterContainer}
      >
        {filters.map((f) => {
          const isActive = availabilityFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => onChangeFilter(f.key)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={f.icon}
                size={14}
                color={isActive ? '#FFFFFF' : Colors.secondaryText}
                style={styles.chipIcon}
              />
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Active Search Summary Banner */}
      {isSearching && (
        <View style={styles.summaryBar}>
          <View style={styles.summaryLeft}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.primaryAccent} />
            <Text style={styles.summaryText}>
              {totalResultsCount === 0
                ? 'No matching books found'
                : `Showing ${totalResultsCount} ${totalResultsCount === 1 ? 'book' : 'books'} ${
                    availabilityFilter !== 'ALL' ? 'with selected filter' : ''
                  }`}
            </Text>
          </View>
          <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(234, 235, 237, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,

    // Soft Elevation Shadow
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  inputContainerFocused: {
    borderColor: Colors.primaryAccent,
    shadowOpacity: 0.12,
  },
  inputContainerActive: {
    borderColor: Colors.primaryAccent,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primaryText,
    paddingVertical: Platform.OS === 'android' ? 0 : 6,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 6,
  },
  filterContainer: {
    marginTop: 10,
    marginBottom: 4,
  },
  filterScroll: {
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  chipIcon: {
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(234, 235, 237, 0.5)',
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginLeft: 6,
    fontWeight: '500',
  },
  resetText: {
    fontSize: 12,
    color: Colors.alertAccent,
    fontWeight: 'bold',
  },
});
