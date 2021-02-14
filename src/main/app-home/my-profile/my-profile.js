/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-crop-picker';
import {slideInDownLess} from '../../../assets/animations';
import {_auth, _database, _storage} from '../../../assets/config';
const style = StyleSheet.create({
  editBtn: {
    backgroundColor: '#118fca',
    elevation: 2,
    borderRadius: 50,
    marginRight: 5,
    marginLeft: 5,
    height: 40,
  },
  editBtnText: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 20,
    padding: 10,
  },
  userDp: {
    width: 180,
    height: 180,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    alignSelf: 'center',
    color: '#118fca',
    fontFamily: 'Quicksand-Bold',
    fontSize: 28,
  },
  title2: {
    alignSelf: 'center',
    color: '#118fca',
    fontFamily: 'Quicksand-Medium',
    fontSize: 24,
    marginBottom: 10,
  },
});

export default class MyProfile extends Component {
  render() {
    const user = this.props.user;
    return (
      <Animatable.View animation={slideInDownLess}>
        <Image source={{uri: user.userDp}} style={style.userDp} />
        <Text style={style.title}>{user.title + ' ' + user.userName}</Text>
        <Text style={style.title2}>{user.practice}</Text>
        <ScrollView>
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
                  this.props.openSnack('Uploading');
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
            <Text style={style.editBtnText}>Change Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...style.editBtn,
              marginTop: 5,
              marginLeft: 50,
              marginRight: 50,
            }}
            onPress={async () => {
              await setTimeout(async () => {
                this.props.updateInfo();
              }, 100);
            }}>
            <Text style={style.editBtnText}>Update My Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...style.editBtn,
              marginTop: 5,
              marginLeft: 50,
              marginRight: 50,
            }}
            onPress={async () => {
              await setTimeout(async () => {
                _auth.signOut().then((x) => {
                  this.props.unauthorizeUser();
                  this.props.openTimedSnack('Logged Out');
                });
              }, 100);
            }}>
            <Text style={style.editBtnText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    );
  }
}
