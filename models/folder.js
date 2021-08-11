/*jslint bitwise: true, node: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true, laxcomma: true */
import Realm from 'realm';

export class FolderSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'Folder',
    properties: {
      owner: "User?",
      name: "string?",
      description: "string?",
      parent: "Folder?",
      type: "string?",
      payload: "objectId?",
      isAlias: { type: "bool?", default: false },
      aliasOwner: "User?",
      isInRoom: { type: "bool?", default: false },
      extension: "string?",
      sharedWithUsers: "User[]",
      payloadObject: { type: "mixed?" }
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
