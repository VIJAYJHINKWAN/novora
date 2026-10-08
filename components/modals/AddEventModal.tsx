import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { PageTurnTextField } from '../PageTurnTextField';
import { PageTurnButton } from '../PageTurnButton';

interface AddEventModalProps {
  onDismiss: () => void;
  onAddEvent: (
    title: string,
    category: string,
    date: string,
    time: string,
    location: string,
    organizerName: string,
    description: string
  ) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  onDismiss,
  onAddEvent,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Reading Clubs');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    'Poetry Circles',
    'Book Exchange',
    'Book Fairs',
    'Reading Clubs',
  ];

  const isValid =
    title.trim() &&
    date.trim() &&
    time.trim() &&
    location.trim() &&
    organizerName.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    onAddEvent(
      title,
      category,
      date,
      time,
      location,
      organizerName,
      description
    );
    onDismiss();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onDismiss}
        />
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
            <Ionicons
              name="close"
              size={24}
              color={Colors.primaryText}
            />
          </TouchableOpacity>

          <Text style={styles.heading}>Create an Event</Text>
          <Text style={styles.subheading}>
            Host a reading club, book fair, or poetry circle.
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <PageTurnTextField
              label="Event Title *"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Monsoon Poetry Evening"
            />

            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.chipsRow}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.chip,
                    category === c && styles.chipActive,
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      category === c && styles.chipTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <PageTurnTextField
              label="Date *"
              value={date}
              onChangeText={setDate}
              placeholder="e.g. Saturday, 15 Nov"
            />

            <PageTurnTextField
              label="Time *"
              value={time}
              onChangeText={setTime}
              placeholder="e.g. 5:00 PM"
              style={{ marginTop: 10 }}
            />

            <PageTurnTextField
              label="Location *"
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Blossom Book House, Bengaluru"
              style={{ marginTop: 10 }}
            />

            <PageTurnTextField
              label="Organizer Name *"
              value={organizerName}
              onChangeText={setOrganizerName}
              placeholder="Your name or club name"
              style={{ marginTop: 10 }}
            />

            <PageTurnTextField
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="What's this event about?"
              multiline
              numberOfLines={3}
              style={{ marginTop: 10 }}
            />

            <PageTurnButton
              text="Create Event"
              onPress={handleSubmit}
              disabled={!isValid}
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