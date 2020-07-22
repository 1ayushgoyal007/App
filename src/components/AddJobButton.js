import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddJobButton = () => {
    return <View style={styles.container} >
        <Text style={{ fontSize:20}} >Post a Job  </Text>
        <Text style={{ fontSize:20}} >+ </Text>

    </View>
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#222',
        borderWidth:1,
        padding:10,
        marginHorizontal:60,
        borderRadius:5

    }
});

export default AddJobButton;