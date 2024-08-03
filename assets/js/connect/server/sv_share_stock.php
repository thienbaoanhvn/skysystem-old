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
        $con=mysqli_connect('61.100.180.32:3307','root','dorcmdnjs123#AB','sky007v2');
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
    Editor::inst( $db, 'tb_stock_divide as sd' )
        ->field(
            Field::inst( 'sd.product_id as product_id'),
            Field::inst( 'sd.product_name as product_name'), 
            Field::inst( 'sd.sku as sku'),
            Field::inst(' sd.stock_total as stock_total')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_web as stock_web ')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_web as price_web ')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_shopee as stock_shopee')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),       
            Field::inst( 'sd.price_shopee as price_shopee') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),  
            Field::inst( 'sd.stock_wholesaler as stock_wholesaler')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_wholesaler as price_wholesaler')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),          
          //  Field::inst( 'sd.stock_eglips as stock_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
         //   Field::inst( 'sd.price_eglips as price_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_lazada as stock_lazada')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_lazada as price_lazada')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_tiki as stock_tiki')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_tiki as price_tiki')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ) ,
            Field::inst( 'sd.stock_tiktok as stock_tiktok')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_tiktok as price_tiktok')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ) ,           
            Field::inst( 'sd.stock_bbiavn as stock_bbiavn')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_bbiavn as price_bbiavn')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' )         
        )      
        ->where( 'sd.product_name' , '%mixsoon%' ,'not like')
       // ->where( 'sd.category' , '%'.$str_category.'%' ,'like')      
        ->where( "sd.sku" , "$str_product_type" ,"$condition_product_type")
        ->where( 'sd.view','0')
        ->on( 'postEdit', function ( $editor, $id, $values ,$row ) {
            
            $con=mysqli_connect('61.100.180.32:3307','root','dorcmdnjs123#AB','sky007v2');  
            $con_bbia=mysqli_connect('61.100.180.32:3307','root','dorcmdnjs123#AB','bbia');
            $con_sky007=mysqli_connect('45.32.113.241','root','dorcmdnjs123#AB#AB#','sky007v3'); 
            $con_wholesaler=mysqli_connect('45.32.113.241','root','dorcmdnjs123#AB#AB#','sky007_wholesaler'); 
           
            $obj_data=$_POST['obj_data'];
       
            $manager_name=$obj_data['mg_name'];
        
             
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s");  
            $product_id=$row["product_id"];
            $stock_web=$row["stock_web"]; 
            $sku=$row["sku"]; 
            $stock_bbiavn=$row["stock_bbiavn"];            
            $stock_wholesaler=$row["stock_wholesaler"];  
            $price_wholesaler=$row["price_wholesaler"]; 
            $price_sky007vn=$row["price_web"];       
            $price_bbiavn=$row["price_bbiavn"];         
            $name_row=array_keys($values);
            $name_row=$name_row[0];
            $data_arr=json_encode($row);
            if($name_row=="stock_web"){
                $product_id_sky007="";
                $result_get_id_sky007=mysqli_query($con_sky007,"SELECT post_id FROM aowp_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_sky007)){ 
                    $product_id_sky007=$row["post_id"];
                } 
                if($product_id_sky007!="") {
                     mysqli_query($con_sky007,"UPDATE `aowp_postmeta` SET meta_value='$stock_web' WHERE meta_key='_stock' AND post_id='$product_id_sky007'");                     
                }  
                 mysqli_close($con_sky007);
                
               
                 
            }else if($name_row=="price_web"){
                $product_id_sky007="";
                $result_get_id_sky007=mysqli_query($con_sky007,"SELECT post_id FROM aowp_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_sky007)){ 
                    $product_id_sky007=$row["post_id"];
                } 
                if($product_id_sky007!="") {
                     mysqli_query($con_sky007,"UPDATE aowp_postmeta SET meta_value ='$price_sky007vn' WHERE post_id ='$product_id_sky007' AND (meta_key='_sale_price' OR meta_key='_price')");                     
                }  
                 mysqli_close($con_sky007);
                
               
                 
            }else if($name_row=="stock_bbiavn"){              
                $product_id_bbia="";
                $result_get_id_bbiavn=mysqli_query($con_bbia,"SELECT post_id FROM wp_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_bbiavn)){ 
                    $product_id_bbia=$row["post_id"];                    
                }                
                if($product_id_bbia!="") {
                     mysqli_query($con_bbia,"UPDATE `wp_postmeta` SET meta_value='$stock_bbiavn' WHERE meta_key='_stock' AND post_id='$product_id_bbia'");
                }  
                 mysqli_close($con_bbia);  
            }     
            else if($name_row=="price_bbiavn"){
                $product_id_bbia="";
                $result_get_id_bbiavn=mysqli_query($con_bbia,"SELECT post_id FROM wp_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_bbiavn)){ 
                    $product_id_bbia=$row["post_id"];
                } 
                if($product_id_bbia!="") {
                     mysqli_query($con_bbia,"UPDATE wp_postmeta SET meta_value ='$price_bbiavn' WHERE post_id ='$product_id_bbia' AND (meta_key='_sale_price' OR meta_key='_price')");
                }  
                 mysqli_close($con_bbia);  
            }else if($name_row=="stock_wholesaler"){
                $product_id_wholesaler="";
                $result_get_id_wholesaler=mysqli_query($con_wholesaler,"SELECT post_id FROM wpws_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_wholesaler)){ 
                    $product_id_wholesaler=$row["post_id"];
                } 
                if($product_id_wholesaler!="") {
                     mysqli_query($con_wholesaler,"UPDATE `wpws_postmeta` SET meta_value='$stock_wholesaler' WHERE meta_key='_stock' AND post_id='$product_id_wholesaler'");
                }  
                 mysqli_close($con_wholesaler);  
            }              
            else if($name_row=="price_bbiavn"){
                $product_id_bbia="";
                $result_get_id_bbiavn=mysqli_query($con_bbia,"SELECT post_id FROM wp_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_bbiavn)){ 
                    $product_id_bbia=$row["post_id"];
                } 
                if($product_id_bbia!="") {
                     mysqli_query($con_bbia,"UPDATE wp_postmeta SET meta_value ='$price_bbiavn' WHERE post_id ='$product_id_bbia' AND (meta_key='_sale_price' OR meta_key='_price')");
                }  
                 mysqli_close($con_bbia);  
            }   
            $stock_shopee=$row["stock_shopee"]; 
           // $stock_lotte=$row["stock_lotte"]; 
            $stock_tiki=$row["stock_tiki"]; 
            $stock_lazada=$row["stock_lazada"]; 
          
            
            
            $stock_website_curent=  0;
            $stock_shopee_curent=  0;
        //    $stock_lotte_curent=  0;
            $stock_tiki_curent=  0;
            $stock_lazada_curent=  0;          
            $stock_bbiavn_curent=  0;  
            $stock_wholesaler_curent=0;                  
            
            $result_get_stock=mysqli_query($con,"SELECT `stock_web`,`stock_shopee`,`stock_lazada`, `stock_tiki`, stock_bbiavn,stock_wholesaler FROM `tb_stock_divide` WHERE `product_id`='$product_id'");
            while($row=mysqli_fetch_array($result_get_stock)){ 
                  $stock_website_curent=  $row["stock_web"];
                  $stock_shopee_curent=  $row["stock_shopee"];
             //     $stock_lotte_curent=  $row["stock_lotte"];
              //    $stock_eglips_website_curent=  $row["stock_eglips"]; /*,`stock_eglips`*/  ; Eglips : curent ".$stock_eglips_website_curent." , stock change ".$stock_eglips." ;
                  $stock_lazada_curent=  $row["stock_lazada"];   
                  $stock_tiki_curent=  $row["stock_tiki"];                 
                  $stock_bbiavn_curent =$row["stock_bbiavn"]; 
                  $stock_wholesaler_curent =$row["stock_wholesaler"];             
                    
            }
            $str_log="(Warehouse TP.HCM)(edit for each row) Product ID : $product_id , Website Sky007 : curent ".$stock_website_curent." , stock change ".$stock_web." 
                                    ; Shopee : curent ".$stock_shopee_curent." , stock change ".$stock_shopee." ;                               
                                    ; Lazada : curent ".$stock_lazada_curent." , stock change ".$stock_lazada.";
                                    ; Tiki : curent ".$stock_tiki_curent." , stock change ".$stock_tiki.";                                    
                                    ; Bbiavn : curent ".$stock_bbiavn_curent." , stock change ".$stock_bbiavn.";
                                    ; wholesaler : curent ".$stock_wholesaler_curent." , stock change ".$stock_wholesaler." .";
            mysqli_query($con,"INSERT INTO  `tb_stock_devide_log`	(`product_id` ,`log_stock`,`time_update`,`warehouse`,`manager`) VALUE ('$product_id','$str_log','$today','0','$manager_name')");
            mysqli_close($con);   
            // ; Lotte : curent ".$stock_lotte_curent." , stock change ".$stock_lotte." ;     `stock_lotte`, 
       
        } )
      //   ->debug(true)
        ->process($_POST)
        ->json();
        die();
   }else if($warehouse=="1"){
     Editor::inst( $db, 'tb_stock_divide_hanoi as sd' )
        ->field(
            Field::inst( 'sd.product_id as product_id'),
            Field::inst( 'sd.product_name as product_name'), 
            Field::inst( 'sd.sku as sku'),
            Field::inst(' sd.stock_total as stock_total')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
          //  Field::inst( 'sd.stock_web as stock_web ')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
          //  Field::inst( 'sd.price_web as price_web ')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_eglips as stock_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_eglips as price_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_shopee_eglips as stock_shopee_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_shopee_eglips as price_shopee_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_lazada_eglips as stock_lazada_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_lazada_eglips as price_lazada_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_tiki_eglips as stock_tiki_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_tiki_eglips as price_tiki_eglips')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' )
          )      
       // ->where( 'sd.category' , '%'.$str_brand.'%' ,'like')
       // ->where( 'sd.category' , '%'.$str_category.'%' ,'like')     
       ->where( 'sd.product_name' , '%mixsoon%' ,'not like') 
        ->where( "sd.sku" , "$str_product_type" ,"$condition_product_type")
        ->on( 'postEdit', function ( $editor, $id, $values ,$row ) {
            $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2');
            
            $con_eglips=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','eglips');  
             
            $obj_data=$_POST['obj_data'];
       
            $manager_name=$obj_data['mg_name'];
        
             
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s");  
            $product_id=$row["product_id"];
          //  $stock_web=$row["stock_web"];  
            $sku=$row["sku"];        
            $name_row=array_keys($values);
            $name_row=$name_row[0];
            $data_arr=json_encode($row);                
     
            $stock_eglips=$row["stock_eglips"]; 
            
            $stock_shopee_eglips =$row["stock_shopee_eglips"]; 
           
            $stock_lazada_eglips =$row["stock_lazada_eglips"]; 
            
            $stock_tiki_eglips =$row["stock_tiki_eglips"]; 
            
            $price_eglips=$row["price_eglips"];   
            
         //   $stock_website_curent=  0;           `stock_web`,
            $stock_eglips_website_curent=  0;
            $stock_shopee_eglips_current= 0;
            $stock_lazada_eglips_current= 0;
            $stock_tiki_eglips_current= 0;
         //   echo(123);die();
            if($name_row=="stock_eglips"){
                $product_id_eglips="";         
                $result_get_id_eglips=mysqli_query($con_eglips,"SELECT post_id FROM wp_eglips_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_eglips)){ 
                    $product_id_eglips=$row["post_id"];
                } 
                if($product_id_eglips!="") {              
                     mysqli_query($con_eglips,"UPDATE `wp_eglips_postmeta` SET meta_value='$stock_eglips' WHERE meta_key='_stock' AND post_id='$product_id_eglips'");
                }  
                 mysqli_close($con_eglips);  
            } else if($name_row=="price_eglips"){
                $product_id_eglips="";         
                $result_get_id_eglips=mysqli_query($con_eglips,"SELECT post_id FROM wp_eglips_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_eglips)){ 
                    $product_id_eglips=$row["post_id"];
                } 
                if($product_id_eglips!="") {              
                     mysqli_query($con_eglips,"UPDATE `wp_eglips_postmeta` SET meta_value='$price_eglips' WHERE (meta_key='_price' OR meta_key='_sale_price') AND post_id='$product_id_eglips'");
                }  
                 mysqli_close($con_eglips);  
            }  
                                   
            
            $result_get_stock=mysqli_query($con,"SELECT `stock_eglips`,`stock_shopee_eglips`,`stock_lazada_eglips`,`stock_tiki_eglips` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$product_id'");
            while($row=mysqli_fetch_array($result_get_stock)){ 
                //  $stock_website_curent=  $row["stock_web"];    Website Sky007 : curent ".$stock_website_curent." , stock change ".$stock_web."              
                  $stock_eglips_website_curent =  $row["stock_eglips"];  
                  $stock_shopee_eglips_current  =  $row["stock_shopee_eglips"]; 
                  $stock_lazada_eglips_current  =  $row["stock_lazada_eglips"];  
                  $stock_tiki_eglips_current  =  $row["stock_tiki_eglips"];                           
                    
            }
            $str_log="(Warehouse HaNoi)(edit for each row) Product ID : $product_id , Eglips : curent ".$stock_eglips_website_curent." , stock change ".$stock_eglips." 
                                    ; Shopee Eglips : curent ".$stock_shopee_eglips_current." , stock change ".$stock_shopee_eglips."
                                    ; Lazada Eglips : curent ".$stock_lazada_eglips_current." , stock change ".$stock_lazada_eglips."
                                    ; Tiki Eglips : curent ".$stock_tiki_eglips_current." , stock change ".$stock_tiki_eglips.".";
            mysqli_query($con,"INSERT INTO  `tb_stock_devide_log`	(`product_id` ,`log_stock`,`time_update`,`warehouse`,`manager`) VALUE ('$product_id','$str_log','$today','1','$manager_name')");
            mysqli_close($con);   
       
        } )
      //  ->debug(true)
        ->process($_POST)
        ->json();
        die();
   }   
?>
