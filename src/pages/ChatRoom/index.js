import React, {useState, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';

import {useNavigation, useIsFocused} from '@react-navigation/core';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FabButton from '../../components/FabButton';
import ModalNewRoom from '../../components/ModalNewRoom';
import ChatList from '../../components/ChatList';

const ChatRoom = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateScreen, setUpdateScreen] = useState(false);

  useEffect(() => {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
    setUser(hasUser);
  }, [isFocused]);

  useEffect(() => {
    let isActive = true;

    const getChats = () => {
      firestore()
        .collection('MESSAGE_THREADS')
        .orderBy('lastMessage.createdAt', 'desc')
        .limit(10)
        .get()
        .then(snapshot => {
          const threads = snapshot.docs.map(documentsSnapshot => {
            return {
              _id: documentsSnapshot.id,
              name: '',
              lastMessage: {text: ''},
              ...documentsSnapshot._data,
            };
          });
          if (isActive) {
            setThreads(threads);
            setLoading(false);
          }
        })
        .catch();
    };
    getChats();

    return () => {
      isActive = false;
    };
  }, [isFocused, updateScreen]);

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        setUser(null);
        navigation.navigate('SignIn');
      })
      .catch(() => {
        console.log('nao tem user');
      });
  };

  const deleteRoom = (ownerId, idRoom) => {
    //se o cara que quer deletar nao for dono da sala
    if (ownerId !== user?.uid) return;

    Alert.alert('Atenção', 'Você tem certeza que desejar deletar essa sala?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => handleDeleteRoom(idRoom),
      },
    ]);
  };

  const handleDeleteRoom = async id => {
    await firestore().collection('MESSAGE_THREADS').doc(id).delete();

    setUpdateScreen(!updateScreen);
  };

  if (loading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" color="#555" />
      </SafeAreaView>
    );
  }
  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: '#2e54d4'}} />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRoom}>
          <View style={styles.headerRoomLeft}>
            {user && (
              <TouchableOpacity onPress={handleSignOut}>
                <MaterialIcons name="arrow-back" size={28} color="#FFF" />
              </TouchableOpacity>
            )}
            <Text style={styles.title}>Grupos</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MaterialIcons name="search" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={threads}
          keyExtractor={item => item._id}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <ChatList
              data={item}
              deleteRoom={() => deleteRoom(item.owner, item._id)}
              userStatus={user}
            />
          )}
        />
        <FabButton setVisible={() => setModalVisible(true)} userStatus={user} />
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <ModalNewRoom
            setVisible={() => setModalVisible(false)}
            setUpdateScreen={() => setUpdateScreen(!updateScreen)}
          />
        </Modal>
      </SafeAreaView>
    </>
  );
};
export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerRoom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: '#2e54d4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 10,
  },
  headerRoomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: '#FFF',
  },
});
