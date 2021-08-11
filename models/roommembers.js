import Realm from 'realm';

export class RoomMembersInitialSurfacesSchema extends Realm.Object {
  static schema = {
    name: "RoomMembersInitialSurfaces",
    embedded: true,
    properties: {
      originalSurface: "Surface",
      duplicateForCurrentUser: "Surface"
    }
  }
}

export class RoomMembersSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'RoomMembers',
    properties: {
      room: "Room",
      user: "User",
      role: "string?", // { type: String, enum: ["moderator", "participant"]},
      status: "string?", // { type: String, enum: ["added", "invited", "invitation pending", "invitation declined"]},
      timestamp: { type: "string?", default: null },
      initialSurfaces: "RoomMembersInitialSurfaces[]"
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
