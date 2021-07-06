import { StorageOptions, StorageProvider, CopyObjectConfig, CopyResult, S3CopySource, S3CopyDestination } from '../types';
/**
 * Provide storage methods to use AWS S3
 */
export declare class AWSS3Provider implements StorageProvider {
    static CATEGORY: string;
    static PROVIDER_NAME: string;
    /**
     * @private
     */
    private _config;
    /**
     * Initialize Storage with AWS configurations
     * @param {Object} config - Configuration object for storage
     */
    constructor(config?: StorageOptions);
    /**
     * get the category of the plugin
     */
    getCategory(): string;
    /**
     * get provider name of the plugin
     */
    getProviderName(): string;
    /**
     * Configure Storage part with aws configuration
     * @param {Object} config - Configuration of the Storage
     * @return {Object} - Current configuration
     */
    configure(config?: any): object;
    /**
     * Copy an object from a source object to a new object within the same bucket. Can optionally copy files across
     * different level or identityId (if source object's level is 'protected').
     *
     * @async
     * @param {S3CopySource} src - Key and optionally access level and identityId of the source object.
     * @param {S3CopyDestination} dest - Key and optionally access level of the destination object.
     * @param {CopyObjectConfig} [config] - Optional configuration for s3 commands.
     * @return {Promise<CopyResult>} The key of the copied object.
     */
    copy(src: S3CopySource, dest: S3CopyDestination, config?: CopyObjectConfig): Promise<CopyResult>;
    /**
     * Get a presigned URL of the file or the object data when download:true
     *
     * @param {string} key - key of the object
     * @param {Object} [config] - { level : private|protected|public, download: true|false }
     * @return - A promise resolves to Amazon S3 presigned URL on success
     */
    get(key: string, config?: any): Promise<string | Object>;
    /**
     * Put a file in S3 bucket specified to configure method
     * @param {string} key - key of the object
     * @param {Object} object - File to be put in Amazon S3 bucket
     * @param {Object} [config] - { level : private|protected|public, contentType: MIME Types,
     *  progressCallback: function }
     * @return - promise resolves to object on success
     */
    put(key: string, object: any, config?: any): Promise<Object>;
    /**
     * Remove the object for specified key
     * @param {string} key - key of the object
     * @param {Object} [config] - { level : private|protected|public }
     * @return - Promise resolves upon successful removal of the object
     */
    remove(key: string, config?: any): Promise<any>;
    /**
     * List bucket objects relative to the level and prefix specified
     * @param {string} path - the path that contains objects
     * @param {Object} [config] - { level : private|protected|public }
     * @return - Promise resolves to list of keys for all objects in path
     */
    list(path: any, config?: any): Promise<any>;
    /**
     * @private
     */
    _ensureCredentials(): any;
    /**
     * @private
     */
    private _prefix;
    /**
     * @private creates an S3 client with new V3 aws sdk
     */
    private _createNewS3Client;
    private _isBlob;
}
/**
 * @deprecated use named import
 */
export default AWSS3Provider;
