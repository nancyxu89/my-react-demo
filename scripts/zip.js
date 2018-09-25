// 请求模块
var fs = require('fs');
var path = require('path');
var archiver = require('archiver');
var serverHttp = require('axios')
serverHttp.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 创建生成的压缩包路径
var output = fs.createWriteStream(path.join(__dirname, '../') + 'dist.zip');
var archive = archiver('zip')
// var archive = archiver('zip', {
//     zlib: {
//         level: 9
//     } // 设置压缩等级
// });

// 'close' 事件监听
output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');

    var readerStream = fs.createReadStream(path.join(__dirname, '../') + 'dist.zip')

    var data = ''
    // 设置编码为 utf8。
    readerStream.setEncoding('UTF8');

    // 处理流事件 --> data, end, and error
    readerStream.on('data', function (chunk) {
        data += chunk;
    });

    readerStream.on('end', function () {
        // console.log(data);

        let localPath = path.join(__dirname, '../') + 'dist.zip'
        serverHttp({
            method: 'post',
            url: 'http://192.168.205.176:8889/info',
            params: {
                path: localPath
                // path:'/Users/lvzhaohua/Documents/mydemo/dist.zip'
            }
        }).then((rst) => {
            console.info(rst.data)
            if (rst.data === 'success') {
                fs.unlink(localPath, function (e) {
                    if (e) throw e;
                    console.log('删除本地临时文件 ' + localPath);
                })
            }
        })
    });

    readerStream.on('error', function (err) {
        console.log(err.stack);
    });

});

// 'end' 事件监听
output.on('end', function () {
    console.log('Data has been drained');
});

// 'warnings' 事件监听
archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        // 打印警告
    } else {
        // throw error
        throw err;
    }
});

// 'error' 事件监听
archive.on('error', function (err) {
    throw err;
});

// pipe 方法
archive.pipe(output);

archive.directory('./build', false)

//执行
archive.finalize();
