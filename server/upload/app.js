var express = require('express')
var fs = require('fs')
var path = require('path')
var ejs = require('ejs')
var adm_zip = require('adm-zip') //需要引入adm-zip包
var bodyParser = require('body-parser')
var app = express()
var router = express.Router()
var upload = require('./fileuploads')
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-ACCESS_TOKEN, Access-Control-Allow-Origin, Authorization, Origin, x-requested-with, Content-Type, Content-Range, Content-Disposition, Content-Description");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By", ' 3.2.1');
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

app.engine('html', ejs.__express)

var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}
app.use('/', express.static(path.join(__dirname, '../../public2')));

app.use(bodyParser.urlencoded({extended: true}))
//文件上传服务
router.post('/upload', upload.single('avatar'), function (req, res, next) {
    console.log(req.body)
    if (req.file) {
        res.send('文件上传成功')
        console.log(req.file)
    }
})
// router.post('/upload', function (req, res, next) {
//     console.info(req)
// })

var questions = [
    {
        data: 213,
        num: 444,
        age: 12
    },
    {
        data: 456,
        num: 678,
        age: 13
    },
    {
        data: 456,
        num: 678,
        age: 13
    }];

app.get('/', function (req, res) {
    res.type('text/html');
    res.sendfile(path.join(__dirname, '../../public2/') + 'index.html')
})

//写个接口list
app.get('/list', function (req, res) {
    console.info(req.query)
    res.status(200)
    res.json(questions)
});

app.post('/login', function (req, res) {
    res.status(200)
    res.json({code: 1, msg: 'success', data: {name: 'testuser', token: '3927fdaf-bb8d-4a2e-860a-7f7309101fd3'}})
})

app.post('/info', function (req, res) {
    console.info(req.params)
    console.info(req.query)
    console.info(req.body)
    if (!req.query || !req.query.path) {
        res.status(200)
        res.json({code: 1, msg: 'success', data: {name: 'testuser', token: '3927fdaf-bb8d-4a2e-860a-7f7309101fd3'}})
    } else {
        fs.readFile(req.query.path, function (err, data) {
            /*
             realPath为文件路径
             第二个参数为回调函数
             回调函数的一参为读取错误返回的信息，返回空就没有错误
             二参为读取成功返回的文本内容
             */
            if (err) {
                //未找到文件
                res.writeHead(404, {
                    'content-type': 'text/plain'
                });
                res.write('404,页面不在');
                res.end();
            } else {
                var filePath = path.join(__dirname, '../../static/') + 'test.zip'
                fs.writeFile(filePath, data, function (err) {
                    if (err) console.log(err);
                    else {
                        console.log('写文件操作成功');
                        console.log('开始解压文件...');

                        var unzip = new adm_zip(filePath);
                        unzip.extractAllTo(path.join(__dirname, '../../public2/'), true);
                        console.log(path.join(__dirname, '../../public2/') + '解压文件成功...');

                        fs.unlink(filePath, function (e) {
                            if (e) throw e;
                            console.log('server,successfully deleted ' + filePath);
                        })
                    }

                    //成功读取文件
                    res.writeHead(200, {
                        'content-type': 'text/html;charset="utf-8'
                    });
                    res.write('success');
                    res.end();
                });
            }
        })
    }
    // res.status(200)
    // res.json({test: 'info'})
});

app.use(router)

app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

//配置服务端口
var server = app.listen(8889, function () {
    console.info(server)
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
})