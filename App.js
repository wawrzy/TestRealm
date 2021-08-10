/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

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
        <Button title="Get Versions"
          onPress={() => nodejs.channel.send('versions')}
        />
        <Button title="Run sha3"
          onPress={() => nodejs.channel.send('sha3')}
        />
        <Button title="Run sqlite3"
          onPress={() => nodejs.channel.send('sqlite3')}
        />
        <Text style={styles.instructions}>
          {this.state.lastNodeMessage}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
