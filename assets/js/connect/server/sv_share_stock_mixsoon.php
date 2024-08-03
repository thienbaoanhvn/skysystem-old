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
        $manager_name="";
        $warehouse=$obj_data['warehouse'];
        $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2');
       
    Editor::inst( $db, 'tb_stock_divide as sd' )
        ->field(
            Field::inst( 'sd.product_id as product_id'),
            Field::inst( 'sd.product_name as product_name'), 
            Field::inst( 'sd.sku as sku'),
            Field::inst(' sd.stock_total as stock_total')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_mixsoon_web as stock_mixsoon_web ')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_mixsoon_web as price_mixsoon_web ')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_web as stock_sky007_web ')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_web as price_sky007_web ')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),

            Field::inst( 'sd.stock_shopee as stock_shopee')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),       
            Field::inst( 'sd.price_shopee as price_shopee') ->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ), 
            Field::inst( 'sd.stock_lazada as stock_lazada')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_lazada as price_lazada')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_tiki as stock_tiki')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_tiki as price_tiki')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.stock_tiktok as stock_tiktok')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_tiktok as price_tiktok')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ), 
            Field::inst( 'sd.stock_tiktok_mixsoon as stock_tiktok_mixsoon')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_tiktok_mixsoon as price_tiktok_mixsoon')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' )  ,
            Field::inst( 'sd.stock_wholesaler as stock_wholesaler')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' ),
            Field::inst( 'sd.price_wholesaler as price_wholesaler')->validator( 'Validate::numeric' )->validator( 'Validate::notEmpty' )  
             )      
        ->where( 'sd.product_name' , '%mixsoon%' ,'like')
        ->where( 'sd.view','0')
        ->on( 'postEdit', function ( $editor, $id, $values ,$row ) {
            
            $con=mysqli_connect('61.100.180.32','root','dorcmdnjs123#AB#','sky007v2'); 
            $con_mixsoon=mysqli_connect('45.32.113.241','wordpress','dorcmdnjs123#AB#AB#','wordpress'); 
            $con_sky007 =mysqli_connect('45.32.113.241','wordpress','dorcmdnjs123#AB#AB#','sky007v3');
            $obj_data=$_POST['obj_data'];       
            $manager_name=$obj_data['mg_name'];        
             
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s");  
            $product_id=$row["product_id"];
            $stock_mixsoon_web=$row["stock_mixsoon_web"]; 
            $sku=$row["sku"];            
            $price_mixsoon_web=$row["price_mixsoon_web"];
            
            $stock_sky007_web=$row["stock_sky007_web"];                  
            $price_sky007_web=$row["price_sky007_web"];
            $name_row=array_keys($values);
            $name_row=$name_row[0];
            $data_arr=json_encode($row);
            if($name_row=="stock_mixsoon_web"){
                $product_id_mixsoon="";
                $result_get_id_mixsoon=mysqli_query($con_mixsoon,"SELECT post_id FROM wp_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_mixsoon)){ 
                    $product_id_mixsoon=$row["post_id"];
                } 
                if($product_id_mixsoon!="") {
                     mysqli_query($con_mixsoon,"UPDATE `wp_postmeta` SET meta_value='$stock_mixsoon_web' WHERE meta_key='_stock' AND post_id='$product_id_mixsoon'");                     
                }  
                 mysqli_close($con_mixsoon);
                
               
                 
            }else if($name_row=="price_mixsoon_web"){
                $product_id_mixsoon="";
                $result_get_id_mixsoon=mysqli_query($con_mixsoon,"SELECT post_id FROM wp_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_mixsoon)){ 
                    $product_id_mixsoon=$row["post_id"];
                } 
                if($product_id_mixsoon!="") {
                     mysqli_query($con_mixsoon,"UPDATE wp_postmeta SET meta_value ='$price_mixsoon_web' WHERE post_id ='$product_id_mixsoon' AND (meta_key='_sale_price' OR meta_key='_price')");                     
                }  
                 mysqli_close($con_mixsoon);     
                 
            } else if($name_row=="stock_sky007_web"){
                $product_id_sky007="";
                $result_get_id_sky007=mysqli_query($con_sky007,"SELECT post_id FROM aowp_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_sky007)){ 
                    $product_id_sky007=$row["post_id"];
                } 
                if($product_id_sky007!="") {
                     mysqli_query($con_sky007,"UPDATE `aowp_postmeta` SET meta_value='$stock_sky007_web' WHERE meta_key='_stock' AND post_id='$product_id_sky007'");                     
                }  
                 mysqli_close($con_sky007);    
                 
            }else if($name_row=="price_sky007_web"){
                $product_id_sky007="";
                $result_get_id_sky007=mysqli_query($con_sky007,"SELECT post_id FROM aowp_postmeta WHERE meta_key='_sku' AND meta_value='$sku'");
                while($row=mysqli_fetch_array($result_get_id_sky007)){ 
                    $product_id_sky007=$row["post_id"];
                } 
                if($product_id_sky007!="") {
                     mysqli_query($con_sky007,"UPDATE aowp_postmeta SET meta_value ='$price_sky007_web' WHERE post_id ='$product_id_sky007' AND (meta_key='_sale_price' OR meta_key='_price')");                     
                }  
                 mysqli_close($con_sky007);     
                 
            }
            
            $stock_shopee=$row["stock_shopee"];       
            $stock_tiki=$row["stock_tiki"]; 
            $stock_lazada=$row["stock_lazada"];
            $stock_tiktok_mixsoon=$row["stock_tiktok_mixsoon"];
            $stock_tiktok=$row["stock_tiktok"];      
            
            $stock_mixsoon_website_curent=  0;
            $stock_sky007_website_curent=  0;
            $stock_shopee_curent=  0;      
            $stock_tiki_curent=  0;
            $stock_lazada_curent=  0; 
            $stock_tiktok_mixsoon_curent=0;
            $stock_tiktok_curent=0;
            
            $result_get_stock=mysqli_query($con,"SELECT `stock_mixsoon_web`,`stock_shopee`,`stock_lazada`, `stock_tiki`,`stock_web`,`stock_tiktok`,`stock_tiktok_mixsoon` FROM `tb_stock_divide` WHERE `product_id`='$product_id'");
            while($row=mysqli_fetch_array($result_get_stock)){ 
                  $stock_mixsoon_website_curent=  $row["stock_mixsoon_web"];
                  $stock_sky007_website_curent=  $row["stock_web"];
                  $stock_shopee_curent=  $row["stock_shopee"];
                  $stock_lazada_curent=  $row["stock_lazada"];   
                  $stock_tiki_curent=  $row["stock_tiki"]; 
                  $stock_tiktok_mixsoon=  $row["stock_tiktok"]; 
                  $stock_tiktok_mixsoon_curent=  $row["stock_tiktok_mixsoon"]; 
                   
                    
            }
            $str_log="(Warehouse TP.HCM)(edit for each row) Product ID : $product_id , Website Mixsoon : curent ".$stock_mixsoon_website_curent." , stock change ".$stock_mixsoon_web." 
                                    ; Website Sky007 : curent ".$stock_sky007_website_curent." , stock change ".$stock_sky007_web." ;
                                    ; Shopee : curent ".$stock_shopee_curent." , stock change ".$stock_shopee." ;                               
                                    ; Lazada : curent ".$stock_lazada_curent." , stock change ".$stock_lazada.";
                                    ; Tiki : curent ".$stock_tiki_curent." , stock change ".$stock_tiki.";
                                    ; Tiktok sky007 : curent ".$stock_tiktok_curent." , stock change ".$stock_tiktok.";
                                    ; Tiktok mixsoon : curent ".$stock_tiktok_mixsoon_curent." , stock change ".$stock_tiktok_mixsoon."; .";
            mysqli_query($con,"INSERT INTO  `tb_stock_devide_log`	(`product_id` ,`log_stock`,`time_update`,`warehouse`,`manager`) VALUE ('$product_id','$str_log','$today','0','$manager_name')");
            mysqli_close($con);   
            // ; Lotte : curent ".$stock_lotte_curent." , stock change ".$stock_lotte." ;     `stock_lotte`, 
       
        } )
         
        ->process($_POST)
        ->json();
        die();
   
     
?>
