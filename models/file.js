import Realm from 'realm';

export class FileSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'File',
    properties: {
      user: "User",
      type: "string?", // "surface-screenshot", "wall-screenshot", "show-screenshot", "slidee-asset", "board-asset", "drive-asset"
      url: "string?",
      surface: "Surface",
      wall: "Wall",
      show: "Show",
      name: "string?",
      model: "objectId?"
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
