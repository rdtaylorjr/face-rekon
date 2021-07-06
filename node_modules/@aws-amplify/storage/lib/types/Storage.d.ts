/**
 * Storage instance options
 */
export interface StorageOptions {
    bucket?: string;
    region?: string;
    level?: string;
    credentials?: object;
}
export declare type StorageCopyTarget = {
    key: string;
    level?: string;
    identityId?: string;
};
export declare type StorageCopySource = StorageCopyTarget;
export declare type StorageCopyDestination = Omit<StorageCopyTarget, 'identityId'>;
