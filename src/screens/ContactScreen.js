import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput} from 'react-native';
import Notch from '../components/Notch';
import {Feather} from '@expo/vector-icons';
import Communications from 'react-native-communications';

const ContactScreen = ({ navigation }) => {
    return <View style={{flex:1, backgroundColor:'white'}} >
        <Notch />

        <View style={{flex:1}} >
            <Image 
                source={require('../../assets/about.jpg')}
                style={styles.image}
            />
            <View style={{margin:15}} >
                <Text style={styles.name} >Reach Us</Text>
            </View>
            <View style={styles.contact} > 
                <TouchableOpacity onPress={()=> Communications.phonecall('+919958034922', true)} >
                    <View style={styles.each} >
                        <Feather name='phone-call' size={24}color="black"  />
                        <Text style={{fontSize:20, color:'#2699fb', fontWeight:'bold'}} >+919958034922</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> Communications.email(['1ayushgoyal007@gmail.com'], null, null, null, null) } >
                    <View style={styles.each} >
                        <Feather name='mail' size={24}color="black"  />
                        <Text style={{fontSize:20, color:'#2699fb', fontWeight:'bold'}} >1ayushgoyal007@gmail.com</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> Communications.email(['aakash21031998@gmail.com'], null, null, null, null) } >
                    <View style={styles.each} >
                        <Feather name='mail' size={24}color="black"  />
                        <Text style={{fontSize:20, color:'#2699fb', fontWeight:'bold'}} >aakash21031998@gmail.com</Text>
                    </View>
                </TouchableOpacity>
                
            </View>
        </View>
        
    </View>
}

const styles = StyleSheet.create({
    image:{
        width:'100%',
        height:'40%'
    },
    name:{
        fontSize:25,
        textAlign:'center'
    },
    each:{
        flexDirection:'row',
        padding:15,
        justifyContent:'space-between',
        paddingHorizontal:20
    }
});

export default ContactScreen;