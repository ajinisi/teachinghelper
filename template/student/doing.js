

// 这是一个全局变量，代表第几题，默认显示第一题
var quesSequence = 0
// 这是一个标记变量，代表提交前后
var mark =0

// 首先获得试卷的内容
var questions
window.setTimeout(function(){
	querypaper(theRequest.paperNo)
},20)   

// 然后使得当前页面的li元素可点击
window.setTimeout(function(){
	bindli(quesSequence)
},70) 

/***********************************************/
/***********************************************/


/********* 下一题 **********/
button2.onclick = function(){
    if(quesSequence<questions.length-1){
		quesSequence++;
		if(mark==0){
			showquestion(quesSequence);
		}else{
			showQuesAnswer(quesSequence)
		}
    } else {
        alert("已是最后一题")
    }
	// saveAnswer(quesSequence)
	bindli(quesSequence)
}
/********* 上一题 **********/
button1.onclick = function(){
    if(quesSequence>0){
		quesSequence--;
		if(mark==0){
			showquestion(quesSequence);
		}else{
			showQuesAnswer(quesSequence)
		}
    } else {
        alert("已是第一题")
	}
	// saveAnswer(quesSequence)
	bindli(quesSequence)
}

/********* 提交学生的答案 *********/
button3.onclick = function(){
	quesSequence = 0
	insertResult()
}


// 局部的样式调整
var liBeforeClick = {"border-color":"","color":""}
var liAfterClick = {"border-color":"#4CAF50","color":"#4CAF50"}

// 点击li标签触发里面的单选按钮，增大命中区域
function bindli(quesSequence){
	var i = quesSequence
	$("li").click(function(){
		
		// 重置所有li元素的样式
		$("li").css(liBeforeClick)
		
		// 获得input元素，并判断它的点击状态
		var child=$(this).find("input")
		if(child.prop("checked")==false){
			child.prop("checked",true)
			// “染色”
			$(this).css(liAfterClick)
			
			results[i] = new Array(1)
			results[i][0]=child.val()
			
			// 判断学生的对错
			if(results[i][0]==questions[i].answers[0]){
				grades[i]=new Array(1)
				grades[i][0]="1"
			}else{
				grades[i]=new Array(1)
				grades[i][0]="0"
			}
			
			// 获得学生的得分
			scores[i] = grades[i][0]*questions[i].grade
	
			console.log(results)
			console.log(grades)
			console.log(scores)
			values={"results":results,"grades":grades,"scores":scores}
	
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
	showquestion(quesSequence);
	// saveAnswer(quesSequence)

},50)


window.setTimeout(function(){
	bind()
	// saveAnswer()
},80)   

function bind(){
    var btns = document.querySelectorAll(`.button-circ`);

    for(var j=0;j<btns.length;j++){
        a1(j)
    }
    function a1(j){
        btns[j].addEventListener('click', function(){
            showquestion(j)
            i=j
        })
    }
}


function showquestion(quesSequence){
    var i=quesSequence
    // 清空，重新显示
    document.getElementById('questionPlace').innerHTML=''

	// 可以拖动的东西 
	//document.getElementById('questions').innerHTML+="<div id='div"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'>"+"<div draggable='true' ondragstart='drag(event)' id='question"+i+"' ></div>"+"</div>"
    
    document.getElementById('questionPlace').innerHTML+=
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
			
			/* 清除input自带的圆圈 */
			op+="<input name='identity"+i+"' type='hidden' value="+j+" id="+id1+">"
			op+="<label for="+id1+">"+(questions[i].options)[j]+"</label>"
			op+="</li>"
		} 
		op+="</ol>"


		// $("li")[1].css(liAeforeClick)

		document.getElementById('options'+i).innerHTML=op
		
		// 如果该学生已经做了该题，则显示他的答案
		if(results[i]!=null){
			var tem = document.getElementsByTagName("li")
			tem[results[i][0]].style.cssText="border-color:#4CAF50;color:#4CAF50"
		}


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
		for  (var j=0;j<questions[i].results.length;j++){
				op+="<input type='text'>"
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





// 学生的答案，对错与得分，答案和对错是一个二维数组，得分是一维数组
var results = new Array()
var grades = new Array()
var scores = new Array()
var values = new object()

// 在每道题的页面，给选择按钮、输入框绑定事件，使得可以存储学生每道題的答案到一个数组
function saveAnswer(quesSequence){
	var i=quesSequence
	var btns = document.querySelectorAll(`[name="identity${i}"]`);
					
	function bgChange(o){                        
		results[i] = new Array(1)
		results[i][0]=o.value
		
		// 判断学生的对错
		if(results[i][0]==questions[i].answers[0]){
			grades[i]=new Array(1)
			grades[i][0]="1"
		}else{
			grades[i]=new Array(1)
			grades[i][0]="0"
		}
		
		// 获得学生的得分
		scores[i] = grades[i][0]*questions[i].grade

		console.log(results)
		console.log(grades)
		console.log(scores)
		values={"results":results,"grades":grades,"scores":scores}


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


function insertResult(){
	var url = config.SOCKAddr+"/insertAll?taskNo="+theRequest.taskNo;          
	   
	xmlHttpRequest = createXmlHttpRequest();      
	    
	xmlHttpRequest.onreadystatechange = statechangedInsertResult;      
		       
	xmlHttpRequest.open("POST",url,true);
    
	xmlHttpRequest.send(JSON.stringify(values));


}



  // 回调函数      
  function statechangedInsertResult(){
	var req = xmlHttpRequest;
	if(req.readyState == 4 ){
	  if(req.status == 200){
		mark = 1
		showQuesAnswer(0)
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


// 显示学生的对错
 function showQuesAnswer(quesSequence){
	var i = quesSequence   
    // 清空，重新显示
    document.getElementById('questionPlace').innerHTML=''

	// 可以拖动的东西 
	//document.getElementById('questions').innerHTML+="<div id='div"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'>"+"<div draggable='true' ondragstart='drag(event)' id='question"+i+"' ></div>"+"</div>"
    
    document.getElementById('questionPlace').innerHTML+=
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


	 // 0123到ABCD的
	 var mapp={0:'A',1:'B',2:'C',3:'D'}


	// 在这里显示该题的对错
	if(grades[i][0]=="1"){
		var x1=`<p>你的答案${mapp[results[i][0]]}，正确答案${mapp[questions[i].answers[0]]}，回答<p style="color:green">正确:-)</p></p>`
	}else{
		var x1=`<p>你的答案${mapp[results[i][0]]}，正确答案${mapp[questions[i].answers[0]]}，回答<p style="color:red">错误:-(</p></p>`
	}
	document.getElementById('options'+i).innerHTML+=x1

}


