import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const EachUserJob = ({address, category, priceFrom , priceTo, description, cancel, completed }) => {
    return <View style={styles.View} >
        <View style={styles.eachJob} >
            <Text style={{fontSize:16, fontWeight:'bold', paddingRight:5}} >Address:</Text>
            <View  style={{flex:1}} >
                <Text style={{textAlign:'right'}} >{address}</Text>
            </View>
        </View>
        <View style={styles.eachJob} >
            <Text style={{fontSize:16, fontWeight:'bold', paddingRight:5}} >Category:</Text>
            <View  style={{flex:1}} >
                <Text style={{textAlign:'right'}} >{category}</Text>
            </View>
        </View>
        <View style={styles.eachJob} >
            <Text style={{fontSize:16, fontWeight:'bold', paddingRight:5}} >Pay:</Text>
            <View  style={{flex:1}} >
            <Text style={{textAlign:'right'}} >{priceFrom}-{priceTo}</Text>
            </View>
        </View>
        <View style={styles.eachJob} >
            <Text style={{fontSize:16, fontWeight:'bold', paddingRight:5}} >Status:</Text>
            <View  style={{flex:1}} >
                <Text> {completed? <Text style={styles.statusBlue} >Completed</Text>:null}
                {cancel? <Text style={styles.statusRed} >Cancelled</Text>:null} {(!completed && !cancel)?<Text style={styles.status} >Pending</Text>:null}</Text>
            </View>
        </View>
       
    </View>
}

const styles =  StyleSheet.create({
    View:{
        justifyContent:'space-around',
        textAlign:'center',
        margin:20,
        padding:20,
        shadowColor:'gray',
        borderWidth:1,
        borderColor:'gray',
        borderRadius:20,
        zIndex:10,
        backgroundColor:'white'
    },
    status:{
        fontSize:16,
        fontWeight:'bold',
    },
    statusRed:{
        fontSize:16,
        fontWeight:'bold',
        color:'red'
    },
    statusBlue:{
        fontSize:16,
        fontWeight:'bold',
        color:'#2699fb'
    },
    eachJob:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:10
    }

});

export default EachUserJob;