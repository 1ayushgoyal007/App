import React,{useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image,Button, TouchableOpacity, ScrollView} from 'react-native';
import firebase from '../../firebase';
import Spacer from '../components/Spacer';
import Notch from '../components/Notch';
import {FontAwesome } from '@expo/vector-icons';
const AccountScreen = ({ navigation }) =>{

    const [occupation, setOccupation] = useState('');
    const [rating , setRating]= useState('');
    const [jobs, setJobs]= useState('');
    const[jobPosted, setJobPosted] = useState(null);
    const [number, setNumber] = useState('');

    if(firebase.auth().currentUser){
        var User = firebase.auth().currentUser;
    }
    
    const userId = User.providerData[0].uid;

    const getUserData = () => {
        firebase.database().ref(`/users/${userId}`).on("value", async function(snapshot){
            console.log("now i am inside");
            console.log("Snapshot",snapshot);
            const occupation = (snapshot.val().occupation);
            const rating  = snapshot.val().rating;
            const jobs = snapshot.val().jobsCompleted;
            const jobposted = snapshot.val().jobPosted;
            const number = snapshot.val().number;
            setJobPosted(jobposted);
            setRating(rating);
            setOccupation(occupation);
            setJobs(jobs);
            setNumber(number);
            
            
        })
    }

    useEffect(()=>{
        getUserData();
    })

    return <View style={{backgroundColor:'white',flex:1}} >
        <Notch />
        <View style={styles.headView} >
        <View style={{width:175,  borderBottomRightRadius:300, backgroundColor:'#E8B800', paddingLeft:10}} >
            <Image 
                source={require('../../assets/title.png')}
                style={styles.headerImage}
            />
        </View>
      
            <View style={styles.rightIcon} >
            <TouchableOpacity style={styles.barIcon} onPress={()=> navigation.openDrawer()} >
                <FontAwesome name='bars' size={24} color='#E8B800' />
            </TouchableOpacity>

            <Image  
                source={require('../../assets/accountBtn.png')}
                style={styles.createBtn}
            />

            </View>
        </View>
        <View>
            <Image 
                source={require('../../assets/side.png')}
                style={styles.side}
            />
        </View>
        <ScrollView>
            <Image 
                style={styles.image}
                source={{ uri: User.photoURL }}
            />
            <Spacer />
            <Text style= {styles.UserName} >{ User.displayName }</Text>
            <Spacer />
            <View style={styles.occupationView} >
                <Text style={{fontSize:20, fontWeight:'bold'}} >Occupation :</Text>
                <Text style={{fontSize:20}}>{occupation}</Text>
            </View>
            <Spacer />
            <View style={styles.occupationView} >
                <Text style={{fontSize:20, fontWeight:'bold'}} >Contact :</Text>
                <Text style={{fontSize:20}}>{number}</Text>
            </View>
            <Spacer />
            <View style={styles.occupationView} >
                <Text style={{fontSize:20, fontWeight:'bold'}} >Rating :</Text>
                {rating==0 ? <Text style={{fontSize:20}}>No Rating Yet</Text> : <Text style={{fontSize:20}}>{rating}</Text>}
            </View>
            <Spacer />
            <View style={styles.occupationView} >
                <Text style={{fontSize:20, fontWeight:'bold'}} >Jobs Completed :</Text>
                {jobs==0 ? <Text style={{fontSize:20}}>{jobs} </Text> : <Text style={{fontSize:20}}>{jobs}</Text>}
            </View>
            <Spacer />
            <View style={styles.occupationView} >
                <Text style={{fontSize:20, fontWeight:'bold'}} >Jobs Posted :</Text>
                {jobPosted==0 ? <Text style={{fontSize:20}}>No Jobs Posted</Text> : <Text style={{fontSize:20}}>{jobPosted}</Text>}
            </View>
                <View >
                    <Spacer />
                    <TouchableOpacity 
                    onPress={()=>  firebase.auth().signOut().then(()=>navigation.navigate("Login")) }
                    style={styles.btn}
                    >
                        <Image 
                            source={require('../../assets/signoutBtn.png')}
                        />
                    </TouchableOpacity>
                </View>
            <TouchableOpacity style={{alignSelf:'center'}} onPress={()=> navigation.navigate('Details',{purpose : occupation })} >
                <Image
                    source={require('../../assets/editProfile.png')}
                />
            </TouchableOpacity>
            <Spacer />
        </ScrollView>

    </View>
}

const styles = StyleSheet.create({
    headerImage:{
        resizeMode:'contain',
        width:'100%'
    },
    headView:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    barIcon:{
        margin:25,
        alignSelf:'flex-end'
    },
    createBtn:{
        width:'200%',
        resizeMode:'contain',
        alignSelf:'center',
        marginRight:100
    },
    rightIcon:{
        justifyContent:'center'
    },
    side:{
        position:'absolute',
        right:0,
        zIndex:0
    },
    loadingView:{
        flexDirection:'column',
        alignSelf:'center'
    },
    image:{
        alignSelf:'center',
        width:120,
        height:120,
        borderRadius:100
    },
   UserName:{
    alignSelf:'center',
    fontSize:26
   },
    button:{
        fontSize:34,
        fontWeight:'bold',
        color:"#222",
        backgroundColor:'black',
        margin:30
    },
    occupationView:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:30
    },
    btn:{
        alignSelf:'center'
    }
})

export default AccountScreen;