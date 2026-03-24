import archiver from 'archiver';
import { PassThrough } from 'node:stream';

/**
 * 将工作区目录打包为 zip Buffer
 * @param workspacePath 工作区根目录
 * @param excludePatterns 排除的 glob 模式列表
 * @returns zip 文件内容的 Buffer
 */
export function packWorkspace(workspacePath: string, excludePatterns: string[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const passthrough = new PassThrough();
    passthrough.on('data', (chunk: Buffer) => chunks.push(chunk));
    passthrough.on('end', () => resolve(Buffer.concat(chunks)));

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', reject);
    archive.on('warning', (err) => {
      if (err.code !== 'ENOENT') reject(err);
    });

    archive.pipe(passthrough);
    archive.glob('**/*', {
      cwd: workspacePath,
      ignore: excludePatterns,
      dot: false,
    });
    archive.finalize();
  });
}
