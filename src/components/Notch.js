import React from 'react';
import {Text, View, StyleSheet, StatusBar} from 'react-native';

const Notch = () =>{
    return <View style={styles.main} >
    </View>
}

const styles = StyleSheet.create({
    main:{
        height: StatusBar.currentHeight,
        backgroundColor:'#ffffff'
    }
});

export default Notch;