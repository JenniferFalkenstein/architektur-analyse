import * as fs from 'fs';
import * as path from 'path';
import { Config } from './types';
import logger from './helper/logger';
import { CONFIG_FILE_PATH } from './global/global-variables';

function getConfig(configPath = CONFIG_FILE_PATH): Config | null {
  const filepath = path.join(__dirname, configPath);

  if (fs.existsSync(filepath)) {
    const fileData = fs.readFileSync(filepath, 'utf-8');
    try {
      const config: Config = JSON.parse(fileData);
      return config;
    } catch (error) {
      logger.error('Fehler beim Lesen der Konfigurationsdatei:', error);
      return null;
    }
  } else {
    logger.warn('Konfigurationsdatei konnte nicht gefunden werden.');
    return null;
  }
}

export {
  getConfig
}
