import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Notification from '../components/Notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationList = () => {
  const [oldNotifications, setOldNotifications] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem('demonotification1');
      if (data) {
        const sortedNotifications = JSON.parse(data).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOldNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error('Error fetching old notifications:', error);
    }
  };

  const renderHeader = (title) => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );

  const renderNotifications = () => {
    if (oldNotifications.length === 0) {
      return <Text style={styles.noNotificationText}>No notifications</Text>;
    }

    const groupedNotifications = {};
    oldNotifications.forEach(notification => {
      const date = new Date(notification.createdAt).toLocaleDateString();
      if (!groupedNotifications[date]) {
        groupedNotifications[date] = [];
      }
      groupedNotifications[date].push(notification);
    });

    return Object.entries(groupedNotifications).map(([date, notifications]) => (
      <View key={date}>
        {renderHeader(date === new Date().toLocaleDateString() ? 'Today' : date)}
        {notifications.map(notification => (
          <Notification key={notification.index} item={notification} onNotificationClick={fetchData}/>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderNotifications()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#6f97ad',
    padding: 10,
  },
  header: {
    backgroundColor: '#222d3d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  noNotificationText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationList;
