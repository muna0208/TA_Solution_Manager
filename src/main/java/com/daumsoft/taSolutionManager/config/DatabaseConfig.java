package com.daumsoft.taSolutionManager.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
@PropertySource("classpath:/application.yml")
@EnableTransactionManagement
public class DatabaseConfig {
	
	@Autowired
	private ApplicationContext applicationContext;
	
	/* 
	 * mySql datasource 
	 * 
	 * */
    @Bean
    @Primary
    @ConfigurationProperties(prefix="spring.datasource.hikari.customer")
    public HikariConfig hikariConfigMySql() {
    	return new HikariConfig();
    }
    
    @Bean(name="mySqlDataSource")
    @Primary
    public DataSource mySqlDataSource() {
    	return new HikariDataSource(hikariConfigMySql());
    }
    
	
    
	/*
	 *  transaction 설정 
	 *  
	 *  */
    @Bean(name="customerTransactionManager")
	@Primary
	public PlatformTransactionManager transactionManager() throws Exception{
		return new DataSourceTransactionManager(mySqlDataSource());
	}
    
    
    
	/* 
	 * mybatis 설정 
	 * 
	 * */
	@Bean
	@Primary
	@ConfigurationProperties(prefix="mybatis.configuration")
	public org.apache.ibatis.session.Configuration mybatisConfig(){
		return new org.apache.ibatis.session.Configuration();
	}
    

	@Bean(name="mysqlSqlSessionFactory")
	@Primary
	public SqlSessionFactory mysqlSqlSessionFactory(@Qualifier("mySqlDataSource") DataSource dataSource) throws Exception {
		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
		sqlSessionFactoryBean.setDataSource(dataSource);
		sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:/mapper/mySql/*.xml"));
		sqlSessionFactoryBean.setTypeAliasesPackage("com.daumsoft.taSolutionManager.restFullApi.domain");
		sqlSessionFactoryBean.setConfiguration(mybatisConfig());
		return sqlSessionFactoryBean.getObject();
	}
	
	@Bean
	@Primary
	public SqlSessionTemplate sqlSessionTemplate(@Qualifier("mysqlSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
		return new SqlSessionTemplate(sqlSessionFactory);
	}
	
	
	
	
	
}
