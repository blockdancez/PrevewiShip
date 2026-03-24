/**
 * 库导出入口 — 供 previewship-mcp 等外部包调用
 */
export { deploy, getStatus, getUsage } from './deployer.js';
export { loadConfig, saveConfig, getApiKey, getServerUrl, getConfigPath } from './config.js';
export { packDirectory, DEFAULT_EXCLUDE_PATTERNS } from './zipper.js';
export { ApiClient } from './api-client.js';
export { ApiError } from './types.js';
export { formatApiError, formatErrorJson } from './errors.js';
export type {
  DeployOptions,
  DeployResult,
  DeploymentDetail,
  UsageResponse,
  QuotaInfo,
  CreateDeploymentResponse,
  CliConfig,
} from './types.js';
