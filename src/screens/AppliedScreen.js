import React,{useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import Spacer from '../components/Spacer';
import firebase from '../../firebase';
import Communications from 'react-native-communications';
import Spinner from '../components/Spinner';
import Notch from '../components/Notch';
import { FontAwesome} from '@expo/vector-icons';
const AppliedScreen = ({ navigation }) =>{


    console.log(navigation.getParam('workerId'));
    console.log(navigation.getParam('jobId'));
    console.log(navigation.getParam('name'));
    console.log(navigation.getParam('state'));
    console.log(navigation.getParam('rating'));
    console.log(navigation.getParam('number'));
    console.log(navigation.getParam('description'));
    console.log(navigation.getParam('photoURL'));

    const approved = navigation.getParam('approved');
    const jobId = navigation.getParam('jobId');
    const description= navigation.getParam('description');
    const workerId = navigation.getParam('workerId');

    const [callView, setCallView] = useState(false);
    const [number, setNumber] = useState(null);
    const [status, setStatus] = useState(false);


    if(firebase.auth().currentUser){
        var User = firebase.auth().currentUser;
    }

    const userId = User.providerData[0].uid;

    const userDetalils = () => {
        firebase.database().ref(`/users/${userId}`).on('value', async function(snapshot){
            var response = await snapshot;
            console.log(response.val().number, typeof(response.val().number));
            setNumber(response.val().number);
        })
    }

    const updateApprovedAndNotify = async () => {
        setStatus(true);
        try{
            if(number){
                await firebase.database().ref(`/notifications/${workerId}/${jobId}`).set({
                    jobId: jobId,
                    bossId: userId,
                    number: number,
                    description:description
                });
                console.log('notification sent');
                var res = await firebase.database().ref(`/approved/${userId}`).set({
                    jobs: [...approved, jobId]
                });
                setCallView(true);
                console.log('approved array updated');
                var resp = await firebase.database().ref(`/jobs/${userId}/${jobId}`).update({
                    isOpen:false,
                    assigned: workerId
                });
                console.log('Job is also closed');
            }

        }catch(err){
            console.log('very un pleasent error, cant handle it!', err);
        }

    }

    useEffect(()=>{
        console.log('very first useEffect');
        userDetalils();
        return ()=>{
            console.log('return me');
        }
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
                source={require('../../assets/yourjobBtn.png')}
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
        <View style={styles.head} >
            <Image 
                style={styles.wokrerImage}
                source={{uri: navigation.getParam('photoURL') }}
            />
            <Text style={{ fontSize:20, alignSelf:'center', textAlign:'center' }} >{navigation.getParam('name')}</Text>
        </View>
        

        <Spacer />
        <Spacer />
        <View style={styles.each} >
            <Text style={{fontSize:20, fontWeight:'bold', flex:1}} >Your Job Description:</Text>
            <Text style={{flex:1, fontSize:20, textAlign:'center'}} >{navigation.getParam('description')}</Text>
        </View>
        <Spacer />
        <View style={styles.each} >
            <Text style={{fontSize:20, fontWeight:'bold', flex:1}} >{navigation.getParam('name')} Rating :</Text>
            <Text style={{flex:1, fontSize:20, textAlign:'center'}} >{navigation.getParam('rating')===0?"This Will Be His First Job" : navigation.getParam('rating')}</Text>
        </View>
       
        <Spacer />
        {approved.indexOf(jobId) >= 0 || callView ?
        <View>
            <Image source={require('../../assets/alreadyApproved.png')} style={{alignSelf:'center'}} />
            <Spacer />
            <TouchableOpacity onPress={()=>Communications.phonecall(navigation.getParam('number'),true)} style={{alignSelf:'center'}} >
                <Image source = {require('../../assets/callBtn.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('Notification')} style={{alignSelf:'center'}} >
                <Image source={require('../../assets/back.png')} />
            </TouchableOpacity>
        </View>:

         status? 
         <Spinner />:
         <View>
         <TouchableOpacity 
         style={{alignSelf:'center', paddingVertical:10}} 
         onPress={()=>{

            Alert.alert('Alert',"By Approving you'll get access to Applicant mobile number as well as applicat gets yours",[
                {text:'Proceed',onPress: ()=> updateApprovedAndNotify()},
                {text:'cancel'}
            ])
         }} >
             <Image source={require('../../assets/approve.png')} />
         </TouchableOpacity>
         <TouchableOpacity onPress={()=> navigation.navigate('Notification')} style={{alignSelf:'center'}} >
             <Image source={require('../../assets/back.png')} />
        </TouchableOpacity>
         </View>
        }
        
        </ScrollView>
    </View>
}

AppliedScreen.navigationOptions = () =>{
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
    wokrerImage:{
        width:100,
        height:100,
        borderRadius:50
    },
    head:{
        flexDirection:'row',
        justifyContent:'space-around'
    },
    each:{
        flexDirection:'row',
        marginHorizontal:20
    }
});

export default AppliedScreen;