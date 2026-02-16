module.exports = {
  bundle: true,
  minify: false,
  sourcemap: true,
  exclude: ['aws-sdk'],
  target: 'node20',
  define: { 'require.resolve': undefined },
  platform: 'node',
  concurrency: 10,
};
