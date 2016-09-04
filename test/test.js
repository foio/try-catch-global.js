/**
 * Created by foio on 2016/9/4.
 */
var Q = require('q');
var fs = require('fs');
var path = require('path');
var  globalFuncTryCatch = require('../try-catch-global').globalFuncTryCatch;

var getFile = function (filename) {
    var deferred = Q.defer();
    fs.readFile(filename, 'utf8', function (error, data) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}


getFile(path.resolve(__dirname, 'input.js')).then(function (content) {
    var outputCode = globalFuncTryCatch(content, function (error) {
        console.log(error);
    });
    console.log(outputCode);
}).catch(function (error) {
    console.log(error);
});