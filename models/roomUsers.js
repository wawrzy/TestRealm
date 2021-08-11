/*jslint bitwise: true, node: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true, laxcomma: true */
import Realm from 'realm';

export class RoomUsersSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'RoomUsers',
    properties: {
      email: { type: "string" },
      course: { type: "string" },
      rights: { type: "int?", default: 0 },
      deleted: { type: "bool?", 'default': false },
      timestamp: { type: "string?", 'default': '0' }
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
