/**
 * Created by SWSD on 2018-11-02.
 */
var router = require('koa-router');
var _rotr = new router();
var  fs = require('fs');
const apihandler=async (ctx) => {
    var apinm = ctx.params.apiname;
    console.log('API RECEIVE:', apinm);
    //匹配到路由函数,路由函数异常自动返回错误,创建xdat用来传递共享数据
    var apifn = _rotr.apis[apinm];
    ctx.xdat = {
        apiName: apinm
    };
    if (apifn && apifn.constructor == Function) {
        await apifn(ctx).then(result=>{
            ctx.body=result;
        }).catch(error=>{
            ctx.body={isException:false,errorMessage:error};
        });
    }
    else {
        ctx.body = {isException:false,errorCode:222,errMessage:'服务端找不到接口程序，api missed',errApi:apinm};
    }
};
_rotr.get('/api/:apiname', apihandler);
_rotr.post('/api/:apiname', apihandler);
var connection = require('./mysqlServer.js');
/*所有api处理函数都收集到这里必须是返回promise各个api处理函数用promise衔接,return传递ctx*/
_rotr.apis = {};
const Query = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
        connection.query(sql, values, ( err, rows) => {
            if ( err ) {
                reject( err )
            } else {
                resolve(rows )
            }
        })
    })
};

const getQueryDatas=(queryString,resolve,reject)=>{
    Query(queryString).then(result=>{
        resolve({isException:true,data:result});
    }).catch(error=>{
        reject(error)
    });
};

/*处理Api请求
 默认tenk的api直接使用
 每个app的独立api格式appname_apiname
 */
const writeFile=function( file) {
    return new Promise(( resolve, reject ) => {
        const reader = fs.createReadStream(file.path); // 创建可读流
        const upStream = fs.createWriteStream(`static/img/`+file.name); // 创建可写流
        reader.pipe(upStream); // 可读流通过管道写入可写流
        resolve('ok');
        // fs.writeFile('static/img/'+file.name,file,{},(error)=>{
        //     if(error){
        //         console.log('error+++',error)
        //         reject(error)
        //     }
        //     else{
        //         resolve('上传成功！')
        //     }
        // });
    })
};

_rotr.apis.getUserInfo = function (ctx) {
    var userId = ctx.query.userId || ctx.request.body.userId;
    console.log('>>>>>>>>>>>>',userId);
    return new Promise(function(resolve, reject){
        getQueryDatas(`select * from user`,resolve,reject);
    });
};
_rotr.apis.uploadUserImg = function (ctx) {
    var file = ctx.request.files.file;
    var userId = ctx.query.userId || ctx.request.body.userId;
    return new Promise(function(resolve, reject){
        writeFile(file).then(result=>{
            getQueryDatas(`update user set userImg="${file.name}" where userId=${userId}`,resolve,reject);
        }).catch(error=>{
            reject(error)
        });
    });
};

module.exports = _rotr;