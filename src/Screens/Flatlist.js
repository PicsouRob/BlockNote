import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from "react-native-elements";

const Flatlist = (props) => {

    const { navigation, data, themeValue, noteValue, setLoading, selectShow, setSelectShow, setSelectedCount, selectedCount } = props;
    const heigth = Dimensions.get('window').height;
    
    const onPressNote = (item) => {
        if(!selectShow) {
            navigation.push("Detail", { detail: item });
        } else {
            const data = noteValue.map((ele, index) => {
                if(ele === item && item.checked === false) {
                    setLoading(true);
                    ele.checked = true;
                    setSelectedCount(selectedCount + 1);
                } else if(ele === item && item.checked === true) {
                    setLoading(true);
                    ele.checked = false;
                    setSelectedCount(selectedCount - 1);
                }
            });
            return data;
        }
    };

    const longPress = async (item) => {
        setSelectShow(true);
        const data = await noteValue.map((ele, ind) => {
            if(ele === item) {
                item.checked = true;
                setLoading(true);
            }
        });
        return data;
    };

    return (
        <View style={{ marginVertical: 10, }}>
            <FlatList 
                data={data.concat().reverse()}
                keyExtractor={(item, index) => index.toString()}
                style={[styles.flatlist, { height: selectShow ? heigth - 190 : heigth - 150 }]}
                renderItem={({item, index}) => (
                    <TouchableOpacity
                        style={[styles.note_btn, styles.shadow, 
                            { backgroundColor: item.color, shadowColor: themeValue.SHADOW_COLOR }]}
                        onPress={() => onPressNote(item)}
                        onLongPress={() => longPress(item)}
                        key={item.id}
                    >
                        <View>
                            <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
                            <Text style={{ marginBottom: 5 }} numberOfLines={2}>{item.text}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                        {selectShow ? (
                            <View>
                                <Icon name={item.checked ? "checkmark-circle" : "ellipse"} 
                                    type="ionicon" size={30} 
                                    color={item.checked ? "#f39c12" : "#bdc3c7"} />
                            </View>
                        ) : null}
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default Flatlist;

const styles = StyleSheet.create({
    shadow: {
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    note_btn: {
        marginTop: 8,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    flatlist: {
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    title: {
        fontWeight: "bold", fontSize: 20, marginBottom: 5
    },
    date: {
        color: "#2f3640"
    },
});