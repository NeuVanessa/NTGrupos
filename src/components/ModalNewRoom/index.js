import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ModalNewRoom = ({setVisible, setUpdateScreen}) => {
  const [roomName, setRoomName] = useState('');

  const user = auth().currentUser.toJSON();

  const handleButtonCreate = () => {
    if (roomName === '') return;

    //deixar apenar cada usuario criar 10 grupos

    firestore()
      .collection('MESSAGE_THREADS')
      .get()
      .then(snapshot => {
        let myThreads = 0;

        snapshot.docs.map(docItem => {
          console.log(docItem.data().owner);
          if (docItem.data().owner === user.uid) {
            myThreads += 1;
          }
        });
        if (myThreads >= 6) {
          Alert.alert('Você ja atingiu o limite de grupos por usuario');
        } else {
          createRoom();
        }
      });
  };
  //criar sala no firestore
  const createRoom = () => {
    firestore()
      .collection('MESSAGE_THREADS')
      .add({
        name: roomName,
        owner: user.uid,
        lastMessage: {
          text: `Grupo ${roomName} criado. Bem vindo(a)!`,
          createdAt: firestore.FieldValue.serverTimestamp(),
        },
      })
      .then(docRef => {
        docRef
          .collection('MESSAGES')
          .add({
            text: `Grupo ${roomName} criado. Bem vindo(a)!`,
            createdAt: firestore.FieldValue.serverTimestamp(),
            system: true,
          })
          .then(() => {
            setVisible();
            setUpdateScreen();
          });
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={setVisible}>
          <View style={styles.modal}></View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Criar um novo Grupo?</Text>
            <TextInput
              style={styles.input}
              value={roomName}
              onChangeText={text => setRoomName(text)}
              placeholder="Nome para sua sala"
              placeholderTextColor={'#000'}
            />

            <TouchableOpacity
              style={styles.buttonCreate}
              onPress={handleButtonCreate}>
              <Text style={styles.buttonText}>Criar sala</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={setVisible} style={styles.backButton}>
              <Text>Voltar</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ModalNewRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, .4)',
  },
  modal: {
    flex: 2,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
  },
  title: {
    marginTop: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
  },
  input: {
    borderRadius: 4,
    height: 45,
    backgroundColor: '#DDD',
    marginVertical: 15,
    paddingLeft: 15,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  buttonCreate: {
    borderRadius: 4,
    backgroundColor: '#2E54D4',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFF',
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
