import Realm from 'realm';

export class UserPermissionSchema extends Realm.Object {
  static schema = {
    name: "UserPermission",
    embedded: true,
    properties: {
      id: { type: "string" },
      value: { type: "mixed" }
    }
  }
}

export class UserSchema extends Realm.Object {
  static createdModifiedField = true

  static schema = {
    name: "User",
    properties: {
      first_name: { type: "string?" },
      last_name: { type: "string?" },
      login_name: { type: "string?" },
      profile_image: { type: "string?" },
      email: { type: "string" }, // required: true
      externalUserId: { type: "string?", 'default': null },
      timestamp: { type: "string?", 'default': null },
      deleted: { type: "bool?", 'default': false },
      ldapUser: { type: "bool?" },
      loginAD: { type: "string?", 'default': '' },
      _password: { type: "string?" },
      hashed_password: { type: "string?" },
      salt: { type: "string?" },
      isGuest: { type: "bool?", 'default': false },
      token: { type: "string?" }, // select: false
      display_name: { type: "string?" },
      last_login: { type: "date?" },
      subscription_type: { type: "string?" },
      coupon: { type: "string?" },
      pm_client: { type: "string?" },
      password_reset_token: { type: "string?" },
      organization: { type: "string?" },
      email_updated_at: { type: "date?" },
      email_activation_token: { type: "string?" },
      email_activated: { type: "bool?", 'default': false },

      // Can only have 1 user type
      userType: { type: "UserType" },

      // Multiple permissions
      permissions: "UserPermission[]",

      // Groups
      groups: "Group[]",

      // Settings
      switchSurfacePermanently: { type: "bool?", 'default': false }
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
