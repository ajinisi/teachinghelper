function register(){
        
    var arr = {
        "username":"username",
        "password":"password",
        "confirm_password":"confirm_password"
    }
    
    // 判断是否有未输入
    for(var i in arr){
        if($("[name="+i+"]").val() == ''){
            alert(arr[i]+' can not be null');
            return false;
        }
    }
    
    // 判断两次密码是否相同
    if($("[name=password]").val() != $("[name=confirm_password]").val()){
        alert('password is different from confirm_password, please check');
        return false;
    }
    
    $.ajax({
        type:"post",
        url: config.SOCKAddr+"/user",
        data:{
            username: $("[name=username]").val(),
            password: $("[name=password]").val()
        },
        success:function(result){
            window.location = config.SOCKAddr+"/login.html";
        }
        // success: function(result){
        //     var obj =JSON.parse(result);
        //     if(obj.code == 200){
        //         //跳转到首页
        //         //to do
        //     }else{
        //         alert(obj.Msg);
        //     }
        // }
    })
}