import { Text, View } from "native-base";
import React from "react";
import { tabBarStylesPills } from "~theme/components/tabBarStyles";

export const CustomTabBarLabel = ({ focused, label }) => (
    <View
        style={[
            tabBarStylesPills.tabBarItemStyle,
            { backgroundColor: focused ? '#62A446' : '#E3E9EC' }, // Green for active, grey for inactive
        ]}
    >
        <Text
            style={[
                tabBarStylesPills.tabBarLabelStyle,
                { color: focused ? '#FFFFFF' : '#253545' }, // White text for active, dark text for inactive
            ]}
        >
            {label}
        </Text>
    </View>
);

