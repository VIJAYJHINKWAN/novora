import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { UserAvatar } from '../UserAvatar';
import { PageTurnButton } from '../PageTurnButton';
import { ChatMessage } from '../../types';
import { useApp } from '../../context/AppContext';

interface ChatScreenOverlayProps {
  chatId: string;
  onDismiss: () => void;
}

export const ChatScreenOverlay: React.FC<ChatScreenOverlayProps> = ({
  chatId,
  onDismiss,
}) => {
  const { getMessagesForChat, sendChatMessage, updateExchangeStatus } = useApp();
  const [inputText, setInputText] = useState('');

  const messageList = getMessagesForChat(chatId);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendChatMessage(chatId, inputText);
    setInputText('');
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.sender === 'me';

    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowOther]}>
        {!isMe && <UserAvatar name={chatId} size={32} style={styles.msgAvatar} />}

        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          {item.isExchangeCard ? (
            (() => {
              const isBorrow = item.messageText?.toLowerCase().includes('borrow');
              return (
                <View style={styles.exchangeCard}>
                  <View style={styles.exchangeHeader}>
                    <Ionicons name={isBorrow ? "book-outline" : "swap-horizontal"} size={18} color={Colors.primaryAccent} />
                    <Text style={styles.exchangeTitle}>{isBorrow ? 'Book Borrow Request' : 'Book Exchange Request'}</Text>
                  </View>
                  <Text style={styles.exchangeBook}>"{item.exchangeBookTitle}"</Text>
                  <Text style={styles.exchangeStatus}>Status: {item.exchangeStatus || 'Requested'}</Text>

                  {item.exchangeStatus === 'Requested' && (
                    <View style={styles.exchangeActions}>
                      <PageTurnButton
                        text={isBorrow ? "Accept Borrow" : "Accept Exchange"}
                        onPress={() => updateExchangeStatus(item, 'Accepted')}
                        style={styles.actionBtn}
                      />
                      <PageTurnButton
                        text="Decline"
                        isSecondary
                        onPress={() => updateExchangeStatus(item, 'Declined')}
                        style={[styles.actionBtn, { marginLeft: 8 }]}
                      />
                    </View>
                  )}

                  {item.exchangeStatus === 'Accepted' && (
                    <PageTurnButton
                      text={isBorrow ? "Mark Return Completed (+20 pts)" : "Mark Swap Completed (+20 pts)"}
                      onPress={() => updateExchangeStatus(item, 'Completed')}
                      style={[styles.actionBtn, { marginTop: 8 }]}
                    />
                  )}
                </View>
              );
            })()
          ) : (
            <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>
              {item.messageText}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent={false} visible onRequestClose={onDismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onDismiss}>
            <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
          </TouchableOpacity>
          
          <UserAvatar name={chatId} size={36} />
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>{chatId}</Text>
            <Text style={styles.headerSubtitle}>Active Reader • Online</Text>
          </View>
        </View>

        {/* Message Stream */}
        <FlatList
          data={messageList}
          keyExtractor={item => item.id.toString()}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="rgba(85,85,85,0.5)"
            cursorColor={Colors.primaryAccent}
            selectionColor="rgba(193, 140, 93, 0.3)"
            style={styles.textInput}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.secondaryBg,
  },
  backBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerTitleCol: {
    marginLeft: 12,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.successAccent,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  msgRow: {
    flexDirection: 'row',
    marginVertical: 6,
    maxWidth: '80%',
  },
  msgRowMe: {
    alignSelf: 'flex-end',
  },
  msgRowOther: {
    alignSelf: 'flex-start',
  },
  msgAvatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMe: {
    backgroundColor: Colors.primaryAccent,
    borderBottomRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: Colors.cardBg,
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgTextMe: {
    color: '#FFFFFF',
  },
  msgTextOther: {
    color: Colors.primaryText,
  },
  exchangeCard: {
    padding: 4,
  },
  exchangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  exchangeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    marginLeft: 6,
  },
  exchangeBook: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginVertical: 4,
  },
  exchangeStatus: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  exchangeActions: {
    flexDirection: 'row',
    marginTop: 6,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.secondaryBg,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.primaryText,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.border,
  },
});
