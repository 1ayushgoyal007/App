import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

const Spinner = (  ) =>{
    return <View style={styles.spinner} >
        <ActivityIndicator size='large' />
    </View>
}

const styles = StyleSheet.create({
    spinner:{
        alignSelf:'center',
        justifyContent:'center'
    }
});

export default Spinner;