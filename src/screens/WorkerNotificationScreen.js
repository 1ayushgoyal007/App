import React,{useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image} from 'react-native';
import firebase from '../../firebase';
import Spacer from '../components/Spacer';
import Notch from '../components/Notch';
import {FontAwesome} from '@expo/vector-icons';
import Spinner from '../components/Spinner';
const WorkerNotificationScreen = ({ navigation }) =>{


    if(firebase.auth().currentUser){
        var User = firebase.auth().currentUser;
    }
    const workerId = User.providerData[0].uid;

    const [notifications, setNotifications] = useState([]);
    const [applied, setApplied] = useState([]);
    const [loading, setLoading] = useState(true);


    const getNotifications = () => {
        firebase.database().ref(`/notifications/${workerId}`).on('value', async function(snapshot){
            var response = await snapshot;
            var res = [];
            console.log('response is there why is not it showing up', response);
            response.forEach((data)=>{
                res.push(data);
            });
            if(res.length){
                setNotifications(res.reverse());
            }
        })
    }
    const appliedCheck = () => {
        firebase.database().ref(`/applied/${workerId}/jobs`).on('value', async function(snapshot){
            var response  = await snapshot;
            if(response){
                console.log('response is there');
                setLoading(false);
                var temp = [];
                response.forEach((each)=>{
                     console.log('there is somethings',each.val(), typeof(each.val()));
                    temp.push(each.val().trim());
                   
                })
            console.log(temp, typeof(temp));
            setApplied(temp);
            }

        })
    }


    useEffect(()=>{
        console.log('entered useEffect');
        getNotifications();
    },[]);

    useEffect(()=>{
        console.log('entered second useEffect');
        appliedCheck();
    },[]);

    return <View style={{flex:1, backgroundColor:'white'}} >
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
                source={require('../../assets/notificationBtn.png')}
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

    {loading?<View style={styles.loadingView} >
        <Text style={{fontSize:20}} >loading Notifications</Text>
        <Spacer />
        <Spinner />
        </View>:
    <ScrollView style={{marginTop:15}} >
            {notifications.length?
            <FlatList 
                data={notifications}
                keyExtractor={(each)=> each.val().jobId }
                renderItem={({ item })=>{
                    return <View style= { styles.eachNotification } >
                    <View style={styles.dot} >

                    </View>
                    
                    <TouchableOpacity 
                            style={styles.each}
                            onPress={()=> {
                                console.log(item);
                                navigation.navigate('EachPostedJob',{
                                    jobId:item.val().jobId,
                                    userId: item.val().bossId,
                                    applied: applied,
                                    number: item.val().number
                                })
                            }}
                            >
                        <Text>Your Application on job <Text style={{fontWeight:'bold', color:'#2699FB', fontSize:16}} >{item.val().description}</Text> has been accepted.</Text>
                    </TouchableOpacity>
                    </View>
                }}
            />:
            <Text style={{textAlign:'center', fontSize:20}} >No Notifications</Text>}
        </ScrollView>}

        

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
    },
    loadingView:{
        flexDirection:'column',
        alignSelf:'center'
    },
    each:{
        flex:1,
        padding:10,
        borderWidth:1,
        borderColor:'gray',
        borderRadius:5
        },
    dot:{
        height:25,
        width:25,
        backgroundColor:'#E8B800',
        borderRadius:25,
        alignSelf:'center',
        justifyContent:'center',
        marginRight:5
    },
    eachNotification:{
        flexDirection:'row',
        marginHorizontal:10,
        backgroundColor:'white',
        marginBottom:10
    }
})

export default WorkerNotificationScreen;