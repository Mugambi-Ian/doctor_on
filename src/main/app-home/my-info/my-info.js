/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
  fadeIn,
  slideInDown,
  slideInRight,
  slideOutLeft,
} from '../../../assets/animations';
import {_auth, _database, _storage} from '../../../assets/config';
import ImagePicker from 'react-native-image-crop-picker';
import {PulseIndicator} from 'react-native-indicators';
const style = StyleSheet.create({
  mainContent: {
    height: '100%',
    width: '100%',
    backgroundColor: '#d4fffe',
  },
  loader: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    top: 0,
    marginTop: '70%',
  },
  loaderText: {
    alignSelf: 'center',
    color: '#ffffff',
    backgroundColor: '#118fca',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 10,
    marginTop: '150%',
    borderRadius: 50,
    fontSize: 20,
    fontFamily: 'Quicksand-Regular',
  },
  editBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontFamily: 'Quicksand-SemiBold',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    fontSize: 20,
    color: '#000',
    marginBottom: 20,
  },
  subTitle: {
    fontFamily: 'Quicksand-Light',
    marginLeft: 20,
    marginTop: 20,
    marginRight: 20,
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  inputField: {
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 4,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
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
  },
  field: {
    flexDirection: 'row',
    flex: 1,
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
  btn: {
    marginBottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 5,
  },
  editBtn: {
    backgroundColor: '#118fca',
    elevation: 2,
    borderRadius: 50,
    flex: 1,
    marginRight: 5,
    marginLeft: 5,
    maxHeight: 40,
  },
  editBtnText: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    padding: 10,
  },
  textLink: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 20,
    color: '#111',
    fontFamily: 'Quicksand-Light',
    fontSize: 16,
    borderColor: '#fff',
    borderBottomColor: '#118fca',
    borderWidth: 2,
    borderRadius: 10,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 5,
    marginBottom: 20,
  },
});
export default class MyInfo extends Component {
  state = {
    loading: true,
    close: false,
    userName: '',
    title: '',
    idNumber: '',
    practice: '',
  };

