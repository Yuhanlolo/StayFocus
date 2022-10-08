import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import ModalDropdown from "react-native-modal-dropdown";

const type = [
    "               25min",
    "               50min",
    "               75min",
    "               100min",
];

//Home page to set focusing time

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "I want to keep focus for",
            minSet: 0,
            areaIndex: "0",
            typeShow: false,
            flag: false,
            temp: "0",
        };
    }

    _selectType = (index, value) => {
        console.log(index + "--" + value);
        this.setState({
            areaIndex: index,
        });
        let time = value.substr(15);
        time = time.replace("m", "");
        time = time.replace("i", "");
        time = time.replace("n", "");
        this.setState({ temp: time });
        let num = Number(time);
        this.setState({ minSet: num });
    };

    _separator = () => {
        return <Text style={{ height: 0 }}></Text>;
    };

    _adjustType = () => {
        return {
            justifyContent: "center",
            top: 295,
            left: 140,
        };
    };

    render() {
        return (
            <View style={styles.background}>
                <Text style={styles.textStyle}>{this.state.text}</Text>
                <ModalDropdown
                    options={type} //下拉内容数组
                    style={styles.selectIcon} //按钮样式
                    dropdownStyle={[
                        styles.selectIcon,
                        { height: 32 * type.length, width: 130 },
                    ]} //下拉框样式
                    dropdownTextStyle={styles.dropdownText} //下拉框文本样式
                    renderSeparator={this._separator} //下拉框文本分隔样式
                    adjustFrame={this._adjustType} //下拉框位置
                    dropdownTextHighlightStyle={{
                        color: "rgba(42, 130, 228, 1)",
                    }} //下拉框选中颜色
                    onDropdownWillShow={() => {
                        this.setState({ typeShow: true });
                    }} //按下按钮显示按钮时触发
                    onDropdownWillHide={() =>
                        this.setState({ typeShow: false })
                    } //当下拉按钮通过触摸按钮隐藏时触发
                    onSelect={this._selectType} //当选项行与选定的index 和 value 接触时触发
                    defaultValue={"Press me to select time!"}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        this.setState({ flag: true });
                        this.props.navigation.navigate("TimerPage", {
                            timeSet: this.state.minSet,
                            second_1: 0,
                            second_2: 0,
                            tag: true,
                        });
                    }}
                >
                    <Text style={styles.buttonText}>{"Start"}</Text>
                </TouchableOpacity>
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
        paddingHorizontal: 80,
    },

    textStyle: {
        fontFamily: "sans-serif",
        fontSize: 23,
        position: "absolute",
        top: 170,
        left: 80,
        color: "white",
        textAlign: "center",
        textAlignVertical: "center",
    },

    dropdownText: {
        fontFamily: "sans-serif",
        color: "black",
    },

    button: {
        top: 105,
        borderRadius: 15,
        alignItems: "center",
        backgroundColor: "#28454B",
        padding: 10,
    },

    buttonText: {
        color: "white",
        fontFamily: "sans-serif",
    },

    selectIcon: {
        color: "white",
        position: "absolute",
        top: 270,
        left: 138,
    },
});

export default HomePage;
