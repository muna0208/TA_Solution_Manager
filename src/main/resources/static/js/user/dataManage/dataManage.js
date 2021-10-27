var $TARGET_PARENT_PATH;							//파일제어를 위한 부모 경로
var $TARGET_PATH;									//파일제어를 위한 경로
var myDropzone;

$(function(){
//	$("#jstree_demo").jstree("close_all");
	$('#jstree_demo').jstree({
		 "plugins" : ["themes","json_data","ui","crrm","cookies",/*"dnd",*/"search","types","hotkeys","contextmenu","sort"]
																 /*dnd: drag&drop plugin*/
		 ,'core' : {"check_callback": true,'data' : ''}
	 	 ,"contextmenu":{
		 	    "items": function($node) {
		 	        var tree = $("#jstree_demo").jstree(true);
		 	        
		 	        return {
		 	            "Create": {
		 	                "separator_before": false,
		 	                "separator_after": false,
		 	                "label": "추가",
		 	                "action": function (obj) {
		 	                	if($node.original.type == "folder"){
		 	                		$node = tree.create_node($node);
			 	                    tree.edit($node);
		 	                		
		 	                	}else{
		 	                		fnTaNotify("warning","파일에서는 하위 폴더를 추가 할 수 없습니다.");		 	                		
		 	                	}
		 	                }
		 	            },
		 	            "Rename": {
		 	                "separator_before": false,
		 	                "separator_after": false,
		 	                "label": "수정",
		 	                "action": function (obj) {
		 	                	if( $node.parent == "#" ){
		 	                		fnTaNotify("warning","root폴더는 변경 불가능합니다.");
		 	                		return;
		 	                	}else{
		 	                		$TARGET_PATH = ($node.parent == "#") ? $node.original.path : $node.original.parentPath;
			 	                    tree.edit($node);
		 	                	}
		 	                }
		 	            },                         
		 	            "Remove": {
		 	                "separator_before": false,
		 	                "separator_after": false,
		 	                "label": "삭제",
		 	                "action": function (obj) {
		 	                	if( $node.parent == "#" ){
		 	                		fnTaNotify("warning","root폴더는 삭제가 불가능합니다.");
		 	                		return;
		 	                	}else{
		 	                		tree.delete_node($node);	
		 	                	}
		 	                }
		 	            }
		 	        };
		 	    }
		 	}			 
	 })
	.bind("create_node.jstree", function (e, data) {
		console.log("create_node, file: "+data.node.text);
//		fnCreateDirectory($TARGET_PATH, data.node.text);
	})
	.bind('delete_node.jstree', function(evt, data) {
		console.log("delete_node, file: "+data.node.text);
		deleteDirectory($TARGET_PATH);
	})
	.bind('rename_node.jstree', function(evt, data) {
		console.log("rename_node, @@old:"+data.old+" @@new:"+data.text);
		if( data.old != data.text ){
			fnRenameFileFolder($TARGET_PATH,$TARGET_PARENT_PATH
					,$TARGET.original.type,data.text,data.old);	
		}
	})
	.bind('edit_node.jstree', function(evt, data) {
		console.log("edit_node");
	})
	.bind('move_node.jstree', function(evt, data) {
		console.log("move_node");
	})
	.bind('open_node.jstree', function(evt, data) {
		console.log("open_node");
	})
	.on('select_node.jstree', function (e, data) {
		console.log("select_node, file: "+data.node.original.text);
		 $TARGET_PATH = data.node.original.path;
		 $TARGET=data.node;
		 
		 if( data.node.original.type == "folder" )
			 $("#uploadFile").val(data.node.original.path);
		 else
			 $("#uploadFile").val(data.node.original.parentPath);
		 
		 //컨트롤러에서 지정한 root 값 일경우 부모패스가 없으니.. 기본 path 를 넣는다
		 $TARGET_PARENT_PATH = (data.node.parent == "#") ? data.node.original.path : data.node.original.parentPath;
		 
		 if(data.node.icon == "jstree-file"){
			 var html = "<h5><i class=\"fa fa-file-o\"></i> "+$TARGET_PATH+"</h5>"
			 $("#currentDir").html(html);
		 } else {
			 var html = "<h5><i class=\"fa fa-folder-open\"></i> "+$TARGET_PATH+"</h5>"
			 $("#currentDir").html(html);
			 
			 //디렉토리일경우만 업로드 패스 적용
			 $("#uploadFilePath").val($TARGET_PATH);
		 }
	})
	;
	
	//jstree 버튼
	$('#treeCreate').click(function(obj) {
		console.log("선택 treeCreate");	
		if($TARGET == null){
			fnTaNotify("warning","선택된 노드가 없습니다.");
			return;
		}
		if($TARGET.original.type == "file"){
			fnTaNotify("warning","파일에서는 하위 폴더를 추가 할 수 없습니다.");
			return; 
		}
		var tree = $("#jstree_demo").jstree(true);
		$TARGET = tree.create_node($TARGET);
        tree.edit($TARGET);
	});
	
	$('#treeUpdate').click(function(obj) {
		if($TARGET == null){
			fnTaNotify("warning","선택된 노드가 없습니다.");
			return;
		}
		var tree = $("#jstree_demo").jstree(true);
     	$TARGET_PATH = ($TARGET.parent == "#") ? $TARGET.original.path : $TARGET.original.parentPath;
         tree.edit($TARGET);
	});
	
	$('#treeDelete').click(function(obj) {
		if($TARGET == null){
			fnTaNotify("warning","선택된 노드가 없습니다.");
			return;
		}
		var tree = $("#jstree_demo").jstree(true);
		tree.delete_node($TARGET);
	});
	
	
  //------------DROP ZONE SETTING -----------//
	Dropzone.autoDiscover = false;
	var dropzoneOptions = {
	  url: "/dataManage/fileUpload"
	  ,dictDefaultMessage: 'Drop files here to upload'
	  ,paramName: "file"
	  ,maxFilesize: 3072 // MB
	  ,addRemoveLinks: false
	  ,init: function () {
		 this.on("complete", function (file) {
			fnTaNotify("success","업로드 하였습니다.");
			fnGetFileList("reload");
		 });	      
	  }
//	  ,accept: function(file, done) {
//		  console.log("accept");
//		  if($("#uploadFile").val()==""){
//			  fnComNotify("warning", "업로드 할 경로를 선택해 주세요");
//			  return;
//		  }
//		  checkFullUserSpace(done);
//	  }
	};
	var uploader = document.querySelector('#uploadFileForm');
	myDropzone = new Dropzone(uploader, dropzoneOptions);
})

