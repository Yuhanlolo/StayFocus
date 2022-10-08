import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

//This is a count-down timer.

class TimerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text_1: "Tap the clock",
            text_2: "To start your focused time!",
            flag: true,
            set: false,
            min_1: 0,
            min_2: 0,
            minSet_1: 0,
            minSet_2: 0,
            sec_1: 0,
            sec_2: 0,
            pause: true,
        };
    }

    //Receive the params from HomePage and QuitPage to set timer

    timeSetter() {
        let { timeSet, second_1, second_2, tag } = this.props.route.params;
        this.setState({ pause: true });
        this.setState({ min_1: Math.floor(timeSet / 10) });
        this.setState({ min_2: timeSet - Math.floor(timeSet / 10) * 10 });
    }

    //Timer

    timeCounter() {
        if (this.state.flag == true) {
            this.interval = setInterval(() => {
                if (
                    this.state.min_1 == 0 &&
                    this.state.min_2 == 0 &&
                    this.state.sec_1 == 0 &&
                    this.state.sec_2 == 0
                ) {
                    this.setState({ sec_2: 0 });
                    this.setState({ sec_1: 0 });
                    this.setState({ min_2: 0 });
                    this.setState({ min_1: 0 });
                    this.interval && clearInterval(this.interval);
                    if (this.state.set == true) {
                        this.props.navigation.navigate("SuccessPage");
                    }
                }
                if (this.state.pause == false) {
                    this.setState({ sec_2: this.state.sec_2 });
                    this.setState({ sec_1: this.state.sec_1 });
                    this.setState({ min_2: this.state.min_2 });
                    this.setState({ min_1: this.state.min_1 });
                    this.interval && clearInterval(this.interval);
                } else {
                    this.setState({ set: true });
                    this.setState({ sec_2: this.state.sec_2 - 1 });
                    if (this.state.sec_2 == -1) {
                        this.setState({ sec_2: 9 });
                        this.setState({ sec_1: this.state.sec_1 - 1 });
                        if (this.state.sec_1 == -1) {
                            this.setState({ sec_1: 5 });
                            this.setState({ min_2: this.state.min_2 - 1 });
                            if (this.state.min_2 == -1) {
                                this.setState({ min_2: 9 });
                                this.setState({ min_1: this.state.min_1 - 1 });
                            }
                        }
                    }
                }
            }, 1000);
        }
    }

    //Make timeSetter method execute without binding to events

    componentDidMount() {
        this.timeSetter();
    }

    render() {
        return (
            <View style={styles.background}>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#28454B",
                        width: 100,
                        height: 32,
                        borderRadius: 15,
                        alignItems: "center",
                    }}
                    onPress={() => {
                        this.setState({ pause: false });
                        this.props.navigation.navigate("QuitPage", {
                            timeBreak: this.state.min_1 * 10 + this.state.min_2,
                            secBreak_1: this.state.sec_1,
                            secBreak_2: this.state.sec_2,
                        });
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "sans-serif",
                            color: "white",
                            textAlign: "center",
                            textAlignVertical: "center",
                            fontSize: 18,
                        }}
                    >
                        {"Give up"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        this.timeSetter();
                        this.timeCounter();
                    }}
                >
                    <Text> </Text>
                </TouchableOpacity>
                <Text style={styles.baseText}>
                    <Text style={styles.timeText}>
                        {this.state.min_1}
                        {this.state.min_2}
                        {":"}
                        {this.state.sec_1}
                        {this.state.sec_2}
                        {"\n"}
                        {"\n"}
                        {"\n"}
                    </Text>
                    <Text>
                        {this.state.text_1}
                        {"\n"}
                        {this.state.text_2}
                    </Text>
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#8D9E98",
        justifyContent: "center",
        paddingHorizontal: 10,
    },

    baseText: {
        position: "absolute",
        top: 200,
        left: 120,
        fontFamily: "sans-serif",
        color: "white",
        textAlign: "center",
        textAlignVertical: "center",
    },

    button: {
        height: 530,
        borderRadius: 15,
        alignItems: "center",
        backgroundColor: "#8D9E98",
        padding: 10,
    },

    timeText: {
        position: "absolute",
        top: 150,
        fontSize: 60,
    },
});

export default TimerPage;
