import React, { useState } from "react";
import { TouchableOpacity, Text } from "react-native";

export const ShowMore = ({ content, showText = "Show more", hideText = "Show less" }) => {
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
