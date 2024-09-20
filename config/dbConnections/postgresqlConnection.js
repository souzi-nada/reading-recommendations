import pkg from 'pg';
import { pgDBConnection } from '../env/index.js';
import logger from '../../common/logger/index.js';

const { Pool } = pkg;

export const initializeDB = async () => {
  const pool = new Pool({
    host: pgDBConnection.host,
    port: pgDBConnection.port,
    password: pgDBConnection.password,
    user: pgDBConnection.user,
    database: pgDBConnection.database,
    max: pgDBConnection.maxNumOfClients,
    idleTimeoutMillis: pgDBConnection.idleTimeoutMillis
  });

  try {
    const client = await pool.connect();
    logger.info('Connected to the PostgreSQL database Successfully!');
    client.release();
  } catch (error) {
    logger.error(
      `Error while connecting to the PostgreSQL database ${JSON.stringify(error)}`
    );
  }

  return pool;
};

export const closeDBConnection = async pool => {
  try {
    await pool.end();
    logger.info('PostgreSQL connection pool closed.');
  } catch (error) {
    logger.error('Error while closing PostgreSQL connection pool!', error);
  }
};
