<?php 
    include( "../php/DataTables.php" );
    use
        DataTables\Editor,
        DataTables\Editor\Field,
        DataTables\Editor\Format,
        DataTables\Editor\Mjoin,
        DataTables\Editor\Upload,
        DataTables\Editor\Validate,
        DataTables\Database,
        DataTables\Database\Query,
        DataTables\Database\Result;
        
        $obj_data=$_POST['obj_data'];
       
        $brand=$obj_data['brand'];
        $category=$obj_data['category'];
        $product_type=$obj_data['product_type'];
        $manager_name="sdf";//$obj_data['mg_name'];
        $warehouse=$obj_data['warehouse'];
        
       // $mgname="hhh";//$obj_data['mgname'];
       
      // echo ($brand.'_'. $category.'_'.$product_type."_".$mg_name); die();
       // $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#A','sky007');
        //$con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#A','sky007');
        $str_brand="";        
        $str_category="";     
        $str_product_type="";       
        $condition_product_type="";
        
      if($brand=="0"){
            $str_brand="Bbia";
        }else if($brand=="1"){
            $str_brand="Eglips";
        }
        
        if($category=="0"){
            $str_category="Eye";
        }else if($category=="1"){
            $str_category="Face";
        }else if($category=="2"){
            $str_category="(Lip)";
        }
        
       
        if($product_type=="0"){
            $condition_product_type="not like";
            $str_product_type="%-R";
        }else if($product_type=="1"){
            $condition_product_type="like";
            $str_product_type="%-R";
        }else{
            $condition_product_type="like";
            $str_product_type="%%";
        }
        
 
     //   echo($str_brand .'_'.$str_category .'_'.$str_product_type.'_'.$manager_name); die();
   if($warehouse=="0"){
    Editor::inst( $db, 'tb_stock_divide as sd','sd.product_id' )
        ->field(
            Field::inst( 'sd.product_id as product_id'),
            Field::inst( 'sd.product_name as product_name'), 
            Field::inst( 'sd.sku as sku'),    
            Field::inst( 'sd.stock_eglips as stock_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),       
            Field::inst( 'sd.price_eglips as price_eglips') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ), 
            Field::inst( 'sd_hn.stock_lazada_eglips as stock_lazada_eglips') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),       
            Field::inst( 'sd_hn.price_lazada_eglips as price_lazada_eglips') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ), 
            Field::inst( 'sd_hn.stock_watsons as stock_watsons') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),       
            Field::inst( 'sd_hn.price_watsons as price_watsons') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_sociolla as stock_sociolla') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),       
            Field::inst( 'sd.price_sociolla as price_sociolla') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd_hn.stock_watsons_total as stock_watsons_total') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' )
        )      
        ->leftjoin('`tb_stock_divide_hanoi` AS sd_hn','sd_hn.product_id','=','sd.product_id') 
      //  ->where( 'sd.category' , '%'.$str_brand.'%' ,'like')
      //  ->where( 'sd.category' , '%'.$str_category.'%' ,'like')      
        ->where( "sd.sku" , "$str_product_type" ,"$condition_product_type")
        ->on( 'postEdit', function ( $editor, $id, $values ,$row ) {
            $name_row=array_keys($values);
            $name_row=$name_row[0];
            if($name_row=="stock_eglips"){
                $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2');  
                $obj_data=$_POST['obj_data'];
           
                $manager_name=$obj_data['mg_name'];
                             
                date_default_timezone_set("Asia/Ho_Chi_Minh");    
                $today = date("Y-m-d H:i:s");  
                $product_id=$row["product_id"];
                     
                
                $data_arr=json_encode($row);                 
              
                $stock_eglips=$row["stock_eglips"];           
                
                $stock_eglips_website_curent=  0;
                
                $result_get_stock=mysqli_query($con,"SELECT `stock_eglips` FROM `tb_stock_divide` WHERE `product_id`='$product_id'");
                while($row=mysqli_fetch_array($result_get_stock)){                 
                     $stock_eglips_website_curent=  $row["stock_eglips"];
                        
                }
                $str_log="(Warehouse TP.HCM)(edit borrow stock) Product ID : $product_id ,  Eglips : curent ".$stock_eglips_website_curent." , stock change ".$stock_eglips.".";
                mysqli_query($con,"INSERT INTO  `tb_stock_devide_log`	(`product_id` ,`log_stock`,`time_update`,`warehouse`,`manager`) VALUE ('$product_id','$str_log','$today','0','$manager_name')");
                mysqli_close($con);
            }else if($name_row=="stock_lazada_eglips"){
                $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2');  
                
                $obj_data=$_POST['obj_data'];
           
                $manager_name=$obj_data['mg_name'];            
                 
                date_default_timezone_set("Asia/Ho_Chi_Minh");    
                $today = date("Y-m-d H:i:s");  
                $product_id=$row["product_id"];
                     
                
                $data_arr=json_encode($row);                 
              
                $stock_lazada_eglips=$row["stock_lazada_eglips"];           
                
                $stock_lazada_eglips_curent=  0;
                
                $result_get_stock=mysqli_query($con,"SELECT `stock_lazada_eglips` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$product_id'");
                while($row=mysqli_fetch_array($result_get_stock)){                 
                     $stock_lazada_eglips_curent=  $row["stock_lazada_eglips"];
                        
                }
                $str_log="(Warehouse TP.HCM)(edit borrow stock) Product ID : $product_id ,  Lazada Eglips : curent ".$stock_lazada_eglips_curent." , stock change ".$stock_lazada_eglips.".";
                mysqli_query($con,"INSERT INTO  `tb_stock_devide_log`	(`product_id` ,`log_stock`,`time_update`,`warehouse`,`manager`) VALUE ('$product_id','$str_log','$today','0','$manager_name')");
                mysqli_close($con);
            }else if($name_row=="stock_watsons"){
                $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2');  
                $obj_data=$_POST['obj_data'];
           
                $manager_name=$obj_data['mg_name'];            
                 
                date_default_timezone_set("Asia/Ho_Chi_Minh");    
                $today = date("Y-m-d H:i:s");  
                $product_id=$row["product_id"];
                     
                
                $data_arr=json_encode($row);                 
              
                $stock_watsons=$row["stock_watsons"];           
                
                $stock_watsons_curent=  0;
                
                $result_get_stock=mysqli_query($con,"SELECT `stock_watsons` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$product_id'");
                while($row=mysqli_fetch_array($result_get_stock)){                 
                     $stock_watsons_curent=  $row["stock_watsons"];
                        
                }
                $str_log="(Warehouse TP.HCM)(edit borrow stock) Product ID : $product_id ,  Watsons : curent ".$stock_watsons_curent." , stock change ".$stock_watsons.".";
                mysqli_query($con,"INSERT INTO  `tb_stock_devide_log`	(`product_id` ,`log_stock`,`time_update`,`warehouse`,`manager`) VALUE ('$product_id','$str_log','$today','0','$manager_name')");
                mysqli_close($con);
            }else if($name_row=="stock_sociolla"){
                $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2');  
                $obj_data=$_POST['obj_data'];
           
                $manager_name=$obj_data['mg_name'];            
                 
                date_default_timezone_set("Asia/Ho_Chi_Minh");    
                $today = date("Y-m-d H:i:s");  
                $product_id=$row["product_id"];
                     
                
                $data_arr=json_encode($row);                 
              
                $stock_sociolla=$row["stock_sociolla"];           
                
                $stock_sociolla_curent=  0;
                
                $result_get_stock=mysqli_query($con,"SELECT `stock_sociolla` FROM `tb_stock_divide` WHERE `product_id`='$product_id'");
                while($row=mysqli_fetch_array($result_get_stock)){                 
                     $stock_sociolla_curent=  $row["stock_sociolla"];
                        
                }
                $str_log="(Warehouse TP.HCM)(edit borrow stock) Product ID : $product_id ,  sociolla: curent ".$stock_sociolla_curent." , stock change ".$stock_sociolla.".";
                mysqli_query($con,"INSERT INTO  `tb_stock_devide_log`	(`product_id` ,`log_stock`,`time_update`,`warehouse`,`manager`) VALUE ('$product_id','$str_log','$today','0','$manager_name')");
                mysqli_close($con);
            }                
       
        } )
         
        ->process($_POST)
        ->json();
        die();
   }else if($warehouse=="1"){
     Editor::inst( $db, 'tb_stock_divide_hanoi as sd' )
        ->field(
            Field::inst( 'sd.product_id as product_id'),
            Field::inst( 'sd.product_name as product_name'), 
            Field::inst( 'sd.sku as sku'),
            
            Field::inst( 'sd.stock_web as stock_web')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_web as price_web')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' )
          )      
       // ->where( 'sd.category' , '%'.$str_brand.'%' ,'like')
    //    ->where( 'sd.category' , '%'.$str_category.'%' ,'like')      
        ->where( "sd.sku" , "$str_product_type" ,"$condition_product_type")
        ->on( 'postEdit', function ( $editor, $id, $values ,$row ) {
            $name_row=array_keys($values);
            $name_row=$name_row[0];
            if($name_row=="stock_web"){
                $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2');  
                $obj_data=$_POST['obj_data'];
           
                $manager_name=$obj_data['mg_name'];        
                 
                date_default_timezone_set("Asia/Ho_Chi_Minh");    
                $today = date("Y-m-d H:i:s");  
                $product_id=$row["product_id"];
                $stock_web=$row["stock_web"];         
                
                $data_arr=json_encode($row);    
                
                $stock_website_curent=  0;       
                
                $result_get_stock=mysqli_query($con,"SELECT`stock_web` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$product_id'");
                while($row=mysqli_fetch_array($result_get_stock)){ 
                      $stock_website_curent=  $row["stock_web"];                   
                }
                $str_log="(Warehouse HaNoi)(edit borrow stock) Product ID : $product_id , Website Sky007 : curent ".$stock_website_curent." , stock change ".$stock_web." .";
                mysqli_query($con,"INSERT INTO  `tb_stock_devide_log`	(`product_id` ,`log_stock`,`time_update`,`warehouse`,`manager`) VALUE ('$product_id','$str_log','$today','1','$manager_name')");
                mysqli_close($con); 
            }  
       
        } )
        ->process($_POST)
        ->json();
        die();
   }
      
   
?>
