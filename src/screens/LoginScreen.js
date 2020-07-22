import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import firebase from  '../../firebase';  
import * as Google from 'expo-google-app-auth';
import { Google as google } from 'expo';
import Spinner from '../components/Spinner';
import Notch from '../components/Notch';

const LoginScreen = ({ navigation }) =>{
      const [status, setStatus] = useState(false);
     const logIn = (email, password) =>{
        try{
          firebase.auth().signInWithEmailAndPassword(email.email, password.password).then(()=>navigation.navigate("WorkFlow"))
          .catch(()=>alert('Invalid Username or Password'));
        }
        catch(error){
          console.log('error even without trying', error);
        }
      }

      const isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      }


      const onSignIn =(googleUser) => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
                );
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).then((result)=>{
              console.log("User Signed In");

            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              console.log('Did not logged in error', error);
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        });
      }

      async function signInWithGoogleAsync() {
        setStatus(true);
        try {
          const result = await Google.logInAsync({
              behavior:'web',
            androidClientId: '562012531195-s3s2efa9u4lq6nesohh4spcs78ebcfpa.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            
          });
      
          if (result.type === 'success') {
            onSignIn(result);
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      }


      const checkLoginStatus = () => {
        if(firebase.auth().currentUser){
          setStatus(true);
        }
      }

      useEffect(()=>{
        checkLoginStatus();
      },[]);


    return <View style={styles.container} >
        <Image 
          source={require('../../assets/main.jpg')}
          style={styles.image}
        />

         {status?  <Spinner /> :
        <TouchableOpacity onPress={()=>signInWithGoogleAsync()} >
          <Image 
            source={require('../../assets/google.png')}
            style={styles.imageBtn}
          />
        </TouchableOpacity>}
</View>
}

LoginScreen.navigationOptions = () =>{
    return {
        headerShown: false
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#810827',
      justifyContent: 'space-around',
    },
    image:{
      width:'70%',
      height:200,
      alignSelf:'center'
    },
    imageBtn:{
      width:'90%',
      height:70,
      alignSelf:'center'
      
    },
  googleBtn:{
      color:"#222",
      marginVertical:40,
      marginRight:20,
      padding:15,
      alignSelf:'center'
  }
  });
  

export default LoginScreen;