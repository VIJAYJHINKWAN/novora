import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

interface BookCoverProps {
  title: string;
  author: string;
  coverId?: number;
  coverUrl?: string | null;
  style?: ViewStyle;
}

export const BookCover: React.FC<BookCoverProps> = ({ title, author, coverId = 1, coverUrl, style }) => {
  const [imageError, setImageError] = useState(false);

  // Normalize HTTP to HTTPS for secure image loading
  const normalizedCoverUrl = coverUrl ? coverUrl.replace(/^http:\/\//i, 'https://') : null;

  // Reset image error whenever cover URL prop changes
  React.useEffect(() => {
    setImageError(false);
  }, [normalizedCoverUrl]);

  const gradient = Colors.coverGradients[coverId] || Colors.coverGradients.default;
  const bgStyle = { backgroundColor: gradient[0] };
  const showImage = Boolean(normalizedCoverUrl && !imageError);

  const flatStyle = StyleSheet.flatten(style) || {};
  const borderRadius = flatStyle.borderRadius !== undefined ? flatStyle.borderRadius : 8;

  return (
    <View
      style={[
        styles.coverContainer,
        { borderRadius },
        showImage ? styles.imageContainer : [bgStyle, styles.textContainer],
        style,
      ]}
    >
      {showImage ? (
        <>
          <Image
            key={normalizedCoverUrl}
            source={{ uri: normalizedCoverUrl! }}
            style={[styles.realCoverImage, { borderRadius }]}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          {/* Subtle real-book left spine shadow and right edge highlight */}
          <View
            style={[
              styles.spineShadowOverlay,
              {
                borderTopLeftRadius: borderRadius,
                borderBottomLeftRadius: borderRadius,
              },
            ]}
          />
        </>
      ) : (
        <>
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  coverContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1E1E24',
  },
  textContainer: {
    padding: 10,
    justifyContent: 'space-between',
  },
  imageContainer: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E24',
  },
  realCoverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  spineShadowOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
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
