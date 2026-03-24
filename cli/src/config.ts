import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import type { CliConfig } from './types.js';

const CONFIG_DIR = path.join(os.homedir(), '.previewship');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const DEFAULT_SERVER_URL = 'https://api.previewship.com';

/** 读取配置文件 */
export function loadConfig(): CliConfig {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(raw) as CliConfig;
  } catch {
    return {};
  }
}

/** 保存配置文件 */
export function saveConfig(config: CliConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

/** 获取配置文件路径 */
export function getConfigPath(): string {
  return CONFIG_FILE;
}

/**
 * 获取 API Key（环境变量优先于配置文件）
 */
export function getApiKey(): string | undefined {
  return process.env.PREVIEWSHIP_API_KEY || loadConfig().apiKey;
}

/**
 * 获取服务器地址（环境变量优先于配置文件）
 */
export function getServerUrl(): string {
  return (
    process.env.PREVIEWSHIP_SERVER_URL ||
    loadConfig().serverUrl ||
    DEFAULT_SERVER_URL
  ).replace(/\/+$/, '');
}
