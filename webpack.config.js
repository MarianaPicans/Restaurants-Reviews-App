var path = require("path");

const worker = path.join(__dirname, './service-worker.js');
const output = path.join(__dirname, './app');

module.exports = {
    entry : {
        worker: worker,
    },
    output : {
        path : output,
        filename : '[name].bundle.js'
    },
    watch: true,
    module : {
        rules : [
            {
                test : /\.(js|jsx)?$/,
                loader : 'babel-loader',
                exclude : /node_modules/,
                query: {
                    presets: ['env']
                }
            }
        ]
    }
};