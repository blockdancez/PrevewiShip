import { ApiError } from './types.js';

/**
 * 错误码 → 用户友好提示
 */
const ERROR_MESSAGES: Record<string, (details?: Record<string, unknown>) => string> = {
  INVALID_API_KEY: () => 'API Key is invalid or has been revoked. Run "previewship login" to set a new one.',
  DAILY_QUOTA_EXCEEDED: (d) => `Daily deploy limit reached (${d?.used ?? '?'}/${d?.limit ?? '?'}). Resets tomorrow.`,
  MONTHLY_QUOTA_EXCEEDED: (d) => `Monthly deploy limit reached (${d?.used ?? '?'}/${d?.limit ?? '?'}). Resets next month.`,
  MONTHLY_UPLOAD_EXCEEDED: () => 'Monthly upload limit reached. Resets next month.',
  MAX_PROJECTS_EXCEEDED: (d) => `Project limit reached (${d?.limit ?? '?'}). Upgrade to Pro or delete an existing project.`,
  ZIP_TOO_LARGE: (d) => `File too large. Current plan limit is ${d?.limit ?? '?'}MB. Check your exclude patterns.`,
  RATE_LIMITED: () => 'Too many requests. Please try again later.',
  DEPLOYMENT_NOT_FOUND: () => 'Deployment not found.',
};

const BILLING_URL = 'https://previewship.com/billing';

/** 格式化 API 错误为用户友好文本 */
export function formatApiError(err: ApiError): string {
  const formatter = ERROR_MESSAGES[err.code];
  const msg = formatter ? formatter(err.details) : err.message;

  // 配额类错误附加升级链接
  if (err.status === 402 || err.status === 403) {
    return `${msg}\nUpgrade to Pro: ${BILLING_URL}`;
  }

  return msg;
}

/** 格式化错误为 JSON 结构 */
export function formatErrorJson(err: unknown): { success: false; error: { code: string; message: string; details?: Record<string, unknown> } } {
  if (err instanceof ApiError) {
    const formatter = ERROR_MESSAGES[err.code];
    return {
      success: false,
      error: {
        code: err.code,
        message: formatter ? formatter(err.details) : err.message,
        details: err.details,
      },
    };
  }

  return {
    success: false,
    error: {
      code: 'UNKNOWN',
      message: err instanceof Error ? err.message : 'An unknown error occurred',
    },
  };
}
