package com.daumsoft.taSolutionManager.restFullApi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.daumsoft.taSolutionManager.restFullApi.domain.BatchService;

@Mapper
public interface BatchRestMapper {

	List<BatchService> getBatchList(String userId);

	BatchService getBatch(Integer batchServiceSeq);

	int duplicateCheckBatchName(String string);

	void insertBatch(BatchService batch);

	void updateBatch(BatchService batch);

}
