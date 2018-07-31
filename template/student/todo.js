// 首先，查询学生的任务，获得一张任务表
querytodo();

// 然后，给任务表的按钮绑定两种事件，分别是“开始答题”和“查看答题情况”
window.setTimeout(function(){
  binds();
},50);


/*********************************************************/
/*********************************************************/


function querytodo(){                 
  var url = "http://localhost:8080/querytodo";          
      
  xmlHttpRequest = createXmlHttpRequest();      
           
  xmlHttpRequest.onreadystatechange = statechangedQuerytodo;      
          
  xmlHttpRequest.open("POST",url,true);
    
  xmlHttpRequest.send();        
}         
      
      
// 回调函数      
function statechangedQuerytodo(){
  var req = xmlHttpRequest;
  if(req.readyState == 4 ){
    if(req.status == 200){
      var json_str = xmlHttpRequest.responseText; // json形式的字符串
      var papers = eval('(' + json_str + ')'); // 转化为json格式
      // var user = JSON.parse(json_str); // 转化为json格式的另一种方式，较安全
      var TableDate="<th>任务</th><th>完成时间</th><th>操作</th>"
      for  (var i=0;i<papers.length;i++){
        TableDate+="<tr>"
        TableDate+=`<td>`+papers[i].papername+`</td>`
        
        // 根据返回的提交时间来判断是否已经完成
        if(papers[i].submittedAt!=""){
          TableDate+=`<td>`+papers[i].submittedAt+`</td>`
        }else{
          TableDate+=`<td>`+"未完成"+`</td>`
        }

        // 我们建立一个数组，分别包含了试卷No和任务No，并存储在按钮中
        var info=new Array()
        info[0]=papers[i].paperNo
        info[1]=papers[i].taskNo
        
        TableDate+=`<td>`+`<button value=${info}>`+"开始答题"+"</button>"
        TableDate+=`<button value=${info}>`+"查看答题情况"+"</button>"+`</td>`

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



function binds(){
	var btns = document.querySelectorAll(`button`);
   
  // 开始答题
  function viewQues(i){
    // 将字符串分割为字符串数组                      
    var inf = btns[i].value.split(',')
  	window.location = "http://localhost:8080/template/student/doing.html?paperNo="+inf[0]+"&taskNo="+inf[1]

	}                    

  // 查看答题情况
  function viewResult(i){
    // 将字符串分割为字符串数组                      
    var inf = btns[i].value.split(',')
  	window.location = "http://localhost:8080/template/student/done.html?paperNo="+inf[0]+"&taskNo="+inf[1]

	}   


	for(var j=0;j<btns.length;j=j+2){
		a1(j)
  }
  
	for(var j=1;j<btns.length;j=j+2){
		b1(j)
  }

  // 给每个按钮绑定"开始答题"函数
	function a1(j){
		btns[j].addEventListener('click', function(){
			viewQues(j)
		})
	}

  // 给每个按钮绑定"查看答题情况"函数
  function b1(j){
		btns[j].addEventListener('click', function(){
			viewResult(j)
		})
	}

}