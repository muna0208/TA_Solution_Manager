var selectedModelDataPk, projectSeq;
var trainIntervalId = 0,evaluationIntervalId = 0;
var initModalData = false;
$(function(){
	fnInit();
	
	// 모델리스트 클릭시
	$(document).on("click", ".modelList", function(){
		$("#loading").show();
		$(".modelList").removeClass("active");
		$(this).addClass("active");
		selectedModelDataPk = $(this).attr("id");
		
		setTimeout(function() {
			// 모델 가져오기
			fnSetModelDetail(selectedModelDataPk);
		}, 100);
	});
	
	/*학습 데이터 목록 클릭시*/
	$("#datatable-trainData").DataTable().on("select", function(e, dt, type, indexes){
		var rowData = $("#datatable-trainData").DataTable().rows(indexes).data().toArray();
		var sampleData = jQuery.parseJSON(rowData[0][4]);
		fnSetSampleData(sampleData, "modalTrainData");
		$("#modalTrainDataSampleDiv").fadeIn();
	});
	
	/*검증 데이터 목록 클릭시*/
	$("#datatable-validationData").DataTable().on("select", function(e, dt, type, indexes){
		var rowData = $("#datatable-validationData").DataTable().rows(indexes).data().toArray();
		var sampleData = jQuery.parseJSON(rowData[0][4]);
		fnSetSampleData(sampleData, "modalValidationData");
		$("#modalValidationDataSampleDiv").fadeIn();
	});
	
	/*평가 데이터 목록 클릭시*/
	$("#datatable-evaluationData").DataTable().on("select", function(e, dt, type, indexes){
		var rowData = $("#datatable-evaluationData").DataTable().rows(indexes).data().toArray();
		var sampleData = jQuery.parseJSON(rowData[0][4]);
		fnSetSampleData(sampleData, "modalEvaluationData");
		$("#modalEvaluationDataSampleDiv").fadeIn();
	});
	
	/*알고리즘 목록 클릭시*/
	$("#datatable-algorithmList").DataTable().on("select", function(e, dt, type, indexes){
		var rowData = $("#datatable-algorithmList").DataTable().rows(indexes).data().toArray();
		var parameters = jQuery.parseJSON(rowData[0][5]);
		fnCreateAlgorithmParameter(parameters, "algorithmParameters");
		$("#algorithmParameterDiv").fadeIn();
	});
	
	/*임베딩 모델 프로젝트 목록 클릭시*/
	$("#datatable-projectEmbeddingModel").DataTable().on("select", function(e, dt, type, indexes){
		var rowData = $("#datatable-projectEmbeddingModel").DataTable().rows(indexes).data().toArray();
		var data = {"trainState":"FINISHED"};
		var modelList = fnGetModelSearchListByAjax(rowData[0][0],data);
		
		$("#datatable-embeddingModel").DataTable().clear().draw();
		fnSetModelData(modelList, "datatable-embeddingModel");
	
		$("#modalEmbeddingModelDiv").fadeIn();
	});
	
	/*사전학습 모델 프로젝트 목록 클릭시*/
	$("#datatable-projectPretrainedModel").DataTable().on("select", function(e, dt, type, indexes){
		var rowData = $("#datatable-projectPretrainedModel").DataTable().rows(indexes).data().toArray();
		var data = {"trainState":"FINISHED"};
		var modelList = fnGetModelSearchListByAjax(rowData[0][0],data);

		$("#datatable-pretrainedModel").DataTable().clear().draw();
		fnSetModelData(modelList, "datatable-pretrainedModel");
		
		$("#modalPretrainedModelDiv").fadeIn();
	});
	
	/*PREV버튼 클릭 */
	$(document).on("click", "#prevBtn", function(){
		$("#myTab").find("li").each(function(){
			if( $(this).hasClass("active") ){
				if( "model-tab" == $(this).children().attr("id") ){
					$('a[href="#tab_dataSet"]').click();
					return false;
				}else if( "dataSet-tab" == $(this).children().attr("id") ){
					$('a[href="#tab_algorithm"]').click();
					return false;
				}else if( "algorithm-tab" == $(this).children().attr("id") ){
					$('a[href="#tab_modelName"]').click();
					return false;
				}
			}
		});
		
	});
	
	/*NEXT버튼 클릭 */
	$(document).on("click", "#nextBtn", function(){
		$("#myTab").find("li").each(function(){
			if( $(this).hasClass("active") ){
				if( "modelName-tab" == $(this).children().attr("id") ){
					$('a[href="#tab_algorithm"]').click();
					return false;
				}else if( "algorithm-tab" == $(this).children().attr("id") ){
					$('a[href="#tab_dataSet"]').click();
					return false;
				}else if( "dataSet-tab" == $(this).children().attr("id") ){
					$('a[href="#tab_model"]').click();
					return false;
				}
			}
		});
	});
})

