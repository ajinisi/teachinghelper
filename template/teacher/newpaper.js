// 首先获得数据库中的题目
var questions
querybank();

	



// 维护一个筛选条件数组
var condition = new Array()
condition = ["all",'all']

// 然后根据条件数组筛选题目
filterQuestion(); 

// // 全部题型
// $(all).bind("click",function(){    
// 	// 清空
// 	document.getElementById('questionPlace').innerHTML=""
// 	// 连续显示所有题目
// 	for  (var i=0;i<questions.length;i++){
// 		showQuestion(i)	
// 	}
// });





// $(".filter a").click(function(){   
//   var $this = $(this);
//   if($this.hasClass("filteractive")){
//       $this.removeClass("filteractive")
//   }else{
//       $this.addClass("filteractive")
//   }
// })


/*********************************************/
/*********************************************/


function filterQuestion(){

  var li = document.querySelectorAll('.filter>div');

  for(var i = 0; i <li.length; i++){
    setClick(li[i],i);
  }
  
  function setClick(parent,index){
    var option = parent.getElementsByTagName("a");
    for(var i = 0; i < option.length; i++){
      /* 建一个数组 */
      option[i].onclick = function(){
          for(var i = 0; i < option.length; i++){
            // 每点击一次，重置该行所有样式
            option[i].className = "";
          }
          this.className = "filteractive";
          
          condition[index]=$(this).attr("value");
          console.log(condition)
          document.getElementById('questionPlace').innerHTML=""
          
          // 根据生成的条件数组来筛选题目
          for(var i=0;i<questions.length;i++){
      
            if(condition[0]=="all" && condition[1]=="all"){
              showQuestion(i);
            } 
            else if(condition[0]!="all" && condition[1]=="all"){
              if(questions[i].type==condition[0]){showQuestion(i)}
            } 
            else if(condition[0]=="all" && condition[1]!="all"){
              if(questions[i].stars==condition[1]){showQuestion(i)}
            }
            else if(questions[i].type==condition[0] && questions[i].stars==condition[1]){
              showQuestion(i);
            }
          
          }

      };
    }
  }
}










// 预览试卷和确认试卷按钮
button_view.onclick = function(){
	showPaper();
}

button_insert.onclick = function(){	
	insertPaper();
}






function insertPaper(){
	var paperName=prompt("请输入试卷名称","例如期中考试");
	if (paperName!=null && paperName!=""){
		alert(paperName)
		var que=document.getElementById("paperPlace").childNodes
		console.log(que)
		var sen=new Array(que.length-1);
		for(var i=0;i<que.length-1;i++){
			sen[i]=que[i+1].id.slice(8)
		}
		sen.join(",")
       
		var url = config.SOCKAddr+"/insertpaper?papername="+paperName+"&papercontent="+sen;      
		
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
        window.location = config.SOCKAddr+"/template/user/login.html";
        alert("request url is forbidden or not authorized to visit.");
      }
      else
      {
        alert("unexpected error!Status Code :"+req.status);
      }
	}
}


