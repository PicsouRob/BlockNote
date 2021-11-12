import React, { useState, useEffect, useRef  } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Share, Alert, FlatList, BackHandler, StatusBar, Dimensions } from 'react-native';
import { Icon, Input, Image, Switch } from "react-native-elements";
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import Toast from 'react-native-easy-toast';

import OverlayBlock from './OverlayBlock';
import Flatlist from './Flatlist';
import { darkAction, ligthAction, saveNoteAction } from '../Redux/Action';
import { light_theme, dark_theme } from '../Redux/Theme';

function HomeScreen(props) {
    const { navigation, noteValue, theme, themeValue, dispatch } = props;
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchNoteTitle, setSearchNoteTitle] = useState([]);
    const [selectedCount, setSelectedCount] = useState(1);
    const [selectShow, setSelectShow] = useState(false);
    const [value, setValue] = useState('');
    const toastRef = useRef();

    useEffect(() => {
        setLoading(false);
    }, [loading]);
    
    const searchNote = (e) => {
        setValue(e);
        const text = e.toLowerCase();
        const data = noteValue.filter((item) => {
            if(item.title.toLowerCase().indexOf(text) > -1) {
                return item;
            } else {
                return null;
            }
        });

        data !== null ? setSearchNoteTitle(data) : setSearchNoteTitle([]);
    }

    const darkMode = (val) => {
        if(val === true) {
            dispatch(darkAction(dark_theme));
        } else {
            dispatch(ligthAction(light_theme));
        }
    };

    const shareApp = async () => {
        try {
            setIsVisible(false);
            await Share.share({ title: "Block Note", 
                message: "Click on this link to download the BlockNote application"});
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const shareNote = async () => {
        try {
            const data = noteValue.findIndex((item, index) => {
                if(item.checked === true) {
                    return item
                }
            });
            const dataShare = noteValue[data];
            await Share.share({ title: dataShare.title, 
                message: dataShare.text});
        } catch(error) {
            console.log(error.message);
        }
    }

    const cancelSelect = () => {
        setSelectShow(false);
        noteValue.map(item => {
            item.checked = false;
        });
        setSelectedCount(1);
    };

    const selectAll = async () => {
        const data = await noteValue.map(item => {
            if(selectedCount < noteValue.length) {
                item.checked = true;
                setLoading(true);
                setSelectedCount(noteValue.length);
            } else {
                item.checked = false;
                setLoading(true);
                setSelectedCount(0);
            }
        });
        return data;
    };

    const deleteSelected = () => {
        if(selectedCount === 0) {
            Alert.alert("Error trying to delete note", 
                "You must at least select one note to perform this task. "
            );
        } else {
            Alert.alert("Delete Note", `Do you want to delete these ${selectedCount} notes?`,
                [
                    {text: "Cancel", onPress: () => null},
                    {text: "yes", onPress: () => {
                        noteValue.map((item, index) => {
                            if(item.checked === true) {
                                dispatch(saveNoteAction(item));
                                setSelectShow(false);
                                toastRef.current.show(`${selectedCount} note was deleted with success`, 1500);
                                setSelectedCount(1);
                                setLoading(true);
                            }
                        });
                    }}
                ]
            );
        }
    }

    const selectTextBottom = () => {
        const selectLength = noteValue.length;
        let text;
        if(selectedCount < selectLength) {
            text = "Select all";
        } else {
            text = "Unselect all";
        }
        return text;
    }

    return (
        <View style={[styles.container, { backgroundColor: themeValue.BACKGROUND_COLOR }]}>
            <StatusBar backgroundColor={theme ? '#021534' : '#ffffff'} 
                barStyle={theme ? "ligth-content" : "dark-content"} 
            />

            {!selectShow ? (
                <View style={styles.header}>
                    <Text style={styles.name}>Picsou</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Icon name="share-social" type="ionicon" size={22} 
                            iconStyle={{ marginRight: 18, }}
                            onPress={() => shareApp()}
                            color={themeValue.TEXT_COLOR}
                        />
                        <Icon name="ellipsis-vertical" type="ionicon" size={22}
                            onPress={() => setIsVisible(true)}
                            color={themeValue.TEXT_COLOR}
                        />
                    </View>
                </View>
            ) : (
                <View>
                    <View style={styles.select_header}>
                        <Icon name="close" type="ionicon"
                            size={28} onPress={() => cancelSelect()}
                            color={themeValue.TEXT_COLOR} 
                        />
                        <Text style={[styles.select_text, { color: themeValue.TEXT_COLOR }]}>{selectedCount} element selected</Text>
                        <Icon name="list" type="ionicon"
                            onPress={() => selectAll()} size={28}
                            color={selectedCount < noteValue.length ? themeValue.TEXT_COLOR : "#e67e22"}
                        />
                    </View>
                    <View style={[styles.modal, { backgroundColor: themeValue.SEARCHBAR }]}>
                        <View style={styles.modal_row}>
                            {selectedCount === 1 && (
                                <TouchableOpacity style={styles.modal_item}
                                    onPress={() => shareNote()}
                                >
                                    <Icon name="share-variant" type="material-community" 
                                        color={themeValue.TEXT_COLOR}
                                    />
                                    <Text style={[styles.modal_text, { color: themeValue.TEXT_COLOR }]}>Share</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.modal_item}
                                onPress={() => selectAll()}
                            >
                                <Icon name="list" type="ionicon" size={28}
                                    color={selectedCount < noteValue.length ? themeValue.TEXT_COLOR : "#e67e22"}
                                />
                                <Text style={[styles.modal_text, { color: themeValue.TEXT_COLOR }]}>{selectTextBottom()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modal_item}
                                onPress={() => deleteSelected()}
                            >
                                <Icon name="trash-can-outline" type="material-community"
                                    color={themeValue.TEXT_COLOR}
                                />
                                <Text style={[styles.modal_text, { color: themeValue.TEXT_COLOR }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {noteValue.length > 0 ? (
                <View style={{ paddingHorizontal: 15 }}>
                    <Input 
                        placeholder="Search Notes"
                        containerStyle={[styles.continer_title, styles.shadow, 
                            { backgroundColor: themeValue.SEARCHBAR, shadowColor: themeValue.SHADOW_COLOR, }
                        ]}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        disabled={selectShow ? true : false}
                        inputStyle={{ color: "#e67e22", fontWeight: "700" }}
                        leftIcon={
                            <Icon name="search" type="ionicon" size={18} color="gray" />
                        }
                        onChangeText={(e) => searchNote(e)}
                        value={value}
                    />
                </View>
            ) : (<View style={{ marginTop: '40%', }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Image 
                            source={require('../../assets/Images/empty.jpg')}
                            style={styles.image}
                        />
                        <Text style={styles.note_empty}>You haven't saved any notes yet </Text>
                        <Text style={styles.info_text}>To save one, click the yellow button at the bottom of the screen.</Text>
                    </View>
                </View>)}

            {!selectShow ? (
                <TouchableOpacity style={[styles.buttonFlotting, styles.shadow]}
                    onPress={() => navigation.push("Note", { 
                        noteInfo: { title: '', text: '' }, edit: false, editIem: '', 
                        color: '', 
                    })}
                >
                    <Icon name="add-outline" type="ionicon" size={30} color="#fff" />
                </TouchableOpacity>
            ) : null}

            <OverlayBlock 
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            >
                <TouchableOpacity style={styles.btn_overlay}
                    onPress={() => selectMultiple()}
                >
                    <Text style={{ fontWeight: '700' }}>Select</Text>
                    <Icon name="chevron-forward" type="ionicon" size={15} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_overlay}>
                    <Text style={{ fontWeight: '700' }}>Dark Mode</Text>
                    <Switch value={theme} onValueChange={(val) => darkMode(val)} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_overlay}
                    onPress={() => shareApp()}
                >
                    <Text style={{ fontWeight: '700' }}>Share</Text>
                    <Icon name="chevron-forward" type="ionicon" size={15} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_overlay}
                    onPress={() => BackHandler.exitApp()}
                >
                    <Text style={{ fontWeight: '700' }}>Exit</Text>
                    <Icon name="chevron-forward" type="ionicon" size={15} />
                </TouchableOpacity>
            </OverlayBlock>

            {value && searchNoteTitle.length > 0 ? (
                <View>
                    <Flatlist 
                        data={searchNoteTitle}
                        navigation={navigation}
                        themeValue={themeValue}
                        noteValue={noteValue}
                        setLoading={setLoading}
                        setSelectShow={setSelectShow}
                        selectShow={selectShow}
                        setSelectedCount={setSelectedCount}
                        selectedCount={selectedCount}
                    />
                </View>
            ) : value && searchNoteTitle == 0 ? (
                <View style={styles.text_info}>
                    <Text style={styles.sorry_text}>Sorry</Text>
                    <Text style={styles.info_text}>There is no note with this title.</Text>
                </View>
            ) : !value && noteValue ? (
                <View>
                    <Flatlist 
                        data={noteValue}
                        navigation={navigation}
                        themeValue={themeValue}
                        noteValue={noteValue}
                        setLoading={setLoading}
                        setSelectShow={setSelectShow}
                        selectShow={selectShow}
                        setSelectedCount={setSelectedCount}
                        selectedCount={selectedCount}
                    />
                </View>
            ) : (<View></View>)}
            <Toast ref={toastRef} position="top" />
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        noteValue: state.noteValue,
        theme: state.theme,
        themeValue: state.themeValue
    }
} 

export default connect(mapStateToProps)(HomeScreen);

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between"
        alignItems: "center",
        marginTop: 10,
        paddingHorizontal: 15,
    },
    select_header: {
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
    },
    select_text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    modal: {
        position: "absolute",
        top: height - 70,
        width: width,
        height: 70,
        borderRadius: 10,
        backgroundColor: "#fff",
        borderBottomEndRadius: 0,
        borderBottomLeftRadius: 0,
        zIndex: 1,
    },
    modal_row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    modal_item: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 15,
    },
    modal_text: {
        fontSize: 15,
        color: "gray"
    },
    name: {
        fontWeight: "bold", 
        fontSize: 30, 
        color: "#e67e22",
    },
    continer_title: {
        height: 45,
        marginTop: 10,
        borderRadius: 30,
    },
    buttonFlotting: {
        width: 50,
        height: 50,
        position: "absolute",
        bottom: 20,
        right: 10,
        backgroundColor: "#e67e22",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    image: {
        width: 300,
        height: 200,
    },
    note_empty: {
        fontSize: 30,
        textAlign: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
        color: 'gray',
        fontWeight: 'bold',
    },
    info_text: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'gray',
    },
    btn_overlay: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    text_info: {
        marginTop: '15%',
        justifyContent: "center", 
        alignItems: "center", 
    },
    sorry_text: {
        fontSize: 20, 
        color: "#e67e22",
        fontWeight: "bold",
    }
});