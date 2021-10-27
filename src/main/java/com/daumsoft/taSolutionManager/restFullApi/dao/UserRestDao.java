package com.daumsoft.taSolutionManager.restFullApi.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.daumsoft.taSolutionManager.restFullApi.domain.User;

// *** Redis Session clustering ****
//@Repository
public class UserRestDao {
	
	@Autowired
	@Qualifier("postgreSqlSessionTemplate")
	private SqlSession sqlSession;

	public List<User> getUserList() {
		return sqlSession.selectList("getUserList");
	}

	public User getUser(Integer id) {
		return sqlSession.selectOne("getUser", id);
	}

	public User getUserInfo(User user) {
		return sqlSession.selectOne("getUserInfo", user);
	}

	public void updateLastAccessDate(Integer id) {
		sqlSession.update("updateLastAccessDate", id);
	}

	public int duplicateCheckUserId(String userId) {
		return sqlSession.selectOne("duplicateCheckUserId", userId);
	}

	public void insertUser(User user) {
		sqlSession.insert("insertUser", user);
	}

	public void updateUser(User user) {
		sqlSession.update("updateUser", user);
	}

	public void deleteUser(Integer id) {
		sqlSession.delete("deleteUser", id);
	}

	public User findUserId(User user) {
		return sqlSession.selectOne("findUserId", user);
	}	
	
}
