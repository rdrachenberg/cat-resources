const url = require('url');
const fs = require('fs');
const path = require('path');

const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if(pathname === '/cats/add-cat' && req.method == 'GET') {
        let filePath = path.normalize(path.join(__dirname, '../views/addCat.html'));
        const index = fs.createReadStream(filePath);

        index.on('data', (data) =>{
            res.write(data);
        });

        index.on('end', () => {
            res.end();
        });

        index.on('error', (err) => {
            console.log(err);
        });

    } else if(pathname === '/cats/add-breed' && req.method == 'GET') {
        let filePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));
        const index = fs.createReadStream(filePath);

        index.on('data', (data) => {
            res.write(data);
        });

        index.on('end', () => {
            res.end();
        });

        index.on('error', (err) => {
            console.log(err);
        });

    } else if (pathname === '/cats/add-cat' && req.method == 'POST') {
        let form = new formidable.IncomingForm();
        form.parse(req, ( err, fields, files) => {
            if(err){
                throw err;
            }

            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join(globalPath, '../content/images' + files.upload.name));

            fs.rename(oldPath, newPath, (err) => {
                if(err){
                    throw err;
                }
                console.log('files uploaded successfully!');
            });

            fs.readFile('../data/cats.json', 'utf8', (err, data) => {
                let allCats = JSON.parse(data);
                allCats.push({id:allCats.length = 1, ...fields, image: files.upload.name});
                let json = JSON.stringify(allCats);
                fs.writeFile('../data/cats.json', json, () => {
                    res.writeHead(202, {location: '/' });
                    res.end();
                });
            });
        });
    } else {
        return true;
    }
}