import Realm from 'realm';

export class DeviceToolbarPositionSchema extends Realm.Object {
  static schema = {
    name: "DeviceToolbarPosition",
    embedded: true,
    properties: {
      x: "int?",
      y: "int?"
    }
  }
}

export class DevicePointerSchema extends Realm.Object {
  static schema = {
    name: "DevicePointer",
    embedded: true,
    properties: {
      // threshold in pixels after which we detect finger movement
      movementThreshold: "int?",

      // if no finger movement (above moveThreshold) has been detected
      // for the detectStillnessThreshold milliseconds we detect that finger is still,
      // and to move again finger it needs to go more then moveThreshold
      detectStillnessThreshold: "int?"
    }
  }
}

export class DeviceSettingsSchema extends Realm.Object {
  static schema = {
    name: "DeviceSettings",
    embedded: true,
    properties: {
      toolbarPosition: "DeviceToolbarPosition",
      pointer: "DevicePointer"
    }
  }
}

export class DeviceSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'Device',
    properties: {
      name: "string?", // user can change it => it's the displayed value
      owner: "User",
      settings: "DeviceSettings"
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