  async componentDidMount() {
    const {
      userName,
      userDp,
      phoneNumber,
      practice,
      title,
      idNumber,
    } = this.props.user;
    const user = {userName, userDp, phoneNumber, practice, title, idNumber};
    await setTimeout(() => {
      this.setState(user);
    }, 100);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      async () => {
        if (user.userName) {
          this.setState({close: true});
          await setTimeout(() => {
            this.props.closeInfo();
          }, 400);
        } else {
          BackHandler.exitApp();
        }
        return true;
      },
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  render() {
    return (
      <Animatable.View
        animation={this.state.close === false ? slideInRight : slideOutLeft}
        style={style.mainContent}>
        <StatusBar barStyle="dark-content" backgroundColor="#d4fffe" />
        <Animatable.View
          delay={500}
          style={style.editBox}
          animation={slideInDown}>
          <Text style={style.title}>Enter your information</Text>
          <ScrollView>
            <View style={style.inputField}>
              <Text style={style.inputFieldText}>*Title</Text>
              <View style={style.field}>
                <Image
                  source={require('../../../assets/drawable/icon-title.png')}
                  style={style.inputIcon}
                />
                <TextInput
                  style={style.input}
                  placeholder="Dr."
                  onChangeText={(x) => {
                    this.setState({title: x});
                  }}
                  value={this.state.title}
                />
              </View>
            </View>
            <View style={style.inputField}>
              <Text style={style.inputFieldText}>*Full Name</Text>
              <View style={style.field}>
                <Image
                  source={require('../../../assets/drawable/icon-account.png')}
                  style={style.inputIcon}
                />
                <TextInput
                  style={style.input}
                  placeholder="Peter Kirui"
                  onChangeText={(x) => {
                    this.setState({userName: x});
                  }}
                  value={this.state.userName}
                />
              </View>
            </View>
            <View style={style.inputField}>
              <Text style={style.inputFieldText}>*Id Number</Text>
              <View style={style.field}>
                <Image
                  source={require('../../../assets/drawable/icon-id-card.png')}
                  style={style.inputIcon}
                />
                <TextInput
                  style={style.input}
                  placeholder="Id Number"
                  onChangeText={(x) => {
                    this.setState({idNumber: x});
                  }}
                  value={this.state.idNumber}
                />
              </View>
            </View>
            <View style={style.inputField}>
              <Text style={style.inputFieldText}>*Major Practice</Text>
              <View style={style.field}>
                <Image
                  source={require('../../../assets/drawable/icon-practice.png')}
                  style={style.inputIcon}
                />
                <TextInput
                  style={style.input}
                  placeholder="Clinical Medicine"
                  onChangeText={(x) => {
                    this.setState({practice: x});
                  }}
                  value={this.state.practice}
                />
              </View>
            </View>
          </ScrollView>
          <Animatable.View
            delay={500}
            style={style.btn}
            animation={slideInDown}>
            <TouchableOpacity
              style={style.editBtn}
              onPress={async () => {
                await setTimeout(async () => {
                  if (
                    this.state.userName.length !== 0 &&
                    this.state.idNumber.length !== 0 &&
                    this.state.title.length !== 0 &&
                    this.state.practice.length !== 0
                  ) {
                    this.props.openSnack('Saving');
                    await _database
                      .ref('doctors/' + _auth.currentUser.uid)
                      .once('value', async (x) => {
                        this.props.closeSnack();
                        await x.child('userName').ref.set(this.state.userName);
                        await x.child('idNumber').ref.set(this.state.idNumber);
                        await x.child('title').ref.set(this.state.title);
                        await x.child('practice').ref.set(this.state.practice);
                        await x
                          .child('phoneNumber')
                          .ref.set(_auth.currentUser.phoneNumber);
                        this.setState({close: true});
                        await setTimeout(() => {
                          this.props.openTimedSnack('Save Successfull');
                        }, 100);
                        await setTimeout(() => {
                          this.props.closeInfo();
                        }, 500);
                      })
                      .catch(async () => {
                        this.props.closeSnack();
                        await setTimeout(() => {
                          this.props.openTimedSnack('Save Failed');
                        }, 100);
                      });
                  } else {
                    this.props.openTimedSnack('All fields are required!');
                  }
                }, 100);
              }}>
              <Text style={style.editBtnText}>Update Info</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </Animatable.View>
    );
  }
}

export class SetDp extends Component {
  state = {
    loading: false,
    close: false,
  };
  render() {
    return this.state.loading === true ? (
      <Animatable.View style={style.mainContent} animation={fadeIn}>
        <StatusBar barStyle="dark-content" backgroundColor="#d4fffe" />
        <PulseIndicator color={'#118fca'} style={style.loader} size={100} />
        <Text style={style.loaderText}>Uploading Photo</Text>
      </Animatable.View>
    ) : (
      <Animatable.View
        animation={this.state.close === false ? slideInRight : slideOutLeft}
        style={style.mainContent}>
        <StatusBar barStyle="dark-content" backgroundColor="#d4fffe" />
        <Animatable.View
          delay={500}
          style={{
            ...style.editBox,
            marginTop: 200,
            alignSelf: 'center',
            maxHeight: 200,
            borderRadius: 20,
            width: '90%',
          }}
          animation={slideInRight}>
          <Text style={{...style.title, marginTop: 50, alignSelf: 'center'}}>
            Take a current photo of you
          </Text>
          <TouchableOpacity
            style={{
              ...style.editBtn,
              marginTop: 20,
              marginLeft: 50,
              marginRight: 50,
            }}
            onPress={async () => {
              await setTimeout(async () => {
                ImagePicker.openCamera({
                  width: 400,
                  height: 400,
                  cropping: true,
                }).then(async (image) => {
                  this.setState({loading: true});
                  const response = await fetch(image.path);
                  const _file = await response.blob();
                  const id = _auth.currentUser.uid + new Date().getTime();
                  const uploadTask = _storage
                    .ref('doctors/' + _auth.currentUser.uid)
                    .child(id)
                    .put(_file);
                  uploadTask
                    .on(
                      'state_changed',
                      function () {
                        uploadTask.snapshot.ref
                          .getDownloadURL()
                          .then(
                            async function (downloadURL) {
                              var url = '' + downloadURL;
                              await _database
                                .ref('doctors/' + _auth.currentUser.uid)
                                .child('userDp')
                                .set(url);
                              this.setState({close: true});
                              await setTimeout(() => {
                                this.props.closeInfo();
                              }, 500);
                              this.props.openTimedSnack('Save Successfull');
                            }.bind(this),
                          )
                          .catch(async (e) => {
                            console.log(e);
                          });
                      }.bind(this),
                    )
                    .bind(this);
                });
              }, 100);
            }}>
            <Text style={style.editBtnText}>Take Photo</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    );
  }
}
