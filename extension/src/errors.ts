import * as vscode from 'vscode';
import { ApiError } from './types';

/**
 * 后端错误码 → 用户友好提示文案
 */
const ERROR_MESSAGES: Record<string, (details?: Record<string, unknown>) => string> = {
  INVALID_API_KEY: () => 'API Key is invalid or has been revoked. Please set a new one.',
  DAILY_QUOTA_EXCEEDED: (d) => `Daily deploy limit reached (${d?.used ?? '?'}/${d?.limit ?? '?'}). Resets tomorrow.`,
  MONTHLY_QUOTA_EXCEEDED: (d) => `Monthly deploy limit reached (${d?.used ?? '?'}/${d?.limit ?? '?'}). Resets next month.`,
  MONTHLY_UPLOAD_EXCEEDED: () => 'Monthly upload limit reached. Resets next month.',
  MAX_PROJECTS_EXCEEDED: (d) => `Project limit reached (${d?.limit ?? '?'}). Upgrade to Pro or delete an existing project.`,
  ZIP_TOO_LARGE: (d) => `File too large. Current plan limit is ${d?.limit ?? '?'}MB. Check your exclude patterns.`,
  RATE_LIMITED: () => 'Too many requests. Please try again later.',
  DEPLOYMENT_NOT_FOUND: () => 'Deployment not found.',
};

/**
 * 展示 API 错误，根据错误类型提供不同的交互操作
 */
export async function showApiError(err: ApiError): Promise<void> {
  const formatter = ERROR_MESSAGES[err.code];
  const msg = formatter ? formatter(err.details) : err.message;

  if (err.status === 401) {
    // 鉴权失败 → 引导重新设置 API Key
    const action = await vscode.window.showErrorMessage(msg, 'Set API Key');
    if (action === 'Set API Key') {
      vscode.commands.executeCommand('previewship.setApiKey');
    }
  } else if (err.status === 402 || err.status === 403) {
    // 配额不足 / 项目数超限 → 引导查看套餐
    const action = await vscode.window.showWarningMessage(msg, 'View Plans');
    if (action === 'View Plans') {
      const billingUrl = vscode.workspace.getConfiguration('previewship')
        .get<string>('billingUrl', 'https://previewship.com/billing');
      vscode.env.openExternal(vscode.Uri.parse(billingUrl));
    }
  } else if (err.status === 413) {
    // 文件过大
    const action = await vscode.window.showErrorMessage(msg, 'Open Exclude Settings');
    if (action === 'Open Exclude Settings') {
      vscode.commands.executeCommand('workbench.action.openSettings', 'previewship.excludePatterns');
    }
  } else {
    vscode.window.showErrorMessage(msg);
  }
}

/**
 * 展示网络错误
 */
export function showNetworkError(): void {
  vscode.window.showErrorMessage('Network connection failed. Please check your network and PreviewShip server URL.');
}
