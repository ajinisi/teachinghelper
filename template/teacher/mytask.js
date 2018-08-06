 
// 注意变量的可见性，放在外面使得全局可访问    

// 先查询自己已经发布的任务，获得一张表
querytasks()

// 给按钮绑定查看整个班级所有学生的完成情况
window.setTimeout(function(){
  bindViewAll();
},30);

// 查询该老师所拥有的试卷
window.setTimeout(function(){
  querypapers();
},50);

// 查询该老师所执教的班级
window.setTimeout(function(){
  queryclasses();
},70);

/*******************************************************************/
/*******************************************************************/

function querytasks(){           
  var url = config.SOCKAddr+"/querytasks";          
    
  xmlHttpRequest = createXmlHttpRequest();      
         
  xmlHttpRequest.onreadystatechange = statechangedQuerytasks;      
           
  xmlHttpRequest.open("POST",url,true);
   
  xmlHttpRequest.send();        
}         
      
      
// 回调函数      
function statechangedQuerytasks(){
  var req = xmlHttpRequest;
  if(req.readyState == 4 ){
    if(req.status == 200){
      var json_str = xmlHttpRequest.responseText; // json形式的字符串
      var tasks = eval('(' + json_str + ')'); // 转化为json格式
      // var user = JSON.parse(json_str); // 转化为json格式的另一种方式，较安全

      var TableDate="<th>试卷名称</th><th>到期时间</th><th>类型</th><th>所属班级</th><th>任务完成情况</th><th></th>"
      for (var i=0;i<tasks.length;i++){
        TableDate+="<tr>"
        TableDate+=`<td>`+tasks[i].papername+`</td>`
        TableDate+=`<td>`+tasks[i].deadline+`</td>`
        TableDate+=`<td>`+tasks[i].type+`</td>`
        TableDate+=`<td>`+tasks[i].classname+`</td>`
        TableDate+=`<td>`+`<button type="button" value=${tasks[i].taskid}>`+"查看全班完成情况"+"</button>"+`</td>`
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

      window.location = config.SOCKAddr+"/template/user/login.html";
      alert("request url is forbidden or not authorized to visit.");
      
    }
    else
    {
      alert("unexpected error!Status Code :"+req.status);
    }
  }                    
}




function bindViewAll(){

  var btns = document.querySelectorAll(`button`);
            
  for(var j=0;j<btns.length;j++){
      a1(j)
  }
  
  // 给每个按钮绑定
  function a1(j){
    btns[j].addEventListener('click', function(){
      querytask(btns[j].value)
    })
  }
}

function querytask(n){      
        
	var url = config.SOCKAddr+"/querytask";          
	   
	xmlHttpRequest = createXmlHttpRequest();      
	 
	xmlHttpRequest.onreadystatechange = statechangedQuerytask;      
		       
	xmlHttpRequest.open("POST",url,true);
     
  xmlHttpRequest.send(n);
  
  // 充分的时间回调
  window.setTimeout(function(){
    // 给按钮绑定查看具体某一个学生的答题情况
    bindViewOne()
  },50);
  
  // 整个表都表示一个任务，它们的任务taskNo也是相同的，用这个数组第二位来存储它
  info[1]=n

} 

// 我们建立一个数组，分别包含了学生学号和任务No，并存储在按钮中
var info=new Array()

// 回调函数      
function statechangedQuerytask(){
    var req = xmlHttpRequest;
    if(req.readyState == 4 ){
      if(req.status == 200){
        var json_str = xmlHttpRequest.responseText; // json形式的字符串
        var reports = eval('(' + json_str + ')'); // 转化为json格式
        // var user = JSON.parse(json_str); // 转化为json格式的另一种方式，较安全
  
        var TableDate="<th>学生</th><th>完成时间</th><th>查看该同学的答题情况</th>"
        for (var i=0;i<reports.length;i++){
          TableDate+="<tr>"
          TableDate+=`<td>`+reports[i].username+`</td>`

          // 根据返回的提交时间来判断是否已经完成
          if(reports[i].submittedAt!=""){
            TableDate+=`<td>`+reports[i].submittedAt+`</td>`
          }else{
            TableDate+=`<td>`+"未完成"+`</td>`
          }

          // 用数组的第一位来存储学生的学号
          info[0]=reports[i].username
          // 由querytask(n)传入的taskNo

          TableDate+=`<td>`+`<button type="button" value=${info}>`+"查看答题情况"+"</button>"+`</td>`

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
  
        window.location = config.SOCKAddr+"/template/user/login.html";
        alert("request url is forbidden or not authorized to visit.");
        
      }
      else
      {
        alert("unexpected error!Status Code :"+req.status);
      }
    }                    
  }



         

function bindViewOne(){
  var btns = document.querySelectorAll(`button`);
      
  function viewResult(i){
    // 将字符串分割为字符串数组
    var inf = btns[i].value.split(',')                     
    window.location = config.SOCKAddr+"/template/teacher/doneTeacher.html?username="+inf[0]+"&taskNo="+inf[1]
  }  
  
  for(var j=0;j<btns.length;j++){
      a1(j)
  }
  
  // 给每个按钮绑定查看该任务的成绩单
  function a1(j){
      btns[j].addEventListener('click', function(){
        viewResult(j)
      })
  }

}





// 查询目前可用的试卷
function querypapers(){      
        
  var url = config.SOCKAddr+"/querypapers";       
	   
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

      window.location = config.SOCKAddr+"/template/user/login.html";
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
        
  var url = config.SOCKAddr+"/queryclass";       
	   
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

      window.location = config.SOCKAddr+"/template/user/login.html";
      alert("request url is forbidden or not authorized to visit.");
      
    }
    else
    {
      alert("unexpected error!Status Code :"+req.status);
    }
  }                    
}


