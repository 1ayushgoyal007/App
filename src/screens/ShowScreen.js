import React, { useState,useEffect} from 'react';
import {View,ScrollView, Text, StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';
import Spacer from '../components/Spacer';
import firebase from '../../firebase';
import Spinner from '../components/Spinner';
import Notch from '../components/Notch';
import { FontAwesome } from "@expo/vector-icons";

const ShowScreen =({ navigation }) => {


    const jobId = navigation.getParam('id');
    const UserId = firebase.auth().currentUser.providerData[0].uid;

    const [work, setWork] = useState(null);
    const [status, setStatus] = useState(true);
    const [Jobs, setJobs] = useState(null);

    const details = async () => {
        var response  = await firebase.database().ref(`/jobs/${UserId}/${jobId}`).on("value",async function(snapshot){
            const response= await snapshot;
            setWork(response);
        });
        
    }

    const getJobs = async () => {
        console.log('entered here');
        var temp = await firebase.database().ref(`/users/${UserId}`).on('value', async function(snapshot){
            var response = await snapshot;
            console.log('also response',response.val().jobsCompleted);
            if(response){
                console.log('response');
                setJobs(response.val().jobsCompleted);
            }
    })
}

    const deleteJob = async () => {
        var response = await firebase.database().ref(`/jobs/${UserId}/${jobId}`).update({
            cancel: true
        });

        console.log('job cancelled');
        navigation.navigate('Dashboard');
    }

    const completeJob = async () => {
        setStatus(false);
        var response = await firebase.database().ref(`/jobs/${UserId}/${jobId}`).update({
            completed: true
        });
        console.log('job completed');
        if(typeof(Jobs)===typeof(1)){
            console.log('got the jobs');
            var response = await firebase.database().ref(`/users/${UserId}`).update({
                jobsCompleted: Jobs+1
            })
            navigation.navigate('Rating',{id: work.val().assigned});
        }
       
    };


    useEffect(  ()=>{
         details();
    },[]);


    useEffect(()=>{
        getJobs();
    },[Jobs]);

    return  <View style={{backgroundColor:'white', flex:1}} >
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
                source={require('../../assets/yourjobBtn.png')}
                style={styles.createBtn}
            />

            </View>
        </View>
        <View></View>
        
    <ScrollView >
        <View>
        <Spacer />
        {work ? <View>
        <View style={styles.jobView} >
            <Text style={{fontSize:18, fontWeight:'bold'}} >Category:</Text>
            <Text style={{fontSize:18}} >{work.val().category}</Text>
        </View>
        <Spacer />
        <View style={styles.jobView} >
            <Text style={{fontSize:18, fontWeight:'bold'}} >Address:</Text>
            <View style={{flex:1, paddingLeft:15}} >
                <Text style={{fontSize:18, textAlign:'right'}} >{work.val().address}</Text>
            </View>
        </View>
        <Spacer />
        <View style={styles.jobView} >
            <Text style={{fontSize:18, fontWeight:'bold'}} >Description:</Text>
            <View style={{flex:1, paddingLeft:15}} >
                <Text style={{fontSize:18, textAlign:'right'}} >{work.val().description}</Text>
            </View>
        </View>
        <Spacer />
        
        <View style={styles.jobView} >
            <Text style={{fontSize:18, fontWeight:'bold'}} >Price Range:</Text>
            <Text style={{fontSize:18}} >{work.val().priceFrom}- {work.val().priceTo}</Text>
        </View>
        <Spacer />
        <View style={styles.jobView} >
            <Text style={{fontSize:18, fontWeight:'bold'}} >State:</Text>
            <Text style={{fontSize:18}} >{work.val().state}</Text>
        </View>
        <Spacer />
        <View style={styles.jobView} >
            <Text style={{fontSize:18, fontWeight:'bold'}} >Visibility Status:</Text>
            {work.val().isOpen? <Text style={{fontSize:18}} >Open </Text>: <Text  style={{fontSize:18}}>Closed</Text>}
        </View>
        
        <Spacer />
        
        {work.val().cancel?
        <View>
        <Text style={{fontSize:20, textAlign:'center'}} >You Cancelled This Job!</Text>
        <TouchableOpacity style={styles.button} onPress ={()=>navigation.navigate('Dashboard') } >
            <Image 
                source={require('../../assets/back.png')}
            />
        </TouchableOpacity>
        </View>
        :
        work.val().isOpen?
        <View>
            <TouchableOpacity style={styles.button} onPress={()=> {
                Alert.alert('Alert','Editing a Particular job is Currently Down,if you want you can Cancel this one and Post a new Job',[
                    {text:'Understood'}
                ])
            }} >
                <Text style={{fontSize:16, color:'white'}} >Edit</Text>
                <Image
                    source={require('../../assets/editJobBtn.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity  style={styles.button} onPress={()=>{
                Alert.alert('Alert','This action can not be undo! really want to Delete it?',[
                    {text:'Delete',onPress: ()=> deleteJob()},
                    {text:'Cancel'}
                ])
            }} >
                <Image 
                    source={require('../../assets/cancelJobBtn.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress ={()=>navigation.navigate('Dashboard') } >
            <Image 
                source={require('../../assets/back.png')}
            />
        </TouchableOpacity>
        
        </View>
        :
        status ?
        typeof(Jobs)===typeof(1)? <View>
            {work.val().completed? <View><Text style={{fontSize:20, textAlign:'center', color:'#2699fb'}} >This Job is Completed Successfully!</Text></View>:
            <TouchableOpacity  style={styles.button} onPress={()=>{
                Alert.alert('Alert', 'Do you really want to complete job?',[
                    {text:'complete',onPress:()=> completeJob() },
                    {text:'cancel'}
                ])
            }}>
                    <Image
                        source={require('../../assets/completejobBtn.png')}
                    />
            </TouchableOpacity> }
            
        <TouchableOpacity style={styles.button} onPress ={()=>navigation.navigate('Dashboard') } >
            <Image 
                source={require('../../assets/back.png')}
            />
        </TouchableOpacity>
        
        </View>:<Text>Loading</Text>:
        <Spinner />

        }


        </View>:null}
        <Spacer />
        </View>
    </ScrollView>
    </View>
}

ShowScreen.navigationOptions= () =>{
    return {
       headerShown: false
    }
}

var styles = StyleSheet.create({
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
    
    firstView:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginHorizontal:20,
        borderColor:'black',
        borderWidth:1
    },
    jobView:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:30
    },
    links:{
        justifyContent:'space-between',
        marginHorizontal:30
    },
    button:{
        paddingHorizontal:20,
        paddingVertical:5,
        alignSelf:'center'
    }
})

export default ShowScreen;