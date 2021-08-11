 import React from 'react';
 import {
    View,
    Text,
  } from 'react-native';

 class Car {
    static schema = {
      name: "Car",
      properties: {
        make: "string",
        model: "string",
        miles: "int",
      },
    };

    get carName() {
      return `${this.make} ${this.model}`;
    }
}

export default class Realm extends React.Component {
   constructor(props){
     super(props);
     this.realm = null;
     this.state = { step: 'init' };
   }
 
   componentWillMount() {
        alert('WILL - SETUP');
        this.setUp();
        alert('HAS - SETUP');
        this.props.nodejs.channel.addListener(
            "realm",
            this.onCommand,
            this 
        );
        alert('SETUP');
   }
 
   componentWillUnmount() {
     if (this.onCommand) {
        this.props.nodejs.channel.removeListener("realm", this.onCommand);
     }
   }

   setUp() {
    Realm.open({
        path: "myrealm",
        schema: [Car],
    }).then((realm) => {
        this.realm = realm;
        this.setState({step: 'REALM'});
    });
   }

   onCommand(cmdStr) {
    alert('Lol');
    alert(cmdStr);
    // const parsed = JSON.parse(cmdStr);
   }
 
   render() {
       return <View><Text>{this.state.step}</Text></View>;
   }
 }
