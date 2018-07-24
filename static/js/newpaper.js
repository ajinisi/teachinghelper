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



button_view.onclick = function(){
	showpaper();
}

button_insert.onclick = function(){
	
	
	insertpaper();
}



function insertpaper(){
	var paperName=prompt("请输入试卷名称","期中考试");
	if (paperName!=null && paperName!=""){
		alert(paperName)
		var que=document.getElementById("div_paper").childNodes
		console.log(que)
		var sen=new Array(que.length-1);
		for(var i=0;i<que.length-1;i++){
			sen[i]=que[i+1].id.slice(8)
		}
		sen.join(",")
       
		var url = "http://localhost:8080/insertpaper?papername="+paperName+"&papercontent="+sen;      
		
		// // 1.创建XMLHttpRequest组建      
		xmlHttpRequest = createXmlHttpRequest();      
		


		// // 2.注册回调函数，函数名后面不需要加括号      
		xmlHttpRequest.onreadystatechange = statechanged1;      
			
		// // 3.初始化XMLHttpRequest组建      
		xmlHttpRequest.open("POST",url,true);
		// //xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");      
			
		// //4.发送请求      
		xmlHttpRequest.send();
		
		}
	else{
		alert("请输入试卷名称！")
	}
}   

  
  function statechanged1(){
	var req = xmlHttpRequest;
	if(req.readyState == 4 ){
	  if(req.status == 200){
		  alert("sucess")
	  }
	  else if(req.status == 404)
      {
        alert("request url is not found");
      }
      else if(req.status == 401 || req.status == 403)
      {
  
        window.location = "http://localhost:8080/template/user/login.html";
        alert("request url is forbidden or not authorized to visit.");
        
      }
      else
      {
        alert("unexpected error!Status Code :"+req.status);
      }
	}
}


