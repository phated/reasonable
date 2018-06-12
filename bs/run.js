import { typedArrayToArrayBuffer } from 'utils.js';
import { compiler as depCompiler } from 'playground-refmt.js';
import { flatbuffers } from 'flatbuffers.js';
import { message } from 'messages_generated.js';
import { Topo } from 'topo.js';
import { compiler } from 'compiler.js';
import { refmt } from 'refmt.js';

const { MessageType, Message } = message;

const modules = new Map();
const dependencies = new Topo();

function runCode(code) {
  var builder = new flatbuffers.Builder(0);
  var name = builder.createString("main.js");
  var data = builder.createString(code);
  Message.startMessage(builder);
  Message.addType(builder, MessageType.Run);
  Message.addName(builder, name);
  Message.addData(builder, data);
  var msg = Message.endMessage(builder);
  builder.finish(msg);
  var ta = builder.asUint8Array();
  V8Worker2.send(typedArrayToArrayBuffer(ta));
}

function registerModule(name, code) {
  var deps = parseDeps(code);
  dependencies.add(name, { after: deps, group: name });
  modules.set(name, code);
}

function compileModules() {
  var global = {};
  compiler(global);

  const code = dependencies.nodes.reduce(function(outCode, moduleName) {
    var code = modules.get(moduleName);
    if (code) {
      return outCode + code;
    } else {
      return outCode;
    }
  }, "");

  // TODO: Find the broken thing in jaredly's playground-refmt.js
  const ocamlCode = refmt.printML(refmt.parseRE(code));
  const res = global.ocaml.compile_super_errors(ocamlCode);

  if (res.js_code) {
    // V8Worker2.print(res.js_code);
    runCode(res.js_code);
  } else {
    V8Worker2.print(res.js_error_msg);
  }
}

function parseDeps(code) {
  var global = {};
  depCompiler(global);

  // TODO: switch on ocaml?
  // V8Worker2.print(compiler.list_dependencies(reason))
  var deps = global.ocaml.reason_list_dependencies(code);
  var trimmed = deps.slice(1);

  if (trimmed.length != 0) {
    return trimmed;
  }

  return [];
}

V8Worker2.recv(function(bytes) {
  var buf = new flatbuffers.ByteBuffer(new Uint8Array(bytes));
  var msg = Message.getRootAsMessage(buf);
  var msgType = msg.type();

  switch (msgType) {
    case MessageType.Compile: {
      return compileModules();
    }
    case MessageType.RegisterModule: {
      var name = msg.name();
      var code = msg.data();
      return registerModule(name, code);
    }
    default: {
      V8Worker2.print(`Unknown msg type`);
    }
  }
});
