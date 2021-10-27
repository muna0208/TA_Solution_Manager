package com.daumsoft.taSolutionManager.restFullApi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.daumsoft.taSolutionManager.restFullApi.domain.User;


@Mapper
public interface UserRestMapper {

	User getUserInfo(User user);

	void updateLastAccessDate(Integer id);

	List<User> getUserList() throws Exception;

	User getUser(Integer id) throws Exception;

	int duplicateCheckUserId(String userId) throws Exception;

	void insertUser(User userInfo) throws Exception;

	void updateUser(User userInfo) throws Exception;

	User findUserId(User userInfo);

	void deleteUser(Integer id);

	
}
