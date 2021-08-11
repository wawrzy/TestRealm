/*jslint bitwise: true, node: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true */
import Realm from 'realm';

export class GateOptionsTypeSchema extends Realm.Object {
  static schema = {
    name: "GateOptionsType",
    embedded: true,
    properties: {
      duplicate: { type: "bool?", 'default': false },
      fullScreen: { type: "bool?", 'default': false },
      isOpen: { type: "bool?", 'default': false }
    }
  }
}

export class RoomAttendeeLastPositionOnStripsSchema extends Realm.Object {
  static schema = {
    name: "RoomAttendeeLastPositionOnStrips",
    embedded: true,
    properties: {
      itemId: "objectId?",
      side: "string?",
      position: "int?",
      gateOptions: { type: "GateOptionsType", default: { duplicate: false, fullScreen: false, isOpen: false } }
    }
  }
}

export class RoomAttendeePropertiesSchema extends Realm.Object {
  static schema = {
    name: "RoomAttendeeProperties",
    embedded: true,
    properties: {
      roomAttendee: "objectId?",
      gateOptions: { type: "GateOptionsType", default: { duplicate: false, fullScreen: false, isOpen: false } }
    }
  }
}

export class RoomAttendeeScripsSchema extends Realm.Object {
  static schema = {
    name: "RoomAttendeeScrips",
    embedded: true,
    properties: {
      top: "RoomAttendeeProperties[]",
      right: "RoomAttendeeProperties[]",
      bottom: "RoomAttendeeProperties[]",
      left: "RoomAttendeeProperties[]",
    }
  }
}

export class RoomAttendeeSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'RoomAttendee',
    properties: {
      room: "Room",
      roomUsersGroup: "RoomUsersGroup",
      user: "User",
      device: "Device",
      lockMasterDevice: { type: "bool?", 'default': false },
      surface: "Surface",
      showAllDevices: { type: "bool?", 'default': true },
      showRoomUsersGroups: { type: "bool?", 'default': true },
      strips: "RoomAttendeeScrips",
      lastPositionOnStrips: "RoomAttendeeLastPositionOnStrips[]"
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
