package com.daumsoft.taSolutionManager.restFullApi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.daumsoft.taSolutionManager.restFullApi.domain.Model;
import com.daumsoft.taSolutionManager.restFullApi.domain.Project;


@Mapper
public interface ProjectRestMapper {
	List<Project> getProjectList(String userId) throws Exception;

	Project getProject(Integer projectSeq) throws Exception;

	void insertProject(Project project);
	
	void updateProject(Project project);

	int duplicateCheckProjectName(String name);

	List<Model> getModelList(Model model);

	Model getModel(Integer modelSeq);

	int duplicateCheckModelName(String name);
	
	void insertModel(Model model);

	void updateModel(Model model);

	

	

	
}
