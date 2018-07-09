// 获得数据库中的题目
var questions
querybank();	



$(all).bind("click",function(){    
	// 连续显示所有题目
	document.getElementById('questions').innerHTML=""
	
	for  (var i=0;i<questions.length;i++){
		showquestion(i)	
	} 
	// 连续绑定选项按钮事件
	for  (var i=0;i<questions.length;i++){
		bindoptions(i)	
	} 

});

$(choose).bind("click",function(){
    //	var x=$("questions").length;
    //	alert(x);
    //querybank1();
    
    document.getElementById('questions').innerHTML=""
    for(var i=0;i<questions.length;i++){
        if(questions[i].type=='single'||questions[i].type=="multiple"){
            console.log(questions[i].type);
            showquestion(i);
    }
}
});

$(function(){
	select(); 
})



button3.onclick = function(){
	showpaper();
}

button4.onclick = function(){
	insertpaper();
}
