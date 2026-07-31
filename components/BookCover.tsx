import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

interface BookCoverProps {
  title: string;
  author: string;
  coverId: number;
  style?: ViewStyle;
}

export const BookCover: React.FC<BookCoverProps> = ({ title, author, coverId, style }) => {
  const gradient = Colors.coverGradients[coverId] || Colors.coverGradients.default;
  const bgStyle = { backgroundColor: gradient[0] };

  return (
    <View style={[styles.coverContainer, bgStyle, style]}>
      {/* Spine Accent Line */}
      <View style={styles.spineLine} />

      <View style={styles.content}>
        <Text style={styles.editionText}>P A G E T U R N   E D I T I O N</Text>
        <View style={styles.dividerLine} />
        <View>
          <Text style={styles.titleText} numberOfLines={3} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.authorText} numberOfLines={1} ellipsizeMode="tail">
            {author}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  coverContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    padding: 10,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  spineLine: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  editionText: {
    fontSize: 7,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  dividerLine: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 4,
  },
  titleText: {
    fontFamily: Fonts.serif,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 16,
  },
  authorText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '300',
    marginTop: 2,
  },
});
