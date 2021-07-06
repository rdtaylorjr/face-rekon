import { GraphQLError } from 'graphql/error/GraphQLError';
import { DocumentNode } from 'graphql/language/ast';
export interface GraphQLOptions {
    query: string | DocumentNode;
    variables?: object;
    authMode?: GRAPHQL_AUTH_MODE;
}
export declare enum GRAPHQL_AUTH_MODE {
    API_KEY = "API_KEY",
    AWS_IAM = "AWS_IAM",
    OPENID_CONNECT = "OPENID_CONNECT",
    AMAZON_COGNITO_USER_POOLS = "AMAZON_COGNITO_USER_POOLS"
}
export interface GraphQLResult<T = object> {
    data?: T;
    errors?: GraphQLError[];
    extensions?: {
        [key: string]: any;
    };
}
export declare enum GraphQLAuthError {
    NO_API_KEY = "No api-key configured",
    NO_CURRENT_USER = "No current user",
    NO_CREDENTIALS = "No credentials",
    NO_FEDERATED_JWT = "No federated jwt"
}
