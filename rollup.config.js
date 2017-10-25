export default {
    entry: 'index.js',
    dest: 'bundles/atomic-cesium.umd.js',
    sourceMap: 'inline',
    format: 'umd',
    exports: 'named',
    onwarn: function(warning) {},
    moduleName: 'atomic-cesium',
    globals: {}
};
