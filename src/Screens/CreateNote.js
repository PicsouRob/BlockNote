import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Alert, StatusBar } from 'react-native';
import { Icon, Input } from "react-native-elements";
import Modal from 'react-native-modal';
import Toast from 'react-native-easy-toast';
import { connect } from 'react-redux';

import OverlayBlock from './OverlayBlock';
import { colors, setHours } from '../Helpers/data';
import { saveNoteAction, editAction } from '../Redux/Action';

function CreateNote (props) {

    const { navigation, route: { params }, dispatch } = props;
    const [noteBlock, setNoteBlock] = useState({
        title: params.edit ? params.noteInfo.title : '', 
        text: params.edit ? params.noteInfo.text : '', 
        date: "", editItem: "", 
        color: params.edit ? params.color : "#ffffff",
        checked: false,
    });
    const toastRef = useRef();
    const input = useRef();
    const [isVisible, setIsVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    
    const valideNote = (type, e) => {
        setModalVisible(false);
        setNoteBlock({
            ...noteBlock, 
            [type]: e, 
            date: setHours, 
            editIem: params.noteInfo,
        });
    }

    const saveEdit = () => {
        if(params.noteInfo.title !== noteBlock.title || params.noteInfo.text !== noteBlock.text || params.color !== noteBlock.color) {
            dispatch(editAction(noteBlock));
            navigation.push("Home");
            toastRef.current.show("Your note save with success", 3000);
        } else {
            Alert.alert("Error to edit note", 
                "To edit your note, at least the title or the text must be different from the one before ",
                [
                    { text: "Ok", onPress: () => null }
                ]
            );
        }
    }
    
    const saveNote = () => { 
        toastRef.current.show("You note save with success", 3000);
        dispatch(saveNoteAction(noteBlock));
        navigation.push("Home");
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <View style={{ marginHorizontal: 15, }}>
                <View style={styles.header}>
                    <Icon name="arrow-back-outline" type="ionicon" size={22} 
                        onPress={() => navigation.push("Home")}
                    />
                    <View style={{ flexDirection: "row" }}>
                        <Icon name="ellipse" type="ionicon" size={25} 
                            onPress={() => setModalVisible(!modalVisible)}
                            style={styles.shadow}
                            color={noteBlock.color === '#ffffff' ? "#000" : noteBlock.color}
                            iconStyle={{ marginHorizontal: 10 }}
                        />

                        {params.edit ? (
                            <View>
                                {noteBlock.title && noteBlock.text || params.noteInfo.title !== '' && params.noteInfo.text !== '' ? (
                                    <Icon name="checkmark" type="ionicon" size={22} 
                                        onPress={() => saveEdit()}
                                        iconStyle={{ marginLeft: 10, fontWeight: "bold" }}
                                    />
                                ) : ( <View></View>)}
                            </View>
                        ) : (
                            <View>
                                {noteBlock.title && noteBlock.text || params.noteInfo.title !== '' && params.noteInfo.text !== '' ? (
                                    <Icon name="checkmark" type="ionicon" size={22} 
                                        onPress={() => saveNote()}
                                        iconStyle={{ marginLeft: 10, fontWeight: "bold" }}
                                    />
                                ) : ( <View></View>)}
                            </View>
                        )}
                        <Icon name="ellipsis-vertical" type="ionicon" size={22} 
                            onPress={() => setIsVisible(true)}
                            iconStyle={{ marginLeft: 10, fontWeight: "bold" }}
                        />
                    </View>
                </View>

                <Input 
                    ref={input}
                    placeholder="Title"
                    style={styles.title}
                    containerStyle={styles.continer_title}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    inputStyle={{ fontWeight: "bold" }}
                    onChangeText={(e) => valideNote("title", e)}
                    rightIcon={
                        <Icon type="ionicon" size={20}
                            onPress={() => {
                                input.current.clear();
                                noteBlock.title=''
                            }} 
                            name={noteBlock.title || params.noteInfo.title ? "close-circle" : null} />
                    }
                    value={noteBlock.title}
                    defaultValue={noteBlock.title}
                />
                <Input 
                    placeholder="Text here"
                    containerStyle={styles.container_text}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    multiline={true}
                    onChangeText={(e) => valideNote("text", e)}
                    value={noteBlock.text}
                    defaultValue={noteBlock.text}
                />
                <OverlayBlock 
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                >
                    <TouchableOpacity style={styles.btn_overlay}
                        onPress={() => {
                            setIsVisible(false); setModalVisible(!modalVisible);
                        }}
                    >
                        <Text style={{ fontWeight: '700' }}>Change background</Text>
                        <Icon name="chevron-forward-outline" type="ionicon" size={18} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn_overlay}
                        onPress={() => navigation.push("Home")}
                    >
                        <Text style={{ fontWeight: '700' }}>Go back</Text>
                        <Icon name="chevron-forward-outline" type="ionicon" size={18} />
                    </TouchableOpacity>
                    
                </OverlayBlock>
            </View>

            <Modal
                animationType="slide"
                visible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                style={styles.modal}
            >
                <FlatList 
                    data={colors}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ marginVertical: 10, }}
                    renderItem={({item, index}) => (
                        <TouchableOpacity 
                            style={[styles.color_block, styles.shadow, { backgroundColor: item.color }]}
                            onPress={() => valideNote("color", item.color)}
                        >
                        </TouchableOpacity>
                    )}
                />
            </Modal>
            <Toast ref={toastRef} position="top" />
        </View>
    )
}


const width = Dimensions.get("window").width;

const mapStateToProps = (state) => {
    return {
        noteValue: state.noteValue
    }
}

export default connect(mapStateToProps)(CreateNote);

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
    continer_title: {
        height: 50,
        marginTop: 30,
        borderRadius: 10,
        backgroundColor: "#fff"
    }, 
    container_text: {
        marginTop: 20,
        height: 620,
        borderRadius: 10,
        backgroundColor: "#fff"
    },
    btn_overlay: {
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    color_block: {
        width: 90,
        height: 140,
        borderRadius: 10,
        marginHorizontal: 6,
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
    modal_container: {
        paddingVertical: 15,
    },
    modal: {
        position: "absolute",
        width: width,
        bottom: 0,
        margin: 0,
        height: 170,
        borderRadius: 10,
        backgroundColor: "#fad390",
        borderBottomEndRadius: 0,
        borderBottomLeftRadius: 0,
    }
});