var fnInit = function(){
	userAuth = $("#userAuth").val();
	userId = $("#userId").val();
	projectSeq = $("#projectSeq").val();
	// 프로젝트 정보
	fnSetProject();
	
	// 모델 정보
	fnSetModel();
	
	// dataTable 생성
	fnTaCreateModalDataTable("datatable-trainData", 1, "desc", 0, 4);
	fnTaCreateModalDataTable("datatable-validationData", 1, "desc", 0, 4);
	fnTaCreateModalDataTable("datatable-evaluationData", 1, "desc", 0, 4);
	fnTaCreateModalDataTable("datatable-algorithmList", 1, "desc", 0, 5);
	fnTaCreateModalDataTable("datatable-projectEmbeddingModel", 1, "desc", 0);
	fnTaCreateModalDataTable("datatable-projectPretrainedModel", 1, "desc", 0);
	fnTaCreateModalDataTable("datatable-embeddingModel", 1, "desc", 0);
	fnTaCreateModalDataTable("datatable-pretrainedModel", 1, "desc", 0);
	
	$("#loading").fadeOut();
}

/*프로젝트 정보*/
var fnSetProject = function(){
	var project = fnGetProjectByAjax(projectSeq);
	$("#projectName").text(project.name);
	$("#description").text(project.description);
}

/* 모델 정보 */
var fnSetModel = function(){
	$("#loading").show();
	var data = {};
	var modelList = fnGetModelListByAjax(projectSeq);
	if( fnComnNotNullAndEmpty(modelList) ){
		var modelListHtml = "";
		for(var i in modelList){
			var data = modelList[i];
			if( i == 0 ){
				modelListHtml += "<li class='modelList active' role='button' id="+data.modelSeq+">"+data.name+"</li>";
				// 모델 값 세팅
				fnSetModelDetail(data.modelSeq);
				selectedModelDataPk = data.modelSeq;
			}else{
				modelListHtml += "<li class='modelList' role='button' id="+data.modelSeq+">"+data.name+"</li>";
			}
		}
		$("#modelListUl").html(modelListHtml);
	}else{
		selectedModelDataPk = "";
		$("#trainDataDefaultDiv").hide();
		$("#validationDataDefaultDiv").hide();
		$("#evaluationDataDefaultDiv").hide();
		$("#loading").fadeOut();
	}
}

// 모델 값 세팅
var fnSetModelDetail = function(modelSeq){
	var model = fnGetModelByAjax(modelSeq);
	// 데이터 셋 정보 가져오기
	var html = "";
	if( fnComnNotNullAndEmpty(model.trainDataName) )
		html += "<h2 class='custom-title'>학습 데이터 : "+model.trainDataName+"</h2>";
	if( fnComnNotNullAndEmpty(model.validationDataName) )
		html += "<h2 class='custom-title'>검증 데이터 : "+model.validationDataName+"</h2>";
	if( fnComnNotNullAndEmpty(model.evaluationDataName) )
		html += "<h2 class='custom-title'>평가 데이터 : "+model.evaluationDataName+"</h2>";
	$("#dataSetDiv").html(html);
	
	
	// 알고리즘
	html = "<h2 class='custom-title'>"+model.algorithmName+"</h2>";
	$("#algorithmNameDiv").html(html);
	
	
	// 임베딩 모델
	html = "";
	if( fnComnNotNullAndEmpty(model.embeddingModelName) ){
		html += "<h2 class='custom-title'>"+model.embeddingModelName+"</h2>";
		$("#embeddingModelInfoDiv").show();
	}else{
		$("#embeddingModelInfoDiv").hide();
	}
	$("#embeddingModelDiv").html(html);
		
	// 사전학습 모델 로드
	html = "";
	if( fnComnNotNullAndEmpty(model.pretrainedModelName) ){
		html += "<h2 class='custom-title'>"+model.pretrainedModelName+"</h2>";
		$("#pretrainedModelInfoDiv").show();
	}else{
		$("#pretrainedModelInfoDiv").hide();
	}
	$("#pretrainedModelDiv").html(html);
	
	// 학습, 검증, 평가 데이터 정보 가져오기
	if( fnComnNotNullAndEmpty(model.trainData) )	fnGetPreprocessedData(model.trainData, "trainData");
	if( fnComnNotNullAndEmpty(model.validationData) && model.validationData != 0 ){
		$("#validationDataLayerDiv").show();
		fnGetPreprocessedData(model.validationData, "validationData");
	}else{
		$("#validationDataLayerDiv").hide();
	}
	if( fnComnNotNullAndEmpty(model.evaluationData) && model.evaluationData != 0 ){
		$("#evaluationDataLayerDiv").show();
		fnGetPreprocessedData(model.evaluationData, "evaluationData");
	}else{
		$("#evaluationDataLayerDiv").hide();
	}
	
	/*모델 정보 값 세팅*/
	fnSetModelInfo(model);
	$("#modelDetailDiv").show();
	$("#loading").fadeOut();
}

