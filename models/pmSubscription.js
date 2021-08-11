/*jslint bitwise: true, node: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true */
import Realm from 'realm';

export class PMSubscriptionSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'PMSubscription',
    properties: {
      user: "User",
      "pm_id": "string?",
      "offer": "string?",
      "livemode": "bool?",
      "cancel_at_period_end": "bool?",
      "trial_start": "date?",
      "trial_end": "date?",
      "next_capture_at": "date?",
      "created_at": "date?",
      "updated_at": "date?",
      "canceled_at": "date?",
      "payment": "string?",
      "client": "string?",
      "app_id": "string?",
      "active": { type: "bool?", default: true }
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
