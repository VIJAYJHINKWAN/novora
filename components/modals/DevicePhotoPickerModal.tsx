import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { pickImageFromGallery, capturePhotoWithCamera } from '../../services/imagePickerService';

interface DevicePhotoPickerModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelectPhoto: (photoUri: string) => void;
}

export const DevicePhotoPickerModal: React.FC<DevicePhotoPickerModalProps> = ({
  visible,
  onDismiss,
  onSelectPhoto,
}) => {
  const [loading, setLoading] = useState(false);

  const handleGallery = async () => {
    try {
      setLoading(true);
      const uri = await pickImageFromGallery();
      if (uri) {
        onSelectPhoto(uri);
        onDismiss();
      }
    } catch (e) {
      console.error('Gallery picker error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCamera = async () => {
    try {
      setLoading(true);
      const uri = await capturePhotoWithCamera();
      if (uri) {
        onSelectPhoto(uri);
        onDismiss();
      }
    } catch (e) {
      console.error('Camera capture error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss} />
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Custom Cover Photo</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Colors.primaryText} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primaryAccent} />
              <Text style={styles.loadingText}>Opening photo selector...</Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {/* Option 1: Choose from Gallery */}
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={handleGallery}
                activeOpacity={0.85}
              >
                <Ionicons name="images" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.optionBtnText}>Choose from Gallery</Text>
              </TouchableOpacity>

              {/* Option 2: Take Photo with Camera */}
              <TouchableOpacity
                style={styles.optionBtnOutline}
                onPress={handleCamera}
                activeOpacity={0.85}
              >
                <Ionicons name="camera" size={18} color={Colors.primaryAccent} style={{ marginRight: 8 }} />
                <Text style={styles.optionBtnOutlineText}>Take Photo with Camera</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.cancelBtn} onPress={onDismiss} activeOpacity={0.7}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  closeBtn: {
    padding: 4,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 12,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryAccent,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  optionBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  optionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.primaryAccent,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionBtnOutlineText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.primaryAccent,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryAccent,
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
});
