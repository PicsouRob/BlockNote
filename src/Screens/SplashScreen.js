import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import LottieView from 'lottie-react-native';

function SplashScreen(props) {
    const { navigation } = props;

    useEffect(() => {
        setTimeout(() => {
            navigation.replace("Home");
        }, 1800);
    }, []);

    return (
        <LottieView source={require('../.././assets/splash.json')} autoPlay loop style={styles.container} />
    )
}

export default SplashScreen;

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: "#fff",
        margin: 0, 
    }
});