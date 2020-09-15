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

    } else if (pathname.includes('/cats/edit') && req.method == 'GET') {
        let filepath = path.normalize(path.join(__dirname, '../views/editCat.html'));
        const index = fs.createReadStream(filepath);

        index.on('data', (data) => {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

        fs.readFile(filepath, (err, data) => {
            if(err){
                console.log(err);

                res.end();
                return;
            }
            
            let id = pathname.split('/')[3];
            console.log(id);
            let catToEdit = cats.find((cat) => cat.id == id);
            // console.log(catToEdit);
            
            let catBreedTemp = breeds.map((breed) => {
                return `<option value = "${breed}">${breed}</option>`;
            });

            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedTemp.join(""));
            modifiedData = modifiedData.toString().replace('{{name}}', catToEdit.name);

            modifiedData = modifiedData.toString().replace('{{description}}', catToEdit.description);
            modifiedData = modifiedData.toString().replace('{{id}}', catToEdit.id);
            
            res.write(`${modifiedData}`);
            console.log('test');
            res.end();
        });
        // res.writeHead(200, {
        //     'Content-Type': 'text/html'
        // });
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
                    res.writeHead(302, {Location: '/'});
                    console.log('The breed was uploaded');
                    res.end();
                    
                });
            });

            // res.writeHead(202, { location: "/" });
            // res.end();
        });
    } else if (pathname === '/cats/add-cat' && req.method == 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, ( err, fields, files) => {
            if(err){
                throw err;
            }

            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join(__dirname, '../content/images/' + files.upload.name));

            fs.rename(oldPath, newPath, (err) => {
                if(err){
                    throw err;
                }
                console.log('files uploaded successfully!');
            });

            fs.readFile('./data/cats.json', 'utf8', (err, data) => {
                let allCats = JSON.parse(data);
                let id = 1;

                if(allCats.length >= 1){
                    id = allCats.length + 1;
                }

                allCats.push({
                    id:id,
                    ...fields,
                    image: files.upload.name

                });
                let json = JSON.stringify(allCats);

                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(302, {Location: '/'});
                    res.end();
                });
            });
        });
    } else if (pathname.includes('/cats/edit') && req.method == 'POST') {
        let id = pathname.split('/')[3];
        let catToEdit = cats.find((cat) => cat.id == id);

        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if(err){
                throw err; 
            }
            if(files.upload.name != catToEdit.image){
                let oldPath = files.upload.path;

                let newPath = path.normalize(path.join(__dirname, '../content/images/' + files.upload.name));

                // fs.rename(oldPath, newPath, function(err) {
                //     if(err){
                //         throw err;
                //     }
                //     console.log('The image was uploaded!');
                // });
                fs.copyFile(oldPath, newPath, function (err) {
                    if(err) 
                    throw err;
                    console.log('Image uploaded successfully!!!!');
                });
            }

            fs.readFile('./data/cats.json', 'utf8', (err, data) => {
            
                let allCats = JSON.parse(data);
                console.log(allCats);
                let image = files.upload.name;

                let currCat = allCats.filter((cat) => cat.id = id)[0];
                console.log(currCat);
                
                for(let item in fields) {
                    if(fields[item]!= currCat[item]) {
                        currCat[item] = fields[item];
                    }
                }

                if(currCat[image] != image){
                    currCat[image] = image;
                }

                let json = JSON.stringify(allCats);

                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(302, {Location: '/'});
                    res.end();
                });
            });
        });
    }
    
    else if (pathname === '/cats/find-home' && req.method == 'POST') {
    
    } else {
        return true;
    }
}

 /*
    content to use for cat upload description: 
    Like dogs, cats look very different from people but share many of our body’ s characteristics, such as a circulatory system, lungs, a digestive tract, a nervous system, and so on.
    There are many different breeds of cats, including Abyssinian, Himalayan, Maine Coon, Manx, Persian, Scottish Fold, and Siamese, to name a few.There are 40 distinct breeds, according to Cat Franciers' Association. 
    The most familiar cats are the domestic shorthair and the domestic longhair, which are really mixtures of different breeds.Cat breeds differ in looks, coat length, and other characteristics but vary relatively little in size.On average, only 5 to 10 pounds separate the smallest and largest domestic breeds of cats.
    Cats also share the rapid metabolism that dogs have, which results in a higher heart rate, respiratory rate, and temperature than those of people(see Table: Normal Feline Physiologic Values).Cats generally live longer than dogs, and many live to be 20 years old or older.
*/
 // let image = files.upload.name;

 // currCat = allCats.filter((cat) => cat.id = id)[0];
 // console.log(currCat);

 // for(let item in fields){
 //     console.log(item);

 //     if(fields[item]!= currCat[item]){
 //         currCat[item] = fields[item];
 //     }
 // }
 // if(currCat[image]!= currCat[image]){
 //     currCat[image] = currCat[image];
 // }

 // allCats.push({id:allCats.length = 1, ...fields, image: files.upload.name});
 // let json = JSON.stringify(allCats);
 // fs.writeFile('../data/cats.json', json, () => {
 //     res.writeHead(202, {location: '/' });
 //     res.end();
 // });