import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { PageTurnTextField } from '../PageTurnTextField';
import { PageTurnButton } from '../PageTurnButton';

interface CreateStoryDialogProps {
  onDismiss: () => void;
  onPostStory: (bookTitle: string, noteText: string, storyType: string, backgroundTheme: string) => void;
}

export const CreateStoryDialog: React.FC<CreateStoryDialogProps> = ({
  onDismiss,
  onPostStory,
}) => {
  const [bookTitle, setBookTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [storyType, setStoryType] = useState('Current Read');
  const [theme, setTheme] = useState('Cozy Cafe');

  const storyTypes = ['Current Read', 'Quote of the Day', 'Reading Spot', 'Book Haul', 'Review'];
  const themes = ['Cozy Cafe', 'Bookshelf', 'Vintage Parchment', 'Midnight Reader', 'Botanic Garden'];

  const handleSubmit = () => {
    if (!noteText.trim()) return;
    onPostStory(bookTitle, noteText, storyType, theme);
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

          <Text style={styles.heading}>Share Reading Note</Text>
          <Text style={styles.subheading}>Post a quick note or quote to your regional reading circle.</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <PageTurnTextField
              label="Book Title (Optional)"
              value={bookTitle}
              onChangeText={setBookTitle}
              placeholder="e.g. The God of Small Things"
            />

            <PageTurnTextField
              label="Note / Quote / Reflection *"
              value={noteText}
              onChangeText={setNoteText}
              placeholder="What are you currently reflecting on?"
              multiline
              numberOfLines={4}
            />

            {/* Story Type Selector */}
            <Text style={styles.sectionLabel}>Category / Note Type</Text>
            <View style={styles.chipsRow}>
              {storyTypes.map(st => (
                <TouchableOpacity
                  key={st}
                  style={[styles.chip, storyType === st && styles.chipActive]}
                  onPress={() => setStoryType(st)}
                >
                  <Text style={[styles.chipText, storyType === st && styles.chipTextActive]}>{st}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Theme Selector */}
            <Text style={styles.sectionLabel}>Visual Theme</Text>
            <View style={styles.chipsRow}>
              {themes.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, theme === t && styles.chipActive]}
                  onPress={() => setTheme(t)}
                >
                  <Text style={[styles.chipText, theme === t && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <PageTurnButton
              text="Post to Reading Feed (+15 pts)"
              onPress={handleSubmit}
              disabled={!noteText.trim()}
              iconName="paper-plane"
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
