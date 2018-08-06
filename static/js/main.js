// 配置
var config={
    "IPAddr":"http://localhost",
    "PORT":"8080",
    "SOCKAddr":"http://localhost:8080"
}


// ajax导入json配置
// $.get('../../config.json').done(function(config){
//     console.log(config)
// });


      
//XmlHttpRequest对象      
function createXmlHttpRequest(){      
    if(window.ActiveXObject){ //如果是IE浏览器      
        return new ActiveXObject("Microsoft.XMLHTTP");      
    }else if(window.XMLHttpRequest){ //非IE浏览器      
        return new XMLHttpRequest();      
    }      
} 


/********* 下面两个函数使用一个回调函数  ********/

// 查询题库中的全部题目
function querybank(){      
	
	var url = config.SOCKAddr+"/queryquesbank";
	// var url = "http://192.168.1.129:8080/queryquesbank";          
	    
	xmlHttpRequest = createXmlHttpRequest();      
	      
	xmlHttpRequest.onreadystatechange = statechanged;      
		        
	xmlHttpRequest.open("POST",url,true);
      
	xmlHttpRequest.send(null);
	
}         


// 查询具体的某一张试卷中全部题目
function querypaper(n){      
        
	var url = config.SOCKAddr+"/querypaper";          
	   
	xmlHttpRequest = createXmlHttpRequest();      
	    
	xmlHttpRequest.onreadystatechange = statechanged;      
		       
	xmlHttpRequest.open("POST",url,true);
    
	xmlHttpRequest.send(n);
	
} 
		
  // 回调函数      
  function statechanged(){
	var req = xmlHttpRequest;
	if(req.readyState == 4 ){
	  if(req.status == 200){
		var json_str = xmlHttpRequest.responseText; // json形式的字符串
		questions = eval('(' + json_str + ')'); // 转化为json格式
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





//赋值到另一张html中
function showPaper(){   

		
	// 新建一个空白
	var newWim = window.open('','_blank','');
	

	// var html = `<form action="http://localhost:8080/insertpaper" method="post">
    				// <fieldset>
      					// <legend>试卷</legend>`
	html = document.getElementById("diva").innerHTML
	// html += `<button id="button" type="submit"> 确认提交 </button>`
	// html += `</fieldset></form>`
	
	// window.setTimeout(function(){
	// 	newWim.document.body.innerHTML+=html;
  	// },10);
	

	newWim.document.write(html)
	newWim.document.close()
	

}




/***** 处理其他页面传来的值 ********/

var url = location.search; // 获取url中"?"符后的字串
var theRequest = new Object();

if ( url.indexOf( "?" ) != -1 ) {

  var str = url.substr( 1 ); //substr()方法返回从参数值开始到结束的字符串，即去除问号"?"；
  
  
  // 处理字符串成键值对
  var strs = str.split( "&" );
  for ( var i = 0; i < strs.length; i++ ) {

    theRequest[ strs[ i ].split( "=" )[ 0 ] ] = ( strs[ i ].split( "=" )[ 1 ] );

  }

  console.log(theRequest); // 此时的theRequest就是我们需要的参数；

}




function showQuestion(i){


	// 可以拖动的东西 
	//document.getElementById('questionPlace').innerHTML+="<div id='div"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'>"+"<div draggable='true' ondragstart='drag(event)' id='question"+i+"' ></div>"+"</div>"
	document.getElementById('questionPlace').innerHTML+=
			`<div class='div' ondrop='drop(event)' ondragover='allowDrop(event)'> 
					<div draggable='true' ondragstart='drag(event)' id='question${questions[i].id}' class='questionGroup'></div>
			</div>`
	 
	// 显示第i题
	document.getElementById('question'+questions[i].id).innerHTML="<div id ="+"stem"+i+" > </div>"+"<div id=options"+i+"> </div>"


	// 显示第i题 题干
	document.getElementById("stem"+i).innerHTML="题目"+(i+1)+"："+questions[i].content;

	// 判断题目类型
	if(questions[i].type == 'single' || questions[i].type == 'multiple') {

		// 显示选项
		var op = "<ol>"
		for  (var j=0;j<questions[i].options.length;j++){
			op+="<li class='optionGroup'>"
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
  if(questions[i].type == 'judge') {
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
  }   

	// 判断题目类型
	if(questions[i].type == 'fill') {

		// 显示选项
		var op = ""
		for  (var j=0;j<questions[i].answers.length;j++){
				op+="<input class='blank' type='text' "
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
