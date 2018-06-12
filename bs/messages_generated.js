// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var message = message || {};

/**
 * @enum
 */
message.MessageType = {
  Compile: 0,
  Run: 1,
  RegisterModule: 2
};

/**
 * @constructor
 */
message.Message = function() {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  this.bb = null;

  /**
   * @type {number}
   */
  this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {message.Message}
 */
message.Message.prototype.__init = function(i, bb) {
  this.bb_pos = i;
  this.bb = bb;
  return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {message.Message=} obj
 * @returns {message.Message}
 */
message.Message.getRootAsMessage = function(bb, obj) {
  return (obj || new message.Message).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @returns {message.MessageType}
 */
message.Message.prototype.type = function() {
  var offset = this.bb.__offset(this.bb_pos, 4);
  return offset ? /** @type {message.MessageType} */ (this.bb.readInt8(this.bb_pos + offset)) : message.MessageType.Compile;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
message.Message.prototype.name = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 6);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
message.Message.prototype.data = function(optionalEncoding) {
  var offset = this.bb.__offset(this.bb_pos, 8);
  return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
message.Message.startMessage = function(builder) {
  builder.startObject(3);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {message.MessageType} type
 */
message.Message.addType = function(builder, type) {
  builder.addFieldInt8(0, type, message.MessageType.Compile);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} nameOffset
 */
message.Message.addName = function(builder, nameOffset) {
  builder.addFieldOffset(1, nameOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} dataOffset
 */
message.Message.addData = function(builder, dataOffset) {
  builder.addFieldOffset(2, dataOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
message.Message.endMessage = function(builder) {
  var offset = builder.endObject();
  return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
message.Message.finishMessageBuffer = function(builder, offset) {
  builder.finish(offset);
};

// Exports for ECMAScript6 Modules
export {message};