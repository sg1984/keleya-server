import config from '../config/base';
import { Dialect, Sequelize } from 'sequelize';

export const sequelize = new Sequelize(config.databaseName, config.databaseUser, config.databasePwd, {
    host: config.databaseHost,
    dialect: <Dialect>config.databaseDialect
});  
