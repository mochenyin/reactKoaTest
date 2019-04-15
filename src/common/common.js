/**
 * Created by SWSD on 2018-11-02.
 */
const parseData=(data,type)=>{
    if(!data){
        return '';
    }
    let newData=type==='GET'?'?':'';
    if(typeof data==='string'||typeof data==='number'){
        newData='1='+data;
    }
    else if(typeof data==='object'){
        if(isNaN(data.length)){
            for(let key in data){
                newData+=key+'='+data[key]+'&';
            }
        }
        else{
            newData.forEach((item,index)=>{
                newData+=index+'='+item+'&'
            })
        }
        if(newData.length)
        newData.substring(0,newData.length-1)
    }
    else{
        newData='errorData=1'
    }
    return newData;
};

export const Ajax={
    get: function(url,data) {
        // XMLHttpRequest对象用于在后台与服务器交换数据
        return new Promise(function(resolve, reject){
            var xhr = new XMLHttpRequest();
            let dataStr=parseData(data,'GET');
            xhr.open('GET', '/api'+url+dataStr, true);
            xhr.onreadystatechange = function() {
                // readyState == 4说明请求已完成
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    // 从服务器获得数据
                    resolve(xhr.responseText);
                }
                if(xhr.readyState == 4&&(xhr.status !== 200 || xhr.status !== 304)){
                   reject(xhr.statusText);
                }
            };
            xhr.send();
        });
    },
    // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
    post: function (url, data) {
        return new Promise(function(resolve, reject){
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api'+url, true);
            // 添加http头，发送信息至服务器时内容编码类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                // readyState == 4说明请求已完成
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    // 从服务器获得数据
                    resolve(xhr.responseText);
                }
                if(xhr.readyState == 4&&(xhr.status !== 200 || xhr.status !== 304)){
                    reject(xhr.statusText);
                }
            };
            xhr.send(parseData(data,'POST')||null);
        });
    }
};
