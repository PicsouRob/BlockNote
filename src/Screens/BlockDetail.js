import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Share, Alert, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Icon } from "react-native-elements";
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast';

import OverlayBlock from './OverlayBlock';
import { saveNoteAction } from '../Redux/Action';

function BlockDetail(props) {

    const { navigation, route: { params }, dispatch } = props;
    const [isVisible, setIsVisible] = useState(false);
    const toastRef = useRef();

    const shareBlock = async () => {
        try {
            await Share.share({ title: params.detail.title, 
                message: params.detail.text});
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    const deleteNote = async () => {
        try {
            await Alert.alert("Delete Note", "Do you want to delete this note?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", onPress: async () => {
                        await dispatch(saveNoteAction(params.detail))
                        toastRef.current.show("Delete Successfully", 3000);
                        navigation.push("Home");
                    }}
                ]
            )
        } catch(error) {
            Alert.alert(error.message);
        }
    }

    const editNote = async () => {
        await navigation.push("Note", { 
            noteInfo: params.detail, edit: true, editIem: '', 
            color: params.detail.color,
        });
    }

    return (
        <View style={[styles.container, { backgroundColor: params.detail.color }]}>
            <StatusBar backgroundColor={params.detail.color} />
            <View style={{ marginHorizontal: 15, }}>
                <View style={styles.header}>
                    <Icon name="arrow-back-outline" type="ionicon" size={22} 
                        onPress={() => navigation.push("Home")}
                    />
                    <View style={{ flexDirection: "row" }}>
                        <Icon name="trash-outline" type="ionicon" size={22} 
                            onPress={() => deleteNote()}
                            iconStyle={{ marginHorizontal: 10, fontWeight: "bold", }}
                        />
                        <Icon name="share-outline" type="ionicon" size={22} 
                            onPress={() => shareBlock()}
                            iconStyle={{ marginHorizontal: 10, fontWeight: "bold", }}
                        />
                        <Icon name="pencil-outline" type="ionicon" size={22} 
                            onPress={() => editNote()}
                            iconStyle={{ marginHorizontal: 10 }}
                        />
                        <Icon name="ellipsis-vertical" type="ionicon" size={22} 
                            onPress={() => setIsVisible(true)}
                            iconStyle={{ marginLeft: 10, fontWeight: "bold" }}
                        />
                    </View>
                </View>
            </View>

            <OverlayBlock 
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            >
                <TouchableOpacity style={styles.btn_overlay}
                    onPress={() => saveNote()}
                >
                    <Text style={{ fontWeight: '700' }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_overlay}
                    onPress={() => {
                        setIsVisible(false);
                        shareBlock()
                    }}
                >
                    <Text style={{ fontWeight: '700' }}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_overlay}
                    onPress={() => deleteNote()}
                >
                    <Text style={{ fontWeight: '700' }}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_overlay}
                    onPress={() => navigation.push("Home")}
                >
                    <Text style={{ fontWeight: '700' }}>Exit</Text>
                </TouchableOpacity>    
            </OverlayBlock>

            <ScrollView style={styles.text_info}>
                <Text style={[styles.title, { color: params.detail.color === '#ffffff' ? '#e67e22' : '#000' }]}>{params.detail.title}</Text>
                <Text style={[styles.text, { color: params.detail.color === '#ffffff' ? '#000' : '#fff' }]}>{params.detail.text}</Text>
            </ScrollView>
            <Toast ref={toastRef} position="top" />
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        noteValue: state.noteValue
    }
} 

export default connect(mapStateToProps)(BlockDetail);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
    },
    btn_overlay: {
        paddingVertical: 10,
    },
    text_info: {
        width: "100%",
        height: 600,
        marginTop: 7,
        padding: 20,
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 23,
    },
    text: {
        marginTop: 15,
        fontSize: 19,
        fontWeight: "600",
        marginBottom: 40
    }
});