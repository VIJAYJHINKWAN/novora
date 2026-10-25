import { Platform, Alert } from 'react-native';

/**
 * Universal Image Picker Service
 * - Safely lazy-loads expo-image-picker at runtime on native to avoid crashing
 *   when running in an environment where ExponentImagePicker is not linked.
 * - Web: Uses HTML5 File API (FileReader) to convert images to Base64 Data URLs.
 */

let ImagePickerModule: any = null;
let hasCheckedModule = false;

export const getNativeImagePicker = (): any => {
  if (hasCheckedModule) return ImagePickerModule;
  hasCheckedModule = true;

  if (Platform.OS === 'web') {
    return null;
  }

  try {
    // Dynamically require expo-image-picker only at runtime inside try-catch
    ImagePickerModule = require('expo-image-picker');
    return ImagePickerModule;
  } catch (err) {
    console.warn('Native ExponentImagePicker module not available in this binary:', err);
    ImagePickerModule = null;
    return null;
  }
};

export const isNativeImagePickerAvailable = (): boolean => {
  if (Platform.OS === 'web') return true;
  return Boolean(getNativeImagePicker());
};

export const pickImageFromGallery = async (): Promise<string | null> => {
  // Use expo-image-picker on Native devices (Android / iOS)
  if (Platform.OS !== 'web') {
    const ImagePicker = getNativeImagePicker();
    if (!ImagePicker) {
      Alert.alert(
        'Native Gallery Not Available',
        'Your current Android build does not have the native ExponentImagePicker module compiled in. You can paste any photo URL or select from our physical book cover presets.'
      );
      return null;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Needed',
          'Please allow access to your photos to attach a book cover image.'
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.75,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          const mimeType = asset.mimeType || 'image/jpeg';
          return `data:${mimeType};base64,${asset.base64}`;
        }
        return asset.uri;
      }
      return null;
    } catch (err) {
      console.warn('Gallery picker native error:', err);
      return null;
    }
  }

  // Web fallback using HTML5 File API
  return new Promise((resolve) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      document.body.appendChild(input);

      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              document.body.removeChild(input);
            } catch (_) {}
            resolve(event.target?.result as string);
          };
          reader.onerror = () => {
            try {
              document.body.removeChild(input);
            } catch (_) {}
            resolve(null);
          };
          reader.readAsDataURL(file);
        } else {
          try {
            document.body.removeChild(input);
          } catch (_) {}
          resolve(null);
        }
      };

      input.oncancel = () => {
        try {
          document.body.removeChild(input);
        } catch (_) {}
        resolve(null);
      };

      input.click();
    } catch (err) {
      console.error('Web file picker error:', err);
      resolve(null);
    }
  });
};

export const capturePhotoWithCamera = async (): Promise<string | null> => {
  // Use expo-image-picker on Native devices (Android / iOS)
  if (Platform.OS !== 'web') {
    const ImagePicker = getNativeImagePicker();
    if (!ImagePicker) {
      Alert.alert(
        'Native Camera Not Available',
        'Your current Android build does not have the native ExponentImagePicker module compiled in. You can paste any photo URL or select from our physical book cover presets.'
      );
      return null;
    }

    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Needed',
          'Please allow camera access to take a photo of your book.'
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.75,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          const mimeType = asset.mimeType || 'image/jpeg';
          return `data:${mimeType};base64,${asset.base64}`;
        }
        return asset.uri;
      }
      return null;
    } catch (err) {
      console.warn('Camera capture native error:', err);
      return null;
    }
  }

  // Web fallback using HTML5 File API
  return new Promise((resolve) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.setAttribute('capture', 'environment');
      input.style.display = 'none';
      document.body.appendChild(input);

      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              document.body.removeChild(input);
            } catch (_) {}
            resolve(event.target?.result as string);
          };
          reader.onerror = () => {
            try {
              document.body.removeChild(input);
            } catch (_) {}
            resolve(null);
          };
          reader.readAsDataURL(file);
        } else {
          try {
            document.body.removeChild(input);
          } catch (_) {}
          resolve(null);
        }
      };

      input.oncancel = () => {
        try {
          document.body.removeChild(input);
        } catch (_) {}
        resolve(null);
      };

      input.click();
    } catch (err) {
      console.error('Web camera picker error:', err);
      resolve(null);
    }
  });
};
