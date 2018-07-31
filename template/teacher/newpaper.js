// 首先获得数据库中的题目
var questions
querybank();	

// 给选择按钮绑定筛选函数

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

function bindoptions(i){
	var btns = document.querySelectorAll(`[name="identity${i}"]`);
				
	function bgChange(o){                        
			questions[i].userAnswer = o.value
			alert(questions[i].userAnswer)
	}                    

	for(var j=0;j<btns.length;j++){
		a1(j)
	}

	function a1(j){
		btns[j].addEventListener('click', function(){
			bgChange(eval('o'+i+j))
		})
	}
}




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




// 预览试卷和确认试卷按钮
button_view.onclick = function(){
	showPaper();
}

button_insert.onclick = function(){	
	insertpaper();
}



function showquestion(i){


	// 可以拖动的东西 
	//document.getElementById('questions').innerHTML+="<div id='div"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'>"+"<div draggable='true' ondragstart='drag(event)' id='question"+i+"' ></div>"+"</div>"
	document.getElementById('questions').innerHTML+=
			`<div class='div' ondrop='drop(event)' ondragover='allowDrop(event)'> 
					<div draggable='true' ondragstart='drag(event)' id='question${questions[i].id}'></div>
			</div>`
	 
	// 显示第i题
	document.getElementById('question'+questions[i].id).innerHTML="<div id ="+"stem"+i+" > </div>"+"<div id = "+"options"+i+"> </div>"


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

  

//  <audio src=${questions[i].URL} autoplay>
// Your browser does not support the <code>audio</code> element.
// </audio>




function insertpaper(){
	var paperName=prompt("请输入试卷名称","例如期中考试");
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
		xmlHttpRequest.onreadystatechange = statechangedInsertpaper;      
			
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

  
  function statechangedInsertpaper(){
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


