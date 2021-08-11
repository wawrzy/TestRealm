 import React from 'react';
 import nodejs from 'nodejs-mobile-react-native';

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
     this.realm = null
   }
 
   componentWillMount() {
    async function init() {
        await this.setUp();
        this.props.nodejs.channel.addListener(
            "realm",
            this.onCommand,
            this 
        );
    }
    init();
   }
 
   componentWillUnmount() {
     if (this.onCommand) {
        this.props.nodejs.channel.removeListener("realm", this.onCommand);
     }
   }

   async setUp() {
    this.realm = await Realm.open({
        path: "myrealm",
        schema: [Car],
    });
   }

   onCommand(cmdStr) {
    alert('Lol');
    alert(cmdStr);
    // const parsed = JSON.parse(cmdStr);
   }
 
   render() {
       return null;
   }
 }
