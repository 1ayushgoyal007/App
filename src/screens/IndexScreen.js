import React, {useContext} from 'react';
import { ScrollView,Text,StyleSheet,FlatList,View, Button,TouchableOpacity } from 'react-native';
import { Context} from '../context/BlogContext';
import {Feather} from '@expo/vector-icons';

import Spacer from '../components/Spacer';

const IndexScreen = ({ navigation }) =>{

    const { state, deleteBlogPost } = useContext(Context);
    


    return <View style={styles.main} >
        <Text style={styles.majdoor} >Majdoor</Text>
        <TouchableOpacity onPress={()=> navigation.navigate('Create') } >
                        <Text>Create One</Text>
        </TouchableOpacity>
            <FlatList 
                data={state}
                keyExtractor={(blogPost)=>blogPost.address}
                showsHorizontalScrollIndicator
                renderItem={({item})=>{
                return  <TouchableOpacity onPress={()=> navigation.navigate('Show', {id: item.id })} >
                <View  style={styles.eachJob} >
                    <Text style={styles.title} >{item.address}</Text>
                    <Text>{item.desc}</Text>
                    <Text>{item.from}</Text>
                    <Text>{item.to}</Text>


                    



                </View>
                </TouchableOpacity>
                }}
            />
        

            
        </View>
}

IndexScreen.navigationOptions = () =>{
    return {
        headerShown:false
    };
}


const styles = StyleSheet.create({
    main:{
        flex:1,
        marginTop:40
    },
    majdoor:{
        alignSelf:"center",
        fontWeight:'bold',
        fontSize:28
    },
    eachJob:{
        borderWidth:1,
        borderColor:'black',
        margin:20,
        padding:20,
        borderRadius:10
    }
});

export default IndexScreen;