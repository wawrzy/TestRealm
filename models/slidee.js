/*jslint? bitwise: true, node: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true */
import Realm from 'realm';

export class SlideeSchema extends Realm.Object {
  static schema = {
    name: "Slidee",
    properties: {
      type: { type: "string?" },
      text: { type: "string?" },
      shape: { type: "string?" },
      assetUrl: { type: "string?" },
      assetFileName: { type: "string?" },
      assetSize: { type: "int?" },
      parameters: { type: "mixed?", default: {} },
      x: { type: "string?" },
      y: { type: "string?" },
      width: { type: "string?" },
      height: { type: "string?" },
      angle: { type: "string?" },
      scale: { type: "string?" },
      zIndex: { type: "string?" },
      pin: "mixed?",
      strokes: "Stroke[]",
      useSandbox: { type: "bool?" },
      isMinimized: { type: "bool?" },
      savedState: { type: "mixed?", default: {} },
      genericObjectId: { type: "objectId?" },
      verticalFaderPosition: { type: "string?" },
      horizontalFaderPosition: { type: "string?" },
      trackRotationAngle: { type: "string?" },
      muted: { type: "bool?" },
    },
  }

  constructor() {
    super();
    Object.defineProperty(this, 'id', {
      get: function () { return this._id; },
      enumerable: true,
    });
  }
};
