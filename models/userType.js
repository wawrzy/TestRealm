import Realm from 'realm';

export class UserTypeSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'UserType',
    properties: {
      name: { type: "string?" },
      description: { type: "string?" },

      // Multiple permissions
      permissions: "UserPermission[]",
      initialSurfaces: "Surface[]",

      // initialBoards: "Board[]"
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
