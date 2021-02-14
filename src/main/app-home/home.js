/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  BackHandler,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {PulseIndicator} from 'react-native-indicators';
import {fadeIn, slideInDown, slideInRight} from '../../assets/animations';
import {_auth, _database} from '../../assets/config';
import MyInfo, {SetDp} from './my-info/my-info';
import LocationWidget from './pin-location/pin-location';
import MyProfile from './my-profile/my-profile';
import Chat from './chat/chat';
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
  navBar: {
    position: 'absolute',
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
    height: 60,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  bgImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    elevation: 4,
    marginLeft: 2,
    marginRight: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
  },
  navItemIcon: {
    height: 25,
    width: 25,
    marginTop: 5,
    marginBottom: 2,
    alignSelf: 'center',
  },
  navItemText: {
    alignSelf: 'center',
    fontFamily: 'Quicksand-Regular',
    color: '#999',
    marginBottom: 5,
  },
});
export default class Home extends Component {
  state = {
    loading: true,
    init: undefined,
    user: {
      userName: '',
      userDp: '',
      phoneNumber: '',
      practice: '',
      title: '',
      idNumber: '',
    },
  };
  async componentDidMount() {
    await _database.ref('doctors/' + _auth.currentUser.uid).on('value', (x) => {
      if (x.hasChild('userName') === false) {
        this.setState({init: true});
      } else {
        const {
          userName,
          userDp,
          phoneNumber,
          practice,
          title,
          idNumber,
        } = x.val();
        const user = {userName, userDp, phoneNumber, practice, title, idNumber};
        this.setState({user: user});
      }
      if (x.hasChild('userDp') === false) {
        this.setState({setDp: true});
      }

      this.setState({loading: false});
    });
  }
  render() {
    return (
      <Animatable.View animation={fadeIn} style={{backgroundColor: '#fff'}}>
        {this.state.loading === true ? (
          <View style={style.mainContent}>
            <PulseIndicator color={'#118fca'} style={style.loader} size={100} />
            <Text style={style.loaderText}>Please Hold...</Text>
          </View>
        ) : this.state.init ? (
          <MyInfo
            user={this.state.user}
            openSnack={this.props.openSnack}
            openTimedSnack={this.props.openTimedSnack}
            closeSnack={this.props.closeSnack}
            closeInfo={() => {
              this.setState({init: undefined});
            }}
          />
        ) : this.state.setDp ? (
          <SetDp
            openSnack={this.props.openSnack}
            openTimedSnack={this.props.openTimedSnack}
            closeSnack={this.props.closeSnack}
            closeInfo={() => {
              this.setState({setDp: undefined});
            }}
          />
        ) : (
          <LandingPage
            openSnack={this.props.openSnack}
            openTimedSnack={this.props.openTimedSnack}
            closeSnack={this.props.closeSnack}
            user={this.state.user}
            updateInfo={() => {
              this.setState({init: true});
            }}
            unauthorizeUser={this.props.unauthorizeUser}
          />
        )}
      </Animatable.View>
    );
  }
}

class LandingPage extends Component {
  state = {
    currentscreen: 'home',
  };
  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  render() {
    return (
      <Animatable.View
        animation={slideInRight}
        style={{...style.mainContent, backgroundColor: '#fff'}}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {this.state.currentscreen === 'home' ? (
          <LocationWidget openTimedSnack={this.props.openTimedSnack} />
        ) : this.state.currentscreen === 'profile' ? (
          <MyProfile
            user={this.props.user}
            openSnack={this.props.openSnack}
            openTimedSnack={this.props.openTimedSnack}
            closeSnack={this.props.closeSnack}
            updateInfo={this.props.updateInfo}
            unauthorizeUser={this.props.unauthorizeUser}
          />
        ) : this.state.currentscreen === 'chat' ? (
          <Chat
            user={this.props.user}
            openSnack={this.props.openSnack}
            openTimedSnack={this.props.openTimedSnack}
            closeSnack={this.props.closeSnack}
            newChat={this.state.newChat}
            navOff={(c) => {
              this.setState({navOff: c});
            }}
          />
        ) : (
          <View />
        )}
        {this.state.navOff ? (
          <View style={{display: 'none'}} />
        ) : (
          <Animatable.View
            animation={slideInDown}
            delay={200}
            style={style.navBar}>
            <TouchableOpacity
              style={
                this.state.currentscreen === 'home'
                  ? {
                      ...style.navItem,
                      backgroundColor: '#118fca',
                      borderTopLeftRadius: 0,
                      marginLeft: 0,
                      marginRight: 4,
                    }
                  : {
                      ...style.navItem,
                      borderTopLeftRadius: 0,
                      marginLeft: 0,
                      marginRight: 4,
                    }
              }
              onPress={async () => {
                if (this.state.currentscreen !== 'home') {
                  await setTimeout(() => {
                    this.setState({currentscreen: 'home'});
                  }, 100);
                }
              }}>
              <Image
                source={require('../../assets/drawable/icon-home.png')}
                style={style.navItemIcon}
              />
              <Text
                style={
                  this.state.currentscreen === 'home'
                    ? {
                        ...style.navItemText,
                        color: '#fff',
                        fontFamily: 'Quicksand-Medium',
                      }
                    : style.navItemText
                }>
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                this.state.currentscreen === 'chat'
                  ? {...style.navItem, backgroundColor: '#118fca'}
                  : style.navItem
              }
              onPress={async () => {
                if (this.state.currentscreen !== 'chat') {
                  await setTimeout(() => {
                    this.setState({currentscreen: 'chat'});
                  }, 100);
                }
              }}>
              <Image
                source={require('../../assets/drawable/icon-chat.png')}
                style={style.navItemIcon}
              />
              <Text
                style={
                  this.state.currentscreen === 'chat'
                    ? {
                        ...style.navItemText,
                        color: '#fff',
                        fontFamily: 'Quicksand-Medium',
                      }
                    : style.navItemText
                }>
                Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                this.state.currentscreen === 'profile'
                  ? {
                      ...style.navItem,
                      backgroundColor: '#118fca',
                      borderTopRightRadius: 0,
                      marginRight: 0,
                      marginLeft: 4,
                    }
                  : {
                      ...style.navItem,
                      borderTopRightRadius: 0,
                      marginRight: 0,
                      marginLeft: 4,
                    }
              }
              onPress={async () => {
                if (this.state.currentscreen !== 'profile') {
                  await setTimeout(() => {
                    this.setState({currentscreen: 'profile'});
                  }, 100);
                }
              }}>
              <Image
                source={require('../../assets/drawable/icon-profile.png')}
                style={style.navItemIcon}
              />
              <Text
                style={
                  this.state.currentscreen === 'profile'
                    ? {
                        ...style.navItemText,
                        color: '#fff',
                        fontFamily: 'Quicksand-Medium',
                      }
                    : style.navItemText
                }>
                Profile
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </Animatable.View>
    );
  }
}
