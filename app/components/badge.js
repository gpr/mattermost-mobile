// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    PanResponder,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    ViewPropTypes
} from 'react-native';

export default class Badge extends PureComponent {
    static defaultProps = {
        extraPaddingHorizontal: 10,
        minHeight: 0,
        minWidth: 0
    };

    static propTypes = {
        count: PropTypes.number.isRequired,
        extraPaddingHorizontal: PropTypes.number,
        style: ViewPropTypes.style,
        countStyle: Text.propTypes.style,
        minHeight: PropTypes.number,
        minWidth: PropTypes.number,
        onPress: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.width = 0;
        this.mounted = false;
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onStartShouldSetResponderCapture: () => true,
            onMoveShouldSetResponderCapture: () => true,
            onResponderMove: () => false
        });
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handlePress = () => {
        if (this.props.onPress) {
            this.props.onPress();
        }
    };

    setNativeProps = (props) => {
        if (this.mounted && this.refs.badgeContainer) {
            this.refs.badgeContainer.setNativeProps(props);
        }
    };

    onLayout = (e) => {
        let width;

        if (e.nativeEvent.layout.width <= e.nativeEvent.layout.height) {
            width = e.nativeEvent.layout.height;
        } else {
            width = e.nativeEvent.layout.width + this.props.extraPaddingHorizontal;
        }
        width = Math.max(width, this.props.minWidth);
        if (this.width === width) {
            return;
        }
        this.width = width;
        const height = Math.max(e.nativeEvent.layout.height, this.props.minHeight);
        const borderRadius = height / 2;
        this.setNativeProps({
            style: {
                width,
                height,
                borderRadius
            }
        });
        setTimeout(() => {
            this.setNativeProps({
                style: {
                    opacity: 1
                }
            });
        }, 100);
    };

    renderText = () => {
        const {count} = this.props;
        let text = count.toString();
        const extra = {};
        if (count < 0) {
            text = '•';

            //the extra margin is to align to the center?
            extra.marginBottom = 1;
        }
        return (
            <Text
                style={[styles.text, this.props.countStyle, extra]}
                onLayout={this.onLayout}
            >
                {text}
            </Text>
        );
    };

    render() {
        return (
            <TouchableWithoutFeedback
                {...this.panResponder.panHandlers}
                onPress={this.handlePress}
            >
                <View
                    ref='badgeContainer'
                    style={[styles.badge, this.props.style, {opacity: 0}]}
                >
                    <View style={styles.wrapper}>
                        {this.renderText()}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    badge: {
        top: 2,
        padding: 12,
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: '#444',
        borderRadius: 20,
        position: 'absolute',
        right: 30
    },
    wrapper: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    text: {
        fontSize: 14,
        color: 'white'
    }
});
