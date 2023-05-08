import React from "react";
import { View, TouchableOpacity, Text, FlatList, StyleSheet } from "react-native";
import { useState } from "react";

function Button1({ onPress, title }) {
    return (
        <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
}
function FlatList1({ data }) {
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
const ShowMore = ({ content, showText = "Show more", hideText = "Show less" }) => {
    const [showMore, setShowMore] = useState(false);

    const handleToggleShowMore = () => {
        setShowMore(!showMore);
    };

    const textChildIndex = React.Children.toArray(content.props.children).findIndex(
        (child) => child.type === Text
    );

    const limitedContent = React.cloneElement(content, {
        children: React.Children.map(content.props.children, (child, index) => {
            if (index === textChildIndex) {
                return React.cloneElement(child, {
                    numberOfLines: showMore ? undefined : 3,
                });
            } else {
                return child;
            }
        }),
    });

    return (
        <>
            {content.props.children.length > 0 && (
                <TouchableOpacity onPress={handleToggleShowMore}>
                    <Text style={{ textAlign: "center" }}>
                        {showMore ? hideText : showText}
                    </Text>
                </TouchableOpacity>
            )}
            {!showMore && (
                <Text style={{ height: 0, overflow: "hidden" }}>
                    {content.props.children[textChildIndex].props.children}
                </Text>
            )}
            {showMore && limitedContent}

        </>
    );
};

const styles = StyleSheet.create({
    view: {
        backgroundColor: "gray",
        textAlign: "center",
    },
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

export { Button1, FlatList1, ShowMore }