import Realm from 'realm';

export class RoomGroupsPresetPayloadSchema extends Realm.Object {
  static schema = {
    name: "RoomGroupsPresetPayload",
    embedded: true,
    properties: {
      group: "RoomUsersGroup",
      user: "User"
    }
  }
}

export class RoomGroupsPresetSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'RoomGroupsPreset',
    properties: {
      room: "Room",
      name: { type: "string?" },
      payload: "RoomGroupsPresetPayload[]"
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