//학습, 검증, 평가 전처리 데이터 정보 가져오기
var fnGetPreprocessedData = function(preprocessedDataSeq, option){
	var preprocessedData = fnGetPreprocessedDataByAjax(preprocessedDataSeq);
	// 전처리 데이터 상세정보
	$("#"+option+"FileName").text(preprocessedData.fileName);
	$("#"+option+"Path").text(preprocessedData.path);
	$("#"+option+"CreateDateTime").text(preprocessedData.createDatetime);
	
	// 파일 샘플
	if( fnComnNotNullAndEmpty(preprocessedData.sample)){
		$("#"+option+"SampleDiv").show();
		fnSetSampleData(preprocessedData.sample, option);
	}else{
		$("#"+option+"SampleDiv").hide();
	}
	
	// 레이블 정보
	if( fnComnNotNullAndEmpty(preprocessedData.labelInfo) ){
		$("#"+option+"LabelDiv").show();
		$("#"+option+"InfoDiv").show();
		fnpreprocessedDataChart(preprocessedData.labelInfo, option);
		$("#"+option+"InfoDiv").hide();
	}else{
		$("#"+option+"LabelDiv").hide();
	}
}


/*파일 샘플*/
var fnSetSampleData = function(sample, option){
	var theadHtml = "", tbodyHtml = "";
	var values = [];
	var valueCnt;
	
	$.each(sample, function(key, value){
		values.push(value);
		valueCnt = value.length
		if( theadHtml == "" ){
			theadHtml += "<thead><tr><th>"+key+"</th>";
		}else{
			theadHtml += "<th>"+key+"</th>";
		}
	});
	theadHtml += "</tr></thead>";
	tbodyHtml += "<tbody>";
	for( var i=0; i < valueCnt; i++ ){
		tbodyHtml += "<tr>";
		for( var v in values ){
			var value = values[v];
			tbodyHtml += "<td title='"+value[i]+"'>"+fnComnLongWordTranslation(value[i])+"</td>";
		}
		tbodyHtml += "</tr>";
	}
	tbodyHtml += "</tbody>";
	$("#"+option+"SampleTable").html(theadHtml+tbodyHtml);
}


/*전처리 차트*/
var fnpreprocessedDataChart = function(param, option){
	am4core.ready(function() {
		am4core.options.commercialLicense = true;
		
		// Themes begin
		am4core.useTheme(am4themes_animated);
		// Themes end

		// Create chart instance
		var preprocessedDataChart = am4core.create(option+"ChartDiv", am4charts.XYChart);	

		preprocessedDataChart.scrollbarX = new am4core.Scrollbar();

		var labels = param.labels;
		var labelStats = param.label_stats;
		var list = [];
		
		$.each(labelStats, function(key, value){
			var data = {
					"범주값" : key,
					"labelStats" : value
			}
			list.push(data);
		});
		preprocessedDataChart.data = list;
		
		// Create axes
		var categoryAxis = preprocessedDataChart.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = "범주값";
		categoryAxis.title.text = "";
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.minGridDistance = 30;
		categoryAxis.renderer.labels.template.horizontalCenter = "right";
		categoryAxis.renderer.labels.template.verticalCenter = "middle";
		categoryAxis.renderer.labels.template.rotation = 0;
		categoryAxis.tooltip.disabled = true;
		categoryAxis.renderer.minHeight = 50;

		var valueAxis = preprocessedDataChart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.renderer.minWidth = 50;
		valueAxis.title.text = "";

		// Create series
		var series = preprocessedDataChart.series.push(new am4charts.ColumnSeries());
		series.sequencedInterpolation = true;
		series.dataFields.valueY = "labelStats";
		series.dataFields.categoryX = "범주값";
		series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
		series.columns.template.strokeWidth = 0;

		series.tooltip.pointerOrientation = "vertical";

		series.columns.template.column.cornerRadiusTopLeft = 10;
		series.columns.template.column.cornerRadiusTopRight = 10;
		series.columns.template.column.fillOpacity = 0.8;

		// on hover, make corner radiuses bigger
		var hoverState = series.columns.template.column.states.create("hover");
		hoverState.properties.cornerRadiusTopLeft = 0;
		hoverState.properties.cornerRadiusTopRight = 0;
		hoverState.properties.fillOpacity = 1;

		series.columns.template.adapter.add("fill", function(fill, target) {
		  return preprocessedDataChart.colors.getIndex(target.dataItem.index);
		});

		// Cursor
		preprocessedDataChart.cursor = new am4charts.XYCursor();
			
	}); // end am4core.ready()
}

