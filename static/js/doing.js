/********* 上一题 **********/

// 第几题
var i = 0

button2.onclick = function(){
    if(i<questions.length-1){
        i++;
        showquestion(i);
    } else {
        alert("已是最后一题")
    }
	saveanswers()
}

button1.onclick = function(){
    if(i>0){
    i--;
    showquestion(i);
    } else {
        alert("已是第一题")
	}
	saveanswers()
}


function querypaper(n){      
	//userName = document.f1.username.value;      
	//passWord = document.f1.password.value;        
		  
	//var url = "LoginServlet?username="+userName+"&password="+passWord+"";         
	var url = "http://localhost:8080/querypaper";          
	
	// 1.创建XMLHttpRequest组建      
	xmlHttpRequest = createXmlHttpRequest();      
	


	// 2.注册回调函数，函数名后面不需要加括号      
	xmlHttpRequest.onreadystatechange = statechanged;      
		  
	// 3.初始化XMLHttpRequest组建      
	xmlHttpRequest.open("POST",url,true);
	//xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");      
		  
	//4.发送请求      
	xmlHttpRequest.send(n);
	
	

  }

var questions




var url = location.search;
var theRequest = new Object();

if ( url.indexOf( "?" ) != -1 ) {

  var str = url.substr( 1 ); //substr()方法返回从参数值开始到结束的字符串；

  var strs = str.split( "&" );

  for ( var i = 0; i < strs.length; i++ ) {

    theRequest[ strs[ i ].split( "=" )[ 0 ] ] = ( strs[ i ].split( "=" )[ 1 ] );

  }

  console.log(theRequest); //此时的theRequest就是我们需要的参数；

}



window.setTimeout(function(){
	// 获得试卷
	querypaper(theRequest.som)
},20)   

// 选项卡
var div = document.createElement("div");
document.body.appendChild(div);

var butto = document.getElementById("buttons")


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
	showquestion(1);

},50)


window.setTimeout(function(){
	bind()
	saveanswers()
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


function showquestion(i){
    
    // 清空，重新显示
    document.getElementById('questions').innerHTML=''

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

var answers = new Array()


function saveanswers(){
	var btns = document.querySelectorAll(`[name="identity${i}"]`);
					
	function bgChange(o){                        
		answers[i] = o.value
		console.log(answers)
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