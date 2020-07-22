import React,{useState, useEffect} from 'react';
import {View,ScrollView ,Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import firebase from '../../firebase';
import Spacer from '../components/Spacer';
import Spinner from '../components/Spinner';
import Communications from 'react-native-communications';
import Notch from '../components/Notch';
import {FontAwesome} from '@expo/vector-icons';

const EachPostedJobScreen = ( {navigation} ) => {
    
    const jobId = navigation.getParam('jobId');
    const userId = navigation.getParam('userId');
    const applied= navigation.getParam('applied');
    const number = navigation.getParam('number');

    console.log('here is the number', number);
    const [details, setDeatails] = useState(null);
    const [workerDetails, setWokerDetails] = useState(null);
    const [status, setStatus] = useState(false);

    const workerId = firebase.auth().currentUser.providerData[0].uid;
    const photoURL = firebase.auth().currentUser.providerData[0].photoURL;
    console.log('my id',workerId);

    const getWokerData = async () => {
        var res = await firebase.database().ref(`/users/${workerId}`).on('value',async function(snapshot){
            var response = await snapshot;
            setWokerDetails(response);
            if(workerDetails){
                console.log('yup got the user worker details', workerDetails);
            }
        })
    }

    const getData  = async () => {
        var res =  await firebase.database().ref(`/jobs/${userId}/${jobId}`).on('value',async function(snapshot){
            var response = await snapshot;
            setDeatails(response);
        })
    }

    const setApply  = () =>{
       
    }
    const applyThenRoute = async () => {
        setStatus(true);
        try{
            if(workerDetails){
                var res = await firebase.database().ref(`/notifications/${userId}/${jobId}`).set({
                    workerId:workerId,
                    job_desc: details.val().description,
                    name: workerDetails.val().displayName,
                    state: workerDetails.val().loc_state,
                    number:workerDetails.val().number,
                    rating: workerDetails.val().rating,
                    jobId:jobId,
                    photoURL: photoURL
                });
                console.log('notification sent');
                var updateApply = await firebase.database().ref(`/applied/${workerId}`).set({
                    jobs:[...applied,jobId]
                });
                console.log('Update Done');

                navigation.navigate('Home');
            }
        }catch(err){
            console.log('very unpleasent error occured which cant be resolved', err);
        }
    }


    useEffect(()=>{
        console.log('first one');
        getWokerData();
    },[]);

    useEffect(()=>{
        console.log('entered here')
        getData();
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
        {details?<ScrollView>
            <View style={styles.head} >
                <Image 
                    style={styles.image}
                    source={{ uri: details.val().photoURL }}
                />
                <Text style={{fontSize:20, marginTop:25}} >
                    {details.val().created_by}
                </Text>
            </View>
            <Spacer />
            <View style={styles.eachData} >
                <Text style={{fontSize:18, fontWeight:'bold'}} >Address:</Text>
                <Text style={{fontSize:18, flex:1, textAlign:'right'}} >{details.val().address}</Text>
            </View>
            <Spacer />
            <View style={styles.eachData} >
                <Text style={{fontSize:18, fontWeight:'bold'}} >Description:</Text>
                <Text style={{fontSize:18, flex:1, textAlign:'right'}} >{details.val().description}</Text>
            </View>
            <Spacer />
            <View style={styles.eachData} >
                <Text style={{fontSize:18, fontWeight:'bold'}} >State:</Text>
                <Text style={{fontSize:18, flex:1, textAlign:'right'}} >{details.val().state}</Text>
            </View>
            <Spacer />
            <View style={styles.eachData} >
                <Text style={{fontSize:18, fontWeight:'bold'}} >Price:</Text>
                <Text style={{fontSize:18, flex:1, textAlign:'right'}} >{details.val().priceFrom}-{details.val().priceTo}</Text>
            </View>
            <Spacer />
            <View style={styles.eachData} >
                <Text style={{fontSize:18, fontWeight:'bold'}} >Status:</Text>
                {details.val().cancel?<Text>Closed</Text>:<Text>Open</Text>}
            </View>
            <Spacer />

            {applied.indexOf(jobId) >=0 ?
            <View>
                <Image style={{alignSelf:'center'}} source={require('../../assets/alreadyApplied.png')} />
                <Spacer />
            {number?
            <TouchableOpacity onPress={()=>Communications.phonecall(navigation.getParam('number'),true)} style={{alignSelf:'center'}} >
                <Image 
                    source={require('../../assets/callBtn.png')}
                />
            </TouchableOpacity>
            
            :null}
            <TouchableOpacity style={styles.apply} onPress={()=> navigation.navigate('Home')} >
                    <Image
                        source={require('../../assets/back.png')}
                    />
            </TouchableOpacity>
            </View>:
            status?<Spinner />:
            <View>
                <TouchableOpacity style={styles.apply} onPress={()=> applyThenRoute() } >
                    <Image
                        source={require('../../assets/applyJobBtn.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.apply} onPress={()=> navigation.navigate('Home')} >
                    <Image
                        source={require('../../assets/back.png')}
                    />
                </TouchableOpacity>
            </View>


            }
            <Spacer />
        </ScrollView>:<Text>Loading</Text>}

    </View>
}

EachPostedJobScreen.navigationOptions = () =>{
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
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:20
    },
    image:{
        alignSelf:'center',
        width:120,
        height:120,
        borderRadius:60,
    },
    head:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginHorizontal:20
    },
    eachData:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:30
    },
    apply:{
        alignSelf:'center',
    }
});
export default EachPostedJobScreen;