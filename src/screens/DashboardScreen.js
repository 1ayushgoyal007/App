import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, } from 'react-native';
import Spacer from '../components/Spacer';
import * as Location from 'expo-location';
import AddJobButton from '../components/AddJobButton';
import EachUserJob from '../components/EachUserJob';
import firebase from '../../firebase';
import Notch from '../components/Notch';
import {FontAwesome} from '@expo/vector-icons';
import Spinner from '../components/Spinner';

const DashboardScreen = ({ navigation }) =>{


    const [location, setLocation] = useState(null);
    const [jobs, setJobs] =  useState([]);
    const [loading, setLoading] = useState(true);


    if(firebase.auth().currentUser){
        var User = firebase.auth().currentUser;
    }
    const userId = User.providerData[0].uid;

    const getData = () => {
        firebase.database().ref(`/jobs/${userId}`).on("value", async function(snapshot){
            var response = await snapshot;
            var result = [];
            if(response){
                setLoading(false);
            }
            response.forEach((eachJob)=>{
                result.push(eachJob);
            });
            setJobs(result.reverse());
            console.log('jobs', jobs);
        })
    }


  useEffect(() => {
    getData();
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
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

            <TouchableOpacity onPress={()=> navigation.navigate('Create')} >
            <Image  
                source={require('../../assets/createBtn.png')}
                style={styles.createBtn}
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
       <Spacer />
       

    {loading?<View style={styles.loadingView} >
        <Text style={{fontSize:20}} >Loading your Jobs</Text>
        <Spinner />
    </View>:<ScrollView style={{borderTopColor: '#222', marginHorizontal:5}} >
        
        {jobs.length?
         <FlatList
            data = {jobs}
            nestedScrollEnabled
            showsVerticalScrollIndicator = {true}
            keyExtractor={(jobs)=> jobs.val().uniqueId}
            renderItem={({ item })=>{
                return (<ScrollView >
                <TouchableOpacity style={styles.each} onPress={()=> navigation.navigate('showJob',{id: item.val().uniqueId})} >

                    <EachUserJob
                        address = {item.val().address}
                        category ={ item.val().category}
                        completed = {item.val().completed}
                        description= {item.val().description}
                        cancel = {item.val().cancel}
                        priceFrom ={item.val().priceFrom}
                        priceTo = {item.val().priceTo}
                        completed = {item.val().completed}
                    />

                </TouchableOpacity>
                </ScrollView>)
            }}
         />: <View>
                <Spacer />
                <Text style={{fontSize:20, textAlign:'center'}} >You Haven't Posted any Job Yet.</Text>
            </View>}
    </ScrollView>}


    
    </View>
}


DashboardScreen.navigationOptions = () =>{
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
    
    each:{
    },
 jobView:{
    borderColor:'red',
    borderWidth:1
 }
})

export default DashboardScreen;