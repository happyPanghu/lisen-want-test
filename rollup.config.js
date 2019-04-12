// rollup.config.js

import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'lib/index.js',
    output: {
        file: 'index.js',
        format: 'umd'
    },
    plugins: [resolve({
        // 将自定义选项传递给解析插件
        customResolveOptions: {
            moduleDirectory: 'node_modules'
        }
    })],
    // 指出应将哪些模块视为外部模块
    external: ['lodash']
};