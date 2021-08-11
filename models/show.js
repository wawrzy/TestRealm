
import Realm from 'realm';

export class ShowPresetsSchema extends Realm.Object {
  static schema = {
    name: "ShowPresets",
    embedded: true,
    properties: {
      name: "string?",
      created: "date?",
      state: "mixed?"
    }
  }
}

export class ShowEditorSettingsSchema extends Realm.Object {
  static schema = {
    name: "ShowEditorSettings",
    embedded: true,
    properties: {
      doNotUploadVideoFiles: { type: "bool?", 'default': false },
      doNotUploadAudioFiles: { type: "bool?", 'default': false },
      defaultFolderForImages: { type: "string?", 'default': 'images' },
      defaultFolderForVideos: { type: "string?", 'default': 'videos' },
      defaultFolderForAudios: { type: "string?", 'default': 'audios' }
    }
  }
}

export class LastFtpSyncSchema extends Realm.Object {
  static schema = {
    name: "LastFtpSync",
    embedded: true,
    properties: {
      startedAt: "date?",
      finishedAt: "date?",
      error: "string?",
      message: "string?"
    }
  }
}

export class FtpSyncSchema extends Realm.Object {
  static schema = {
    name: "FtpSync",
    embedded: true,
    properties: {
      host: "string?",
      port: { type: "int?", 'default': 21 },
      username: "string?",
      password: "string?",
      folder: "string?",
      page: { type: "string?", 'default': 'Main' },
      status: { type: "string?", 'default': 'idle' }, // idle, running
      pid: "int?",
      lastSync: "LastFtpSync"
    }
  }
}


export class ShowSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: "Show",
    properties: {
      user: "User",
      sharedWithUsers: "User[]",
      allowOthersToShare: { type: "bool?", 'default': false },
      name: { type: "string?" }, // trim: true
      description: { type: "string?", 'default': '' }, // trim: true
      room: "Room",
      lastPageOpened: "string?",
      ftpSync: {
        type: "FtpSync",
        default: {
          port: 21,
          page: 'Main',
          status: 'idle',
        },
      },
      editorSettings: {
        type: "ShowEditorSettings",
        default: {
          doNotUploadVideoFiles: false,
          doNotUploadAudioFiles: false,
          defaultFolderForImages: 'images',
          defaultFolderForVideos: 'videos',
          defaultFolderForAudios: 'audios',
        }
      },
      state: "mixed?",
      presets: { type: "ShowPresets[]", 'default': [] }
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
