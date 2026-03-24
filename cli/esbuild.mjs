import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const minify = process.argv.includes('--minify');

// 构建两个入口：CLI 和库导出
const ctx = await esbuild.context({
  entryPoints: ['src/cli.ts', 'src/index.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'node20',
  sourcemap: !minify,
  minify,
  // archiver 保持外部依赖（运行时从 node_modules 加载）
  external: ['archiver'],
});

if (watch) {
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await ctx.rebuild();
  await ctx.dispose();
  console.log('Build complete.');
}
