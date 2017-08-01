"use strict";

var docker = require('./docker')();
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var os = require('os');
var p = require('./p');


// function getServerIp() {
//     var ifaces = os.networkInterfaces();
//     var result = '';
//     for (var dev in ifaces) {
//         var alias = 0;
//         ifaces[dev].forEach(function(details) {
//             if (details.family == 'IPv4' && details.internal === false) {
//                 result = details.address;
//                 ++alias;
//             }
//         });
//     }
//
//     return result;
// }

// 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
//socket.broadcast.emit('chat', msg);

// 메시지를 전송한 클라이언트에게만 메시지를 전송한다
// socket.emit('s2c chat', msg);

// 접속된 모든 클라이언트에게 메시지를 전송한다
// io.emit('s2c chat', msg);

// 특정 클라이언트에게만 메시지를 전송한다
// io.to(id).emit('s2c chat', data);
var serversocket = (function serversocket(socket) {
  this.socket = socket;
});


serversocket.prototype.listen = function(eventName, callback) {
    var socket =  this.socket;
    console.log(eventName);
    socket.on(eventName, function(data, fn){

      if(typeof fn === "function"){
        callback(data, fn);
      }else {
        callback(data);
      }
    });

}

serversocket.prototype.sendEvent = function(eventName, data, callback) {
    var socket =  this.socket;
    socket.emit(eventName, data, callback);
}


