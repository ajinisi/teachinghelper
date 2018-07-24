      
//XmlHttpRequest对象      
function createXmlHttpRequest(){      
    if(window.ActiveXObject){ //如果是IE浏览器      
        return new ActiveXObject("Microsoft.XMLHTTP");      
    }else if(window.XMLHttpRequest){ //非IE浏览器      
        return new XMLHttpRequest();      
    }      
}      

querytodo();


function querytodo(){      
  //userName = document.f1.username.value;      
  //passWord = document.f1.password.value;        
        
  //var url = "LoginServlet?username="+userName+"&password="+passWord+"";         
  var url = "http://localhost:8080/querytodo";          
  // 1.创建XMLHttpRequest组建      
  xmlHttpRequest = createXmlHttpRequest();      
        
  // 2.注册回调函数，函数名后面不需要加括号      
  xmlHttpRequest.onreadystatechange = statechanged2;      
        
  // 3.初始化XMLHttpRequest组建      
  xmlHttpRequest.open("POST",url,true);
  //xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");      
        
  //4.发送请求      
  xmlHttpRequest.send();        
}         
      
      
// 回调函数      
function statechanged2(){
  var req = xmlHttpRequest;
  if(req.readyState == 4 ){
    if(req.status == 200){
      var json_str = xmlHttpRequest.responseText; // json形式的字符串
      var papers = eval('(' + json_str + ')'); // 转化为json格式
      // var user = JSON.parse(json_str); // 转化为json格式的另一种方式，较安全

      var TableDate="<th>任务</th><th>完成情况</th><th>操作</th>"
      for  (var i=0;i<papers.length;i++){
        TableDate+="<tr>"
        TableDate+=`<td>`+papers[i].papername+`</td>`
        TableDate+=`<td>`+papers[i].result+`</td>`
        TableDate+=`<td>`+`<button value=${papers[i].paperNo}>`+"开始答题"+"</button>"

        TableDate+=`<button value=${papers[i].paperNo}>`+"查看答题情况"+"</button>"+`</td>`
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

      window.location = "http://localhost:8080/template/user/login.html";
      alert("request url is forbidden or not authorized to visit.");
      
    }
    else
    {
      alert("unexpected error!Status Code :"+req.status);
    }
  }                    
}




window.setTimeout(function(){
  binds();
  },50);


function binds(){
	var btns = document.querySelectorAll(`button`);
  
  // 查看试卷函数
  function view(i){                        

  	window.location = "http://localhost:8080/template/student/doing.html?som="+btns[i].value

	}                    

	for(var j=0;j<btns.length;j=j+2){
		a1(j)
  }
  
  // 给每个按钮绑定查看试卷函数
	function a1(j){
		btns[j].addEventListener('click', function(){
			view(j)
		})
	}
}