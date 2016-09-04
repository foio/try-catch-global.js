/**
 * Created by foio on 2016/9/3.
 */

function parent1(num1,num2){
    var num3 = 1;
    var num4 = 3;
    function child1(){
        console.log('This is child1 function');
    }
    console.log('This is parent1 function');
    child1();
    console.log(num1 + num2 + num3 + num4);
}

(function(msg){
    console.log(msg);
})();

var test = function(){
    console.log('test');
}