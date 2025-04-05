import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Send } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { db } from '../../firebaseConfig'; // Import Firebase config
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupChat = () => {
  const { id: rideId } = useLocalSearchParams(); // Get ride ID from route params
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  // Fetch and listen to real-time chat messages from Firestore
  useEffect(() => {
    if (!rideId) return;

    const q = query(
      collection(db, 'ride_chats', rideId, 'messages'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Handle null timestamp by falling back to current date
          timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
        };
      });
      setChatMessages(messages);
    }, (error) => {
      console.error('Error fetching chat messages:', error);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [rideId]);

  // Send a message to Firestore
  const onSendMessage = async () => {
    if (!message.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, 'ride_chats', rideId, 'messages'), {
        userId: currentUser.id,
        sender: `${currentUser.first_name} ${currentUser.last_name}`,
        message: message.trim(),
        timestamp: serverTimestamp(),
      });
      setMessage(''); // Clear input after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderChatMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.userId === currentUser?.id ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
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
        data={chatMessages}
        renderItem={renderChatMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        inverted // Show newest messages at the bottom
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
        <TouchableOpacity style={styles.sendButton} onPress={onSendMessage}>
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