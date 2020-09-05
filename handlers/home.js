const url = require('url');
const fs =  require('fs');
const path = require('path');
const cats = require('../data/cats');
const breeds = require('../data/breeds');


module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if(pathname === '/' && req.method === 'GET') {
        let filePath = path.normalize(
            path.join(__dirname, '../views/home/index.html')
        );

        fs.readFile(filePath, (err, data) => {
            if(err){
                console.log(err);
//! ************************ STOPPED HERE ************************//
            }
        });
    } else {
        return true;
    }
};