/*모델 정보 값 세팅*/
var fnSetModelInfo = function(model){
	
	// 알고리즘 데이터
	fnSetAlgorithmData(model);
	
	// 임베딩
	$("#embeddingProjectName").text(model.embeddingProjectName);
	$("#embeddingModelName").text(model.embeddingModelName);
	
	// 사전학습 모델 로드
	console.log(model)
	$("#pretrainedModelProjectName").text(model.projectName);
	$("#pretrainedModelName").text(model.pretrainedModelName);
	
	// 학습
	fnSetTrainData(model);
	
	// 평가
	fnSetEvaluationData(model);
}

/*알고리즘 데이터*/
var fnSetAlgorithmData = function(model){
	var html = "";
	var parameters = model.parameters;
	var leng = Object.keys(parameters).length + 1;
	if( fnComnNotNullAndEmpty(parameters) ){
		$.each(parameters, function(key, value){
			var valueData = "";
			if( value.length >= 30 ){
				var cnt = 1;
				for( var d in value ){
					if( value.length-1 == d ) valueData += value[d];
					else{
						valueData += value[d]+", ";
						if( cnt % 10 == 0 ) valueData += "<br>";
					}
					cnt++;
				}
			}else{
				valueData = value;
			}
			if( html == "" ){
				html += "<tr><th>알고리즘</th><td colspan='2'>"+model.algorithmName+"</td></tr>";
				html += "<tr><th rowspan='"+leng+"'>파라미터</th><th>이름</th><th>값</th></tr>";
				html += "<tr><td>"+key+"</td><td>"+valueData+"</td></tr>";
			}
			else	html += "<tr><td>"+key+"</td><td>"+valueData+"</td></tr>";
		});	
	}else{
		html += "<tr><th>알고리즘</th><td colspan='2'>"+model.preprocessorName+"</td></tr>";
	}
	$("#modelAlgorithmDataInfo").html(html);
}


/*학습*/
var fnSetTrainData = function(model){
	if( model == null ) model = fnGetModelByAjax(selectedModelDataPk);
	
	fnCheckState(model, "train");
	if( "FINISHED" == model.trainState ){
		$("#trainStartDateTime").text(model.trainStartDateTime);
		$("#trainEndDateTime").text(model.trainEndDateTime);
		$("#trainRunTime").text(fnComnReplaceNull(model.trainDiffDateTime,"-"));
		$("#fileName").text(model.fileName);
		$("#path").text(model.path);
	}else{
		$("#trainStartDateTime").text("-");
		$("#trainEndDateTime").text("-");
		$("#trainRunTime").text("-");
		$("#fileName").text("-");
		$("#path").text("-");
	}
	
	if( "FINISHED" == model.trainState && (fnComnNotNullAndEmpty(model.trainResult.keys)) ){
		// 그래프
		var keys = model.trainResult.keys;
		var trainResult = model.trainResult;
		
		var html = "";
		for( var i in keys ){
			html += "<div id=trainResultDiv_"+i+"'>";
			html += "	<h5><strong>- "+keys[i]+"</strong></h5>";
			html += "	<div class='chartArea trainChartDiv_"+i+"'>그래프 영역</div>";
			html += "</div>";
		}
		$("#trainLabelChartDiv").html(html).show();
		
		for( var i in keys ){
			fnTrainResultChart(trainResult[keys[i]], "trainChartDiv_"+i, keys[i] );
		}
		
	}else{
		$("#trainLabelChartDiv").hide();
	}
}