module.exports = serversocket;
//
// var socket = function(io) {
//
//   // connection event handler
// // connection이 수립되면 event handler function의 인자로 socket인 들어온다
//
//
// io.on('connection', function(socket) {
//   console.log('check 1', socket.connected);
//     function isFinished(){
//       socket.emit("isFinished", true);
//     }
//
//
//     function errCatch(callback){
//       callback.catch( (err) => {
//         //console.log(err);
//         console.log("error");
//         socket.emit("errCatch", err);
//       });
//       return callback;
//     }
//
//       // 접속한 클라이언트의 정보가 수신되면
//       socket.on('login', function(data) {
//
//           console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);
//
//           // socket에 클라이언트 정보를 저장한다
//           socket.name = data.name;
//           socket.userid = data.userid;
//           isFinished();
//       });
//       /////////////////////////////////////// js tree
//
//       function jstreeList(json, parentid, leafs){
//           if (json === null) {
//             // console.log("done");
//             return null;
//           }
//           if( arguments.length === 2 ){
//             var lists = [];
//           }else {
//             var lists = leafs;
//           }
//           var ID = function () {
//             return '_' + Math.random().toString(36).substr(2, 9);
//           };
//           // console.log(JSON.stringify(json));
//               var tree = function (id, text, parent, path) {
//
//               function getDepth(path) {
//                 var splitPath = path.split("/");
//
//                 return splitPath.filter((val)=>{if(val) {return val;}}).length;
//               }
//
//                 var id = null;
//                 var text = null;
//                 var parent = null;
//                 var type = null;
//                 var path = null;
//                 var depth = null;
//                 var getLeaf = function() {
//                     return { id : id, text : text, parent : parent, type : type, path : path, depth : depth};
//                 }
//                 var setLeaf = function(_id, _text, _parent, _type, _path) {
//                        id = _id;
//                        text = _text;
//                        parent = _parent;
//                        type = _type;
//                        path = _path;
//                        depth = getDepth(_path);
//                        return getLeaf();
//                 }
//                 var getId = function () {
//                   return id;
//                 }
//                 return { getLeaf : getLeaf, setLeaf : setLeaf ,getId : getId };
//             }();
//
//         if(parentid === null) {
//             // var splitPath = json.path.split("/").filter((val)=>{if(val) {return val;}});
//             // splitPath.pop();
//             // var parentPath = splitPath.join("/");
//             var parentPath = path.dirname(json.path);
//             var parentDir = tree.setLeaf(ID(".."), "..","#", "directory", parentPath);
//             // console.log(data.getId());
//             // console.log(parentDir);
//             var id = ID(json.name);
//             var workingDir = tree.setLeaf(id, json.name,"#", "directory", json.path);
//
//             lists.push(parentDir);
//             lists.push(workingDir);
//             var parentid = tree.getId();
//
//         }
//
//         var child = json.children;
//         if(typeof child === undefined) {
//           // console.log("no have child");
//           return null;
//         }
//
//         for(var i in child) {
//           var leaf = tree.setLeaf(ID(child[i].name), child[i].name, parentid, child[i].type , child[i].path);
//           // var leafNode = data.getLeaf();
//           if(child[i].hasOwnProperty("extension")){
//             leaf.icon = "glyphicon glyphicon-file"
//           }
//           lists.push(leaf);
//           jstreeList(child[i], tree.getId(), lists);
//
//         }
//         return lists;
//       }
//
//       /////////////////////////////////////// js tree
//       socket.on('dirtree', function(data, fn) {
//
//         const PATH = require('path');
//         const dirTree = require('directory-tree');
//         var tree = null;
//         console.log("path %s", data);
//         if (data == ""){
//            var home = '/home/pirate/dockerfile/';
//           //  var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
//           tree = dirTree(home, { exclude:/^\./  } );
//           // tree = dirTree(home, { exclude:/^\./ , extensions:/\W/ } ); file only
//         } else if (data  != null){
//           console.log(PATH.join(data));
//           tree = dirTree(data, { exclude:/^\./ , extensions:/\W/ } );
//         }
//         var lists = jstreeList(tree, null);
//         console.log(lists);
//         fn(lists);
//       });
//
// network(socket);
// function network(socket) {
//   socket.on('ConnectNetwork', function(data, fn) {
//     // data.forEach((data)=>{
//     //   var network = docker.getNetwork(data.Id);
//     //
//     //   network.connect({Container: t, EndpointConfig : {NetworkID : data.Id}}, (data, err) => {console.log(data); console.log(err);});
//     // })
//     console.log(data);
//     p.network.connect(data, fn);
//
//   });
//
//   socket.on('DisconnectNetwork', function(data, t) {
//     // data.forEach((data)=>{
//     //   var network = docker.getNetwork(data.Id);
//     //   network.disconnect({Container: t}, (data, err) => {console.log(data); console.log(err);});
//     // })
//   });
//
//   socket.on('CreateNetwork', function(data, fn) {
//       p.network.create(data, fn);
//   });
//
//   socket.on('RemoveNetwork', function(data, fn) {
//         p.network.remove(data, fn);
//   });
// }
//
// images(socket);
// function images(socket){
//   socket.on("SearchImages", function(data, fn){
//     p.image.search(data, fn);
//
//   });
//
//
//   socket.on("PullImages", function(data, fn) {
//     console.log(data);
//     data.forEach( (images) => {
//       p.image.create({ "fromImage" : images.name , "tag" : "latest"},
//       function(err, stream) {
//
//         if (err) return fn(err);
//
//         docker.modem.followProgress(stream, onFinished, onProgress);
//
//          function onFinished(err, output) {
//            console.log("onFinished");
//            socket.emit("progress", true);
//
//          }
//          function onProgress(event) {
//               socket.emit("progress", event);
//           }
//       });
//     });
//   });
//   socket.on("RemoveImages", function(data, fn) {
//     p.image.remove(data, fn);
//   });
// }
//
//

