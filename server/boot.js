const path = require('path');

require('babel-register')({
    ignore: path.join(process.cwd(), 'node_modules'),
});

require('./server');
