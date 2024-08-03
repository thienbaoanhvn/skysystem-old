/*
 *  Document   : base_pages_login.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Login Page
 */

var BasePagesLogin = function() {
    // Init Login Form Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
   
    var initValidationLogin = function(){
        jQuery('.js-validation-login').validate({            
            errorClass: 'help-block text-right animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function(error, e) {
                jQuery(e).parents('.form-group > div').append(error);
            },
            highlight: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            success: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error');
                jQuery(e).closest('.help-block').remove();                
                
            },           
            
            rules: {
                'login-username': {
                    required: true,
                    minlength: 3
                },
                'login-password': {
                    required: true,
                    minlength: 5
                },  
                'check_login':{
                    required: true
                }     
            },
            messages: {
                'login-username': {
                    required: 'Please enter a username',
                    minlength: 'Your username must consist of at least 3 characters'
                },
                'login-password': {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long'
                }
            },
             submitHandler: function(form) {  
                
               var check_login="";
                var email=$("#login-username").val();
                var password=$("#login-password").val();
                 var encodedata={"pass": password,"email":email};
                  $.ajax({
                   url:"assets/js/connect/gateway.php?controller=ct_skysys.ct_login",
                   type:"POST",
                   async: false,
                   data:{"obj":encodedata},                   
                   success : function(d){   
                    
                    var data=$.parseJSON(d);                      
                    check_login=data;
                   },
                   error:function(e)  {
                    alert(e);
                   }
                });                   
                if(check_login.length==0 || check_login[0]['active']=="1")
                {
                    alert("Email or password not correct !");
                    $("#login-username").val("");
                    $("#login-password").val("");
                }
                else{  
                   // alert(1);
                    var expire_date=new Date();
                    expire_date.setDate(expire_date.getDate() + 1);  
                    var partner_id=check_login[0]['id'];
                    var partner_name=check_login[0]['name'];    
                    var permission = check_login[0]['permission'];
                    var limit_menu = check_login[0]['limit_menu'];
                                                      
                    setCookie("ck_partner_id",partner_id,1); 
                    setCookie("ck_ticket_expiry",expire_date,1);
                    setCookie("ck_email",email,1);
                    setCookie("ck_name",partner_name,1); 
                    setCookie("ck_permission",permission,1); 
                    setCookie("ck_limit_menu",limit_menu,1);                                  
                    window.location.href = "index.html";
                } 
             }
        });
    };  
    return {
        init: function () {
           
            // Init Login Form Validation
           initValidationLogin();         
        }
    };
}();
setCookie=function(cname,cvalue,exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    }

getCookie=function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

// Initialize when page loads
jQuery(function(){ BasePagesLogin.init(); });