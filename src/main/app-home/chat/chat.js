/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  BackHandler,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {slideInDownLess, slideInRight} from '../../../assets/animations';
import {
  currentTime,
  dateToday,
  idDate,
  _auth,
  _database,
} from '../../../assets/config';

const style = StyleSheet.create({
  mainContent: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
  inputField: {
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 4,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  inputFieldText: {
    fontSize: 18,
    color: '#929292',
    marginLeft: 10,
    marginTop: 5,
    fontFamily: 'Quicksand-Regular',
  },
  input: {
    marginRight: 10,
    fontSize: 20,
    fontFamily: 'Quicksand-Medium',
    color: '#000',
    flex: 1,
    maxHeight: 60,
    marginLeft: 10,
  },
  field: {
    flexDirection: 'row',
    paddingBottom: 2,
  },
  inputIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 10,
    marginLeft: 15,
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    fontSize: 25,
    color: '#000',
    marginBottom: 5,
  },
  text: {
    fontFamily: 'Quicksand-Regular',
    marginTop: 10,
    fontSize: 18,
    marginBottom: 10,
    color: '#118fca',
    alignSelf: 'center',
  },
  chatBox: {
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 4,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    paddingBottom: 10,
  },
  practice: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#118fca',
    borderRadius: 10,
    maxWidth: 90,
    marginLeft: 20,
    height: 35,
  },
  date: {
    alignSelf: 'center',
    borderColor: '#118fca',
    padding: 5,
    borderRadius: 5,
    margin: 5,
    fontFamily: 'Quicksand-Light',
    fontSize: 18,
    color: '#118fca',
    borderWidth: 1,
  },
  sent: {
    maxWidth: 300,
    margin: 5,
    backgroundColor: '#5dbcd2',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 20,
    fontFamily: 'Quicksand-Regular',
    fontSize: 18,
  },
  recieved: {
    maxWidth: 300,
    margin: 5,
    backgroundColor: '#118fca',
    padding: 10,
    borderRadius: 20,
    fontFamily: 'Quicksand-Regular',
    fontSize: 18,
  },
  timeStamp: {fontFamily: 'Quicksand-Bold'},
  message: {
    marginTop: 5,
    color: '#fff',
  },
});

