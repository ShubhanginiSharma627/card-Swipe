import React from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, PanResponder } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Import Expo Icons

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const Users = [
  { id: "1", color: "#99cdff" },
  { id: "2", color: "#c7ffd0" },
  { id: "3", color: "#fde295" },
  { id: "4", color: "#ff9b56" },
  { id: "5", color: "#d52d00" },
]

export default class App extends React.Component {

  constructor() {
    super()

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-30deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })

  }
  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.timing(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            });
          });
        } else if (gestureState.dx < -120) {
          Animated.timing(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            });
          });
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: true,
          }).start();
        }
      }
    })
  }

  renderUsers = () => {

    return Users.map((item, i) => {

      if (i < this.state.currentIndex) {
        return null
      }
      else if (i == this.state.currentIndex) {

        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH - 30, padding: 10, position: 'absolute', backgroundColor: item.color, borderRadius: 15 }]}>
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000, backgroundColor: "#3cb043", borderRadius: 50 }}>

              <AntDesign name="check" size={40} color="white" style={{ padding: 10, fontWeight: "900" }} />

            </Animated.View>

            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000, backgroundColor: "red", borderRadius: 50 }}>
              <AntDesign name="close" size={40} color="white" style={{ padding: 10 }} />
            </Animated.View>

          </Animated.View>
        )
      }
      else if (i === this.state.currentIndex + 1 || i === this.state.currentIndex + 2) {
        // Add margin to the top for the next two cards
        const isNextCard = i === this.state.currentIndex + 1;
        const translateY = this.position.y.interpolate({
          inputRange: [0, SCREEN_HEIGHT],
          outputRange: [0, isNextCard ? -80 : -100], // Adjust these values based on your preference
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={item.id}
            style={[
              {
                transform: [{ translateY }],
                height: i === this.state.currentIndex + 1 ? SCREEN_HEIGHT - 110 : SCREEN_HEIGHT - 100,
                width: i === this.state.currentIndex + 1 ? SCREEN_WIDTH - 50 : SCREEN_WIDTH - 70,
                padding: 10,
                position: 'absolute',
                marginLeft: i === this.state.currentIndex + 1 ? 10 : 20,
                backgroundColor: item.color,
                borderRadius: 15,
              },
            ]}
          >
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000, backgroundColor: "#3cb043", borderRadius: 50 }}>

              <AntDesign name="check" size={40} color="white" style={{ padding: 10, fontWeight: "900" }} />

            </Animated.View>

            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000, backgroundColor: "red", borderRadius: 50 }}>
              <AntDesign name="close" size={40} color="white" style={{ padding: 10 }} />
            </Animated.View>
          </Animated.View>
        );
      }
      else {
        return (
          <Animated.View
            key={item.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
              height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH - 70, padding: 10, position: 'absolute',
              backgroundColor: item.color,
              borderRadius: 15,
              marginLeft: 20
            }]}>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000, backgroundColor: "#3cb043", borderRadius: 50 }}>

              <AntDesign name="check" size={40} color="white" style={{ padding: 20 }} />

            </Animated.View>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000, backgroundColor: "red", borderRadius: 50 }}>
              <AntDesign name="close" size={40} color="white" style={{ padding: 20 }} />
            </Animated.View>

          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }}></View>
        <View style={{ flex: 1, marginHorizontal: 15 }}>{this.renderUsers()}</View>
        <View style={{ height: 60 }}></View>
      </View>
    );
  }
}
