package com.daumsoft.taSolutionManager.restFullApi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.daumsoft.taSolutionManager.restFullApi.domain.PreProcessor;

@Mapper
public interface PreprocessorRestMapper {

	List<PreProcessor> getPreprocessorList() throws Exception;

	PreProcessor getPreprocessor(Integer preprocessorSeq) throws Exception;

}
