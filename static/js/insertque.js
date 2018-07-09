
var i=0;
function add(){
    var op="op"+i;
    document.getElementById("second_42").innerHTML+="<input type='text' id="+op+" style='margin-right:350px' name='options'> "+"<br>";
    console.log(document.getElementById("op"+i));
    i++;
}