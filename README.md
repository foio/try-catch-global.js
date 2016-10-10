# try-catch-global.js
A small tool to automatically wrap your code with custom global exception handler by using the technology of AST.

###run

```
npm install
cd test
node test
```

###example

for input code:

``` javascript
var test = function(){
    console.log('test');
}
```
then transform it by try-catch-global.js：

``` javascript
var outputCode = globalFuncTryCatch(inputCode, function (error) {
   console.log(error);
});
```

the output code will be:

``` javascript
var test = function() {             
    try {                           
        console.log("test");        
    } catch (error) {               
        (function(error) {          
            console.log(error);     
        })(error);                  
    }                               
};                                  
```