/*평가*/
var fnSetEvaluationData = function(model){
	if( model == null ) model = fnGetModelByAjax(selectedModelDataPk);

	if( fnComnNotNullAndEmpty(model.evaluationData) && model.evaluationData != 0 ){
		fnCheckState(model, "evaluation");
		
		if( "FINISHED" == model.evaluationState && (fnComnNotNullAndEmpty(model.evaluationResult.keys)) ){
			/*평가결과 테이블*/
			$("#evaluationStartDateTime").text(model.evaluationStartDateTime);
			$("#evaluationEndDateTime").text(model.evaluationEndDateTime);
			$("#evaluationRunTime").text(fnComnReplaceNull(model.evaluationDiffDateTime,"-"));
			var html = fnEvaluationResultTable(model.evaluationResult);
			$("#evaluationLabelChartDiv").html(html).show();
			
		}else{
			$("#evaluationStartDateTime").text("-");
			$("#evaluationEndDateTime").text("-");
			$("#evaluationRunTime").text("-");
			$("#evaluationLabelChartDiv").hide();
		}
		$("#evaluationInfoDiv").show();
	}else{
		$("#evaluationInfoDiv").hide();
	}
	
	$("#loading").fadeOut();
}

/*학습/평가 상태 체크*/
var fnCheckState = function(model, option){
	if( "train" == option && trainIntervalId != 0 )	clearInterval(trainIntervalId);
	if( "evaluation" == option && evaluationIntervalId != 0 )	clearInterval(evaluationIntervalId);
	
	var state = ("train" == option) ? model.trainState : model.evaluationState;
	
	if( "PENDING" == state || "SUSPENDED" == state ){
		$("#"+option+"State").text(state);
		$("#"+option+"StartBtn").show();
		$("#"+option+"StopBtn").hide();
		
	}else if( "RUNNING" == state || "REQUEST" == state){
		if( "train" == option )	trainIntervalId = setInterval(fnSetTrainData, 5000);
		else 					evaluationIntervalId = setInterval(fnSetEvaluationData, 5000);	
		
		var runningHtml = "<div class='progress-bar progress-bar-striped active' role='progressbar' style='width:100%'>학습중</div>";
		$("#"+option+"State").html(runningHtml);
		$("#"+option+"StartBtn").hide();
		$("#"+option+"StopBtn").show();
	
	}else if( "FAILED" == state ){
		var errorMsg = ("train" == option) ? model.trainErrMsg : model.evaluationErrMsg;
		$("#"+option+"State").text(state+" : "+errorMsg);
		$("#"+option+"StartBtn").hide();
		$("#"+option+"StopBtn").hide();
		
	}else{
		$("#"+option+"State").text(state);
		$("#"+option+"StartBtn").hide();
		$("#"+option+"StopBtn").hide();
	}
}

/*학습(loss,accuracy) 그래프*/
var fnTrainResultChart = function(param, chartDiv, chartName ){
	am4core.ready(function() {
		am4core.options.commercialLicense = true;
		
		// Themes begin
		am4core.useTheme(am4themes_animated);
		// Themes end

		// Create chart instance
		var chart = am4core.create(chartDiv, am4charts.XYChart);
		chart.paddingRight = 20;
		
		var train, trainX, trainY, validation, validationX, validationY, xName, yName;
		train = param.train;
		validation = param.validation;
		xName = param.x;
		yName = param.y;
		if( fnComnNotNullAndEmpty(train) ){
			trainX = train.x;
			trainY = train.y;	
		}
		
		if( fnComnNotNullAndEmpty(validation) ){
			validationX = validation.x;
			validationY = validation.y;
		}
		
		var data = [];
		for( var i in trainX ){
			if( fnComnNotNullAndEmpty(validation) )
				data.push({"steps": trainX[i],"train": trainY[i],"validation": validationY[i]});
			else
				data.push({"steps": trainX[i],"train": trainY[i]});
		}

		chart.data = data;

		var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
		xAxis.dataFields.category = "steps";
		xAxis.title.text = xName;

		var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
		yAxis.title.text = yName;
		
		var series = chart.series.push(new am4charts.LineSeries());
		series.name = 'train';
		series.dataFields.categoryX = "steps";
		series.dataFields.valueY = "train";
		series.strokeWidth = 2;
		series.tooltipText = "train: {train}";
		series.bullets.push(new am4charts.CircleBullet());
		
		if( fnComnNotNullAndEmpty(validation) ){
			var series2 = chart.series.push(new am4charts.LineSeries());
			series2.name = 'validation';
			series2.dataFields.categoryX = "steps";
			series2.dataFields.valueY = "validation";
			series2.strokeWidth = 2;
			series2.tooltipText = "validation: {validation}";
			series2.bullets.push(new am4charts.CircleBullet());
		}
		
		chart.cursor = new am4charts.XYCursor();
		chart.cursor.xAxis = xAxis;

		var scrollbarX = new am4core.Scrollbar();
		scrollbarX.marginBottom = 20;
		chart.scrollbarX = scrollbarX;
		
		// Add legend
		chart.legend = new am4charts.Legend();

	}); // end am4core.ready()
}

