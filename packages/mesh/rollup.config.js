import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'lib/index.js',
  dest: 'lib/bundle.js',
  format: 'iife',
  moduleName: 'mesh',
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),

    commonjs({ 
      globals: ['reflect-metadata']
    })
  ]
};