/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {_auth, _database} from '../../../assets/config';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import {Dimensions, Image, StyleSheet, View, Switch} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {fadeIn} from '../../../assets/animations';
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const style = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {height: 35, width: 35, alignSelf: 'center'},
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    marginLeft: 20,
    marginRight: 20,
    fontSize: 25,
    color: '#000',
    marginTop: 10,
    flex: 1,
  },
});
export default class LocationWidget extends Component {
  state = {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    coordinate: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
    docIsOn: true,
  };

  async componentDidMount() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
    })
      .then((location) => {
        this.setState({
          longitude: location.longitude,
          latitude: location.latitude,
          coordinate: new AnimatedRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          }),
          loading: false,
        });
      })
      .catch((error) => {
        const {code, message} = error;
        console.warn(code, message);
        this.setState({loading: false});
      });
    await setInterval(async () => {
      this.setState({j: !this.state.j});
    }, 60000);
  }
  async componentDidUpdate(prevProps, prevState) {
    if (this.props.latitude !== prevState.latitude) {
      if (this.state.docIsOn === true) {
        const t = new Date();
        const _h =
          (t.getHours() <= 9 ? '0' + t.getHours() : t.getHours()) +
          ':' +
          (t.getMinutes() <= 9 ? '0' + t.getMinutes() : t.getMinutes()) +
          ':' +
          (t.getSeconds() <= 9 ? '0' + t.getSeconds() : t.getSeconds());
        const _d =
          t.getDate() + '-' + (t.getMonth() + 1) + '-' + t.getFullYear();
        const stamp = {
          longitude: this.state.longitude,
          latitude: this.state.latitude,
          time: _h,
          date: _d,
          id: _d + '_' + _h,
        };
        await _database
          .ref('active-doctors/' + _auth.currentUser.uid)
          .set(stamp);
      }
    }
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  render() {
    return (
      <Animatable.View style={style.container} delay={400} animation={fadeIn}>
        <MapView
          style={style.map}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={this.getMapRegion()}>
          <Marker.Animated
            ref={(marker) => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}>
            <Image
              source={require('../../../assets/drawable/icon-practice.png')}
              style={style.marker}
            />
          </Marker.Animated>
        </MapView>
        <View
          style={{
            position: 'absolute',
            top: 20,
            right: 0,
            left: 0,
            marginRight: 20,
            marginLeft: 20,
            backgroundColor: '#fff',
            elevation: 5,
            height: 50,
            width: '90%',
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Animatable.Text style={style.title}>Available</Animatable.Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={this.state.docIsOn ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(x) => {
              _database
                .ref('active-doctors/' + _auth.currentUser.uid)
                .set(null)
                .then(() => {
                  this.setState({docIsOn: x});
                  this.props.openTimedSnack(
                    this.state.docIsOn
                      ? 'Have a successfull shift'
                      : 'Have a nice time',
                  );
                });
            }}
            value={this.state.docIsOn}
            style={{
              width: 50,
              marginRight: 10,
              alignSelf: 'flex-end',
              marginBottom: 10,
            }}
          />
        </View>
      </Animatable.View>
    );
  }
}
