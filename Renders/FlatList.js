import React from 'react'
import { View, FlatList, Text, StyleSheet } from 'react-native'

export function FlatList1({ data }) {
    let hasForges = true
    if (data == "") hasForges = false
    return (
        <View>
            {hasForges ? (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.time}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={styles.text}>
                                {item.forgeid} ending at: {item.forgeendtime} ({item.forgeuntil})
                            </Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.text}>Forge is empty :(</Text>
            )}
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
})