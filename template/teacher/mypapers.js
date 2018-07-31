//XmlHttpRequest对象      
function createXmlHttpRequest(){      
    if(window.ActiveXObject){ //如果是IE浏览器      
        return new ActiveXObject("Microsoft.XMLHTTP");      
    }else if(window.XMLHttpRequest){ //非IE浏览器      
        return new XMLHttpRequest();      
    }      
}      


// 查询该老师下的全部试卷
function querypapers(){           
  var url = "http://localhost:8080/querypapers";               
  xmlHttpRequest = createXmlHttpRequest();                   
  xmlHttpRequest.onreadystatechange = statechanged2;              
  xmlHttpRequest.open("POST",url,true);  
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
      window.location = "http://localhost:8080/template/user/login.html";
      alert("request url is forbidden or not authorized to visit.");
    }
    else
    {
      alert("unexpected error!Status Code :"+req.status);
    }
  }                    
}



// 首先查询试卷库的全部试卷
querypapers()

// 然后给按钮绑定查看、删除、修改功能
window.setTimeout(function(){
  bind();
  },50);

var questions

function bind(){
	var btns = document.querySelectorAll(`button`);
  
  // 查看试卷函数
  function view(i){                        

  	querypaper(btns[i].value);

  	window.setTimeout(function(){
      for  (var k=0;k<questions.length;k++){
        showquestion(k)
      } 
  	},70);
	}                    
  
  // 一列总共三个按钮
	for(var j=0;j<btns.length;j=j+3){
		bindView(j)
  }
  for(var j=0;j<btns.length;j=j+3){
		bindEdit(j)
  }
	for(var j=0;j<btns.length;j=j+3){
		bindDelete(j)
  }

  // 给每个"查看"按钮绑定查看试卷函数
	function bindView(j){
		btns[j].addEventListener('click', function(){
			view(j)
		})
	}
}




  function showquestion(i){


    // 可以拖动的东西 
    //document.getElementById('questions').innerHTML+="<div id='div"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'>"+"<div draggable='true' ondragstart='drag(event)' id='question"+i+"' ></div>"+"</div>"
    document.getElementById('questions').innerHTML+=
        `<div class='div' ondrop='drop(event)' ondragover='allowDrop(event)'> 
            <div draggable='true' ondragstart='drag(event)' id='question${i}'></div>
        </div>`
     
    // 显示第i题
    document.getElementById('question'+i).innerHTML="<div id ="+"stem"+i+" > </div>"+"<div id = "+"options"+i+"> </div>"
  
  
    // 显示第i题 题干
    document.getElementById("stem"+i).innerHTML="题目"+(i+1)+"："+questions[i].content;
  
    // 判断题目类型
    if(questions[i].type == 'single' || questions[i].type == 'multiple') {
  
      // 显示选项
      var op = "<ol>"
      for  (var j=0;j<questions[i].options.length;j++){
        op+="<li>"
        var id1='o'+i+j
        op+="<input name='identity"+i+"' type='radio' value="+j+" id="+id1
        // check whether the option is the answer, if so, present it
        // 判断该选项是否为答案，如果是则默认选择
        if(questions[i].answers[0]==j){
          op+=" checked>"
        }else{
          op+=">"
        }
        op+="<label for="+id1+">"+(questions[i].options)[j]+"</label>"
        op+="</li>"
      } 
      op+="</ol>"
      document.getElementById('options'+i).innerHTML=op
      
  
    }
  
  
  
    // 判断题目类型
    if(questions[i].type == 'judgment') {
  
      // 显示选项
      var op = "\
                <ul><li>\
                  <input name='identity' type='radio' value=true id='i1'>\
                  <label for='i1'>正确</label>\
                </li><li>\
                  <input name='identity' type='radio' value=false id='i2'>\
                  <label for='i2'>错误</label>\
                </li></ul>\
                "
  
      document.getElementById('options'+i).innerHTML=op
      i1.oninput = function(){
          questions[i].userAnswer = i1.value
          alert(questions[i].userAnswer)
      }
      i2.oninput = function(){
          questions[i].userAnswer = i2.value
          alert(questions[i].userAnswer)
      }
      
    }   
  
    // 判断题目类型
    if(questions[i].type == 'fill') {
  
      // 显示选项
      var op = ""
      for  (var j=0;j<questions[i].answers.length;j++){
          op+="<input type='text' "
          op+=`placeholder=${questions[i].answers[j]}`
          op+=">"
      } 
      document.getElementById('options'+i).innerHTML=op
  
    }     
  
      // 如果有附件则显示附件
    if(questions[i].URL != null) {
      
      var z1=`
      <audio controls="controls" style="width:80%">
        Your browser does not support the <code>audio</code> element.
        <source src=${questions[i].URL} type="audio/wav">
      </audio>`
      document.getElementById('options'+i).innerHTML+=z1
    }
  }






