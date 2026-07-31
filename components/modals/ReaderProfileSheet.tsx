import React from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reader } from '../../types';
import { Colors, Fonts } from '../../constants/theme';
import { UserAvatar } from '../UserAvatar';
import { PageTurnButton } from '../PageTurnButton';
import { PageTurnBadge } from '../PageTurnBadge';

interface ReaderProfileSheetProps {
  reader: Reader;
  onDismiss: () => void;
  onChatClick: () => void;
}

export const ReaderProfileSheet: React.FC<ReaderProfileSheetProps> = ({
  reader,
  onDismiss,
  onChatClick,
}) => {
  return (
    <Modal animationType="slide" transparent visible onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss} />
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />
          
          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
            <Ionicons name="close" size={24} color={Colors.primaryText} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <UserAvatar name={reader.name} size={64} />
              <View style={styles.titleRow}>
                <Text style={styles.name}>{reader.name}</Text>
                {reader.verificationBadge && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primaryAccent} style={{ marginLeft: 4 }} />
                )}
              </View>
              <Text style={styles.location}>📍 {reader.location}</Text>
              
              <View style={styles.scorePill}>
                <Ionicons name="ribbon-outline" size={16} color={Colors.primaryAccent} />
                <Text style={styles.scoreText}>Reading Score: {reader.readingScore} pts</Text>
                <Text style={styles.matchText}> • {reader.matchPercentage}% Match</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>About Reader</Text>
            <Text style={styles.bioText}>{reader.bio}</Text>

            <Text style={styles.sectionTitle}>Collection Stats</Text>
            <Text style={styles.infoText}>{reader.stats}</Text>

            <Text style={styles.sectionTitle}>Favorite Genres</Text>
            <View style={styles.genresRow}>
              {reader.genres.split(',').map((g, idx) => (
                <PageTurnBadge key={idx} text={g.trim()} isAccent style={styles.badgeItem} />
              ))}
            </View>

            <Text style={styles.sectionTitle}>2026 Reading Goal</Text>
            <Text style={styles.infoText}>{reader.goals}</Text>

            <PageTurnButton
              text={`Message ${reader.name}`}
              onPress={onChatClick}
              iconName="chatbubble-ellipses"
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
    maxHeight: '80%',
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
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  location: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 10,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    marginLeft: 6,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.successAccent,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 14,
    marginBottom: 6,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.secondaryText,
  },
  infoText: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badgeItem: {
    marginRight: 6,
    marginTop: 4,
  },
});
