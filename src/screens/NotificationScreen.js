import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image} from 'react-native';
import firebase from 'firebase';
import Spacer from '../components/Spacer';
import Notch from '../components/Notch';
import {FontAwesome} from '@expo/vector-icons';
import Spinner from '../components/Spinner';
const NotificationScreen = ({ navigation }) =>{

    if(firebase.auth().currentUser){
        var User = firebase.auth().currentUser;
    }

    const [notifications, setNotifications] = useState([]);
    const [approved, setApproved] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = User.providerData[0].uid;


    const getNotifcations = () => {
        firebase.database().ref(`/notifications/${userId}`).on('value', async function(snapshot){
            var response = await snapshot;
            var res = [];
            response.forEach((data)=>{
                res.push(data);
            })
            if(res.length){
                setNotifications(res);
                console.log('here is result ', notifications);
            }
        })
    }

    const approvedCheck = () => {
        firebase.database().ref(`/approved/${userId}/jobs`).on('value', async function(snapshot){
            var response = await snapshot;
            if(response){
                console.log('response is there');
                setLoading(false);
                var temp = [];
                response.forEach((each)=>{
                    console.log('deep value here', each.val(), typeof(each.val()));
                    temp.push(each.val().trim());
                })
                setApproved(temp);
            }
        } )
    }



    useEffect(()=>{
        console.log('entered as usual');
        getNotifcations();
    },[]);

    useEffect(()=>{
        console.log('entered second as usual');
        approvedCheck();
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
        <Text style={{fontSize:20}} >Loading Notifications</Text>
        <Spacer />
        <Spinner />
    </View>:<ScrollView style={{marginTop:20}} >
        {notifications.length?
            <FlatList 
                keyExtractor={(notification)=> notification.val().jobId }
                data={notifications}
                renderItem={({ item })=>{
                    console.log('item desc dsfa', item);
                    return <View style={styles.eachNotification} >
                    <View style={styles.dot} >

                    </View>
                    <TouchableOpacity style={styles.eachNote} onPress={()=>{
                        navigation.navigate('Applied',{
                            workerId: item.val().workerId,
                            jobId: item.val().jobId,
                            name: item.val().name,
                            rating: item.val().rating,
                            number: item.val().number,
                            state: item.val().state,
                            description:item.val().job_desc,
                            photoURL: item.val().photoURL,
                            approved: approved
                        });
                    }} >
                        <Text>{item.val().name} has Applied on your job <Text style={{fontWeight:'bold', fontSize:16, color:'#2699FB'}} >{item.val().job_desc}</Text></Text>
                    </TouchableOpacity>
                    </View>
                }}
            />
        :<Text>No Notifications</Text>}
        </ScrollView>}
        
        <Spacer />
    </View>
}

NotificationScreen.navigationOptions = () =>{
    return {
        headerShown: false
    }
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
    },
    eachNote:{
            flex:1,
            padding:10,
            borderWidth:1,
            borderColor:'gray',
            borderRadius:5
            
    }
})

export default NotificationScreen;