/*평가결과 테이블*/
var fnEvaluationResultTable = function(evaluationResult){
	// 평가결과 테이블 생성
	var html = "";
	var eKeys = evaluationResult.keys;
	
	for( var i in eKeys ){
		var result = evaluationResult[eKeys[i]];
		var resultKeys = evaluationResult[eKeys[i]].keys;
		html += "<h5><strong>- "+eKeys[i]+"</strong></h5>";
		html += "<table class='table table-bordered jambo_table custom-tbTextCenter'>";
		html += "	<tbody>";
		html += "		<tr>";
		html += "			<th></th>";
		
		
		var resultValue = result[resultKeys[0]];
		$.each(resultValue, function(key, value){
			if( "keys" != key )	html += "			<th>"+key+"</th>";
		});
			
		html += "		</tr>";
		for( var j in resultKeys ){
			html += "		<tr>";
			html += "			<td>"+resultKeys[j]+"</td>";
			var resultValue = result[resultKeys[j]];
			$.each(resultValue, function(key, value){
				if( "keys" != key )	html += "			<td>"+value+"</td>";
			});
			html += "		</tr>";
		}
		html += "	</tbody>";
		html += "</table>";
	}
	return html;
}

/*학습/평가 실행/중지*/
var fnModelCommand = function(target, option){
	if( "evaluate" == target && "FINISHED" != $("#trainState").text() ){
		fnTaNotify("warning", "학습이 끝나야 평가를 할수있습니다.");
		return false;
	}else{
		var data = {
				"modelSeq" : selectedModelDataPk
				,"target" : target
				,"option" : option
		}
		var comment = ("train"==target) ? "학습" : "평가";
		comment = ("stop"==option) ? "중지" : comment;
		
		if( confirm(comment+"하시겠습니까?") ){
			var response = fnModelCommandByAjax(data);
			if( response.result == "success" ){
				fnTaNotify("success", comment+"을 요청하였습니다.");
				if( "train" == target )	fnSetTrainData(response.model);				
				else					fnSetEvaluationData(response.model);
			
			} else if( response.result == "Internal Server Error") {
				fnTaErrorMessage("모듈서버 Error", response.errorMessage);
				
			} else if( response.result == "validationError") {
				fnTaNotify("warning", response.errorMessage.detail);
				
			} else {
				fnTaErrorMessage(comment+" 에러!!", response);
			}
		}		
	}
}


/*모델 생성 모달*/
var fnInsertModel = function(){
	$(".selectedDiv").hide();	
	if( initModalData ){
		$('a[href="#tab_modelName"]').click();
		$('a[href="#tab_trainData"]').click();
		$('a[href="#tab_embeddingModel"]').click();
		$("#name").val("");
		$("#datatable-trainData").DataTable().rows().deselect();
		$("#datatable-validationData").DataTable().rows().deselect();
		$("#datatable-evaluationData").DataTable().rows().deselect();
		$("#datatable-algorithmList").DataTable().rows().deselect();
		$("#datatable-projectEmbeddingModel").DataTable().rows().deselect();
		$("#datatable-projectPretrainedModel").DataTable().rows().deselect();
		if ( $.fn.DataTable.isDataTable( '#datatable-embeddingModel' ) )
			$("#datatable-embeddingModel").DataTable().rows().deselect();
		if ( $.fn.DataTable.isDataTable( '#datatable-pretrainedModel' ) )
			$("#datatable-pretrainedModel").DataTable().rows().deselect();
		
	}else{
		$("#loading").show();
		setTimeout(function() {
			/*데이터셋 Tab 데이터 설정*/
			fnSetDataSetTab();
			
			/*알고리즘 Tab 데이터 설정*/
			fnSetAlgorithmTab();
			
			/*모델 Tab 데이터 설정*/
			fnSetModelTab();

			$("#loading").hide();
			initModalData = true;
		}, 100);
	}
			
	$(".modelModal").modal("show");
}


