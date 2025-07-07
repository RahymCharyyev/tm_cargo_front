module.exports = {
  apps: [
    {
      name: 'front',
      script: 'npm',
      args: ['run', 'preview'],
      time: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
