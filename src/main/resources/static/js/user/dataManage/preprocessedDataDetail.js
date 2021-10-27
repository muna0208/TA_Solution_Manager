
var preprocessedIntervalId = 0;
$(function(){
	fnInit();
	
})

var fnInit = function(){
	// 전처리 데이터 정보
	fnSetPreprocessedData();
	
	$("#loading").fadeOut();
}

/* 전처리 데이터 시작/중지/삭제 */
var fnChangePreprocessedData = function(option){
	var coment = "시작";
	var data = {
		"preprocessedDataSeq" : $("#preprocessedDataSeq").val()
		,"task": "run"
	};
	
	if( "stop" == option ){
		coment = "중지";
		data["task"] = "revoke";
	}

	if( confirm(coment+"하시겠습니까?") ){
		var preprocessedData = fnChangePreprocessedDataByAjax(data, option);
		if( preprocessedData.result == "success" ){
			fnSetPreprocessedDataBtn(preprocessedData.state)
			fnTaNotify("success", coment+"하였습니다.");
		}else{
			fnTaErrorMessage("에러", response.errorMessage);
		}
	}
}

/*전처리 데이터 삭제*/
var fnDeletePreprocessedData = function(){
	if( confirm("삭제하시겠습니까?") ){
		var response = fnDeletePreprocessedDataByAjax($("#preprocessedDataSeq").val());
		if( response.result == "success" ){
			fnComnGetMovePage('preprocessedDataManage');
		} else if( response.errorMessage == "preprocessedData in use") {
			fnTaErrorMessage("프로젝트에서 사용중이라 삭제할수 없습니다.", response);
			
		} else {
			fnTaErrorMessage("전처리데이터 삭제 에러!!", response);
		}
	}
}


/*전처리 데이터 정보*/
var fnSetPreprocessedData = function(){
	var preprocessedData = fnGetPreprocessedDataByAjax($("#preprocessedDataSeq").val());
	
	// 시작/중지 버튼 세팅
	fnSetPreprocessedDataBtn(preprocessedData.state);
	
	$("#preprocessedDataName").text(preprocessedData.name);
	$("#description").text(preprocessedData.description);
	$("#originalDataName").text(preprocessedData.originalDataName);
	$("#preprocessorName").text(preprocessedData.preprocessorName);
	
	// 전처리기 정보
	var html = "";
	if( fnComnNotNullAndEmpty(preprocessedData.parameters) ){
		var parameters = preprocessedData.parameters;
		var leng = Object.keys(parameters).length + 1;
		
		if( fnComnNotNullAndEmpty(parameters) ){
			$.each(parameters, function(key, value){
				var valueData = "";
				if( key.indexOf("PATH") == -1 && value.length >= 20 ){
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
					html += "<tr><th>전처리기</th><td colspan='2'>"+preprocessedData.preprocessorName+"</td></tr>";
					html += "<tr><th rowspan='"+leng+"'>파라미터</th><th>이름</th><th>값</th></tr>";
					html += "<tr><td>"+key+"</td><td>"+valueData+"</td></tr>";
				}
				else	html += "<tr><td>"+key+"</td><td>"+valueData+"</td></tr>";
			});
		}else{
			html += "<tr><th>전처리기</th><td colspan='2'>"+preprocessedData.preprocessorName+"</td></tr>";
		}
	}else{
		html += "<tr><th>전처리기</th><td colspan='2'>"+preprocessedData.preprocessorName+"</td></tr>";
	}

	
	$("#preprocessedDataInfo").html(html);
	// 전처리 데이터 상세정보
	if( "FINISHED" == preprocessedData.state )
		fnSetPreprocessedDataDetail(preprocessedData);
}

//전처리 데이터 상세정보
var fnSetPreprocessedDataDetail = function(preprocessedData){
	// 전처리 데이터 상세정보
	$("#fileName").text(preprocessedData.fileName);
	$("#path").text(preprocessedData.path);
	$("#createDateTime").text(preprocessedData.createDatetime);
	$("#columns").text(fnComnReplaceNull(preprocessedData.columns,"-"));
	$("#amount").text(fnComnNumberWithCommas(preprocessedData.amount));
	$("#state").text(preprocessedData.state);
	$("#startDatetime").text(preprocessedData.startDatetime);
	$("#endDatetime").text(preprocessedData.endDatetime);
	$("#period").text(preprocessedData.diffDateTime);
	
	// 파일 샘플
	if( fnComnNotNullAndEmpty(preprocessedData.sample)){
		fnSetSampleData(preprocessedData);
		$("#sampleDiv").show();
	}else{
		$("#sampleDiv").hide();
	}
	
	
	// 레이블 정보
	if( fnComnNotNullAndEmpty(preprocessedData.labelInfo) ){
		$("#class").text(preprocessedData.labelInfo.labels);
		fnPreprocessedDataChart(preprocessedData.labelInfo);
		$("#labelChartDiv").fadeIn();
	}else{
		$("#class").text("-");
	}
	
	$("#preprocessedDataDetailDiv").fadeIn();
}

/*시작/중지 버튼 세팅*/
var fnSetPreprocessedDataBtn = function(state){
	if( preprocessedIntervalId != 0 )	clearInterval(preprocessedIntervalId);
	
	if( "PENDING" == state || "SUSPENDED" == state ){
		$("#startBtn").show();
		$("#stopBtn").hide();
		
	}else if( "RUNNING" == state || "REQUEST" == state){
		preprocessedIntervalId = setInterval(fnChangeState, 5000);
		$("#startBtn").hide();
		$("#stopBtn").show();
		
	}else{
		$("#startBtn").hide();
		$("#stopBtn").hide();
	}
}

/*상태값 변경*/
var fnChangeState = function(){
	var preprocessedData = fnGetPreprocessedDataByAjax($("#preprocessedDataSeq").val());
	if( preprocessedData.state == "FINISHED" ){
		fnSetPreprocessedDataDetail(preprocessedData);
		fnSetPreprocessedDataBtn(preprocessedData.state)
	}
		
}

/*파일 샘플*/
var fnSetSampleData = function(preprocessedData){
	var sample = preprocessedData.sample;
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
	$("#sampleTable").html(theadHtml+tbodyHtml);
}


/*전처리 차트*/
var fnPreprocessedDataChart = function(param){
	am4core.ready(function() {
		am4core.options.commercialLicense = true;
		
		// Themes begin
		am4core.useTheme(am4themes_animated);
		// Themes end

		// Create chart instance
		var preprocessedDataChart = am4core.create("preprocessedDataChartDiv", am4charts.XYChart);
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

