
import Realm from 'realm';

export class GroupSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'Group',
    properties: {
      name: { type: "string?" },
      description: { type: "string?" }
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
