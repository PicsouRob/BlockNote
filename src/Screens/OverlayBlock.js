import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, Overlay } from "react-native-elements";

function OverlayBlock(props) {

    const { isVisible, setIsVisible, children } = props;

    const toggleOverlay = () => {
        setIsVisible(!isVisible);
    }

    return (
        <Overlay
            isVisible={isVisible}
            onBackdropPress={() => toggleOverlay()}
            overlayStyle={[styles.container, styles.shadow]}
        >
            <View>
                {children}
            </View>
        </Overlay>
    )
}

export default OverlayBlock;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 20,
        right: 20,
        width: 200,
        height: "auto",
        padding: 20,
        borderRadius: 15,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
});