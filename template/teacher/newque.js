
// 增加选项按钮
var i=0;
function add(){
    var op="op"+i;
    document.getElementById("added-option").innerHTML+="<input type='text' id="+op+" style='margin-right:350px' name='options'> "+"<br>";
    console.log(document.getElementById("op"+i));
    i++;
}


// $(function(){
//     $("#sub").click(function(){  
//         /** 验证文件是否导入成功  */  
//         $("#form1").ajaxSubmit(function(data){    
//             alert(data);     
//         });       
//     })
//     return false
// }); 

// $("#sub").on("click",function(){
//     $.ajax({
//          type: "post",
//          url:"http://localhost:8080/upload",
//          dataType: "json",
//          data: $("#Form1").serialize(),
//          success: function (msg) {
//            alert(msg);
//          }
 
//      });
// })

var options = {
    // target: '#output',          //把服务器返回的内容放入id为output的元素中    
    beforeSubmit: showRequest,  //提交前的回调函数
    success: showResponse,      //提交后的回调函数
    url: 'http://localhost:8080/upload', //默认是form的action， 如果申明，则会覆盖
    type: 'post',               //默认是form的method（get or post），如果申明，则会覆盖
    datatype: 'JSON',           //html(默认), xml, script, json...接受服务端返回的类型
    //clearForm: true,          //成功提交后，清除所有表单元素的值
    //resetForm: true,          //成功提交后，重置所有表单元素的值
    timeout: 3000               //限制请求的时间，当请求大于3秒后，跳出请求
 }
 
 function showRequest(formData, jqForm, options){
    //formData: 数组对象，提交表单时，Form插件会以Ajax方式自动提交这些数据，格式如：[{name:user,value:val },{name:pwd,value:pwd}]
    //jqForm:   jQuery对象，封装了表单的元素   
    //options:  options对象

    // var queryString = $.param(formData);   //name=1&address=2
    // var formElement = jqForm[0];              //将jqForm转换为DOM对象
    // var address = formElement.address.value;  //访问jqForm的DOM元素
    return true;  //只要不返回false，表单都会提交,在这里可以对表单元素进行验证
 };
 
 function showResponse(responseText, statusText){
    //dataType=xml
    // var name = $('name', responseXML).text();
    // var address = $('address', responseXML).text();
    // $("#xmlout").html(name + "  " + address);
    // //dataType=json
    // $("#jsonout").html(data.name + "  " + data.address);
    alert(responseText)
    // var json_str = responseText; // json形式的字符串
    // str = eval('(' + json_str + ')'); // 转化为json格式
    // alert(str)
    $('#t1').val(responseText)
 };
 


// $("#form1").ajaxForm(options);


 $(document).ready(function(){
    $('#sub').on('click', function() {
       // $("#form1").submit(function(){
            $("#form1").ajaxSubmit(options);
           return false;   //阻止表单默认提交
        });
   // })
 });



// $("#uploadImage").on("submit",function() { //触发form表单提交，url写在form标签
//     $("#uploadImage").ajaxSubmit(options); // form表单提交后触发
//     return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
// })