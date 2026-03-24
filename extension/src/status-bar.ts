import * as vscode from 'vscode';

/**
 * 状态栏管理：显示部署进度
 */
export class StatusBar implements vscode.Disposable {
  private item: vscode.StatusBarItem;
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.item.command = 'previewship.deploy';
  }

  /** 空闲状态 */
  idle(): void {
    this.clearTimer();
    this.item.text = '$(cloud-upload) PreviewShip';
    this.item.tooltip = 'Click to deploy current workspace';
    this.item.show();
  }

  /** 打包中 */
  packing(): void {
    this.clearTimer();
    this.item.text = '$(loading~spin) Packing...';
    this.item.tooltip = 'Packing workspace files';
  }

  /** 上传中 */
  uploading(): void {
    this.clearTimer();
    this.item.text = '$(loading~spin) Uploading...';
    this.item.tooltip = 'Uploading to PreviewShip';
  }

  /** 构建中 */
  building(): void {
    this.clearTimer();
    this.item.text = '$(loading~spin) Building...';
    this.item.tooltip = 'Deploying to Vercel';
  }

  /** 部署成功 */
  ready(): void {
    this.clearTimer();
    this.item.text = '$(check) Preview Ready';
    this.item.tooltip = 'Deployment successful';
    this.resetTimer = setTimeout(() => this.idle(), 5000);
  }

  /** 部署失败 */
  failed(): void {
    this.clearTimer();
    this.item.text = '$(error) Deploy Failed';
    this.item.tooltip = 'Deployment failed';
    this.resetTimer = setTimeout(() => this.idle(), 5000);
  }

  dispose(): void {
    this.clearTimer();
    this.item.dispose();
  }

  private clearTimer(): void {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = undefined;
    }
  }
}