export default class Chat extends Component {
  state = {
    messages: [],
    newText: '',
  };
  async componentDidMount() {
    this.db = _database.ref();
    this.bc = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.currentChat) {
        this.setState({currentChat: undefined});
        this.props.navOff(undefined);
      } else {
        BackHandler.exitApp();
      }
      return true;
    });
    const userId = _auth.currentUser.uid;
    this.db.on('value', (x) => {
      const d = x.child('chats/doctors/' + userId);
      const d_ = [];
      d.forEach((it) => {
        const chat = it.val();
        const z = x.child('customers/' + chat.customerId).val();
        d_.push({doc: z, chat});
      });
      this.setState({messages: d_});
    });
  }
  componentWillUnmount() {
    this.bc.remove();
  }
  render() {
    return this.state.currentChat ? (
      this.state.conditions ? (
        <Conditions
          id={this.state.conditions}
          close={() => {
            this.setState({conditions: undefined});
          }}
          openSnack={this.props.openSnack}
          openTimedSnack={this.props.openTimedSnack}
          closeSnack={this.props.closeSnack}
        />
      ) : (
        <CurrentChat
          setId={(x) => {
            this.setState({conditions: x});
          }}
          doc={this.state.currentChat.doc}
          customer={this.props.user}
          chat={this.state.currentChat.chat}
        />
      )
    ) : (
      <Animatable.View animation={slideInDownLess} style={style.mainContent}>
        <Text style={style.title}>Messaging</Text>
        <View style={{marginTop: 10}} />
        <ScrollView style={{maxHeight: '80%'}}>
          {this.state.messages.map((x, i) => {
            const {doc, chat} = x;
            return (
              <TouchableOpacity
                onPress={async () => {
                  await setTimeout(() => {
                    this.setState({currentChat: {doc: doc, chat: chat}});
                    this.props.navOff(true);
                  }, 100);
                }}
                key={i}
                style={style.chatBox}>
                <Image
                  source={{uri: doc.userDp}}
                  style={{width: 60, height: 60, borderRadius: 80, margin: 10}}
                />
                <View
                  style={{
                    height: 60,
                    alignSelf: 'center',
                    backgroundColor: '#118fca',
                    marginRight: 20,
                    width: 2,
                  }}
                />
                <View style={{flex: 1, marginRight: 20}}>
                  <Text
                    style={{
                      fontFamily: 'Quicksand-SemiBold',
                      marginTop: 10,
                      fontSize: 22,
                      color: '#000',
                      marginBottom: 2,
                    }}>
                    {doc.userName}
                  </Text>

                  <Text
                    style={
                      doc.online
                        ? {
                            fontFamily: 'Quicksand-Regular',
                            fontSize: 18,
                            color: '#0ef',
                            alignSelf: 'flex-end',
                          }
                        : {
                            fontFamily: 'Quicksand-Regular',
                            fontSize: 18,
                            color: '#f11',
                            alignSelf: 'flex-end',
                          }
                    }>
                    {doc.online ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animatable.View>
    );
  }
}
class CurrentChat extends Component {
  state = {
    doc: {},
    customer: {},
    chat: {},
    messages: [],
  };
  componentDidMount() {
    const {doc, customer, chat} = this.props;
    setTimeout(() => {
      this.setState({doc, customer, chat});
    }, 50);
    this.db = _database.ref('chats/inbox/' + chat.msgId);
    this.db.on('value', (x) => {
      var text = [];
      x.forEach((dm) => {
        var messages = [];
        dm.forEach((m) => {
          messages.push(m.val());
        });
        messages = messages.reverse();
        text.push({
          messages,
          date: dm.key,
        });
      });
      text = text.reverse();
      this.setState({messages: text});
    });
  }

  render() {
    const {doc, chat} = this.state;
    return (
      <Animatable.View
        animation={slideInDownLess}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: '#fff',
        }}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Text style={style.title}>{doc.userName}</Text>
            <TouchableOpacity
              onPress={() => {
                this.props.setId(chat.customerId);
              }}>
              <Text style={style.practice}>Condtions</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{uri: doc.userDp}}
            style={{
              width: 80,
              height: 80,
              borderRadius: 80,
              position: 'absolute',
              right: 20,
              top: 15,
              elevation: 2,
            }}
          />
        </View>
        <ScrollView style={{maxHeight: '75%'}}>
          {this.state.messages.map((c, i) => {
            return (
              <View key={i}>
                <Text style={style.date}>{c.date}</Text>
                {c.messages.map((d, i) => {
                  return (
                    <View
                      key={i}
                      style={
                        d.senderId === _auth.currentUser.uid
                          ? style.sent
                          : style.recieved
                      }>
                      <Text style={style.timeStamp}>{d.time}</Text>
                      {d.Image ? (
                        <Image style={{width: 350, height: 350}} />
                      ) : (
                        <View style={{display: 'none'}} />
                      )}
                      <Text style={style.message}>{d.msg}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
        <View style={style.inputField}>
          <View style={style.field}>
            <TextInput
              style={style.input}
              placeholder="Message"
              onChangeText={(x) => {
                this.setState({newText: x});
              }}
              multiline
              numberOfLines={3}
              value={this.state.newText}
            />
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={async () => {
                const msg = {
                  date: dateToday(),
                  time: currentTime(),
                  msg: this.state.newText,
                  id: idDate(),
                  senderId: _auth.currentUser.uid,
                };
                this.setState({newText: ''});
                if (msg.id) {
                  await this.db.child(msg.id).set(msg);
                  Keyboard.dismiss();
                }
              }}>
              <Image
                source={require('../../../assets/drawable/icon-send.png')}
                style={style.inputIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    );
  }
}
class Conditions extends Component {
  state = {
    conditions: [],
  };
  componentDidMount() {
    this.db = _database.ref('customers/' + this.props.id + '/conditions');
    this.bc = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.close();
      return true;
    });
    this.db.on('value', (x) => {
      const c_ = [];
      x.forEach((d) => {
        c_.push({id: d.key, val: d.val()});
      });
      this.setState({conditions: c_});
    });
  }
  componentWillUnmount() {
    this.db.off();
    this.bc.remove();
  }
  render() {
    return (
      <Animatable.View animation={slideInRight}>
        <Text style={style.title}>Medical Condtions</Text>
        <ScrollView style={{minHieght: 200, marginTop: 20}}>
          {this.state.conditions.map((d, i) => {
            console.log(d);
            return (
              <View
                style={{
                  borderRadius: 5,
                  backgroundColor: '#fff',
                  elevation: 2,
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 5,
                }}>
                <Text style={style.text}>{d.val}</Text>
              </View>
            );
          })}
        </ScrollView>
      </Animatable.View>
    );
  }
}
