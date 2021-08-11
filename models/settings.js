import Realm from 'realm';

export class PlatformSchema extends Realm.Object {
  static schema = {
    name: "Platform",
    embedded: true,
    properties: {
      name: { type: "string?", 'default': 'Kinaps' },
      title: { type: "string?", 'default': 'Kinaps' }
    }
  }
}

export class OrganizationSchema extends Realm.Object {
  static schema = {
    name: "Organization",
    embedded: true,
    properties: {
      name: { type: "string?" }
    }
  }
}

export class SettingsAuthSchema extends Realm.Object {
  static schema = {
    name: "SettingsAuth",
    embedded: true,
    properties: {
      user: "string?",
      pass: "string?"
    }
  }
}

export class SettingsHostSchema extends Realm.Object {
  static schema = {
    name: "SettingsHost",
    embedded: true,
    properties: {
      host: "string?",
      port: "int?",
      auth: "SettingsAuth?"
    }
  }
}

export class MailServerSchema extends Realm.Object {
  static schema = {
    name: "MailServer",
    embedded: true,
    properties: {
      host: "SettingsHost?",
      from: "string?"
    }
  }
}

export class SettingsSurfaceSchema extends Realm.Object {
  static schema = {
    name: "SettingsSurface",
    embedded: true,
    properties: {
      refreshRate: { type: "int?", 'default': 500 },
      groupingModeDetectionMinDuration: { type: "int?", 'default': 500 },
      groupingModeDetectionMaxDistance: { type: "int?", 'default': 50 },
      doubleTapDetectionMaxDistance: { type: "int?", 'default': 50 },
      doubleTapDetectionMinDuration: { type: "int?", 'default': 100 },
      doubleTapDetectionMaxDuration: { type: "int?", 'default': 300 }
    }
  }
}

export class SettingsAdSchema extends Realm.Object {
  static schema = {
    name: "SettingsAd",
    embedded: true,
    properties: {
      host: "string?",
      port: "int?",
      baseDN: "string?",
      auth: "SettingsAuth?",
      enable: "bool?"
    }
  }
}

export class SettingsRoomSchema extends Realm.Object {
  static schema = {
    name: "SettingsRoom",
    embedded: true,
    properties: {
      name: { type: "string?" },
      moderatorCanEditRoom: { type: "bool?", 'default': false }
    }
  }
}

export class SettingsWallSchema extends Realm.Object {
  static schema = {
    name: "SettingsWall",
    embedded: true,
    properties: {
      refreshRate: { type: "int?", 'default': 500 }
    }
  }
}

export class SettingsShowSchema extends Realm.Object {
  static schema = {
    name: "SettingsShow",
    embedded: true,
    properties: {
      refreshRate: { type: "int?", 'default': 500 }
    }
  }
}

export class SettingsSyncWayTriggerSchema extends Realm.Object {
  static schema = {
    name: "SettingsSyncWayTrigger",
    embedded: true,
    properties: {
      syncDay: { type: "string?", default: null },
      syncCronDate: { type: "string?", default: null },
      syncCronTime: { type: "string?", default: null },
      everyDay: { type: "bool?", default: false },
      everyWeek: { type: "bool?", default: false },
      everyMonth: { type: "bool?", default: false },
      everyYear: { type: "bool?", default: false }
    }
  }
}

export class SettingsSyncSchema extends Realm.Object {
  static schema = {
    name: "SettingsSync",
    embedded: true,
    properties: {
      userPath: { type: "string?", 'default': '' },
      organization: { type: "string?", 'default': '' },
      importUserType: "UserType",
      coursePath: { type: "string?", 'default': '' },
      userCoursePath: { type: "string?", 'default': '' },
      twoWaySync: { type: "bool?", default: false },
      syncWayTrigger: "SettingsSyncWayTrigger?"
    }
  }
}

export class SettingsSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: "Settings",
    properties: {
      allowSignUp: { type: "bool?", 'default': true },
      allowGuestLogin: { type: "bool?", 'default': true },
      allowPasswordRecovery: { type: "bool?", 'default': true },
      defaultUserTypeForRegisteredUsers: "UserType",
      defaultUserTypeForGuestUsers: "UserType",
      platform: { type: "Platform?", default: { name: 'Kinaps', title: 'Kinaps' } },
      organization: "Organization?",
      serverLocation: { type: "string?" },
      networkInterface: { type: "string?" },
      mailServer: "MailServer?",
      ad: "SettingsAd?",
      surface: {
        type: "SettingsSurface?",
        default: {
          refreshRate: 500,
          groupingModeDetectionMinDuration: 500,
          groupingModeDetectionMaxDistance: 50,
          doubleTapDetectionMaxDistance: 50,
          doubleTapDetectionMinDuration: 100,
          doubleTapDetectionMaxDuration: 300,
        },
      },
      room: { type: "SettingsRoom?", default: { moderatorCanEditRoom: false } },
      wall: { type: "SettingsWall?", default: { refreshRate: 500 } },
      show: { type: "SettingsShow?", default: { refreshRate: 500 } },
      videoConferenceHost: { type: "string?", 'default': '' },
      socketIOTransport: { type: "string?", 'default': 'auto' }, // possible values: 'auto', 'xhr-polling'
      kdsUserId: "objectId?",
      kdsDeviceId: "objectId?",
      allowDropbox: { type: "bool?", 'default': false },
      showOldInterface: { type: "bool?", 'default': false },
      syncSettings: {
        type: "SettingsSync?",
        default: {
          userPath: '',
          organization: '',
          coursePath: '',
          userCoursePath: '',
          twoWaySync: false,
          syncWayTrigger: {
            syncDay: null,
            syncCronDate: null,
            syncCronTime: null,
            everyDay: false,
            everyWeek: false,
            everyMonth: false,
            everyYear: false,
          },
        },
      },
      loadOption: { type: "int?", 'default': 0 }
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
