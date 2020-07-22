import React from 'react';
import { StyleSheet, View } from 'react-native';

const Spacer  = () =>{
    return <View style={styles.space} >

    </View>
}

const styles = StyleSheet.create({
    space:{
        height:30
    }
})

export default Spacer;