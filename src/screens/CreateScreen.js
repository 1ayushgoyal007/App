import React,{ useState,useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import Spacer from '../components/Spacer';
import { Dropdown } from "react-native-material-dropdown";
import firebase from '../../firebase';
import * as Location from  'expo-location';
import Spinner from '../components/Spinner';
import Notch from '../components/Notch';
import {FontAwesome} from '@expo/vector-icons';

const CreateScreen = ({ navigation }) =>{




    const [address, setAddress] = useState('');
    const [desc, setDesc] = useState('');
    const [from, setFrom ] = useState('');
    const [to, setTo] = useState('50');
    const [category, setCategory]= useState('');
    const [location, setLocation] = useState('');
    const [state, setState] = useState('');
    const [useLongitude, setUseLongitude]= useState(null);
    const [useLatitude, setUseLatitude]= useState(null);
    const [jobs, setJobs] = useState(null);
    const [status, setStatus] = useState(false);


    if(firebase.auth().currentUser){
        var User = firebase.auth().currentUser;
    }
    const userId = User.providerData[0].uid;
    const jobId = User.uid;



    const CategoryData = [{
        value: 'HTML',
      }, {
        value: 'CSS',
    },{
        value: 'JavaScript',
    }];

    const locData = [{
        value: "Yes"
    },{
        value:"No"
    }]

    const stateData =  [{
      value: 'Delhi NCR',
    }, {
      value: 'Maharashtra',
    }, {
      value: 'Madhya Pradesh',
    }, {
      value: 'Uttar Pradesh',
    }, {
      value: 'Gujarat',
    }, {
      value: 'Karnataka',
    }, {
      value: 'Andhra Pradesh',
    }, {
      value: 'Arunachal Pradesh',
    }, {
      value: 'Goa',
    }, {
      value: 'Bihar',
    }, {
      value: 'ChattisGarh',
    }, {
      value: 'Haryana',
    }, {
      value: 'Himachal Pradesh',
    }, {
      value: 'Jammu and Kashmir',
    }, {
      value: 'Jharkhand',
    }, {
      value: 'Kerala',
    }, {
      value: 'Manipur',
    }, {
      value: 'Meghalaya',
    }, {
      value: 'Mizoram',
    }, {
      value: 'Nagaland',
    }, {
      value: 'Odisha',
    }, {
      value: 'Punjab',
    }, {
      value: 'Rajasthan',
    }, {
      value: 'Sikkim',
    }, {
      value: 'Telangana',
    }, {
      value: 'Tripura',
    }, {
      value: 'Uttarakhand',
    }, {
      value: 'West Bengal',
    }];


    const pushJob = async (address, desc, from, to, category, location) => {
        setStatus(true);
        try{
            if(location==="Yes"){
                console.log("now it should work");
                var response = await firebase.database().ref(`/jobs/${userId}/${jobId+jobs}`).set({
                created_by: User.displayName,
                photoURL: User.photoURL,
                address: address,
                description: desc,
                priceFrom:from,
                priceTo: to,
                state: state,
                category: category,
                longitude:useLongitude,
                latitude: useLatitude,
                completed: false,
                cancel: false,
                userId: userId,
                created_at: Date.now(),
                uniqueId: (jobId+jobs),
                isOpen : true
            });

            }else{
                var response = await firebase.database().ref(`/jobs/${userId}/${jobId+jobs}`).set({
                    created_by: User.displayName,
                    photoURL: User.photoURL,
                    address: address,
                    description: desc,
                    priceFrom:from,
                    priceTo: to,
                    state: state,
                    category: category,
                    longitude:null,
                    latitude:null,
                    completed: false,
                    cancel: false,
                    userId: userId,
                    created_at: Date.now(),
                    uniqueId: (jobId+jobs),
                    isOpen : true
                })
            }
            console.log('Job Pushed');
            var changeJob = await firebase.database().ref(`/users/${userId}`).update({
                jobPosted: parseInt(jobs)+1
            });
            console.log("job Status changed");
            navigation.navigate('Dashboard');

        }catch(error){
            console.log("error while pushing a job", error);
        }

        }

    useEffect(() => {
        firebase.database().ref(`/users/${userId}`).on("value", async function(snapshot){
            var res = await snapshot.val().jobPosted;
            var state = await snapshot.val().loc_state;
            setState(state);
            var response = res.toString();
            setJobs(response);
        });
        console.log('entered useeffect');
        (async () => {
          let { status } = await Location.requestPermissionsAsync();
          let location = await Location.getCurrentPositionAsync({});

        
          console.log("location set done");

          await setUseLongitude(location.coords.longitude);
          await setUseLatitude(location.coords.latitude);

        })();
      },[]);


    return    <View style={{flex:1, backgroundColor:'white'}} >
    <Notch />
    <View style={styles.headView} >
        <View style={{width:175,  borderBottomRightRadius:300, backgroundColor:'#E8B800', paddingLeft:10}} >
            <Image 
                source={require('../../assets/title.png')}
                style={styles.headerImage}
            />
        </View>
      
            <View style={styles.rightIcon} >
            <TouchableOpacity style={styles.barIcon} onPress={()=> navigation.navigate('Dashboard')} >
                <Image 
                    source={require('../../assets/back.png')}
                />
            </TouchableOpacity>


            </View>
        </View>
        <View>
            <Image 
                source={require('../../assets/side.png')}
                style={styles.side}
            />
        </View>


    <ScrollView style={{backgroundColor:'white'}} >
    <View style={{marginHorizontal:22}} >
        <Dropdown 
            label="Category *"
            data={CategoryData}
            value={category}
            onChangeText={(category)=> setCategory(category)}
        />
    </View>

    <View style={{marginHorizontal:22}} >
        <Dropdown 
            label="Is your location and job location same? *"
            data={locData}
            value={location}
            onChangeText={(location)=> setLocation(location)}
        />
    </View>
    {location=="No"?<View style={{marginHorizontal:22}} >
        <Dropdown 
            label="Select State of job"
            data={stateData}
            value={state}
            onChangeText={(state)=> setState(state)}
        />
    </View>:null}
   
    <TextInput 
        style={styles.input}
        placeholder="Enter Address of Work *"
        autoCapitalize="none"
        autoCorrect={false}
        value={address}
        onChangeText={(address)=>setAddress(address)}
    />
    <Spacer />
    <TextInput 
        style={styles.desc }
        placeholder="Job Description *"
        autoCapitalize="none"
        autoCorrect={false}
        value = {desc}
        onChangeText={(desc)=>setDesc(desc)}
    />
    <Spacer />
    
    <View style={styles.container1} >
    <TextInput 
        style={styles.input1}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="From *"
        value={from}
        onChangeText={(text)=>{
            setFrom(text)
            var a = (Number(text)+50);
            var b = a.toString();
            setTo(b);

        }}
    />
    <TextInput 
        style={styles.input1}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="To *"
        value={to}

    />

    </View>


    <Spacer />
    {status?<Spinner />:
     <TouchableOpacity style={styles.post} onPress={()=>{
         console.log(address, desc, from, to, category, location) ;
         if(address.length<=5 || desc.length <= 5 || from.length<=1 || category.length <=1 || location .length <=1 ){
            alert('Enter Valid Credentials');
         }else{
            pushJob(address, desc, from, to, category, location);
         }
    }} >
        <Image
            source={require('../../assets/postBtn.png')}
        />
    </TouchableOpacity>}
    
    <Spacer />
    </ScrollView>

    </View>

}



CreateScreen.navigationOptions = () =>{
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
    side:{
        position:'absolute',
        right:0,
    },
    loadingView:{
        flexDirection:'column',
        alignSelf:'center'
    },

    container:{
        justifyContent:'center'
    },
    input:{
        fontSize:16,
        borderColor: 'gray',
        borderWidth:1,
        marginTop:20,
        padding:20,
        borderRadius:10,
        paddingVertical:10,
        marginHorizontal:20
    },
    desc:{
        fontSize:16,
        borderColor: 'gray',
        borderWidth:1,
        padding:20,
        borderRadius:10,
        paddingVertical:10,
        marginHorizontal:20,
        height:100
    },
    post:{
        alignSelf:'center',
    },
    container1:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:20
    },
    input1:{
        fontSize:16,
        borderColor: 'gray',
        borderWidth:1,
        borderRadius:10,
        paddingVertical:10,
        paddingHorizontal:50
    }
});
export default CreateScreen;