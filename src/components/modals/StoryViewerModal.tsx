import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { ReadingStory } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface StoryViewerModalProps {
  story: ReadingStory;
  currentIndex: number;
  totalStories: number;
  onDismiss: () => void;
  onLikeToggle: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  currentIndex,
  totalStories,
  onDismiss,
  onLikeToggle,
  onNext,
  onPrev,
}) => {
  const getThemeBg = (theme: string) => {
    switch (theme) {
      case 'Bookshelf':
        return '#2E3D52';
      case 'Vintage Parchment':
        return '#3B2E20';
      case 'Midnight Reader':
        return '#1E2836';
      case 'Botanic Garden':
        return '#455A51';
      default:
        return '#917255'; // Cozy Cafe
    }
  };

  const bg = getThemeBg(story.backgroundTheme);

  return (
    <Modal animationType="fade" transparent={false} visible onRequestClose={onDismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        {/* Top Progress bar */}
        <View style={styles.progressBarRow}>
          {Array.from({ length: totalStories }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                i === currentIndex ? styles.progressActive : i < currentIndex ? styles.progressComplete : styles.progressPending,
              ]}
            />
          ))}
        </View>

        {/* User Info Header */}
        <View style={styles.header}>
          <UserAvatar name={story.authorName} size={38} backgroundColor="rgba(255,255,255,0.2)" textColor="#FFFFFF" />
          <View style={styles.headerTitleCol}>
            <Text style={styles.authorName}>{story.authorName}</Text>
            <Text style={styles.storyMeta}>{story.storyType} • {story.timestamp}</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
            <Ionicons name="close" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Story Body */}
        <View style={styles.body}>
          <TouchableOpacity
            style={styles.touchLeft}
            onPress={onPrev}
            activeOpacity={1}
          />
          <View style={styles.cardContent}>
            <Text style={styles.bookTitlePill}>📖 {story.bookTitle}</Text>
            <Text style={styles.noteText}>"{story.noteText}"</Text>
            <Text style={styles.themeTag}>Theme: {story.backgroundTheme}</Text>
          </View>
          <TouchableOpacity
            style={styles.touchRight}
            onPress={onNext}
            activeOpacity={1}
          />
        </View>

        {/* Bottom Bar: Like Action */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.likeBtn} onPress={onLikeToggle}>
            <Ionicons
              name={story.isLiked ? "heart" : "heart-outline"}
              size={26}
              color={story.isLiked ? Colors.alertAccent : "#FFFFFF"}
            />
            <Text style={styles.likeText}>{story.likesCount} Likes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  progressBarRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginHorizontal: 8,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  progressActive: {
    backgroundColor: '#FFFFFF',
  },
  progressComplete: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  progressPending: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 16,
  },
  headerTitleCol: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  storyMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  touchLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    zIndex: 2,
  },
  touchRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    zIndex: 2,
  },
  cardContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 1,
  },
  bookTitlePill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 24,
  },
  noteText: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    lineHeight: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  themeTag: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 24,
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  likeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
});
