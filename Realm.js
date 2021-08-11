import React from 'react';
import { ObjectID } from 'bson';
import {
  View,
  Text,
} from 'react-native';
import Realm from 'realm';

import { Schemas } from './models'

export default class RealmComp extends React.Component {
  constructor(props) {
    super(props);
    this.realm = null;
    this.state = { step: 'init' };
  }

  componentWillMount() {
    this.setUp();
  }

  componentWillUnmount() {
    this.props.nodejs.channel.removeListener("realm-find", this.onFind);
    this.props.nodejs.channel.removeListener("realm-create", this.onCreate);
  }

  // PRIVATE

  getSchemas() {
    const schemas = [...Schemas]

    schemas.forEach((schema) => {
      if (!schema.schema.embedded && !schema.schema.primaryKey) {
        schema.schema.properties._id = { type: 'objectId' };
        schema.schema.primaryKey = '_id';
      }
      if (schema.createdModifiedField) {
        schema.schema.properties.created = { type: 'date?', default: null }
        schema.schema.properties.modified = { type: 'date?', default: null }
      }
    })

    return schemas;
  }

  setUp() {
    Realm.open({
      path: "myrealm",
      schema: this.getSchemas(),
    }).then((realm) => {
      this.realm = realm;

      this.setState({ step: 'initialized' });

      this.props.nodejs.channel.addListener("realm-find", this.onFind, this);
      this.props.nodejs.channel.addListener("realm-create", this.onCreate, this);
    });
  }

  schemaFromName(name) {
    return this.realm.schema.find(x => x.name === name)
  }

  // COMMANDS

  onCreate(postData) {
    alert(JSON.stringify(postData));
    const POST_DATA_ID = postData.id;
    const SCHEMA_NAME = postData.name;
    const schemaObj = postData.data;

    let createObj;

    const populatedSchemaObj = {};
    const currentSchema = this.schemaFromName(SCHEMA_NAME);

    for (objSchemaKey in schemaObj) {
      const valueIsId = ObjectID.isValid(schemaObj[objSchemaKey]);
      const property = currentSchema.properties[objSchemaKey];
      const valueType = property && property.objectType;

      if (valueType && typeof schemaObj[objSchemaKey] === 'object' && schemaObj[objSchemaKey]._id) {
        populatedSchemaObj[objSchemaKey] = this.realm.objectForPrimaryKey(valueType, new ObjectID(schemaObj[objSchemaKey]._id));
      } else if (objSchemaKey !== '_id' && valueIsId && valueType) {
        populatedSchemaObj[objSchemaKey] = this.realm.objectForPrimaryKey(
          valueType,
          new ObjectID(schemaObj[objSchemaKey]),
        );
      } else if ((!property || property.type !== 'string') && valueIsId) {
        populatedSchemaObj[objSchemaKey] = new ObjectID(schemaObj[objSchemaKey]);
      } else if (currentSchema.properties[`__JSON__${objSchemaKey}`]) {
        populatedSchemaObj[`__JSON__${objSchemaKey}`] = JSON.stringify(schemaObj[objSchemaKey] || {});
      } else {
        populatedSchemaObj[objSchemaKey] = schemaObj[objSchemaKey];
      }
    }

    if (currentSchema.properties.created) {
      populatedSchemaObj.created = populatedSchemaObj.created || new Date();
    }

    try {
      this.realm.write(() => {
        createObj = this.realm.create(SCHEMA_NAME, {
          ...populatedSchemaObj,
          _id: new ObjectID(populatedSchemaObj._id),
        });
      });
    } catch (err) {
      alert(err);
    }

    this.props.nodejs.channel.post("realm-response", { id: POST_DATA_ID, data: createObj.toJSON() });
  }

  onFind(postData) {
    alert(JSON.stringify(postData));
    const POST_DATA_ID = postData.id;
    const SCHEMA_NAME = postData.name;
    const QUERY = postData.query;
    const ARGS = postData.args || [];

    const objInst = this.realm.objects(SCHEMA_NAME);

    alert(JSON.stringify(objInst));

    if (QUERY === '') {
      this.props.nodejs.channel.post("realm-response", { id: POST_DATA_ID, data: objInst });
      return;
    }

    const filtered = objInst.filtered(QUERY, ...ARGS);

    this.props.nodejs.channel.post("realm-response", { id: POST_DATA_ID, data: filtered });
  }

  render() {
    return <View><Text>{this.state.step}</Text></View>;
  }
}
