import React,{useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from '../../firebase';
import Notch from '../components/Notch';

const LoadingScreen = ({ navigation }) => {

    const isLoggedIn= () =>{
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
                console.log("now user is there");
                console.log("User id",user.providerData[0].uid);
                const id = user.providerData[0].uid;
                firebase.database().ref(`/users/${id}`).on("value",async function(snapshot){
                    console.log("getting inside");
                    console.log('snapshot',snapshot);
                    const Snap = await snapshot;
                    console.log("Snap",Snap);
                    try{
                        
                            console.log('snap inside');
                            var value = await snapshot.val().occupation.trim();
                            if(value==="I will Work"){
                                console.log("Go to WorkFlow");
                                navigation.navigate("WorkFlow");
                            }else{
                                console.log("Go to HireFlow");
                                navigation.navigate("HireFlow");
                            }
                        }catch(err){
                        console.log("err",err);
                        navigation.navigate("Details");
                    }
                   
            });
        }else{
            navigation.navigate("LoginFlow");
        }
    })
}


    useEffect(()=>{
        isLoggedIn();
    })

    return <View style={styles.container} >
        <Notch />
        <View style={styles.main} >
            <ActivityIndicator size='large' />
        </View>
    </View>
}

var styles = StyleSheet.create({
    container:{
        flex:1,
    },
    main:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default LoadingScreen;