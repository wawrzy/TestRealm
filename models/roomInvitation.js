import Realm from 'realm';

export class RoomInvitationSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'RoomInvitation',
    properties: {
      room: "Room",
      user: "User",
      // possible values: "Invited", "Accepted", "Refused"
      status: "string?"
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
