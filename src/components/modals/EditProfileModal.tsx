import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { PageTurnTextField } from '../PageTurnTextField';
import { PageTurnButton } from '../PageTurnButton';
import { UserProfile } from '../../types';

interface EditProfileModalProps {
  profile: UserProfile;
  onDismiss: () => void;
  onSave: (name: string, bio: string, location: string, genres: string, goals: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  onDismiss,
  onSave,
}) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [genres, setGenres] = useState(profile.genres);
  const [goals, setGoals] = useState(profile.goals);

  const handleSubmit = () => {
    onSave(name, bio, location, genres, goals);
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

          <Text style={styles.heading}>Edit Reader Profile</Text>
          <Text style={styles.subheading}>Update your bio, location, and reading goals.</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <PageTurnTextField label="Full Name" value={name} onChangeText={setName} />
            <PageTurnTextField label="Location" value={location} onChangeText={setLocation} />
            <PageTurnTextField label="Bio" value={bio} onChangeText={setBio} multiline numberOfLines={3} />
            <PageTurnTextField label="Favorite Genres" value={genres} onChangeText={setGenres} />
            <PageTurnTextField label="2026 Reading Goals" value={goals} onChangeText={setGoals} multiline numberOfLines={2} />

            <PageTurnButton
              text="Save Profile Changes"
              onPress={handleSubmit}
              iconName="save"
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
});
