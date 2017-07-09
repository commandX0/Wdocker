function initDropdown(jsonUrl, $li, $button, attr, index, callback) {
  var hasIndex = false;
  if ( arguments.length == 5) {
    var callback = index;
    if ( typeof index == "function") {
      hasIndex = false;
    } else {
      hasIndex = true;
    }
  }
  if (arguments.length == 6) {
    var hasIndex = true;
  }
  $.getJSON(jsonUrl, function(json, textStatus) {
      json.forEach ( (data) => {
        var value = data[attr];

        if( hasIndex ) {
          value = (data[attr])[index];
        }

        $("<li><a>" +  value + "</a><li/>").appendTo('ul.dropdown-menu');
      });
  });
  changeTextDropdown($li, $button, callback);
}

function initDropdownArray(args, $li, $button, callback ){
  for (var index in args) {
      $("<li><a>" + args[index] + "</a><li/>").appendTo($li);
  }
  changeTextDropdown($li, $button, callback);
}

function changeTextDropdown ($li, $button, callback) {
  $li.on("click", "li a", function(event){

        $button.text($(this).text());
        if( typeof callback == "function") {
          callback($(".jsonTable"), $li.find("a").text(), "success");
        }
    });
}


function hasValue (){
  var arg = arguments;
  // console.log(arguments);
  for(var i in arg) {
    // console.log(arg[i]);
    if (arg[i] == "" || arg[i] == null || typeof arg[i] == undefined){
      return false;
    }
  }
  return true;
}


function addlist ($array, $list, id, list) {
  var rowid = "#row"+ id;
  var $row = createElement("<div/>", "row", "", "row"+ id);
  var $button = createElement("<button/>", "btn btn-danger delete", "", id);
  var $icon = createElement("<span/>", "glyphicon glyphicon-remove", "");
  var $button = $button.append($icon);


  $list.append(createRow($row, $array,  $button));
  var idArr = []
    for (var i in $array) {
        idArr.push($array[i].attr("id"));

    }
  list.push(rowdatalist(rowid, $list, idArr));
}


  function createRow($row, $array, $button){
    var data = $array;

    for (var i in data ) {
        var attr = data[i].attr("id");
        var val = data[i].val();
        if(data[i].val() == "on" || data[i].val() == "off") {
          val = (data[i].prop('checked') ? "tcp" : "udp");
        }
        $row.append(createElement("<div/>", "col-sm-2 " + attr, val));

        // console.log($row.attr("id"));
    }
    $row.append($button);

    return $row;
    // $row.append($e_containerPort, $e_hostPort, $button);

  }
    function rowdatalist(rowid, $list, array){
      var data = array;
      var $row = $list.find(rowid);
      // if( typeof _data == "Array") {
      var json = {};
        for (var i in data) {
          var attr = data[i];
          json[attr] =  $row.find("."+attr).text().toString();
        }
      // portlist.push({"Protocol" : "tcp", "containerPort" :  containerPort, "hostPort" : hostPort});
      // console.log(portlist);
      return json;

    }

function clickDeleteList($list){
      $list.on('click', 'button', function(e){
      e.preventDefault();

      var id = "#row" + $(this).attr("id");

      $(id).fadeOut("slow");
    });
}

function containerDefaultSettings() {
  return {
    "Image" : "",
    "name" : "",
    "AttachStdin": false,
    "AttachStdout": true,
    "AttachStderr": true,
    "ExposedPorts": { },
    "Tty": false,
    "Cmd": [  ],
    "OpenStdin": true,
    "StdinOnce": false,
     "HostConfig" : {
       "PortBindings" : {}
     }
  }
}

function networkDefaultSettings() {
  return {
    "Name" : "" ,
    "Driver": "" ,
    "Internal": false,
    "Ingress" : false,
    "Attachable" : false,
    "IPAM" : {
      // "Config": [
      //       {
      //           // "Subnet" : "",
      //           // "IPRange" : "",
      //           // "Gateway" : ""
      //       }
      //     ]
          // ,
          "Options" : {
            // "parent" : "wlan0"
          }
        },
    "Options": {
              "com.docker.network.bridge.default_bridge": "false",
              "com.docker.network.bridge.enable_icc": "true",
              "com.docker.network.bridge.enable_ip_masquerade": "true",
              // "com.docker.network.bridge.host_binding_ipv4": "192.168.0.8",
              // "com.docker.network.bridge.name": "k",
              "com.docker.network.driver.mtu": "1500"
            }
  }
}

function imageDefaultSettings() {
  return {
    "term" : "",
    "limit" : "",
    "filters" : {
      "is-automated" : [],
      "is-official": [],
      "stars" : ["0"]
    }
  };
}

function serviceDefaultSettings() {
  return  {
    "Name" : "",
    "TaskTemplate" : {
      "ContainerSpec" : {
        "Image" : "",
        "Command" : [],
        "HealthCheck" : {
          "Test" : [],
          "Interval" : 30000000 ,
          "Timeout" : 300000000 , //  1000000 = 1ms
          "Retries" : 3,
          "StartPeriod" : 10000000
        }
      }
    },
    "Mode": {
        "Replicated": {
          "Replicas": 4
        }
    },
    "UpdateConfig": {
          "Parallelism": 2,
          "Delay": 1000000000,
          "FailureAction": "pause",
          "Monitor": 15000000000,
          "MaxFailureRatio": 0.15
    },
    "RollbackConfig": {
          "Parallelism": 1,
          "Delay": 1000000000,
          "FailureAction": "pause",
          "Monitor": 15000000000,
          "MaxFailureRatio": 0.15
    },
    "EndpointSpec": {
          "Ports": [
                {
                "Protocol": "tcp",
                "PublishedPort": null,
                "TargetPort": null
                }
            ]
      }
  };
}
function formSubmit($form, settings, socket, callback) {
  $form.submit(function(e) {
    var opts = settings;
    // console.log($form.attr("id"));
    if(!opts) {
      alert("more need arguments");
    } else {
      socket.emit($form.attr("id"), opts);
    }

    e.preventDefault();
    if(callback != null) {
      callback();
    }
  });
}

function dialogShow(_title, _message) {
    return BootstrapDialog.show({
        title: _title,
        message: _message,
        buttons: [ {
              label: 'Close',
              action: function(dialogItself){
                  dialogItself.close();
              }
          }]
    });
}

function createElement( _element, _class,  _text, _id){
  return $(_element, { class: _class, text: _text , id: _id});
}
