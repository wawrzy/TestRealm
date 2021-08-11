import Realm from 'realm';

export class ApiKeySchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'ApiKey',
    properties: {
      user: "User?",
      token: "string?",
      description: "string?"
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
