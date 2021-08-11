
import Realm from 'realm';

export class WallEditorSettingsSchema extends Realm.Object {
  static schema = {
    name: "WallEditorSettings",
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

export class WallLastFtpSyncSchema extends Realm.Object {
  static schema = {
    name: "WallLastFtpSync",
    embedded: true,
    properties: {
      startedAt: "date?",
      finishedAt: "date?",
      error: "string?",
      message: "string?"
    }
  }
}

export class WallFtpSyncSchema extends Realm.Object {
  static schema = {
    name: "WallFtpSync",
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
      lastSync: "WallLastFtpSync"
    }
  }
}


export class WallSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: "Wall",
    properties: {
      user: "User",
      sharedWithUsers: "User[]",
      allowOthersToShare: { type: "bool?", 'default': false },
      name: { type: "string?" }, // trim: true
      description: { type: "string?", 'default': '' }, // trim: true
      room: "Room",
      lastPageOpened: "string?",
      ftpSync: {
        type: "WallFtpSync",
        default: {
          port: 21,
          page: 'Main',
          status: 'idle',
        },
      },
      editorSettings: {
        type: "WallEditorSettings",
        default: {
          doNotUploadVideoFiles: false,
          doNotUploadAudioFiles: false,
          defaultFolderForImages: 'images',
          defaultFolderForVideos: 'videos',
          defaultFolderForAudios: 'audios',
        }
      },
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
