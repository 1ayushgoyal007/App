import React,{useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Spacer from '../components/Spacer';
import Spinner from '../components/Spinner';
import firebase from '../../firebase';
import {Rating, AirbnbRating} from 'react-native-ratings';
const RatingScreen = ({ navigation }) =>{

    const [rating, setRating] = useState(1);
    const [gotRating, setGotRating] = useState(true);
    const [jobs, setJobs] = useState(null);
    const userId = navigation.getParam('id');

    console.log(userId);
    const updateRating = async () =>{
        if(typeof(gotRating)===typeof(1)){
            if(gotRating==0){
                var res = rating;
            }else{
                var res = (gotRating+rating)/2;
                var res = ((gotRating*jobs)+ rating ) /(jobs+1);
            }
        }
            var tem = await firebase.database().ref(`/users/${userId}`).update({
            rating: res,
            jobsCompleted:jobs+1
            })
            console.log('everything is done');
            navigation.navigate('Dashboard');
    }

    const getData = async () => {
        await firebase.database().ref(`/users/${userId}`).on('value', async function(snapshot){
                var response  = await snapshot;
                console.log('here is your response',response.val().rating);
                if(response){
                    console.log('response is there ?', typeof(response.val().rating), response.val().rating);
                    setJobs(response.val().jobsCompleted);
                    setGotRating(response.val().rating);
                }
            });
    }

    typeof(gotRating)==typeof(1)?console.log('there is rating ', gotRating ): console.log('there is  no rating', gotRating)

    useEffect(()=>{
        getData();
    },[jobs]);

    return <View style={styles.main} >
        <Text style={{textAlign:'center', fontSize:24}} >Feedback</Text>
        <View>
            <Rating 
                showRating
                startingValue={rating}
                onFinishRating={(rating)=> {
                    setRating(rating) 
                    console.log(rating)
                }}
            />
            <Spacer />
            <Text style={{textAlign:'center', fontSize:24}} >Swipe Rating</Text>
        </View>
        
        <View style={styles.buttons} >
            <TouchableOpacity onPress={()=>{
                Alert.alert('Alert','Do you really wanna Skip Feedback?',[
                    {text:'Skip',onPress:()=> {navigation.navigate('Dashboard') }},
                    {text:'Cancel'}
                ])
            }} >
                <Text>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                Alert.alert('Alert', 'Thank you for your valuable Feedback, Please Submit to Confirm!',[
                    {text:'Submit',onPress: ()=>updateRating() },
                    {text:'Cancel'}
                ])
            }} >
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    </View>
}

RatingScreen.navigationOptions = () =>{
    return {
        headerShown: false
    }
}

const styles = StyleSheet.create({
    main:{
        backgroundColor:'white',
        flex:1,
        justifyContent:'space-around'
    },
    buttons:{
        flexDirection:'row',
        justifyContent:'space-around'
    }
});

export default RatingScreen;