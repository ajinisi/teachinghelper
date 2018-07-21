 
      
// XmlHttpRequest对象      
function createXmlHttpRequest(){      
    if(window.ActiveXObject){ //如果是IE浏览器      
        return new ActiveXObject("Microsoft.XMLHTTP");      
    }else if(window.XMLHttpRequest){ //非IE浏览器      
        return new XMLHttpRequest();      
    }      
}      




function querytasks(){      
  //userName = document.f1.username.value;      
  //passWord = document.f1.password.value;        
        
  //var url = "LoginServlet?username="+userName+"&password="+passWord+"";         
  var url = "http://localhost:8080/querytasks";          
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
      var tasks = eval('(' + json_str + ')'); // 转化为json格式
      // var user = JSON.parse(json_str); // 转化为json格式的另一种方式，较安全

      var TableDate="<th>试卷名称</th><th>到期时间</th><th>类型</th><th>所属班级</th><th>任务完成情况</th><th></th>"
      for (var i=0;i<tasks.length;i++){
        TableDate+="<tr>"
        TableDate+=`<td>`+tasks[i].paperNo+`</td>`
        TableDate+=`<td>`+tasks[i].deadline+`</td>`
        TableDate+=`<td>`+tasks[i].type+`</td>`
        TableDate+=`<td>`+tasks[i].classname+`</td>`
        TableDate+=`<td>`+`<button value=${tasks[i].paperNo}>`+"查看情况"+"</button>"+`</td>`
        TableDate+="</tr>"
        TableDate+="<tr>"
        TableDate+=`<td>`+ `<input type='date'>`+`</td>`
        TableDate+=`<td>`+ `<input type='select'>`+`</td>`
        TableDate+=`<td>`+ `<input type='select'>`+`</td>`
        TableDate+=`<td>`+ `<input type='select'>`+`</td>`
        TableDate+=`<td>`+ `<button type='submit'>`+"确认发布"+`</td>`
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

    //  var date=document.getElementById("input1");
    //   input1.oninput = function(){  
    //        var a = date.value;
    //        alert(a);  
    //        queryuser(a);
    //     }  


//function main(){
//   var Date = document.getElementById ("input1").value;
//  if(Date=="" && Date == undefined){
//         alert("请输入日期");
//         return false;
//  }

//  alert(Date.value);
//}


querytasks()




window.setTimeout(function(){
    binds();
},50);


function binds(){
    var btns = document.querySelectorAll(`button`);
    
    // 查看试卷函数
    function view(i){                        

        querytask(btns[i].value);

    }                    

    for(var j=0;j<btns.length;j=j+3){
        a1(j)
    }
    
    // 给每个按钮绑定查看该任务的成绩单
    function a1(j){
        btns[j].addEventListener('click', function(){
            view(j)
        })
    }
}





function querytask(n){      
	//userName = document.f1.username.value;      
	//passWord = document.f1.password.value;        
		  
	//var url = "LoginServlet?username="+userName+"&password="+passWord+"";         
	var url = "http://localhost:8080/querytask";          
	
	// 1.创建XMLHttpRequest组建      
	xmlHttpRequest = createXmlHttpRequest();      
	


	// 2.注册回调函数，函数名后面不需要加括号      
	xmlHttpRequest.onreadystatechange = statechanged3;      
		  
	// 3.初始化XMLHttpRequest组建      
	xmlHttpRequest.open("POST",url,true);
	//xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");      
		  
	//4.发送请求      
	xmlHttpRequest.send(n);
	
} 


// 回调函数      
function statechanged3(){
    var req = xmlHttpRequest;
    if(req.readyState == 4 ){
      if(req.status == 200){
        var json_str = xmlHttpRequest.responseText; // json形式的字符串
        var reports = eval('(' + json_str + ')'); // 转化为json格式
        // var user = JSON.parse(json_str); // 转化为json格式的另一种方式，较安全
  
        var TableDate="<th>学生</th><th>完成时间</th><th>任务完成情况</th>"
        for (var i=0;i<reports.length;i++){
          TableDate+="<tr>"
          TableDate+=`<td>`+reports[i].username+`</td>`
          TableDate+=`<td>`+reports[i].completiondate+`</td>`
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
