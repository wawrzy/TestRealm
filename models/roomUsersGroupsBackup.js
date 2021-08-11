/*jslint bitwise: true, node: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true */
import Realm from 'realm';

export class RoomUsersGroupsBackupSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'RoomUsersGroupsBackup',
    properties: {
      room: "Room",
      roomUsersGroups: "string?"
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
