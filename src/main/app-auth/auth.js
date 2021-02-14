import React, {Component} from 'react';
import {
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
  fadeOut,
  slideFadeInRight,
  slideInDown,
  slideInRight,
  slideInUp,
  slideOutLeft,
} from '../../assets/animations';
import {_auth} from '../../assets/config';

const style = StyleSheet.create({
  mainContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccfbff',
  },
  logoBox: {
    alignSelf: 'center',
    borderRadius: 100,
    width: 120,
    height: 120,
    marginTop: 10,
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  loginBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: '#e9e9e9',
    borderWidth: 1,
  },
  title: {
    fontFamily: 'Quicksand-SemiBold',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    fontSize: 20,
    color: '#000',
  },
  subTitle: {
    fontFamily: 'Quicksand-Light',
    marginLeft: 20,
    marginTop: 5,
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
    marginBottom: 10,
  },
  inputFieldText: {
    fontSize: 18,
    color: '#929292',
    marginLeft: 10,
    marginTop: 5,
    fontFamily: 'Quicksand-Regular',
    marginBottom: 5,
  },
  input: {
    marginBottom: 5,
    padding: 0,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20,
    fontFamily: 'Quicksand-Medium',
    color: '#000',
  },
  btn: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    marginRight: 10,
    marginLeft: 10,
  },
  loginBtn: {
    backgroundColor: '#118fca',
    elevation: 2,
    borderRadius: 50,
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
  },
  loginBtnText: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    padding: 10,
  },
});

export default class AuthScreen extends Component {
  state = {
    close: false,
    phoneNumber: '',
    confirmCode: undefined,
    verificationCode: '',
  };
  componentDidMount() {
    this.props.init();
  }
  render() {
    return (
      <Animatable.View
        animation={this.state.close === false ? slideInRight : slideOutLeft}
        style={style.mainContent}>
        <StatusBar barStyle="dark-content" backgroundColor="#ccfbff" />
        <View style={style.logoBox}>
          <Image
            source={require('../../assets/drawable/logo.png')}
            style={style.logo}
          />
        </View>
        {this.state.confirmCode ? (
          <VerifyCode
            updateVerificationCode={(x) => {
              this.setState({verificationCode: x});
            }}
            verificationCode={this.state.verificationCode}
          />
        ) : (
          <SendCode
            updatePhoneNumber={(x) => {
              this.setState({phoneNumber: x});
            }}
            phoneNumber={this.state.phoneNumber}
          />
        )}
        {this.state.confirmCode ? (
          <Animatable.View delay={500} style={style.btn} animation={fadeIn}>
            <TouchableOpacity
              style={style.loginBtn}
              onPress={async () => {
                await setTimeout(async () => {
                  this.props.openSnack('Verifying Code...');
                  await this.state.confirmCode
                    .confirm(this.state.verificationCode)
                    .then(async (x) => {
                      this.props.closeSnack();
                      this.setState({confirmCode: x});
                      await setTimeout(async () => {
                        this.props.openTimedSnack('Verification Succesfull!');
                        this.setState({close: true});
                        await setTimeout(() => {
                          this.props.authorizeUser();
                        }, 500);
                      }, 500);
                    })
                    .catch(async (x) => {
                      this.props.closeSnack();
                      console.log(x);
                      await setTimeout(() => {
                        this.props.openTimedSnack('Verification Failed!');
                      }, 500);
                    });
                }, 100);
              }}>
              <Text style={style.loginBtnText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.loginBtn}
              onPress={async () => {
                await setTimeout(async () => {
                  this.setState({confirmCode: undefined});
                }, 100);
              }}>
              <Text style={style.loginBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Animatable.View>
        ) : (
          <Animatable.View
            delay={500}
            style={style.btn}
            animation={slideInDown}>
            <TouchableOpacity
              style={style.loginBtn}
              onPress={async () => {
                await setTimeout(async () => {
                  this.props.openSnack('Sending Code...');
                  await _auth
                    .signInWithPhoneNumber(this.state.phoneNumber)
                    .then(async (x) => {
                      this.props.closeSnack();
                      this.setState({confirmCode: x});
                      await setTimeout(() => {
                        this.props.openTimedSnack('Code Sent!');
                      }, 500);
                    })
                    .catch(async (x) => {
                      this.props.closeSnack();
                      console.log(x);
                      await setTimeout(() => {
                        this.props.openTimedSnack('Code Sending Failed!');
                      }, 500);
                    });
                }, 100);
              }}>
              <Text style={style.loginBtnText}>Verify</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </Animatable.View>
    );
  }
}

class SendCode extends Component {
  render() {
    return (
      <Animatable.View
        delay={500}
        style={style.loginBox}
        animation={slideInDown}>
        <ScrollView>
          <Text style={style.title}>
            Enter your phone number to get started
          </Text>
          <Text style={style.subTitle}>
            We will send you a verification code
          </Text>
          <View style={style.inputField}>
            <Text style={style.inputFieldText}>PhoneNumber</Text>
            <TextInput
              style={style.input}
              placeholder="+1 650-555-3434"
              onChangeText={(x) => {
                this.props.updatePhoneNumber(x);
              }}
              value={this.props.phoneNumber}
            />
          </View>
        </ScrollView>
      </Animatable.View>
    );
  }
}
class VerifyCode extends Component {
  render() {
    return (
      <Animatable.View
        delay={500}
        style={style.loginBox}
        animation={slideInDown}>
        <ScrollView>
          <Text style={style.title}>Enter the code we sent you</Text>
          <Text style={style.subTitle}>
            Authenticate your phone number to proceed
          </Text>
          <View style={style.inputField}>
            <Text style={style.inputFieldText}>Verification Code</Text>
            <TextInput
              style={style.input}
              placeholder="123456"
              onChangeText={(x) => {
                this.props.updateVerificationCode(x);
              }}
              value={this.props.verificationCode}
            />
          </View>
        </ScrollView>
      </Animatable.View>
    );
  }
}
