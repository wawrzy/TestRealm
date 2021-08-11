/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

import Realm from './Realm';


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = { lastNodeMessage: "No message yet." };
    this.listenerRef = null;
  }

  componentWillMount()
  {
    nodejs.start('main.js');
    this.listenerRef = ((msg) => {
      this.setState({lastNodeMessage: msg});
    });
    nodejs.channel.addListener(
      "message",
      this.listenerRef,
      this 
    );
  }

  componentWillUnmount()
  {
    if (this.listenerRef) {
      nodejs.channel.removeListener("message", this.listenerRef);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Realm nodejs={nodejs} />
        <Button title="Get Versions"
          onPress={() => nodejs.channel.send('versions')}
        />
        <Button title="Run realm"
          onPress={() => nodejs.channel.send('realm')}
        />
        <Text style={styles.instructions}>
          {this.state.lastNodeMessage}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
