/*jslint bitwise: true, node: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true */

import Realm from 'realm';

export class SurfaceGateOptionsTypeSchema extends Realm.Object {
  static schema = {
    name: "SurfaceGateOptionsType",
    embedded: true,
    properties: {
      duplicate: { type: "bool?", default: false },
      fullScreen: { type: "bool?", default: false },
      isOpen: { type: "bool?", default: false },
    }
  }
}

export class StripPositionSchema extends Realm.Object {
  static schema = {
    name: "StripPosition",
    embedded: true,
    properties: {
      surface: { type: "objectId?" },
      gateOptions: "SurfaceGateOptionsType",
    }
  }
}

export class StripsSchema extends Realm.Object {
  static schema = {
    name: "Strips",
    embedded: true,
    properties: {
      top: "StripPosition[]",
      right: "StripPosition[]",
      bottom: "StripPosition[]",
      left: "StripPosition[]",
    },
  }
}

export class LastPositionStripsSchema extends Realm.Object {
  static schema = {
    name: "LastPositionStrips",
    embedded: true,
    properties: {
      itemId: { type: "objectId" },
      side: { type: "string?" },
      position: { type: "int?" },
      gateOptions: "SurfaceGateOptionsType",
    },
  }
}

export class MinimisedModeOptionsSchema extends Realm.Object {
  static schema = {
    name: "MinimisedModeOptions",
    embedded: true,
    properties: {
      showAddButton: { type: "bool?", 'default': true },
      showStripsButton: { type: "bool?", 'default': true },
      showSwitchButton: { type: "bool?", 'default': false },
      showSettingsButton: { type: "bool?", 'default': false },
      showStrips: { type: "bool?", 'default': false },
      showToolbar: { type: "bool?", 'default': true },
    },
  }
}

export class TextSlideeOptionsSchema extends Realm.Object {
  static schema = {
    name: "TextSlideeOptions",
    embedded: true,
    properties: {
      textSize: { type: "string?", 'default': 'medium' }, // normal | medium | large
      defaultBackgroundColor: { type: "string?", 'default': '#FFFFA5' },
      showToolbar: { type: "bool?", 'default': true },
      showBackgroundColorChooser: { type: "bool?", 'default': true }
    },
  }
}

export class SurfaceSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: "Surface",
    properties: {
      // user: "User",
      snapshotOfSurface: "Surface?",
      // sharedWithUsers: "User[]",
      allowOthersToShare: { type: "bool?", default: false },
      // room: "Room",
      name: { type: "string?" }, // trim: true
      showAllSurfaces: { type: "bool?", default: true },
      strips: "Strips",
      lastPositionOnStrips: "LastPositionStrips[]",
      backgroundImageUrl: { type: 'string', 'default': 'default' },
      backgroundImagePosition: { type: "string?" },
      backgroundColor: { type: "string?" },
      slidees: "Slidee[]",
      strokes: "Stroke[]",
      undoStack: { type: "mixed?", 'default': [] },
      redoStack: { type: "mixed?", 'default': [] },
      fullScreenSlidee: { type: "objectId?" },
      masterTrackSlidee: { type: "objectId?" },
      lastViewWidth: { type: "int?" },
      lastViewHeight: { type: "int?" },
      lastPageWidth: { type: "int?" },
      lastPageHeight: { type: "int?" },
      hideToolbar: { type: "bool?", 'default': false },
      miniMode: { type: "bool?", 'default': false },
      minimisedModeOptions: {
        type: "MinimisedModeOptions?",
        default: {
          showAddButton: true,
          showStripsButton: true,
          showSwitchButton: false,
          showSettingsButton: false,
          showStrips: false,
          showToolbar: true,
        }
      },
      textSlideeOptions: {
        type: "TextSlideeOptions?",
        default: {
          textSize: 'medium', // normal | medium | large
          defaultBackgroundColor: '#FFFFA5',
          showToolbar: true,
          showBackgroundColorChooser: true,
        },
      },
      allowMultipleOpenStrips: { type: "bool?", 'default': false }
    },
  }

  constructor() {
    super();
    Object.defineProperty(this, 'id', {
      get: function () { return this._id; },
      enumerable: true,
    });
  }
}
