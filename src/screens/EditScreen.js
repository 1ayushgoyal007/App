import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import Spacer from '../components/Spacer';
import { Dropdown } from "react-native-material-dropdown";
import * as Location from 'expo-location';
import firebase from '../../firebase';
const EditScreen= ({ navigation }) => {

    const CategoryData = [{
        value: 'Majdoor',
      }, {
        value: 'Electrician',
    },{
        value: 'Plumber',
    },{
        value: 'Painter',
    },{
        value: 'Car-Painter',
    },{
        value: 'Others',
    }];

    const locData = [{
        value: "Yes"
    },{
        value:"No"
    }]

    const stateData = [{
        value: "Mumbai"
    },{
        value:"Delhi NCR"
    },{
        value:"Pune"
    },{
        value:"Uttar Pradesh"
    }]


    const jobId = navigation.getParam('id');
    const UserId = firebase.auth().currentUser.providerData[0].uid;


    const [details, setDetails] = useState(null);
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const [desc, setDesc] = useState('');
    const [from, setFrom ] = useState('');
    const [to, setTo] = useState('50');
    const [category, setCategory]= useState('');
    const [state, setState] = useState('');
    const [useLongitude, setUseLongitude]= useState(null);
    const [useLatitude, setUseLatitude]= useState(null);


    const getDetails = async () => {
        await firebase.database().ref(`/jobs/${UserId}/${jobId}`).on("value",async function(snapshot){
            const response= await snapshot;
            setDetails(response);
            console.log("here ARE  Details", details);
        });

    }

    const getPermission = async () => {
        let { status } = await Location.requestPermissionsAsync();
        let location = await Location.getCurrentPositionAsync({});

        console.log("location set done");

        await setUseLongitude(location.coords.longitude);
        await setUseLatitude(location.coords.latitude);
    }



    const updateThenRoute = async (address, category, desc, from, to, state,useLongitude, useLatitude ) => {
        try{
            if(location==="Yes"){
                await firebase.database().ref(`/jobs/${UserId}/${jobId}`).update({
                    address: address,
                    category: category,
                    description: desc,
                    priceFrom: from,
                    priceTo: to,
                    state: state,
                    longitude:useLongitude,
                    latitude: useLatitude
                });
            }else{
                await firebase.database().ref(`/jobs/${UserId}/${jobId}`).update({
                    address: address,
                    category: category,
                    description: desc,
                    priceFrom: from,
                    priceTo: to,
                    state: state,
                    longitude : null,
                    latitude:null
                });
            }
            console.log('Data Updated');
            navigation.navigate('Dashboard');
        }catch(err){
            console.log('SOme error occured which you cant resolve',err );
        }
    }

    useEffect(async ()=>{
        await getDetails();
        await getPermission();
        console.log(useLatitude, useLatitude);
    },[]);




    return    <ScrollView style={{backgroundColor:'white'}} >
    <Spacer />
    {details?<View>
    <Image style={styles.image} source={require('../../assets/icon.png')} />
    <Spacer />
    <View style={{marginHorizontal:22}} >
        <Dropdown 
            label="Category *"
            data={CategoryData}
            value={details.val().category}
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
            label="State"
            data={stateData}
            value={details.val().state}
            onChangeText={(state)=> setState(state)}
        />
    </View>:null}
   
    <TextInput 
        style={styles.input}
        placeholder="Re-Enter Address *"
        autoCapitalize="none"
        autoCorrect={false}
        value={address}
        onChangeText={(address)=>setAddress(address)}
    />
    <Spacer />

    <TextInput 
        style={styles.desc }
        placeholder="Re Enter Job Description *"
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
        value={details.val().priceFrom}
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
        value={details.val().priceTo}

    />

    </View>




    <Spacer />

    
    <TouchableOpacity style={styles.post} onPress={()=>{ 
        console.log(details.val().address);
        updateThenRoute(address, category, desc, from, to, state,useLongitude, useLatitude );
    }} >
        <Text style={{color:'white', fontWeight:'bold', fontSize:20 }} >POST</Text>
    </TouchableOpacity>
    <Spacer />
    </View>:null}
    </ScrollView>

}

EditScreen.navigationOptions = () =>{
    return {
        headerShown: false
    }
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center'
    },
    image:{
        height:100,
        width:100,
        justifyContent:'center',
        alignSelf:'center',
        marginTop:20
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
        backgroundColor:'#25ABC0',
        paddingVertical:17,
        paddingHorizontal:60,
        borderRadius:10,
        marginHorizontal:20
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

export default EditScreen;