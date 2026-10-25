import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Fonts } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../../components/UserAvatar';
import { ChatScreenOverlay } from '../../components/modals/ChatScreenOverlay';

export default function MessagesScreen() {
  const { getRecentChats, selectedChatId, selectChat } = useApp();

  const recentChats = getRecentChats();

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages & Exchanges</Text>
        <Text style={styles.headerSubtitle}>Direct chats and step-by-step book swap status.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {recentChats.map(({ chatId, lastMessage }) => (
          <TouchableOpacity
            key={chatId}
            style={styles.chatRow}
            onPress={() => selectChat(chatId)}
          >
            <UserAvatar name={chatId} size={50} />

            <View style={styles.chatContent}>
              <View style={styles.nameRow}>
                <Text style={styles.readerName}>{chatId}</Text>
                <Text style={styles.timestamp}>{formatTime(lastMessage.timestamp)}</Text>
              </View>

              <Text style={styles.lastMsg} numberOfLines={1}>
                {lastMessage.isExchangeCard
                  ? `[Exchange Request] ${lastMessage.exchangeBookTitle}`
                  : lastMessage.messageText}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chat Window Overlay */}
      {selectedChatId && (
        <ChatScreenOverlay
          chatId={selectedChatId}
          onDismiss={() => selectChat(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: Colors.secondaryBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  chatContent: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readerName: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.secondaryText,
  },
  lastMsg: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginTop: 4,
  },
});
