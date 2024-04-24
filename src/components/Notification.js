import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notification = ({ item, onNotificationClick }) => {
  const getTimeFromCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const time = getTimeFromCreatedAt(item.createdAt);

  const handlePress = async () => {
    try {
      if (!item.markAsRead) {
        const newData = await AsyncStorage.getItem('demonotification1');
        const parsedData = newData ? JSON.parse(newData) : [];
        const updatedData = parsedData.map((notification) => {
          if (notification.index === item.index) {
            return { ...notification, markAsRead: true };
          }
          return notification;
        });
        await AsyncStorage.setItem('demonotification1', JSON.stringify(updatedData));
        
        Alert.alert('Notification Marked as Read');
        onNotificationClick();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.card, { backgroundColor: item.markAsRead ? '#FFF' : '#E0E0E0' }]}>
        <View style={styles.header}>
          <Image source={{ uri: item.item.profilePhoto }} style={styles.profilePhoto} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{item.item.name}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
        <Text style={styles.title}>{item.item.title}</Text>
        <Text style={styles.description}>{item.item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
});

export default Notification;
