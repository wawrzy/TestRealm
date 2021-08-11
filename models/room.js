/*jslint bitwise: true, node: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true, laxcomma: true */

import Realm from 'realm';

const defaultMasterSettings = {
  showMasterSettings: false,
  indexOfCurrentPredefinedConfig: 0,
  freezeAttendeesDisplay: false,
  displayMasterSurfaceOnAllDevices: false,
  forceMinimisedMode: false,

  allowAttendeesToSlideObjectsToMasterSurface: true,
  allowAttendeesToSlideObjectsBetweenThemselves: true,

  allowAttendeesSwitchToMasterSurface: true,
  allowAttendeesToModifyMasterSurface: true,
  allowAttendeesToModifyMasterSurfaceMoveObjects: true,
  allowAttendeesToModifyMasterSurfaceSlideToSelf: true,
  allowAttendeesToModifyMasterSurfaceSlideToOthers: true,
  allowAttendeesToModifyMasterSurfaceDeleteObjects: true,
  allowAttendeesToModifyMasterSurfaceDraw: true,

  allowAttendeesSwitchToOtherAttendeesSurface: true,
  allowAttendeesToModifyOtherAttendeesSurface: true,
  allowAttendeesToModifyOtherAttendeesSurfaceMoveObjects: true,
  allowAttendeesToModifyOtherAttendeesSurfaceSlideToSelf: true,
  allowAttendeesToModifyOtherAttendeesSurfaceSlideToOthers: true,
  allowAttendeesToModifyOtherAttendeesSurfaceDeleteObjects: true,
  allowAttendeesToModifyOtherAttendeesSurfaceDraw: true,

  allowAttendeesSwitchBackToTheirOwnSurface: true,
  allowAttendeesSlideObjectsFromTheirSurface: true,
  allowAttendeesSlideObjectsFromTheirSurfaceToMasterSurface: true,
  allowAttendeesSlideObjectsFromTheirSurfaceToOtherAttendee: true
}

export class RoomMasterSettingsSchema extends Realm.Object {
  static schema = {
    name: "RoomMasterSettings",
    embedded: true,
    properties: {
      showMasterSettings: { type: "bool?", 'default': false },
      indexOfCurrentPredefinedConfig: { type: "int?", 'default': 0 },
      freezeAttendeesDisplay: { type: "bool?", 'default': false },
      displayMasterSurfaceOnAllDevices: { type: "bool?", 'default': false },
      forceMinimisedMode: { type: "bool?", 'default': false },

      allowAttendeesToSlideObjectsToMasterSurface: { type: "bool?", 'default': true },
      allowAttendeesToSlideObjectsBetweenThemselves: { type: "bool?", 'default': true },

      allowAttendeesSwitchToMasterSurface: { type: "bool?", 'default': true },
      allowAttendeesToModifyMasterSurface: { type: "bool?", 'default': true },
      allowAttendeesToModifyMasterSurfaceMoveObjects: { type: "bool?", 'default': true },
      allowAttendeesToModifyMasterSurfaceSlideToSelf: { type: "bool?", 'default': true },
      allowAttendeesToModifyMasterSurfaceSlideToOthers: { type: "bool?", 'default': true },
      allowAttendeesToModifyMasterSurfaceDeleteObjects: { type: "bool?", 'default': true },
      allowAttendeesToModifyMasterSurfaceDraw: { type: "bool?", 'default': true },

      allowAttendeesSwitchToOtherAttendeesSurface: { type: "bool?", 'default': true },
      allowAttendeesToModifyOtherAttendeesSurface: { type: "bool?", 'default': true },
      allowAttendeesToModifyOtherAttendeesSurfaceMoveObjects: { type: "bool?", 'default': true },
      allowAttendeesToModifyOtherAttendeesSurfaceSlideToSelf: { type: "bool?", 'default': true },
      allowAttendeesToModifyOtherAttendeesSurfaceSlideToOthers: { type: "bool?", 'default': true },
      allowAttendeesToModifyOtherAttendeesSurfaceDeleteObjects: { type: "bool?", 'default': true },
      allowAttendeesToModifyOtherAttendeesSurfaceDraw: { type: "bool?", 'default': true },

      allowAttendeesSwitchBackToTheirOwnSurface: { type: "bool?", 'default': true },
      allowAttendeesSlideObjectsFromTheirSurface: { type: "bool?", 'default': true },
      allowAttendeesSlideObjectsFromTheirSurfaceToMasterSurface: { type: "bool?", 'default': true },
      allowAttendeesSlideObjectsFromTheirSurfaceToOtherAttendee: { type: "bool?", 'default': true }
    }
  }
}

export class RoomPermissionsSchema extends Realm.Object {
  static schema = {
    name: "RoomPermissions",
    embedded: true,
    properties: {
      objectTypes: { type: "mixed[]", 'default': [] },
      tools: { type: "mixed[]", 'default': [] }
    }
  }
}

export class RoomSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'Room',
    properties: {
      name: { type: "string?" }, // trim: true
      description: { type: "string?" },
      externalRoomId: { type: "string?", 'default': null },
      timestamp: { type: "string?", 'default': null },
      deleted: { type: "bool?", 'default': false },
      roomCode: { type: "string" }, // index: true, unique: true, partialFilterExpression:{ roomCode: {$type: "string"}}},
      owner: "User",
      allowGuests: "bool?",
      initialSurfaces: "Surface[]",
      masterRoomAttendee: "RoomAttendee",
      masterSettings: { type: "RoomMasterSettings?", default: defaultMasterSettings },
      permissions: { type: "RoomPermissions?", default: { objectTypes: [], tools: [] } },
      __noOfMembers: "mixed?",
      __noOfGuests: "mixed?",
      __invitations: "mixed?"
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
