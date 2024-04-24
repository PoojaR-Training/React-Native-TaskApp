import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import data from '../../assests/data.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = () => {
  const [notificationList, setNotificationList] = useState([]);
  const [showNotificationBox, setShowNotificationBox] = useState(false);
  const navigation = useNavigation();

  const handleShowNotification = async () => {
    setShowNotificationBox(true);
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomItem = data[randomIndex];
    const newNotification = {
      item: randomItem,
      createdAt: new Date(), 
      markAsRead: false,
      index: Date.now(),
    };

    let newData = await AsyncStorage.getItem('demonotification1');
    newData = newData ? JSON.parse(newData) : [];

    newData.push({...newNotification});

    await AsyncStorage.setItem('demonotification1', JSON.stringify(newData));

    const updatedList = [
      newNotification,
      ...notificationList.map(notification => ({
        ...notification,
        timeAgo: getTimeAgo(notification.createdAt),
      })),
    ];

    setNotificationList(updatedList);
  };

  const handleMarkAsRead = async id => {
    try {
      let newData = await AsyncStorage.getItem('demonotification1');
      newData = newData ? JSON.parse(newData) : [];

      const index = newData.findIndex(item => item.index === id);
      
      if (index !== -1) {
        const data = {
          createdAt: newData[index].createdAt,
          index: newData[index].index,
          item: newData[index].item,
          markAsRead:true
        };
        newData[index] = {...newData[index], ...data};
        await AsyncStorage.setItem('demonotification1', JSON.stringify(newData));
        Alert.alert('Notification Marked as Read');
        setNotificationList(prevList =>
          prevList.filter(notification => notification.index !== id),
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    setNotificationList(prevList =>
      prevList.map(notification => ({
        ...notification,
        timeAgo: getTimeAgo(notification.createdAt),
      })),
    );
    const timer = setInterval(() => {
      setNotificationList(prevList =>
        prevList.map(notification => ({
          ...notification,
          timeAgo: getTimeAgo(notification.createdAt),
        })),
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleClearNotifications = () => {
    setNotificationList([]);
    setShowNotificationBox(false);
  };

  const getTimeAgo = timestamp => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diff = now.getTime() - createdAt.getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) {
      return 'just now';
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <View style={styles.container}>
      {showNotificationBox && notificationList?.length > 0 ? (
        <View style={styles.notificationBox}>
          <ScrollView contentContainerStyle={styles.notificationList}>
            {notificationList.map(notification => (
              <TouchableOpacity
                onPress={() => handleMarkAsRead(notification.index)}>
                <View style={styles.notification} key={notification.id}>
                  <Image
                    source={{uri: notification.item.profilePhoto}}
                    style={styles.profilePhoto}
                  />
                  <View style={styles.notificationContent}>
                    <View style={styles.headerText}>
                      <Text style={styles.name}>{notification.item.name}</Text>
                      <Text style={styles.time}>{notification.timeago?notification.timeAgo:'just now'}</Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.title}>
                        {notification.item.title}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.clearButtonContainer}>
              <View style={{flex: 1}} />
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearNotifications}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleShowNotification}>
        <Text style={styles.buttonText}>Show Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button }
        onPress={() => navigation.navigate('NotificationList')}>
        <Text style={styles.buttonText}>Old Notifications</Text>
      </TouchableOpacity>
      <Text style={styles.instruction}>
        Tap on 'Show Notification' to pop up a new notification. Once a notification is read, it will move to the old notification list.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6f97ad',
    padding: 20,
  },
  button: {
    backgroundColor: '#e86017',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  clearButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: 'transparent',
    padding: 10,
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'right',
  },
  notificationBox: {
    position: 'absolute',
    top: 10,
    width: '100%',
    backgroundColor: '#a7adb0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    height: '30%',
    borderRadius: 20,
    padding: 10,
  },
  notificationList: {
    flexGrow: 0.3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    width: '100%',
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'column',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
  },
  descriptionContainer: {
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
  },
  instruction: {
    color: '#e86017',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 20,
    fontWeight:'bold'
  },
  
});

export default NotificationScreen;
