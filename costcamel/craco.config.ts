import path from 'path';

module.exports = {
  webpack: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
};
