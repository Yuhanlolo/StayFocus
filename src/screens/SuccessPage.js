import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

//When finish the focusing task, this page come out for congrats.

class SuccessPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "Congrats! You have completed your focusing plan now!",
        };
    }

    render() {
        return (
            <View style={styles.background}>
                <Text style={styles.baseText}>{this.state.text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#8D9E98",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },

    baseText: {
        fontSize: 25,
        position: "absolute",
        top: 240,
        left: 30,
        fontFamily: "sans-serif",
        color: "white",
        textAlign: "center",
        textAlignVertical: "center",
    },
});

export default SuccessPage;
