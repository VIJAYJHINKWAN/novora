import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { PageTurnTextField } from '../PageTurnTextField';
import { PageTurnButton } from '../PageTurnButton';

interface AddBookModalProps {
  onDismiss: () => void;
  onAddBook: (title: string, author: string, genre: string, summary: string, classification: string) => void;
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

  const genresList = ['Indian Lit', 'Mythological Fiction', 'Classic Fiction', 'Poetry', 'Epic Drama', 'Modern Fiction'];
  const classifications = ['Owned', 'Available Exchange', 'Available Lending', 'Wishlist', 'Read'];

  const handleSubmit = () => {
    if (!title.trim() || !author.trim()) return;
    onAddBook(title, author, genre, summary, classification);
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
          <Text style={styles.subheading}>List a book to exchange, lend, or track in your reading list.</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <PageTurnTextField
              label="Book Title *"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Midnight's Children"
            />

            <PageTurnTextField
              label="Author Name *"
              value={author}
              onChangeText={setAuthor}
              placeholder="e.g. Salman Rushdie"
            />

            {/* Genre */}
            <Text style={styles.sectionLabel}>Genre Classification</Text>
            <View style={styles.chipsRow}>
              {genresList.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, genre === g && styles.chipActive]}
                  onPress={() => setGenre(g)}
                >
                  <Text style={[styles.chipText, genre === g && styles.chipTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Classification */}
            <Text style={styles.sectionLabel}>Shelf Status</Text>
            <View style={styles.chipsRow}>
              {classifications.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, classification === c && styles.chipActive]}
                  onPress={() => setClassification(c)}
                >
                  <Text style={[styles.chipText, classification === c && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <PageTurnTextField
              label="Short Summary / Synopsis"
              value={summary}
              onChangeText={setSummary}
              placeholder="Brief description of the book..."
              multiline
              numberOfLines={3}
            />

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
    maxHeight: '88%',
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
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  subheading: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 14,
    marginBottom: 8,
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
});
