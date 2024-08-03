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
        $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2');
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
            Field::inst( 'sd.stock_hince_web as stock_hince_web')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_hince_web as price_hince_web')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_shopee as stock_shopee')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),       
            Field::inst( 'sd.price_shopee as price_shopee') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),  
            Field::inst( 'sd.stock_wholesaler as stock_wholesaler')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_wholesaler as price_wholesaler')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),         
          
            Field::inst( 'sd.stock_lazada as stock_lazada')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_lazada as price_lazada')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_tiki as stock_tiki')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_tiki as price_tiki')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ) ,
            Field::inst( 'sd.stock_tiktok_hince as stock_tiktok_hince')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_tiktok_hince as price_tiktok_hince')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' )      
        )      
        ->where( 'sd.product_name' , '%hince%' ,'like')
       // ->where( 'sd.category' , '%'.$str_category.'%' ,'like')      
        ->where( "sd.sku" , "$str_product_type" ,"$condition_product_type")
        ->where( 'sd.view','0')
        ->on( 'postEdit', function ( $editor, $id, $values ,$row ) {
            
            $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2');
            $con_wholesaler=mysqli_connect('45.32.113.241','root','dorcmdnjs123#AB#AB#','sky007_wholesaler'); 
            $con_hince_web=mysqli_connect('45.32.113.241','root','dorcmdnjs123#AB#AB#','hince');
             $obj_data=$_POST['obj_data'];
       
             $manager_name=$obj_data['mg_name'];
        
             
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s");  
            $product_id=$row["product_id"];           
            $sku=$row["sku"];            
            $stock_hince_web=$row["stock_hince_web"];
            $stock_wholesaler=$row["stock_wholesaler"];  
            $price_wholesaler=$row["price_wholesaler"]; 
            
            $stock_shopee=$row["stock_shopee"];          
            $stock_tiki=$row["stock_tiki"]; 
            $stock_lazada=$row["stock_lazada"]; 
              
                
            $name_row=array_keys($values);
            $name_row=$name_row[0];
            $data_arr=json_encode($row);
            if($name_row=="stock_wholesaler"){
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
            else if($name_row=="stock_hince_web"){              
                $product_id_hince_web="";
                $result_get_id_hince_web=mysqli_query($con_hince_web,"SELECT post_id FROM wp_hince_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_hince_web)){ 
                    $product_id_hince_web=$row["post_id"];                    
                }                
                if($product_id_hince_web!="") {
                     mysqli_query($con_hince_web,"UPDATE `wp_hince_postmeta` SET meta_value='$stock_hince_web' WHERE meta_key='_stock' AND post_id='$product_id_hince_web'");
                }  
                 mysqli_close($con_hince_web);  
            }     
           
                        
           
            $stock_shopee_curent=  0;       
            $stock_tiki_curent=  0;
            $stock_lazada_curent=  0;  
            $stock_hince_web_curent= 0; 
            $stock_wholesaler_curent=0;                  
            
            $result_get_stock=mysqli_query($con,"SELECT `stock_shopee`,`stock_lazada`, `stock_tiki`, stock_hince_web,stock_wholesaler FROM `tb_stock_divide` WHERE `product_id`='$product_id'");
            while($row=mysqli_fetch_array($result_get_stock)){ 
                  
                  $stock_shopee_curent=  $row["stock_shopee"];            
                  $stock_lazada_curent=  $row["stock_lazada"];   
                  $stock_tiki_curent=  $row["stock_tiki"]; 
                  $stock_hince_web_curent=  $row["stock_hince_web"];   
                  $stock_wholesaler_curent =$row["stock_wholesaler"];             
                    
            }
            $str_log="(Warehouse TP.HCM)(edit for each row) Product ID : $product_id 
                                    ; Shopee : curent ".$stock_shopee_curent." , stock change ".$stock_shopee." ;                               
                                    ; Lazada : curent ".$stock_lazada_curent." , stock change ".$stock_lazada.";
                                    ; Tiki : curent ".$stock_tiki_curent." , stock change ".$stock_tiki.";
                                    ; hince web : curent ".$stock_hince_web_curent." , stock change ".$stock_hince_web.";
                                    ; wholesaler : curent ".$stock_wholesaler_curent." , stock change ".$stock_wholesaler." .";
            mysqli_query($con,"INSERT INTO  `tb_stock_devide_log`	(`product_id` ,`log_stock`,`time_update`,`warehouse`,`manager`) VALUE ('$product_id','$str_log','$today','0','$manager_name')");
            mysqli_close($con); 
        } )
      //   ->debug(true)
        ->process($_POST)
        ->json();
        die();
   }  
?>
