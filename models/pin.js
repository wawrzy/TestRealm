import Realm from 'realm';

export class PinSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'Pin',
    properties: {
      surface: "Surface",
      x: "int?",
      y: "int?",
      zIndex: "int?",
      slidees: "mixed?"
    }
  }

  constructor() {
    super();
    Object.defineProperty(this, 'id', {
      get: function () { return this._id; },
      enumerable: true,
    });
  }
}
