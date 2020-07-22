import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image, Dimensions } from 'react-native';
import firebase from '../../firebase';
import Spacer from '../components/Spacer';
import EachWorkerJob from '../components/EachWorkerJob';
import * as Location from 'expo-location';
import { getDistance , getPreciseDistance} from 'geolib';
import Spinner from '../components/Spinner';
import { FontAwesome } from '@expo/vector-icons';
import Notch from '../components/Notch';

const WorkerDashboardScreen = ({ navigation }) =>{

    const [state, setState] = useState('');
    const [skills, setSkills] = useState([]);
    const [location, setLocation] = useState(null);
    const [jobs, setjobs] = useState([]);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [distance, setDistance] = useState(null);
    const [flag, setFlag] = useState(false);
    const [applied, setApplied] = useState([]);

    if(firebase.auth().currentUser){
        var User = firebase.auth().currentUser;
        console.log('id started here',User.uid);
    }
    const userId = User.providerData[0].uid;
    const workerId = firebase.auth().currentUser.providerData[0].uid;
    const width = Dimensions.width;
    console.log('width', width);


    const getData = async () => {
         var response = await firebase.database().ref(`/users/${userId}`).on('value',async function(snapshot){
            var state = await snapshot.val().loc_state;
            var skills = await snapshot.val().skills;
            setState(state);
            setSkills(skills);
            console.log('entered get data');
            console.log(state, skills);
        });
    }

    const getDetails = () => {
        const res = [];
        firebase.database().ref(`/jobs/`).on("value", async function(snapshot){
            var response = await snapshot;
            response.forEach((eachData)=>{
                eachData.forEach((perJob)=>{
                    if(!flag){
                        console.log('flag set done here');
                        setFlag(true);
                    }
                    if( !perJob.val().cancel && perJob.val().isOpen ){
                        console.log('worked');
                        if(perJob.val().state==state){
                            console.log('entered till here');

                            if(skills.indexOf(perJob.val().category) >= 0){
                                console.log('got the jobs job');
                                res.push(perJob);
                            }
                        }
                    }
                })

            })
            console.log('how many times here');
            setjobs(res);
        })
    }

    const appliedCheck = () => {
        firebase.database().ref(`/applied/${workerId}/jobs`).on('value', async function(snapshot){
            var response  = await snapshot;
            if(response){
                console.log('response is there');
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


    useEffect( ()=> {
        console.log('first useEffect');
        getData();

        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            let location = await Location.getCurrentPositionAsync({});
            console.log('location set done', location);
            setLocation(location);
            setLongitude('longitutde',location.coords.longitude);
            setLatitude(location.coords.latitude);
          })();

          
    },[]);

    useEffect(()=>{
        console.log('second useEffect');
            if( !jobs.length){
                    getDetails();
            }

            
    },[skills]);

    useEffect(()=>{
        console.log('third useEffect');
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
                source={require('../../assets/jobInYourLocation.png')}
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

        <ScrollView style={{marginHorizontal:5}}>
        {flag?jobs.length?
            <FlatList 
                data={jobs}
                keyExtractor={(job)=> job.val().uniqueId  }
                renderItem = {({ item })=>{
                    // ( longitude && item.val().longitude != undefined )? console.log( 'Distance',getDistance({latitude:item.val().latitude,longitude:item.val().latitude}),{latitude:parseFloat(latitude), longitude:parseFloat(longitude)}) :null
                    // longitude? console.log("longitude as d d sad aww", longitude, typeof(longitude), typeof(item.val().longitude), typeof(parseInt(longitude))):console.log('nothing', longitude, typeof(longitude))
                    return <ScrollView style={{position:'relative'}} >
                        <Spacer />
                        <TouchableOpacity
                        style={styles.eachJob}
                        onPress={()=>navigation.navigate('EachPostedJob',
                        {jobId: item.val().uniqueId, userId: item.val().userId, applied: applied })} >
                            <EachWorkerJob 
                                address={item.val().address}
                                category={item.val().category}
                                created_by={item.val().created_by}
                                description={item.val().description}
                                photoURL = {item.val().photoURL}
                                priceFrom ={item.val().priceFrom}
                                priceTo = {item.val().priceTo}
                            />

                {applied.length? applied.includes(item.val().uniqueId) ?
                <View style={styles.status} >
                    <Text style={{fontSize:16, fontWeight:'bold'}} >Status</Text>
                    <Text style={{fontSize:16, fontWeight:'bold', color:'red'}}>Already Applied</Text>
                </View>:
                <View style={styles.status} >
                <Text style={{fontSize:16, fontWeight:'bold'}}>Status</Text>
                <Text style={{fontSize:16, color:'#2699fb', fontWeight:'bold'}} >Open</Text>
                </View> :
                <View style={styles.status}>
                <Text style={{fontSize:16, fontWeight:'bold'}}>Status</Text>
                <Text style={{fontSize:16, color:'#2699fb', fontWeight:'bold'}} >Open</Text>
                </View> }
                        </TouchableOpacity>
                    </ScrollView>
                }}
            />:<Text style={{fontSize:18, textAlign:'center', margin:20}} >No Jobs in Your area right now, Check After some time</Text>
 
         :<View style={styles.loadingView} >
             <Text style={{fontSize:18, textAlign:'center', marginTop:20}} >Loading Jobs</Text>
             <Spacer />
             <Spinner />
        </View>}
        
        </ScrollView>
    </View>
}

WorkerDashboardScreen.navigationOptions = () =>{
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
        zIndex:0
    },
    loadingView:{
        flexDirection:'column',
        alignSelf:'center'
    },
    eachJob:{
        borderWidth:1,
        borderColor:'gray',
        marginHorizontal:20,
        borderRadius:10,
        backgroundColor:'white'
    },
    status:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:10,
        marginBottom:10
    }
})

export default WorkerDashboardScreen;