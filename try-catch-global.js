var fs = require('fs');
var _ = require('lodash');
var UglifyJS = require('uglify-js');

var isASTFunctionNode = function (node) {
    return node instanceof UglifyJS.AST_Defun || node instanceof UglifyJS.AST_Function;
}

var globalFuncTryCatch = function (inputCode, errorHandler) {
    if(!_.isFunction(errorHandler)){
        throw 'errorHandler should be a valid function';
    }
    var errorHandlerSource = errorHandler.toString();
    var errorHandlerAST = UglifyJS.parse('(' + errorHandlerSource + ')(error);');
    var tryCatchAST = UglifyJS.parse('try{}catch(error){}');
    var inputAST = UglifyJS.parse(inputCode);
    var topFuncScope = [];

    //将错误处理函数包裹进入catch中
    tryCatchAST.body[0].bcatch.body[0] = errorHandlerAST;

    //搜集所有函数
    var walker = new UglifyJS.TreeWalker(function (node) {
        if (isASTFunctionNode(node)) {
            topFuncScope.push(node);
        }
    });
    inputAST.walk(walker);

    //对函数进行变换, 添加try catch语句
    var transfer = new UglifyJS.TreeTransformer(null,
        function (node) {
            if (isASTFunctionNode(node) && _.includes(topFuncScope, node)) {
                //函数内部代码搜集
                var stream = UglifyJS.OutputStream();
                for (var i = 0; i < node.body.length; i++) {
                    node.body[i].print(stream)
                }
                var innerFuncCode = stream.toString();

                //清除try catch中定义的多余语句
                tryCatchAST.body[0].body.splice(0, tryCatchAST.body[0].body.length);

                //用try catch包裹函数代码
                var innerTyrCatchNode = UglifyJS.parse(innerFuncCode, {toplevel: tryCatchAST.body[0]});

                //获取函数壳
                node.body.splice(0, node.body.length);

                //生成有try catch的函数
                return UglifyJS.parse(innerTyrCatchNode.print_to_string(), {toplevel: node});
            }
        });
    inputAST.transform(transfer);
    var outputCode = inputAST.print_to_string({beautify: true});
    return outputCode;
}

module.exports.globalFuncTryCatch = globalFuncTryCatch;
