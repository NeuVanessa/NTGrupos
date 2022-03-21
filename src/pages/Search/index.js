import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  FlatList,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {useIsFocused} from '@react-navigation/native';
import ChatList from '../../components/ChatList';

const Search = () => {
  const isFocused = useIsFocused();
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;

    setUser(hasUser);
  }, [isFocused]);

  const handleSearch = async () => {
    if (input == '') return;
    const responseSearch = await firestore()
      .collection('MESSAGE_THREADS')
      .where('name', '>=', input)
      .where('name', '<=', input, +'\uf8ff')
      .get()
      .then(querySnapshot => {
        const threads = querySnapshot.docs.map(documentsSnapshot => {
          return {
            _id: documentsSnapshot.id,
            name: '',
            lastMessage: {
              text: '',
            },
            ...documentsSnapshot.data(),
          };
        });
        setChats(threads);
        setInput('');
        Keyboard.dismiss();
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          placeholder="Digite o nome da sala"
          style={styles.textInput}
          onChangeText={text => setInput(text)}
          autoCapitalize={'none'}
        />
        <TouchableOpacity style={styles.buttonSearch} onPress={handleSearch}>
          <MaterialIcon name="search" color="#FFF" size={30} />
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={chats}
        keyExtractor={item => item._id}
        renderItem={({item}) => <ChatList data={item} userStatus={user} />}
      />
    </SafeAreaView>
  );
};
export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  containerInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 14,
  },
  textInput: {
    backgroundColor: '#ebebeb',
    marginLeft: 10,
    height: 50,
    width: '80%',
    padding: 5,
    borderRadius: 5,
  },
  buttonSearch: {
    backgroundColor: '#2e54d4',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    marginLeft: 5,
    marginRight: 10,
  },
});
