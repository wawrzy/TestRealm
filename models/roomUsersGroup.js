/*jslint bitwise: true, node: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true, laxcomma: true */

import Realm from 'realm';

export class RoomUsersGroupSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'RoomUsersGroup',
    properties: {
      name: { type: "string?", default: "" },
      room: "Room",
      users: "User[]",
      roomAttendee: "RoomAttendee"
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