/*데이터셋 Tab 데이터 설정*/
var fnSetDataSetTab = function(){
	/*전처리 데이터 가져오기*/
	var data = {
			"state" : "FINISHED"
			,"deleteFlag" : 0
			,"userId" : (userAuth=="admin") ? "" : userId
	}
	var preprocessedDataList = fnGetPreprocessedDataSearchListByAjax(data);
	$("#datatable-trainData").DataTable().clear().draw();
	fnSetPreprocessedData(preprocessedDataList, "datatable-trainData");
	$("#datatable-validationData").DataTable().clear().draw();
	fnSetPreprocessedData(preprocessedDataList, "datatable-validationData");
	$("#datatable-evaluationData").DataTable().clear().draw();
	fnSetPreprocessedData(preprocessedDataList, "datatable-evaluationData");
	
}

/*알고리즘 Tab 데이터 설정*/
var fnSetAlgorithmTab = function(){
	$("#datatable-algorithmList").DataTable().clear().draw();
	fnSetAlgorithm(fnGetAlgorithmListByAjax(), "datatable-algorithmList");
}


/*모델 Tab 데이터 설정*/
var fnSetModelTab = function(){
	$("#datatable-projectEmbeddingModel").DataTable().clear().draw();
	$("#datatable-projectPretrainedModel").DataTable().clear().draw();
	
	var projectList = fnGetProjectListByAjax();	
	fnSetProjectList(projectList, "datatable-projectEmbeddingModel");	
	fnSetProjectList(projectList, "datatable-projectPretrainedModel");
}


/*학습/검증/평가 데이터 목록*/
var fnSetPreprocessedData = function(preprocessedDataList, id){
	for( var i in preprocessedDataList ){
		var data = preprocessedDataList[i];
		var preprocessedData = [];
		preprocessedData[0] = data.preprocessedDataSeq;
		preprocessedData[1] = data.name;
		preprocessedData[2] = data.preprocessorName;
		preprocessedData[3] = data.description;
		preprocessedData[4] = JSON.stringify(data.sample);
		
		$("#"+id).dataTable().fnAddData(preprocessedData);
	}
}

/*알고리즘 데이터 목록*/
var fnSetAlgorithm = function(algorithmList,id){
	for( var i in algorithmList ){
		var data = algorithmList[i];
		var algorithm = [];
		algorithm[0] = data.algorithmSeq;
		algorithm[1] = data.name;
		algorithm[2] = data.description;
		algorithm[3] = data.supportedExtension;
		algorithm[4] = data.applycation;
		algorithm[5] = JSON.stringify(data.parameters);
		
		$("#"+id).dataTable().fnAddData(algorithm);
	}
}

/*파라미터 설정*/
var fnCreateAlgorithmParameter = function(parameters, id){
	var mParamHtml = "";
	for( var i in parameters ){
		var mp = parameters[i];
		mParamHtml += "<tr>";
		mParamHtml += "	<td>"+mp.name+"</td>";
		mParamHtml += "	<td>"+mp.type+"</td>";
		if( mp.type == "int" )
			mParamHtml += "	<td><input type='text' class='form-control' onkeydown='return fnComnOnlyNumber();' onkeyup='fnComnRemoveChar(event);' placeholder='"+mp.default+"' title='"+mp.comment+"'></td>";
		else if( mp.type == "float" )
			mParamHtml += "	<td><input type='text' class='form-control' onkeydown='return fnComnOnlyNumberDot();' onkeyup='fnComnRemoveChar(event);' placeholder='"+mp.default+"' title='"+mp.comment+"'></td>";
		else
			mParamHtml += "	<td><input type='text' class='form-control' placeholder='"+mp.default+"' title='"+mp.comment+"'></td>";
		
		mParamHtml += "</tr>";
	}
	$("#"+id).html(mParamHtml);
}

/*프로젝트 목록*/
var fnSetProjectList = function(projectList,id){
	for( var i in projectList ){
		var data = projectList[i];
		var project = [];
		project[0] = data.projectSeq;
		project[1] = data.name;
		project[2] = data.description;
		project[3] = data.createDatetime;
		
		$("#"+id).dataTable().fnAddData(project);
	}
}


/*모델 데이터*/
var fnSetModelData = function(modelList, id){
	for( var i in modelList ){
		var data = modelList[i];
		var model = [];
		model[0] = data.modelSeq;
		model[1] = data.name;
		model[2] = data.createDatetime;
		
		$("#"+id).dataTable().fnAddData(model);
	}
}

