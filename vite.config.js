const path = require('path')

export default {
  base: "/image-tools/",
  root: path.resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '~sass': path.resolve(__dirname, 'node_modules/sass'),
    }
  },
  server: {
    port: 8080,
    hot: true
  }
}