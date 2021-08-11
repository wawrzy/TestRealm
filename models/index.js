import * as ApiSchemas from './apiKey';
import * as DeviceSchemas from './device';
import * as FileSchemas from './file';
import * as FolderSchemas from './folder';
import * as UserSchemas from './user';


export const Schemas = [
    ...Object.values(ApiSchemas),
    ...Object.values(DeviceSchemas),
    ...Object.values(FileSchemas),
    ...Object.values(FolderSchemas),
    ...Object.values(UserSchemas),
];
