import * as ApiSchemas from './apiKey';
import * as DeviceSchemas from './device';
import * as FileSchemas from './file';
import * as FolderSchemas from './folder';
import * as groupSchemas from './group';
import * as pinSchemas from './pin';
import * as pmPaymentSchemas from './pmPayment';
import * as pmSubscriptionSchemas from './pmSubscription';
import * as roomSchemas from './room';
import * as roomAttendeeSchemas from './roomAttendee';
import * as roomGroupsPresetSchemas from './roomGroupsPreset';
import * as roomInvitationSchemas from './roomInvitation';
import * as roommembersSchemas from './roommembers';
import * as roomUsersSchemas from './roomUsers';
import * as roomUsersGroupSchemas from './roomUsersGroup';
import * as roomUsersGroupsBackupSchemas from './roomUsersGroupsBackup';
import * as settingsSchemas from './settings';
import * as showSchemas from './show';
import * as slideeSchemas from './slidee';
import * as strokeSchemas from './stroke';
import * as surfaceSchemas from './surface';
import * as userTypeSchemas from './userType';
import * as userSchemas from './user';
import * as wallSchemas from './wall';


export const Schemas = [
    ...Object.values(ApiSchemas),
    ...Object.values(DeviceSchemas),
    ...Object.values(FileSchemas),
    ...Object.values(FolderSchemas),
    ...Object.values(groupSchemas),
    ...Object.values(pinSchemas),
    ...Object.values(pmPaymentSchemas),
    ...Object.values(pmSubscriptionSchemas),
    ...Object.values(roomSchemas),
    ...Object.values(roomAttendeeSchemas),
    ...Object.values(roomGroupsPresetSchemas),
    ...Object.values(roomInvitationSchemas),
    ...Object.values(roommembersSchemas),
    ...Object.values(roomUsersSchemas),
    ...Object.values(roomUsersGroupSchemas),
    ...Object.values(roomUsersGroupsBackupSchemas),
    ...Object.values(settingsSchemas),
    ...Object.values(showSchemas),
    ...Object.values(slideeSchemas),
    ...Object.values(strokeSchemas),
    ...Object.values(surfaceSchemas),
    ...Object.values(userTypeSchemas),
    ...Object.values(userSchemas),
    ...Object.values(wallSchemas),
];
