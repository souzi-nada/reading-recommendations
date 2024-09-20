import { Sequelize } from 'sequelize';
import { pgDBConnection } from '../env/index.js';
import logger from '../../common/logger/index.js';

export const sequelize = new Sequelize(
  pgDBConnection.database,
  pgDBConnection.user,
  pgDBConnection.password,
  {
    host: pgDBConnection.host,
    port: pgDBConnection.port,
    dialect: 'postgres',
    pool: {
      max: pgDBConnection.maxNumOfClients,
      idle: pgDBConnection.idleTimeoutMillis
    },
    logging: msg => logger.info(msg)
  }
);

export const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info(
      'Connected to the PostgreSQL database successfully using Sequelize!'
    );
    sequelize.sync();
  } catch (error) {
    logger.error(
      `Error while connecting to the PostgreSQL database: ${error.message}`
    );
  }
};

export const closeDBConnection = async () => {
  try {
    await sequelize.close();
    logger.info('PostgreSQL connection closed using Sequelize.');
  } catch (error) {
    logger.error('Error while closing the PostgreSQL connection!', error);
  }
};