var fnInit = function(){
	
}

/**
 * jstree 파일리스트 불러오기
 * @returns
 */
function fnGetFileList(option){
	var response = fnGetFileListByAjax();
	$("#filePath").val(response.filePath);
	$("#uploadFile").val(response.filePath);
	$('#jstree_demo').jstree(true).settings.core.data = response.fileList;
	$('#jstree_demo').jstree(true).refresh();
	$("#jstree_demo").jstree("open_all");
	
	if( option != "reload") myDropzone.removeAllFiles();
	$(".updateDiv").hide();
	$(".registDiv").show();
}

/**
 * jstree 폴더 생성 후 실제 폴더 생성
 * @param targetFullPath
 * @returns
 */
function fnCreateDirectory(targetFullPath, fileName){
	var data = {
		"targetFullPath" : targetFullPath
		,"fileName" : fileName
	}
	var response = fnCreateDirectoryByAjax(data);
	if( response.result != "success" ){
		fnTaNotify("danger",response.errorMessage);
		$('#jstree_demo').jstree("refresh");
	}
}

/**
 * jstree 삭제후 실제 파일/폴더 삭제요청 
 */
function deleteDirectory(targetFullPath){
	var data = {
			"targetFullPath" : targetFullPath
		}
	var response = fnDeleteDirectoryByAjax(data);
	if( response.result == "success" ){
		fnTaNotify("success","삭제하였습니다.");
		
	}else{
		fnTaNotify("danger",response.errorMessage);
	}
	$TARGET_PATH = null;
	$("#currentDir").html("");
}

/**
 * jstree 수정후 실제 파일/폴더 수정
 * @param targetPath
 * @param targetParentPath
 * @param targetType
 * @param newName
 * @param oldName
 * @returns
 */
function fnRenameFileFolder(targetPath, targetParentPath, targetType, newName, oldName){
	var data = {
			"targetPath" : targetPath
			,"targetParentPath" : targetParentPath
			,"targetType" : targetType
			,"newName" : newName
			,"oldName" : oldName
		}
	var response = fnRenameFileFolderByAjax(data);
	if( response.result == "success" && response.message == "rename" ){
		fnTaNotify("success","변경하였습니다.");
		fnGetFileList("reload");
		
	}else if( response.result == "success" && response.message == "create" ){
		fnTaNotify("success","추가하였습니다.");
		fnGetFileList("reload");
		
	}else{
		$('#jstree_demo').jstree("refresh");
		fnTaNotify("danger",response.errorMessage);
	}
}

/**
 * 해당유저의 저장공간이 풀 여부 확인
 * @param done
 * @returns
 */
function checkFullUserSpace(done, treeId) {
  $.ajax({
	    type: "post",
	    url: '/dataManage/checkFullUserSpace',
	    dataType: "json",
	    success: function success(data) {
	    	// console.log(data);
	    	if(data.result==true){
//	    		console.log("do done.");
	    		fnComNotify("warning", "할당 사용용량이 초과 되었습니다. 최대:"+data.maxSize+" 현재:"+data.size);
	    	} else {
	    		//uploadFileAjax();
	    		fnComNotify("success", "업로드 되었습니다. 최대:"+data.maxSize+" 현재:"+data.size);
	    		done();
	    	}
	    },
	    error: function error(request, _error5) {
	      console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + _error5);
	    },
	    complete: function complete() {
	    }
  });	
}

/* dropzone call back 함수
 * /gentelella/vendors/dropzone/dist/dropzone.js에 있음
 * 
*/
var fnReturnDropzone = function(response){
	if( response.result == "success" ){
//		fnTaNotify("success","업로드 하였습니다.");
//		fnGetFileList("reload");
	}else{
		fnTaNotify("danger", response.errorMessage);
	}
}
