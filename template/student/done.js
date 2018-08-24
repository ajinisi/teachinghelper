


// 这是一个全局变量，代表第几题
var quesSequence = 0

/********* 下一题 **********/
button2.onclick = function(){
    if(quesSequence<questions.length-1){
			quesSequence++;
			showQuesAnswer(quesSequence)
    } else {
        alert("已是最后一题")
    }
	saveAnswer(quesSequence)
	bindli()
}
/********* 上一题 **********/
button1.onclick = function(){
    if(quesSequence>0){
			quesSequence--;
			showQuesAnswer(quesSequence)
		
    } else {
        alert("已是第一题")
	}
	saveAnswer(quesSequence)
	bindli()
}




var questions
window.setTimeout(function(){
	// 获得试卷的内容
    querypaper(theRequest.paperNo)
},20)   


window.setTimeout(function(){
    // 获得自己的答题情况
    queryResult()
},40) 


function queryResult(){
	
  var url = config.SOCKAddr+"/queryResult?taskNo="+theRequest.taskNo;          
	   
	xmlHttpRequest = createXmlHttpRequest();      
	    
	xmlHttpRequest.onreadystatechange = statechangedQueryResult;      
		       
	xmlHttpRequest.open("POST",url,true);
    
	xmlHttpRequest.send();
}

  // 回调函数      
  function statechangedQueryResult(){
	var req = xmlHttpRequest;
	if(req.readyState == 4 ){
	  if(req.status == 200){
		
		var json_str = xmlHttpRequest.responseText; // json形式的字符串
      	returnValue = eval('(' + json_str + ')'); // 转化为json格式

		// var user = JSON.parse(json_str); // 转化为json格式的另一种方式，较安全
	  }
	  else if(req.status == 404)
	  {
		alert("request url is not found");
	  }
	  else if(req.status == 401 || req.status == 403)
	  {
		
		alert("request url is forbidden or not authorized to visit.");
		
	  }
	  else
	  {
		alert("unexpected error!Status Code :"+req.status);
	  }
	}                    
  }


// 点击li标签触发里面的单选按钮，增大命中区域
window.setTimeout(function(){
	$("li").click(function(){
		var child=$(this).find("input")
		if(child.prop("checked")==false){
			child.prop("checked",true)
			$(this).css({"border-color":"#4CAF50","color":"#4CAF50"})
		}
		else{
			child.prop("checked",false)
		}
	})
},70) 


// 使得li可点击
function bindli(){
	$("li").click(function(){
		var child=$(this).find("input")
		if(child.prop("checked")==false){
			child.prop("checked",true)
			$(this).css({"border-color":"#4CAF50","color":"#4CAF50"})
		}
		else{
			child.prop("checked",false)
		}
	})
}


// 选项卡
var butto = document.getElementById("tab")

// window.onload=function(){
window.setTimeout(function(){

	// 循环生成按钮
	for (var i=0;i<questions.length;i++){
		button = document.createElement("button")
		button.id="bu"+i
		button.className="button-circ"
		button.textContent=i+1
		butto.appendChild(button)  
	}

	// 默认显示第一道题
	showQuesAnswer(quesSequence)

},90)


window.setTimeout(function(){
	bind()
},80)   

function bind(){
    var btns = document.querySelectorAll(`.button-circ`);

    for(var j=0;j<btns.length;j++){
        a1(j)
    }
    function a1(j){
        btns[j].addEventListener('click', function(){
            showQuesAnswer(j)
            i=j
        })
    }
}




// 显示学生的对错
 function showQuesAnswer(quesSequence){
	   var i=quesSequence
    // 清空，重新显示
    document.getElementById('questions').innerHTML=''

	// 可以拖动的东西 
	//document.getElementById('questions').innerHTML+="<div id='div"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'>"+"<div draggable='true' ondragstart='drag(event)' id='question"+i+"' ></div>"+"</div>"
    
    document.getElementById('questions').innerHTML+=
		`<div class='question'> 
			<div id='question${i}'></div>
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
			op+="<li class='option'>"
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

  
    // 在这里显示该题的对错
    if(returnValue.grades[i][0]=="1"){
        var x1=`<p>你的答案${mapp[returnValue.results[i][0]]}，正确答案${mapp[questions[i].answers[0]]}，回答<p style="color:green">正确:-)</p></p>`
    }else{
        var x1=`<p>你的答案${mapp[returnValue.results[i][0]]}，正确答案${mapp[questions[i].answers[0]]}，回答<p style="color:red">错误:-(</p></p>`
    }
    document.getElementById('options'+i).innerHTML+=x1

}


 // 0123到ABCD的
var mapp=['A','B','C','D']