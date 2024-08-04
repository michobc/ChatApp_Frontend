/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v5.27.3
// source: Chat.proto


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./Chat_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.ChatServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.ChatServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Message,
 *   !proto.Empty>}
 */
const methodDescriptor_ChatService_SendMessage = new grpc.web.MethodDescriptor(
  '/ChatService/SendMessage',
  grpc.web.MethodType.UNARY,
  proto.Message,
  proto.Empty,
  /**
   * @param {!proto.Message} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Empty.deserializeBinary
);


/**
 * @param {!proto.Message} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ChatServiceClient.prototype.sendMessage =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/ChatService/SendMessage',
      request,
      metadata || {},
      methodDescriptor_ChatService_SendMessage,
      callback);
};


/**
 * @param {!proto.Message} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.Empty>}
 *     Promise that resolves to the response
 */
proto.ChatServicePromiseClient.prototype.sendMessage =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/ChatService/SendMessage',
      request,
      metadata || {},
      methodDescriptor_ChatService_SendMessage);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.ChatHistoryRequest,
 *   !proto.ChatHistoryResponse>}
 */
const methodDescriptor_ChatService_GetMessages = new grpc.web.MethodDescriptor(
  '/ChatService/GetMessages',
  grpc.web.MethodType.UNARY,
  proto.ChatHistoryRequest,
  proto.ChatHistoryResponse,
  /**
   * @param {!proto.ChatHistoryRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.ChatHistoryResponse.deserializeBinary
);


/**
 * @param {!proto.ChatHistoryRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.ChatHistoryResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ChatHistoryResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ChatServiceClient.prototype.getMessages =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/ChatService/GetMessages',
      request,
      metadata || {},
      methodDescriptor_ChatService_GetMessages,
      callback);
};


/**
 * @param {!proto.ChatHistoryRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ChatHistoryResponse>}
 *     Promise that resolves to the response
 */
proto.ChatServicePromiseClient.prototype.getMessages =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/ChatService/GetMessages',
      request,
      metadata || {},
      methodDescriptor_ChatService_GetMessages);
};


module.exports = proto;

