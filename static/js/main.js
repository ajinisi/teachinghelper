  
  //XmlHttpRequest对象      
function createXmlHttpRequest(){      
    if(window.ActiveXObject){ //如果是IE浏览器      
        return new ActiveXObject("Microsoft.XMLHTTP");      
    }else if(window.XMLHttpRequest){ //非IE浏览器      
        return new XMLHttpRequest();      
    }      
} 



function queryuser(){      
	//userName = document.f1.username.value;      
	//passWord = document.f1.password.value;        
		  
	//var url = "LoginServlet?username="+userName+"&password="+passWord+"";         
	var url = "http://113.54.223.194:8080/queryquesbank";          
	
	// 1.创建XMLHttpRequest组建      
	xmlHttpRequest = createXmlHttpRequest();      
	


	// 2.注册回调函数，函数名后面不需要加括号      
	xmlHttpRequest.onreadystatechange = statechanged;      
		  
	// 3.初始化XMLHttpRequest组建      
	xmlHttpRequest.open("POST",url,true);
	//xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");      
		  
	//4.发送请求      
	xmlHttpRequest.send(null);
	
	

  }         
		
		
  // 回调函数      
  function statechanged(){
	var req = xmlHttpRequest;
	if(req.readyState == 4 ){
	  if(req.status == 200){
		var json_str = xmlHttpRequest.responseText; // json形式的字符串
		questions = eval('(' + json_str + ')'); // 转化为json格式
		//alert(questions)
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
  


/*
// 题目答案的数据结构
var questions = [
//                    {
//                        id: '1',
//                        type: 'join',
//                        content: '四大名著连一连',
//                        leftItems: ['《水浒传》', '《西游记》', '《三国演义》', '《红楼梦》'],
//                        rightItems: ['罗贯中', '施耐庵', '曹雪芹', '吴承恩'],
//                        answers: [[0, 1], [1, 3], [2, 0], [4, 2]],
//                        userAnswer: null
//                    },
		{
				id: '1',
				type: 'judgment',
				content: '所有的苹果都是水果',
				answers: true,
				userAnswer: null
		},
		{
				id: '2',
				type: 'fill',
				content: '___秋月何时了，往事___',
				answers: ['春花', '知多少'],
				userAnswer: null
		},
		{
			id: '1',
			type: 'fill',
			content: 'we want f___ students, thirty girls and',
			answers: ['fifty'],
			grade:[1],
			stars:1

	},
	{
		id: '2',
		type: 'single',
		content: 'When does Tom get up and run in the morning',
		options: ['At 5:15 and 6:00', 'At 5:30 and 6:00', 'At 6:00 and 6:30'],
		answers: 0,
		grade:1,
		stars:2
},

{
	id: '3',
	type: 'fill',
	content: 'In my ___(组), Monica often goes to school at seven.',
	answers: ['group'],
	grade:1,
	stars:1
},

		{
				id: '3',
				type: 'fill',
				content: '1+2等于几？',
				answers: '3',
				userAnswer: null
		},
		{
				id: '4',
				type: 'multiple',
				content: '哪些是对的',
				options: ['1+1=2', '1+2=3', '1+1=3', '1+2=2'],
				answers: [0, 1],
				userAnswer: null
		},
		{
				id: '5',
				type: 'single',
				content: '1+1=?',
				options: ['1', '2', '3', '4'],
				answers: 1,
				userAnswer: null
		}
];

*/


function showquestion(i){

	// 可以拖动的东西 
	//document.getElementById('questions').innerHTML+="<div id='div"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'>"+"<div draggable='true' ondragstart='drag(event)' id='question"+i+"' ></div>"+"</div>"
	document.getElementById('questions').innerHTML+=
			`<div id='div${i}' ondrop='drop(event)' ondragover='allowDrop(event)'> 
					<div draggable='true' ondragstart='drag(event)' id='question${i}' ></div>
			</div>`

	// 显示第i题
	document.getElementById('question'+i).innerHTML="<div id ="+"stem"+i+"> </div>"+"<div id = "+"options"+i+"> </div>"


	// 显示第i题 题干
	document.getElementById("stem"+i).innerHTML="题目"+(i+1)+"："+questions[i].content;

	// 判断题目类型
	if(questions[i].type == 'single' || questions[i].type == 'multiple') {

		// 显示选项
		var op = "<ol>"
		for  (var j=0;j<questions[i].options.length;j++){
						op+="<li>"
						var id1='o'+i+j
						op+="<input name='identity"+i+"' type='radio' value="+j+" id="+id1+">"
						op+="<label for="+id1+">"+(questions[i].options)[j]+"</label>"
						op+="</li>"
		} 
		op+="</ol>"
		document.getElementById('options'+i).innerHTML=op

		
		var btn = document.querySelectorAll("[name='identity3']");
		
		function bgChange(o){                        
				questions[i].userAnswer = o.value
				alert(questions[i].userAnswer)
		}                    

		for(var j=0;j<btn.length;j++){
						a1(j)
		}

		function a1(j){
						btn[j].addEventListener('click', function(){
										bgChange(eval('o'+i+j))
						})
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
		for  (var j=0;j<questions[i].answers.length;j++){
				op+="<input type='text'>"
		} 


		document.getElementById('options'+i).innerHTML=op

	}     

    

}

var questions
	

$(all).bind("click",function(){
	
	queryuser();
    
				// 连续显示所有题目
				document.getElementById('questions').innerHTML=""
				
				for  (var i=0;i<questions.length;i++){
					
						showquestion(i)
				} 
	});
    


	 $(choose).bind("click",function(){
	 	//	var x=$("questions").length;
	 	//	alert(x);
	 	//queryuser1();
	 	queryuser();
	 	document.getElementById('questions').innerHTML=""
		var x=questions.length;
	 	for(var i=0;i<x;i++){
	 		if(questions[i].type=='single'||questions[i].type=="multiple"){
	 			console.log(questions[i].type);
	 			showquestion(i);
	 	}
	 }
});



/********* 上一题 **********/

// 第几题
var i = 2

button2.onclick = function(){
    i++;
    showquestion(i);
}

button1.onclick = function(){
    i--;
    showquestion(i);

}






/******************* 拖动的代码 **************/

	// 允许放置
	function allowDrop(ev)
	{
	ev.preventDefault();
	}

	// 拖动什么
	function drag(ev)
	{
	ev.dataTransfer.setData("Text",ev.target.id);
	}

	// 进行放置
	function drop(ev)
	{
	ev.preventDefault();
	var data=ev.dataTransfer.getData("Text");
	ev.target.appendChild(document.getElementById(data));
	}












function select(){
	$(document).click(function(){
		$(".select_module_con ul").slideUp();
	})
	var module=$(".select_result"); 
	module.click(function(e){
		e.stopPropagation();
		var ul=$(this).next();
		ul.stop().slideToggle();
		ul.children().click(function(e){
			e.stopPropagation();
			$(this).parent().prev().children("span").text($(this).text());
			ul.stop().slideUp();
		})
	})
}


$(function(){
	select(); 
})
      
   //判断当前点击标签所属哪一行
   function show(e){
	if(e==0){
			var t=document.getElementById("diva");
			var y1=document.createElement("divb");
			y1.id="id1";
			y1.className="class";
			y1.style.border="2 px solid red";
			t.appendChild(y1);
			document.getElementById("id1").innerHTML=document.getElementById("question0").innerHTML+'<ul onclick="deleat()">'+"delaete"+'</ul>'
		
			}
	if(e==1){
			var t=document.getElementById("diva");
			var y2=document.createElement("divc");
			y2.id="id2";
			y2.className="class";
			y2.style.border="2 px solid red";
			y2.style="display：inline-block";
			t.appendChild(y2);
			document.getElementById("id2").innerHTML=document.getElementById("question1").innerHTML+'<ul onclick="deleat1()">'+"delaete"+'</ul>'
			}
			
	if(e==2){
			$("#diva").append($("#question2").html());}
			
	if(e==3){
			$("#diva").append($("#question3").html());}
			
	if(e==4){
			$("#diva").append($("#question4").html());}	
	} 
	
	function anwser(e){
		alert(e);
	}
	//赋值到另一张html中
	function Copy()
			{   
				var divs = $("diva");
				var x=divs.length;
				alert(x);
				$('#diva div').each(function(i){
					$(this).attr("id");
			})
	
			var w = window.open();  
		    w.document.open("C:\Users\ajini\Documents");  
		    w.document.write(document.getElementById("diva").innerHTML);  
		    w.document.close();  
			}
	
	
			function deleat(){
				//document.getElementById("question0").innerHTML=document.getElementById("id1").innerHTML;
					 document.getElementById('id1').remove();
			}
			function deleat1(){
				//document.getElementById("question0").innerHTML=document.getElementById("id1").innerHTML;
					 document.getElementById('id2').remove();
			}
	




