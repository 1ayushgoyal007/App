import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const EachWorkerJob = ({address, category,distance ,created_by, description, photoURL, priceFrom, priceTo, longitude, latitude}) => {
    return <View style={styles.View} >
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Image 
                style={styles.image}
                source={{ uri: photoURL }}
            />
            <View style={{flex:1,  alignSelf:'center', paddingLeft:20}} >
                <Text style={{fontSize:20, fontWeight:'700'}} > {created_by}</Text>
            </View>
        </View>
        <View style={styles.eachProp} >
            <Text style={{fontSize:16, fontWeight:'bold', paddingRight:20}}>Address:</Text>
            <View style={{flex:1}} >
                <Text style={{fontSize:16, textAlign:'right'}} >{address}</Text>
            </View>

        </View>
        <View style={styles.eachProp} >
            <Text style={{fontSize:16, fontWeight:'bold', paddingRight:20}}>Description:</Text>
            <View style={{flex:1}} >
                <Text style={{fontSize:16, textAlign:'right'}} >{description}</Text>
            </View>

        </View>
        <View style={styles.eachProp} >
            <Text style={{fontSize:16, fontWeight:'bold', paddingRight:20}}>Category:</Text>
            <View style={{flex:1}} >
                <Text style={{fontSize:16, textAlign:'right'}} >{category}</Text>
            </View>

        </View>
        <View style={styles.eachProp} >
            <Text style={{fontSize:16, fontWeight:'bold', paddingRight:20}}>Pay:</Text>
            <View style={{flex:1}} >
                <Text style={{fontSize:16, textAlign:'right'}} >{priceFrom}-{priceTo}</Text>
            </View>

        </View>
        {/* {distance? <Text>{distance} Km Away</Text>:<Text>No distance</Text>} */}

        {/* {longitude? <Text>{longitude}</Text>:<Text>No Longitude</Text>}
        {latitude? <Text>{latitude}</Text>:<Text>No Latitude</Text>} */}
    </View>
}

const styles = StyleSheet.create({
    View:{
        justifyContent:'space-around',
        textAlign:'center',
        margin:10,
    },
    image:{
        width:100,
        height:100,
        borderRadius:60
    },
    eachProp:{
        marginTop:5,
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:5
    },
    eachProp1:{
        marginTop:5,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingRight:60,
        paddingHorizontal:5
    }
});

export default EachWorkerJob;