import React,{useState} from 'react';
import {View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import MultiSelect from 'react-native-multiple-select';
import firebase from '../../firebase';
import Spinner from '../components/Spinner';
import Notch from '../components/Notch';
import Spacer from '../components/Spacer';
const DetailScreen  = ({ navigation }) => {
    
    const GenderData = [{
        value: 'Male',
      }, {
        value: 'Female',
    }];

    const stateData = [{
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

    const purposeData = [{
        value: 'I will Work',
      }, {
        value: 'I will Hire',
    }];

    if(firebase.auth().currentUser){
        var User = firebase.auth().currentUser;
    }

    const [name, setName] = useState(User.providerData[0].displayName);
    const [gender, setGender] = useState('');
    const [state, setState] = useState('');
    const [selected, setSelected]= useState([]);
    const [purpose, setPurpose] = useState("");
    const [number, setNumber] = useState('');
    const [status, setStatus] = useState(false);
    const check= navigation.getParam('purpose');

    const jobCategory = [{
        id: 'HTML',
        name: 'HTML',
      }, {
        id: 'CSS',
        name: 'CSS',
      }, {
        id: 'JavaScript',
        name: 'JavaScript',
      }];
     

      console.log('uid',User.providerData[0]);
      const userId = User.providerData[0].uid;
      console.log(userId);

    const updateThenRoute = async (name, gender, state, number) => {
        setStatus(true);
        console.log('selecteds',selected);
        if(selected.length){
            var res = await firebase.database().ref(`/users/${userId}`).update({
                displayName: name,
                gender:gender,
                state:state,
                number: number,
                skills: selected
            })
        }else{
            var res = await firebase.database().ref(`/users/${userid}`).update({
                displayName: name,
                gender:gender,
                state:state,
                number: number
            })
        }
        console.log('update complete');
        if(check=="I will Work"){
            console.log('work wala console');
            navigation.navigate("WorkFlow");
        }else{
            console.log('Hire wala console');
            navigation.navigate('HireFlow');
        }
    }


      const saveThenRoute = async (name, gender, state, purpose, selected, number) => {
          setStatus(true);
          console.log(name)
          console.log(gender);
          console.log(state);
          console.log(purpose);
          console.log(selected);
        
          try{
            if(purpose==="I will Work"){
                var response = await firebase.database().ref(`/users/${userId}`).set({
                   gmail: User.providerData[0].email,
                   displayName: name,
                   created_time: Date.now(),
                   gender: gender,
                   loc_state: state,
                   occupation: purpose.trim(),
                   skills: selected,
                   number: number.trim(),
                   jobsCompleted:0,
                   rating: 0.0
               });
               console.log("data pushed");
               navigation.navigate('WorkFlow');
             }else{
                var response = await firebase.database().ref(`/users/${userId}`).set({
                   gmail: User.providerData[0].email,
                   displayName: name,
                   created_time: Date.now(),
                   gender: gender,
                   loc_state: state,
                   occupation: purpose.trim(),
                   number:number.trim(),
                   jobsCompleted:0,
                   jobPosted:0,
                   rating:0.0
             });
     
             console.log("Data Pushed");
             navigation.navigate("HireFlow");
           }
          }catch(err){
              console.log("error",err);
          }
      
    }

    return <View style={{flex:1, backgroundColor:'white'}} >
        <Notch />
        <View style={{width:175,  borderBottomRightRadius:300, backgroundColor:'#E8B800', paddingLeft:10}} >
            <Image 
                source={require('../../assets/title.png')}
                style={styles.headerImage}
            />
        </View>
        <View>
            <Image 
                source={require('../../assets/side.png')}
                style={styles.side}
            />
        </View>
        <View>
            
        </View>
        <ScrollView>
        <Image 
            style={styles.image}
            source={{ uri: User.providerData[0].photoURL }}
        />
        <Spacer />
        
        <View style={styles.nameView} >
            <TextInput 
                
                style={{fontSize:16}}
                placeholder="Full Name"
                value={name}
                onChangeText={(name)=> setName(name)}
            />
        </View>
        <Spacer />
        <View style={styles.DropdownView} >
            <Dropdown 
                label="Gender"
                data =  {GenderData}
                value = {gender}
                onChangeText={(gender)=> setGender(gender)}
            />
        </View>
        <Spacer />
        <View  style={styles.nameView}>
            <TextInput 
                style={{fontSize:16}}
                placeholder="Enter Mobile Number"
                value={number}
                onChangeText={(number)=> setNumber(number)}
            />
        </View>
        
        <Spacer />
        <View style={styles.DropdownView} >
            <Dropdown 
                label="State"
                data =  {stateData}
                value = {state}
                onChangeText={(state)=> setState(state)}
            />
        </View>
        <Spacer />
        


        {check?
        null:<View style={styles.DropdownView} >
                <Dropdown 
                    label="Purpose"
                    data =  {purposeData}
                    value = {purpose}
                    onChangeText={(purpose)=> setPurpose(purpose)}
                />
        </View>}


        <Spacer />

        {purpose==='I will Work' || check=="I will Work"?
             <View style={{flex:1, marginHorizontal:20}} >
             <MultiSelect
                 hideTags
                 items={jobCategory}
                 uniqueKey="id"
                 onSelectedItemsChange={(selected)=>  setSelected(selected)}
                 selectedItems={selected}
                 selectText="Pick Multiple"
                 submitButtonColor="#2699FB"
                 submitButtonText="Submit"
             />
         </View>:
         null
    }
    <Spacer />

        {status?<Spinner />:
            <TouchableOpacity onPress={()=>{
                if(check){
                    if( name.length <= 2 || gender.length <= 1 || state.length <= 1 || parseInt(number).toString().length != 10   ){
                      console.log(number, parseInt(number));
                        alert('Enter Valid Details');
                    }else{
                        console.log('right place');
                        updateThenRoute(name, gender, state, number);
                    }
                }else{
                    if( name.length <= 2 || gender.length <= 1 || state.length <= 1 || purpose.length <= 1  || parseInt( number) != 10  ){
                        console.log('Enter Valid Credentials');
                    }else{
                        saveThenRoute(name, gender, state, purpose, selected, number);
                    }
                }
            }} >
                <Image
                    source={require('../../assets/save-btn.png')}
                    style={styles.saveBtn}
                />
            </TouchableOpacity>
        }
        <Spacer />
        <Image 
            source={require('../../assets/bottom.png')}
            style={styles.bottom}
        />
        </ScrollView>
    </View>
}

const styles = StyleSheet.create({
    headerImage:{
        resizeMode:'contain',
        width:'100%'
    },
    nameView:{
        borderColor:'#222',
        borderBottomWidth:1,
        paddingVertical:5,
        marginHorizontal:20,
    },
    image:{
        alignSelf:'center',
        width:100,
        height:100,
        borderRadius:60
    },
    DropdownView:{
        marginHorizontal:20
    },
    saveBtn:{
        width:'100%',
        resizeMode:'contain'
    },
    side:{
        position:'absolute',
        right:0,
        zIndex:2
    },
    bottom:{
        resizeMode:'contain',
        left:0
    }

});

export default DetailScreen;