/*jslint bitwise: true, node: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true */
import Realm from 'realm';

export class PMPaymentSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: 'PMPayment',
    properties: {
      user: "User",
      "pm_id": "string?",
      "type": "string?",
      "client": "string?",
      "card_type": "string?",
      "country": "string?",
      "expire_month": "int?",
      "expire_year": "int?",
      "card_holder": "string?",
      "last4": "int?",
      "created_at": "date?",
      "updated_at": "date?",
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
