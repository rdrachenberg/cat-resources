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
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);
            res.write(modifiedData);
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
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
        });

        index.on('end', () => {
            res.end();
        });

        index.on('error', (err) => {
            console.log(err);
        });

    } else if (pathname === '/cats/add-breed' && req.method == 'POST') {
        console.log('POST Hit! ');
        let formData = '';

        // formData.writeHead(200, {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // });

        req.on('data', (data) => {
            formData += data;
        });

        req.on('end', () => {
            let body = qs.parse(formData);
            console.log(body);
            fs.readFile('./data/breeds.json', (err, data) => {
                if(err){
                    throw err;
                }

                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);

                fs.writeFile('./data/breeds.json', json, 'utf-8', () =>{ 
                    res.writeHead(202, {location: '/' });
                    console.log('The breed was uploaded');
                    res.end();
                    
                });
            });

            // res.writeHead(202, { location: "/" });
            // res.end();
        });
    }
    
    else if (pathname === '/cats/add-cat' && req.method == 'POST') {
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