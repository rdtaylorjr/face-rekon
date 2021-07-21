var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/*
 * Copyright 2017-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
import { ConsoleLogger as Logger, Hub, Credentials, Parser, getAmplifyUserAgent } from '@aws-amplify/core';
import { S3Client, GetObjectCommand, DeleteObjectCommand, ListObjectsCommand, CopyObjectCommand, } from '@aws-sdk/client-s3';
import { formatUrl } from '@aws-sdk/util-format-url';
import { createRequest } from '@aws-sdk/util-create-request';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { AxiosHttpHandler, SEND_DOWNLOAD_PROGRESS_EVENT, SEND_UPLOAD_PROGRESS_EVENT, } from './axios-http-handler';
import { StorageErrorStrings } from '../common/StorageErrorStrings';
import { AWSS3ProviderManagedUpload } from './AWSS3ProviderManagedUpload';
import * as events from 'events';
var logger = new Logger('AWSS3Provider');
var AMPLIFY_SYMBOL = (typeof Symbol !== 'undefined' && typeof Symbol.for === 'function'
    ? Symbol.for('amplify_default')
    : '@@amplify_default');
var SET_CONTENT_LENGTH_HEADER = 'contentLengthMiddleware';
var DEFAULT_STORAGE_LEVEL = 'public';
var dispatchStorageEvent = function (track, event, attrs, metrics, message) {
    if (track) {
        var data = { attrs: attrs };
        if (metrics) {
            data['metrics'] = metrics;
        }
        Hub.dispatch('storage', {
            event: event,
            data: data,
            message: message,
        }, 'Storage', AMPLIFY_SYMBOL);
    }
};
var localTestingStorageEndpoint = 'http://localhost:20005';
/**
 * Provide storage methods to use AWS S3
 */
