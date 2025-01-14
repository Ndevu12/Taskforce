import * as dotenv from 'dotenv';
import logger from '../src/utils/logger';

dotenv.config();

const getEnvVariable = (variable: string): string | null => {
    const value = process.env[variable];

    if (!value) {
        logger.error(`Config validation error: ${variable} is not defined`);
        return null;
    }

    return value;
};

export default getEnvVariable;
