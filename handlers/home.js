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

        let modifiedCats = cats.map((cat) => 
            `<li> 
                <img src="${path.join('./content/images/' + cat.image)}" alt="${cat.name}">
                <h3>${cat.name}</h3>
                <p><span>Breed: </span>${cat.breed}</p>
                <p><span>Description: </span>${cat.description}</p>
                <ul class="buttons">
                    <li class="btn edit"><a href="/cats/edit/${cat.id}">Change Info</a></li>
                    <li class="btn delete"><a href="/cats/find-home/${cat.id}">New Home</a></li>
                </ul>
            </li>`
        );
        

        fs.readFile(filePath, (err, data) => {
            if(err){
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write(404);
                // res.end();
                return;
            }
            let modifiedData = data.toString().replace('{{cats}}', modifiedCats);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(modifiedData);
            res.end();
        });
    } else {
        return true;
    }
};

/* dummy data:

< li >
    <
    img src = "https://cdn.pixabay.com/photo/2015/03/27/13/16/cat-694730_1280.jpg"
alt = "Black Cat" >
    <
    h3 > Halloweenie < /h3> <
    p > < span > Breed: < /span>Bombay Cat</p >
    <
    p > < span > Description: < /span>Dominant and aggressive to other cats. Will probably eat you in your sleep. Very cute tho.</p >
    <
    ul class = "buttons" >
    <
    li class = "btn edit" > < a href = "/cats/edit" > Change Info < /a></li >
    <
    li class = "btn delete" > < a href = "" > New Home < /a></li >
    <
    /ul> <
    /li> <
    li >
    <
    img src = "https://cdn.pixabay.com/photo/2015/06/19/14/20/cat-814952_1280.jpg"
alt = "" >
    <
    h3 > Tiger Lily < /h3> <
    p > < span > Breed: < /span>Bombay Cat</p >
    <
    p > < span > Description: < /span>Dominant and aggressive to other cats. Will probably eat you in your sleep. Very cute tho.</p >
    <
    ul class = "buttons" >
    <
    li class = "btn edit" > < a href = "" > Change Info < /a></li >
    <
    li class = "btn delete" > < a href = "" > New Home < /a></li >
    <
    /ul> <
    /li> <
    li >
    <
    img src = "https://cdn.pixabay.com/photo/2018/08/08/05/12/cat-3591348_1280.jpg"
alt = "Black Cat" >
    <
    h3 > Snow White < /h3> <
    p > < span > Breed: < /span>Bombay Cat</p >
    <
    p > < span > Description: < /span>Dominant and aggressive to other cats. Will probably eat you in your sleep. Very cute tho.</p >
    <
    ul class = "buttons" >
    <
    li class = "btn edit" > < a href = "" > Change Info < /a></li >
    <
    li class = "btn delete" > < a href = "" > New Home < /a></li >
    <
    /ul> <
    /li> <
    li >
    <
    img src = "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg"
alt = "Black Cat" >
    <
    h3 > Meowsers < /h3> <
    p > < span > Price: < /span>350$</p >
    <
    p > < span > Breed: < /span>Bombay Cat</p >
    <
    p > < span > Description: < /span>Dominant and aggressive to other cats. Will probably eat you in your sleep. Very cute tho.</p >
    <
    ul class = "buttons" >
    <
    li class = "btn edit" > < a href = "" > Change Info < /a></li >
    <
    li class = "btn delete" > < a href = "" > New Home < /a></li >
    <
    /ul> <
    /li> <
    li >
    <
    img src = "https://cdn.pixabay.com/photo/2014/04/13/20/49/cat-323262_1280.jpg"
alt = "Black Cat" >
    <
    h3 > Anakin < /h3> <
    p > < span > Breed: < /span>Bombay Cat</p >
    <
    p > < span > Description: < /span>Dominant and aggressive to other cats. Will probably eat you in your sleep. Very cute tho.</p >
    <
    ul class = "buttons" >
    <
    li class = "btn edit" > < a href = "" > Change Info < /a></li >
    <
    li class = "btn delete" > < a href = "" > New Home < /a></li >
    <
    /ul> <
    /li>

*/