/*모델 생성*/
var fnCreateModel = function(){
	if( $.trim($("#name").val()) == "" ){
		fnTaNotify("warning", "모델명을 입력해주세요.");
		$('a[href="#tab_modelName"]').click();
		$("#name").focus();
		return false;
		
	}else if( $("#datatable-trainData").DataTable().rows({selected:true}).data()[0] == undefined ){
		fnTaNotify("warning", "학습데이터를 선택해주세요.");
		$('a[href="#tab_dataSet"]').click();
		$('a[href="#tab_trainData"]').click();
		return false;
		
	}else if( $("#datatable-algorithmList").DataTable().rows({selected:true}).data()[0] == undefined ){
		fnTaNotify("warning", "알고리즘을 선택해주세요.");
		$('a[href="#tab_algorithm"]').click();
		return false;
		
	}else{
		var modelParameters = {};
		$("#algorithmParameters tr").each(function(i){
			var tr = $(this);
			var pName = tr.children().eq(0).text();
			var pType = tr.children().eq(1).text();
			var pValue = tr.children().children().val();
			
			if( fnComnNotNullAndEmpty(pValue) ){
				if( pType == "list" ){
					var list = pValue.split(",");
					modelParameters[pName] = list;
				}else{
					modelParameters[pName] = pValue;	
				}
			}
		});
		var validationData,evaluationData,embeddingModel,pretrainedModel;
		if( $("#datatable-validationData").DataTable().rows({selected:true}).data()[0] != undefined )
			validationData = $("#datatable-validationData").DataTable().rows({selected:true}).data()[0][0];
		
		if( $("#datatable-evaluationData").DataTable().rows({selected:true}).data()[0] != undefined )
			evaluationData = $("#datatable-evaluationData").DataTable().rows({selected:true}).data()[0][0];
		
		if( $("#datatable-embeddingModel").DataTable().rows({selected:true}).data()[0] != undefined )
			embeddingModel = $("#datatable-embeddingModel").DataTable().rows({selected:true}).data()[0][0];
		
		if( $("#datatable-pretrainedModel").DataTable().rows({selected:true}).data()[0] != undefined )
			pretrainedModel = $("#datatable-pretrainedModel").DataTable().rows({selected:true}).data()[0][0];
		
		var data = {
			"name" : $("#name").val()
			,"projectSeq" : projectSeq
			,"algorithmSeq" : $("#datatable-algorithmList").DataTable().rows({selected:true}).data()[0][0]
			,"parameters" : JSON.stringify(modelParameters)
			,"trainData" : $("#datatable-trainData").DataTable().rows({selected:true}).data()[0][0]
			,"validationData" : validationData
			,"evaluationData" : evaluationData
			,"embeddingModel" : embeddingModel
			,"pretrainedModel" : pretrainedModel
			,"userId" : userId
		}
		
		if( confirm("최대 2분정도 시간이 소요됩니다. 생성하시겠습니까?") ){
			$("#loading").show();
			setTimeout(function() {
				var response = fnInsertModelByAjax(data);
				if( response.result == "success" ){
					fnTaNotify("success", "모델이 생성되었습니다.");
					$(".modelModal").modal("hide");
					fnSetModel();
					$("#loading").fadeOut();
				} else if( response.errorMessage == "duplication name") {
					$('a[href="#tab_modelName"]').click();
					fnTaNotify("warning", "모델명이 중복되었습니다.");
					$("#loading").fadeOut();
				} else if( response.result == "validationError") {
					fnTaNotify("warning", response.errorMessage.detail);
					$("#loading").fadeOut();
				} else {
					fnTaErrorMessage("모델 생성 에러!!", response);
					$("#loading").fadeOut();
				}
			}, 100);
		}
	}
}

/*모델 삭제*/
var fnDeleteModel = function(){
	if( fnComnNotNullAndEmpty(selectedModelDataPk)){
		if( confirm("모델을 삭제하시겠습니까?") ){
			var response = fnDeleteModelByAjax(selectedModelDataPk);
			if( response.result == "success" ){
				fnTaNotify("success", "모델을 삭제하였습니다.");
//				fnSetModel();
				location.reload();
			}else{
				fnTaErrorMessage("모델 삭제 에러!!", response);
			}
		}	
	}else{
		fnTaNotify("warning", "삭제할 모델이 없습니다.");
	}
}













