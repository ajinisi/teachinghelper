// 首先查询试卷库的全部试卷
querypapers()


// 然后给按钮绑定查看、删除、修改功能
window.setTimeout(function(){
  bind();
},50);

var questions



/***************************************************************/
/***************************************************************/


// 查询该老师下的全部试卷
function querypapers(){           
  var url = config.SOCKAddr+"/querypapers";               
  xmlHttpRequest = createXmlHttpRequest();                   
  xmlHttpRequest.onreadystatechange = statechangedQueryPapers;              
  xmlHttpRequest.open("POST",url,true);  
  xmlHttpRequest.send();        
}         
      
// 回调函数      
function statechangedQueryPapers(){
  var req = xmlHttpRequest;
  if(req.readyState == 4 ){
    if(req.status == 200){
      var json_str = xmlHttpRequest.responseText; // json形式的字符串
      var papers = eval('(' + json_str + ')'); // 转化为json格式
      // var user = JSON.parse(json_str); // 转化为json格式的另一种方式，较安全

      var TableDate="<th>试卷作者</th><th>试卷名</th><th>操作</th>"
      for  (var i=0;i<papers.length;i++){
        TableDate+="<tr>"
        TableDate+=`<td>`+papers[i].classname+`</td>`
        TableDate+=`<td>`+papers[i].papername+`</td>`
        TableDate+=`<td>`+`<button value=${papers[i].id}>`+"查看"+"</button>"
        TableDate+=       `<button value=${papers[i].id}>`+"修改"+"</button>"
        TableDate+=       `<button value=${papers[i].id}>`+"删除"+"</button>"+`</td>`
        TableDate+="</tr>"
      } 

      document.getElementById('table1').innerHTML=TableDate
    }
    else if(req.status == 404)
    {
      alert("request url is not found");
    }
    else if(req.status == 401 || req.status == 403)
    {
      // 未登录，无权访问
      window.location = config.SOCKAddr+"/template/user/login.html";
      alert("request url is forbidden or not authorized to visit.");
    }
    else
    {
      alert("unexpected error!Status Code :"+req.status);
    }
  }                    
}



function bind(){
	var btns = document.querySelectorAll(`button`);
  
                  
  // 一列总共三个按钮
	for(var j=0;j<btns.length;j=j+3){
		bindView(j)
  }
  // for(var j=1;j<btns.length;j=j+3){
	// 	bindEdit(j)
  // }
	for(var j=2;j<btns.length;j=j+3){
		bindDelete(j)
  }

  // 给每个"查看"按钮绑定查看试卷函数
	function bindView(j){
		btns[j].addEventListener('click', function(){
			view(j)
		})
  }

  // 查看试卷函数
  function view(i){                        
  	querypaper(btns[i].value);
  	window.setTimeout(function(){
      for  (var k=0;k<questions.length;k++){
        showQuestion(k)
      } 
  	},70);
	}  


  // 给每个"删除"按钮绑定删除试卷函数
	function bindDelete(j){
		btns[j].addEventListener('click', function(){
			delet(j)
		})
  }

  // 删除试卷函数
  function delet(i){                        
  	deletePaper(btns[i].value);
	}  


}


// RESTful风格设计！！！
function deletePaper(paperNo){
  var url = config.SOCKAddr+"/papers";
	// var url = "http://192.168.1.129:8080/queryquesbank";          
	    
	xmlHttpRequest = createXmlHttpRequest();      
	      
	xmlHttpRequest.onreadystatechange = statechangedDeletePaper;      
		        
	xmlHttpRequest.open("DELETE",url,true);
      
	xmlHttpRequest.send(paperNo);
}

 // 回调函数      
 function statechangedDeletePaper(){
	var req = xmlHttpRequest;
	if(req.readyState == 4 ){
	  if(req.status == 200){
      location.reload();
	  }
	  else if(req.status == 404)
	  {
		alert("request url is not found");
	  }
	  else if(req.status == 401 || req.status == 403)
	  {
		
		alert("该试卷正在被某个任务使用，请先删除任务");
		
	  }
	  else
	  {
		alert("unexpected error!Status Code :"+req.status);
	  }
	}                    
}




