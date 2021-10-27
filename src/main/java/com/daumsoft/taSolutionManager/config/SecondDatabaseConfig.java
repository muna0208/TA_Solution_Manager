package com.daumsoft.taSolutionManager.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import com.zaxxer.hikari.HikariConfig;

@Configuration
@PropertySource("classpath:/application.yml")
public class SecondDatabaseConfig {

	@Autowired
	private ApplicationContext applicationContext;
	
	/* 
	 * postgreSql datasource 
	 * 
	 * */
/*
	@Bean
    @ConfigurationProperties(prefix="spring.datasource.hikari.user")
    public HikariConfig hikariConfigPostgreSql() {
    	return new HikariConfig();
    }
    

    *** Redis Session clustering ****
    @Bean(name="postgreDataSources")
    public DataSource postgreDataSources() {
    	return new HikariDataSource(hikariConfigPostgreSql());
    }
*/
    
	/*
	 *  transaction 설정 
	 *  
	 *  */
/*
 * *** Redis Session clustering ****
    @Bean(name="userTransactionManager")
	public PlatformTransactionManager transactionManager() throws Exception{
		return new DataSourceTransactionManager(postgreDataSources());
	}
	
*/
    
    /* 
	 * mybatis 설정 
	 * 
	 * */
/*	
	@Bean
	@ConfigurationProperties(prefix="mybatis.configuration")
	public org.apache.ibatis.session.Configuration secondMybatisConfig(){
		return new org.apache.ibatis.session.Configuration();
	}
	

	*** Redis Session clustering ****
	@Bean(name="postgreSqlSessionFactory")
	public SqlSessionFactory postgreSqlSessionFactory(@Qualifier("postgreDataSources") DataSource dataSource) throws Exception {
		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
		sqlSessionFactoryBean.setDataSource(dataSource);
		sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:/mapper/postgreSql/*.xml"));
		sqlSessionFactoryBean.setTypeAliasesPackage("com.daumsoft.taSolutionManager.restFullApi.domain");
		sqlSessionFactoryBean.setConfiguration(secondMybatisConfig());
		return sqlSessionFactoryBean.getObject();
	}
	
	@Bean
	public SqlSessionTemplate postgreSqlSessionTemplate(@Qualifier("postgreSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
		return new SqlSessionTemplate(sqlSessionFactory);
	}
	
*/
}