// }
//
// dockerfile(socket);
// function dockerfile(socket){
//   socket.on("ReadFile", function(data, fn){
//     var readFilePath = path.join(data);
//     fs.readFile(readFilePath, 'utf8', (err, data) => {
//        if (err) throw fn(err);
//        fn(data);
//      });
//   });
//
//   socket.on("CreateFile", function(data, fn){
//
//    var jsonPath = path.join(data.path, data.name);
//
//     fs.writeFile(jsonPath, data.context, 'utf8', function(err) {
//         console.log('비동기적 파일 쓰기 완료');
//         fn(true);
//     });
//
//   });
//   socket.on("UpdateFile", function(data, fn){
//
//    var jsonPath = path.join(data.path, data.name);
//
//     fs.writeFile(jsonPath, data.context, 'utf8', function(err) {
//         console.log('비동기적 파일 쓰기 완료');
//         fn(true);
//     });
//
//   });
// var rmdir = function(dir) {
// 	var list = fs.readdirSync(dir);
// 	for(var i = 0; i < list.length; i++) {
// 		var filename = path.join(dir, list[i]);
// 		var stat = fs.statSync(filename);
//
// 		if(filename == "." || filename == "..") {
// 			// pass these files
// 		} else if(stat.isDirectory()) {
// 			// rmdir recursively
// 			rmdir(filename);
// 		} else {
// 			// rm fiilename
// 			fs.unlinkSync(filename);
// 		}
// 	}
// 	fs.rmdirSync(dir);
// };
//   socket.on("RemoveFile", function(data, fn){
//     var jsonPath = path.join(data.path);
//       if(data.type === "file"){
//         fs.unlink(jsonPath);
//       }else if(data.type === "directory"){
//         rmdir(jsonPath);
//       }
//       fn(true);
//   });
//
//   socket.on("build", (file, fn)=>{
//     console.log("build");
//     console.log(file);
//     var dirname = path.join(file);
//     docker.buildImage({
//               context: dirname,
//               src: [file.name]
//             }, {
//               t: 'imgcwd'
//             }, function(error, output) {
//               if (error) {
//                 return console.error(error);
//               }
//               output.pipe(process.stdout);
//         });
//       fn(true);
//   });
// }
//
// volume(socket);
// function volume(socket){
//   socket.on("CreateVolume", function(data, fn){
//       console.log(data);
//       p.volume.create(data, fn);
//   });
//
//   socket.on("RemoveVolume", function(data, fn){
//     p.volume.remove(data, fn);
//     // console.log(data);
//   });
//
// }
//
// socket.on("swarmInit", function(port){
//
//
//   // console.log(getServerIp());
//   // var ip = getServerIp();
//   var opts = {
//     "ListenAddr" :   "eth0:" + "2377",
//     "AdvertiseAddr" : "eth0:" + port,
//     "ForceNewCluster" : true
//   };
//   docker.swarmInit(opts);
// });
//
// socket.on("swarmLeave", function(data){
//   console.log(data);
//   docker.swarmLeave({force : data});
// });
//
// socket.on("sshConnection", function(data){
//       var privateKey = fs.readFileSync('../../.ssh/id_rsa', "utf8");
//       var opts = data;
//       opts.key = privateKey;
//       // console.log(opts);
//        console.log(opts);
//
//       var ssh = require('./ssh')(opts);
//       var cmd = "docker"
//       // var args = {
//       //   "token_manager" : "swarm join-token -q manager",
//       //   "token_worker" : "swarm join-token -q worker",
//       //   "join_manager" : "swarm join --token " + token + " " + getServerIp() + ":2377",
//       //   "join_worker" : "swarm join --token " + token + " " + getServerIp() + ":2377"
//       // }
//       var join = "swarm join --token " + opts.token +" " +  "192.168.0.108" + ":2377"
//
//
//       ssh.exec(cmd, {
//             args : [join],
//             out: function(stdout) {
//               console.log(stdout);
//               ssh.end();
//             },
//             err : (err) =>{
//               console.log(err);
//               ssh.end();
//             }
//         }).start();
//
//
// });
//
// socket.on("CreateService", function(data){
//   console.log(data);
//   docker.createService(data).catch((err)=>{
//     console.log(err);
//   });
//
// });
//
// socket.on("RemoveService", function(data){
//
//   data.forEach((data)=>{
//     console.log(data.ID);
//     var service = docker.getService(data.ID);
//     service.remove().catch((err)=>{
//       console.log(err);
//     });
//   });
//
//
// });
// function getSwarmToken () {
//   var p = new Promise(function (resolve, reject) {
//     docker.swarmInspect().then((data) =>{
//     console.log(data);
//     resolve(data);
//     })
//   });
//   return p;
// }
//
// function getSwarmPort () {
//   var p = new Promise(function (resolve, reject) {
//     docker.swarmInspect().then((data) =>{
//     // console.log(data);
//     resolve(data);
//     })
//   });
//   return p;
// }
//
// socket.on("StartNode", function(node){
//   node.forEach((data)=>{
//     var role = data.Spec.Role;
//     var token = getSwarmToken();
//     token.then((data)=>{
//
//       var joinToken = "";
//       if(role =="worker") {
//         joinToken = (data.JoinTokens.Worker);
//       } else if (role == "manager") {
//         joinToken = (data.JoinTokens.Manager);
//       }
//       // resolve(joinToken);
//       var leave = "docker swarm leave;"
//       var join = "docker swarm join --token " + joinToken +" " +  "192.168.0.108" + ":2377"
//       console.log(join);
//       // console.log(ssh);
//       ssh.exec(leave, {
//         args : [join],
//         out: function(stdout) {
//           console.log(stdout);
//           ssh.end();
//         },
//         err : (err) =>{
//           console.log(err);
//           ssh.end();
//         }
//       }).start();
//     });
//     var node = docker.getNode(data.ID);
//     node.remove().catch((err)=>{
//       console.log(err);
//     });
//     // var hostname = os.hostname();
//     // var node = docker.getNode(hostname);
//     // node.inspect().then((data)=> {
//     //   var addr = data.ManagerStatus.Addr;
//     //   // console.log(data);
//     // });
//     var privateKey = fs.readFileSync('../../.ssh/id_rsa', "utf8");
//     var opts = {
//       "host" : data.Status.Addr,
//       "user" : "pirate",
//       "port" : "22",
//       "key" : privateKey
//     }  ;
//     // opts.key = privateKey;
//     var ssh = require('./ssh')(opts);
//
//
//   });
// });
//
// socket.on("RemoveNode", function(data){
//   data.forEach((data)=>{
//     var node = docker.getNode(data.ID);
//     node.remove({force: true}).catch((err)=>{
//       console.log(err);
//     });
//   });
// });
//
// socket.on("UpdateNode", function(node, json){
//
//   node.forEach((data)=>{
//     var node = docker.getNode(data.ID);
//     var opts = {
//       "id" : data.ID,
//       "version" : data.Version.Index,
//       "Role" : json.Role,
//       "Availability" : json.Availability
//     };
//
//     // console.log(data);
//     console.log(opts);
//     node.update(opts).catch((err)=>{
//       console.log(err);
//     });
//   });
// });
//
//
// // force client disconnect from server
//   socket.on('forceDisconnect', function() {
//     socket.disconnect();
//   })
//
//   socket.on('disconnect', function() {
//     console.log('user disconnected: ' + socket.name);
//   });
// /////////////////////////////////////
//
// var shell = spawn('/bin/bash');
// var stdin = shell.stdin;
//
//  shell.on('exit', function (c, s){
//    console.log(c);
//    console.log(s);
//  });
//
//   shell.on('close', function (c, s){
//     console.log("close");
//     console.log(c);
//   });
//
//  shell['stdout'].setEncoding('ascii');
//  shell['stdout'].on('data', function(data) {
//    console.log("stdout");
//    console.log(data);
//    socket.emit('stdout', data);
//  });
//
//  shell['stderr'].setEncoding('ascii');
//  shell['stderr'].on('data', function(data) {
//    console.log(data);
//    socket.emit('stderr', data);
//  });
//
//
//  socket.on('stdin', function(command) {
//    console.log("stdin");
//    console.log(command);
//
//    stdin.write(command+"\n") || socket.emit('disable');
//  });
//
//  stdin.on('drain', function() {
//    socket.emit('enable');
//  });
//
//  stdin.on('error', function(exception) {
//    socket.emit('error', String(exception));
//  });
//
//
// /////////////////////////////////////
//
//   });
// };
// module.exports = socket;
