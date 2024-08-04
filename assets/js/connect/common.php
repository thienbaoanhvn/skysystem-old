<?php 

     //======================================================================================  
  
    
        //relative path to access image URL
    //   define("IMAGE_URL",      "");  
    
    //======================================================================================
    function common_connect(){ 
         $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2');
      //  $con=mysqli_connect('171.244.140.116','anhtran','Lightlass@1','abctest')or die("not connect!");
    // Check connection
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }
    	// Change character set to utf8
    	mysqli_set_charset($con,"utf8");
        return $con;
    }
    function check_url($url)
    {
       if (!preg_match("/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i",$url)) {
        $websiteErr = false; 
        
        }
        else
            $websiteErr = true;
        return $websiteErr;
    }
    function common_connect_bbia(){ 
        // $con=mysqli_connect('61.100.180.32','root','dorcmdnjsepqm1#','sky007');
       //  $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','bbia')or die("not connect!");
       $con=mysqli_connect('171.244.188.27','actsonevn','actsone123!','bbiavn');
    // Check connection
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }
    	// Change character set to utf8
    	mysqli_set_charset($con,"utf8");
        return $con;
    }
    function common_connect_sky007(){         
      //   $con=mysqli_connect('45.32.113.241','root','dorcmdnjs123#AB#AB#','sky007v3')or die("not connect!");
          $con=mysqli_connect('171.244.188.27','actsonevn','actsone123!','sky007v2');
    // Check connection
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }
    	// Change character set to utf8
    	mysqli_set_charset($con,"utf8");
        return $con;
    }
    function common_connect_wholesaler(){         
       //  $con=mysqli_connect('45.32.113.241','wordpress','dorcmdnjs123#AB#AB#','sky007_wholesaler')or die("not connect!");
       $con=mysqli_connect('45.32.113.241','root','dorcmdnjs123#AB#AB#','sky007_wholesaler')or die("not connect!");
       //   $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v3');
    // Check connection
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }
    	// Change character set to utf8
    	mysqli_set_charset($con,"utf8");
        return $con;
    }
    function common_connect_mixsoon(){         
        $con=mysqli_connect('171.244.188.27','actsonevn','actsone123!','mixsoonvn');
      //   $con=mysqli_connect('45.32.113.241','root','dorcmdnjs123#AB#AB#','wordpress')or die("not connect!");
       //   $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v3');
    // Check connection
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }
    	// Change character set to utf8
    	mysqli_set_charset($con,"utf8");
        return $con;
    }
    function common_connect_hince(){      
        $con=mysqli_connect('171.244.188.27','actsonevn','actsone123!','hincevn');   
        // $con=mysqli_connect('45.32.113.241','root','dorcmdnjs123#AB#AB#','hince')or die("not connect!");
       //   $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v3');
    // Check connection
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }
    	// Change character set to utf8
    	mysqli_set_charset($con,"utf8");
        return $con;
    }
    function common_connect_eglips(){         
        $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','eglips')or die("not connect!");      
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }    
    	mysqli_set_charset($con,"utf8");
        return $con;
    }
    //======================================================================================
    function common_close_connect($con){
        mysqli_close($con);
    }
    
 
?>