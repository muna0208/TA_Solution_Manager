package com.daumsoft.taSolutionManager.restFullApi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.daumsoft.taSolutionManager.restFullApi.domain.OriginalData;
import com.daumsoft.taSolutionManager.restFullApi.domain.PreProcessedData;

@Mapper
public interface DataManageRestMapper {

	List<OriginalData> getOriginalDataList(String userId) throws Exception;

	OriginalData getOriginalData(Integer originalDataSeq) throws Exception;

	void insertOriginalData(OriginalData originalData);

	void updateOriginalData(OriginalData originalData);

	int duplicateCheckOriginalData(OriginalData originalData);

	int isUseCheckOriginalData(Integer originalDataSeq);

	
/* ***************************************************** 전처리 데이터 관리 ***************************************************** */
	List<PreProcessedData> getPreprocessedDataList(String userId) throws Exception;

	PreProcessedData getPreprocessedData(Integer preprocessedDataSeq) throws Exception;

	int isUseCheckPreprocessedDataData(Integer preprocessedDataSeq);

	int duplicateCheckPreprocessedData(String name);

	void insertPreprocessedData(PreProcessedData preProcessedData);

	void deletePreprocessedData(Integer preprocessedDataSeq);

	void updatePreprocessedData(PreProcessedData PreProcessedData);

	List<PreProcessedData> getPreprocessedDataSearchList(PreProcessedData PreProcessedData);
}
