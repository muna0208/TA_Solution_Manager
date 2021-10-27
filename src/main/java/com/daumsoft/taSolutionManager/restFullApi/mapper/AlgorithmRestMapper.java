package com.daumsoft.taSolutionManager.restFullApi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.daumsoft.taSolutionManager.restFullApi.domain.Algorithm;

@Mapper
public interface AlgorithmRestMapper {

	List<Algorithm> getAlgorithmList() throws Exception;

	Algorithm getAlgorithm(Integer algorithmSeq) throws Exception;


}