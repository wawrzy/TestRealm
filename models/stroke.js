import Realm from 'realm';

export class StrokeSchema extends Realm.Object {
  static schema = {
    name: 'Stroke',
    properties: {
      points: { type: 'mixed?' },
      page: { type: 'int?' },
      penColor: { type: 'string?' },
      penWidth: { type: 'int?' },
      originalHeight: { type: 'string?' },
      originalWidth: { type: 'string?' },
    }
  }

  constructor() {
    super();
    Object.defineProperty(this, 'id', {
      get: function () { return this._id; },
      enumerable: true,
    });
  }
};
