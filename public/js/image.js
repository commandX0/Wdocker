//images.js
'use strict';

  const columns = [{
          checkbox: true,
          title: 'Check'
      },{
          field: 'RepoTags',
          title: 'RepoTags'
      }
      ,{
          field: 'Containers',
          title: 'Containers'
      }
      ,{
          field: 'Created',
          title: 'Created'
      },{
          field: 'Id',
          title: 'Id'
      },{
          field: 'Labels',
          title: 'Labels'
      },{
          field: 'ParentId',
          title: 'ParentId'
      },{
          field: 'RepoDigests',
          title: 'RepoDigests'
      },{
          field: 'SharedSize',
          title: 'SharedSize'
      },{
          field: 'Size',
          title: 'Size'
      },{
          field: 'VirtualSize',
          title: 'VirtualSize'
      }];
      const searchcolumns = [{
              checkbox: true,
              title: 'Check'
        },{
          field: 'star_count',
          title: 'star_count'
        }, {
          field: 'is_official',
          title: 'is_official'
        }, {
          field: 'name',
          title: 'name'
        }, {
          field: 'is_automated',
          title: 'is_automated'
        }, {
          field: 'description',
          title: 'description'
        }];


$(function(){

  var $all = {};
  $all.init = function(){
    $(".results").hide();
  };
  $all.form = {};
  $all.form.$form = $("#hiddenForm");
  $all.form.settingMethod = {
    get : "getImage",
    set : "setImage"
  };
  $all.form.getSettingValue = function() {
    var self = this.data ;
    return {
      "term" : self.$term.val(),
      "limit" : self.$limit.val(),
      "is-automated" : self.$is_automated.prop("checked").toString(),
      "is-official" : self.$is_official.prop("checked").toString(),
      "stars" :self.$stars.val()
    }
  };

  $all.form.create = {};
  $all.form.create.data = {
    $term : $("#term"),
    $limit : $("#limit"),
    $is_automated : $("#is_automated"),
    $is_official : $("#is_official"),
    $stars : $("#stars")
  };

  $all.form.create.$newForm =  $(".newForm");
  $all.form.create.formName = "이미지 생성";
  $all.form.create.formEvent = "SearchImages";
  $all.form.create.callback = function(data){
            var row = data ;
            $all.table.sub.$table.bootstrapTable('load', data);

            $(".results").show();
  }


  $all.form.completeEvent = function(data, callback){
    console.log(arguments);
    if(hasValue(data)){
      return callback(data.msg);
    }
  };
  $all.connect = {};
  $all.connect.dockerinfo = "image";

  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    hideColumns : ["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"],
    columns : columns,
    jsonUrl : '/myapp/image/data.json',
  };
  $all.table.sub = {
    $table : $(".dataTable"),
    columns : searchcolumns
  }
  $all.event = {};
  function clickDefault(client, eventName, table){
    return function(){
      client.sendEventTable(eventName, table);
    };
  }

  $all.event.remove = {
      $button : $(".remove"),
      eventName : "RemoveImages",
      clickEvent : clickDefault
  };
  //
  $all.completeEvent = function(data, callback){
    console.log(arguments);
    if(hasValue(data)){
      var finished = new dialog("이미지", JSON.stringify(data), $("body"));
      finished.setDefaultButton('Close[Enker]', 'btn-primary create');
      finished.show();
      callback;
    }
  };

    var main = require("./main.js");
    main.init($all);

        var client = main.getSocket();
        var dialog = main.getDialog();
        var searchTable = main.getSubTable();
        var imageTable = main.getMainTable();
        var $msgdiag = $("#msgdiag");
        $msgdiag.hide();
        $(".download").click((e)=> {
          e.preventDefault();


        client.completeEvent = function(data, callback){
             if(hasValue(data)){

                  var finished = new dialog("이미지", JSON.stringify(data), $("body"));
                  finished.setDefaultButton('Close[Enker]', 'btn-primary create');
                  finished.show();
                  callback;
              }
          }
          client.sendEventTable("PullImages", searchTable);
          var $progress = $(".progress-bar");
          $progress.css("width", '0%');
          var popup = new dialog("이미지 다운 중", $msgdiag.show(), $("body"));
          var $status = $("#status");
          client.listen("progress", (event)=> {
                if((event.status)){
                  $status.text(event.status);
                }
                if((event.progressDetail)){
                  var download = event.progressDetail;
                  if(download.current && download.total){
                    var percentage = (download.current / download.total) * 100;
                    var $progress = $(".progress");
                    if(percentage != NaN) {
                      $progress.css("width", Math.round(percentage)+ '%');
                    }
                  }
                }else if (event === true) {
                    popup.close(5000);
                    imageTable.reload();
                }
            });

            popup.show();
          });


});