var AWSS3Provider = /** @class */ (function () {
    /**
     * Initialize Storage with AWS configurations
     * @param {Object} config - Configuration object for storage
     */
    function AWSS3Provider(config) {
        this._config = config ? config : {};
        logger.debug('Storage Options', this._config);
    }
    /**
     * get the category of the plugin
     */
    AWSS3Provider.prototype.getCategory = function () {
        return AWSS3Provider.CATEGORY;
    };
    /**
     * get provider name of the plugin
     */
    AWSS3Provider.prototype.getProviderName = function () {
        return AWSS3Provider.PROVIDER_NAME;
    };
    /**
     * Configure Storage part with aws configuration
     * @param {Object} config - Configuration of the Storage
     * @return {Object} - Current configuration
     */
    AWSS3Provider.prototype.configure = function (config) {
        logger.debug('configure Storage', config);
        if (!config)
            return this._config;
        var amplifyConfig = Parser.parseMobilehubConfig(config);
        this._config = Object.assign({}, this._config, amplifyConfig.Storage);
        if (!this._config.bucket) {
            logger.debug('Do not have bucket yet');
        }
        return this._config;
    };
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
    AWSS3Provider.prototype.copy = function (src, dest, config) {
        return __awaiter(this, void 0, void 0, function () {
            var credentialsOK, opt, acl, bucket, cacheControl, expires, track, serverSideEncryption, SSECustomerAlgorithm, SSECustomerKey, SSECustomerKeyMD5, SSEKMSKeyId, _a, srcLevel, srcIdentityId, srcKey, _b, destLevel, destKey, srcPrefix, destPrefix, finalSrcKey, finalDestKey, params, s3, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._ensureCredentials()];
                    case 1:
                        credentialsOK = _c.sent();
                        if (!credentialsOK) {
                            return [2 /*return*/, Promise.reject(new Error(StorageErrorStrings.NO_CREDENTIALS))];
                        }
                        opt = Object.assign({}, this._config, config);
                        acl = opt.acl, bucket = opt.bucket, cacheControl = opt.cacheControl, expires = opt.expires, track = opt.track, serverSideEncryption = opt.serverSideEncryption, SSECustomerAlgorithm = opt.SSECustomerAlgorithm, SSECustomerKey = opt.SSECustomerKey, SSECustomerKeyMD5 = opt.SSECustomerKeyMD5, SSEKMSKeyId = opt.SSEKMSKeyId;
                        _a = src.level, srcLevel = _a === void 0 ? DEFAULT_STORAGE_LEVEL : _a, srcIdentityId = src.identityId, srcKey = src.key;
                        _b = dest.level, destLevel = _b === void 0 ? DEFAULT_STORAGE_LEVEL : _b, destKey = dest.key;
                        if (!srcKey || typeof srcKey !== 'string') {
                            throw new Error(StorageErrorStrings.NO_SRC_KEY);
                        }
                        if (!destKey || typeof destKey !== 'string') {
                            throw new Error(StorageErrorStrings.NO_DEST_KEY);
                        }
                        if (srcLevel !== 'protected' && srcIdentityId) {
                            logger.warn("You may copy files from another user if the source level is \"protected\", currently it's " + srcLevel);
                        }
                        srcPrefix = this._prefix(__assign(__assign(__assign({}, opt), { level: srcLevel }), (srcIdentityId && { identityId: srcIdentityId })));
                        destPrefix = this._prefix(__assign(__assign({}, opt), { level: destLevel }));
                        finalSrcKey = bucket + "/" + srcPrefix + srcKey;
                        finalDestKey = "" + destPrefix + destKey;
                        logger.debug("copying " + finalSrcKey + " to " + finalDestKey);
                        params = {
                            Bucket: bucket,
                            CopySource: finalSrcKey,
                            Key: finalDestKey,
                            // Copies over metadata like contentType as well
                            MetadataDirective: 'COPY',
                        };
                        if (cacheControl)
                            params.CacheControl = cacheControl;
                        if (expires)
                            params.Expires = expires;
                        if (serverSideEncryption) {
                            params.ServerSideEncryption = serverSideEncryption;
                        }
                        if (SSECustomerAlgorithm) {
                            params.SSECustomerAlgorithm = SSECustomerAlgorithm;
                        }
                        if (SSECustomerKey) {
                            params.SSECustomerKey = SSECustomerKey;
                        }
                        if (SSECustomerKeyMD5) {
                            params.SSECustomerKeyMD5 = SSECustomerKeyMD5;
                        }
                        if (SSEKMSKeyId) {
                            params.SSEKMSKeyId = SSEKMSKeyId;
                        }
                        if (acl)
                            params.ACL = acl;
                        s3 = this._createNewS3Client(opt);
                        s3.middlewareStack.remove(SET_CONTENT_LENGTH_HEADER);
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, s3.send(new CopyObjectCommand(params))];
                    case 3:
                        _c.sent();
                        dispatchStorageEvent(track, 'copy', {
                            method: 'copy',
                            result: 'success',
                        }, null, "Copy success from " + srcKey + " to " + destKey);
                        return [2 /*return*/, {
                                key: destKey,
                            }];
                    case 4:
                        error_1 = _c.sent();
                        dispatchStorageEvent(track, 'copy', {
                            method: 'copy',
                            result: 'failed',
                        }, null, "Copy failed from " + srcKey + " to " + destKey);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a presigned URL of the file or the object data when download:true
     *
     * @param {string} key - key of the object
     * @param {Object} [config] - { level : private|protected|public, download: true|false }
     * @return - A promise resolves to Amazon S3 presigned URL on success
     */
    AWSS3Provider.prototype.get = function (key, config) {
        return __awaiter(this, void 0, void 0, function () {
            var credentialsOK, opt, bucket, download, cacheControl, contentDisposition, contentEncoding, contentLanguage, contentType, expires, track, progressCallback, prefix, final_key, emitter, s3, params, getObjectCommand, response, error_2, signer, request, url, _a, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._ensureCredentials()];
                    case 1:
                        credentialsOK = _b.sent();
                        if (!credentialsOK) {
                            return [2 /*return*/, Promise.reject(StorageErrorStrings.NO_CREDENTIALS)];
                        }
                        opt = Object.assign({}, this._config, config);
                        bucket = opt.bucket, download = opt.download, cacheControl = opt.cacheControl, contentDisposition = opt.contentDisposition, contentEncoding = opt.contentEncoding, contentLanguage = opt.contentLanguage, contentType = opt.contentType, expires = opt.expires, track = opt.track, progressCallback = opt.progressCallback;
                        prefix = this._prefix(opt);
                        final_key = prefix + key;
                        emitter = new events.EventEmitter();
                        s3 = this._createNewS3Client(opt, emitter);
                        logger.debug('get ' + key + ' from ' + final_key);
                        params = {
                            Bucket: bucket,
                            Key: final_key,
                        };
                        // See: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
                        if (cacheControl)
                            params.ResponseCacheControl = cacheControl;
                        if (contentDisposition)
                            params.ResponseContentDisposition = contentDisposition;
                        if (contentEncoding)
                            params.ResponseContentEncoding = contentEncoding;
                        if (contentLanguage)
                            params.ResponseContentLanguage = contentLanguage;
                        if (contentType)
                            params.ResponseContentType = contentType;
                        if (!(download === true)) return [3 /*break*/, 5];
                        getObjectCommand = new GetObjectCommand(params);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        if (progressCallback) {
                            if (typeof progressCallback === 'function') {
                                emitter.on(SEND_DOWNLOAD_PROGRESS_EVENT, function (progress) {
                                    progressCallback(progress);
                                });
                            }
                            else {
                                logger.warn('progressCallback should be a function, not a ' +
                                    typeof progressCallback);
                            }
                        }
                        return [4 /*yield*/, s3.send(getObjectCommand)];
                    case 3:
                        response = _b.sent();
                        emitter.removeAllListeners(SEND_DOWNLOAD_PROGRESS_EVENT);
                        dispatchStorageEvent(track, 'download', { method: 'get', result: 'success' }, {
                            fileSize: Number(response.Body['size'] || response.Body['length']),
                        }, "Download success for " + key);
                        return [2 /*return*/, response];
                    case 4:
                        error_2 = _b.sent();
                        dispatchStorageEvent(track, 'download', {
                            method: 'get',
                            result: 'failed',
                        }, null, "Download failed with " + error_2.message);
                        throw error_2;
                    case 5:
                        params.Expires = expires || 900; // Default is 15 mins as defined in V2 AWS SDK
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 9, , 10]);
                        signer = new S3RequestPresigner(__assign({}, s3.config));
                        return [4 /*yield*/, createRequest(s3, new GetObjectCommand(params))];
                    case 7:
                        request = _b.sent();
                        _a = formatUrl;
                        return [4 /*yield*/, signer.presign(request, { expiresIn: params.Expires })];
                    case 8:
                        url = _a.apply(void 0, [(_b.sent())]);
                        dispatchStorageEvent(track, 'getSignedUrl', { method: 'get', result: 'success' }, null, "Signed URL: " + url);
                        return [2 /*return*/, url];
                    case 9:
                        error_3 = _b.sent();
                        logger.warn('get signed url error', error_3);
                        dispatchStorageEvent(track, 'getSignedUrl', { method: 'get', result: 'failed' }, null, "Could not get a signed URL for " + key);
                        throw error_3;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Put a file in S3 bucket specified to configure method
     * @param {string} key - key of the object
     * @param {Object} object - File to be put in Amazon S3 bucket
     * @param {Object} [config] - { level : private|protected|public, contentType: MIME Types,
     *  progressCallback: function }
     * @return - promise resolves to object on success
     */
    AWSS3Provider.prototype.put = function (key, object, config) {
        return __awaiter(this, void 0, void 0, function () {
            var credentialsOK, opt, bucket, track, progressCallback, contentType, contentDisposition, contentEncoding, cacheControl, expires, metadata, tagging, acl, serverSideEncryption, SSECustomerAlgorithm, SSECustomerKey, SSECustomerKeyMD5, SSEKMSKeyId, type, prefix, final_key, params, emitter, uploader, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ensureCredentials()];
                    case 1:
                        credentialsOK = _a.sent();
                        if (!credentialsOK) {
                            return [2 /*return*/, Promise.reject(StorageErrorStrings.NO_CREDENTIALS)];
                        }
                        opt = Object.assign({}, this._config, config);
                        bucket = opt.bucket, track = opt.track, progressCallback = opt.progressCallback;
                        contentType = opt.contentType, contentDisposition = opt.contentDisposition, contentEncoding = opt.contentEncoding, cacheControl = opt.cacheControl, expires = opt.expires, metadata = opt.metadata, tagging = opt.tagging, acl = opt.acl;
                        serverSideEncryption = opt.serverSideEncryption, SSECustomerAlgorithm = opt.SSECustomerAlgorithm, SSECustomerKey = opt.SSECustomerKey, SSECustomerKeyMD5 = opt.SSECustomerKeyMD5, SSEKMSKeyId = opt.SSEKMSKeyId;
                        type = contentType ? contentType : 'binary/octet-stream';
                        prefix = this._prefix(opt);
                        final_key = prefix + key;
                        logger.debug('put ' + key + ' to ' + final_key);
                        params = {
                            Bucket: bucket,
                            Key: final_key,
                            Body: object,
                            ContentType: type,
                        };
                        if (cacheControl) {
                            params.CacheControl = cacheControl;
                        }
                        if (contentDisposition) {
                            params.ContentDisposition = contentDisposition;
                        }
                        if (contentEncoding) {
                            params.ContentEncoding = contentEncoding;
                        }
                        if (expires) {
                            params.Expires = expires;
                        }
                        if (metadata) {
                            params.Metadata = metadata;
                        }
                        if (tagging) {
                            params.Tagging = tagging;
                        }
                        if (serverSideEncryption) {
                            params.ServerSideEncryption = serverSideEncryption;
                            if (SSECustomerAlgorithm) {
                                params.SSECustomerAlgorithm = SSECustomerAlgorithm;
                            }
                            if (SSECustomerKey) {
                                params.SSECustomerKey = SSECustomerKey;
                            }
                            if (SSECustomerKeyMD5) {
                                params.SSECustomerKeyMD5 = SSECustomerKeyMD5;
                            }
                            if (SSEKMSKeyId) {
                                params.SSEKMSKeyId = SSEKMSKeyId;
                            }
                        }
                        emitter = new events.EventEmitter();
                        uploader = new AWSS3ProviderManagedUpload(params, opt, emitter);
                        if (acl) {
                            params.ACL = acl;
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        if (progressCallback) {
                            if (typeof progressCallback === 'function') {
                                emitter.on(SEND_UPLOAD_PROGRESS_EVENT, function (progress) {
                                    progressCallback(progress);
                                });
                            }
                            else {
                                logger.warn('progressCallback should be a function, not a ' + typeof progressCallback);
                            }
                        }
                        return [4 /*yield*/, uploader.upload()];
                    case 3:
                        response = _a.sent();
                        logger.debug('upload result', response);
                        dispatchStorageEvent(track, 'upload', { method: 'put', result: 'success' }, null, "Upload success for " + key);
                        return [2 /*return*/, {
                                key: key,
                            }];
                    case 4:
                        error_4 = _a.sent();
                        logger.warn('error uploading', error_4);
                        dispatchStorageEvent(track, 'upload', { method: 'put', result: 'failed' }, null, "Error uploading " + key);
                        throw error_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove the object for specified key
     * @param {string} key - key of the object
     * @param {Object} [config] - { level : private|protected|public }
     * @return - Promise resolves upon successful removal of the object
     */
    AWSS3Provider.prototype.remove = function (key, config) {
        return __awaiter(this, void 0, void 0, function () {
            var credentialsOK, opt, bucket, track, prefix, final_key, s3, params, deleteObjectCommand, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ensureCredentials()];
                    case 1:
                        credentialsOK = _a.sent();
                        if (!credentialsOK) {
                            return [2 /*return*/, Promise.reject(StorageErrorStrings.NO_CREDENTIALS)];
                        }
                        opt = Object.assign({}, this._config, config);
                        bucket = opt.bucket, track = opt.track;
                        prefix = this._prefix(opt);
                        final_key = prefix + key;
                        s3 = this._createNewS3Client(opt);
                        logger.debug('remove ' + key + ' from ' + final_key);
                        params = {
                            Bucket: bucket,
                            Key: final_key,
                        };
                        deleteObjectCommand = new DeleteObjectCommand(params);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, s3.send(deleteObjectCommand)];
                    case 3:
                        response = _a.sent();
                        dispatchStorageEvent(track, 'delete', { method: 'remove', result: 'success' }, null, "Deleted " + key + " successfully");
                        return [2 /*return*/, response];
                    case 4:
                        error_5 = _a.sent();
                        dispatchStorageEvent(track, 'delete', { method: 'remove', result: 'failed' }, null, "Deletion of " + key + " failed with " + error_5);
                        throw error_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List bucket objects relative to the level and prefix specified
     * @param {string} path - the path that contains objects
     * @param {Object} [config] - { level : private|protected|public }
     * @return - Promise resolves to list of keys for all objects in path
     */
    AWSS3Provider.prototype.list = function (path, config) {
        return __awaiter(this, void 0, void 0, function () {
            var credentialsOK, opt, bucket, track, maxKeys, prefix, final_path, s3, params, listObjectsCommand, response, list, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ensureCredentials()];
                    case 1:
                        credentialsOK = _a.sent();
                        if (!credentialsOK) {
                            return [2 /*return*/, Promise.reject(StorageErrorStrings.NO_CREDENTIALS)];
                        }
                        opt = Object.assign({}, this._config, config);
                        bucket = opt.bucket, track = opt.track, maxKeys = opt.maxKeys;
                        prefix = this._prefix(opt);
                        final_path = prefix + path;
                        s3 = this._createNewS3Client(opt);
                        logger.debug('list ' + path + ' from ' + final_path);
                        params = {
                            Bucket: bucket,
                            Prefix: final_path,
                            MaxKeys: maxKeys,
                        };
                        listObjectsCommand = new ListObjectsCommand(params);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, s3.send(listObjectsCommand)];
                    case 3:
                        response = _a.sent();
                        list = [];
                        if (response && response.Contents) {
                            list = response.Contents.map(function (item) {
                                return {
                                    key: item.Key.substr(prefix.length),
                                    eTag: item.ETag,
                                    lastModified: item.LastModified,
                                    size: item.Size,
                                };
                            });
                        }
                        dispatchStorageEvent(track, 'list', { method: 'list', result: 'success' }, null, list.length + " items returned from list operation");
                        logger.debug('list', list);
                        return [2 /*return*/, list];
                    case 4:
                        error_6 = _a.sent();
                        logger.warn('list error', error_6);
                        dispatchStorageEvent(track, 'list', { method: 'list', result: 'failed' }, null, "Listing items failed: " + error_6.message);
                        throw error_6;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @private
     */
    AWSS3Provider.prototype._ensureCredentials = function () {
        var _this = this;
        return Credentials.get()
            .then(function (credentials) {
            if (!credentials)
                return false;
            var cred = Credentials.shear(credentials);
            logger.debug('set credentials for storage', cred);
            _this._config.credentials = cred;
            return true;
        })
            .catch(function (error) {
            logger.warn('ensure credentials error', error);
            return false;
        });
    };
    /**
     * @private
     */
    AWSS3Provider.prototype._prefix = function (config) {
        var credentials = config.credentials, level = config.level;
        var customPrefix = config.customPrefix || {};
        var identityId = config.identityId || credentials.identityId;
        var privatePath = (customPrefix.private !== undefined ? customPrefix.private : 'private/') + identityId + '/';
        var protectedPath = (customPrefix.protected !== undefined ? customPrefix.protected : 'protected/') + identityId + '/';
        var publicPath = customPrefix.public !== undefined ? customPrefix.public : 'public/';
        switch (level) {
            case 'private':
                return privatePath;
            case 'protected':
                return protectedPath;
            default:
                return publicPath;
        }
    };
    /**
     * @private creates an S3 client with new V3 aws sdk
     */
    AWSS3Provider.prototype._createNewS3Client = function (config, emitter) {
        var region = config.region, credentials = config.credentials, cancelTokenSource = config.cancelTokenSource, dangerouslyConnectToHttpEndpointForTesting = config.dangerouslyConnectToHttpEndpointForTesting;
        var localTestingConfig = {};
        if (dangerouslyConnectToHttpEndpointForTesting) {
            localTestingConfig = {
                endpoint: localTestingStorageEndpoint,
                tls: false,
                bucketEndpoint: false,
                forcePathStyle: true,
            };
        }
        var s3client = new S3Client(__assign(__assign({ region: region,
            credentials: credentials, customUserAgent: getAmplifyUserAgent() }, localTestingConfig), { requestHandler: new AxiosHttpHandler({}, emitter, cancelTokenSource) }));
        return s3client;
    };
    AWSS3Provider.prototype._isBlob = function (x) {
        return typeof Blob !== 'undefined' && x instanceof Blob;
    };
    AWSS3Provider.CATEGORY = 'Storage';
    AWSS3Provider.PROVIDER_NAME = 'AWSS3';
    return AWSS3Provider;
}());
export { AWSS3Provider };
/**
 * @deprecated use named import
 */
export default AWSS3Provider;
//# sourceMappingURL=AWSS3Provider.js.map