import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

export function Button1({ onPress, title }) {
    return (
        <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        marginBottom: 8,
        color: "#bcc3cf",
        textAlign: "center",
        fontFamily: "sans-serif",
    },
    button: {
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 5,
        width: "85%",
    },
});