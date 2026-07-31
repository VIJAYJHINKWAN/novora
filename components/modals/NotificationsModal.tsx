import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Book Exchange Request',
    body: 'Ananya Iyer requested to borrow "Midnight\'s Children".',
    time: '10m ago',
    icon: 'swap-horizontal',
  },
  {
    id: '2',
    title: 'Event Reminder',
    body: 'Chai & Verse Poetry Evening is this Saturday at Atta Galatta!',
    time: '2h ago',
    icon: 'calendar',
  },
  {
    id: '3',
    title: 'New Story Like',
    body: 'Kabir Mehta liked your recent Reading Note.',
    time: '4h ago',
    icon: 'heart',
  },
];

interface NotificationsModalProps {
  onDismiss: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onDismiss }) => {
  return (
    <Modal animationType="slide" transparent visible onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss} />
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />
          
          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
            <Ionicons name="close" size={24} color={Colors.primaryText} />
          </TouchableOpacity>

          <Text style={styles.heading}>Notifications</Text>
          <Text style={styles.subheading}>Activity & updates from your reading network.</Text>

          <FlatList
            data={mockNotifications}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon} size={20} color={Colors.primaryAccent} />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemBody}>{item.body}</Text>
                  <Text style={styles.itemTime}>{item.time}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
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
    maxHeight: '70%',
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(193, 140, 93, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    marginLeft: 12,
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  itemBody: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  itemTime: {
    fontSize: 10,
    color: Colors.secondaryText,
    marginTop: 4,
  },
});
