import { typedArrayToArrayBuffer } from 'utils.js';
import { flatbuffers } from 'flatbuffers.js';
import { message } from 'messages_generated.js';
import { Topo } from 'topo.js';
import { compiler } from 'compiler.js';
import { refmt } from 'refmt.js';

const { MessageType, Message } = message;

const modules = new Map();
const dependencies = new Topo();

function getCompiler() {
  // These are the non-Node things that the BuckleScript compiler looks for on global
  const global = {
    // Binary
    Float32Array,
    Float64Array,
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    // Errors
    RangeError,
    // `InternalError` doesn't exist in V8
    Error,
    // JSON
    JSON,
    // TODO: Console
  };
  compiler(global);
  return global.ocaml;
}

function runCode(code) {
  const builder = new flatbuffers.Builder(0);
  const name = builder.createString("main.js");
  const data = builder.createString(code);
  Message.startMessage(builder);
  Message.addType(builder, MessageType.Run);
  Message.addName(builder, name);
  Message.addData(builder, data);
  const msg = Message.endMessage(builder);
  builder.finish(msg);
  const ta = builder.asUint8Array();
  V8Worker2.send(typedArrayToArrayBuffer(ta));
}

function registerModule(name, code) {
  // Parse/Print here so we don't need to do a second pass upon compile
  const ocamlCode = refmt.printML(refmt.parseRE(code));
  const deps = parseDeps(ocamlCode);
  dependencies.add(name, { after: deps, group: name });
  modules.set(name, ocamlCode);
}

function compileModules() {
  const compiler = getCompiler();

  const ocamlCode = dependencies.nodes.reduce(function(outCode, moduleName) {
    const code = modules.get(moduleName);
    if (code) {
      // TODO: Is inserting this newline enough?
      return outCode + "\n" + code;
    } else {
      return outCode;
    }
  }, "");

  const res = compiler.compile_super_errors(ocamlCode);

  if (res.js_code) {
    // V8Worker2.print(res.js_code);
    runCode(res.js_code);
  } else {
    V8Worker2.print(res.js_error_msg);
  }
}

function parseDeps(ocamlCode) {
  const compiler = getCompiler();

  const deps = compiler.list_dependencies(ocamlCode);
  const trimmed = deps.slice(1);

  if (trimmed.length != 0) {
    return trimmed;
  }

  return [];
}

V8Worker2.recv(function(bytes) {
  const buf = new flatbuffers.ByteBuffer(new Uint8Array(bytes));
  const msg = Message.getRootAsMessage(buf);
  const msgType = msg.type();

  switch (msgType) {
    case MessageType.Compile: {
      return compileModules();
    }
    case MessageType.RegisterModule: {
      const name = msg.name();
      const code = msg.data();
      return registerModule(name, code);
    }
    default: {
      V8Worker2.print(`Unknown msg type`);
    }
  }
});
