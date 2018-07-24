 
    

// 先查询自己已经发布的任务
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
      console.log(tasks)
      var TableDate="<th>试卷名称</th><th>到期时间</th><th>类型</th><th>所属班级</th><th>任务完成情况</th><th></th>"
      for (var i=0;i<tasks.length;i++){
        TableDate+="<tr>"
        TableDate+=`<td>`+tasks[i].papername+`</td>`
        TableDate+=`<td>`+tasks[i].deadline+`</td>`
        TableDate+=`<td>`+tasks[i].type+`</td>`
        TableDate+=`<td>`+tasks[i].classname+`</td>`
        TableDate+=`<td>`+`<button type="button" value=${tasks[i].taskid}>`+"查看完成情况"+"</button>"+`</td>`
        TableDate+="</tr>"

      } 
      TableDate+="<tr>"
      TableDate+=`<td>`+ `<select name="paperNo" id="select-paper" class="select">   
                  </select> `+`</td>`
      TableDate+=`<td>`+ `<input type='date' name="deadline">`+`</td>`
      TableDate+=`<td>`+ `<select name="type" class="select">   
                          <option value="test" >测试</option>
                          <option value="exam" >考试</option>
                          <option value="practice">练习</option>
                  </select> `+`</td>`
      TableDate+=`<td>`+ `<select name="classname" id="select-class" class="select">   
                  </select> `+`</td>`
      TableDate+=`<td>`+ `<button type='submit'>`+"确认发布"+`</td>`
      TableDate+="</tr>"

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

},30);

window.setTimeout(function(){

  querypapers();

},50);

window.setTimeout(function(){


  queryclasses();
},70);


function binds(){
    var btns = document.querySelectorAll(`button`);
    console.log(btns)
    // 查看成绩单
    function view(j){                        

        querytask(btns[j].value);

    }                    

    for(var j=0;j<btns.length;j++){
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
        
	var url = "http://localhost:8080/querytask";          
	   
	xmlHttpRequest = createXmlHttpRequest();      
	 
	xmlHttpRequest.onreadystatechange = statechanged3;      
		       
	xmlHttpRequest.open("POST",url,true);
     
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
          TableDate+=`<td>未完成</td>`
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


// 查询目前可用的试卷
function querypapers(){      
        
  var url = "http://localhost:8080/querypapers";       
	   
	xmlHttpRequest = createXmlHttpRequest();      
	 
	xmlHttpRequest.onreadystatechange = statechanged4;      
		       
	xmlHttpRequest.open("POST",url,true);
     
	xmlHttpRequest.send();

} 

      
// 回调函数      
function statechanged4(){
  var req = xmlHttpRequest;
  if(req.readyState == 4 ){
    if(req.status == 200){
      var json_str = xmlHttpRequest.responseText; // json形式的字符串
      var papers = eval('(' + json_str + ')'); // 转化为json格式
      console.log(papers)
      // var user = JSON.parse(json_str); // 转化为json格式的另一种方式，较安全
      var sel = document.getElementById("select-paper")
      for  (var i=0;i<papers.length;i++){
        opti = document.createElement("option")
        opti.value = papers[i].id
        opti.textContent=papers[i].papername
        sel.appendChild(opti)
      } 

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




// 查询我执教的班级
function queryclasses(){      
        
  var url = "http://localhost:8080/queryclass";       
	   
	xmlHttpRequest = createXmlHttpRequest();      
	 
	xmlHttpRequest.onreadystatechange = statechanged5;      
		       
	xmlHttpRequest.open("POST",url,true);
     
	xmlHttpRequest.send();

} 

      
// 回调函数      
function statechanged5(){
  var req = xmlHttpRequest;
  if(req.readyState == 4 ){
    if(req.status == 200){
      var json_str = xmlHttpRequest.responseText; // json形式的字符串
      var classes = eval('(' + json_str + ')'); // 转化为json格式
      // var user = JSON.parse(json_str); // 转化为json格式的另一种方式，较安全
      var sel = document.getElementById("select-class")
      for  (var i=0;i<classes.length;i++){
        opti = document.createElement("option")
        opti.textContent=classes[i].classname
        sel.appendChild(opti)
      } 

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


