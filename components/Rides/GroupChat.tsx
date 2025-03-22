import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Send } from 'lucide-react-native';
import Colors from '../../constants/Colors';

const GroupChat = ({ chat, message, setMessage, onSendMessage }) => {
  const renderChatMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'Ayesha' ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={styles.messageSender}>{item.sender}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.chatContainer}>
      <FlatList
        data={chat}
        renderItem={renderChatMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          placeholderTextColor={Colors.light.subtext}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={onSendMessage}
        >
          <Send size={20} color={Colors.light.card} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
  chatList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.primary,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  messageSender: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  messageText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  messageTime: {
    fontSize: 12,
    color: Colors.light.subtext,
    alignSelf: 'flex-end',
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GroupChat;