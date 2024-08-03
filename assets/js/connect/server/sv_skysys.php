<?php
date_default_timezone_set("Asia/Ho_Chi_Minh");

class sever_skysys
{
    //============= Login page ====================================================================================
    public function sv_login($obj){
        $email=$obj["email"];
        $pass=$obj["pass"];   
        $db=common_connect();
        $md5_pass=md5($pass);
        // echo "SELECT `name`,permission FROM `tb_packaging_manager` WHERE email='$email' AND `password`='$md5_pass'"; exit();
        $result=mysqli_query($db,"SELECT `name`,permission,id ,permission,limit_menu ,active FROM `tb_barcode_manager` WHERE email='$email' AND `password`='$md5_pass'");
        
        $rows=array();
        while($row=mysqli_fetch_array($result)){ 
                array_push($rows,$row);               
        }
        echo json_encode($rows);
        common_close_connect($db);        
    }
    //============= End Login ====================================================================================
    //============= Dashboard ====================================================================================
    public function sv_dashboard_get_data_chart($fromdate,$todate,$category){
        $db=common_connect();
        $result="";
       
           $result=mysqli_query($db,"SELECT
                                    DATE(p.post_date) AS `time`,
                                    SUM(CASE WHEN n.ord_category IN (0, 7, 10, 20, 34,36,44,46,50,58,62 ) THEN oim_totalprice.meta_value ELSE 0 END) AS `bbia`,
                                    SUM(CASE WHEN n.ord_category IN (52, 54, 56,60) THEN oim_totalprice.meta_value ELSE 0 END) AS `mixsoon`,
                                    SUM(CASE WHEN n.ord_category IN (64, 66, 68,70) THEN oim_totalprice.meta_value ELSE 0 END) AS `hince`
                                FROM `aowp_posts` p
                                JOIN `aowp_woocommerce_order_items` oi ON p.id = oi.order_id
                                JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id = oi.order_item_id
                                JOIN `tb_ord_note` n ON p.id = n.order_id
                                WHERE p.post_status != 'wc-cancelled'
                                    AND p.post_status != 'trash'
                                    AND p.post_type = 'shop_order'
                                    AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'
                                    AND oi.order_item_type = 'line_item'
                                    AND oim_totalprice.meta_key = '_line_total'
                                GROUP BY DATE(p.post_date)
                                ORDER BY `time`");            
        $rows=array();
        while($row=mysqli_fetch_array($result)){ 
            array_push($rows,$row);               
        }
        echo json_encode($rows);
        common_close_connect($db);
    }
    public function sv_dashboard_get_info_sale($fromdate,$todate){
      $db=common_connect();
      $result_total_order = mysqli_query($db, "SELECT FORMAT(COUNT(p.id),0) AS `total_order`
                                               FROM `aowp_posts` p
                                               WHERE  p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'");
        
       $rows_for_total_order   = array();
        
       while ($row = mysqli_fetch_array($result_total_order)) {
           
           array_push($rows_for_total_order, $row);
           
       }  
       
       $result_item_sale = mysqli_query($db, "SELECT FORMAT(SUM(oim.meta_value),0) AS `qty`
                                                FROM `aowp_posts` p
                                                 LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                                 LEFT JOIN `aowp_woocommerce_order_itemmeta` oim ON oi.order_item_id=oim.order_item_id
                                                WHERE  p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'  
                                                	AND oi.order_item_type='line_item'
                                                	AND oim.meta_key='_qty'");
        
       $rows_for_item_sale   = array();
        
       while ($row = mysqli_fetch_array($result_item_sale)) {
           
           array_push($rows_for_item_sale, $row);
           
       }
       
       $result_total_money = mysqli_query($db, "SELECT FORMAT(SUM(pm.meta_value),0) AS `total_money`
                                                FROM `aowp_posts` p
                                                 LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id
                                                WHERE  p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'
                                                 AND pm.meta_key='_order_total'");
        
       $rows_for_total_money   = array();
        
       while ($row = mysqli_fetch_array($result_total_money)) {
           
           array_push($rows_for_total_money, $row);
           
       } 
       $arr_data=array("total_order"=>$rows_for_total_order,"product_sale"=>$rows_for_item_sale,"total_money"=>$rows_for_total_money);
       echo json_encode($arr_data);  
       common_close_connect($db); 
        
    }
    //============= End Dashboard ====================================================================================
    
    //============= Chart Report ====================================================================================
    //============ customer =======================================
    public function sv_chart_report_customer($fromdate,$todate,$category){
         $db=common_connect();
         $query_customer_all="SELECT COUNT(u.id) AS total_user,IF( um.meta_value ='0','Sky007',IF(um.meta_value ='7','Sky007',IF(um.meta_value ='5','Sky007',IF(um.meta_value ='10','Shopee',IF(um.meta_value ='11','Shopee',IF(um.meta_value ='14','Lotte',IF(um.meta_value ='15','Lotte',IF(um.meta_value ='18','Eglips',IF(um.meta_value ='19','Eglips',IF(um.meta_value ='20','Lazada',IF(um.meta_value ='21','Lazada',IF(um.meta_value ='22','Eglips',IF(um.meta_value ='24','Shopee',IF(um.meta_value ='25','Shopee',IF(um.meta_value ='26','Lazada',IF(um.meta_value ='27','Lazada',IF(um.meta_value ='28','Robins',IF(um.meta_value ='29','Robins',IF(um.meta_value ='30','Watsons',IF(um.meta_value ='31','Watson',IF(um.meta_value ='16','Sendo',IF(um.meta_value ='17','Sendo',IF(um.meta_value ='34','Beautybox',IF(um.meta_value ='35','Beautybox',IF(um.meta_value ='36','Tiki',IF(um.meta_value ='37','Tiki',IF(um.meta_value ='38','Shopee',IF(um.meta_value ='39','Shopee',IF(um.meta_value ='40','Lazada',IF(um.meta_value ='41','Lazada',IF(um.meta_value ='42','Tiki',IF(um.meta_value ='43','Tiki',IF(um.meta_value ='44','Sociolla',IF(um.meta_value ='45','Sociolla',IF(um.meta_value ='46','Bbiavn',IF(um.meta_value ='47','BbiavnMT',IF(um.meta_value ='48','Mixsoon',IF(um.meta_value ='49','MixsoonMT',IF(um.meta_value ='50','Guardian',IF(um.meta_value ='51','GuardianMT',IF(um.meta_value ='52','Shopee Mixsoon',IF(um.meta_value ='53','Shopee Mixsoon MT',IF(um.meta_value ='54','Lazada Mixsoon',IF(um.meta_value ='55','Lazada Mixsoon MT','Sky007')))))))))))))))))))))))))))))))))))))))))))) AS shop
                             FROM `aowp_users` u
                            	LEFT JOIN aowp_usermeta um ON u.id=um.user_id
                             WHERE um.meta_key='aowp_user_level' 
                             GROUP BY shop";                                    
         $result_customer_all = mysqli_query($db, $query_customer_all);
         $rows_customer_all  =   array();
         while ($row = mysqli_fetch_array($result_customer_all)) {           
           array_push($rows_customer_all, $row);           
         }
         //---------------------------------------------------------------------
         $query_customer_by_time="SELECT COUNT(u.id) AS total_user,IF( um.meta_value ='0','Sky007',IF(um.meta_value ='7','Sky007',IF(um.meta_value ='5','Sky007',IF(um.meta_value ='10','Shopee',IF(um.meta_value ='11','Shopee',IF(um.meta_value ='14','Lotte',IF(um.meta_value ='15','Lotte',IF(um.meta_value ='18','Eglips',IF(um.meta_value ='19','Eglips',IF(um.meta_value ='20','Lazada',IF(um.meta_value ='21','Lazada',IF(um.meta_value ='22','Eglips',IF(um.meta_value ='24','Shopee',IF(um.meta_value ='25','Shopee',IF(um.meta_value ='26','Lazada',IF(um.meta_value ='27','Lazada',IF(um.meta_value ='28','Robins',IF(um.meta_value ='29','Robins',IF(um.meta_value ='30','Watsons',IF(um.meta_value ='31','Watson',IF(um.meta_value ='16','Sendo',IF(um.meta_value ='17','Sendo',IF(um.meta_value ='34','Beautybox',IF(um.meta_value ='35','Beautybox',IF(um.meta_value ='36','Tiki',IF(um.meta_value ='37','Tiki',IF(um.meta_value ='38','Shopee',IF(um.meta_value ='39','Shopee',IF(um.meta_value ='40','Lazada',IF(um.meta_value ='41','Lazada',IF(um.meta_value ='42','Tiki',IF(um.meta_value ='43','Tiki',IF(um.meta_value ='44','Sociolla',IF(um.meta_value ='45','Sociolla',IF(um.meta_value ='46','Bbiavn',IF(um.meta_value ='47','BbiavnMT',IF(um.meta_value ='48','Mixsoon',IF(um.meta_value ='49','MixsoonMT',IF(um.meta_value ='50','Guardian',IF(um.meta_value ='51','GuardianMT',IF(um.meta_value ='52','Shopee Mixsoon',IF(um.meta_value ='53','Shopee Mixsoon MT',IF(um.meta_value ='54','Lazada Mixsoon',IF(um.meta_value ='55','Lazada Mixsoon MT','Sky007')))))))))))))))))))))))))))))))))))))))))))) AS shop
                                 FROM `aowp_users` u
                                	LEFT JOIN aowp_usermeta um ON u.id=um.user_id
                                 WHERE um.meta_key='aowp_user_level' AND u.user_registered BETWEEN '$fromdate' AND '$todate'
                                 GROUP BY shop";                                    
         $result_customer_by_time = mysqli_query($db, $query_customer_by_time);
         $rows_customer_by_time  =   array();
         while ($row = mysqli_fetch_array($result_customer_by_time)) {           
           array_push($rows_customer_by_time, $row);           
         }
         $arr_data=array("data_total"=>$rows_customer_all,"data_by_time"=>$rows_customer_by_time);
         echo json_encode($arr_data);  
         common_close_connect($db); 
    }
    //============ End customer ====================================
    //============ Category =======================================
    public function sv_chart_report_category($fromdate,$todate,$category){
         $db=common_connect();
         if($category=="all"){
            $query="SELECT IF(category.name IS NULL,'Another',category.name) AS category,SUM(oim_qty.meta_value) AS `qty`
                                        FROM `aowp_posts` p                                        		
                                        	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oi.order_item_id=oim_product_id.order_item_id
                                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                        	LEFT JOIN (SELECT p_id.product_id,t.name
                                        			FROM (	SELECT p.id AS `product_id`
                                        								    FROM `aowp_posts` p												
                                        								    WHERE  p.post_type='product' AND p.post_status IN ('publish','private')										 
                                        									AND p.id NOT IN( SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)                                    	
                                        									
                                        				UNION                             	
                                        				SELECT p.id AS `product_id`
                                        									    FROM `aowp_posts` p
                                        										LEFT JOIN  ( SELECT id,post_title FROM   `aowp_posts`   WHERE id IN (SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)) AS `namevariation` ON p.post_parent= namevariation.id         
                                        									    WHERE  p.post_type='product_variation' AND p.post_status IN ('publish','private')	) AS p_id	
                                        									    
                                        			LEFT JOIN  aowp_term_relationships  tr ON p_id.product_id=tr.object_id
                                        			LEFT JOIN aowp_terms t ON tr.`term_taxonomy_id`=t.term_id
                                        
                                        			WHERE tr.term_taxonomy_id IN(176,175,174,172,171,168,167)) category ON oim_product_id.meta_value=category.product_id
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'                                        
                                        	AND oi.order_item_type='line_item'
                                        	AND oim_product_id.meta_key='_product_id'
                                        	AND oim_qty.meta_key='_qty'
                                        GROUP BY category.name";
            $query_drilldown="SELECT IF(category.name IS NULL,'Another',category.name) AS category,oi.order_item_name,oim_qty.meta_value AS `qty`
                                FROM `aowp_posts` p                                	
                                	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oi.order_item_id=oim_product_id.order_item_id
                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                	LEFT JOIN (SELECT p_id.product_id,t.name
                                			FROM (	SELECT p.id AS `product_id`
                                								    FROM `aowp_posts` p												
                                								    WHERE  p.post_type='product' AND p.post_status IN ('publish','private')										 
                                									AND p.id NOT IN( SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)                                    	
                                									
                                				UNION                             	
                                				SELECT p.id AS `product_id`
                                									    FROM `aowp_posts` p
                                										LEFT JOIN  ( SELECT id,post_title FROM   `aowp_posts`   WHERE id IN (SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)) AS `namevariation` ON p.post_parent= namevariation.id         
                                									    WHERE  p.post_type='product_variation' AND p.post_status IN ('publish','private')	) AS p_id	
                                									    
                                			LEFT JOIN  aowp_term_relationships  tr ON p_id.product_id=tr.object_id
                                			LEFT JOIN aowp_terms t ON tr.`term_taxonomy_id`=t.term_id
                                
                                			WHERE tr.term_taxonomy_id IN(176,175,174,172,171,168,167)) category ON oim_product_id.meta_value=category.product_id
                                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'                                
                                	AND oi.order_item_type='line_item'
                                	AND oim_product_id.meta_key='_product_id'
                                	AND oim_qty.meta_key='_qty'";
             $result = mysqli_query($db, $query);
             $rows  =   array();
             while ($row = mysqli_fetch_array($result)) {           
               array_push($rows, $row);           
            }
            
             $result_drilldown = mysqli_query($db, $query_drilldown);
             $rows_drilldown  =   array();
             while ($row = mysqli_fetch_array($result_drilldown)) {           
               array_push($rows_drilldown, $row);           
            }
            
             $arr_data=array("data_main"=>$rows,"data_drilldown"=>$rows_drilldown);
         }else{
            $query="SELECT IF(category.name IS NULL,'Another',category.name) AS category,SUM(oim_qty.meta_value) AS `qty`
                                        FROM `aowp_posts` p
                                        	LEFT JOIN `tb_ord_note` n ON p.id=n.order_id	
                                        	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oi.order_item_id=oim_product_id.order_item_id
                                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                        	LEFT JOIN (SELECT p_id.product_id,t.name
                                        			FROM (	SELECT p.id AS `product_id`
                                        								    FROM `aowp_posts` p												
                                        								    WHERE  p.post_type='product' AND p.post_status IN ('publish','private')										 
                                        									AND p.id NOT IN( SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)                                    	
                                        									
                                        				UNION                             	
                                        				SELECT p.id AS `product_id`
                                        									    FROM `aowp_posts` p
                                        										LEFT JOIN  ( SELECT id,post_title FROM   `aowp_posts`   WHERE id IN (SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)) AS `namevariation` ON p.post_parent= namevariation.id         
                                        									    WHERE  p.post_type='product_variation' AND p.post_status IN ('publish','private')	) AS p_id	
                                        									    
                                        			LEFT JOIN  aowp_term_relationships  tr ON p_id.product_id=tr.object_id
                                        			LEFT JOIN aowp_terms t ON tr.`term_taxonomy_id`=t.term_id
                                        
                                        			WHERE tr.term_taxonomy_id IN(176,175,174,172,171,168,167)) category ON oim_product_id.meta_value=category.product_id
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'
                                        	AND n.ord_category='$category'
                                        	AND oi.order_item_type='line_item'
                                        	AND oim_product_id.meta_key='_product_id'
                                        	AND oim_qty.meta_key='_qty'
                                        GROUP BY category.name";
            $query_drilldown="SELECT IF(category.name IS NULL,'Another',category.name) AS category,oi.order_item_name,oim_qty.meta_value AS `qty`
                                FROM `aowp_posts` p
                                	LEFT JOIN `tb_ord_note` n ON p.id=n.order_id	
                                	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oi.order_item_id=oim_product_id.order_item_id
                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                	LEFT JOIN (SELECT p_id.product_id,t.name
                                			FROM (	SELECT p.id AS `product_id`
                                								    FROM `aowp_posts` p												
                                								    WHERE  p.post_type='product' AND p.post_status IN ('publish','private')										 
                                									AND p.id NOT IN( SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)                                    	
                                									
                                				UNION                             	
                                				SELECT p.id AS `product_id`
                                									    FROM `aowp_posts` p
                                										LEFT JOIN  ( SELECT id,post_title FROM   `aowp_posts`   WHERE id IN (SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)) AS `namevariation` ON p.post_parent= namevariation.id         
                                									    WHERE  p.post_type='product_variation' AND p.post_status IN ('publish','private')	) AS p_id	
                                									    
                                			LEFT JOIN  aowp_term_relationships  tr ON p_id.product_id=tr.object_id
                                			LEFT JOIN aowp_terms t ON tr.`term_taxonomy_id`=t.term_id
                                
                                			WHERE tr.term_taxonomy_id IN(176,175,174,172,171,168,167)) category ON oim_product_id.meta_value=category.product_id
                                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'
                                	AND n.ord_category='$category'
                                	AND oi.order_item_type='line_item'
                                	AND oim_product_id.meta_key='_product_id'
                                	AND oim_qty.meta_key='_qty'";
                                    
             $result = mysqli_query($db, $query);
             $rows  =   array();
             while ($row = mysqli_fetch_array($result)) {           
               array_push($rows, $row);           
            }
            
             $result_drilldown = mysqli_query($db, $query_drilldown);
             $rows_drilldown  =   array();
             while ($row = mysqli_fetch_array($result_drilldown)) {           
               array_push($rows_drilldown, $row);           
            }
            
             $arr_data=array("data_main"=>$rows,"data_drilldown"=>$rows_drilldown);
         }
         
         echo json_encode($arr_data);  
         common_close_connect($db);
    }
        //============End Category =====================================
        
        //============ Location ========================================
    public function sv_chart_report_location($obj){
        $fromdate=$obj["fromdate"];
        $todate=$obj["todate"];       
        $shop_sale=$obj["shop_sale"];
        $db=common_connect();
        if($shop_sale=="all"){ 
            $result=mysqli_query($db,"SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty
                                        FROM `aowp_posts` p 
                                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'                                      
                                        AND n.ord_category IN (0,10,18,20,24,26,42,47)
                                        AND pm_shipping_city.meta_key='_billing_city'
                                        GROUP BY pm_shipping_city.meta_value");    
        }else{
            $result=mysqli_query($db,"SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty
                                        FROM `aowp_posts` p
                                        	LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id
                                        		
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00' 
                                        AND n.ord_category='$shop_sale'
                                        AND pm_shipping_city.meta_key='_billing_city'
                                        GROUP BY pm_shipping_city.meta_value");
        }
        $rows  =   array();
        while ($row = mysqli_fetch_array($result)) {           
               array_push($rows, $row);           
        }
        
        
        
        echo json_encode($rows);  
        common_close_connect($db);
    }
    public function sv_chart_report_location_compare($obj){
        $fromdate=$obj["fromdate"];
        $todate=$obj["todate"]; 
        $list_location=$obj["list_location"];
        $str_location="";
     //   echo ($list_location[1]);exit();
        for($i=0;$i<count($list_location);$i++){
            $str_location.="'".$list_location[$i]."'".",";
        }
       // $str_location=json_encode($list_location,JSON_UNESCAPED_UNICODE);
        $str_location=substr($str_location, 0, -1);
        $db=common_connect();
        $rows_all  =   array();
        $rows_sky007  =   array();
        $rows_shopee  =   array();
        $rows_lazada  =   array();
        $rows_eglips =   array();
        
        //-----------location compare-------------------------
        $start_year=intval(substr($fromdate,0,4));
        $end_year=  intval(substr($todate,0,4));
        if($start_year==$end_year){           
           $query_all="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,month(p.post_date) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'                                      
                        AND n.ord_category IN (0,10,18,20,24,26)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value" ;                       
           $result_all=mysqli_query($db,$query_all);
           
           while($row=mysqli_fetch_array($result_all)){
                        array_push($rows_all,$row);
           } 
           //--------------------------
           $query_sky007="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,month(p.post_date) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'                                      
                        AND n.ord_category IN (0)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value" ;
           $result_sky007=mysqli_query($db,$query_sky007);
           
           while($row=mysqli_fetch_array($result_sky007)){
                        array_push($rows_sky007,$row);
           }
           //--------------------------
           $query_shopee="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,month(p.post_date) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'                                      
                        AND n.ord_category IN (10,24)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value" ;
           $result_shopee=mysqli_query($db,$query_shopee);
           
           while($row=mysqli_fetch_array($result_shopee)){
                        array_push($rows_shopee,$row);
           } 
           //--------------------------
           $query_lazada="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,month(p.post_date) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'                                      
                        AND n.ord_category IN (20,26)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value" ;
           $result_lazada=mysqli_query($db,$query_lazada);
           
           while($row=mysqli_fetch_array($result_lazada)){
                        array_push($rows_lazada,$row);
           } 
           //--------------------------
           $query_eglips="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,month(p.post_date) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'                                      
                        AND n.ord_category IN (18)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value" ;
           $result_eglips=mysqli_query($db,$query_eglips);
           
           while($row=mysqli_fetch_array($result_eglips)){
                        array_push($rows_eglips,$row);
           }  
           
                         
        }else if($start_year<$end_year){   
            $query_all="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTH(p.post_date),'_',$start_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$start_year-12-31 23:59:00'                                      
                        AND n.ord_category IN (0,10,18,20,24,26)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";
            $result_all=mysqli_query($db,$query_all);
           
            while($row=mysqli_fetch_array($result_all)){
                        array_push($rows_all,$row);
           }           
                
            $query_all_path2="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTH(p.post_date),'_',$end_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$todate 23:59:00'                                      
                        AND n.ord_category IN (0,10,18,20,24,26)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";  
            $result_all_path2=mysqli_query($db,$query_all_path2);
            while($row1=mysqli_fetch_array($result_all_path2)){
                        array_push($rows_all,$row1);
           }  
           //---------------------------------------------
           $query_sky007="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTH(p.post_date),'_',$start_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$start_year-12-31 23:59:00'                                      
                        AND n.ord_category IN (0)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";
            $result_sky007=mysqli_query($db,$query_sky007);
           
            while($row=mysqli_fetch_array($result_sky007)){
                        array_push($rows_sky007,$row);
           }           
                
            $query_sky007_path2="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTH(p.post_date),'_',$end_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$todate 23:59:00'                                      
                        AND n.ord_category IN (0)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";  
            $result_sky007_path2=mysqli_query($db,$query_sky007_path2);
            while($row1=mysqli_fetch_array($result_sky007_path2)){
                        array_push($rows_sky007,$row1);
           }
           //---------------------------------------------
           $query_shopee="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTH(p.post_date),'_',$start_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$start_year-12-31 23:59:00'                                      
                        AND n.ord_category IN (10,24)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";
            $result_shopee=mysqli_query($db,$query_shopee);
           
            while($row=mysqli_fetch_array($result_shopee)){
                        array_push($rows_shopee,$row);
           }           
                
            $query_shopee_path2="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTH(p.post_date),'_',$end_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$todate 23:59:00'                                      
                        AND n.ord_category IN (10,24)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";  
            $result_shopee_path2=mysqli_query($db,$query_shopee_path2);
            while($row1=mysqli_fetch_array($result_shopee_path2)){
                        array_push($rows_shopee,$row1);
           }
           //---------------------------------------------
           $query_lazada="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTH(p.post_date),'_',$start_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$start_year-12-31 23:59:00'                                      
                        AND n.ord_category IN (20,26)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";
            $result_lazada=mysqli_query($db,$query_lazada);
           
            while($row=mysqli_fetch_array($result_lazada)){
                        array_push($rows_lazada,$row);
           }           
                
            $query_lazada_path2="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTH(p.post_date),'_',$end_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$todate 23:59:00'                                      
                        AND n.ord_category IN (20,26)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";  
            $result_lazada_path2=mysqli_query($db,$query_lazada_path2);
            while($row1=mysqli_fetch_array($result_lazada_path2)){
                        array_push($rows_lazada,$row1);
           }
           //---------------------------------------------
           $query_eglips="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTH(p.post_date),'_',$start_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$start_year-12-31 23:59:00'                                      
                        AND n.ord_category IN (18)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";
            $result_eglips=mysqli_query($db,$query_eglips);
           
            while($row=mysqli_fetch_array($result_eglips)){
                        array_push($rows_eglips,$row);
           }           
                
            $query_eglips_path2="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTH(p.post_date),'_',$end_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$todate 23:59:00'                                      
                        AND n.ord_category IN (18)
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";  
            $result_eglips_path2=mysqli_query($db,$query_eglips_path2);
            while($row1=mysqli_fetch_array($result_eglips_path2)){
                        array_push($rows_eglips,$row1);
           }
        }
        $arr_data=array("location_total"=>$rows_all,"location_sky007"=>$rows_sky007,"location_shopee"=>$rows_shopee,"location_lazada"=>$rows_lazada,"location_eglips"=>$rows_eglips);
        echo json_encode($arr_data);
        common_close_connect($db);
    }
        //============ END Location ======================================== 
        //============ Item  ===============================================
    public function sv_chart_report_item_get_list_product($product_type){
        $query="";
        if($product_type=="0"){
            $query="SELECT `product_id`,`product_name`,`sku` FROM `tb_stock_divide` WHERE `sku` NOT LIKE 'BA-CB%' 
                     AND `sku` !='' AND   `sku` NOT LIKE 'EG-CB%' AND `product_name` NOT LIKE '%combo%' AND sku NOT LIKE '%BA-GF%'  AND sku NOT LIKE '%EG-GF%'  
                     AND sku NOT LIKE '%SET%' AND sku not LIKE '%-R'";
        }else{
            $query="SELECT `product_id`,`product_name`,`sku` FROM `tb_stock_divide` WHERE `sku` NOT LIKE 'BA-CB%' 
                     AND `sku` !='' AND   `sku` NOT LIKE 'EG-CB%' AND `product_name` NOT LIKE '%combo%' AND sku NOT LIKE '%BA-GF%'  AND sku NOT LIKE '%EG-GF%'  
                     AND sku NOT LIKE '%SET%' AND sku LIKE '%-R'";
        }
        $db=common_connect();      
         $result=mysqli_query($db,$query);        
         $rows=array();
         while($row=mysqli_fetch_array($result)){ 
                array_push($rows,$row);               
        }
        echo json_encode($rows);
        common_close_connect($db);
    }
    function sv_chart_report_item_get_list_daily_sale($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];
        $list_item=$obj["item_list"];
        $type_customer_buy=$obj["type_customer_buy"];
        $str_condition_shop_type="";
        if($type_customer_buy=="1"){
            $str_condition_shop_type='AND n.`ord_category` IN(0,5,7,10,20,46,44,34,36,50,58,62)';
        }else if($type_customer_buy=="2"){
            $str_condition_shop_type='AND n.`ord_category` IN(48,52,54,56,60)';
        }else if($type_customer_buy=="3"){
            $str_condition_shop_type='AND n.`ord_category` IN(64,65,66,68,70)';
        }
        $query="";
        if($type_customer_buy=="0"){
           $query="SELECT oim_product_id.meta_value AS `product_id`, oi.order_item_name AS `product_name` ,SUM(oim_quantity.meta_value) AS `quantity`,DATE(p.post_date) AS `post_date`
                FROM `aowp_posts` p
                	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                	AND order_item_type='line_item'
                	AND oim_product_id.meta_key='_product_id'
                	AND oim_quantity.meta_key='_qty'
                	GROUP BY DATE(p.post_date) ,oim_product_id.meta_value
                	HAVING oim_product_id.meta_value IN ($list_item)";   
        }else {
            $query="SELECT oim_product_id.meta_value AS `product_id`, oi.order_item_name AS `product_name` ,SUM(oim_quantity.meta_value) AS `quantity`,DATE(p.post_date) AS `post_date`
                FROM `aowp_posts` p
                	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                    LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                	AND order_item_type='line_item'
                	AND oim_product_id.meta_key='_product_id'
                	AND oim_quantity.meta_key='_qty'
                    $str_condition_shop_type
                	GROUP BY DATE(p.post_date) ,oim_product_id.meta_value
                	HAVING oim_product_id.meta_value IN ($list_item)"; 
        }
           
        $db     = common_connect();
        $result = mysqli_query($db, $query);
        
        $rows   = array();
        
        while ($row = mysqli_fetch_array($result)) {
           
            array_push($rows, $row);
            
        } 
        $rows_name=array();
        $result_item_name_variation=mysqli_query($db,"SELECT p.id, CONCAT_WS(' # ',p.post_title,pm_color.meta_value) AS `name`
                                            FROM `aowp_posts` p	
                                            	LEFT JOIN `aowp_postmeta` pm_color ON pm_color.post_id=p.id
                                            WHERE p.id IN($list_item)
                                            	AND pm_color.meta_key='attribute_pa_color'
                                            	AND p.post_type='product_variation'");
                                                  
        while ($row = mysqli_fetch_array($result_item_name_variation)) {
           
            array_push($rows_name, $row);
            
        } 
        $result_item_name=mysqli_query($db,"SELECT id , post_title AS `name`
                                            FROM `aowp_posts` 
                                            WHERE id IN($list_item)
                                                  AND post_type='product'");
                                                    
        while ($row = mysqli_fetch_array($result_item_name)) {
           
            array_push($rows_name, $row);
            
        } 
        
             
        $arr_data=array("datafilter"=>$rows,"list_item_name"=>$rows_name,);
        echo json_encode($arr_data);             
        
        common_close_connect($db);  
    }
    public function sv_chart_report_item_get_list_monthly_sale($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];
        $list_item=$obj["item_list"];
        $shop_sale=$obj["shop_sale"];
        $db     = common_connect();      
        $str_main_order="";
        $str_marketing_order="";
        if($shop_sale=="1"){
            $str_main_order="AND n.`ord_category` IN(0,5,7,10,20,46,44,34,36,50,58,62)";
          //  $str_marketing_order="AND n.`ord_category` IN(0,5,7,10,20,46,44,34,36,50,58,62)";
        }else if ($shop_sale=="2"){
            $str_main_order="AND n.`ord_category` IN(48,52,54,56,60)";            
        }else if ($shop_sale=="3"){
            $str_main_order="AND n.`ord_category` IN(64,65,66,68,70)";
           // $str_marketing_order="AND n.`ord_category`=11";
        }
        
        $rows_name=array();
        $result_item_name_variation=mysqli_query($db,"SELECT p.id, CONCAT_WS(' # ',p.post_title,pm_color.meta_value) AS `name`
                                            FROM `aowp_posts` p	
                                            	LEFT JOIN `aowp_postmeta` pm_color ON pm_color.post_id=p.id
                                            WHERE p.id IN($list_item)
                                            	AND pm_color.meta_key='attribute_pa_color'
                                            	AND p.post_type='product_variation'");                                                  
        while ($row = mysqli_fetch_array($result_item_name_variation)) {           
            array_push($rows_name, $row);            
        } 
        $result_item_name=mysqli_query($db,"SELECT id , post_title AS `name`
                                            FROM `aowp_posts` 
                                            WHERE id IN($list_item)
                                                  AND post_type='product'");                                                    
        while ($row = mysqli_fetch_array($result_item_name)) {           
            array_push($rows_name, $row);            
        }
        
        if($shop_sale=="0" || $shop_sale=="2" || $shop_sale=="7"){
           $query="SELECT oim_product_id.meta_value AS `product_id` ,SUM(oim_quantity.meta_value) AS `quantity`,CONCAT(MONTHNAME(p.post_date),'(',YEAR(p.post_date),')') AS `post_date`
                        FROM `aowp_posts` p
                        	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id  
                            LEFT JOIN `tb_ord_note` n ON n.order_id=p.id                      
                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                        WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                        	AND order_item_type='line_item' 
                            $str_main_order                       
                        	AND oim_product_id.meta_key='_product_id'
                        	AND oim_quantity.meta_key='_qty'
                        	GROUP BY MONTH(p.post_date) ,oim_product_id.meta_value
                        	HAVING oim_product_id.meta_value  IN ($list_item)";
            $result=mysqli_query($db,$query);
            $rows   = array();        
            while ($row = mysqli_fetch_array($result)) {               
                array_push($rows, $row);                
            }
            $arr_data=array("data"=>$rows,"list_item_name"=>$rows_name);
            echo json_encode($arr_data);  
        }
        else {
            $query="SELECT oim_product_id.meta_value AS `product_id` ,SUM(oim_quantity.meta_value) AS `quantity`,CONCAT(MONTHNAME(p.post_date),'(',YEAR(p.post_date),')') AS `post_date`
                        FROM `aowp_posts` p
                        	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                        	LEFT JOIN `tb_ord_note` n ON n.order_id=p.id
                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                        WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                        	AND order_item_type='line_item'
                        	$str_main_order
                        	AND oim_product_id.meta_key='_product_id'
                        	AND oim_quantity.meta_key='_qty'
                        	GROUP BY MONTH(p.post_date) ,oim_product_id.meta_value
                        	HAVING oim_product_id.meta_value  IN ($list_item)";
            $query_marketing="SELECT oim_product_id.meta_value AS `product_id` ,SUM(oim_quantity.meta_value) AS `quantity`,CONCAT(MONTHNAME(p.post_date),'(',YEAR(p.post_date),')') AS `post_date`
                        FROM `aowp_posts` p
                        	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                        	LEFT JOIN `tb_ord_note` n ON n.order_id=p.id
                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                        WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                        	AND order_item_type='line_item'
                        	$str_marketing_order
                        	AND oim_product_id.meta_key='_product_id'
                        	AND oim_quantity.meta_key='_qty'
                        	GROUP BY MONTH(p.post_date) ,oim_product_id.meta_value
                        	HAVING oim_product_id.meta_value  IN ($list_item)";
            $result=mysqli_query($db,$query);
            $rows   = array();        
            while ($row = mysqli_fetch_array($result)) {               
                array_push($rows, $row);                
            }
            
            $result_marketing=mysqli_query($db,$query_marketing);
            $rows_marketing   = array();        
            while ($row = mysqli_fetch_array($result_marketing)) {               
                array_push($rows_marketing, $row);                
            }
            $arr_data=array("data"=>$rows,"data_marketing"=>$rows_marketing,"list_item_name"=>$rows_name);
            echo json_encode($arr_data);            
        }
        
        common_close_connect($db);
    }
    public function sv_chart_report_item_get_list_top_sale($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];       
        $shop_sale=$obj["shop_sale"];
        $number_items_show=$obj["number_items_show"];
        $brand_name=$obj["brand_name"];
        $list_items=$obj["list_items"];
        $city=$obj["city"]; 
        $query_choose_item=""; 
        if($list_items!=""){
            $query_choose_item="AND oim_product_id.meta_value IN ($list_items)";
        }
        $query_city="";
        if($city!="ALL"){
           $query_city= "AND pm.meta_value='$city'";
        }    
       
        $str_shop_sale="";
        if($shop_sale=="1"){
            $str_shop_sale="AND n.ord_category IN(0,5)";
        }else if($shop_sale=="2"){
            $str_shop_sale="AND n.ord_category =7";
        }else if($shop_sale=="3"){
            $str_shop_sale="AND n.ord_category IN(10,11)";
        }else if($shop_sale=="4"){
            $str_shop_sale="AND n.ord_category IN(24,25)";
        }else if($shop_sale=="5"){
            $str_shop_sale="AND n.ord_category IN(14,15)";
        }else if($shop_sale=="6"){
            $str_shop_sale="AND n.ord_category IN(18,19)";
        }else if($shop_sale=="7"){
            $str_shop_sale="AND n.ord_category =22";
        }else if($shop_sale=="8"){
            $str_shop_sale="AND n.ord_category IN(20,21)";
        }else if($shop_sale=="9"){
            $str_shop_sale="AND n.ord_category IN(26,27)";
        }else if($shop_sale=="10"){
            $str_shop_sale="AND n.ord_category IN(28,29)";
        }else if($shop_sale=="11"){
            $str_shop_sale="AND n.ord_category IN(34,35)";
        }else if($shop_sale=="12"){
            $str_shop_sale="AND n.ord_category IN(36,37)";
        }else if($shop_sale=="13"){
            $str_shop_sale="AND n.ord_category IN(38,39)";
        }else if($shop_sale=="14"){
            $str_shop_sale="AND n.ord_category IN(40,41)";
        }else if($shop_sale=="15"){
            $str_shop_sale="AND n.ord_category IN(42,43)";
        }else if($shop_sale=="16"){
            $str_shop_sale="AND n.ord_category IN(44,45)";
        }
        
        $str_query="";
        if($brand_name=="1"){
            $str_query="HAVING product_name  LIKE '%bbia%'";
        }else if($brand_name=="2"){
            $str_query="HAVING product_name  LIKE '%eglips%' ";
        }else if($brand_name=="3"){
            $str_query="HAVING product_name NOT LIKE '%eglips%' AND product_name NOT LIKE '%bbia%'";
        }
        
        $query="SELECT sd.product_id, sd.`product_name`,IF(sd.`sku` LIKE '%-R',1,0) AS product_type,a.quantity
                FROM tb_stock_divide sd 
                LEFT JOIN (SELECT oim_product_id.meta_value AS `product_id` ,SUM(oim_quantity.meta_value) AS `quantity`,oi.order_item_name AS `product_name`
                    FROM `aowp_posts` p
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                    	LEFT JOIN `tb_ord_note` n ON n.order_id=p.id
                        LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id			
                    WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                    	AND order_item_type='line_item'
                    	AND oim_product_id.meta_key='_product_id'
                        AND pm.meta_key='_billing_city'
                        $query_city
                        $query_choose_item
                    	$str_shop_sale
                    	AND oim_quantity.meta_key='_qty'                	
                    	GROUP BY oim_product_id.meta_value
                        $str_query
                    	ORDER BY quantity DESC) a ON sd.product_id=a.product_id
                WHERE a.quantity IS NOT NULL";
                          
           
            
      //  echo($query)   ;die();
        $db     = common_connect();
        $rows  = array();
        $result = mysqli_query($db, $query);
        while ($row = mysqli_fetch_array($result)) {
           
            array_push($rows, $row);
            
        }
        echo json_encode($rows);  
        common_close_connect($db);  
    }
        //============ End Item  ===========================================     
        
        //============= Heat map ===========================================
    public function sv_chart_report_heat_map($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];
        $shop_type=$obj["shop_type"];
        $categories_number=""; //542 : Bbia product , 543 : eglips product
        $db     = common_connect();
        if($shop_type=="1"){
            $categories_number="AND d.product_name LIKE 'Bbia%'";            
           
        }else if($shop_type=="2"){
              $categories_number="AND d.product_name LIKE 'Eglips%'";
        }
      /*  $result=mysqli_query($db,"SELECT item_id,quantity,color_detail,color_tone,d.product_name
                                FROM
                                (SELECT oim_product_id.meta_value AS `item_id`, SUM(oim_quantity.meta_value) AS `quantity` , IF(price_item.meta_value!=0,1,price_item.meta_value) AS `check_mt`
                            	FROM `aowp_posts` p
                            		LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                            		LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                            		LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                            		LEFT JOIN `aowp_woocommerce_order_itemmeta` oi_variation_id ON oi_variation_id.order_item_id=oi.order_item_id 
                            		LEFT JOIN `aowp_woocommerce_order_itemmeta` price_item ON price_item.order_item_id=oi.order_item_id
                            		LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                    LEFT JOIN `aowp_term_relationships` tr ON oim_product_id.meta_value=tr.object_id
                                    LEFT JOIN `aowp_term_relationships` tr_brain ON oim_product_id.meta_value=tr_brain.object_id
                            	WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                            		AND order_item_type='line_item'
                            		AND oim_product_id.meta_key='_product_id'
                            		AND oi_variation_id.meta_key='_variation_id'
                            		AND oi_variation_id.meta_value='0'		
                            		AND oim_quantity.meta_key='_qty'
                            	    AND tr.term_taxonomy_id='532'
                                    AND tr_brain.term_taxonomy_id ='$categories_number' 
                                	AND price_item.meta_key='_line_total'  
                            		GROUP BY oim_product_id.meta_value,check_mt
                            	    UNION
                                SELECT oim_product_id.meta_value AS `item_id`, SUM(oim_quantity.meta_value) AS `quantity` , IF(price_item.meta_value!=0,1,price_item.meta_value) AS `check_mt`
                            	FROM `aowp_posts` p
                            		LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                            		LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                            		LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                            		LEFT JOIN `aowp_woocommerce_order_itemmeta` oi_variation_id ON oi_variation_id.order_item_id=oi.order_item_id 
                            		LEFT JOIN `aowp_woocommerce_order_itemmeta` price_item ON price_item.order_item_id=oi.order_item_id
                            		LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                    LEFT JOIN `aowp_term_relationships` tr ON oim_product_id.meta_value=tr.object_id
                                    LEFT JOIN `aowp_term_relationships` tr_brain ON oim_product_id.meta_value=tr_brain.object_id
                            	WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                            		AND order_item_type='line_item'
                            		AND oim_product_id.meta_key='_product_id'
                            		AND oi_variation_id.meta_key='_variation_id'
                            		AND oi_variation_id.meta_value!='0'		
                            		AND oim_quantity.meta_key='_qty'
                                    AND tr.term_taxonomy_id='532'
                                    AND tr_brain.term_taxonomy_id ='$categories_number'
                            		AND price_item.meta_key='_line_total'  
                            		GROUP BY oim_product_id.meta_value,check_mt) AS `tb_qty_sale`
                            LEFT JOIN `tb_stock_divide` d ON d.product_id=tb_qty_sale.item_id
                            WHERE check_mt=1 ORDER BY color_tone  , quantity "); */
      
       $result=mysqli_query($db,"SELECT item_id,quantity,color_detail,color_tone,d.product_name
                                FROM ( 
                                SELECT oim_product_id.meta_value AS `item_id`, SUM(oim_quantity.meta_value) AS `quantity` , IF(price_item.meta_value!=0,1,price_item.meta_value) AS `check_mt`
                                FROM `aowp_posts` p
                                	 JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                                	 JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                                	 JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id	
                                	 JOIN `aowp_woocommerce_order_itemmeta` price_item ON price_item.order_item_id=oi.order_item_id
                                	 JOIN `tb_ord_note` n ON p.id=n.order_id	
                                WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                                	AND order_item_type='line_item'
                                	AND oim_product_id.meta_key='_product_id'		
                                	AND oim_quantity.meta_key='_qty'	
                                	AND price_item.meta_key='_line_total'  
                                	GROUP BY oim_product_id.meta_value,check_mt) AS `tb_qty_sale`
                                LEFT JOIN `tb_stock_divide` d ON d.product_id=tb_qty_sale.item_id
                                    WHERE check_mt=1 AND 
                                    d.`color_tone`!=''
                                    $categories_number
                                    ORDER BY color_tone  , quantity");         
       $rows_time=array();
        while($row=mysqli_fetch_array($result)){
            array_push($rows_time,$row);
        }       
        echo json_encode($rows_time); 
        common_close_connect($db);  
        
    }
        //============= END heat map =======================================
        //============ Time Based  ========================================= 
    public function sv_chart_report_time_based($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];
        $db     = common_connect();
        $result_time=mysqli_query($db,"SELECT  CAST(p.post_date AS TIME) AS hr, HOUR(CAST(p.post_date AS TIME)) AS h , COUNT(p.ID) AS ord_n FROM aowp_posts AS p
                                LEFT JOIN tb_ord_note AS rn ON rn.order_id = p.ID
                                WHERE p.post_type='shop_order' AND p.post_status !='trash' AND p.post_status !='wc-cancelled' 
                                AND rn.ord_category=0 AND  CAST(p.post_date AS DATE) BETWEEN '".$startdate."' AND '".$enddate."'  
                                GROUP BY HOUR(CAST(p.post_date AS TIME))  ORDER BY h");
                
       $rows_time=array();
        while($row=mysqli_fetch_array($result_time)){
            array_push($rows_time,$row);
        }       
        echo json_encode($rows_time); 
        common_close_connect($db);  
    }
    public function sv_chart_report_time_based_monthly_sale($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];       
        $shop_sale=$obj["shop_sale"];
        $db=common_connect();    
        $start_year=intval(substr($startdate,0,4));
        $end_year=  intval(substr($enddate,0,4));
       // echo($end_year);die();
        
        $rows=array();
        if($start_year==$end_year){    
            $query="";
            if($shop_sale==48){
               $query="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, MONTH(p.post_date) AS`time`
                    FROM `aowp_posts` p 
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'
                    	AND orn.ord_category='$shop_sale'
                    	AND oi.order_item_type='line_item'
                    	AND oim_totalprice.meta_key='_line_total'
                    	AND oim_productid.meta_key='_product_id'
                    	GROUP BY  MONTH(p.post_date)
                    	ORDER BY `time`";  
            }else{
                $query="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`,tb_category.category, MONTH(p.post_date) AS`time`
                    FROM `aowp_posts` p 
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id
                    	LEFT JOIN (SELECT id , IF(post_title LIKE '%Eglips%' ,1,IF(post_title LIKE '%Bbia%',2,0)) AS `category` FROM  `aowp_posts` WHERE   (post_type='product' OR post_type='product_variation')  AND post_status IN ('publish','private')) AS tb_category ON tb_category.id=oim_productid.meta_value
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'
                    	AND orn.ord_category='$shop_sale'
                    	AND oi.order_item_type='line_item'
                    	AND oim_totalprice.meta_key='_line_total'
                    	AND oim_productid.meta_key='_product_id'
                    	GROUP BY tb_category.category , MONTH(p.post_date)
                    	ORDER BY `time`";  
            }
            
            $result=mysqli_query($db,$query);
           
            while($row=mysqli_fetch_array($result)){
                        array_push($rows,$row);
           }              
        }else if($start_year<$end_year){
            $query="";
            if($shop_sale==48){
                $query="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`,CONCAT(MONTH(p.post_date),'_',$start_year) AS`time`
                        FROM `aowp_posts` p 
                        	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                        	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                        	
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$start_year-12-31 23:59:59'
                        	AND orn.ord_category='$shop_sale'
                        	AND oi.order_item_type='line_item'
                        	AND oim_totalprice.meta_key='_line_total'
                        	AND oim_productid.meta_key='_product_id'
                        	GROUP BY  MONTH(p.post_date)
                        	ORDER BY `time`";
                 $query1="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`,CONCAT(MONTH(p.post_date),'_',$end_year) AS`time`
                    FROM `aowp_posts` p 
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'
                    	AND orn.ord_category='$shop_sale'
                    	AND oi.order_item_type='line_item'
                    	AND oim_totalprice.meta_key='_line_total'
                    	AND oim_productid.meta_key='_product_id'
                    	GROUP BY MONTH(p.post_date)
                    	ORDER BY `time`"; 
            }else{
               $query="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`,tb_category.category,CONCAT(MONTH(p.post_date),'_',$start_year) AS`time`
                        FROM `aowp_posts` p 
                        	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                        	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                        	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id
                        	LEFT JOIN (SELECT id , IF(post_title LIKE '%Eglips%' ,1,IF(post_title LIKE '%Bbia%',2,0)) AS `category` FROM  `aowp_posts` WHERE   (post_type='product' OR post_type='product_variation')  AND post_status IN ('publish','private')) AS tb_category ON tb_category.id=oim_productid.meta_value
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$start_year-12-31 23:59:59'
                        	AND orn.ord_category='$shop_sale'
                        	AND oi.order_item_type='line_item'
                        	AND oim_totalprice.meta_key='_line_total'
                        	AND oim_productid.meta_key='_product_id'
                        	GROUP BY tb_category.category , MONTH(p.post_date)
                        	ORDER BY `time`"; 
                $query1="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`,tb_category.category,CONCAT(MONTH(p.post_date),'_',$end_year) AS`time`
                    FROM `aowp_posts` p 
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id
                    	LEFT JOIN (SELECT id , IF(post_title LIKE '%Eglips%' ,1,IF(post_title LIKE '%Bbia%',2,0)) AS `category` FROM  `aowp_posts` WHERE   (post_type='product' OR post_type='product_variation')  AND post_status  IN ('publish','private')) AS tb_category ON tb_category.id=oim_productid.meta_value
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'
                    	AND orn.ord_category='$shop_sale'
                    	AND oi.order_item_type='line_item'
                    	AND oim_totalprice.meta_key='_line_total'
                    	AND oim_productid.meta_key='_product_id'
                    	GROUP BY tb_category.category , MONTH(p.post_date)
                    	ORDER BY `time`"; 
            }
            $result=mysqli_query($db,$query);
           
            while($row=mysqli_fetch_array($result)){
                        array_push($rows,$row);
           }
           
                                 
            $result1=mysqli_query($db,$query1);
            while($row1=mysqli_fetch_array($result1)){
                        array_push($rows,$row1);
           }
        }
        echo json_encode($rows); 
        common_close_connect($db); 
    }
    public function sv_chart_report_time_based_monthly_sale_total($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];       
       
        $db=common_connect();    
        $start_year=intval(substr($startdate,0,4));
        $end_year=  intval(substr($enddate,0,4));
       // echo($end_year);die();
        
        $rows_hcm=array();
        $rows_hn=array();
        if($start_year==$end_year){
           $query_hcm="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, MONTH(p.post_date) AS`time`
                    FROM `aowp_posts` p 
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id                    	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'
                    	AND oi.order_item_type='line_item'
                    	AND oim_totalprice.meta_key='_line_total'    AND orn.ord_category IN(0,7,5,10,11,20,21,30,31,32,33,34,35,36,37,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63)           
                    	GROUP BY   MONTH(p.post_date)
                    	ORDER BY `time`";   
            $result_hcm=mysqli_query($db,$query_hcm);
           
            while($row=mysqli_fetch_array($result_hcm)){
                        array_push($rows_hcm,$row);
           } 
         
           $query_hn="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, MONTH(p.post_date) AS`time`
                    FROM `aowp_posts` p 
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id     
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'
                    	AND oi.order_item_type='line_item'
                    	AND oim_totalprice.meta_key='_line_total'    and orn.ord_category IN(18,19,22,24,25,26,27,64,65,66,67,68,69,70,71)           
                    	GROUP BY   MONTH(p.post_date)
                    	ORDER BY `time`";   
            $result_hn=mysqli_query($db,$query_hn);
           
            while($row=mysqli_fetch_array($result_hn)){
                        array_push($rows_hn,$row); 
           }             
        }else if($start_year<$end_year){
            $query_hcm="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, CONCAT(MONTH(p.post_date),'_',$start_year) AS`time`
                    FROM `aowp_posts` p 
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id                    	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$start_year-12-31 23:59:59'
                    	AND oi.order_item_type='line_item'
                    	AND oim_totalprice.meta_key='_line_total'    AND orn.ord_category IN(0,7,5,10,11,20,21,30,31,32,33,34,35,36,37,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63)           
                    	GROUP BY   MONTH(p.post_date)"; 
            $result_hcm=mysqli_query($db,$query_hcm);
           
            while($row=mysqli_fetch_array($result_hcm)){
                        array_push($rows_hcm,$row);
           }
           
           $query_hcm_1="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, CONCAT(MONTH(p.post_date),'_',$end_year) AS`time`
                    FROM `aowp_posts` p 
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id                    	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'
                    	AND oi.order_item_type='line_item'
                    	AND oim_totalprice.meta_key='_line_total'    AND orn.ord_category IN(0,7,5,10,11,20,21,30,31,32,33,34,35,36,37,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63)           
                    	GROUP BY   MONTH(p.post_date)";                        
            $result_hcm_1=mysqli_query($db,$query_hcm_1);
            while($row1=mysqli_fetch_array($result_hcm_1)){
                        array_push($rows_hcm,$row1);  
           }
           
           //-----------------------------------------
           $query_hn="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, CONCAT(MONTH(p.post_date),'_',$start_year) AS`time`
                    FROM `aowp_posts` p 
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id     
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$start_year-12-31 23:59:59'
                    	AND oi.order_item_type='line_item'
                    	AND oim_totalprice.meta_key='_line_total'    and orn.ord_category IN(18,19,22,24,25,26,27,64,65,66,67,68,69,70,71)           
                    	GROUP BY   MONTH(p.post_date)"; 
            $result_hn=mysqli_query($db,$query_hn);
           
            while($row=mysqli_fetch_array($result_hn)){
                        array_push($rows_hn,$row);
           }
           
           $query_hn_1="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, CONCAT(MONTH(p.post_date),'_',$end_year) AS`time`
                    FROM `aowp_posts` p 
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                    	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id     
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'
                    	AND oi.order_item_type='line_item'
                    	AND oim_totalprice.meta_key='_line_total'    and orn.ord_category IN(18,19,22,24,25,26,27,64,65,66,67,68,69,70,71)           
                    	GROUP BY   MONTH(p.post_date)";                        
            $result_hn_1=mysqli_query($db,$query_hn_1);
            while($row1=mysqli_fetch_array($result_hn_1)){
                        array_push($rows_hn,$row1);
           }
        }
        $arr_data=array("data_hcm"=>$rows_hcm,"data_hn"=>$rows_hn);
        echo json_encode($arr_data); 
        common_close_connect($db); 
    }
    public function sv_chart_report_time_based_monthly_comparison($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];   
        $db=common_connect();    
        $start_year=intval(substr($startdate,0,4));
        $end_year=  intval(substr($enddate,0,4));
        $rows=array();
        if($start_year==$end_year){
        /*   $query="SELECT  online.`time`,
            	  online.total_price AS total_online,
            	  IF(offline.time IS NULL,0,offline.total_price) AS total_offline
              FROM
              (SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, MONTH(p.post_date) AS`time`
                                            FROM `aowp_posts` p 
                                            	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                            	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    	
                                            WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN  '$startdate 00:00:00' AND '$enddate 23:59:59'
                                            	AND orn.ord_category IN (0,5,10,11,20,21,31,36,37,45,48,51,52,53,54,55,56,57,58,59,16,17,18,19,24,25,26,27,28,29)
                                            	AND oi.order_item_type='line_item'
                                            	AND oim_totalprice.meta_key='_line_total'
                                            	AND oim_productid.meta_key='_product_id'
                                            	GROUP BY  MONTH(p.post_date)
                                            	ORDER BY `time`) AS online 
                                            	
              LEFT JOIN  (SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, MONTH(p.post_date) AS`time`
            			FROM `aowp_posts` p 
            				LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
            				LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
            				LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
            				LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    	
            			WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'
            				AND orn.ord_category IN (7,22,44,50,30)
            				AND oi.order_item_type='line_item'
            				AND oim_totalprice.meta_key='_line_total'
            				AND oim_productid.meta_key='_product_id'
            				GROUP BY  MONTH(p.post_date)
            				ORDER BY `time`) AS offline   ON online.time = offline.time";   */
                            
            $query="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, MONTH(p.post_date) AS`time`,orn.ord_category
                    FROM `aowp_posts` p 
                	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'                                          
                	AND oi.order_item_type='line_item'
                	AND oim_totalprice.meta_key='_line_total'
                	AND oim_productid.meta_key='_product_id'
                	GROUP BY  MONTH(p.post_date) ,orn.ord_category";
            $result=mysqli_query($db,$query);
           
            while($row=mysqli_fetch_array($result)){
                        array_push($rows,$row);
           }              
        }else if($start_year<$end_year){
          /*  $query="SELECT  online.`time`,
            	   online.total_price AS total_online,
            	   IF(offline.time IS NULL,0,offline.total_price) AS total_offline
                  FROM
                  (SELECT  SUM(oim_totalprice.meta_value) AS `total_price`,CONCAT(MONTH(p.post_date),'_',$start_year) AS`time`
                                                FROM `aowp_posts` p 
                                                	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                                	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    	
                                                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN  '$startdate 00:00:00' AND '$start_year-12-31 23:59:59'
                                                	AND orn.ord_category IN (0,5,10,11,20,21,31,36,37,45,48,51,52,53,54,55,56,57,58,59,16,17,18,19,24,25,26,27,28,29)
                                                	AND oi.order_item_type='line_item'
                                                	AND oim_totalprice.meta_key='_line_total'
                                                	AND oim_productid.meta_key='_product_id'
                                                	GROUP BY  MONTH(p.post_date)
                                                	ORDER BY `time`) AS online 
                                                	
                  LEFT JOIN  (SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, CONCAT(MONTH(p.post_date),'_',$start_year) AS`time`
                			FROM `aowp_posts` p 
                				LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                				LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                				LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                				LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    	
                			WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$start_year-12-31 23:59:59'
                				AND orn.ord_category IN (7,22,44,50,30)
                				AND oi.order_item_type='line_item'
                				AND oim_totalprice.meta_key='_line_total'
                				AND oim_productid.meta_key='_product_id'
                				GROUP BY  MONTH(p.post_date)
                				ORDER BY `time`) AS offline   ON online.time = offline.time"; */
            $query="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, CONCAT(MONTH(p.post_date),'_',$start_year) AS`time`,orn.ord_category
                    FROM `aowp_posts` p 
                	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN  '$startdate 00:00:00' AND '$start_year-12-31 23:59:59'                                         
                	AND oi.order_item_type='line_item'
                	AND oim_totalprice.meta_key='_line_total'
                	AND oim_productid.meta_key='_product_id'
                	GROUP BY  MONTH(p.post_date) ,orn.ord_category";
            $result=mysqli_query($db,$query);
           
            while($row=mysqli_fetch_array($result)){
                        array_push($rows,$row);
           }
           
          /* $query1="SELECT  online.`time`,
            	  online.total_price AS total_online,
            	  IF(offline.time IS NULL,0,offline.total_price) AS total_offline
              FROM
              (SELECT  SUM(oim_totalprice.meta_value) AS `total_price`,CONCAT(MONTH(p.post_date),'_',$end_year) AS`time`
                                            FROM `aowp_posts` p 
                                            	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                            	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    	
                                            WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN  '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'
                                            	AND orn.ord_category IN (0,5,10,11,20,21,31,36,37,45,48,51,52,53,54,55,56,57,58,59,16,17,18,19,24,25,26,27,28,29)
                                            	AND oi.order_item_type='line_item'
                                            	AND oim_totalprice.meta_key='_line_total'
                                            	AND oim_productid.meta_key='_product_id'
                                            	GROUP BY  MONTH(p.post_date)
                                            	ORDER BY `time`) AS online 
                                            	
              LEFT JOIN  (SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, CONCAT(MONTH(p.post_date),'_',$end_year) AS`time`
            			FROM `aowp_posts` p 
            				LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
            				LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
            				LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
            				LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    	
            			WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'
            				AND orn.ord_category IN (7,22,44,50,30)
            				AND oi.order_item_type='line_item'
            				AND oim_totalprice.meta_key='_line_total'
            				AND oim_productid.meta_key='_product_id'
            				GROUP BY  MONTH(p.post_date)
            				ORDER BY `time`) AS offline   ON online.time = offline.time";     */
              $query1="SELECT  SUM(oim_totalprice.meta_value) AS `total_price`, CONCAT(MONTH(p.post_date),'_',$end_year) AS`time`,orn.ord_category
                    FROM `aowp_posts` p 
                	LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                	LEFT JOIN `tb_ord_note`	orn ON p.id=orn.order_id
                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_totalprice ON oim_totalprice.order_item_id=oi.order_item_id
                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_productid ON oim_productid.order_item_id=oi.order_item_id                    	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN  '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'                                        
                	AND oi.order_item_type='line_item'
                	AND oim_totalprice.meta_key='_line_total'
                	AND oim_productid.meta_key='_product_id'
                	GROUP BY  MONTH(p.post_date) ,orn.ord_category";                  
                          
                                                       
            $result1=mysqli_query($db,$query1);
            while($row1=mysqli_fetch_array($result1)){
                        array_push($rows,$row1);
           }
        }
        echo json_encode($rows); 
        common_close_connect($db); 
    }
        //============ End Time Based  ===================================== 
        
        //============ chart order  ======================================== 
        
        public function sv_chart_report_order($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];       
        $shop_sale=$obj["shop_sale"];
      //  echo $shop_sale; die();
        if($shop_sale=="all"){
            $query="SELECT  COUNT(p.id) AS total_order , DATE_FORMAT(post_date,'%Y-%m-%d') AS `date`
                    FROM `aowp_posts` p    
                    LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id        	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'                 
                    GROUP BY DATE_FORMAT(post_date,'%Y-%m-%d')
                    ORDER BY `post_date`";
        }else{
            $query="SELECT  COUNT(p.id) AS total_order , DATE_FORMAT(post_date,'%Y-%m-%d') AS `date`
                    FROM `aowp_posts` p     
                    	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'
                    AND n.ord_category='$shop_sale'                  
                    GROUP BY DATE_FORMAT(post_date,'%Y-%m-%d')
                    ORDER BY `post_date`";
        }
        
        $db=common_connect();   
        $rows=array();        
        $result=mysqli_query($db,$query);           
        while($row=mysqli_fetch_array($result)){
                    array_push($rows,$row);
        }              
        
        echo json_encode($rows); 
        common_close_connect($db); 
    }
    public function sv_chart_report_order_total_new($startdate,$enddate){  
        $condition_date="AND p.post_date BETWEEN  '$startdate 00:00:00' AND '$enddate 23:59:59'";
        $query_order_total="SELECT  (p.id) AS order_number , n.ord_category ,IF(p.post_status='wc-cancelled',0,1) AS post_status
                            FROM `aowp_posts` p     
                            	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                            WHERE p.post_status !='trash' AND p.post_type='shop_order' $condition_date";
        $query_items_total="SELECT  (oim.meta_value) AS number_of_items,n.ord_category
                            FROM `aowp_posts` p     
                            	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                            	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                            	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                            WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                            	AND oi.order_item_type='line_item'
                            	AND oim.meta_key='_qty'";
        $db=common_connect();   
        $rows_order_total=array();        
        $result_order_total=mysqli_query($db,$query_order_total);           
        while($row=mysqli_fetch_array($result_order_total)){
                    array_push($rows_order_total,$row);
        }    
        $rows_items_total=array();        
        $result_items_total=mysqli_query($db,$query_items_total);           
        while($row=mysqli_fetch_array($result_items_total)){
                    array_push($rows_items_total,$row);
        }          
        $arr_data=array("order_total"=>$rows_order_total,"items_total"=>$rows_items_total);
        return ($arr_data); 
        common_close_connect($db); 
                
    }
     public function sv_chart_report_order_total($startdate,$enddate,$get_all){       
        $condition_date="";
      //  if($get_all!="0"){
            $condition_date="AND p.post_date BETWEEN  '$startdate 00:00:00' AND '$enddate 23:59:59'";
            
      //  }
        $query="SELECT to_total.total_order,tc_total.total_cancell,ti_total.total_item AS `total_item` ,tim_total.total_item_mt AS `total_item_mt`
			            ,to_sky007.total_order AS `sky007_order`,tc_sky007.total_cancell AS `sky007_cancell`,ti_sky007.total_item AS `sky007_item`,tim_sky007.total_item_mt AS `sky007_item_mt`
                    	,to_wholesaler.total_order AS `wholesaler_order`,tc_wholesaler.total_cancell AS `wholesaler_cancell`,ti_wholesaler.total_item AS `wholesaler_item`
                    	,to_shopee.total_order AS `shopee_order`,tc_shopee.total_cancell AS `shopee_cancell`,ti_shopee.total_item AS `shopee_item` ,tim_shopee.total_item_mt AS `shopee_item_mt`                    	
                    	,to_eglips.total_order AS `eglips_order`,tc_eglips.total_cancell AS `eglips_cancell`,ti_eglips.total_item AS `eglips_item`,tim_eglips.total_item_mt AS `eglips_item_mt`
                    	, to_lazada.total_order AS `lazada_order`,tc_lazada.total_cancell AS `lazada_cancell` ,ti_lazada.total_item AS `lazada_item` ,tim_lazada.total_item_mt AS `lazada_item_mt`
                    	, to_shopee_eglips.total_order AS `shopee_eglips_order` , tc_shopee_eglips.total_cancell AS `shopee_eglips_cancell`, ti_shopee_eglips.total_item AS `shopee_eglips_item`,tim_shopee_eglips.total_item_mt AS `shopee_eglips_item_mt`
                    	,to_eglips_wholesaler.total_order AS `wholesaler_eglips_order`,tc_eglips_wholesaler.total_cancell AS `wholesaler_eglips_cancell`,ti_eglips_wholesaler.total_item AS `wholesaler_eglips_item`
                    	, to_lazada_eglips.total_order AS `lazada_eglips_order`,tc_lazada_eglips.total_cancell AS `lazada_eglips_cancell` ,ti_lazada_eglips.total_item AS `lazada_eglips_item` ,tim_lazada_eglips.total_item_mt AS `lazada_eglips_item_mt`                        
                        , to_sociolla.total_order AS `sociolla_order`,tc_sociolla.total_cancell AS `sociolla_cancell`,ti_sociolla.total_item AS `sociolla_item` ,tim_sociolla.total_item_mt AS `sociolla_item_mt`
                        , to_watsons.total_order AS `watsons_order`,tc_watsons.total_cancell AS `watsons_cancell`,ti_watsons.total_item AS `watsons_item`,tim_watsons.total_item_mt AS `watsons_item_mt`
                        , to_beautybox.total_order AS `beautybox_order`,tc_beautybox.total_cancell AS `beautybox_cancell`,ti_beautybox.total_item AS `beautybox_item`,tim_beautybox.total_item_mt AS `beautybox_item_mt`
                        , to_tiki.total_order AS `tiki_order`,tc_tiki.total_cancell AS `tiki_cancell`,ti_tiki.total_item AS `tiki_item`,tim_tiki.total_item_mt AS `tiki_item_mt`                        
                        , to_tiki_eglips.total_order AS `tiki_eglips_order`,tc_tiki_eglips.total_cancell AS `tiki_eglips_cancell`,ti_tiki_eglips.total_item AS `tiki_eglips_item`,tim_tiki_eglips.total_item_mt AS `tiki_eglips_item_mt`
                        , to_bbiavn.total_order AS `bbiavn_order`,tc_bbiavn.total_cancell AS `bbiavn_cancell`,ti_bbiavn.total_item AS `bbiavn_item`,tim_bbiavn.total_item_mt AS `bbiavn_item_mt`
                    FROM 
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category IN (0,7,10,14,16,18,20,22,24,26,28,30 ,34 ,36 ,42,46) ) AS to_total,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category IN (0,7,10,14,16,18,20,22,24,26,28,30,34 ,36,42,46)  ) AS   tc_total ,                                        
		    
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category IN (0,7,10,14,16,18,20,22,24,26,28,30,34 ,36,42,46)) AS ti_total   ,
                        
                        (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category IN (5,13,11,15,17,19,21,25,27,29,31,35,37,43,47)) AS tim_total   , 
                                        
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 0 ) AS to_sky007,
                    (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =5) AS tim_sky007   , 
                        
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 0  ) AS   tc_sky007 ,
                                        
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 0) AS ti_sky007   ,                        
                                        
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 7 ) AS to_wholesaler,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 7  ) AS   tc_wholesaler ,
                     (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 7) AS ti_wholesaler   ,                                                   
                    
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 10)  AS to_shopee,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 10  ) AS   tc_shopee , 
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 10) AS ti_shopee   ,
                    (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =11) AS tim_shopee   ,                                            
                    
                        
                     (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 44)  AS to_sociolla,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 44  ) AS   tc_sociolla ,
                     (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 44) AS ti_sociolla   ,
                    (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =45) AS tim_sociolla   ,                        
                   
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 18)  AS to_eglips,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 18  ) AS   tc_eglips ,
                     (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 18) AS ti_eglips   ,
                     (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =19) AS tim_eglips   ,                          
                                        
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 20)  AS to_lazada,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 20  ) AS   tc_lazada,
                     (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 20) AS ti_lazada   ,
                     (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =21) AS tim_lazada   ,                      
                                        
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 24)  AS to_shopee_eglips,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 24  ) AS   tc_shopee_eglips,
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 24) AS ti_shopee_eglips   , 
                    (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =25) AS tim_shopee_eglips   ,                      
                                        
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 22)  AS to_eglips_wholesaler,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 22  ) AS   tc_eglips_wholesaler,
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 22) AS ti_eglips_wholesaler   ,                    
                                        
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 26)  AS to_lazada_eglips,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 26  ) AS   tc_lazada_eglips,
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 26) AS ti_lazada_eglips   ,
                    (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =27) AS tim_lazada_eglips   ,         
                        
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 30)  AS to_watsons,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 30  ) AS   tc_watsons,
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 30) AS ti_watsons   ,
                    (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =31) AS tim_watsons   ,                 
                                        
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 34)  AS to_beautybox,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 34  ) AS   tc_beautybox,
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 34) AS ti_beautybox ,   
                   (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =35) AS tim_beautybox   ,                    
                                        
                    (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 36)  AS to_tiki,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 36  ) AS   tc_tiki,
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 36) AS ti_tiki,
                    (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =37) AS tim_tiki   ,   
                        
         (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 42)  AS to_tiki_eglips,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 42  ) AS   tc_tiki_eglips,
                    (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =43) AS tim_tiki_eglips   , 
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 42) AS ti_tiki_eglips,  
               (SELECT  COUNT(p.id) AS total_order 
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 46)  AS to_bbiavn,
                    (SELECT  COUNT(p.id) AS total_cancell
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id      	
                                        WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' $condition_date
                                        AND n.ord_category = 46  ) AS   tc_bbiavn,
                    (SELECT  SUM(oim.meta_value) AS total_item_mt
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category =47) AS tim_bbiavn   , 
                    (SELECT  SUM(oim.meta_value) AS total_item
                                        FROM `aowp_posts` p     
                                        	LEFT JOIN `tb_ord_note`	n ON p.id=n.order_id  
                                        	LEFT JOIN  aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	LEFT JOIN  aowp_woocommerce_order_itemmeta oim ON oi. order_item_id=oim.order_item_id  	
                                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' $condition_date
						AND oi.order_item_type='line_item'
						AND oim.meta_key='_qty'
						AND n.ord_category = 46) AS ti_bbiavn";
     //   echo $query ; die();
        $db=common_connect();   
        $rows=array();        
        $result=mysqli_query($db,$query);           
        while($row=mysqli_fetch_array($result)){
                    array_push($rows,$row);
        }              
        
        echo json_encode($rows); 
        common_close_connect($db); 
    }
    public function sv_chart_report_order_total_monthly($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];       
        
        $db=common_connect();    
        $start_year=intval(substr($startdate,0,4));
        $end_year=  intval(substr($enddate,0,4));
       // echo($end_year);die();
        
        $rows=array();
        $rows_number=array();
        if($start_year==$end_year){           
            $query="SELECT   MONTH(p.post_date) AS `date`,SUM(oim_price.meta_value) AS total_order ,n.ord_category               	
                    FROM `aowp_posts` p 
                        LEFT JOIN  `tb_ord_note` n ON p.id=n.order_id	
                    	LEFT JOIN  `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN  `aowp_woocommerce_order_itemmeta`  oim_price ON oi.order_item_id=oim_price.order_item_id	  	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'	   
                    	AND oi.order_item_type='line_item' AND oim_price.meta_key='_line_total'                   
                    	GROUP BY MONTH(p.post_date),n.ord_category" ;
            $result=mysqli_query($db,$query);
           
           while($row=mysqli_fetch_array($result)){
                        array_push($rows,$row);
           } 
           
           $query_number="SELECT  COUNT(p.id) AS total_order , MONTH(p.post_date) AS `date`,n.ord_category
                    FROM `aowp_posts` p
                    LEFT JOIN  `tb_ord_note` n ON p.id=n.order_id
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN  '$startdate 00:00:00' AND '$enddate 23:59:59'         
                    GROUP BY  MONTH(p.post_date),n.ord_category" ;
            $result_number=mysqli_query($db,$query_number);
           
           while($row=mysqli_fetch_array($result_number)){
                        array_push($rows_number,$row);
           }                   
        }else if($start_year<$end_year){            
            $query="SELECT   CONCAT(MONTH(p.post_date),'_',$start_year)  AS `date`,SUM(oim_price.meta_value) AS total_order   ,n.ord_category             	
                    FROM `aowp_posts` p 
                        LEFT JOIN  `tb_ord_note` n ON p.id=n.order_id	
                    	LEFT JOIN  `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN  `aowp_woocommerce_order_itemmeta`  oim_price ON oi.order_item_id=oim_price.order_item_id	  	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$start_year-12-31 23:59:59' 
                    	AND oi.order_item_type='line_item' AND oim_price.meta_key='_line_total'                   
                    	GROUP BY MONTH(p.post_date),n.ord_category";
            $result=mysqli_query($db,$query);
           
            while($row=mysqli_fetch_array($result)){
                        array_push($rows,$row);
           }           
                
            $query1="SELECT   CONCAT(MONTH(p.post_date),'_',$end_year)  AS `date`,SUM(oim_price.meta_value) AS total_order  ,n.ord_category              	
                    FROM `aowp_posts` p 	
                        LEFT JOIN  `tb_ord_note` n ON p.id=n.order_id
                    	LEFT JOIN  `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                    	LEFT JOIN  `aowp_woocommerce_order_itemmeta`  oim_price ON oi.order_item_id=oim_price.order_item_id	  	
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'
                    	AND oi.order_item_type='line_item' AND oim_price.meta_key='_line_total'                   
                    	GROUP BY MONTH(p.post_date),n.ord_category";  
            $result1=mysqli_query($db,$query1);
            while($row1=mysqli_fetch_array($result1)){
                        array_push($rows,$row1);
           }  
           
           $query_number="SELECT  COUNT(p.id) AS total_order , CONCAT(MONTH(p.post_date),'_',$start_year) AS `date`,n.ord_category
                    FROM `aowp_posts` p
                    LEFT JOIN  `tb_ord_note` n ON p.id=n.order_id
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN  '$startdate 00:00:00' AND '$start_year-12-31 23:59:59'          
                    GROUP BY  MONTH(p.post_date),n.ord_category";                   
            $result_number=mysqli_query($db,$query_number);
           
            while($row=mysqli_fetch_array($result_number)){
                        array_push($rows_number,$row);
           }           
                
            $query1_number="SELECT  COUNT(p.id) AS total_order , CONCAT(MONTH(p.post_date),'_',$end_year) AS `date`,n.ord_category
                    FROM `aowp_posts` p
                    LEFT JOIN  `tb_ord_note` n ON p.id=n.order_id
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN  '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'            
                    GROUP BY  MONTH(p.post_date),n.ord_category";                               
            $result1_number=mysqli_query($db,$query1_number);
            while($row1=mysqli_fetch_array($result1_number)){
                        array_push($rows_number,$row1);
           }         
        }
        $arr_data=array("data_total"=>$rows,"data_number"=>$rows_number);
        echo json_encode($arr_data);
        common_close_connect($db); 
    } 
        //============ End chart order  ==================================== 
    public function sv_chart_report_membership_order($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];
      //  echo $shop_sale; die();       
        $query="SELECT  COUNT(p.id) AS total_order , DATE_FORMAT(post_date,'%Y-%m-%d') AS `date`,
                	IF(um_roles.meta_value LIKE '%newmember%','New Member',IF(um_roles.meta_value LIKE '%general%','General',IF(um_roles.meta_value LIKE '%bronze%','Bronze',IF(um_roles.meta_value LIKE '%sliver%','Silver',IF(um_roles.meta_value LIKE '%gold%','Gold',IF(um_roles.meta_value LIKE '%platinum%','VIP','Customer')))))) AS roles 
                FROM `aowp_posts` p 
                	LEFT JOIN  `aowp_postmeta` pm  ON p.id=pm.post_id  
                    LEFT JOIN   `tb_ord_note` n ON p.id=n.order_id   
                	LEFT JOIN   `aowp_usermeta`  um_roles ON     pm.meta_value=um_roles.user_id         	
                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'	   
                	AND pm.meta_key='_customer_user' AND um_roles.meta_key='aowp_capabilities'
                    AND n.`ord_category`= '0'
                GROUP BY DATE_FORMAT(post_date,'%Y-%m-%d'),roles
                HAVING roles  IN('New Member','General','Bronze','Silver','Gold','VIP','Customer') ";       
        
        $db=common_connect();   
        $rows=array();        
        $result=mysqli_query($db,$query);           
        while($row=mysqli_fetch_array($result)){
                    array_push($rows,$row);
        }              
        
        echo json_encode($rows); 
        common_close_connect($db); 
    }     
    public function sv_chart_report_membership_total_order($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];
      //  echo $shop_sale; die();       
        $query="SELECT   DATE_FORMAT(post_date,'%Y-%m-%d') AS `date`,SUM(oim_price.meta_value) AS total_order,
                	IF(um_roles.meta_value LIKE '%newmember%','New Member',IF(um_roles.meta_value LIKE '%general%','General',IF(um_roles.meta_value LIKE '%bronze%','Bronze',IF(um_roles.meta_value LIKE '%sliver%','Silver',IF(um_roles.meta_value LIKE '%gold%','Gold',IF(um_roles.meta_value LIKE '%platinum%','VIP','Customer')))))) AS roles 
                FROM `aowp_posts` p 
                	LEFT JOIN  `aowp_postmeta` pm  ON p.id=pm.post_id     
                    LEFT JOIN   `tb_ord_note` n ON p.id=n.order_id
                	LEFT JOIN  `aowp_usermeta`  um_roles ON     pm.meta_value=um_roles.user_id       
                	LEFT JOIN  `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                        LEFT JOIN  `aowp_woocommerce_order_itemmeta`  oim_price ON oi.order_item_id=oim_price.order_item_id	  	
                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'	   
                	AND pm.meta_key='_customer_user' AND um_roles.meta_key='aowp_capabilities'
                	AND oi.order_item_type='line_item' AND oim_price.meta_key='_line_total'
                    AND n.`ord_category`= '0'
		        GROUP BY DATE_FORMAT(post_date,'%Y-%m-%d'),roles
                HAVING roles  IN('New Member','General','Bronze','Silver','Gold','VIP','Customer')";       
        
        $db=common_connect();   
        $rows=array();        
        $result=mysqli_query($db,$query);           
        while($row=mysqli_fetch_array($result)){
                    array_push($rows,$row);
        }              
        
        echo json_encode($rows); 
        common_close_connect($db); 
    }    
        //============ Chart report membership order  ====================== 
        
        
        
    public function sv_chart_report_monthly_membership_order($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];       
        
        $db=common_connect();    
        $start_year=intval(substr($startdate,0,4));
        $end_year=  intval(substr($enddate,0,4));
       // echo($end_year);die();
        
        $rows=array();
        $rows_number=array();
        if($start_year==$end_year){
           $query="SELECT   MONTH(p.post_date) AS `date`,SUM(oim_price.meta_value) AS total_order,
                	IF(um_roles.meta_value LIKE '%newmember%','New Member',IF(um_roles.meta_value LIKE '%general%','General',IF(um_roles.meta_value LIKE '%bronze%','Bronze',IF(um_roles.meta_value LIKE '%sliver%','Silver',IF(um_roles.meta_value LIKE '%gold%','Gold',IF(um_roles.meta_value LIKE '%platinum%','VIP','Customer')))))) AS roles 
                FROM `aowp_posts` p 
                	LEFT JOIN  `aowp_postmeta` pm  ON p.id=pm.post_id     
                    LEFT JOIN   `tb_ord_note` n ON p.id=n.order_id
                	LEFT JOIN  `aowp_usermeta`  um_roles ON     pm.meta_value=um_roles.user_id       
                	LEFT JOIN  `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                        LEFT JOIN  `aowp_woocommerce_order_itemmeta`  oim_price ON oi.order_item_id=oim_price.order_item_id	  	
                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'	   
                	AND pm.meta_key='_customer_user' AND um_roles.meta_key='aowp_capabilities'
                	AND oi.order_item_type='line_item' AND oim_price.meta_key='_line_total'
                    AND n.`ord_category`= '0'
		        GROUP BY MONTH(p.post_date),roles
                HAVING roles  IN('New Member','General','Bronze','Silver','Gold','VIP','Customer')";   
            $result=mysqli_query($db,$query);
           
           while($row=mysqli_fetch_array($result)){
                        array_push($rows,$row);
           }  
           //-------------------------------------------------------------------------------------------------------------
           $query_number="SELECT  COUNT(p.id) AS total_number , MONTH(p.post_date)  AS `date`,
                	IF(um_roles.meta_value LIKE '%newmember%','New Member',IF(um_roles.meta_value LIKE '%general%','General',IF(um_roles.meta_value LIKE '%bronze%','Bronze',IF(um_roles.meta_value LIKE '%sliver%','Silver',IF(um_roles.meta_value LIKE '%gold%','Gold',IF(um_roles.meta_value LIKE '%platinum%','VIP','Customer')))))) AS roles 
                FROM `aowp_posts` p 
                	LEFT JOIN  `aowp_postmeta` pm  ON p.id=pm.post_id  
                    LEFT JOIN   `tb_ord_note` n ON p.id=n.order_id   
                	LEFT JOIN   `aowp_usermeta`  um_roles ON     pm.meta_value=um_roles.user_id         	
                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59' 
                	AND pm.meta_key='_customer_user' AND um_roles.meta_key='aowp_capabilities'
                    AND n.`ord_category`= '0'
                GROUP BY MONTH(p.post_date),roles
                HAVING roles  IN('New Member','General','Bronze','Silver','Gold','VIP','Customer')";   
            $result_number=mysqli_query($db,$query_number);
           
            while($row=mysqli_fetch_array($result_number)){
                        array_push($rows_number,$row);
           }  
           //-------------------------------------------------------------------------------------------------------------
           
                     
        }else if($start_year<$end_year){            
            $query="SELECT   CONCAT(MONTH(p.post_date),'_',$start_year)AS `date`,SUM(oim_price.meta_value) AS total_order,
                	IF(um_roles.meta_value LIKE '%newmember%','New Member',IF(um_roles.meta_value LIKE '%general%','General',IF(um_roles.meta_value LIKE '%bronze%','Bronze',IF(um_roles.meta_value LIKE '%sliver%','Silver',IF(um_roles.meta_value LIKE '%gold%','Gold',IF(um_roles.meta_value LIKE '%platinum%','VIP','Customer')))))) AS roles 
                FROM `aowp_posts` p 
                	LEFT JOIN  `aowp_postmeta` pm  ON p.id=pm.post_id     
                    LEFT JOIN   `tb_ord_note` n ON p.id=n.order_id
                	LEFT JOIN  `aowp_usermeta`  um_roles ON     pm.meta_value=um_roles.user_id       
                	LEFT JOIN  `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                        LEFT JOIN  `aowp_woocommerce_order_itemmeta`  oim_price ON oi.order_item_id=oim_price.order_item_id	  	
                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$start_year-12-31 23:59:59'	   
                	AND pm.meta_key='_customer_user' AND um_roles.meta_key='aowp_capabilities'
                	AND oi.order_item_type='line_item' AND oim_price.meta_key='_line_total'
                    AND n.`ord_category`= '0'
		        GROUP BY MONTH(p.post_date),roles
                HAVING roles  IN('New Member','General','Bronze','Silver','Gold','VIP','Customer')";
            $result=mysqli_query($db,$query);
           
            while($row=mysqli_fetch_array($result)){
                        array_push($rows,$row);
           }           
                
            $query1="SELECT   CONCAT(MONTH(p.post_date),'_',$end_year)AS `date`,SUM(oim_price.meta_value) AS total_order,
                	IF(um_roles.meta_value LIKE '%newmember%','New Member',IF(um_roles.meta_value LIKE '%general%','General',IF(um_roles.meta_value LIKE '%bronze%','Bronze',IF(um_roles.meta_value LIKE '%sliver%','Silver',IF(um_roles.meta_value LIKE '%gold%','Gold',IF(um_roles.meta_value LIKE '%platinum%','VIP','Customer')))))) AS roles 
                FROM `aowp_posts` p 
                	LEFT JOIN  `aowp_postmeta` pm  ON p.id=pm.post_id     
                    LEFT JOIN   `tb_ord_note` n ON p.id=n.order_id
                	LEFT JOIN  `aowp_usermeta`  um_roles ON     pm.meta_value=um_roles.user_id       
                	LEFT JOIN  `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                        LEFT JOIN  `aowp_woocommerce_order_itemmeta`  oim_price ON oi.order_item_id=oim_price.order_item_id	  	
                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'	   
                	AND pm.meta_key='_customer_user' AND um_roles.meta_key='aowp_capabilities'
                	AND oi.order_item_type='line_item' AND oim_price.meta_key='_line_total'
                    AND n.`ord_category`= '0'
		        GROUP BY MONTH(p.post_date),roles
                HAVING roles  IN('New Member','General','Bronze','Silver','Gold','VIP','Customer')";                               
            $result1=mysqli_query($db,$query1);
            while($row1=mysqli_fetch_array($result1)){
                        array_push($rows,$row1);
           }
           //-----------------------------------------------------------------------------------------------------------------------
           $query_number="SELECT  COUNT(p.id) AS total_number , CONCAT(MONTH(p.post_date),'_',$start_year)  AS `date`,
                	IF(um_roles.meta_value LIKE '%newmember%','New Member',IF(um_roles.meta_value LIKE '%general%','General',IF(um_roles.meta_value LIKE '%bronze%','Bronze',IF(um_roles.meta_value LIKE '%sliver%','Silver',IF(um_roles.meta_value LIKE '%gold%','Gold',IF(um_roles.meta_value LIKE '%platinum%','VIP','Customer')))))) AS roles 
                FROM `aowp_posts` p 
                	LEFT JOIN  `aowp_postmeta` pm  ON p.id=pm.post_id  
                    LEFT JOIN   `tb_ord_note` n ON p.id=n.order_id   
                	LEFT JOIN   `aowp_usermeta`  um_roles ON     pm.meta_value=um_roles.user_id         	
                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$start_year-12-31 23:59:59'
                	AND pm.meta_key='_customer_user' AND um_roles.meta_key='aowp_capabilities'
                    AND n.`ord_category`= '0'
                GROUP BY MONTH(p.post_date),roles
                HAVING roles  IN('New Member','General','Bronze','Silver','Gold','VIP','Customer')";
            $result_number=mysqli_query($db,$query_number);
           
            while($row=mysqli_fetch_array($result_number)){
                        array_push($rows_number,$row);
           }           
                
            $query1_number="SELECT  COUNT(p.id) AS total_number , CONCAT(MONTH(p.post_date),'_',$end_year)  AS `date`,
                	IF(um_roles.meta_value LIKE '%newmember%','New Member',IF(um_roles.meta_value LIKE '%general%','General',IF(um_roles.meta_value LIKE '%bronze%','Bronze',IF(um_roles.meta_value LIKE '%sliver%','Silver',IF(um_roles.meta_value LIKE '%gold%','Gold',IF(um_roles.meta_value LIKE '%platinum%','VIP','Customer')))))) AS roles 
                FROM `aowp_posts` p 
                	LEFT JOIN  `aowp_postmeta` pm  ON p.id=pm.post_id  
                    LEFT JOIN   `tb_ord_note` n ON p.id=n.order_id   
                	LEFT JOIN   `aowp_usermeta`  um_roles ON     pm.meta_value=um_roles.user_id         	
                WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$enddate 23:59:59'  
                	AND pm.meta_key='_customer_user' AND um_roles.meta_key='aowp_capabilities'
                    AND n.`ord_category`= '0'
                GROUP BY MONTH(p.post_date),roles
                HAVING roles  IN('New Member','General','Bronze','Silver','Gold','VIP','Customer')";                               
            $result1_number=mysqli_query($db,$query1_number);
            while($row1=mysqli_fetch_array($result1_number)){
                        array_push($rows_number,$row1);
           }
        }
        $arr_data=array("data_total"=>$rows,"data_number"=>$rows_number);
        echo json_encode($arr_data);
        common_close_connect($db); 
    }
        //============ End chart report membership order  ================== 
    //============= End Chart Report ====================================================================================
    //============= Data Report =========================================================================================
        //============ Shipping  =========================================== 
    public function sv_data_report_shipping($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];    
        $province= $obj["province"];    
        $shop_sale=$obj["shop_sale"];
        $str_condition="";
        if($province==1){
            $str_condition="AND pm8.meta_value LIKE '%TP HCM%'";
        }else if($province==2){
            $str_condition="AND pm8.meta_value NOT LIKE '%TP HCM%'";
        }
        $db     = common_connect();
        $rows   = array();    
        $query="";  
        if($shop_sale=="0")   {
            $query="SELECT p.ID AS order_id,
                                    	p.post_date AS order_date,
                                    	p.post_status AS order_status,
                                    	IF( note.ord_category ='0','Customer Sky007',IF(note.ord_category ='7','Wholesaler',IF(note.ord_category ='5','Marketing Sky007',IF(note.ord_category ='10','Shoppe Bbia',IF(note.ord_category ='11','Shoppe Bbia Marketing',IF(note.ord_category ='14','Lotte',IF(note.ord_category ='15','Lotte Marketing',IF(note.ord_category ='18','Eglips',IF(note.ord_category ='19','Eglips Marketing',IF(note.ord_category ='20','Lazada Bbia',IF(note.ord_category ='21','Lazada Bbia Marketing',IF(note.ord_category ='22','Eglips Wholesaler',IF(note.ord_category ='24','Shopee Eglips',IF(note.ord_category ='25','Shopee Eglips Marketing',IF(note.ord_category ='26','Lazada Eglips',IF(note.ord_category ='27','Lazada Eglips Marketing',IF(note.ord_category ='28','Robins',IF(note.ord_category ='29','Robins Marketing',IF(note.ord_category ='30','Watson',IF(note.ord_category ='31','Watson Marketing',IF(note.ord_category ='32','Wholesaler Actsone',IF(note.ord_category ='33','Wholesaler Jnain',IF(note.ord_category ='16','Sendo',IF(note.ord_category ='17','Sendo Marketing',IF(note.ord_category ='34','Beautybox',IF(note.ord_category ='35','Beautybox Marketing',IF(note.ord_category ='36','Tiki',IF(note.ord_category ='37','Tiki Marketing',IF(note.ord_category ='38','Shopee C2C',IF(note.ord_category ='39','Shopee C2C Marketing',IF(note.ord_category ='40','Lazada C2C',IF(note.ord_category ='41','Lazada C2C Marketing',IF(note.ord_category ='42','Tiki Eglips',IF(note.ord_category ='43','Tiki Eglips Marketing',IF(note.ord_category ='44','Sociola',IF(note.ord_category ='45','Sociola Marketing',IF(note.ord_category ='46','Bbiavn',IF(note.ord_category ='47','Bbiavn Marketing',IF(note.ord_category ='48','Mixsoon',IF(note.ord_category ='49','Mixsoon Marketing',IF(note.ord_category ='50','Guardian',IF(note.ord_category ='51','Guardian Marketing',IF(note.ord_category ='52','Shopee Mixsoon',IF(note.ord_category ='53','Shopee Mixsoon Marketing',
                                        IF(note.ord_category ='54','Lazada Mixsoon',IF(note.ord_category ='55','Lazada Mixsoon Marketing',IF(note.ord_category ='58','Tiktok',IF(note.ord_category ='59','Tiktok Marketing','Undefined Order !')))))))))))))))))))))))))))))))))))))))))))))))) AS user_lev,
                                    	CONCAT( pm4.meta_value,' ', pm5.meta_value) AS `name`,
                                    	pm3.meta_value AS phone,
                                    	pm2.meta_value AS address,                                    
                                    	pm7.meta_value AS total_price                                          
                                    FROM aowp_posts AS p 
                                    	LEFT JOIN aowp_postmeta AS pm2 ON pm2.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm3 ON pm3.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm4 ON pm4.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm5 ON pm5.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm7 ON pm7.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm8 ON pm8.post_id=p.ID
                                    	LEFT JOIN ( SELECT `order_id`,`ord_category` FROM `tb_ord_note` WHERE `date_time`  BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'  ) AS note ON note.order_id=p.ID 
                                    
                                    WHERE p.post_status !='trash' AND p.post_type='shop_order' 
                                    	AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:58'
                                    	AND pm2.meta_key='_billing_address_1' 
                                    	AND pm3.meta_key='_billing_phone' 
                                    	AND pm4.meta_key='_billing_first_name' 
                                    	AND pm5.meta_key='_billing_last_name' 
                                    	AND pm7.meta_key='_order_total'
                                    	AND pm8.meta_key='_billing_city'
                                        $str_condition";
                                               
                                    	
        }else{
            $str_shop="";
            if($shop_sale=="1"){
                $str_shop="0".","."5";
            }else if($shop_sale=="2"){
                $str_shop="7";
            }else if($shop_sale=="3"){
                $str_shop="10".","."11";
            }else if($shop_sale=="4"){
                $str_shop="24".","."25";
            }else if($shop_sale=="5"){
                $str_shop="48".","."49";
            }else if($shop_sale=="6"){
                $str_shop="18".","."19";
            }else if($shop_sale=="7"){
                $str_shop="22";
            }else if($shop_sale=="8"){
                $str_shop="18".","."19";
            }else if($shop_sale=="9"){
                $str_shop="26".","."27";
            }else if($shop_sale=="10"){
                $str_shop="28".","."29";
            }else if($shop_sale=="11"){
                $str_shop="16".","."17";
            }else if($shop_sale=="12"){
                $str_shop="34".","."35";
            }else if($shop_sale=="13"){
                $str_shop="36".","."37";
            }else if($shop_sale=="14"){
                $str_shop="46".","."47";
            }else if($shop_sale=="16"){
                $str_shop="42".","."43";
            }
            $query="SELECT p.ID AS order_id,
                                    	p.post_date AS order_date,
                                    	p.post_status AS order_status,
                                    	IF( note.ord_category ='0','Customer Sky007',IF(note.ord_category ='7','Wholesaler',IF(note.ord_category ='5','Marketing Sky007',IF(note.ord_category ='10','Shoppe Bbia',IF(note.ord_category ='11','Shoppe Bbia Marketing',IF(note.ord_category ='14','Lotte',IF(note.ord_category ='15','Lotte Marketing',IF(note.ord_category ='18','Eglips',IF(note.ord_category ='19','Eglips Marketing',IF(note.ord_category ='20','Lazada Bbia',IF(note.ord_category ='21','Lazada Bbia Marketing',IF(note.ord_category ='22','Eglips Wholesaler',IF(note.ord_category ='24','Shopee Eglips',IF(note.ord_category ='25','Shopee Eglips Marketing',IF(note.ord_category ='26','Lazada Eglips',IF(note.ord_category ='27','Lazada Eglips Marketing',IF(note.ord_category ='28','Robins',IF(note.ord_category ='29','Robins Marketing',IF(note.ord_category ='30','Watson',IF(note.ord_category ='31','Watson Marketing',IF(note.ord_category ='32','Wholesaler Actsone',IF(note.ord_category ='33','Wholesaler Jnain',IF(note.ord_category ='16','Sendo',IF(note.ord_category ='17','Sendo Marketing',IF(note.ord_category ='34','Beautybox',IF(note.ord_category ='35','Beautybox Marketing',IF(note.ord_category ='36','Tiki',IF(note.ord_category ='37','Tiki Marketing',IF(note.ord_category ='38','Shopee C2C',IF(note.ord_category ='39','Shopee C2C Marketing',IF(note.ord_category ='40','Lazada C2C',IF(note.ord_category ='41','Lazada C2C Marketing',IF(note.ord_category ='42','Tiki Eglips',IF(note.ord_category ='43','Tiki Eglips Marketing',IF(note.ord_category ='44','Sociolla',IF(note.ord_category ='45','Sociolla Marketing',IF(note.ord_category ='46','Bbiavn',IF(note.ord_category ='47','Bbiavn Marketing',IF(note.ord_category ='48','Mixsoon',IF(note.ord_category ='49','Mixsoon Marketing',IF(note.ord_category ='50','Guardian',IF(note.ord_category ='51','Guardian Marketing', IF(note.ord_category ='52','Shopee Mixsoon', IF(note.ord_category ='53','Shopee Mixsoon Marketing', IF(note.ord_category ='54','Lazada Mixsoon', 
                                            IF(note.ord_category ='55','Lazada Mixsoon Marketing', IF(note.ord_category ='58','Tiktok', IF(note.ord_category ='59','Tiktok Marketing', 'Another')))))))))))))))))))))))))))))))))))))))))))))))))))) AS user_lev,
                                    	CONCAT( pm4.meta_value,' ', pm5.meta_value) AS `name`,
                                    	pm3.meta_value AS phone,
                                    	pm2.meta_value AS address,                                    
                                    	pm7.meta_value AS total_price                                         
                                    FROM aowp_posts AS p 
                                    	LEFT JOIN aowp_postmeta AS pm2 ON pm2.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm3 ON pm3.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm4 ON pm4.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm5 ON pm5.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm7 ON pm7.post_id=p.ID
                                        LEFT JOIN aowp_postmeta AS pm8 ON pm8.post_id=p.ID
                                    	LEFT JOIN ( SELECT `order_id`,`ord_category` FROM `tb_ord_note` WHERE `date_time`  BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'  ) AS note ON note.order_id=p.ID  
                                    WHERE p.post_status !='trash' AND p.post_type='shop_order' 
                                    	AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:59'
                                    	AND pm2.meta_key='_billing_address_1' 
                                    	AND pm3.meta_key='_billing_phone' 
                                    	AND pm4.meta_key='_billing_first_name' 
                                    	AND pm5.meta_key='_billing_last_name' 
                                    	AND pm7.meta_key='_order_total'
                                        AND pm8.meta_key='_billing_city'
                                    	AND note.ord_category IN ($str_shop)
                                        $str_condition";
        }      
        $str_id="";
        $result = mysqli_query($db,$query);
            while ($row = mysqli_fetch_array($result)) {
                $order_id=$row["order_id"];
                $str_id.=",".$order_id;
                array_push($rows, $row);
                
            }
        $str_id=substr($str_id, 1);
        $rows_packaging   = array(); 
        $query_packaging="SELECT 	order_id,
                                        IF( del.d_company ='0','NO Shiping',IF(del.d_company ='1','Viettelpost',IF(del.d_company ='2','Ems',IF(del.d_company ='3','Tasetco',IF(del.d_company ='4','Saigonship',IF(del.d_company ='5','Direct',IF(del.d_company ='6','GiaoHangNhanh',IF(del.d_company ='7','GiaoHangTietKiem',IF(del.d_company ='8','Ecotrans',IF(del.d_company ='9','TPT',IF(del.d_company ='10','Express',IF(del.d_company ='11','Another',IF(del.d_company ='12','Kerry',IF(del.d_company ='13','J&T Express',IF(del.d_company ='15','sixty',IF(del.d_company ='16','Ninja Van',IF(del.d_company ='17','DHL',IF(del.d_company ='18','VNC POST',IF(del.d_company ='19','Speedlink',''))))))))))))))))))) AS d_company,
                                    	del.d_shipping_id AS sh_code,
                                    	del.d_shipping_fee AS sh_fee,                                       
                                    	IF( del.d_pay_status ='0','Not Yet',IF( del.d_pay_status ='1','Received Money',IF( del.d_pay_status ='2','Cancell','') ))AS `d_pay_status`,
                                    	del.d_dateofarrive 
                          FROM   tb_ord_delivery AS del
                          WHERE order_id IN ($str_id)";
                        //  echo $query_packaging ; exit();
        $result_packaging = mysqli_query($db,$query_packaging);
        while ($row = mysqli_fetch_array($result_packaging)) { 
            array_push($rows_packaging, $row);            
        }     
       $obj_data=$arr_data=array("list_order"=>$rows,"list_order_packaging"=>$rows_packaging);
       echo json_encode($obj_data);
       common_close_connect($db);   
    }
        //============ End Shipping  ======================================= 
        //============ Order  =========================================== 
    public function sv_data_report_order($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];       
        $shop_sale=$obj["shop_sale"];
        $db     = common_connect();
        $rows   = array();    
        $query="";  
        if($shop_sale=="0")   {
            $query="SELECT a.order_time,a.category,a.id,a.name,a.payment,a.order_status,b.product_name, IF(b.sku NOT LIKE '%-R' ,b.total_price,'0') AS `item_price` ,IF(b.sku LIKE '%-R' ,b.total_price,'0') AS `item_price_vat` ,(b.total_price/b.quantity) as price_1_item,a.manager,a.customer_buy_type
                                    FROM (SELECT p.post_date AS `order_time` ,
                                    		IF( n.ord_category ='0','Customer Sky007',IF(n.ord_category ='7','Wholesaler',IF(n.ord_category ='5','Marketing Sky007',IF(n.ord_category ='10','Shoppe Bbia',IF(n.ord_category ='11','Shoppe Bbia Marketing',IF(n.ord_category ='14','Lotte',IF(n.ord_category ='15','Lotte Marketing',IF(n.ord_category ='18','Eglips',IF(n.ord_category ='19','Eglips Marketing',IF(n.ord_category ='20','Lazada Bbia',IF(n.ord_category ='21','Lazada Bbia Marketing',IF(n.ord_category ='22','Eglips Wholesaler',IF(n.ord_category ='24','Shopee Eglips',IF(n.ord_category ='25','Shopee Eglips Marketing',IF(n.ord_category ='26','Lazada Eglips',IF(n.ord_category ='27','Lazada Eglips Marketing',IF(n.ord_category ='28','Robins',IF(n.ord_category ='29','Robins Marketing',IF(n.ord_category ='30','Watsons',IF(n.ord_category ='31','Watson Marketing',IF(n.ord_category ='32','Wholesaler Actsone',IF(n.ord_category ='33','Wholesaler Jnain',IF(n.ord_category ='16','Sendo',IF(n.ord_category ='17','Sendo Marketing',IF(n.ord_category ='34','Beautybox',IF(n.ord_category ='35','Beautybox Marketing',IF(n.ord_category ='36','Tiki',IF(n.ord_category ='37','Tiki Marketing',IF(n.ord_category ='38','Shopee C2C',IF(n.ord_category ='39','Shopee C2C Marketing',IF(n.ord_category ='40','Lazada C2C',IF(n.ord_category ='41','Lazada C2C Marketing',IF(n.ord_category ='42','Tiki Eglips',IF(n.ord_category ='43','Tiki Eglips Marketing',IF(n.ord_category ='44','Sociolla',IF(n.ord_category ='45','Sociolla Marketing',IF(n.ord_category ='46','Bbiavn Marketing',IF(n.ord_category ='47','Bbiavn Marketing',IF(n.ord_category ='48','Mixsoon',IF(n.ord_category ='49','Mixsoon Marketing',IF(n.ord_category ='50','Guardian',IF(n.ord_category ='51','Guardian Marketing',IF(n.ord_category ='52','Shopee Mixsoon',IF(n.ord_category ='53','Shopee Mixsoon Marketing',IF(n.ord_category ='54','Lazada Mixsoon',
                                            IF(n.ord_category ='55','Lazada Mixsoon Marketing',IF(n.ord_category ='58','Tiktok',IF(n.ord_category ='59','Tiktok Marketing','Undefined')))))))))))))))))))))))))))))))))))))))))))))))) AS `category`,                                    		
                                            p.id ,
                                    		p.post_status AS `order_status`,pm_payment_method.meta_value as payment,	
                                    		CONCAT_WS(' ',pm_first_name.meta_value,pm_last_name.meta_value) AS `name`,	
                                    		FORMAT(pm_total_price.meta_value,0) AS `total_price`,                                    	
                                            IF(n.mg_id=1,'Website',n.mg_id )AS `manager`,
                                    		IF(n.customerpaymethod=0,'Website',IF(n.customerpaymethod=1,'Facebook',IF(n.customerpaymethod=2,'Instagram',IF(n.customerpaymethod=3,'Direct','Another')))) AS `customer_buy_type`
                                    	FROM `aowp_posts` p
                                    		LEFT JOIN `aowp_postmeta` pm_last_name ON p.id=pm_last_name.post_id
                                    		LEFT JOIN `aowp_postmeta` pm_first_name ON p.id=pm_first_name.post_id
                                            LEFT JOIN `aowp_postmeta` pm_payment_method ON p.id=pm_payment_method.post_id
                                    		LEFT JOIN `aowp_postmeta` pm_total_price ON p.id=pm_total_price.post_id      
                                    		LEFT JOIN `tb_ord_note` n ON n.order_id=p.id    
                                    	WHERE p.post_type='shop_order'  AND p.post_status !='trash' AND post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                                    		AND pm_last_name.meta_key='_billing_last_name'
                                    		AND pm_first_name.meta_key='_billing_first_name'  
                                            AND pm_payment_method.meta_key='_payment_method'  
                                    		AND pm_total_price.meta_key='_order_total') AS `a`
                                    LEFT JOIN (SELECT   p.id,CONCAT_WS(' => ',d.`product_name`,oim_qty.meta_value) AS `product_name`,oim_qty.meta_value as `quantity`,oim_price.meta_value AS `total_price`,d.`sku`
                                    		FROM     `aowp_posts` p
                                    			LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                    			LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_id ON oi.order_item_id= oim_id.order_item_id                                    			
                                                LEFT JOIN tb_stock_divide d ON d.`product_id`=	oim_id.meta_value                                    		
                                    			LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_qty ON  oi.order_item_id=oim_qty.order_item_id
                                    			LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_price ON  oi.order_item_id=oim_price.order_item_id
                                    		
                                    		WHERE  p.post_type='shop_order'  AND p.post_status !='trash' AND post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                                    			AND oi.order_item_type='line_item'
                                    			AND oim_id.meta_key='_product_id'                                    		
                                    			AND oim_price.meta_key='_line_total'                                    		
                                    			AND oim_qty.meta_key='_qty') AS `b` ON a.id=b.id";
                                    	
        }else{
            $str_shop="";
            if($shop_sale=="1"){
                $str_shop="0".","."5";
            }else if($shop_sale=="2"){
                $str_shop="7";
            }else if($shop_sale=="3"){
                $str_shop="10".","."11";
            }else if($shop_sale=="4"){
                $str_shop="24".","."25";
            }else if($shop_sale=="5"){
                $str_shop="48".","."49";
            }else if($shop_sale=="6"){
                $str_shop="18".","."19";
            }else if($shop_sale=="7"){
                $str_shop="22";
            }else if($shop_sale=="8"){
                $str_shop="20".","."21";
            }else if($shop_sale=="9"){
                $str_shop="26".","."27";
            }else if($shop_sale=="10"){
                $str_shop="28".","."29";
            }else if($shop_sale=="11"){
                $str_shop="30".","."31";
            }else if($shop_sale=="12"){
                $str_shop="32";
            }else if($shop_sale=="13"){
                $str_shop="33";
            }else if($shop_sale=="14"){
                $str_shop="16".","."17";
            }else if($shop_sale=="15"){
                $str_shop="34".","."35";
            }else if($shop_sale=="16"){
                $str_shop="36".","."37";
            }else if($shop_sale=="17"){
                $str_shop="46".","."47";
            }else if($shop_sale=="18"){
                $str_shop="40".","."41";
            }
            $query="SELECT a.order_time,a.category,a.id,a.name,a.payment,a.order_status,b.product_name, IF(b.sku NOT LIKE '%-R' ,b.total_price,'0') AS `item_price` ,IF(b.sku LIKE '%-R' ,b.total_price,'0') AS `item_price_vat` ,(b.total_price/b.quantity) as price_1_item,a.manager,a.customer_buy_type
                                    FROM (SELECT p.post_date AS `order_time` ,
                                    		IF( n.ord_category ='0','Customer Sky007',IF(n.ord_category ='7','Wholesaler',IF(n.ord_category ='5','Marketing Sky007',IF(n.ord_category ='10','Shoppe Bbia',IF(n.ord_category ='11','Shoppe Bbia Marketing',IF(n.ord_category ='14','Lotte',IF(n.ord_category ='15','Lotte Marketing',IF(n.ord_category ='18','Eglips',IF(n.ord_category ='19','Eglips Marketing',IF(n.ord_category ='20','Lazada Bbia',IF(n.ord_category ='21','Lazada Bbia Marketing',IF(n.ord_category ='22','Eglips Wholesaler',IF(n.ord_category ='24','Shopee Eglips',IF(n.ord_category ='25','Shopee Eglips Marketing',IF(n.ord_category ='26','Lazada Eglips',IF(n.ord_category ='27','Lazada Eglips Marketing',IF(n.ord_category ='28','Robins',IF(n.ord_category ='29','Robins Marketing',IF(n.ord_category ='30','Watsons',IF(n.ord_category ='31','Watson Marketing',IF(n.ord_category ='32','Wholesale Actsone',IF(n.ord_category ='33','Wholesaler Eglips',IF(n.ord_category ='16','Sendo',IF(n.ord_category ='17','Sendo Marketing',IF(n.ord_category ='34','Beautybox',IF(n.ord_category ='35','Beautybox Marketing',IF(n.ord_category ='36','Tiki',IF(n.ord_category ='37','Tiki Marketing',IF(n.ord_category ='38','Shopee C2C',IF(n.ord_category ='39','Shopee C2C Marketing',IF(n.ord_category ='40','Lazada C2C',IF(n.ord_category ='41','Lazada C2C Marketing',IF(n.ord_category ='42','Tiki Eglips',IF(n.ord_category ='43','Tiki Eglips Marketing',IF(n.ord_category ='44','Sociolla',IF(n.ord_category ='45','Sociolla Marketing',IF(n.ord_category ='46','Bbiavn',IF(n.ord_category ='47','Bbiavn Marketing',IF(n.ord_category ='48','Mixsoon',IF(n.ord_category ='49','Mixsoon Marketing',IF(n.ord_category ='50','Guardian',IF(n.ord_category ='51','Guardian Marketing',IF(n.ord_category ='52','Shopee Mixsoon',IF(n.ord_category ='53','Shopee Mixsoon Marketing',IF(n.ord_category ='54','Lazada Mixsoon',
                                            IF(n.ord_category ='55','Lazada Mixsoon Marketing',IF(n.ord_category ='58','Tiktok',IF(n.ord_category ='59','Tiktok Marketing','Undefined')))))))))))))))))))))))))))))))))))))))))))))))) AS `category`,                                    		
                                            p.id ,
                                    		p.post_status AS `order_status`,	
                                    		CONCAT_WS(' ',pm_first_name.meta_value,pm_last_name.meta_value) AS `name`,	
                                    		FORMAT(pm_total_price.meta_value,0) AS `total_price`,pm_payment.meta_value as `payment`   ,                                 		
                                            IF(n.mg_id=1,'Website',n.mg_id )AS `manager`,
                                    		IF(n.customerpaymethod=0,'Website',IF(n.customerpaymethod=1,'Facebook',IF(n.customerpaymethod=2,'Instagram',IF(n.customerpaymethod=3,'Direct','Another')))) AS `customer_buy_type`
                                    	FROM `aowp_posts` p
                                    		LEFT JOIN `aowp_postmeta` pm_last_name ON p.id=pm_last_name.post_id
                                    		LEFT JOIN `aowp_postmeta` pm_first_name ON p.id=pm_first_name.post_id
                                          	LEFT JOIN `aowp_postmeta` pm_payment ON p.id=pm_payment.post_id
                                    		LEFT JOIN `aowp_postmeta` pm_total_price ON p.id=pm_total_price.post_id      
                                    		LEFT JOIN `tb_ord_note` n ON n.order_id=p.id                                    		                                    		
                                    	WHERE p.post_type='shop_order'  AND p.post_status !='trash' AND post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                                    		AND pm_last_name.meta_key='_billing_last_name'
                                    		AND pm_first_name.meta_key='_billing_first_name'  
                                    		AND pm_total_price.meta_key='_order_total'
                                            AND pm_payment.meta_key='_payment_method'
                                    		AND n.ord_category IN ($str_shop)) AS `a`
                                    LEFT JOIN (SELECT   p.id,CONCAT_WS(' => ',d.`product_name`,oim_qty.meta_value) AS `product_name`,oim_qty.meta_value as `quantity`,oim_price.meta_value AS `total_price`,d.`sku`
                                    		FROM     `aowp_posts` p
                                    			LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                    			LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_id ON oi.order_item_id= oim_id.order_item_id                                    		
                                                LEFT JOIN tb_stock_divide d ON d.`product_id`=	oim_id.meta_value                                    				
                                    			LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_qty ON  oi.order_item_id=oim_qty.order_item_id
                                    			LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_price ON  oi.order_item_id=oim_price.order_item_id
                                    			LEFT JOIN `tb_ord_note` n ON n.order_id=p.id
                                    			
                                    		WHERE  p.post_type='shop_order'  AND p.post_status !='trash' AND post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                                    			AND oi.order_item_type='line_item'
                                    			AND oim_id.meta_key='_product_id'                                    		
                                    			AND n.ord_category IN ($str_shop)
                                    			AND oim_price.meta_key='_line_total'                                    			
                                    			AND oim_qty.meta_key='_qty') AS `b` ON a.id=b.id";      
                                              
        }       
        $str_id="";
        $result = mysqli_query($db,$query);   
        $rows_packaging   = array();          
        $check=mysqli_num_rows($result);
        if($check!=0){
            while ($row = mysqli_fetch_array($result)) {
                $order_id=$row["id"];
                $str_id.=",".$order_id;
                array_push($rows, $row);
                
            }
                
            $str_id=substr($str_id, 1);
            
            
            $query_packaging="SELECT 	order_id,
                                            IF( del.d_company ='0','NO Shiping',IF(del.d_company ='1','Viettelpost',IF(del.d_company ='2','Ems',IF(del.d_company ='3','Tasetco',IF(del.d_company ='4','Saigonship',IF(del.d_company ='5','Direct',IF(del.d_company ='6','GiaoHangNhanh',IF(del.d_company ='7','GiaoHangTietKiem',IF(del.d_company ='8','Ecotrans',IF(del.d_company ='9','TPT',IF(del.d_company ='10','Express',IF(del.d_company ='11','Another',IF(del.d_company ='12','Kerry',IF(del.d_company ='13','J&T Express',IF(del.d_company ='15','Sixty',IF(del.d_company ='16','Ninja Van',IF(del.d_company ='17','DHL',IF(del.d_company ='18','VNC POST',IF(del.d_company ='19','Speedlink',''))))))))))))))))))) AS d_company,                                                                          
                                        	IF( del.d_pay_status ='0','Not Yet',IF( del.d_pay_status ='1','Received Money',IF( del.d_pay_status ='2','Cancell','') ))AS `d_pay_status`
                                        
                              FROM   tb_ord_delivery AS del
                              WHERE order_id IN ($str_id)";
            $result_packaging = mysqli_query($db,$query_packaging);
            while ($row = mysqli_fetch_array($result_packaging)) { 
                array_push($rows_packaging, $row);            
            }     
        }
      //  echo json_encode($rows_packaging); 
       $obj_data=$arr_data=array("list_order"=>$rows,"list_order_packaging"=>$rows_packaging);
       echo json_encode($obj_data);
        //  echo json_encode($rows);
          common_close_connect($db);   
    }
        //============ End Order  ======================================= 
    //============  Order vn pay ======================================= 
    public function sv_data_report_order_vnpay($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"]; 
        $db     = common_connect();
        $rows   = array(); 
        $query="SELECT p.post_date AS `order_date`,
	IF(n.ord_category='0' ,'Customer',IF(n.ord_category='5' ,'Marketing',IF(n.ord_category='7' ,'Wholesaler',IF(n.ord_category='10' ,'Shopee Bbia',IF(n.ord_category='11' ,'Shopee Bbia Marketing',IF(n.ord_category='13' ,'Missing',IF(n.ord_category='14' ,'Lotte',IF(n.ord_category='15' ,'Lotte Marketing',IF(n.ord_category='16','Sendo',IF(n.ord_category='17','Sendo Marketing',IF(n.ord_category='18','Eglips',IF(n.ord_category='19','Eglips Marketing',IF(n.ord_category='20','Lazada',IF(n.ord_category='21','LazadaMaketing',IF(n.ord_category='22','EglipsWholesaler',IF(n.ord_category='24','ShopeeEglips',IF(n.ord_category='25','ShopeeEglipsMarketing',IF(n.ord_category='26','LazadaEglips',IF(n.ord_category='27','LazadaEglipsMarketing',IF(n.ord_category='28','Robins',IF(n.ord_category='29','RobinsMarketing',IF(n.ord_category='30','Watsons',IF(n.ord_category='31','WatsonsMarketing',IF(n.ord_category='32','WholesalerActsone',IF(n.ord_category='33','WholesalerJnain',IF(n.ord_category='34','BeautyBox',IF(n.ord_category='35','BeautyBoxMarketing',IF(n.ord_category='36','Tiki',IF(n.ord_category='37','TikiMarketing',IF(n.ord_category='38','ShopeeC2C',IF(n.ord_category='39','ShopeeC2CMarketing',IF(n.ord_category='42','Tiki Eglips',IF(n.ord_category='44','Sociolla',IF(n.ord_category='46','Bbiavn',IF(n.ord_category='47','Bbiavn MT',IF(n.ord_category='48','Mixsoon',IF(n.ord_category='49','Mixsoon MT',IF(n.ord_category='50','Guardian',IF(n.ord_category='51','Guardian MT',IF(n.ord_category='52','Shopee Mixsoon',IF(n.ord_category='53','Shopee Mixsoon MT',IF(n.ord_category='54','Lazada Mixsoon',
    IF(n.ord_category='55','Lazada Mixsoon MT',IF(n.ord_category='58','Tiktok',IF(n.ord_category='59','Tiktok MT','Undefine !'))))))))))))))))))))))))))))))))))))))))))))) AS `type`,
		p.id,
                  CONCAT_WS(' ',pm_first_name.meta_value,pm_last_name.meta_value) AS `name`,  
                  p.post_status ,
                  pm_payment_method.meta_value as `payment`,
                  FORMAT(pm_total_order.meta_value,0) AS total_order   ,            
                 
                  pm_phone.meta_value AS `phone`  ,
                  n.mg_id                 
                 
                  FROM `aowp_posts` p  
                	LEFT JOIN `aowp_postmeta` pm_first_name ON pm_first_name.post_id=p.id
                	LEFT JOIN `aowp_postmeta` pm_last_name ON pm_last_name.post_id=p.id
                	LEFT JOIN `aowp_postmeta` pm_phone ON pm_phone.post_id=p.id
                	LEFT JOIN `aowp_postmeta` pm_payment_method ON pm_payment_method.post_id=p.id
                	LEFT JOIN `aowp_postmeta` pm_total_order ON pm_total_order.post_id=p.id
                    LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                WHERE  p.post_type='shop_order'  AND p.post_status !='trash' 
                	AND pm_first_name.meta_key='_billing_first_name' AND pm_last_name.meta_key='_billing_last_name'
                	AND pm_payment_method.meta_key='_payment_method'
                	AND pm_payment_method.meta_value='vnpay'
                	AND pm_phone.meta_key='_billing_phone'
                	AND p.post_date>'$startdate 00:00:00' AND  p.post_date<'$enddate 23:59:59'	
                	AND pm_total_order.meta_key='_order_total'";
        $result = mysqli_query($db,$query);
        while ($row = mysqli_fetch_array($result)) { 
            array_push($rows, $row);            
        }
       echo json_encode($rows);       
       common_close_connect($db);
    }    
    //============ End Order vnpay  ======================================= 
        //============ Data report locaion  =========================================== 
    public function sv_data_report_location($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];       
        $shop_sale=$obj["shop_sale"];
        $date_type=$obj["date_type"];
        $db     = common_connect();
        $rows   = array(); 
        $rows_main_area   = array();   
        $str_shop="";
        $query="";  
        $query_main_area=""; 
        $str_date_select="";
        $str_date_gby="";
        if($date_type=="0"){
            $str_date_select='DATE_FORMAT(p.post_date, "%Y %M")';
         
        }else if($date_type=="1"){
            $str_date_select='CONCAT(monthname(p.post_date)," - ",(SELECT WEEK(p.post_date,5) -  
                                WEEK(DATE_SUB(p.post_date, INTERVAL DAYOFMONTH(p.post_date)-1 DAY),5)+1 ),"w")';
      
        }
        if($shop_sale=="0")   {
            $query="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty_order ,$str_date_select AS date_time
                    FROM `aowp_posts` p 
                        LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                    	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'                                      
                    AND n.ord_category IN (0,10,14,18,20,24,26,36,38,40,42)
                    AND pm_shipping_city.meta_key='_billing_city'
                    GROUP BY pm_shipping_city.meta_value,($str_date_select)";
            $query_main_area="CALL `getmainarea`('$startdate','$enddate','-1','$str_date_select')";
                                
        }else {
            if($shop_sale=="1"){
            $str_shop="0";
            }else if($shop_sale=="2"){
                $str_shop="10";
            }else if($shop_sale=="3"){
                $str_shop="24";
            }else if($shop_sale=="4"){
                $str_shop="14";
            }else if($shop_sale=="5"){
                $str_shop="18";
            }else if($shop_sale=="6"){
                $str_shop="20";
            }else if($shop_sale=="7"){
                $str_shop="26";
            }
            else if($shop_sale=="8"){
                $str_shop="38";
            }
            else if($shop_sale=="9"){
                $str_shop="40";
            }
            else if($shop_sale=="10"){
                $str_shop="36";
            }else if($shop_sale=="11"){
                $str_shop="42";
            }
            $query="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty_order ,$str_date_select AS date_time
                    FROM `aowp_posts` p 
                        LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                    	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                    WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'                                      
                    AND n.ord_category IN ($str_shop)
                    AND pm_shipping_city.meta_key='_billing_city'
                    GROUP BY pm_shipping_city.meta_value,($str_date_select)"; 
            $query_main_area="CALL `getmainarea`('$startdate','$enddate','$str_shop','$str_date_select')";
        }            
        
       
        $result = mysqli_query($db,$query);          
       
        while ($row = mysqli_fetch_array($result)) { 
            array_push($rows, $row);            
        }  
        
        $result_main_area = mysqli_query($db,$query_main_area);          
       
        while ($row = mysqli_fetch_array($result_main_area)) { 
            array_push($rows_main_area, $row);            
        }     
      
       $obj_data=$arr_data=array("list_total"=>$rows,"list_main_area"=>$rows_main_area);
       echo json_encode($obj_data);
       
       common_close_connect($db);   
    }
        //============ End Data report location  ======================================= 
        //============ Data report locaion compare  =========================================== 
    public function sv_data_report_location_compare($obj){
        $fromdate=$obj["start_date"];
        $todate=$obj["end_date"]; 
        $list_location=$obj["list_location"];
        $shop_sale=$obj["shop_sale"];
        $str_location="";
     //   echo ($list_location[1]);exit();
        for($i=0;$i<count($list_location);$i++){
            $str_location.="'".$list_location[$i]."'".",";
        }
       // $str_location=json_encode($list_location,JSON_UNESCAPED_UNICODE);
        $str_location=substr($str_location, 0, -1);
        $db=common_connect();
        $rows_all  =   array();
        $rows_all_total  =   array();
        $str_shop="";
        if($shop_sale=="0"){
            $str_shop="AND n.ord_category IN (0,10,18,20,24,26)";            
        }else if($shop_sale=="1"){
            $str_shop="AND n.ord_category IN (0)";
        }else if($shop_sale=="2"){
            $str_shop="AND n.ord_category IN (10,24)";
        }else if($shop_sale=="3"){
            $str_shop="AND n.ord_category IN (20,26)";
        }else if($shop_sale=="4"){
            $str_shop="AND n.ord_category IN (18)";
        }
     
         
        //-----------location compare-------------------------
        $start_year=intval(substr($fromdate,0,4));
        $end_year=  intval(substr($todate,0,4));
        if($start_year==$end_year){           
           $query_all="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,MONTHNAME(p.post_date) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'                                      
                        $str_shop
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value" ;                       
           $result_all=mysqli_query($db,$query_all);
           
           while($row=mysqli_fetch_array($result_all)){
                        array_push($rows_all,$row);
           } 
           //---------------------------------
           $query_all_total="SELECT COUNT(p.id) AS `qty`,MONTHNAME(p.post_date) AS date_month
                    	FROM `aowp_posts` p 
                    		LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                    		LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                    	WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$todate 23:59:00'                                     
                    $str_shop
                    	AND pm_shipping_city.meta_key='_billing_city' 
                    	GROUP BY MONTH(p.post_date)" ;                       
           $result_all_total=mysqli_query($db,$query_all_total);
           
           while($row=mysqli_fetch_array($result_all_total)){
                        array_push($rows_all_total,$row);
           } 
           //---------------------------------              
        }else if($start_year<$end_year){   
            $query_all="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTHNAME(p.post_date),'_',$start_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$start_year-12-31 23:59:00'                                      
                        $str_shop
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";
            $result_all=mysqli_query($db,$query_all);
           
            while($row=mysqli_fetch_array($result_all)){
                        array_push($rows_all,$row);
           }           
                
            $query_all_path2="SELECT pm_shipping_city.meta_value AS city,COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTHNAME(p.post_date),'_',$end_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$todate 23:59:00'                                      
                        $str_shop
                        AND pm_shipping_city.meta_key='_billing_city' AND pm_shipping_city.meta_value IN($str_location)
                        GROUP BY month(p.post_date),pm_shipping_city.meta_value";  
            $result_all_path2=mysqli_query($db,$query_all_path2);
            while($row1=mysqli_fetch_array($result_all_path2)){
                        array_push($rows_all,$row1);
           }   
           //-----------------------------------------------------------------------------
           
           $query_all_total="SELECT COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTHNAME(p.post_date),'_',$start_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$fromdate 00:00:00' AND '$start_year-12-31 23:59:00'                                      
                        $str_shop
                        AND pm_shipping_city.meta_key='_billing_city' 
                        GROUP BY month(p.post_date)";
            $result_all_total=mysqli_query($db,$query_all_total);
           
            while($row=mysqli_fetch_array($result_all_total)){
                        array_push($rows_all_total,$row);
           }           
                
            $query_all_total_path2="SELECT COUNT(pm_shipping_city.meta_value) AS qty,CONCAT(MONTHNAME(p.post_date),'_',$end_year) as date_month
                        FROM `aowp_posts` p 
                            LEFT JOIN `tb_ord_note` n ON p.id=n.order_id                                       
                        	LEFT JOIN `aowp_postmeta` pm_shipping_city ON p.id=pm_shipping_city.post_id                                        		
                        WHERE p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_type='shop_order' AND p.post_date BETWEEN '$end_year-01-01 00:00:00' AND '$todate 23:59:00'                                      
                        $str_shop
                        AND pm_shipping_city.meta_key='_billing_city'
                        GROUP BY month(p.post_date)";  
            $result_all_total_path2=mysqli_query($db,$query_all_total_path2);
            while($row1=mysqli_fetch_array($result_all_total_path2)){
                        array_push($rows_all_total,$row1);
           }
                     
        }
        $obj_data=$arr_data=array("list_total"=>$rows_all_total,"list_main_area"=>$rows_all);
      //  $arr_data=array("location_total"=>$rows_all,"location_sky007"=>$rows_sky007,"location_shopee"=>$rows_shopee,"location_lazada"=>$rows_lazada,"location_eglips"=>$rows_eglips);
        echo json_encode($obj_data);
        common_close_connect($db);
    }
        //============ End Data report location compare  ======================================= 
        //============ direct Order  =========================================== 
    public function sv_data_report_direct_order($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];   
        $db     = common_connect();
        $rows   = array();    
        $query="SELECT a.order_time,a.id,a.name,a.order_status,GROUP_CONCAT(b.product_name) as `product_name`,a.total_price,a.manager
                FROM(
                	SELECT p.post_date AS `order_time` ,p.`ID`
                		,CONCAT_WS(' ',pm_first_name.meta_value,pm_last_name.meta_value) AS `name`
                		,p.post_status AS `order_status`    
                		,pm_total_price.meta_value AS `total_price`
                		,IF(n.mg_id=1,'Website',n.mg_id )AS `manager`
                	FROM `aowp_posts` p
                		LEFT JOIN `aowp_postmeta` pm_last_name   ON p.id=pm_last_name.post_id
                		LEFT JOIN `aowp_postmeta` pm_first_name  ON p.id=pm_first_name.post_id
                		LEFT JOIN `aowp_postmeta` pm_total_price ON p.id=pm_total_price.post_id 
                		LEFT JOIN `aowp_postmeta` pm_payment     ON p.id=pm_payment.post_id 
                		LEFT JOIN `tb_ord_note` n ON n.order_id=p.id 
                	WHERE p.post_type='shop_order'  AND p.post_status !='trash' 
                		AND post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                		AND n.ord_category IN (0,5) AND n.warehouse='0'
                		AND pm_last_name.meta_key='_billing_last_name'
                		AND pm_first_name.meta_key='_billing_first_name'  
                		AND pm_total_price.meta_key='_order_total'
                		AND pm_payment.meta_key='_payment_method_title'
                		AND pm_payment.meta_value='Direct payment'
                	)AS a
                LEFT JOIN 
                	(SELECT   p.id,IF(oim_variation.meta_value='0',CONCAT(oi.order_item_name,'(',oim_price.meta_value/oim_qty.meta_value,')',' => ',oim_qty.meta_value),CONCAT(name_item.product_name,'(',oim_price.meta_value/oim_qty.meta_value,')',' => ',oim_qty.meta_value)) AS `product_name`
                	FROM     `aowp_posts` p
                		LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                		LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_id ON oi.order_item_id= oim_id.order_item_id		
                		LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_variation ON  oi.order_item_id=oim_variation.order_item_id	
                		LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_qty ON  oi.order_item_id=oim_qty.order_item_id
                		LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_price ON  oi.order_item_id=oim_price.order_item_id
                		LEFT JOIN (SELECT p.id AS item_id ,CONCAT_WS(' #',p.post_title,pm.meta_value)  AS product_name 
                				FROM `aowp_posts` p
                					LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id
                				WHERE p.post_type='product_variation' AND p.post_status  IN ('publish','private')
                					AND pm.meta_key='attribute_pa_color') AS `name_item` ON oim_variation.meta_value=name_item.item_id
                	WHERE  oi.order_item_type='line_item'
                		AND oim_id.meta_key='_product_id'		
                		AND oim_price.meta_key='_line_total'
                		AND oim_variation.meta_key='_variation_id'	
                		AND oim_qty.meta_key='_qty') AS `b` ON a.id=b.id
                GROUP BY a.id";      
        $result = mysqli_query($db,$query);   
        $rows_packaging   = array();        
        while ($row = mysqli_fetch_array($result)) {                
            array_push($rows, $row);                
        }        
        echo json_encode($rows);       
        common_close_connect($db);   
     }
        //============ End direct Order  ======================================= 
        //============ Order Marketing===================================
     public function sv_data_report_order_marketing($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];       
        $shop_sale=$obj["shop_sale"];       
        $str_shop="";  
            if($shop_sale=="0"){
                $str_shop="5".","."11".","."15".","."19".","."21".","."25".","."27".","."29".","."31".","."35".","."37".","."43".","."47".","."49".","."51".","."53".","."55".","."57".","."59".","."61".","."63".","."65".","."67".","."69".","."71";
            }else if($shop_sale=="1"){
                $str_shop="5".","."11".","."15".","."21".","."25".","."35".","."37".","."47".","."51";
            }else if($shop_sale=="2"){
                $str_shop="49".","."53".","."55".","."57".","."59".","."61".","."63";
            }else if($shop_sale=="3"){
                $str_shop="65".","."67".","."69".","."71";
            }
        $query="SELECT p.id ,p.post_date,p.post_status,p.post_excerpt,CONCAT_WS(' ',pm_f_name.meta_value,pm_l_name.meta_value) AS `name`,GROUP_CONCAT(CONCAT_WS(' -> ',oi.order_item_name,oim_quantity.meta_value))AS item,pm_phone.meta_value AS `phone`,pm_address.meta_value AS `address`,IF(n.ord_category='5','Sky007',IF(n.ord_category='11','Shoppe Bbia',IF(n.ord_category='15','Lotte',IF(n.ord_category='19','Eglips',IF(n.ord_category='21','Lazada Bbia',IF(n.ord_category='25','Shopee Eglips',IF(n.ord_category='27','Lazada Eglips',IF(n.ord_category='29','Robins',IF(n.ord_category='31','Watson',IF(n.ord_category='35','Beautybox',IF(n.ord_category='37','Tiki',IF(n.ord_category='47','Bbiavn',IF(n.ord_category='49','Mixsoon',IF(n.ord_category='51','Guardian',IF(n.ord_category='53','Shopee Mixsoon',
        IF(n.ord_category='55','Lazada Mixsoon',IF(n.ord_category='59','Tiktok',IF(n.ord_category='61','Tiktok Mixsoon',IF(n.ord_category='65','Hince Website',IF(n.ord_category='67','Hince Shopee',IF(n.ord_category='69','Hince Lazada',IF(n.ord_category='71','Hince Tiktok','Another')))))))))))))))))))))) AS `shop_marketing`,IF(n.ord_parent_id='0','Dont know',n.ord_parent_id) AS `main_order`,IF(n.mg_id='1','Website',n.mg_id) AS manager
                 FROM  `aowp_posts` p  
                	LEFT JOIN `aowp_postmeta` pm_f_name ON p.id=pm_f_name.post_id
                	LEFT JOIN `aowp_postmeta` pm_l_name ON p.id=pm_l_name.post_id
                	LEFT JOIN `aowp_postmeta` pm_phone ON p.id=pm_phone.post_id
                	LEFT JOIN `aowp_postmeta` pm_address ON p.id=pm_address.post_id
                	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id                       
                    LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                    LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                     
                 WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                	AND pm_f_name.meta_key='_billing_first_name'
                	AND pm_l_name.meta_key='_billing_last_name'
                	AND pm_phone.meta_key='_billing_phone'
                	AND pm_address.meta_key='_billing_address_1'                
                	AND oim_quantity.meta_key='_qty'
                    AND oi.order_item_type='line_item'
                	AND n.ord_category in ($str_shop)
                GROUP BY p.id";               
        $db     = common_connect();
        $rows   = array();
        $result = mysqli_query($db,$query);
        
        
            while ($row = mysqli_fetch_array($result)) {
                
                array_push($rows, $row);
                
            }
        
          echo json_encode($rows);
          common_close_connect($db);                  
    }         
        //============ End Order Marketing===============================
        //============ Order Tax===================================
     public function sv_data_report_tax($obj){
        $startdate=$obj["start_date"];
        $enddate=$obj["end_date"];       
        $shop_sale=$obj["shop_sale"];
        $brand_name=$obj["brand"];       
        $str_shop="";
        if($shop_sale=="0"){
            $str_shop="";
        }else if($shop_sale=="1"){
            $str_shop="AND n.ord_category IN(0,5)";
        }else if($shop_sale=="2"){
            $str_shop="AND n.ord_category =7";
        }else if($shop_sale=="3"){
            $str_shop="AND n.ord_category IN(10,11)";
        }else if($shop_sale=="4"){
            $str_shop="AND n.ord_category IN(14,15)";
        }else if($shop_sale=="5"){
            $str_shop="AND n.ord_category IN(16,17)";
        }else if($shop_sale=="6"){
            $str_shop="AND n.ord_category IN(18,19)";
        }else if($shop_sale=="7"){
            $str_shop="AND n.ord_category IN(20,21)";
        }  
        $str_brand_name="";
        if($brand_name=="0"){
            $str_brand_name="";
        }else if($brand_name=="1"){
            $str_brand_name="HAVING product_name  LIKE '%bbia%'";
        }else if($brand_name=="2"){
            $str_brand_name="HAVING product_name  LIKE '%eglips%'";
        }else if($brand_name=="3"){
            $str_brand_name="HAVING product_name NOT LIKE '%eglips%' AND product_name NOT LIKE '%bbia%'";
        }
            
        $query="SELECT a.order_time,a.category,a.id,a.order_status,b.product_name,b.price,b.tax
                                    FROM (SELECT p.post_date AS `order_time` ,
                                    		IF(n.ord_category='0' ,'customer',IF(n.ord_category='5' ,'marketing',IF(n.ord_category='7' ,'wholesaler',IF(n.ord_category='10' ,'shopee',IF(n.ord_category='11' ,'shopeeMaKeting',IF(n.ord_category='13' ,'missing',IF(n.ord_category='14' ,'lotte',IF(n.ord_category='15' ,'lotteMarketing',IF(n.ord_category ='16','Sendo',IF(n.ord_category ='17','Sendo Marketing',IF(n.ord_category ='18','Eglips',IF(n.ord_category ='19','Eglips Marketing',IF(n.ord_category ='20','Lazada',IF(n.ord_category ='21','Lazada Marketing',IF(n.ord_category ='24','Shopee Eglips',IF(n.ord_category ='25','Shopee Eglips Marketing',IF(n.ord_category ='26','Lazada Eglips',IF(n.ord_category ='27','Lazada Eglips Marketing',IF(n.ord_category ='36','Tiki',IF(n.ord_category ='37','Tiki Marketing',IF(n.ord_category ='42','Tiki Eglips',IF(n.ord_category ='43','Tiki Eglips Marketing',IF(n.ord_category ='44','Sociolla',IF(n.ord_category ='46','Bbiavn',IF(n.ord_category ='47','Bbiavn Marketing',IF(n.ord_category ='48','Mixsoon',IF(n.ord_category ='49','Mixsoon Marketing',IF(n.ord_category ='50','Guardian',IF(n.ord_category ='51','Guardian Marketing',IF(n.ord_category ='52','Shopee Mixsoon',IF(n.ord_category ='53','Shopee Mixsoon Marketing',IF(n.ord_category ='54','Lazada Mixsoon',
                                            IF(n.ord_category ='55','Lazada Mixsoon Marketing',IF(n.ord_category ='58','Tiktok',IF(n.ord_category ='59','Tiktok Marketing','Another'))))))))))))))))))))))))))))))))))) AS `category`,                                    		
                                            p.id ,
                                    		p.post_status AS `order_status`
                                    	FROM `aowp_posts` p                                    		     
                                    		LEFT JOIN `tb_ord_note` n ON n.order_id=p.id
                                    		LEFT JOIN `tb_ord_delivery` d ON p.id=d.order_id
                                    		
                                    	WHERE p.post_type='shop_order'  AND p.post_status !='trash' AND post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00' $str_shop) AS `a`
                                    LEFT JOIN (SELECT  p.id,IF(oim_variation.meta_value='0',CONCAT_WS(' => ',oi.order_item_name,oim_qty.meta_value),CONCAT_WS(' => ',name_item.product_name,oim_qty.meta_value)) AS `product_name`,oim_price.meta_value AS `price`, (oim_price.meta_value*0.1)AS `tax`
                                    		FROM     `aowp_posts` p
                                    			LEFT JOIN `aowp_woocommerce_order_items` oi ON p.id=oi.order_id
                                    			LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_id ON oi.order_item_id= oim_id.order_item_id
                                    			LEFT JOIN  `aowp_postmeta` pm ON oim_id.meta_value=pm.post_id
                                    			LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_variation ON  oi.order_item_id=oim_variation.order_item_id	
                                    			LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_qty ON  oi.order_item_id=oim_qty.order_item_id
                                    			LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_price ON  oi.order_item_id=oim_price.order_item_id
                                    			LEFT JOIN (SELECT p.id AS item_id ,CONCAT_WS(' #',p.post_title,pm.meta_value)  AS product_name 
                                    					FROM `aowp_posts` p
                                    						LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id
                                    					WHERE p.post_type='product_variation' AND p.post_status  IN ('publish','private')
                                    						AND pm.meta_key='attribute_pa_color') AS `name_item` ON oim_variation.meta_value=name_item.item_id
                                    		WHERE  p.post_type='shop_order'  AND p.post_status !='trash' AND post_date BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'
                                    			AND oi.order_item_type='line_item'
                                    			AND oim_id.meta_key='_product_id'
                                    			AND pm.meta_key='_sku'
                                    			AND pm.meta_value LIKE '%-R'
                                    			AND oim_variation.meta_key='_variation_id'
                                    			AND oim_price.meta_key='_line_total'	
                                    			AND oim_qty.meta_key='_qty') AS `b` ON a.id=b.id
               WHERE b.product_name IS NOT NULL $str_brand_name";               
        $db     = common_connect();
        $rows   = array();
        $result = mysqli_query($db,$query);
        
        
            while ($row = mysqli_fetch_array($result)) {
                
                array_push($rows, $row);
                
            }
        
          echo json_encode($rows);
          common_close_connect($db);                  
    }         
        //============ End Order Tax===============================
        //============ data report Shop Items ============================================
        
        public function sv_data_report_shop_items_new($obj){
            $db     = common_connect();
            $arr_data=array();
            $arr_data_total_sale=array();
            $sdate=$obj["start_date"];
            $edate=$obj["end_date"];
           // $product_type=$obj["product_type"]; // 0 : Hand Carried Product , 1: Regular Product , 2: Combined Product
          //  $company=$obj["company"]; // 0: Actsone , 1:Jnian
           
           
            $str_shopmall="";
            $flag_combine="false";
            $list_shopmall=$obj["listmall"];
            $brand_name=$obj["brand_name"];
            $str_brand_name="";
            if($brand_name==1){
                $str_brand_name="AND `product_name` LIKE '%bbia%'";
            }else if($brand_name==2){
                $str_brand_name="AND `product_name` LIKE '%hince%'";
            }else if($brand_name==3){
                $str_brand_name="AND `product_name` LIKE '%Mixsoon%'";
            }
            
            for($i=0;$i<count($list_shopmall);$i++){
                $shopType=$list_shopmall[$i];
                $data_item_sale=array();
                $data_item_total_sale=array();
                $check_mt_shop=substr($shopType,-2);
                
                $str_shopmall.="0 as `".$shopType."`,0 as `".$shopType."totalprice`,";
                $shop_id="";
                //-------------- HCM ----------------------
                if($shopType=="chkSky007"){
                    $shop_id="0";
                }else if($shopType=="chkSky007MT"){
                    $shop_id="5";
                }else if($shopType=="chkWholesaler"){
                    $shop_id="7";
                }else if($shopType=="chkShopeeBbia"){
                    $shop_id="10";
                }else if($shopType=="chkShopeeBbiaMT"){
                    $shop_id="11";
                }else if($shopType=="chkLazadaBbia"){
                    $shop_id="20";
                }else if($shopType=="chkLazadaBbiaMT"){
                    $shop_id="21";
                }else if($shopType=="chkWholesalerJnain"){
                    $shop_id="33";
                }else if($shopType=="chkBeautybox"){
                    $shop_id="34";
                }else if($shopType=="chkBeautyboxMT"){
                    $shop_id="35";
                }else if($shopType=="chkTikiBbia"){
                    $shop_id="36";
                }else if($shopType=="chkMixsoon"){
                    $shop_id="48";
                }else if($shopType=="chkTikiBbiaMT"){
                    $shop_id="37";
                }else if($shopType=="chkSociolla"){
                    $shop_id="44";
                }else if($shopType=="chkSociollaMT"){
                    $shop_id="45";
                }else if($shopType=="chkBbiavn"){
                    $shop_id="46";
                }else if($shopType=="chkBbiavnMT"){
                    $shop_id="47";
                }else if($shopType=="chkMixsoon"){
                    $shop_id="48";
                }else if($shopType=="chkMixsoonMT"){
                    $shop_id="49";
                }else if($shopType=="chkGuardian"){
                    $shop_id="50";
                }else if($shopType=="chkGuardianMT"){
                    $shop_id="51";
                }else if($shopType=="chkMixsoonShopee"){
                    $shop_id="52";
                }else if($shopType=="chkMixsoonShopeeMT"){
                    $shop_id="53";
                }else if($shopType=="chkMixsoonLazada"){
                    $shop_id="54";
                }else if($shopType=="chkMixsoonLazadaMT"){
                    $shop_id="55";
                }else if($shopType=="chkTiktokSky007"){
                    $shop_id="58";
                }else if($shopType=="chkTiktokSky007MT"){
                    $shop_id="59";
                }else if($shopType=="chkWatsonBbia"){
                    $shop_id="62";
                }else if($shopType=="chkTiktokSky007MT"){
                    $shop_id="63";
                }
               //-------------- HN --------------------------------------
                else if($shopType=="chkHince"){
                    $shop_id="64";
                }else if($shopType=="chkHinceMT"){
                    $shop_id="65";
                }else if($shopType=="chkWholesalerEglips"){
                    $shop_id="22";
                }else if($shopType=="chkShopeeHince"){
                    $shop_id="66";
                }else if($shopType=="chkShopeeHinceMT"){
                    $shop_id="67";
                }else if($shopType=="chkLazadaHince"){
                    $shop_id="68";
                }else if($shopType=="chkLazadaHinceMT"){
                    $shop_id="69";
                }else if($shopType=="chkWatsons"){
                    $shop_id="30";
                }else if($shopType=="chkWatsonsMT"){
                    $shop_id="31";
                }else if($shopType=="chkWholesalerActsone"){
                    $shop_id="32"; 
                }else if($shopType=="chkTiktokHince"){
                    $shop_id="70";
                }else if($shopType=="chkTiktokHinceMT"){
                    $shop_id="71";
                }
                            
                $total_sale=mysqli_query($db,"Select item_id,quantity,check_mt
                                            From
                                            (SELECT oim_product_id.meta_value AS `item_id`, SUM(oim_quantity.meta_value) AS `quantity` , IF(price_item.meta_value!=0,1,price_item.meta_value) AS `check_mt`
                                                FROM `aowp_posts` p
                                                	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oi_variation_id ON oi_variation_id.order_item_id=oi.order_item_id 
                                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` price_item ON price_item.order_item_id=oi.order_item_id
                                                	LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                                WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$sdate 00:00:00' AND '$edate 23:59:00'
                                                	AND order_item_type='line_item'
                                                	AND oim_product_id.meta_key='_product_id'
                                                	AND oi_variation_id.meta_key='_variation_id'
                                                	AND oi_variation_id.meta_value='0'
                                                	AND n.ord_category='$shop_id'
                                                	AND oim_quantity.meta_key='_qty'
                                                	AND price_item.meta_key='_line_total' 
                                                	GROUP BY oim_product_id.meta_value,check_mt
                                                    UNION
                                            SELECT oi_variation_id.meta_value AS `item_id`, SUM(oim_quantity.meta_value) AS `quantity` , IF(price_item.meta_value!=0,1,price_item.meta_value) AS `check_mt`
                                                FROM `aowp_posts` p
                                                	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` oi_variation_id ON oi_variation_id.order_item_id=oi.order_item_id 
                                                	LEFT JOIN `aowp_woocommerce_order_itemmeta` price_item ON price_item.order_item_id=oi.order_item_id
                                                	LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                                WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$sdate 00:00:00' AND '$edate 23:59:00'
                                                	AND order_item_type='line_item'
                                                	AND oim_product_id.meta_key='_product_id'
                                                	AND oi_variation_id.meta_key='_variation_id'
                                                	AND oi_variation_id.meta_value!='0'
                                                	AND n.ord_category='$shop_id'
                                                	AND oim_quantity.meta_key='_qty'
                                                	AND price_item.meta_key='_line_total' 
                                                	GROUP BY oi_variation_id.meta_value,check_mt) as `tb_qty_sale`");
                                                    
               while ($row = mysqli_fetch_array($total_sale)) {                
                    array_push($data_item_sale, $row);                
              } 
              $arr_data[$shopType]=$data_item_sale;
            //   $shopType 
              if($check_mt_shop!="MT"){                
                  $total_money_sale=mysqli_query($db,"SELECT item_id,total_price
                                                    FROM(SELECT oim_product_id.meta_value AS `item_id`, SUM(oim_total_price.meta_value) AS `total_price` 
                                                    					FROM `aowp_posts` p
                                                    						LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                                                    						LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                                                    						LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_total_price ON oim_total_price.order_item_id=oi.order_item_id
                                                    						LEFT JOIN `aowp_woocommerce_order_itemmeta` oi_variation_id ON oi_variation_id.order_item_id=oi.order_item_id 
                                                    						LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                                    					WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$sdate 00:00:00' AND '$edate 23:59:00'
                                                    						AND order_item_type='line_item'
                                                    						AND oim_product_id.meta_key='_product_id'
                                                    						AND oi_variation_id.meta_key='_variation_id'
                                                    						AND oi_variation_id.meta_value='0'
                                                    						AND n.ord_category='$shop_id'
                                                    						AND oim_total_price.meta_key='_line_total'                                                                           
                                                    						GROUP BY oim_product_id.meta_value
                                                    UNION
                                                    SELECT oi_variation_id.meta_value AS `item_id`, SUM(oim_total_price.meta_value) AS `total_price`
                                                    				FROM `aowp_posts` p
                                                    					LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id         
                                                    					LEFT JOIN `aowp_woocommerce_order_itemmeta` oi_variation_id ON oi_variation_id.order_item_id=oi.order_item_id                                		
                                                    					LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_total_price ON oim_total_price.order_item_id=oi.order_item_id
                                                    					LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                                    				WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$sdate 00:00:00' AND '$edate 23:59:00'
                                                    					AND oi.order_item_type='line_item'                                	
                                                    					AND oi_variation_id.meta_key='_variation_id'
                                                    					AND n.ord_category='$shop_id'						
                                                    					AND oim_total_price.meta_key='_line_total'
                                                    					AND oi_variation_id.meta_value!='0'                                                                       
                                                    					GROUP BY oi_variation_id.meta_value) AS tb_total_money_sale");                                                                                                                           
                                                        
                 while ($row = mysqli_fetch_array($total_money_sale)) {                
                        array_push($data_item_total_sale, $row);                
                  } 
                  $arr_data_total_sale[$shopType]=$data_item_total_sale;
             }
            }   
          //  echo json_encode($data_item_sale);// exit();
            $str_shopmall=substr($str_shopmall, 0, -1);           
            $list_product=mysqli_query($db,"SELECT `product_id`,`product_name`,`sku` ,IF(`sku` LIKE '%-R',1,0) AS `product_type` ,$str_shopmall FROM `tb_stock_divide` WHERE sku!=''    $str_brand_name AND `view`=0 AND product_id")  ;
            // AND sku NOT LIKE 'BA-TK%' AND sku NOT LIKE 'BA-LZ%' AND sku NOT LIKE 'BA-CB%' AND sku NOT LIKE'EG-GF%' AND sku NOT LIKE 'EG-CB%' AND sku NOT LIKE'BA-GF%' AND sku NOT LIKE 'BA-SP%' 
          // echo ("SELECT `product_id`,`product_name`,`sku` ,IF(`sku` LIKE '%-R',1,0) AS `product_type` ,$str_shopmall FROM `tb_stock_divide` WHERE sku!=''AND sku NOT LIKE 'BA-SP%' AND sku NOT LIKE 'BA-TK%' AND sku NOT LIKE 'BA-LZ%' AND sku NOT LIKE 'BA-CB%' AND sku NOT LIKE'EG-GF%' AND sku NOT LIKE 'EG-CB%' AND sku NOT LIKE'BA-GF%' $str_brian_name AND `view`=0 AND product_id");die();
            $rows_list_product   = array();
            while ($row = mysqli_fetch_array($list_product)) {                
                array_push($rows_list_product, $row);                
            }            
          
            //-----------------------------------------------------
            
           
             for($i=0;$i<count($list_shopmall);$i++){
                $shopType=$list_shopmall[$i];
                $check_mt_shop=substr($shopType,-2);
                $obj_data=$arr_data[$shopType];
              
                for($k=0;$k<count($rows_list_product);$k++){
                    $product_id=$rows_list_product[$k]["product_id"];
                    $qty_sale=$rows_list_product[$k][$shopType];
                    
                    //--------------- Insert qty----------------------
                    for($l=0;$l<count($obj_data);$l++){
                        $p_id=$obj_data[$l]["item_id"];
                        $check_mt=$obj_data[$l]["check_mt"];
                        $qty_shop=$obj_data[$l]["quantity"];
                       
                        if($product_id==$p_id){    
                        
                            
                            if($check_mt_shop=="MT"){
                               if($check_mt=="0"){
                                $rows_list_product[$k][$shopType]=intval($qty_sale)+intval($qty_shop);                                
                               }else if($check_mt=="1"){
                                    if(isset($rows_list_product[$k][substr($shopType,-2)])){
                                        $qty_mt=$rows_list_product[$k][substr($shopType,-2)];
                                        $rows_list_product[$k][substr($shopType,-2)]=intval($qty_mt)+intval($qty_shop);                                        
                                    }
                                } 
                            }else{
                               if($check_mt=="1"){
                                $rows_list_product[$k][$shopType]=intval($qty_sale)+intval($qty_shop);                                
                               }else if($check_mt=="0"){                                      
                                    if(isset($rows_list_product[$k][$shopType.'MT'])){
                                        $qty_mt=$rows_list_product[$k][$shopType.'MT'];
                                        
                                        $rows_list_product[$k][$shopType.'MT']=intval($qty_mt)+intval($qty_shop);
                                         
                                       
                                        
                                    }
                                } 
                            }
                            
                          /*  if($product_id=="451352"){
                                    echo(intval($qty_mt)+intval($qty_shop)); exit();
                                }*/
                            
                        }
                        
                    }
                   //--------------- END Insert qty----------------------
                   //--------------- Insert total sale-------------------
                   if($check_mt_shop!="MT"){
                        $obj_data_total_money_sale=$arr_data_total_sale[$shopType];
                        $total_money_sale=$rows_list_product[$k][$shopType."totalprice"];
                        
                        for($l=0;$l<count($obj_data_total_money_sale);$l++ ){
                            $p_id=$obj_data_total_money_sale[$l]["item_id"];
                            $total_money_sale_shop=$obj_data_total_money_sale[$l]["total_price"];
                            if($product_id==$p_id){
                                                               
                                $rows_list_product[$k][$shopType."totalprice"]=intval($total_money_sale_shop)+intval($total_money_sale);
                            }
                        }                        
                        
                   }
                   //--------------- End Insert total sale---------------
                }
             }
             
          
             $arr_data["infor_order"]=$rows_list_product;  
            
            
            
            
           //------------------------------------------------------ 
              
          //  echo json_encode($arr_data);
            echo json_encode($rows_list_product); 
            common_close_connect($db);       

            
        }
        
                   
        //============  End data report Shop Items =======================================
        
        //============  data report Items   =============================================        
        
         public function sv_data_report_items($obj){
            $db     = common_connect();           
            $sdate=$obj["start_date"];
            $edate=$obj["end_date"];   
            $brand_name=$obj["cbobrand"];
            $shop_condition="";
            if($brand_name==1){
                $shop_condition="AND sku like'BA%'";
            }else if($brand_name==2){
                $shop_condition="AND sku like'MS%'";
            }else if($brand_name==3){
                $shop_condition="AND sku like'HC%'";
            }
            $result=mysqli_query($db,"SELECT d.product_name,d.sku,a.total_quantity
                                        FROM(
                                        SELECT oim_product_id.meta_value AS `product_id`,SUM(oim_qty.meta_value)AS total_quantity
                                        FROM `aowp_posts` p
                                        	 JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	 JOIN aowp_woocommerce_order_itemmeta oim_product_id ON oi.order_item_id=oim_product_id.order_item_id
                                        	 JOIN aowp_woocommerce_order_itemmeta oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                        WHERE p.post_type='shop_order' AND p.post_status!='trash' AND  p.post_status!='wc-cancelled' AND p.post_date BETWEEN '$sdate 00:00:00' AND '$edate 23:59:59'
                                        	AND oi.order_item_type ='line_item'
                                        	AND oim_product_id.meta_key='_product_id' 
                                        	AND oim_qty.meta_key='_qty'	
                                        GROUP BY product_id) a
                                        JOIN `tb_stock_divide` d ON a.product_id=d.product_id
                                        WHERE d.`sku` NOT LIKE 'BA-CB%' AND d.`sku` !='' AND   d.`sku` NOT LIKE 'EG-CB%' AND sku NOT LIKE '%BA-GF%'  AND sku NOT LIKE '%MS-GF%' AND   d.`sku` NOT LIKE 'MS-CB%' AND d.`sku` NOT LIKE 'HC-CB%' AND sku NOT LIKE '%HC-GF%' $shop_condition");       
            $rows=array();                                            
            while($row=mysqli_fetch_array($result)){            
             array_push($rows,$row);
            }
            echo json_encode($rows); 
            common_close_connect($db);
            
         }
         //============  END data report Items   =========================================
         
         //============  data report heatmap   =============================================        
        
         public function sv_data_report_heatmap($obj){
            $db     = common_connect();           
            $sdate=$obj["start_date"];
            $edate=$obj["end_date"];   
            $brand_name=$obj["brand"];
            
            $shop_condition="";
            if($brand_name==1){
                $shop_condition="AND sku like'BA%'";
            }else if($brand_name==2){
                $shop_condition="AND sku like'MS%'";
            }else if($brand_name==3){
                $shop_condition="AND sku like'HC%'";
            }else if($brand_name==4){
                $shop_condition="AND sku like'EG%'";
            }
            
            $color_tone=$obj["color_tone"];
            $tone_condition="";
             if($color_tone=="red"){
                $tone_condition="AND color_tone like'red%'";
            }else if($color_tone=="pink"){
                $tone_condition="AND color_tone like'pink%'";
            }else if($color_tone=="orange"){
                $tone_condition="AND color_tone like'orange%'";
            }else if($color_tone=="brown"){
                $tone_condition="AND color_tone like'brown%'";
            }else if($color_tone=="purple"){
                $tone_condition="AND color_tone like'purple%'";
            }
            
            
            $result=mysqli_query($db,"SELECT d.product_name,d.sku,a.total_quantity, LEFT(color_tone, char_length(color_tone) - 2) as `tone`,d.color_detail as `color`
                                        FROM(
                                        SELECT oim_product_id.meta_value AS `product_id`,SUM(oim_qty.meta_value)AS total_quantity
                                        FROM `aowp_posts` p
                                        	 JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        	 JOIN aowp_woocommerce_order_itemmeta oim_product_id ON oi.order_item_id=oim_product_id.order_item_id
                                        	 JOIN aowp_woocommerce_order_itemmeta oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                        WHERE p.post_type='shop_order' AND p.post_status!='trash' AND  p.post_status!='wc-cancelled' AND p.post_date BETWEEN '$sdate 15:40:00' AND '$edate 15:31:00'
                                        	AND oi.order_item_type ='line_item'
                                        	AND oim_product_id.meta_key='_product_id' 
                                        	AND oim_qty.meta_key='_qty'	
                                        GROUP BY product_id) a
                                        JOIN `tb_stock_divide` d ON a.product_id=d.product_id
                                        WHERE d.color_tone!='' AND d.`sku` NOT LIKE 'BA-CB%' AND d.`sku` !='' AND   d.`sku` NOT LIKE 'EG-CB%' AND sku NOT LIKE '%BA-GF%'  AND sku NOT LIKE '%EG-GF%' $shop_condition $tone_condition");       
            $rows=array();                                            
            while($row=mysqli_fetch_array($result)){            
             array_push($rows,$row);
            }
            echo json_encode($rows); 
            common_close_connect($db);
            
         }
         //============  END data report Items   =========================================
         
        //============  data report Watsons =========================================
         public function sv_stock_management_get_list_product_watsons($obj){
            $chkAllData=$obj["all_data"];   
            $stime=$obj["start_date"];
            $etime=$obj["end_date"];
            $today = date("Y-m-d H:i:s");
            $next_eight_month=date("Y-m-d",strtotime("+8 month"));
         //   echo($next_eyght_month);exit();
            $str_date="";
            if($chkAllData=="true"){
              $str_date=" AND p.post_date BETWEEN '2019-01-01 00:00:00' AND '$today'";
            }else{
                $str_date=" AND p.post_date BETWEEN '".$stime." 00:00:00' AND '".$etime." 23:59:00'";
            }    
            $db=common_connect(); 
             
            $result_exp=mysqli_query($db,"SELECT * FROM `tb_check_exp_product`  WHERE `status`!=2");
            $rows_exp=array();
            while($row=mysqli_fetch_array($result_exp)){ 
                    array_push($rows_exp,$row);               
            }
            
            $result=mysqli_query($db,"SELECT sd.product_id,sd.product_name,sd.sku,sd.stock_watsons AS stock_remain,sd.stock_watsons_total AS stock_total,stock_watsons_return AS `qty_return`
                                FROM tb_stock_divide_hanoi sd
                                WHERE sd.product_name NOT LIKE '%combo%' AND sd.product_name NOT LIKE 'set%' AND product_name LIKE '%eglips%'");
            $rows=array();
            while($row=mysqli_fetch_array($result)){ 
                    $product_id=$row["product_id"];
                  
                    $str_po_id="";
                    $status=2; //0:New ; 1: Processing ; 2: Done
                    for($i=0;$i<count($rows_exp);$i++){
                        if($product_id==$rows_exp[$i]["product_id"]){
                            $exp_date=$rows_exp[$i]["exp_date"];
                            $po_id=$rows_exp[$i]["po_id"];
                            $str_po_id=$str_po_id.$po_id.",";
                           // echo($exp_date ." ".$next_eight_month); exit();
                            if($exp_date<=$next_eight_month){
                               $status=$rows_exp[$i]["status"];
                                
                            }
                        }
                    }
                    if(strlen($str_po_id)>0){
                        $str_po_id=substr($str_po_id, 0, -1);
                    }
                    
                    $row["po_id"]=$str_po_id;
                    $row["status"]=$status;
                    array_push($rows,$row);               
            } //mysqli_query($db,
            $result_sale=mysqli_query($db,"SELECT item_id,quantity,check_mt
                                            FROM
                                            (SELECT oim_product_id.meta_value AS `item_id`, SUM(oim_quantity.meta_value) AS `quantity` , IF(price_item.meta_value!=0,1,price_item.meta_value) AS `check_mt`
                                            FROM `aowp_posts` p
                                            	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` oi_variation_id ON oi_variation_id.order_item_id=oi.order_item_id 
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` price_item ON price_item.order_item_id=oi.order_item_id
                                            	LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                            WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' $str_date
                                            	AND order_item_type='line_item'
                                            	AND oim_product_id.meta_key='_product_id'
                                            	AND oi_variation_id.meta_key='_variation_id'
                                            	AND oi_variation_id.meta_value='0'
                                            	AND n.ord_category='30'
                                            	AND oim_quantity.meta_key='_qty'
                                            	AND price_item.meta_key='_line_total' 
                                            	GROUP BY oim_product_id.meta_value,check_mt
                                            	HAVING check_mt=1
                                                UNION
                                            SELECT oi_variation_id.meta_value AS `item_id`, SUM(oim_quantity.meta_value) AS `quantity` , IF(price_item.meta_value!=0,1,price_item.meta_value) AS `check_mt`
                                            FROM `aowp_posts` p
                                            	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` oi_variation_id ON oi_variation_id.order_item_id=oi.order_item_id 
                                            	LEFT JOIN `aowp_woocommerce_order_itemmeta` price_item ON price_item.order_item_id=oi.order_item_id
                                            	LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                            WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' $str_date
                                            	AND order_item_type='line_item'
                                            	AND oim_product_id.meta_key='_product_id'
                                            	AND oi_variation_id.meta_key='_variation_id'
                                            	AND oi_variation_id.meta_value!='0'
                                            	AND n.ord_category='30'
                                            	AND oim_quantity.meta_key='_qty'
                                            	AND price_item.meta_key='_line_total' 
                                            	GROUP BY oi_variation_id.meta_value,check_mt) AS `tb_qty_sale`
                                            	HAVING check_mt=1");
                                             //   echo $result_sale; exit();
          
            $rows_sale=array();
            while($row=mysqli_fetch_array($result_sale)){ 
                    array_push($rows_sale,$row);               
            }            
          
            for($i=0;$i<count($rows);$i++){
                $product_id=$rows[$i]["product_id"];
                $qty_sale=0;
                for($j=0;$j<count($rows_sale);$j++){                    
                    if($product_id==$rows_sale[$j]["item_id"]){
                        $qty_sale=$rows_sale[$j]["quantity"];
                        break;
                    }
                }
                $rows[$i]["qty_sale"]=$qty_sale;
                
            }
            
            echo json_encode($rows);
         
            common_close_connect($db);
         }
         public function sv_data_report_update_status_exp_watsons($obj){
            $db     = common_connect();            
            $status_update=$obj["status_update"];
            $list_item=$obj["list_item"];
            for($i=0;$i<count($list_item);$i++){
                $product_id=$list_item[$i]["product_id"];
                $po_id=$list_item[$i]["po_id"];
                $po_id=explode(",", $po_id);     
                $str_po_id = implode("','", $po_id);
                mysqli_query($db,"UPDATE `tb_check_exp_product` SET `status` ='$status_update' WHERE product_id='$product_id' AND po_id IN ('".$str_po_id."')");
                
            }
            common_close_connect($db);
         }
        //============== end data report watsons=====================================
         //============ Data report Preparing Order ============================================
        public function sv_data_report_preparing_order($obj){
            $db     = common_connect();
            $rows   = array();
            $sdate=$obj["start_date"];
            $edate=$obj["end_date"];
            $product_type=$obj["product_type"];
            $company=$obj["company"]; 
            $str="";
            $flag_combine="false";
            if($product_type=="0")
            {
                $str="AND sku NOT LIKE '%-R'";                
            }else if($product_type=="1"){
                $str="AND sku  LIKE '%-R'";
            }else if($product_type=="2"){
                $flag_combine="true";
                
            }
            $str_combine_actsone="";
            $str_combine_jnain="";
            $str_group_combine="";             
            if($flag_combine=="false"){                          
                $str_combine_actsone="SELECT tb_name.item_id ,tb_name.product_name ,IF(tb_total_quantity.quantity!='',tb_total_quantity.quantity,0) AS total_quantity,
                                            s.`stock_total` AS `stock_remain`,IF(b.t_incoming_qty!='',b.t_incoming_qty,0)  AS stock_incoming
                                                                          
                                        FROM
                                        	(SELECT d.`product_id` AS `item_id` ,d.`product_name` FROM `tb_stock_divide`d WHERE  product_name NOT LIKE '%combo%'  $str) tb_name";
                $str_combine_jnain="SELECT tb_name.item_id ,tb_name.product_name ,
                                    	IF(tb_total_quantity.quantity!='',tb_total_quantity.quantity,0) AS total_quantity ,
                                        s.`stock_total` AS `stock_remain` ,IF(b.t_incoming_qty!='',b.t_incoming_qty,0)  AS stock_incoming
                                                                      
                                                                      
                                    FROM
                                    	(SELECT d.`product_id` AS `item_id` ,d.`product_name` FROM `tb_stock_divide`d WHERE  product_name NOT LIKE '%combo%'  $str) tb_name";
            }else{
                $str_group_combine=" GROUP BY tb_name.product_name";
                $str_combine_actsone="SELECT tb_name.item_id ,tb_name.product_name ,
                                          SUM(IF(tb_total_quantity.quantity!='',tb_total_quantity.quantity,0)) AS total_quantity,
                                          SUM(s.`stock_total`) AS `stock_remain`,
                                          IF(b.t_incoming_qty!='',b.t_incoming_qty,0)  AS stock_incoming
                                          
                                    FROM
                                    	(SELECT `product_id` AS item_id,`product_name`	FROM `tb_stock_divide` WHERE `sku`!='' AND `sku` NOT LIKE 'BA-CB%' AND `sku` NOT LIKE 'EG-CB%' AND `sku` NOT LIKE 'EG-GF%' AND `sku` NOT LIKE 'BA-GF%' AND `sku` NOT LIKE 'HC-%'
                                    	UNION
                                    	SELECT p.id AS item_id ,CONCAT_WS(' #',p.post_title,pm.meta_value)  AS product_name 
                                    	FROM `aowp_posts` p
                                    		LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id
                                    		LEFT JOIN `aowp_postmeta` pm_sku ON p.id= pm_sku.post_id                                           
                                    	WHERE p.post_type='product_variation' 
                                    		AND pm.meta_key='attribute_pa_color' AND pm_sku.meta_key='_sku') tb_name";
                $str_combine_jnain="SELECT tb_name.item_id ,tb_name.product_name ,
                                    	SUM(IF(tb_total_quantity.quantity!='',tb_total_quantity.quantity,0)) AS total_quantity,
                                        SUM(s.`stock_total`) AS `stock_remain`,
                                        IF(b.t_incoming_qty!='',b.t_incoming_qty,0)  AS stock_incoming
                                        
                                    FROM
                                    	(SELECT `product_id` AS item_id,`product_name`	FROM `tb_stock_divide` WHERE `sku`!='' AND `sku` NOT LIKE 'HC-CB%' AND `sku` NOT LIKE 'HC-GF%' AND `sku` LIKE 'HC%') tb_name";
            }
            $str_detail_shop="";           
            if($company=="0"){
                $str_detail_shop=" /*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                                	LEFT JOIN 	
                                		(SELECT item_id,SUM(quantity) AS `quantity` 
                                			FROM(SELECT (oim_product_id.meta_value)  AS `item_id`, SUM(oim_quantity.meta_value) AS `quantity`
                                							FROM `aowp_posts` p
                                								LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id                                		
                                								LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id                                	                             		
                                								LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                                								LEFT JOIN `aowp_woocommerce_order_itemmeta` oi_variation_id ON oi_variation_id.order_item_id=oi.order_item_id 
                                								LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                							WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$sdate 00:00:00' AND '$edate 23:59:00'
                                								AND oi.order_item_type='line_item'
                                								AND oi_variation_id.meta_key='_variation_id'
                                								AND oi_variation_id.meta_value='0'
                                								AND n.ord_category IN (0,7,10,20,36,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72)
                                								AND oim_product_id.meta_key='_product_id'										
                                								AND oim_quantity.meta_key='_qty'
                                								GROUP BY oim_product_id.meta_value )AS a
                                								GROUP BY item_id) tb_total_quantity	
                                		ON tb_name.item_id=tb_total_quantity.item_id
                                        LEFT JOIN (SELECT pid,SUM(t_incoming_qty) AS t_incoming_qty  FROM `tb_incoming_stock` WHERE  in_date BETWEEN '$sdate 00:00:00' AND '$edate 23:59:00' GROUP BY pid) AS b ON tb_name.item_id=b.pid
                                LEFT JOIN `tb_stock_divide` s ON s.`product_id`=tb_name.item_id";
            }else if ($company=="1"){
                $str_detail_shop=" /*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                                	LEFT JOIN 	
                                		(SELECT item_id,SUM(quantity) AS `quantity` 
                                			FROM(SELECT (oim_product_id.meta_value)  AS `item_id`, SUM(oim_quantity.meta_value) AS `quantity`
                                							FROM `aowp_posts` p
                                								LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id                                		
                                								LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_product_id ON oim_product_id.order_item_id=oi.order_item_id                                	                             		
                                								LEFT JOIN `aowp_woocommerce_order_itemmeta` oim_quantity ON oim_quantity.order_item_id=oi.order_item_id
                                								LEFT JOIN `aowp_woocommerce_order_itemmeta` oi_variation_id ON oi_variation_id.order_item_id=oi.order_item_id 
                                								LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                							WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash' AND p.post_date BETWEEN '$sdate 00:00:00' AND '$edate 23:59:00'
                                								AND oi.order_item_type='line_item'
                                								AND oi_variation_id.meta_key='_variation_id'
                                								AND oi_variation_id.meta_value='0'
                                								AND n.ord_category IN (18,22,26,24,28,29,30,32,42,64,66,68,70)
                                								AND oim_product_id.meta_key='_product_id'										
                                								AND oim_quantity.meta_key='_qty'
                                								GROUP BY oim_product_id.meta_value  )AS a
                                								GROUP BY item_id) tb_total_quantity	
                                		ON tb_name.item_id=tb_total_quantity.item_id
                                  LEFT JOIN (SELECT pid,SUM(t_incoming_qty) AS t_incoming_qty  FROM `tb_incoming_stock` WHERE  in_date BETWEEN '$sdate 00:00:00' AND '$edate 23:59:00' GROUP BY pid) AS b ON tb_name.item_id=b.pid      
                                  LEFT JOIN `tb_stock_divide` s ON s.`product_id`=tb_name.item_id";
            }
            $query= "" ;
            if($company=="0" && $flag_combine=="true"){
                $query= $str_combine_actsone . $str_detail_shop .  $str_group_combine;
            }else if($company=="0" && $flag_combine=="false"){
                $query= $str_combine_actsone . $str_detail_shop;
            }else if($company=="1" && $flag_combine=="true"){
                $query= $str_combine_jnain . $str_detail_shop .  $str_group_combine;
            }else if($company=="1" && $flag_combine=="false"){
                $query= $str_combine_jnain . $str_detail_shop;
            }           
        //  echo($query); exit();
            $result = mysqli_query($db,$query);
              
            
            while ($row = mysqli_fetch_array($result)) {
                
                array_push($rows, $row);
                
            }  
            
              echo json_encode($rows);
              common_close_connect($db);
        }            
        //============  End Data report Preparing Order =======================================
        //============ Cancelled ========================================
        public function sv_data_report_order_cancelled($obj){
            $from_date=$obj["start_date"];
            $to_date=$obj["end_date"];
            $query="SELECT p.id,p.post_date,p.post_status,IF( n.ord_category ='0','Customer Sky007',IF(n.ord_category ='7','Wholesaler',IF(n.ord_category ='5','Marketing Sky007',IF(n.ord_category ='10','Shoppe Bbia',IF(n.ord_category ='11','Shoppe Bbia Marketing',IF(n.ord_category ='14','Lotte',IF(n.ord_category ='15','Lotte Marketing',IF(n.ord_category ='18','Eglips',IF(n.ord_category ='19','Eglips Marketing',IF(n.ord_category ='20','Lazada Bbia',IF(n.ord_category ='21','Lazada Bbia Marketing',IF(n.ord_category ='22','Eglips Wholesaler',IF(n.ord_category ='24','Shopee Eglips',IF(n.ord_category ='25','Shopee Eglips Marketing',IF(n.ord_category ='26','Lazada Eglips',IF(n.ord_category ='27','Lazada Eglips Marketing',IF(n.ord_category ='28','Robins',IF(n.ord_category ='29','Robins Marketing',IF(n.ord_category ='30','Watsons',IF(n.ord_category ='31','Watson Marketing',IF(n.ord_category ='32','Wholesale Actsone',IF(n.ord_category ='33','Wholesaler Eglips',IF(n.ord_category ='16','Sendo',IF(n.ord_category ='17','Sendo Marketing',IF(n.ord_category ='34','Beautybox',IF(n.ord_category ='35','Beautybox Marketing',IF(n.ord_category ='36','Tiki',IF(n.ord_category ='37','Tiki Marketing',IF(n.ord_category ='42','Tiki Eglips',IF(n.ord_category ='43','Tiki Eglips Marketing',IF(n.ord_category ='44','Sociolla',IF(n.ord_category ='45','Sociolla Marketing',IF(n.ord_category ='46','Bbiavn',IF(n.ord_category ='47','Bbiavn Marketing',IF(n.ord_category ='48','Mixsoon',IF(n.ord_category ='49','Mixsoon Marketing',IF(n.ord_category ='50','Guardian',IF(n.ord_category ='51','Guardian Marketing',IF(n.ord_category ='52','Shopee Mixsoon',IF(n.ord_category ='53','Shopee mixsoon Marketing',IF(n.ord_category ='54','Lazada Mixsoon',
            IF(n.ord_category ='55','Lazada Mixsoon Marketing',IF(n.ord_category ='58','Tiktok',IF(n.ord_category ='59','Tiktok Marketing',IF(n.ord_category ='60','Tiktok Mixsoon',IF(n.ord_category ='64','Hince website',IF(n.ord_category ='66','Hince Shopee',IF(n.ord_category ='68','Hince Lazada',IF(n.ord_category ='70','Tiktok Hince','Undefine Order !'))))))))))))))))))))))))))))))))))))))))))))))))) AS cs_type,n.reason_cancel,CONCAT_WS(' ',pm_fname.meta_value,pm_lname.meta_value) AS `name` ,pm_phone.meta_value AS `phone`,pm_address.meta_value AS `address` ,pm_total_order.meta_value AS total_price,n.mg_cancel,n.time_cancel
                    FROM `aowp_posts` p
                     LEFT JOIN tb_ord_note n ON p.id=n.order_id 
                     LEFT JOIN  aowp_postmeta pm_fname ON p.id=pm_fname.post_id
                     LEFT JOIN  aowp_postmeta pm_lname ON p.id=pm_lname.post_id
                     LEFT JOIN  aowp_postmeta pm_phone ON p.id=pm_phone.post_id
                     LEFT JOIN  aowp_postmeta pm_address ON p.id=pm_address.post_id
                     LEFT JOIN  aowp_postmeta pm_total_order ON p.id=pm_total_order.post_id
                    WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' AND p.post_date BETWEEN '$from_date 00:00:00' AND '$to_date 23:59:59' 
                    	AND pm_fname.meta_key='_billing_first_name'
                    	AND pm_lname.meta_key='_billing_last_name'   
                    	AND pm_phone.meta_key='_billing_phone'       
                    	AND pm_address.meta_key='_billing_address_1'   
                    	AND pm_total_order.meta_key='_order_total'"  ;
            $db     = common_connect();
            $rows   = array();
            $result = mysqli_query($db,$query);           
            
            while ($row = mysqli_fetch_array($result)) {
                
                array_push($rows, $row);
                
            }   
            $query_customer_cancelled="SELECT n.user_id,IF(n.ord_category='0','Customer',IF( n.ord_category ='0','Customer Sky007',IF(n.ord_category ='7','Wholesaler',IF(n.ord_category ='5','Marketing Sky007',IF(n.ord_category ='10','Shoppe Bbia',IF(n.ord_category ='11','Shoppe Bbia Marketing',IF(n.ord_category ='14','Lotte',IF(n.ord_category ='15','Lotte Marketing',IF(n.ord_category ='18','Eglips',IF(n.ord_category ='19','Eglips Marketing',IF(n.ord_category ='20','Lazada Bbia',IF(n.ord_category ='21','Lazada Bbia Marketing',IF(n.ord_category ='22','Eglips Wholesaler',IF(n.ord_category ='24','Shopee Eglips',IF(n.ord_category ='25','Shopee Eglips Marketing',IF(n.ord_category ='26','Lazada Eglips',IF(n.ord_category ='27','Lazada Eglips Marketing',IF(n.ord_category ='28','Robins',IF(n.ord_category ='29','Robins Marketing',IF(n.ord_category ='30','Watsons',IF(n.ord_category ='31','Watson Marketing',IF(n.ord_category ='32','Wholesale Actsone',IF(n.ord_category ='33','Wholesaler Eglips',IF(n.ord_category ='16','Sendo',IF(n.ord_category ='17','Sendo Marketing',IF(n.ord_category ='34','Beautybox',IF(n.ord_category ='35','Beauty Marketing',IF(n.ord_category ='36','Tiki',IF(n.ord_category ='37','Tiki Marketing',IF(n.ord_category ='42','Tiki Eglips',IF(n.ord_category ='43','Tiki Eglips Marketing',IF(n.ord_category ='44','Sociolla',IF(n.ord_category ='45','Sociolla Marketing',IF(n.ord_category ='46','Bbiavn',IF(n.ord_category ='47','Bbiavn Marketing',IF(n.ord_category ='48','Mixsoon',IF(n.ord_category ='49','Mixsoon Marketing',IF(n.ord_category ='50','Guardian',IF(n.ord_category ='51','Guardian Marketing',IF(n.ord_category ='52','Shopee Mixsoon',IF(n.ord_category ='53','Shopee Mixsoon Marketing',IF(n.ord_category ='54','Lazada Mixsoon',
            IF(n.ord_category ='55','Lazada Mixsoon Marketing',IF(n.ord_category ='58','Tiktok',IF(n.ord_category ='59','Tiktok Marketing','Undefine Order !'))))))))))))))))))))))))))))))))))))))))))))) AS cs_type,CONCAT_WS(' ',pm_fname.meta_value,pm_lname.meta_value) AS `name` ,pm_phone.meta_value AS `phone`,pm_address.meta_value AS `address` , SUM(pm_total_order.meta_value) AS total_price,COUNT(n.user_id) AS time_cancel
                    FROM `aowp_posts` p
                     LEFT JOIN tb_ord_note n ON p.id=n.order_id 
                     LEFT JOIN  aowp_postmeta pm_fname ON p.id=pm_fname.post_id
                     LEFT JOIN  aowp_postmeta pm_lname ON p.id=pm_lname.post_id
                     LEFT JOIN  aowp_postmeta pm_phone ON p.id=pm_phone.post_id
                     LEFT JOIN  aowp_postmeta pm_address ON p.id=pm_address.post_id
                     LEFT JOIN  aowp_postmeta pm_total_order ON p.id=pm_total_order.post_id
                    
                    WHERE p.post_status ='wc-cancelled' AND p.post_type='shop_order' AND p.post_date BETWEEN '$from_date 00:00:00' AND '$to_date 23:59:59' 
                    	AND pm_fname.meta_key='_billing_first_name'
                    	AND pm_lname.meta_key='_billing_last_name'   
                    	AND pm_phone.meta_key='_billing_phone'       
                    	AND pm_address.meta_key='_billing_address_1'   
                    	AND pm_total_order.meta_key='_order_total'
                    
                    GROUP BY n.user_id";
          $rows_customer_cancelled   = array();
            $result = mysqli_query($db,$query_customer_cancelled);           
            
            while ($row = mysqli_fetch_array($result)) {
                
                array_push($rows_customer_cancelled, $row);
                
            }
            $obj_array=["list_order_cancelled"=>$rows,"list_customer_cancelled"=>$rows_customer_cancelled]  ;      
            echo json_encode($obj_array);
            common_close_connect($db);
        }
        //============ End Cancelled ====================================
        
        //============ Order Membership =================================
        public function sv_data_report_order_membership($obj){
            $from_date=$obj["start_date"];
            $to_date=$obj["end_date"];
            $membership=$obj["membership"];  
            $str_condition="";   
            if($membership==0){
                $str_condition="HAVING roles  IN('New Member','General','Bronze','Silver','Gold','VIP')";
            }else if($membership==1){
                $str_condition="HAVING roles ='New Member'";
            }else if($membership==2){
                $str_condition="HAVING roles ='General'";
            }else if($membership==3){
                $str_condition="HAVING roles ='Bronze'";
            }else if($membership==4){
                $str_condition="HAVING roles ='Silver'";
            }else if($membership==5){
                $str_condition="HAVING roles ='Gold'";
            }else if($membership==6){
                $str_condition="HAVING roles ='VIP'";
            }      
            $query="SELECT n.`user_id` ,u.display_name AS `name`,u.user_email AS `email`,um_phone.meta_value AS `phone`,um_address.meta_value AS `address`,COUNT(n.`order_id`)AS `quantity_order`,SUM(summary.quantity) AS quantity_item, SUM(summary.total_price) AS total_price,
            		IF(um_roles.meta_value LIKE '%newmember%','New Member',IF(um_roles.meta_value LIKE '%general%','General',IF(um_roles.meta_value LIKE '%bronze%','Bronze',IF(um_roles.meta_value LIKE '%sliver%','Silver',IF(um_roles.meta_value LIKE '%gold%','Gold',IF(um_roles.meta_value LIKE '%platinum%','VIP','Customer')))))) AS roles 
                                 FROM `tb_ord_note`  AS n 
                                	LEFT JOIN `aowp_posts` p ON p.id=n.order_id
                                	LEFT JOIN `aowp_users` u ON n.user_id=u.id
                                	LEFT JOIN `aowp_usermeta` um_roles ON n.user_id=um_roles.user_id   
                                	LEFT JOIN `aowp_usermeta` um_phone ON n.user_id=um_phone.user_id
                                	LEFT JOIN `aowp_usermeta` um_address ON n.user_id=um_address.user_id
                                	LEFT JOIN (SELECT 	oi.order_id,SUM(oim_qty.meta_value) AS `quantity`, SUM(oim_price.meta_value) AS `total_price`
                                			FROM aowp_woocommerce_order_items AS oi
                                				LEFT JOIN aowp_woocommerce_order_itemmeta AS oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                				LEFT JOIN aowp_woocommerce_order_itemmeta AS oim_price ON oi.order_item_id=oim_price.order_item_id	
                                			WHERE oi.order_item_type='line_item'
                                				AND oim_qty.meta_key='_qty'
                                				AND oim_price.meta_key='_line_total'				
                                			GROUP BY oi.order_id) AS summary ON  n.`order_id`=summary.order_id
                                 WHERE n.`ord_category`= '0' AND p.post_status !='trash' AND p.post_status !='wc-cancelled' AND p.post_type='shop_order' 
                                	AND  p.post_date BETWEEN '$from_date 00:00:00' AND '$to_date 23:59:59'	  
                                	AND  um_phone.meta_key='billing_phone'
                                	AND  um_address.meta_key='billing_address_1'
                                	AND um_roles.meta_key='aowp_capabilities'
                                GROUP BY n.user_id
                                $str_condition"  ;
            $db     = common_connect();
            $rows   = array();
            $result = mysqli_query($db,$query);           
            
            while ($row = mysqli_fetch_array($result)) {
                
                array_push($rows, $row);
                
            }        
            echo json_encode($rows);
            common_close_connect($db);
        }
        //============ End Order Membership ==============================
        //============ coupon report ======================================
        public function sv_data_report_coupon_list(){
            $db=common_connect(); 
            $result=mysqli_query($db,"SELECT p.post_title ,p.post_date AS create_date,pm.meta_value AS `expiry_date`,p.post_status 
                                    FROM aowp_posts p 
                                    	LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id
                                    WHERE p.post_type='shop_coupon' AND pm.meta_key='expiry_date'");       
            $rows=array();                                            
            while($row=mysqli_fetch_array($result)){            
             array_push($rows,$row);
            }
            echo json_encode($rows); 
            common_close_connect($db);
        }
        public function sv_data_report_coupon_detail($coupon_id){
            $db=common_connect();  
            if($coupon_id==""){
                $coupon_id="00";
            }
            $list_item="";
            $check_item_limit= mysqli_query($db,"SELECT pm.meta_value `list_product_id` FROM aowp_posts p LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id WHERE p.post_title='$coupon_id' AND pm.meta_key='product_ids'");
            while($row=mysqli_fetch_array($check_item_limit)){ 
                   $list_item=$row["list_product_id"] ;          
            }      
            if(strlen($list_item)==0){          
                $result=mysqli_query($db,"SELECT p.id AS order_id ,oi_name.order_item_name AS `product_name`,oim_quantity.meta_value AS `quantity` ,oim_sale_price.meta_value AS sale_price,p.post_date,p.post_status
                                          FROM aowp_posts p
                                            	 LEFT JOIN aowp_woocommerce_order_items oi_name ON p.id=oi_name.order_id
                                            	 LEFT JOIN aowp_woocommerce_order_itemmeta oim_sale_price ON oi_name.order_item_id=oim_sale_price.order_item_id
                                            	 LEFT JOIN aowp_woocommerce_order_itemmeta oim_quantity ON oi_name.order_item_id=oim_quantity.order_item_id
                                            	 LEFT JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                          WHERE  oi.order_item_name ='$coupon_id' AND oi_name.order_item_type='line_item'
                                            	AND oim_sale_price.meta_key='_line_total' AND oim_quantity.meta_key='_qty'");
                
               $rows=array();
                while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
                }
                $result_count=mysqli_query($db,"SELECT a.total_order,IF(b.quantity IS NULL,0,b.quantity)AS quantity,c.total_complete,d.total_cancel
                                            	FROM (SELECT COUNT(order_item_id) AS total_order FROM `aowp_woocommerce_order_items` WHERE order_item_name='$coupon_id') AS a
                                            		,(SELECT SUM(oim_quantity.meta_value) AS `quantity` 
                                                                              FROM aowp_posts p   
                                                                                	 LEFT JOIN aowp_woocommerce_order_items oi_name ON p.id=oi_name.order_id
                                                                                	 LEFT JOIN aowp_woocommerce_order_itemmeta oim_sale_price ON oi_name.order_item_id=oim_sale_price.order_item_id
                                                                                	  LEFT JOIN aowp_woocommerce_order_itemmeta oim_quantity ON oi_name.order_item_id=oim_quantity.order_item_id
                                                                                	 LEFT JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                                                              WHERE  oi.order_item_name ='$coupon_id' AND oi_name.order_item_type='line_item'
                                                                                	AND oim_sale_price.meta_key='_line_total' AND oim_quantity.meta_key='_qty') b 
                                                            , (SELECT COUNT(order_item_id) AS total_complete FROM `aowp_woocommerce_order_items` LEFT JOIN aowp_posts p ON p.id=aowp_woocommerce_order_items.order_id WHERE order_item_name='$coupon_id' AND p.post_status='wc-completed') c
                                            		,(SELECT COUNT(order_item_id) AS total_cancel FROM `aowp_woocommerce_order_items` LEFT JOIN aowp_posts p ON p.id=aowp_woocommerce_order_items.order_id WHERE order_item_name='$coupon_id' AND p.post_status='wc-cancelled') d");
               
               $rows_count=array();
                while($row=mysqli_fetch_array($result_count)){ 
                    array_push($rows_count,$row);               
                }
                $arr_data=array("infor_order"=>$rows,"item_count"=>$rows_count);
                echo json_encode($arr_data); 
            }else{           
                 $result=mysqli_query($db,"SELECT p.id AS order_id ,oi_name.order_item_name AS `product_name`,oim_quantity.meta_value AS `quantity` ,oim_sale_price.meta_value AS sale_price,p.post_date,p.post_status
                                          FROM aowp_posts p
                                            	 LEFT JOIN aowp_woocommerce_order_items oi_name ON p.id=oi_name.order_id
                                            	 LEFT JOIN aowp_woocommerce_order_itemmeta oim_sale_price ON oi_name.order_item_id=oim_sale_price.order_item_id
                                            	 LEFT JOIN aowp_woocommerce_order_itemmeta oim_quantity ON oi_name.order_item_id=oim_quantity.order_item_id
                                                 LEFT JOIN aowp_woocommerce_order_itemmeta oim_product_id ON oi_name.order_item_id=oim_product_id.order_item_id
                                            	 LEFT JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                          WHERE  oi.order_item_name ='$coupon_id' AND oi_name.order_item_type='line_item'
                                            	AND oim_sale_price.meta_key='_line_total' AND oim_quantity.meta_key='_qty'
                                                AND oim_product_id.meta_key='_product_id'
                                                AND oim_product_id.meta_value in($list_item)");
                
               $rows=array();
                while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
                }
                $result_count=mysqli_query($db,"SELECT a.total_order,IF(b.quantity IS NULL,0,b.quantity)AS quantity,c.total_complete,d.total_cancel
                                            	FROM (SELECT COUNT(order_item_id) AS total_order FROM `aowp_woocommerce_order_items` WHERE order_item_name='$coupon_id') AS a
                                            		,(SELECT SUM(oim_quantity.meta_value) AS `quantity` 
                                                                              FROM aowp_posts p   
                                                                                	 LEFT JOIN aowp_woocommerce_order_items oi_name ON p.id=oi_name.order_id
                                                                                	 LEFT JOIN aowp_woocommerce_order_itemmeta oim_sale_price ON oi_name.order_item_id=oim_sale_price.order_item_id
                                                                                     LEFT JOIN aowp_woocommerce_order_itemmeta oim_quantity ON oi_name.order_item_id=oim_quantity.order_item_id
                                                                                     LEFT JOIN aowp_woocommerce_order_itemmeta oim_product_id ON oi_name.order_item_id=oim_product_id.order_item_id
                                                                                	 LEFT JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                                                              WHERE  oi.order_item_name ='$coupon_id' AND oi_name.order_item_type='line_item'
                                                                                	AND oim_sale_price.meta_key='_line_total' AND oim_quantity.meta_key='_qty'
                                                                                    AND oim_product_id.meta_key='_product_id'
                                                                                    AND oim_product_id.meta_value in($list_item)) b 
                                                            , (SELECT COUNT(order_item_id) AS total_complete FROM `aowp_woocommerce_order_items` LEFT JOIN aowp_posts p ON p.id=aowp_woocommerce_order_items.order_id WHERE order_item_name='$coupon_id' AND p.post_status='wc-completed') c
                                            		,(SELECT COUNT(order_item_id) AS total_cancel FROM `aowp_woocommerce_order_items` LEFT JOIN aowp_posts p ON p.id=aowp_woocommerce_order_items.order_id WHERE order_item_name='$coupon_id' AND p.post_status='wc-cancelled') d");
               
               $rows_count=array();
                while($row=mysqli_fetch_array($result_count)){ 
                    array_push($rows_count,$row);               
                }
                $arr_data=array("infor_order"=>$rows,"item_count"=>$rows_count);
                echo json_encode($arr_data);
            }
                
            common_close_connect($db);
        }
        //============ End coupon report ==================================
    //============= End Data Report =====================================================================================
    //============= Customer Management =================================================================================
        //============ Customer =========================================
        public function sv_customer_management_customer($obj){
            $qty_item=$obj["qty_item"];
            $total_price=$obj["total_price"];
            $qty_order=$obj["qty_order"];
            $from_date=$obj["start_date"];
            $to_date=$obj["end_date"];  
            $shopsale=$obj["shopsale"];
            $query=" SELECT n.`user_id` ,u.display_name AS `name`,u.user_email AS `email`,um_phone.meta_value AS `phone`,um_address.meta_value AS `address`,COUNT(n.`order_id`)AS `quantity_order`,SUM(summary.quantity) AS quantity_item, SUM(summary.total_price) AS total_price
                     FROM `tb_ord_note`  AS n 
                    	LEFT JOIN `aowp_posts` p ON p.id=n.order_id
                    	LEFT JOIN `aowp_users` u ON n.user_id=u.id
                    	LEFT JOIN `aowp_usermeta` um_phone ON n.user_id=um_phone.user_id
                    	LEFT JOIN `aowp_usermeta` um_address ON n.user_id=um_address.user_id
                    	LEFT JOIN (SELECT 	oi.order_id,SUM(oim_qty.meta_value) AS `quantity`, SUM(oim_price.meta_value) AS `total_price`
                    			FROM aowp_woocommerce_order_items AS oi
                    				LEFT JOIN aowp_woocommerce_order_itemmeta AS oim_qty ON oi.order_item_id=oim_qty.order_item_id
                    				LEFT JOIN aowp_woocommerce_order_itemmeta AS oim_price ON oi.order_item_id=oim_price.order_item_id	
                    			WHERE oi.order_item_type='line_item'
                    				AND oim_qty.meta_key='_qty'
                    				AND oim_price.meta_key='_line_total'				
                    			GROUP BY oi.order_id) AS summary ON  n.`order_id`=summary.order_id
                     WHERE n.`ord_category`= '$shopsale' AND p.post_status !='trash' AND p.post_status !='wc-cancelled' AND p.post_type='shop_order' 
                    	AND  p.post_date BETWEEN '$from_date 00:00:00' AND '$to_date 23:59:59'
                    	AND  um_phone.meta_key='billing_phone'
                    	AND  um_address.meta_key='shipping_address_1'
                    GROUP BY n.user_id
                    HAVING 	quantity_item >='$qty_item' AND  quantity_order>='$qty_order' AND total_price >='$total_price'"  ;
            $db     = common_connect();
            $rows   = array();
            $result = mysqli_query($db,$query);           
            
            while ($row = mysqli_fetch_array($result)) {
                
                array_push($rows, $row);
                
            }        
            echo json_encode($rows);
            common_close_connect($db);
         }
         public function sv_customer_management_customer_detail($obj){
            $db=common_connect();          
            $user_id=$obj["user_id"];
            $result=mysqli_query($db,"SELECT p.id AS `order_id`,
                                    	p.post_date AS `create_time`,
                                    	GROUP_CONCAT(CONCAT_WS(' -> ',oi.order_item_name,oim.meta_value)) AS item,
                                    	FORMAT(pm_total_price.meta_value,0) AS `total_price`	
                                    FROM `aowp_posts` p
                                    	LEFT JOIN aowp_postmeta AS pm_user_id ON pm_user_id.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm_total_price ON pm_total_price.post_id=p.ID
                                    	LEFT JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                    	LEFT JOIN aowp_woocommerce_order_itemmeta oim ON oi.order_item_id=oim.order_item_id
                                    
                                    WHERE  p.post_status !='trash' AND p.post_status !='wc-cancelled' AND p.post_type='shop_order'                                     
                                    	AND pm_user_id.meta_key='_customer_user' AND pm_user_id.meta_value='$user_id'
                                    	AND pm_total_price.meta_key='_order_total'
                                    	AND oi.order_item_type='line_item'
                                    	AND oim.meta_key='_qty'
                                    GROUP BY p.id");       
            $rows=array();                                            
            while($row=mysqli_fetch_array($result)){            
             array_push($rows,$row);
            }
            echo json_encode($rows); 
            common_close_connect($db);
         }
        //============ End Customer =====================================
        //============ History Order ====================================
         public function sv_customer_management_history_order($obj){
            $from_date=$obj["start_date"];
            $to_date=$obj["end_date"];
            $query="SELECT CONCAT( pm_first_name.meta_value,' ', pm_last_name.meta_value) AS `name`,
                                	pm_phone.meta_value AS `phone`,
                                	pm_address.meta_value AS `address`,
                                	COUNT(pm_user_id.meta_value) AS `qty` ,
                                	pm_user_id.meta_value AS user_id
                                FROM `aowp_posts` p
                                	LEFT JOIN aowp_postmeta AS pm_address ON pm_address.post_id=p.ID
                                	LEFT JOIN aowp_postmeta AS pm_phone ON pm_phone.post_id=p.ID
                                	LEFT JOIN aowp_postmeta AS pm_first_name ON pm_first_name.post_id=p.ID
                                	LEFT JOIN aowp_postmeta AS pm_last_name ON pm_last_name.post_id=p.ID
                                	LEFT JOIN aowp_postmeta AS pm_user_id ON pm_user_id.post_id=p.ID
                                WHERE p.post_status !='trash' AND p.post_status !='wc-cancelled' AND p.post_type='shop_order' 
                                	AND p.post_date BETWEEN '$from_date 00:00:00' AND '$to_date 23:59:59'
                                	AND pm_address.meta_key='_billing_address_1' 
                                	AND pm_phone.meta_key='_billing_phone' 
                                	AND pm_first_name.meta_key='_billing_first_name' 
                                	AND pm_last_name.meta_key=_billing_last_name' 
                                	AND pm_user_id.meta_key='_customer_user' AND pm_user_id.meta_value!='0'
                                GROUP BY pm_user_id.meta_value"  ;
            $db     = common_connect();
            $rows   = array();
            $result = mysqli_query($db,$query);           
            
            while ($row = mysqli_fetch_array($result)) {
                
                array_push($rows, $row);
                
            }        
            echo json_encode($rows);
            common_close_connect($db);
         }
         public function sv_customer_management_history_order_detail($obj){
            $db=common_connect();
            $from_date=$obj["start_date"];
            $to_date=$obj["end_date"];
            $user_id=$obj["user_id"];
            $result=mysqli_query($db,"SELECT p.id AS `order_id`,
                                    	p.post_date AS `create_time`,
                                    	GROUP_CONCAT(CONCAT_WS(' -> ',oi.order_item_name,oim.meta_value)) AS item,
                                    	FORMAT(pm_total_price.meta_value,0) AS `total_price`	
                                    FROM `aowp_posts` p
                                    	LEFT JOIN aowp_postmeta AS pm_user_id ON pm_user_id.post_id=p.ID
                                    	LEFT JOIN aowp_postmeta AS pm_total_price ON pm_total_price.post_id=p.ID
                                    	LEFT JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                    	LEFT JOIN aowp_woocommerce_order_itemmeta oim ON oi.order_item_id=oim.order_item_id
                                    
                                    WHERE  p.post_status !='trash' AND p.post_status !='wc-cancelled' AND p.post_type='shop_order' 
                                    	AND p.post_date BETWEEN '$from_date 00:00:00' AND '$to_date 23:59:59'
                                    	AND pm_user_id.meta_key='_customer_user' AND pm_user_id.meta_value='$user_id'
                                    	AND pm_total_price.meta_key='_order_total'
                                    	AND oi.order_item_type='line_item'
                                    	AND oim.meta_key='_qty'
                                    GROUP BY p.id");       
            $rows=array();                                            
            while($row=mysqli_fetch_array($result)){            
             array_push($rows,$row);
            }
            echo json_encode($rows); 
            common_close_connect($db);
         }
        //============ End History Order ================================   
    //============= End Customer Management =============================================================================
    //============= Order Management ====================================================================================
        //============ update Order =====================================
        public function sv_order_management_update_order($obj){            
            $from_date=$obj["start_date"];
            $to_date=$obj["end_date"];
            $shopType=$obj["shop_sale"];   
            $warehouse=$obj["warehouse"];        
            $str="";
        $strwarehouse="AND  n.warehouse= $warehouse";
        if($shopType=="1"){
            $str="AND  n.ord_category IN (0,5)";
        }else if($shopType=="2"){
            $str="AND  n.ord_category ='7'";
        }else if($shopType=="3"){
            $str="AND  n.ord_category IN (10,11)";
        }else if($shopType=="4"){
            $str="AND  n.ord_category IN (14,15)";
        }else if($shopType=="5"){
            $str="AND  n.ord_category IN (19,18)";
        }else if($shopType=="6"){
           $str="AND  n.ord_category IN (20,21)"; 
        }else if($shopType=="7"){
           $str="AND  n.ord_category IN (24,25)"; 
        } else if($shopType=="8"){
           $str="AND  n.ord_category IN (26,27)"; 
        } else if($shopType=="9"){
           $str="AND  n.ord_category IN (28,29)"; 
        } else if($shopType=="10"){
           $str="AND  n.ord_category IN (30,31)"; 
        } else if($shopType=="11"){
           $str="AND  n.ord_category ='32'"; 
        } else if($shopType=="12"){
           $str="AND  n.ord_category ='33'"; 
        } else if($shopType=="13"){
           $str="AND  n.ord_category IN (16,17)"; 
        }else if($shopType=="14"){
           $str="AND  n.ord_category IN (34,35)"; 
        } else if($shopType=="15"){
           $str="AND  n.ord_category IN (36,37)"; 
        } else if($shopType=="16"){
           $str="AND  n.ord_category IN (38,39)"; 
        } else if($shopType=="17"){
           $str="AND  n.ord_category IN (40,41)"; 
        } else if($shopType=="18"){
           $str="AND  n.ord_category IN (42,43)"; 
        } else if($shopType=="19"){
           $str="AND  n.ord_category IN (22)"; 
        } else if($shopType=="20"){
           $str="AND  n.ord_category IN (44,45)"; 
        } else if($shopType=="21"){
           $str="AND  n.ord_category IN (46,47)"; 
        } else if($shopType=="22"){
           $str="AND  n.ord_category IN (48,49)"; 
        } else if($shopType=="23"){
           $str="AND  n.ord_category IN (50,51)"; 
        } else if($shopType=="24"){
           $str="AND  n.ord_category IN (52,53)"; 
        } else if($shopType=="25"){
           $str="AND  n.ord_category IN (54,55)"; 
        } else if($shopType=="26"){
           $str="AND  n.ord_category IN (58,59)"; 
        } 
            
            $query="SELECT p.id,
                  CONCAT_WS(' ',pm_first_name.meta_value,pm_last_name.meta_value) AS `name`,
                  pm_address.meta_value AS `address`, 
                  IF( n.ord_category ='0','Customer Sky007',IF(n.ord_category ='7','Wholesaler',IF(n.ord_category ='5','Marketing Sky007',IF(n.ord_category ='10','Shoppe Bbia',IF(n.ord_category ='11','Shoppe Bbia Marketing',IF(n.ord_category ='14','Lotte',IF(n.ord_category ='15','Lotte Marketing',IF(n.ord_category ='18','Eglips',IF(n.ord_category ='19','Eglips Marketing',IF(n.ord_category ='20','Lazada Bbia',IF(n.ord_category ='21','Lazada Bbia Marketing',IF(n.ord_category ='22','Eglips Wholesaler',IF(n.ord_category ='24','Shopee Eglips',IF(n.ord_category ='25','Shopee Eglips Marketing',IF(n.ord_category ='26','Lazada Eglips',IF(n.ord_category ='27','Lazada Eglips Marketing',IF(n.ord_category ='28','Robins',IF(n.ord_category ='29','Robins Marketing',IF(n.ord_category ='30','Watsons',IF(n.ord_category ='31','Watson Marketing',IF(n.ord_category ='32','Wholesale Actsone',IF(n.ord_category ='33','Wholesaler Eglips',IF(n.ord_category ='16','Sendo',IF(n.ord_category ='17','Sendo Marketing',IF(n.ord_category ='34','Beautybox',IF(n.ord_category ='35','Beautybox Marketing',IF(n.ord_category ='36','Tiki',IF(n.ord_category ='37','Tiki Marketing',IF(n.ord_category ='38','Shopee C2C',IF(n.ord_category ='39','Shopee C2C Marketing',IF(n.ord_category ='40','Lazada C2C',IF(n.ord_category ='41','Lazada C2C Marketing',IF(n.ord_category ='42','Tiki Eglips',IF(n.ord_category ='43','Tiki Eglips Marketing',IF(n.ord_category ='44','Sociolla',IF(n.ord_category ='45','Sociolla Marketing',IF(n.ord_category ='46','Bbiavn',IF(n.ord_category ='47','Bbiavn Marketing',IF(n.ord_category ='48','Mixsoon',IF(n.ord_category ='49','Mixsoon Marketing',IF(n.ord_category ='50','Guardian',IF(n.ord_category ='51','Guardian Marketing',IF(n.ord_category ='52','Shopee Mixsoon',IF(n.ord_category ='53','Shopee Mixsoon Marketing',IF(n.ord_category ='54','Lazada Mixsoon',
                  IF(n.ord_category ='55','Lazada Mixsoon Marketing',IF(n.ord_category ='58','Tiktok',IF(n.ord_category ='59','Tiktok Marketing',IF(n.ord_category ='60','Tiktok Mixsoon',IF(n.ord_category ='62','Watsons Bbia',
                  IF(n.ord_category ='63','Watsons Bbia Marketing',IF(n.ord_category ='64','Hince Website',IF(n.ord_category ='65','Hince Website Marketing',IF(n.ord_category ='66','Hince Shopee',IF(n.ord_category ='67','Hince Shopee Marketing',IF(n.ord_category ='68','Hince Lazada',IF(n.ord_category ='69','Hince Lazada Marketing',IF(n.ord_category ='70','Hince Tiktok',IF(n.ord_category ='71','Hince Tiktok Marketing','Undefined !'))))))))))))))))))))))))))))))))))))))))))))))))))))))))))) AS `type`,
                  n.`shop_order_id` , n.`shop_delivery_id`,                  
                  pm_phone.meta_value AS `phone`,
                  p.post_date AS `order_date`, 
                  p.post_status ,
                  FORMAT(pm_total_order.meta_value,0) AS total_order
                  FROM `aowp_posts` p  
                	LEFT JOIN `aowp_postmeta` pm_first_name ON pm_first_name.post_id=p.id
                	LEFT JOIN `aowp_postmeta` pm_last_name ON pm_last_name.post_id=p.id
                	LEFT JOIN `aowp_postmeta` pm_phone ON pm_phone.post_id=p.id
                	LEFT JOIN `aowp_postmeta` pm_address ON pm_address.post_id=p.id
                	LEFT JOIN `aowp_postmeta` pm_total_order ON pm_total_order.post_id=p.id
                    LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                WHERE  p.post_type='shop_order' 
                	AND pm_first_name.meta_key='_billing_first_name' AND pm_last_name.meta_key='_billing_last_name'
                	AND pm_address.meta_key='_billing_address_1'
                	AND pm_phone.meta_key='_billing_phone'
                	AND p.post_date>'$from_date 00:00:00' AND  p.post_date<'$to_date 23:59:59'	
                	AND pm_total_order.meta_key='_order_total'
                    $str
                	$strwarehouse";
              //  echo $query; exit();
            $db=common_connect();
            $rows=array();       
            $result=mysqli_query($db,$query)   ;                                  
            while($row=mysqli_fetch_array($result)){            
             array_push($rows,$row);
            }
            echo json_encode($rows); 
            common_close_connect($db);
        } 
        
        public function sv_order_management_update_order_cancelled($obj){
          
            $order_id=$obj["order_id"];
            $name_manager=$obj["mg_name"];
            $note_cancel=$obj["note"];
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s");
          
            $db=common_connect();                 
            $db_bbia=common_connect_bbia();
            $db_sky007vn=common_connect_sky007();
            $db_mixsoon=common_connect_mixsoon();
            $db_eglips=common_connect_eglips();            
            $db_wholesaler=common_connect_wholesaler();   
            $db_hince=common_connect_hince()  ;

           
            $customer_type="";     
           
            $result_strShop=mysqli_query($db,"SELECT `ord_category` FROM `tb_ord_note` WHERE `order_id`='$order_id'");
            $count_check_exist=mysqli_num_rows($result_strShop);
           
            if($count_check_exist=="0"){
                 echo("false");
                 exit(1);
            }
            
            while($row_strShop=mysqli_fetch_array($result_strShop)){ 
                        $customer_type=$row_strShop["ord_category"];
            }
            
            
              if($customer_type=="5" || $customer_type=="0" )
              {
                $customer_type="_web";          
              }else if($customer_type=="10"|| $customer_type=="11" || $customer_type=="52"|| $customer_type=="53" || $customer_type=="66"|| $customer_type=="67"){
                $customer_type="_shopee";
              }else if($customer_type=="7" || $customer_type=="50" || $customer_type=="51" || $customer_type=="44"|| $customer_type=="45"){
                $customer_type="_wholesaler";
              }else if($customer_type=="18"|| $customer_type=="19"|| $customer_type=="22" || $customer_type=="32"){
                $customer_type="_eglips";
              }else if($customer_type=="20"|| $customer_type=="21" || $customer_type=="54"|| $customer_type=="55" || $customer_type=="68"|| $customer_type=="69"){
                $customer_type="_lazada";
              }else if($customer_type=="25"|| $customer_type=="24"){
                $customer_type="_shopee_eglips";
              }else if($customer_type=="26"|| $customer_type=="27"){
                $customer_type="_lazada_eglips";
              }else if($customer_type=="30"|| $customer_type=="31"){
                $customer_type="_watsons";
              }else if($customer_type=="36"|| $customer_type=="37" || $customer_type=="56"|| $customer_type=="57"){
                $customer_type="_tiki";
              }else if($customer_type=="42"|| $customer_type=="43"){
                $customer_type="_tiki_eglips";
              }else if($customer_type=="46"|| $customer_type=="47"){
                $customer_type="_bbiavn";
              }else if($customer_type=="48"|| $customer_type=="49"){
                $customer_type="_mixsoon_web";
              }else if($customer_type=="58"|| $customer_type=="59"){
                $customer_type="_tiktok";
              }else if($customer_type=="60"|| $customer_type=="61"){
                $customer_type="_tiktok_mixsoon";
              }else if($customer_type=="64"|| $customer_type=="65"){
                $customer_type="_hince_web";
              }else if($customer_type=="70"|| $customer_type=="71"){
                $customer_type="_tiktok_hince";
              }
            
            $result_check_order_id_trash=mysqli_query($db,"SELECT p.post_status AS `status` FROM `aowp_posts` p WHERE p.id='$order_id'");
            while($row_check_order_id_trash=mysqli_fetch_array($result_check_order_id_trash)){
                $status_order=$row_check_order_id_trash["status"];
                if($status_order=="trash" || $status_order=="wc-cancelled" || $status_order=="wc-completed"){
                    echo("false");
                    exit(1);
                }
            }        
            $reslut_get_item_id=mysqli_query($db,"SELECT IF(oim_variation_id.meta_value='0', oim_item_id.meta_value,oim_variation_id.meta_value) AS `item_id`,oim_item_quantity.meta_value AS `quantity`,n.warehouse
                                                    FROM aowp_woocommerce_order_items oi
                                                    	LEFT JOIN aowp_woocommerce_order_itemmeta oim_item_id ON oi.order_item_id=oim_item_id.order_item_id
                                                    	LEFT JOIN aowp_woocommerce_order_itemmeta oim_variation_id ON oi.order_item_id=oim_variation_id.order_item_id 
                                                    	LEFT JOIN aowp_woocommerce_order_itemmeta oim_item_quantity ON oi.order_item_id=oim_item_quantity.order_item_id
                                                        LEFT JOIN tb_ord_note n ON oi.order_id=n.order_id
                                                    WHERE oi.order_item_type='line_item' 
                                                    	AND oim_item_id.meta_key='_product_id'
                                                    	AND oim_variation_id.meta_key='_variation_id'	
                                                    	AND oim_item_quantity.meta_key='_qty'
                                                    	AND oi.order_id='$order_id'");
             while($row_get_item_id=mysqli_fetch_array($reslut_get_item_id)){ 
                $item_id=$row_get_item_id["item_id"];
                $item_quantity=$row_get_item_id["quantity"];
                $warehouse=$row_get_item_id["warehouse"];
                $strwarehouse="";
                if($warehouse=="0"){
                    $strwarehouse="tb_stock_divide";
                }
                else if($warehouse=="1"){
                    $strwarehouse="tb_stock_divide_hanoi";
                }
                $result_check_stock_each_item=mysqli_query($db,"SELECT stock$customer_type AS `stock`,stock_total ,sku FROM $strwarehouse WHERE `product_id`='$item_id'");
                                while($row_check_stock_each_item=mysqli_fetch_array($result_check_stock_each_item)){ 
                                    $stock=$row_check_stock_each_item["stock"];
                                   
                                    $stock_total=$row_check_stock_each_item["stock_total"];
                                    $sku=$row_check_stock_each_item["sku"];
                                    $stock_update=intval($stock)+$item_quantity;    
                                    $stock_update_total= intval($stock_total)+$item_quantity;  
                                    
                                    if($warehouse =="0" && $customer_type=="_eglips" ){
                                        $string_comment_for_log="Cancelled Order , order id :$order_id, item $item_id , stock quantity before : $stock , stock quantity affter : $stock_update ,($customer_type : $stock ~ $stock_update) , action :success";
                                        mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$item_id','$stock','$stock_update','$string_comment_for_log','$today','$name_manager','3','$warehouse')");  
                                        mysqli_query($db,"UPDATE $strwarehouse SET stock$customer_type='$stock_update'  WHERE `product_id`= '$item_id'");
                                    }
                                    else if($warehouse =="1" && ($customer_type=="_web" || $customer_type=="_watsons" )){
                                        $string_comment_for_log="Cancelled Order , order id :$order_id, item $item_id , stock quantity before : $stock , stock quantity affter : $stock_update ,($customer_type : $stock ~ $stock_update) , action :success";
                                        mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$item_id','$stock','$stock_update','$string_comment_for_log','$today','$name_manager','3','$warehouse')");  
                                        mysqli_query($db,"UPDATE $strwarehouse SET stock$customer_type='$stock_update'  WHERE `product_id`= '$item_id'");
                                    }else{
                                        $string_comment_for_log="Cancelled Order , order id :$order_id, item $item_id , stock quantity before : $stock_total , stock quantity affter : $stock_update_total ,($customer_type : $stock ~ $stock_update) , action :success";
                                        mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$item_id','$stock_total','$stock_update_total','$string_comment_for_log','$today','$name_manager','3','$warehouse')");  
                                        mysqli_query($db,"UPDATE $strwarehouse SET stock$customer_type='$stock_update' ,stock_total='$stock_update_total' WHERE `product_id`= '$item_id'");                               
                                    }
                                    
                                   
                                    if($customer_type=="_web" && $warehouse =="0" ){
                                         $result_query_get_quantity_sky007_web=mysqli_query($db_sky007vn,"SELECT post_id FROM `aowp_postmeta` WHERE  meta_value='$sku'AND meta_key='_sku'");
                                         $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_sky007_web);
                                         if($rowcount_check_exits>0){
                                             $row_result_query_get_quantity_sky007_web=mysqli_fetch_array($result_query_get_quantity_sky007_web);                                 
                                             $item_id_sky007_web=$row_result_query_get_quantity_sky007_web['post_id'];   
                                             mysqli_query($db_sky007vn,"UPDATE `aowp_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_sky007_web' AND meta_key='_stock'");                                
    
                                         }                                       
                                    } 
                                    if($warehouse==0 && $customer_type=="_bbiavn"){
                                        $result_query_get_quantity_bbiavn=mysqli_query($db_bbia,"SELECT post_id FROM wp_postmeta WHERE  meta_value='$sku' AND meta_key='_sku'");
                                        $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_bbiavn);
                                        if($rowcount_check_exits>0){
                                            $row_result_query_get_quantity_bbiavn=mysqli_fetch_array($result_query_get_quantity_bbiavn);                                  
                                            $item_id_bbiavn=$row_result_query_get_quantity_bbiavn['post_id'];  
                                             mysqli_query($db_bbia,"UPDATE wp_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_bbiavn' AND meta_key='_stock'");                                      
                                        }                                                                                                 
                                        
                                    //    mysqli_query($db_bbia,"UPDATE `aowp_posts` SET post_status='trash' WHERE id='$item_id_bbiavn'"); 
                                    }
                                    if($warehouse =="0" && $customer_type=="_mixsoon_web"){
                                         $result_query_get_quantity_mixsoon_web=mysqli_query($db_mixsoon,"SELECT post_id FROM `wp_postmeta` WHERE  meta_value='$sku'AND meta_key='_sku'");
                                         $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_mixsoon_web);
                                         if($rowcount_check_exits>0){
                                             $row_result_query_get_quantity_mixsoon_web=mysqli_fetch_array($result_query_get_quantity_mixsoon_web);                                 
                                             $item_id_mixsoon_web=$row_result_query_get_quantity_mixsoon_web['post_id'];   
                                             mysqli_query($db_mixsoon,"UPDATE `wp_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_mixsoon_web' AND meta_key='_stock'");                                
    
                                         }
                                   }                        
                                   if($warehouse =="0" && $customer_type=="_hince_web"){
                                      $result_query_get_quantity_hince_web=mysqli_query($db_hince,"SELECT post_id FROM wp_hince_postmeta WHERE  meta_value='$sku'AND meta_key='_sku'");
                                         $row_result_query_get_quantity_hince_web=mysqli_fetch_array($result_query_get_quantity_hince_web);                                  
                                         $item_id_hince_web=$row_result_query_get_quantity_hince_web['post_id'];
                                         $qty_affter_affect=$stock_update;
                                         if($item_id_hince_web!=""){
                                            mysqli_query($db_hince,"UPDATE wp_hince_postmeta SET meta_value ='$qty_affter_affect' WHERE post_id='$item_id_hince_web' AND meta_key='_stock'");                                       
                                         }
                                  }
                }                      
             }
             mysqli_query($db,"UPDATE `aowp_posts` SET post_status='wc-cancelled' WHERE id='$order_id'");      
             mysqli_query($db,"UPDATE `tb_ord_note` SET `mg_cancel` ='$name_manager',`time_cancel`='$today' , reason_cancel='$note_cancel' WHERE order_id='$order_id'");
              //------------- update order bbiavn to trash------------------------------------------------------------------------
         /*    $get_order_id_bbiavn=mysqli_query($db,"SELECT `shop_order_id` FROM `tb_ord_note` WHERE order_id='$order_id'");    
             $row_result_order_id_bbiavn=mysqli_fetch_array($get_order_id_bbiavn);                                  
             $order_id_bbiavn=intval($row_result_order_id_bbiavn['shop_order_id']);               
             if($order_id_bbiavn!=""){              
                 mysqli_query($db_bbia,"UPDATE `wp_posts` SET post_status='wc-cancelled' WHERE id='$order_id_bbiavn'");
             }*/
             //-------------------------------------------------------------------------------------------------------------------
             common_close_connect($db_bbia);
             common_close_connect($db_sky007vn);
             common_close_connect($db_mixsoon);
             common_close_connect($db_eglips);            
             common_close_connect($db);
             common_close_connect($db_wholesaler);
             common_close_connect($db_hince);
        }
        public function sv_order_management_update_order_delete($obj){
            $order_id=$obj["order_id"];
            $name_manager=$obj["mg_name"];
            $note_delete=$obj["note"];
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s");
            $chkCancelBS=$obj["chkCancelBS"];
            $db=common_connect();
            $db_bbia=common_connect_bbia();
            $db_sky007vn=common_connect_sky007();
            $db_mixsoon=common_connect_mixsoon();
            $db_eglips=common_connect_eglips();
            $db_wholesaler=common_connect_wholesaler();
            $db_hince= common_connect_hince();
            $customer_type="";      
            $result_strShop=mysqli_query($db,"SELECT `ord_category` FROM `tb_ord_note` WHERE `order_id`='$order_id'");
            while($row_strShop=mysqli_fetch_array($result_strShop)){ 
                        $customer_type=$row_strShop["ord_category"];
            }
            
            
              if($customer_type=="5" || $customer_type=="0")
              {
                $customer_type="_web";          
              }else if($customer_type=="10"|| $customer_type=="11" || $customer_type=="52"|| $customer_type=="53" || $customer_type=="66" || $customer_type=="67"){
                $customer_type="_shopee";
              }else if($customer_type=="7" || $customer_type=="50" || $customer_type=="51" ||$customer_type=="44"|| $customer_type=="45"){
                $customer_type="_wholesaler";
              }else if($customer_type=="18"|| $customer_type=="19"|| $customer_type=="22" || $customer_type=="32"){
                $customer_type="_eglips";
              }else if($customer_type=="20"|| $customer_type=="21" || $customer_type=="54"|| $customer_type=="55" ||$customer_type=="68"|| $customer_type=="69"){
                $customer_type="_lazada";
              }
              else if($customer_type=="25"|| $customer_type=="24"){
                $customer_type="_shopee_eglips";
              }else if($customer_type=="26"|| $customer_type=="27"){
                $customer_type="_lazada_eglips";
              }else if($customer_type=="28"|| $customer_type=="29"){
                $customer_type="_lazada_eglips";
              }else if($customer_type=="30"|| $customer_type=="31"){
                $customer_type="_watsons";
              }else if($customer_type=="36"|| $customer_type=="37" || $customer_type=="56"|| $customer_type=="57"){
                $customer_type="_tiki";
              }else if($customer_type=="42"|| $customer_type=="43"){
                $customer_type="_tiki_eglips";
              }/*else if($customer_type=="44"|| $customer_type=="45"){
                $customer_type="_sociolla";
              }*/else if($customer_type=="46"|| $customer_type=="47"){
                $customer_type="_bbiavn";
              }else if($customer_type=="48"|| $customer_type=="49"){
                $customer_type="_mixsoon_web";
              }else if($customer_type=="58"|| $customer_type=="59"){
                $customer_type="_tiktok";
              }else if($customer_type=="60"|| $customer_type=="61"){
                $customer_type="_tiktok_mixsoon";
              }else if($customer_type=="64"|| $customer_type=="65"){
                $customer_type="_hince_web";
              }else if($customer_type=="70"|| $customer_type=="71"){
                $customer_type="_tiktok_hince";
              }
            
            $result_check_order_id_trash=mysqli_query($db,"SELECT p.post_status AS `status` FROM `aowp_posts` p WHERE p.id='$order_id'");
            while($row_check_order_id_trash=mysqli_fetch_array($result_check_order_id_trash)){
                $status_order=$row_check_order_id_trash["status"];
                if($status_order=="trash"){
                    echo("false");
                    die();
                }
            }        
            $reslut_get_item_id=mysqli_query($db,"SELECT IF(oim_variation_id.meta_value='0', oim_item_id.meta_value,oim_variation_id.meta_value) AS `item_id`,oim_item_quantity.meta_value AS `quantity`,n.warehouse
                                                    FROM aowp_woocommerce_order_items oi
                                                    	LEFT JOIN aowp_woocommerce_order_itemmeta oim_item_id ON oi.order_item_id=oim_item_id.order_item_id
                                                    	LEFT JOIN aowp_woocommerce_order_itemmeta oim_variation_id ON oi.order_item_id=oim_variation_id.order_item_id 
                                                    	LEFT JOIN aowp_woocommerce_order_itemmeta oim_item_quantity ON oi.order_item_id=oim_item_quantity.order_item_id
                                                        LEFT JOIN tb_ord_note n ON oi.order_id=n.order_id
                                                    WHERE oi.order_item_type='line_item' 
                                                    	AND oim_item_id.meta_key='_product_id'
                                                    	AND oim_variation_id.meta_key='_variation_id'	
                                                    	AND oim_item_quantity.meta_key='_qty'
                                                    	AND oi.order_id='$order_id'");
             while($row_get_item_id=mysqli_fetch_array($reslut_get_item_id)){ 
                $item_id=$row_get_item_id["item_id"];
                $item_quantity=$row_get_item_id["quantity"];
                $warehouse=$row_get_item_id["warehouse"];
                $strwarehouse="";
                if($warehouse=="0"){
                    $strwarehouse="tb_stock_divide";
                }
                else if($warehouse=="1"){
                    $strwarehouse="tb_stock_divide_hanoi";
                }
                $result_check_stock_each_item=mysqli_query($db,"SELECT stock$customer_type AS `stock`,stock_total, sku FROM $strwarehouse WHERE `product_id`='$item_id'");
                                while($row_check_stock_each_item=mysqli_fetch_array($result_check_stock_each_item)){ 
                                    $stock=$row_check_stock_each_item["stock"];
                                    $stock_total=$row_check_stock_each_item["stock_total"];
                                    $sku=$row_check_stock_each_item["sku"];
                                    $stock_update=intval($stock)+$item_quantity;    
                                    $stock_update_total= intval($stock_total)+$item_quantity;          
                                  
                                    if($warehouse =="0" && $customer_type=="_eglips"){
                                       $string_comment_for_log="Delete Order , order id :$order_id, item $item_id , stock quantity before : $stock , stock quantity affter : $stock_update ,($customer_type : $stock ~ $stock_update) , action :success";
                                       mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$item_id','$stock','$stock_update','$string_comment_for_log','$today','$name_manager','2','$warehouse')");  
                                       mysqli_query($db,"UPDATE $strwarehouse SET stock$customer_type='$stock_update'  WHERE `product_id`= '$item_id'");
                                    }
                                    else if($warehouse =="1" && ($customer_type=="_web" || $customer_type=="_watsons")){
                                       $string_comment_for_log="Delete Order , order id :$order_id, item $item_id , stock quantity before : $stock , stock quantity affter : $stock_update ,($customer_type : $stock ~ $stock_update) , action :success";
                                       mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$item_id','$stock','$stock_update','$string_comment_for_log','$today','$name_manager','2','$warehouse')");  
                                       mysqli_query($db,"UPDATE $strwarehouse SET stock$customer_type='$stock_update'  WHERE `product_id`= '$item_id'");
                                    }else{
                                       $string_comment_for_log="Delete Order , order id :$order_id, item $item_id , stock quantity before : $stock_total , stock quantity affter : $stock_update_total ,($customer_type : $stock ~ $stock_update) , action :success";
                                       mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$item_id','$stock_total','$stock_update_total','$string_comment_for_log','$today','$name_manager','2','$warehouse')");  
                                       mysqli_query($db,"UPDATE $strwarehouse SET stock$customer_type='$stock_update' ,stock_total='$stock_update_total' WHERE `product_id`= '$item_id'"); 
                                    }
                                                                   
                                   
                                    if($customer_type=="_web" && $warehouse =="0" ){
                                        $result_query_get_quantity_sky007_web=mysqli_query($db_sky007vn,"SELECT post_id FROM `aowp_postmeta` WHERE  meta_value='$sku'AND meta_key='_sku'");
                                         $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_sky007_web);
                                         if($rowcount_check_exits>0){
                                             $row_result_query_get_quantity_sky007_web=mysqli_fetch_array($result_query_get_quantity_sky007_web);                                 
                                             $item_id_sky007_web=$row_result_query_get_quantity_sky007_web['post_id'];   
                                             mysqli_query($db_sky007vn,"UPDATE `aowp_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_sky007_web' AND meta_key='_stock'");                                
    
                                         }
                                    } 
                                    if($warehouse==0 && $customer_type=="_bbiavn"){
                                        $result_query_get_quantity_bbiavn=mysqli_query($db_bbia,"SELECT post_id FROM wp_postmeta WHERE  meta_value='$sku' AND meta_key='_sku'");
                                        $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_bbiavn);
                                         if($rowcount_check_exits>0){
                                            $row_result_query_get_quantity_bbiavn=mysqli_fetch_array($result_query_get_quantity_bbiavn);                                  
                                            $item_id_bbiavn=$row_result_query_get_quantity_bbiavn['post_id'];  
                                            mysqli_query($db_bbia,"UPDATE wp_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_bbiavn' AND meta_key='_stock'");  
                                         }  
                                    }
                                    if($warehouse =="0" && $customer_type=="_mixsoon_web"){
                                         $result_query_get_quantity_mixsoon_web=mysqli_query($db_mixsoon,"SELECT post_id FROM `wp_postmeta` WHERE  meta_value='$sku' AND meta_key='_sku'");
                                         $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_mixsoon_web);
                                         if($rowcount_check_exits>0){
                                             $row_result_query_get_quantity_mixsoon_web=mysqli_fetch_array($result_query_get_quantity_mixsoon_web);                                 
                                             $item_id_mixsoon_web=$row_result_query_get_quantity_mixsoon_web['post_id'];   
                                            // echo ("UPDATE `wp_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_mixsoon_web' AND meta_key='_stock'");
                                             mysqli_query($db_mixsoon,"UPDATE `wp_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_mixsoon_web' AND meta_key='_stock'");                                
    
                                         }
                                   }
                                   if($warehouse =="0" && $customer_type=="_wholesaler"){
                                         $result_query_get_quantity_wholesaler=mysqli_query($db_mixsoon,"SELECT post_id FROM `wpws_postmeta` WHERE  meta_value='$sku' AND meta_key='_sku'");
                                         $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_wholesaler);
                                         if($rowcount_check_exits>0){
                                             $row_result_query_get_quantity_wholesaler=mysqli_fetch_array($result_query_get_quantity_wholesaler);                                 
                                             $item_id_wholesaler=$row_result_query_get_quantity_wholesalerb['post_id'];  
                                             mysqli_query($db_wholesaler,"UPDATE `wpws_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_wholesaler' AND meta_key='_stock'");     
                                             mysqli_query($db_wholesaler,"UPDATE `wpws_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_wholesaler' AND meta_key='_total_stock_quantity'");                            
    
                                         }
                                   }
                                   if($warehouse==0 && $customer_type=="_hince_web"){
                                    $result_query_get_quantity_hince_web=mysqli_query($db_hince,"SELECT post_id FROM wp_hince_postmeta WHERE  meta_value='$sku' AND meta_key='_sku'");
                                    $row_result_query_get_quantity_hince_web=mysqli_fetch_array($result_query_get_quantity_hince_web);                                  
                                    $item_id_hince_web=$row_result_query_get_quantity_hince_web['post_id'];
                                    $qty_affter_affect=$stock_update;     
                                    if($item_id_hince_web!=""){
                                        mysqli_query($db_hince,"UPDATE wp_hince_postmeta SET meta_value ='$qty_affter_affect' WHERE post_id='$item_id_hince_web' AND meta_key='_stock'");                                       
                                        if($qty_affter_affect>0){
                                            mysqli_query($db_hince,"UPDATE `wp_hince_postmeta` SET `meta_value` ='instock' WHERE  `post_id`='$item_id_hince_web' AND `meta_key`='_stock_status'");
                                            
                                        }
                                        
                                    }
                                }
                          }                      
             }
             mysqli_query($db,"UPDATE `aowp_posts` SET post_status='trash' WHERE id='$order_id'");      
             mysqli_query($db,"UPDATE `tb_ord_note` SET `mg_delete` ='$name_manager',`time_delete`='$today' , reason_delete='$note_delete' WHERE order_id='$order_id'");
             if($chkCancelBS=="1"){          
                 mysqli_query($db,"UPDATE `tb_packaging` SET `admin_cancel`='$name_manager' ,time_cancel='$today' WHERE order_id='$order_id'"); 
             }
             //------------- update order bbiavn to trash------------------------------------------------------------------------
          /*   $get_order_id_bbiavn=mysqli_query($db,"SELECT `shop_order_id` FROM `tb_ord_note` WHERE order_id='$order_id'");    
             $row_result_order_id_bbiavn=mysqli_fetch_array($get_order_id_bbiavn);                                  
             $order_id_bbiavn=intval($row_result_order_id_bbiavn['shop_order_id']);               
             if($order_id_bbiavn!=""){             
                 mysqli_query($db_bbia,"UPDATE `wp_posts` SET post_status='trash' WHERE id='$order_id_bbiavn'");
             }*/
             //-------------------------------------------------------------------------------------------------------------------
             common_close_connect($db_bbia);
             common_close_connect($db_sky007vn);
             common_close_connect($db);
             common_close_connect($db_mixsoon);
             common_close_connect($db_wholesaler);
             common_close_connect($db_eglips);
             common_close_connect($db_hince);
        }  
        public function sv_order_management_update_list_product($shoptype,$wh){
            $db = common_connect();
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $today = date("Y-m-d H:i:s"); 
            $string_shop="";
            $check_order_mixsoon=0;
             if($shoptype==1 || $shoptype==18){
                $string_shop="_web";
             }else if($shoptype==2){
                $string_shop="_shopee";
             }else if($shoptype==5){
                $string_shop="_eglips";
             }else if($shoptype==6){
                $string_shop="_lazada";
             }else if($shoptype==7){
                $string_shop="_shopee_eglips";
             }else if($shoptype==8){
                $string_shop="_lazada_eglips";
             }else if($shoptype==9){
                $string_shop="_robins";
             }else if($shoptype==10){
                $string_shop="_watsons";
             }else if($shoptype==11){
                $string_shop="_tiki";
             }else if($shoptype==14){
                $string_shop="_tiki_eglips";
             }else if($shoptype==15){
                $string_shop="_sociolla";
             }else if($shoptype==16){
                $string_shop="_bbiavn";
             }else if($shoptype==17){
                $string_shop="_mixsoon_web";
                $check_order_mixsoon=1;
             }
             
             $warehouse=$wh;
             if($warehouse==0){
               
                $warehouse="tb_stock_divide";
              
                
             }else if ($warehouse==1){
                
                $warehouse="tb_stock_divide_hanoi";
              
                
             }      
         
             
          /*   $query="SELECT a.product_id AS `id`,a.sku,a.product_name AS `name`,a.price$string_shop AS `price`,a.stock$string_shop AS `stock` ,b.product_id AS `id_regular`,b.sku AS `sku_regular`,b.price$string_shop AS `price_regular` ,b.stock$string_shop AS `stock_regular`
                    FROM (SELECT `product_id`,`sku`,`product_name`,`price$string_shop`,`stock$string_shop` 
                    FROM `$warehouse` WHERE sku NOT LIKE '%-R') AS a
                    LEFT JOIN  (SELECT `product_id`,`sku`,`product_name`,`price$string_shop`,`stock$string_shop` 
                    FROM `$warehouse` WHERE sku  LIKE '%-R') AS b ON a.product_name=b.product_name";      */
                  //  echo  $query ; exit();
            
             $query=  "";
             if($check_order_mixsoon==0){
              $query="SELECT `product_id` as id,`sku`,`product_name`  AS `name`,`price$string_shop` AS `price`,`stock$string_shop` AS `stock`, IF( sku LIKE '%-R','Regular','Handcarry' ) AS product_type  FROM `$warehouse`";
             }else if($check_order_mixsoon==1){
              $query="SELECT `product_id` as id,`sku`,`product_name`  AS `name`,`price$string_shop` AS `price`,`stock$string_shop` AS `stock`, IF( sku LIKE '%-R','Regular','Handcarry' ) AS product_type  FROM `$warehouse` WHERE  sku LIKE 'MS%'";  
             }
             $result=mysqli_query($db,$query);   
            
             $rows=array();
             while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
                }        
           
            echo json_encode($rows);
            common_close_connect($db);
        }
        public function sv_order_management_update_infor_order($order_id){
           $db = common_connect();
        //    echo("false"); die();
           $result_check_order_id_trash = mysqli_query($db, "SELECT p.post_status AS `status` FROM `aowp_posts` p WHERE p.id='$order_id'");
           while ($row_check_order_id_trash = mysqli_fetch_array($result_check_order_id_trash))
           {
                $status_order = $row_check_order_id_trash["status"];
                if ($status_order == "trash")
                {
                    echo("false");
                    die();
                }
           }
        $query = "SELECT p.id,
                	CONCAT_WS(' ',pm_first_name.meta_value,pm_last_name.meta_value) AS `name`,   
                	pm_address.meta_value AS `address`, 
                	pm_email.meta_value AS `email`, 
                	pm_city.meta_value AS `city`, 
                    pm_phone.meta_value AS `phone`, 
                	oim_shipping_state.meta_value AS `shipping_state`,
                	pm_shipping.meta_value AS `shipping_fee` ,
                	pm_pay_method.meta_value AS `pay_method`,
                	payment_method.meta_value AS `payment_method`,
                	n.`ord_category` AS `customer_type`,
                	n.`ord_parent_id` AS `parent_id`,
                    n.`shop_delivery_id` AS `delivery_id` ,
                    n.shop_delivery as `shop_delivery`,
                	p.post_excerpt AS `note`,
                    n.`shop_order_id` ,
                    n.message_admin,n.warehouse
                    
                	
                FROM `aowp_posts` p
                	LEFT JOIN `aowp_postmeta` pm_first_name ON pm_first_name.post_id=p.id
                	LEFT JOIN `aowp_postmeta` pm_last_name ON pm_last_name.post_id=p.id
                	LEFT JOIN `aowp_postmeta` pm_address ON pm_address.post_id=p.id	
                	LEFT JOIN `aowp_postmeta` pm_city ON pm_city.post_id=p.id
                  	LEFT JOIN `aowp_postmeta` pm_phone ON pm_phone.post_id=p.id	 
                	LEFT JOIN `aowp_postmeta` pm_pay_method ON pm_pay_method.post_id=p.id	
                	LEFT JOIN `aowp_postmeta` pm_email ON pm_email.post_id=p.id		
                	LEFT JOIN `aowp_postmeta` pm_shipping ON pm_shipping.post_id=p.id	
                	LEFT JOIN `aowp_postmeta` payment_method ON payment_method.post_id=p.id	
                	LEFT JOIN `tb_ord_note` n ON n.order_id=p.id
                	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id	
                	LEFT JOIN  `aowp_woocommerce_order_itemmeta` oim_shipping_state ON oim_shipping_state.order_item_id=oi.order_item_id
                WHERE pm_first_name.meta_key='_billing_first_name' AND pm_last_name.meta_key='_billing_last_name'
                	AND pm_address.meta_key='_billing_address_1'
                	AND pm_city.meta_key='_billing_city'
                   	AND pm_phone.meta_key='_billing_phone'
                	AND pm_pay_method.meta_key='_payment_method_title'	
                	AND pm_email.meta_key='_billing_email'		
                	AND pm_shipping.meta_key='_order_shipping'
                	AND oi.order_item_type='shipping'
                	AND oim_shipping_state.meta_key='method_id'
                	AND payment_method.meta_key='_payment_method'
                	AND p.id ='$order_id'";
        $result = mysqli_query($db, $query);
        $rows = array();
        while ($row = mysqli_fetch_array($result))
        {
            array_push($rows, $row);
        }
        $query_get_item = "SELECT a.* ,IF(pm_sku.sku  LIKE '%-R','1','0') AS type_product
                        FROM (SELECT IF(oim_variation_id.meta_value='0', oim_item_id.meta_value,oim_variation_id.meta_value) AS `item_id`,oi.order_item_name AS `item_name` ,oim_item_quantity.meta_value AS `quantity` ,oim_line_total.meta_value AS `price` , oim_variation_id.meta_value AS `id_variation`
                                            FROM aowp_woocommerce_order_items oi
                                            	LEFT JOIN aowp_woocommerce_order_itemmeta oim_item_id ON oi.order_item_id=oim_item_id.order_item_id
                                            	LEFT JOIN aowp_woocommerce_order_itemmeta oim_item_quantity ON oi.order_item_id=oim_item_quantity.order_item_id
                                            	LEFT JOIN aowp_woocommerce_order_itemmeta oim_line_total ON oi.order_item_id=oim_line_total.order_item_id
                                            	LEFT JOIN aowp_woocommerce_order_itemmeta oim_variation_id ON oi.order_item_id=oim_variation_id.order_item_id                    	
                                            	
                                            WHERE oi.order_item_type='line_item' 
                                            	AND oim_item_id.meta_key='_product_id'
                                            	AND oim_item_quantity.meta_key='_qty'
                                            	AND oim_line_total.meta_key='_line_total'
                                            	AND oim_variation_id.meta_key='_variation_id'		
                                            	AND order_id='$order_id') AS a
                        	LEFT JOIN `tb_stock_divide` pm_sku ON  a.item_id=pm_sku.`product_id`";
        // echo json_encode($rows);
        $result_get_item = mysqli_query($db, $query_get_item);
        $rows_get_item = array();
        while ($row = mysqli_fetch_array($result_get_item))
        {
            $item_name = $row["item_name"];
            $item_variation = $row["id_variation"];
            if ($row["id_variation"] != 0)
            {
                $result_item_color = mysqli_query($db, "SELECT meta_value AS `color` FROM `aowp_postmeta` WHERE meta_key='attribute_pa_color' AND post_id='$item_variation'");
                while ($row_item_color = mysqli_fetch_array($result_item_color))
                {
                    $item_name = $item_name . " " . $row_item_color["color"];
                }

            }
            $row = array(
                "item_id" => $row["item_id"],
                "order_item_name" => $item_name,
                "quantity" => $row["quantity"],
                "price" => $row["price"],
                "product_type" => $row["type_product"]
            );
            array_push($rows_get_item, $row);
        }
        $arr_data = array(
            "infor_order" => $rows,
            "item_order" => $rows_get_item
        );
        echo json_encode($arr_data); 
        common_close_connect($db);
        }
        public function sv_order_management_update_update_order($data){
            $flat_check=$data["flat"];
        $flat_address=$flat_check["flatcheck_address"];
        $flat_city=$flat_check["flatcheck_city"];  
        $flat_paymethod=$flat_check["flatcheck_paymethod"];
        $flat_shippingfee=$flat_check["flatcheck_shippingfee"];
        $flat_shippingstates=$flat_check["flatcheck_shippingstates"];
        $flat_delivery_id=$flat_check["flatcheck_delivery_id"];
        $flat_shoporder_id=$flat_check["flatcheck_shoporderid"];    
        $flat_parentid=$flat_check["flatcheck_parentid"];
        $flat_deliverytype=$flat_check["flatcheck_deliverytype"];
        $flat_note=$flat_check["flatcheck_note"];
        $flat_noteadmin=$flat_check["flatcheck_noteadmin"];
        $flat_item=$flat_check["flatcheck_item"];   
        
        $data_info=$data["arr_info"];
        $order_id=$data_info["order_id"];
        $address=$data_info["address"];
        $city=$data_info["city"];
        $paymethod=$data_info["paymethod"];
        $shippingstates_code=$data_info["shippingstates_code"];
        $shippingstates=$data_info["shipping_states"];
        $shippingfee=$data_info["shipping_fee"];        
        $delivery_id=$data_info["deliveryID"];
        $shop_order_id=$data_info["shopOrderID"];        
        $parentid=$data_info["parentID"];
        $delivery_type=$data_info["delivery_type"];
        $note=$data_info["note"];
        $note_admin=$data_info["note_admin"];
        
        $arr_new_item=$data_info["arr_new_item"];
        $arr_old_item=$data_info["arr_old_item"];
        $name_manager=$data_info["mg_name"];
        $today = date("Y-m-d H:i:s"); 
        
        
        
        $db=common_connect();
        $db_bbia=common_connect_bbia();
        $db_sky007=common_connect_sky007();
        $db_mixsoon=common_connect_mixsoon();
        $db_wholesaler=common_connect_wholesaler();
        $db_eglips=common_connect_eglips();
        $db_hince=common_connect_hince();
        // get shopsale
        $customer_type="";
        $str_customer="";
        $warehouse="";
        
        $status_order="";
        
        $result_strShop=mysqli_query($db,"SELECT n.`ord_category`,n.`warehouse`,p.post_status FROM `tb_ord_note` n LEFT JOIN `aowp_posts` p ON n.order_id=p.id WHERE n.`order_id`='$order_id'");
        while($row_strShop=mysqli_fetch_array($result_strShop)){ 
                    $customer_type=$row_strShop["ord_category"];
                    $warehouse=$row_strShop["warehouse"];
                    $status_order=$row_strShop["post_status"];
        }
        if($status_order=="trash" ||$status_order=="wc-cancelled"){
            echo("Order aldready deleted !");
            die();
        }
         $rowcount_customer_type=mysqli_num_rows($result_strShop);
         if($rowcount_customer_type!=0){
            if($customer_type=="5" || $customer_type=="0" )
              {
                $customer_type="_web";
                $str_customer="1";
              }else if($customer_type=="10"|| $customer_type=="11" || $customer_type=="52"|| $customer_type=="53" || $customer_type=="66" || $customer_type=="67"){
                $customer_type="_shopee";
              }else if($customer_type=="7" || $customer_type=="50" || $customer_type=="51" || $customer_type=="44"|| $customer_type=="45"){
                $customer_type="_wholesaler";
              }else if($customer_type=="18"|| $customer_type=="19" || $customer_type=="22" || $customer_type=="32"){
                $customer_type="_eglips";
              }else if($customer_type=="20"|| $customer_type=="21" || $customer_type=="54"|| $customer_type=="55" ||$customer_type=="68"|| $customer_type=="69"){
                $customer_type="_lazada";
              }else if($customer_type=="24"|| $customer_type=="25"){
                $customer_type="_shopee_eglips";
              }else if($customer_type=="26"|| $customer_type=="27"){
                $customer_type="_lazada_eglips";
              }else if($customer_type=="30"|| $customer_type=="31"){
                $customer_type="_watsons";
              }else if($customer_type=="36"|| $customer_type=="37" || $customer_type=="56"|| $customer_type=="57"){
                $customer_type="_tiki";
              }else if($customer_type=="42"|| $customer_type=="43"){
                $customer_type="_tiki_eglips";
              }else if($customer_type=="46"|| $customer_type=="47"){
                $customer_type="_bbiavn";
              }else if($customer_type=="48"|| $customer_type=="49"){
                $customer_type="_mixsoon_web";
              }else if($customer_type=="58"|| $customer_type=="59"){
                $customer_type="_tiktok";
              }else if($customer_type=="60"|| $customer_type=="61"){
                $customer_type="_tiktok_mixsoon";
              }else if($customer_type=="64"|| $customer_type=="65"){
                $customer_type="_hince_web";
              }else if($customer_type=="70"|| $customer_type=="71"){
                $customer_type="_tiktok_hince";
              }
            
            mysqli_query($db,"DELETE FROM `tb_packaging` WHERE order_id='$order_id'");
            
            $result_check_update_barcode=mysqli_query($db,"SELECT * FROM `tb_barcode_order` WHERE order_id='$order_id' AND status_checkin='1'");
            $rowcount_check_update_barcode=mysqli_num_rows($result_check_update_barcode);
            
            $result_check_update_barcode_new=mysqli_query($db,"SELECT * FROM `tb_barcode_order` WHERE order_id='$order_id' AND status_checkin='0'");
            $rowcount_check_update_barcode_new=mysqli_num_rows($result_check_update_barcode_new);
            
            if($rowcount_check_update_barcode_new !=0){
                if($rowcount_check_update_barcode!=0){
                mysqli_query($db,"DELETE FROM `tb_barcode_order` WHERE order_id='$order_id' AND status_checkin='1'");
                mysqli_query($db,"UPDATE `tb_barcode_order` SET status_checkin='1' WHERE order_id='$order_id' AND status_checkin='0'");
                }else{
                    mysqli_query($db,"UPDATE `tb_barcode_order` SET status_checkin='1' WHERE order_id='$order_id' AND status_checkin='0'");
                } 
            }
                        
  
            if($flat_address=="yes"){          
                mysqli_query($db,"UPDATE `aowp_postmeta` SET meta_value='$address' WHERE (meta_key='_billing_address_1' OR meta_key='_billing_address_1') AND post_id='$order_id'");
            }
            if($flat_city=="yes"){          
                mysqli_query($db,"UPDATE `aowp_postmeta` SET meta_value='$city' WHERE (meta_key='_billing_city' OR meta_key='_billing_city') AND post_id='$order_id'");
            }
            if($flat_paymethod=="yes"){           
                mysqli_query($db,"UPDATE `aowp_postmeta` SET meta_value='$paymethod' WHERE meta_key='_payment_method_title' AND post_id='$order_id'");
            }
            if($flat_shippingstates=="yes"){           
               mysqli_query($db,"UPDATE `aowp_postmeta` SET meta_value='$shippingstates' WHERE (meta_key='_billing_state' OR meta_key='_shipping_state') AND post_id='$order_id'");
               mysqli_query($db,"UPDATE aowp_woocommerce_order_items SET order_item_name='$shippingstates' WHERE order_item_type='shipping' AND order_id='$order_id'");
               mysqli_query($db,"UPDATE `aowp_postmeta` SET meta_value='$shippingfee' WHERE meta_key='_order_shipping' AND post_id='$order_id'");
               $result_total_price_of_order=mysqli_query($db,"SELECT SUM(oim.meta_value) as `total`
                                                                FROM `aowp_woocommerce_order_items` oi
                                                                 LEFT JOIN `aowp_woocommerce_order_itemmeta` oim ON oi.order_item_id=oim.order_item_id
                                                                WHERE oim.meta_key='_line_total'
                                                                AND oi.order_id='$order_id'");
               while($row_total_price=mysqli_fetch_array($result_total_price_of_order)){ 
                    $total_price=intval($row_total_price["total"]);
                    $total_order=$total_price+intval($shippingfee);
                    mysqli_query($db,"UPDATE `aowp_postmeta` SET meta_value='$total_order' WHERE meta_key='_order_total' AND post_id='$order_id'");               
               }
               $result_order_item_id=mysqli_query($db,"SELECT order_item_id FROM `aowp_woocommerce_order_items` WHERE order_id='$order_id' AND order_item_type='shipping'");
               while($row_order_item_id=mysqli_fetch_array($result_order_item_id)){ 
                    $order_item_id= $row_order_item_id["order_item_id"];               
                    mysqli_query($db,"UPDATE `aowp_woocommerce_order_itemmeta` SET meta_value='$shippingstates_code' WHERE order_item_id='$order_item_id' AND meta_key='method_id'");              
                    mysqli_query($db,"UPDATE`aowp_woocommerce_order_itemmeta` SET meta_value='$shippingfee' WHERE order_item_id='$order_item_id' AND meta_key='cost'");
                }          
            }
            if($flat_shippingstates=="no" && $flat_shippingfee=="yes"){
                mysqli_query($db,"UPDATE `aowp_postmeta` SET meta_value='$shippingfee' WHERE meta_key='_order_shipping' AND post_id='$order_id'");
               $result_total_price_of_order=mysqli_query($db,"SELECT SUM(oim.meta_value) as `total`
                                                                FROM `aowp_woocommerce_order_items` oi
                                                                 LEFT JOIN `aowp_woocommerce_order_itemmeta` oim ON oi.order_item_id=oim.order_item_id
                                                                WHERE oim.meta_key='_line_total'
                                                                AND oi.order_id='$order_id'");
               while($row_total_price=mysqli_fetch_array($result_total_price_of_order)){ 
                    $total_price=intval($row_total_price["total"]);
                    $total_order=$total_price+intval($shippingfee);
                    mysqli_query($db,"UPDATE `aowp_postmeta` SET meta_value='$total_order' WHERE meta_key='_order_total' AND post_id='$order_id'");               
               }
                $result_order_item_id=mysqli_query($db,"SELECT order_item_id FROM `aowp_woocommerce_order_items` WHERE order_id='$order_id' AND order_item_type='shipping'");
                while($row_order_item_id=mysqli_fetch_array($result_order_item_id)){ 
                    $order_item_id= $row_order_item_id["order_item_id"];
                    mysqli_query($db,"UPDATE`aowp_woocommerce_order_itemmeta` SET meta_value='$shippingfee' WHERE order_item_id='$order_item_id' AND meta_key='cost'");
                }
            }
            
             if( $flat_delivery_id=="yes" ||$flat_parentid=="yes" || $flat_shoporder_id=="yes" ||$flat_deliverytype =="yes" || $flat_noteadmin=="yes"){          
                mysqli_query($db,"UPDATE `tb_ord_note` SET `ord_parent_id`='$parentid',`shop_delivery_id`='$delivery_id',`shop_order_id`='$shop_order_id', `shop_delivery`='$delivery_type' , `message_admin`='$note_admin' WHERE `order_id`='$order_id'");
            }
            if($flat_note=="yes"){            
                mysqli_query($db,"UPDATE `aowp_posts` SET `post_excerpt`='$note' WHERE id='$order_id'");
            }
            
            
             if($flat_item=="yes"){
                $str_warehouse="";
                if($warehouse=="0"){
                    $str_warehouse="tb_stock_divide";
                }else if($warehouse=="1"){
                    $str_warehouse="tb_stock_divide_hanoi";
                }
                $flat_check_stock="true";           
                for($i=0;$i<count($arr_new_item);$i++){
                    $id_item_new=$arr_new_item[$i]["product_id"];
                    $quantity_item_new=$arr_new_item[$i]["quantity"];
                    $quantity_item_old=0;
                    $index_id_old=-1;
                   
                    for($j=0;$j<count($arr_old_item);$j++){
                        if($id_item_new==$arr_old_item[$j]["product_id"]){
                            $index_id_old=$j;
                        }
                    }                 
                    if($index_id_old!=-1){
                        $quantity_item_old=intval($arr_old_item[$index_id_old]["quantity"]);   
                                         
                    }
                    $result_check_stock_each_item=mysqli_query($db,"SELECT `stock$customer_type` AS `stock`  , stock_total FROM `$str_warehouse` WHERE `product_id`='$id_item_new'");
                    $rowcount_check_stock_each_item=mysqli_num_rows($result_check_stock_each_item);
                    if($rowcount_check_stock_each_item=="0"){
                        $flat_check_stock="false";
                        echo("Item not exists ,Please contact to admin .");
                        die();
                    }
                    
                    while($row_check_stock_each_item=mysqli_fetch_array($result_check_stock_each_item)){ 
                        $stock=$row_check_stock_each_item["stock"];
                        $stock_total=$row_check_stock_each_item["stock_total"];
                        $check_stock=intval($stock)+$quantity_item_old-$quantity_item_new;    
                        $check_stock_total= intval($stock_total)+$quantity_item_old-$quantity_item_new;    
                        if($warehouse=="0" && $customer_type=="_eglips"){
                            if($check_stock<0){
                                $flat_check_stock="false";
                                echo("Stock not enough ,Please check Stock again .");
                                die();
                            }
                        }else if ($warehouse=="1" && ($customer_type=="_web" || $customer_type=="_watsons" || $customer_type=="_mixsoon_web") ){
                            if($check_stock<0 ){
                                $flat_check_stock="false";
                                echo("Stock not enough ,Please check Stock again .");
                                die();
                            }
                        }else{
                            if($check_stock<0 || $check_stock_total<0){
                                $flat_check_stock="false";
                                echo("Stock not enough ,Please check Stock again .");
                                die();
                            }
                        }          
                        
                        
                    }
                }                                             
                if($flat_check_stock=="true"){                
                    $result_delete_old_item=mysqli_query($db,"SELECT order_item_id FROM `aowp_woocommerce_order_items` WHERE order_item_type='line_item' AND order_id='$order_id'");
                    while($row_delete_old_item=mysqli_fetch_array($result_delete_old_item)){ 
                        $order_item_id_old=$row_delete_old_item["order_item_id"];
                        mysqli_query($db,"DELETE FROM `aowp_woocommerce_order_items` WHERE order_item_id='$order_item_id_old'");
                        mysqli_query($db,"DELETE FROM `aowp_woocommerce_order_itemmeta` WHERE order_item_id='$order_item_id_old'");
                       
                    }                               
                        for($i=0;$i<count($arr_new_item);$i++){
                            $id_item_new=$arr_new_item[$i]["product_id"];
                            $quantity_item_new=$arr_new_item[$i]["quantity"];
                            $price_item=$arr_new_item[$i]["price"];
                            $price=intval($quantity_item_new) * intval($price_item);
                            $quantity_item_old=0;
                            $index_id_old=-1;
                            $name_item="";
                            $result_name_item=mysqli_query($db,"SELECT post_title AS name_item FROM `aowp_posts` WHERE id='$id_item_new'");
                         
                            while($row_name_item = mysqli_fetch_array($result_name_item)){
                                $name_item=$row_name_item["name_item"];
                                
                            }                       
                            for($j=0;$j<count($arr_old_item);$j++){
                                if($id_item_new==$arr_old_item[$j]["product_id"]){
                                    $index_id_old=$j;
                                }
                            }                 
                            if($index_id_old!=-1){
                                $quantity_item_old=intval($arr_old_item[$index_id_old]["quantity"]);   
                                                 
                            }
                            $result_check_stock_each_item=mysqli_query($db,"SELECT `stock$customer_type` AS `stock` ,stock_total,sku FROM `$str_warehouse` WHERE `product_id`='$id_item_new'");
                            while($row_check_stock_each_item=mysqli_fetch_array($result_check_stock_each_item)){ 
                                $stock=$row_check_stock_each_item["stock"];
                                $stock_total=$row_check_stock_each_item["stock_total"];
                                $sku=$row_check_stock_each_item["sku"];
                                $stock_update=intval($stock)+$quantity_item_old-$quantity_item_new;
                                
                                $stock_update_total=intval($stock_total)+$quantity_item_old-$quantity_item_new;
                                
                                $rep= mysqli_query($db,"INSERT INTO `aowp_woocommerce_order_items` (`order_item_name`,`order_item_type`,`order_id`) VALUE('$name_item','line_item','$order_id')");
                                if ($rep)
                                {  
                                       $ltax='a:2:{s:5:"total";a:0:{}s:8:"subtotal";a:0:{}}';
                                       $get_item_id= mysqli_query($db,"SELECT * FROM aowp_woocommerce_order_items WHERE order_id=".$order_id." ORDER BY order_item_id DESC LIMIT 1"); 
                                           $rows=array();
                                           while($row=mysqli_fetch_array($get_item_id)){
                                              mysqli_query($db,"INSERT INTO aowp_woocommerce_order_itemmeta (order_item_id,meta_key,meta_value) VALUE (".$row['order_item_id'].",'_qty',".$quantity_item_new.")");
                                              mysqli_query($db,"INSERT INTO aowp_woocommerce_order_itemmeta (order_item_id,meta_key,meta_value) VALUE (".$row['order_item_id'].",'_tax_class','')");
                                              mysqli_query($db,"INSERT INTO aowp_woocommerce_order_itemmeta (order_item_id,meta_key,meta_value) VALUE (".$row['order_item_id'].",'_product_id','".$id_item_new."')");
                                              mysqli_query($db,"INSERT INTO aowp_woocommerce_order_itemmeta (order_item_id,meta_key,meta_value) VALUE (".$row['order_item_id'].",'_variation_id','0')");
                                              mysqli_query($db,"INSERT INTO aowp_woocommerce_order_itemmeta (order_item_id,meta_key,meta_value) VALUE (".$row['order_item_id'].",'_line_subtotal',".$price.")");
                                              mysqli_query($db,"INSERT INTO aowp_woocommerce_order_itemmeta (order_item_id,meta_key,meta_value) VALUE (".$row['order_item_id'].",'_line_total',".$price.")");
                                              mysqli_query($db,"INSERT INTO aowp_woocommerce_order_itemmeta (order_item_id,meta_key,meta_value) VALUE (".$row['order_item_id'].",'_line_subtotal_tax','0')");
                                              mysqli_query($db,"INSERT INTO aowp_woocommerce_order_itemmeta (order_item_id,meta_key,meta_value) VALUE (".$row['order_item_id'].",'_line_tax','0')");
                                              mysqli_query($db,"INSERT INTO aowp_woocommerce_order_itemmeta (order_item_id,meta_key,meta_value) VALUE (".$row['order_item_id'].",'_line_tax_data','".$ltax."')");                                         
                                           }   
                                }
                                if( $customer_type=="_web" && $warehouse=="0"){
                                    $result_query_get_quantity_sky007vn=mysqli_query($db_sky007,"SELECT post_id FROM aowp_postmeta WHERE  meta_value='$sku'AND meta_key='_sku'");
                                     $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_sky007vn);
                                     if($rowcount_check_exits>0){
                                        $row_result_query_get_quantity_sky007vn=mysqli_fetch_array($result_query_get_quantity_sky007vn);                                 
                                        $item_id_sky007vn=$row_result_query_get_quantity_sky007vn['post_id'];  
                                        mysqli_query($db_sky007,"UPDATE aowp_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_sky007vn' AND meta_key='_stock'");    
                                     }                                                                 
                                                                    
                                }
                                if($warehouse =="0" && $customer_type=="_bbiavn"){
                                     $result_query_get_quantity_bbiavn=mysqli_query($db_bbia,"SELECT post_id FROM wp_postmeta WHERE  meta_value='$sku'AND meta_key='_sku'");
                                     $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_bbiavn);
                                     if($rowcount_check_exits>0){
                                        $row_result_query_get_quantity_bbiavn=mysqli_fetch_array($result_query_get_quantity_bbiavn);                                 
                                        $item_id_bbiavn=$row_result_query_get_quantity_bbiavn['post_id'];   
                                        mysqli_query($db_bbia,"UPDATE wp_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_bbiavn' AND meta_key='_stock'");    
                                     }

                               }
                               if($warehouse =="0" && $customer_type=="_mixsoon_web"){
                                     $result_query_get_quantity_mixsoon_web=mysqli_query($db_mixsoon,"SELECT post_id FROM `wp_postmeta` WHERE  meta_value='$sku'AND meta_key='_sku'");
                                     $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_mixsoon_web);
                                     if($rowcount_check_exits>0){
                                         $row_result_query_get_quantity_mixsoon_web=mysqli_fetch_array($result_query_get_quantity_mixsoon_web);                                 
                                         $item_id_mixsoon_web=$row_result_query_get_quantity_mixsoon_web['post_id'];   
                                         mysqli_query($db_mixsoon,"UPDATE `wp_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_mixsoon_web' AND meta_key='_stock'");                                

                                     }
                               }
                               if($warehouse =="0" && $customer_type=="_wholesaler"){
                                     $result_query_get_quantity_wholesaler=mysqli_query($db_wholesaler,"SELECT post_id FROM `wpws_postmeta` WHERE  meta_value='$sku'AND meta_key='_sku'");
                                     $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_wholesaler);
                                     if($rowcount_check_exits>0){
                                         $row_result_query_get_quantity_wholesaler=mysqli_fetch_array($result_query_get_quantity_wholesaler);                                 
                                         $item_id_wholesaler=$row_result_query_get_quantity_wholesaler['post_id'];   
                                         mysqli_query($db_wholesaler,"UPDATE `wpws_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_wholesaler' AND meta_key='_stock'");  
                                         mysqli_query($db_wholesaler,"UPDATE `wpws_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_wholesaler' AND meta_key='_total_stock_quantity'");                               

                                     }
                               }
                               if($warehouse==0 && $customer_type=="_hince_web"){
                                    $result_query_get_quantity_hince_web=mysqli_query($db_hince,"SELECT post_id FROM wp_hince_postmeta WHERE  meta_value='$sku' AND meta_key='_sku'");
                                    $row_result_query_get_quantity_hince_web=mysqli_fetch_array($result_query_get_quantity_hince_web);                                  
                                    $item_id_hince_web=$row_result_query_get_quantity_hince_web['post_id'];
                                    $qty_affter_affect=$stock_update;     
                                    if($item_id_hince_web!=""){
                                        mysqli_query($db_hince,"UPDATE wp_hince_postmeta SET meta_value ='$qty_affter_affect' WHERE post_id='$item_id_hince_web' AND meta_key='_stock'");                                       
                                        if($qty_affter_affect>0){
                                            mysqli_query($db_hince,"UPDATE `wp_hince_postmeta` SET `meta_value` ='instock' WHERE  `post_id`='$item_id_hince_web' AND `meta_key`='_stock_status'");
                                            
                                        }
                                        
                                    }
                                }
                                $string_comment_for_log="Update Order , order id :$order_id, item $id_item_new , stock quantity before : $stock_total , stock quantity affter : $stock_update_total , quantity order old :$quantity_item_old ,quantity order new : $quantity_item_new,($customer_type : $stock  ~ $stock_update ) ,action :success";
                                if($warehouse =="0" && $customer_type=="_eglips"){
                                    $string_comment_for_log="Update Order , order id :$order_id, item $id_item_new , stock quantity before : $stock , stock quantity affter : $stock_update ,($customer_type : $stock ~ $stock_update ),action :success";
                                    mysqli_query($db,"UPDATE `$str_warehouse` SET stock$customer_type ='$stock_update' WHERE `product_id`='$id_item_new'");                                                                 
                                    mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$id_item_new','$stock','$stock_update','$string_comment_for_log','$today','$name_manager','1','$warehouse')");
                                }else if($warehouse =="1" && ($customer_type=="_web" || $customer_type=="_watsons")){
                                    $string_comment_for_log="Update Order , order id :$order_id, item $id_item_new , stock quantity before : $stock , stock quantity affter : $stock_update ,($customer_type : $stock ~ $stock_update ),action :success";
                                    mysqli_query($db,"UPDATE `$str_warehouse` SET stock$customer_type ='$stock_update' WHERE `product_id`='$id_item_new'");                                                                 
                                    mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$id_item_new','$stock','$stock_update','$string_comment_for_log','$today','$name_manager','1','$warehouse')");
                                }else{
                                    mysqli_query($db,"UPDATE `$str_warehouse` SET stock$customer_type ='$stock_update',stock_total='$stock_update_total' WHERE `product_id`='$id_item_new'");                                                                 
                                    mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$id_item_new','$stock_total','$stock_update_total','$string_comment_for_log','$today','$name_manager','1','$warehouse')");
                                }
                                
                              //  mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$id_item_new','$stock_total','$stock_update_total','$string_comment_for_log','$today','$name_manager','1','$warehouse')");  
                              //  mysqli_query($db,"UPDATE `$str_warehouse` SET stock$customer_type ='$stock_update',stock_total='$stock_update_total' WHERE `product_id`='$id_item_new'");
                                                            
                            }  
                        }              
                        $list_item_old_different=array();         
                        for($i=0;$i<count($arr_old_item);$i++){
                            
                            $flag_check_return_stock="false";
                            $id_item_old=$arr_old_item[$i]["product_id"];
                            $quantity_item_old=$arr_old_item[$i]["quantity"];
                            for($j=0;$j<count($arr_new_item);$j++){
                                if($id_item_old==$arr_new_item[$j]["product_id"]){
                                    $flag_check_return_stock="true";
                                }
                            }
                            if($flag_check_return_stock=="false"){
                                $result_check_stock_each_item=mysqli_query($db,"SELECT `stock$customer_type` AS `stock` ,stock_total,sku FROM `$str_warehouse` WHERE `product_id`='$id_item_old'");
                                while($row_check_stock_each_item=mysqli_fetch_array($result_check_stock_each_item)){ 
                                    $stock=$row_check_stock_each_item["stock"];
                                    $stock_total=$row_check_stock_each_item["stock_total"];
                                    $sku=$row_check_stock_each_item["sku"];
                                    $stock_update=intval($stock)+$quantity_item_old;   
                                    $stock_update_total=intval($stock_total)+$quantity_item_old;
                                    if($str_customer=="1" && $warehouse=="0"){                             
                                        $result_query_get_quantity_sky007vn=mysqli_query($db_sky007,"SELECT post_id FROM aowp_postmeta WHERE  meta_value='$sku'AND meta_key='_sku'");
                                        $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_sky007vn);
                                        if($rowcount_check_exits>0){
                                            $row_result_query_get_quantity_sky007vn=mysqli_fetch_array($result_query_get_quantity_sky007vn);                                 
                                            $item_id_sky007vn=$row_result_query_get_quantity_sky007vn['post_id'];   
                                            mysqli_query($db_sky007,"UPDATE aowp_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_sky007vn' AND meta_key='_stock'");
                                        } 
                                    }
                                    if($warehouse =="0" && $customer_type=="_bbiavn"){
                                     $result_query_get_quantity_bbiavn=mysqli_query($db_bbia,"SELECT post_id FROM wp_postmeta WHERE  meta_value='$sku'AND meta_key='_sku'");
                                     $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_bbiavn);
                                     if($rowcount_check_exits>0){
                                         $row_result_query_get_quantity_bbiavn=mysqli_fetch_array($result_query_get_quantity_bbiavn);                                 
                                         $item_id_bbiavn=$row_result_query_get_quantity_bbiavn['post_id'];    
                                         mysqli_query($db_bbia,"UPDATE wp_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_bbiavn' AND meta_key='_stock'");
                                     }                                 
                                   }if($warehouse =="0" && $customer_type=="_mixsoon_web"){
                                     $result_query_get_quantity_mixsoonvn=mysqli_query($db_mixsoon,"SELECT post_id FROM wp_postmeta WHERE  meta_value='$sku'AND meta_key='_sku'");
                                     $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_mixsoonvn);
                                     if($rowcount_check_exits>0){
                                         $row_result_query_get_quantity_mixsoonvn=mysqli_fetch_array($result_query_get_quantity_mixsoonvn);                                 
                                         $item_id_mixsoonvn=$row_result_query_get_quantity_mixsoonvn['post_id']; 
                                          mysqli_query($db_mixsoon,"UPDATE wp_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_mixsoonvn' AND meta_key='_stock'");
                                     }                                 
                                   }
                                   if($warehouse =="0" && $customer_type=="_wholesaler"){
                                     $result_query_get_quantity_wholesaler=mysqli_query($db_wholesaler,"SELECT post_id FROM wpws_postmeta WHERE  meta_value='$sku'AND meta_key='_sku'");
                                     $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_wholesaler);
                                     if($rowcount_check_exits>0){
                                         $row_result_query_get_quantity_wholesaler=mysqli_fetch_array($result_query_get_quantity_wholesaler);                                 
                                         $item_id_wholesaler=$row_result_query_get_quantity_wholesaler['post_id']; 
                                          mysqli_query($db_wholesaler,"UPDATE wpws_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_wholesaler' AND meta_key='_stock'");
                                          mysqli_query($db_wholesaler,"UPDATE wpws_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_wholesaler' AND meta_key='_total_stock_quantity'");
                                     }                                 
                                   }
                                   if($warehouse =="1" && $customer_type=="_eglips"){
                                     $result_query_get_quantity_eglips=mysqli_query($db_eglips,"SELECT post_id FROM wp_eglips_postmeta WHERE  meta_value='$sku'AND meta_key='_sku'");
                                     $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_eglips);
                                     if($rowcount_check_exits>0){
                                         $row_result_query_get_quantity_eglips=mysqli_fetch_array($result_query_get_quantity_eglips);                                 
                                         $item_id_eglips=$row_result_query_get_quantity_eglips['post_id']; 
                                          mysqli_query($db_eglips,"UPDATE wp_eglips_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_eglips' AND meta_key='_stock'");
                                     }                                 
                                   }
                                   $string_comment_for_log="Update Order , order id :$order_id, item $id_item_old , stock quantity before : $stock_total , stock quantity affter : $stock_update_total , quantity order old :$quantity_item_old ,quantity order new : 0, ($customer_type : $stock  ~ $stock_update ) ,action :success";
                                    
                                    if($warehouse =="0" && $customer_type=="_eglips" ){
                                        $string_comment_for_log="Update Order , order id :$order_id, item $id_item_old , stock quantity before : $stock , stock quantity affter : $stock_update ,($customer_type : $stock ~ $stock_update ),action :success";
                                        mysqli_query($db,"UPDATE `$str_warehouse` SET stock$customer_type ='$stock_update' WHERE `product_id`='$id_item_old'");                                                                 
                                        mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$id_item_old','$stock','$stock_update','$string_comment_for_log','$today','$name_manager','1','$warehouse')");
                                    }else if($warehouse =="1" && ($customer_type=="_web"  || $customer_type=="_watsons" )){
                                        $string_comment_for_log="Update Order , order id :$order_id, item $id_item_old , stock quantity before : $stock , stock quantity affter : $stock_update ,($customer_type : $stock ~ $stock_update ),action :success";
                                        mysqli_query($db,"UPDATE `$str_warehouse` SET stock$customer_type ='$stock_update' WHERE `product_id`='$id_item_old'");                                                                 
                                        mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$id_item_old','$stock','$stock_update','$string_comment_for_log','$today','$name_manager','1','$warehouse')");
                                    }else{
                                        mysqli_query($db,"UPDATE `$str_warehouse` SET stock$customer_type ='$stock_update',stock_total='$stock_update_total' WHERE `product_id`='$id_item_old'");                                                                 
                                        mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$id_item_old','$stock_total','$stock_update_total','$string_comment_for_log','$today','$name_manager','1','$warehouse')");
                                    }
                                    
                                }
                               
                            }
                        }
                         $result_total_price_of_order=mysqli_query($db,"SELECT SUM(oim.meta_value) as `total`
                                                                            FROM `aowp_woocommerce_order_items` oi
                                                                             LEFT JOIN `aowp_woocommerce_order_itemmeta` oim ON oi.order_item_id=oim.order_item_id
                                                                            WHERE oim.meta_key='_line_total'
                                                                            AND oi.order_id='$order_id'");
                           while($row_total_price=mysqli_fetch_array($result_total_price_of_order)){ 
                                $total_price=intval($row_total_price["total"]);
                                $total_order=$total_price+intval($shippingfee);                            
                                mysqli_query($db,"UPDATE `aowp_postmeta` SET meta_value='$total_order' WHERE meta_key='_order_total' AND post_id='$order_id'");               
                           }                
                }
              mysqli_query($db,"UPDATE `tb_ord_note` SET `mg_update` ='$name_manager',`time_update`='$today' WHERE order_id='$order_id'");
            
            }
             echo("Update Succeed .");
         }else{
            echo ("This Order Wrong ! Please Contact To Admin .");
         }        
          
            common_close_connect($db_bbia);
            common_close_connect($db);
            common_close_connect($db_sky007);
            common_close_connect($db_mixsoon);
            common_close_connect($db_wholesaler);
            common_close_connect($db_eglips);
            common_close_connect($db_hince);
        }
        public function sv_order_management_update_order_infor_order_delete($order_id){
            $db=common_connect();
           $query="SELECT p.id,
                    	CONCAT_WS(' ',pm_first_name.meta_value,pm_last_name.meta_value) AS `name`,   
                    	pm_address.meta_value AS `address`, 
                    	pm_email.meta_value AS `email`, 
                    	pm_city.meta_value AS `city`, 
                    	oim_shipping_state.meta_value AS `shipping_state`,
                    	pm_shipping.meta_value AS `shipping_fee` ,
                    	pm_pay_method.meta_value AS `pay_method`,
                    	n.`ord_category` AS `customer_type`,
                    	n.`ord_parent_id` AS `parent_id`,
                        n.`shop_delivery_id` AS `delivery_id` ,
                    	p.post_excerpt AS `note`,
                        n.mg_id,
                        n.date_time,
                        n.mg_delete,
                        n.time_delete,
                        n.mg_cancel,
                        n.time_cancel,
                        n.reason_cancel
                       
                    	
                    FROM `aowp_posts` p
                    	LEFT JOIN `aowp_postmeta` pm_first_name ON pm_first_name.post_id=p.id
                    	LEFT JOIN `aowp_postmeta` pm_last_name ON pm_last_name.post_id=p.id
                    	LEFT JOIN `aowp_postmeta` pm_address ON pm_address.post_id=p.id	
                    	LEFT JOIN `aowp_postmeta` pm_city ON pm_city.post_id=p.id	 
                    	LEFT JOIN `aowp_postmeta` pm_pay_method ON pm_pay_method.post_id=p.id	
                    	LEFT JOIN `aowp_postmeta` pm_email ON pm_email.post_id=p.id		
                    	LEFT JOIN `aowp_postmeta` pm_shipping ON pm_shipping.post_id=p.id	
                    	LEFT JOIN `tb_ord_note` n ON n.order_id=p.id
                    	LEFT JOIN `aowp_woocommerce_order_items` oi ON oi.order_id=p.id	
                    	LEFT JOIN  `aowp_woocommerce_order_itemmeta` oim_shipping_state ON oim_shipping_state.order_item_id=oi.order_item_id
                    WHERE pm_first_name.meta_key='_billing_first_name' AND pm_last_name.meta_key='_billing_last_name'
                    	AND pm_address.meta_key='_billing_address_1'
                    	AND pm_city.meta_key='_billing_city'
                    	AND pm_pay_method.meta_key='_payment_method_title'	
                    	AND pm_email.meta_key='_billing_email'		
                    	AND pm_shipping.meta_key='_order_shipping'
                    	AND oi.order_item_type='shipping'
                    	AND oim_shipping_state.meta_key='method_id'
                    	AND p.id ='$order_id'";                                     
           $result=mysqli_query($db,$query) ;
           $rows=array();
            while($row=mysqli_fetch_array($result)){ 
                array_push($rows,$row);               
            }  
            $query_get_item="SELECT IF(oim_variation_id.meta_value='0', oim_item_id.meta_value,oim_variation_id.meta_value) AS `item_id`,oi.order_item_name AS `item_name` ,oim_item_quantity.meta_value AS `quantity` ,oim_line_total.meta_value AS `price` , oim_variation_id.meta_value AS `id_variation`
                        FROM aowp_woocommerce_order_items oi
                        	LEFT JOIN aowp_woocommerce_order_itemmeta oim_item_id ON oi.order_item_id=oim_item_id.order_item_id
                        	LEFT JOIN aowp_woocommerce_order_itemmeta oim_item_quantity ON oi.order_item_id=oim_item_quantity.order_item_id
                        	LEFT JOIN aowp_woocommerce_order_itemmeta oim_line_total ON oi.order_item_id=oim_line_total.order_item_id
                        	LEFT JOIN aowp_woocommerce_order_itemmeta oim_variation_id ON oi.order_item_id=oim_variation_id.order_item_id                    	
                        	
                        WHERE oi.order_item_type='line_item' 
                        	AND oim_item_id.meta_key='_product_id'
                        	AND oim_item_quantity.meta_key='_qty'
                        	AND oim_line_total.meta_key='_line_total'
                        	AND oim_variation_id.meta_key='_variation_id'		
                        	AND order_id='$order_id'";
           // echo json_encode($rows);
           $result_get_item=mysqli_query($db,$query_get_item) ;
           $rows_get_item=array();
            while($row=mysqli_fetch_array($result_get_item)){ 
                $item_name=$row["item_name"];
                $item_variation=$row["id_variation"];
                if($row["id_variation"]!=0){
                    $result_item_color=mysqli_query($db,"SELECT meta_value AS `color` FROM `aowp_postmeta` WHERE meta_key='attribute_pa_color' AND post_id='$item_variation'");
                     while($row_item_color=mysqli_fetch_array($result_item_color)){ 
                        $item_name=$item_name." ".$row_item_color["color"];
                     }
                     
                }
                $row=array("item_id"=>$row["item_id"],"order_item_name"=>$item_name,"quantity"=>$row["quantity"],"price"=>$row["price"]);           
                array_push($rows_get_item,$row);                       
            }
            $arr_data=array("infor_order"=>$rows,"item_order"=>$rows_get_item,);
            echo json_encode($arr_data);
            common_close_connect($db);
        }
        public function sv_order_management_update_order_insert_delivery(){           
            /* $db= common_connect();
             $res= mysqli_query($db,"INSERT INTO tb_ord_delivery (order_id)  
                                     SELECT p.id
                                        FROM aowp_posts AS p
                                        WHERE (p.post_status !='trash' AND  p.post_status !='wc-cancelled' )AND p.post_type='shop_order' AND p.post_date> '2018-08-14'
                                        	AND p.id NOT IN(SELECT order_id FROM tb_ord_delivery  WHERE d_id>'140000') 
                                        GROUP BY p.ID");      
             common_close_connect($db);*/
        }
        public function sv_order_management_update_order_by_excel($data){
            $db= common_connect();
            $flag="true";
           // echo($data);exit(1);
          
           date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s");
            for($i=0;$i<count($data);$i++){
                $order_id=$data[$i]["order_id"];
                $delivery_company=$data[$i]["delivery_company"];
                $arrive_date=$data[$i]["arrive_date"];
                $delivery_id=$data[$i]["delivery_id"];
                $delivery_fee=$data[$i]["delivery_fee"];
                if($order_id=="" || !ctype_digit($order_id) ){
                    $flag="Have one row Order ID equal null !";
                    echo($flag);
                  // echo($i);
                    common_close_connect($db);
                    exit(1);    
                }else{
                    if(!ctype_digit($delivery_company)) { //check number
                        $flag="Order ID $order_id wrong delivery company !";
                        echo($flag);
                        common_close_connect($db);
                        exit(1);
                    }else if(!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$arrive_date)){
                        $flag="Order ID $order_id wrong date format !";
                        echo($flag);
                        common_close_connect($db);
                        exit(1);
                    }else if(!ctype_digit($delivery_fee)){
                        $flag="Order ID $order_id wrong shipping fee !";
                        echo($flag);
                        common_close_connect($db);
                        exit(1);
                    }else{
                        $status_order="";
                       // $payment="";
                         $result=mysqli_query($db,"SELECT p.id,p.post_status 
                                                    FROM aowp_posts p                                                    	
                                                    WHERE p.id='$order_id'");
                         while($row=mysqli_fetch_array($result)){                     
                                  $status_order=$row["post_status"];
                                 // $payment= $row["payment"];          
                         }  
                         if($status_order=="trash" || $status_order=="wc-cancelled" || $status_order=="wc-completed"){
                            $flag="Order ID $order_id status is $status_order please check agian .";
                            echo($flag);
                            common_close_connect($db);
                            exit(1);
                         }                       
                         
                    }
                   
                }
                
                
            }
            if($flag=="true"){                
                 for($i=0;$i<count($data);$i++){
                    $order_id=$data[$i]["order_id"];
                    $delivery_company=$data[$i]["delivery_company"];
                    $arrive_date=$data[$i]["arrive_date"];
                    $delivery_id=$data[$i]["delivery_id"];
                    $delivery_fee=$data[$i]["delivery_fee"];                  
                /*    $payment="";
                     $result=mysqli_query($db,"SELECT p.id,pm.meta_value AS `payment` ,n.`ord_category`
                                                FROM aowp_posts p
                                                	LEFT JOIN`aowp_postmeta` pm ON p.id=pm.post_id
                                                    LEFT JOIN `tb_ord_note` n on p.id=n.order_id
                                                WHERE p.id='$order_id' AND pm.meta_key='_payment_method_title'");
                     while($row=mysqli_fetch_array($result)){ 
                              $payment= $row["payment"];
                              $shopmall= $row["ord_category"]  ;       
                     }     */  
                                
                   /* if($payment=="Bank Transfer" || $payment=="Thanh to�n qua ng�n h�ng" || $shopmall=="7")
                    {
                       
                    }else{          */            
                         mysqli_query($db,"UPDATE  `aowp_posts` SET post_status='wc-completed' WHERE id='$order_id'") ;
                //    }
                    mysqli_query($db,"UPDATE `tb_ord_delivery` SET `d_shipping_id`='$delivery_id',`d_shipping_fee`='$delivery_fee',`d_company`='$delivery_company',`d_pay_status`='1',`d_dateofarrive`='$arrive_date',`status`='wc-completed',`order_time_completed`='$today'  WHERE order_id='$order_id'");
                    
                }
                
            }      
             echo($flag);
             common_close_connect($db);
        }
        public function sv_order_management_update_order_by_excel_shipping_fee($data){
            $db= common_connect();
            $flag="true";
           // echo($data);exit(1);
           date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s");
            for($i=0;$i<count($data);$i++){
                $order_id=$data[$i]["order_id"];
                $delivery_company=$data[$i]["delivery_company"];
                $arrive_date=$data[$i]["arrive_date"];
                $delivery_id=$data[$i]["delivery_id"];
                $delivery_fee=$data[$i]["delivery_fee"];
                if($order_id=="" || !ctype_digit($order_id) ){
                    $flag="Have one row Order ID equal null !";
                    echo($flag);
                  // echo($i);
                    common_close_connect($db);
                    exit(1);    
                }else{
                    if(!ctype_digit($delivery_company)) { //check number
                        $flag="Order ID $order_id wrong delivery company !";
                        echo($flag);
                        common_close_connect($db);
                        exit(1);
                    }else if(!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$arrive_date)){
                        $flag="Order ID $order_id wrong date format !";
                        echo($flag);
                        common_close_connect($db);
                        exit(1);
                    }else if(!ctype_digit($delivery_fee)){
                        $flag="Order ID $order_id wrong shipping fee !";
                        echo($flag);
                        common_close_connect($db);
                        exit(1);
                    }else{                                          
                         mysqli_query($db,"UPDATE `tb_ord_delivery` SET `d_shipping_id`='$delivery_id',`d_shipping_fee`='$delivery_fee',`d_company`='$delivery_company',`d_pay_status`='1',`d_dateofarrive`='$arrive_date',`status`='wc-completed',`order_time_completed`='$today'  WHERE order_id='$order_id'");
                    }                   
                }
                                
            }          
            echo($flag);
            common_close_connect($db);
        }
        public function sv_order_management_update_order_by_excel_complete($data){
            $db= common_connect();
            $flag="true";          
           // echo($data);exit(1);
            for($i=0;$i<count($data);$i++){
                $order_id=$data[$i]["order_id"];
               
                if($order_id=="" || !ctype_digit($order_id) ){
                    $flag="Have one row Order ID equal null !";
                    echo($flag);
                  // echo($i);
                    common_close_connect($db);
                    exit(1);    
                }else{
                     $status_order="";
                     $check_infor="";
                     $result=mysqli_query($db,"SELECT p.id,p.post_status ,d.status 
                                                FROM aowp_posts p
                                                left join  tb_ord_delivery d on p.id=d.order_id                                                       	
                                                WHERE p.id='$order_id'");
                     while($row=mysqli_fetch_array($result)){                     
                              $status_order=$row["post_status"];
                              $check_infor = $row["status"];          
                     }  
                     if($status_order=="trash" || $status_order=="wc-cancelled" || $status_order=="wc-completed"){
                        $flag="Order ID $order_id status is $status_order please check agian .";
                        echo($flag);
                        common_close_connect($db);
                        exit(1);
                     }
                     if($check_infor=="0"){
                        $flag="Order ID $order_id not enough information please check it .";
                        echo($flag);
                        common_close_connect($db);
                        exit(1);
                     }   
                    
                                     
                }
                                
            }        
            
            if($flag=="true"){
                 for($i=0;$i<count($data);$i++){
                    $order_id=$data[$i]["order_id"];
                    mysqli_query($db,"UPDATE  `aowp_posts` SET post_status='wc-completed' WHERE id='$order_id'") ;
                 }  
            }
            echo($flag);
            common_close_connect($db);
        }
        
        public function sv_order_management_update_order_cancel_by_excel_check($data){     
            $flag="true";
            $flag_check="true";
            for($i=0;$i<count($data);$i++){
                $order_id=$data[$i]["order_id"];
                $delivery_company=$data[$i]["delivery_company"];
                $arrive_date=$data[$i]["arrive_date"];
                $delivery_id=$data[$i]["delivery_id"];
                $delivery_fee=$data[$i]["delivery_fee"];
                $reason_cancell=$data[$i]["reason_cancell"];
                if($order_id=="" || !ctype_digit($order_id) ){
                    $flag="Have one row Order ID equal null !";
                    $flag_check="false";
                    echo($flag);
                    exit(1);    
                }else{
                    if(!ctype_digit($delivery_company)) { //check number
                        $flag="Order ID $order_id wrong delivery company !";
                        $flag_check="false";
                        echo($flag);
                        exit(1);
                    }else if(!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$arrive_date)){
                        $flag="Order ID $order_id wrong date format !";
                        $flag_check="false";
                        echo($flag);
                        exit(1);
                    }else if(!ctype_digit($delivery_fee)){
                        $flag="Order ID $order_id wrong shipping fee !";
                        $flag_check="false";
                        echo($flag);
                        exit(1);
                    }else if($reason_cancell==""){
                        $flag="Order ID $order_id missing reason cancellation !";
                        $flag_check="false";
                        echo($flag);
                        exit(1);
                    }
                   
                }
                
                
            }  
          
            $db= common_connect();
            if($flag_check=="true"){
                
                for($i=0;$i<count($data);$i++){
                    $order_id=$data[$i]["order_id"];
                    $result_strShop=mysqli_query($db,"SELECT `ord_category` FROM `tb_ord_note` WHERE `order_id`='$order_id'");
                    $count_check_exist=mysqli_num_rows($result_strShop); 
                    if($count_check_exist=="0"){
                        $flag="Order ID :$order_id Can't Find .";
                        echo($flag);
                        exit(1); 
                    } 
                    
                    $result_check_order_id_trash=mysqli_query($db,"SELECT p.post_status AS `status` FROM `aowp_posts` p WHERE p.id='$order_id'");
                    while($row_check_order_id_trash=mysqli_fetch_array($result_check_order_id_trash)){
                        $status_order=$row_check_order_id_trash["status"];
                        if($status_order=="trash" || $status_order=="wc-cancelled" || $status_order=="wc-completed"){
                            echo("Order ID :$order_id is $status_order .");
                            exit(1);
                        }
                    } 
                }
            }    
             echo ($flag);
             common_close_connect($db);
        }
        public function sv_order_management_update_order_cancel_by_excel($data,$mg_name){
          //  echo 123;
                   
            for($i=0;$i<count($data);$i++){
                $order_id=$data[$i]["order_id"];
                $delivery_company=$data[$i]["delivery_company"];
                $arrive_date=$data[$i]["arrive_date"];
                $delivery_id=$data[$i]["delivery_id"];
                $delivery_fee=$data[$i]["delivery_fee"];
                $reason_cancell=$data[$i]["reason_cancell"];
                $obj=array("order_id"=> $order_id,
                            "mg_name"=> $mg_name,
                            "note"=> $reason_cancell);
              //      echo json_encode($obj);exit();
                $db= common_connect();   
                $check=mysqli_query($db,"SELECT `order_id` FROM `tb_ord_delivery` WHERE order_id='$order_id'");
                $count_check=mysqli_num_rows($check);
                if($count_check==0){
                    mysqli_query($db,"INSERT INTO `tb_ord_delivery`(`d_shipping_id`,`d_shipping_fee`,`d_company`,`order_id`,`d_pay_status`,`d_dateofarrive`,`status`) VALUE('$delivery_id','$delivery_fee','$delivery_company','$order_id','2','$arrive_date','wc-cancelled')");
                }else{
                          
                    mysqli_query($db,"UPDATE `tb_ord_delivery` SET `d_shipping_id`='$delivery_id',`d_shipping_fee`='$delivery_fee',`d_company`='$delivery_company',`d_pay_status`='2',`d_dateofarrive`='$arrive_date',`status`='wc-cancelled'  WHERE order_id='$order_id'");
                }
                common_close_connect($db);
                $sv= new sever_skysys();
                $abc=$sv->sv_order_management_update_order_cancelled($obj);              
            }
            
        }
        public function sv_order_management_shipping_get_order($obj){
            $start_date=$obj["start_date"];
            $end_date=$obj["end_date"];
            //$delivery_company=$obj["delivery_company"];
            $string_order="";
            $db= common_connect();
            $result=mysqli_query($db,"SELECT CONCAT_WS(' ',pm_first_name.meta_value,pm_last_name.meta_value) AS `name`, 
                                          p.id AS `order_id`,
                                          pm_phone.meta_value AS `phone`,       
                                          pm_address.meta_value AS `address`,                                  
                                          pm_total_order.`meta_value` AS `total_order`,
                                          p.post_date AS `order_date`,  
                                          p.post_status ,
                                          n.shop_order_id,
                                          IF( n.ord_category ='0','Customer Sky007',IF(n.ord_category ='7','Wholesaler',IF(n.ord_category ='5','Marketing Sky007',IF(n.ord_category ='10','Shoppe Bbia',IF(n.ord_category ='11','Shoppe Bbia Marketing',IF(n.ord_category ='14','Lotte',IF(n.ord_category ='15','Lotte Marketing',IF(n.ord_category ='18','Eglips',IF(n.ord_category ='19','Eglips Marketing',IF(n.ord_category ='20','Lazada Bbia',IF(n.ord_category ='21','Lazada Bbia Marketing',IF(n.ord_category ='22','Eglips Wholesaler',IF(n.ord_category ='24','Shopee Eglips',IF(n.ord_category ='25','Shopee Eglips Marketing',IF(n.ord_category ='26','Lazada Eglips',IF(n.ord_category ='27','Lazada Eglips Marketing',IF(n.ord_category ='28','Robins',IF(n.ord_category ='29','Robins Marketing',IF(n.ord_category ='30','Watsons',IF(n.ord_category ='31','Watson Marketing',IF(n.ord_category ='32','Wholesale Actsone',IF(n.ord_category ='33','Wholesaler Eglips',IF(n.ord_category ='16','Sendo',IF(n.ord_category ='17','Sendo Marketing',IF(n.ord_category ='34','Beautybox',IF(n.ord_category ='35','Beautybox Marketing',IF(n.ord_category ='36','Tiki',IF(n.ord_category ='37','Tiki Marketing',IF(n.ord_category ='38','Shopee C2C',IF(n.ord_category ='39','Shopee C2C Marketing',IF(n.ord_category ='40','Lazada C2C',IF(n.ord_category ='41','Lazada C2C Marketing',IF(n.ord_category ='42','Tiki Eglips',IF(n.ord_category ='43','Tiki Eglips Marketing',IF(n.ord_category ='44','Sociolla',IF(n.ord_category ='45','Sociolla Marketing',IF(n.ord_category ='46','Bbiavn',IF(n.ord_category ='47','Bbiavn Marketing',IF(n.ord_category ='48','Mixsoon',IF(n.ord_category ='49','Mixsoon Marketing',IF(n.ord_category ='50','Guardian',IF(n.ord_category ='51','Guardian Marketing',IF(n.ord_category ='52','Shopee Mixsoon',IF(n.ord_category ='53','Shopee Mixsoon Marketing',IF(n.ord_category ='54','Lazada Mixsoon',
                                          IF(n.ord_category ='55','Lazada Mixsoon Marketing',IF(n.ord_category ='58','Tiktok',IF(n.ord_category ='59','Tiktok Marketing',IF(n.ord_category ='60','Tiktok mixsoon',IF(n.ord_category ='61','Tiktok mixsoon marketing',IF(n.ord_category ='62','Watson Bbia',IF(n.ord_category ='63','Watson Bbia Marketing',IF(n.ord_category ='64','Hince Website',IF(n.ord_category ='65','Hince Website Marketing',IF(n.ord_category ='66','Hince Shopee',IF(n.ord_category ='67','Hince Shopee Marketing',IF(n.ord_category ='68','Hince Lazada',IF(n.ord_category ='69','Hince Lazada Marketing',IF(n.ord_category ='70','Hince Tiktok',IF(n.ord_category ='71','Hince Tiktok Marketing',IF(n.ord_category ='72','Beautybox mixsoon','Undefined !'))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))) AS `type`
                                          FROM `aowp_posts` p  
                                        	LEFT JOIN `aowp_postmeta` pm_first_name ON pm_first_name.post_id=p.id
                                        	LEFT JOIN `aowp_postmeta` pm_last_name ON pm_last_name.post_id=p.id
                                        	LEFT JOIN `aowp_postmeta` pm_phone ON pm_phone.post_id=p.id                                        	
                                        	LEFT JOIN `aowp_postmeta` pm_total_order ON pm_total_order.post_id=p.id	
                                        	LEFT JOIN `aowp_postmeta` pm_address ON pm_address.post_id=p.id	
                                        	LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                        WHERE  p.post_type='shop_order'  AND p.post_status !='trash'   
                                        	AND pm_first_name.meta_key='_billing_first_name' AND pm_last_name.meta_key='_billing_last_name'                                        
                                        	AND pm_total_order.meta_key='_order_total'
                                        	AND pm_address.meta_key='_billing_address_1'
                                        	AND pm_phone.meta_key='_billing_phone' AND p.post_date BETWEEN '$start_date 00:00:00' AND '$end_date 23:59:00'");

            $rows=array();
             while($row=mysqli_fetch_array($result)){ 
                    $string_order.=",".$row["order_id"];
                    array_push($rows,$row);               
                }
            $string_order=substr($string_order,1);
            $result_delivery=mysqli_query($db,"SELECT order_id,
                                                    IF(d_company=0,'No Shipping',IF(d_company=1,'VIETTEL POST',IF(d_company=2,'VIETNAM POST(EMS)',IF(d_company=3,'TASETCO',IF(d_company=4,'Saigonship',IF(d_company=5,'Direct',IF(d_company=6,'GiaoHangNhanh',IF(d_company=7,'GiaoHangTietKiem',IF(d_company=8,'Ecotrans',IF(d_company=9,'TPT',IF(d_company=10,'Express',IF(d_company=11,'Lazada',IF(d_company=12,'Kerry',IF(d_company=13,'J&T Express',IF(d_company=15,'Sixty',IF(d_company=16,'Ninja Van',IF(d_company=17,'DHL',IF(d_company=18,'VNC Post',IF(d_company=19,'SpeedLink',IF(d_company=20,'Tiki',IF(d_company=21,'Shopee Express',IF(d_company=22,'Best Express',IF(d_company=23,'Now Ship',IF(d_company=24,'Best Express','')))))))))))))))))))))))) AS `delivery_company`,
                                                    d_shipping_id AS `delivery_id`,d_dateofarrive AS `arrive_date`,
                                                    d_shipping_fee AS `delivery_fee`,if(d_pay_status=0,'Not Yet',if(d_pay_status=1,'Paid',if(d_pay_status=2,'cancelled',''))) as `d_pay_status`
                                                  FROM  tb_ord_delivery 
                                                  WHERE order_id IN($string_order)
                                                  GROUP BY order_id");
            $rows_delivery=array();
            while($row=mysqli_fetch_array($result_delivery)){                     
                    array_push($rows_delivery,$row);               
            }
            $arr_data=array("infor_order"=>$rows,"infor_delivery"=>$rows_delivery);
            echo json_encode($arr_data);          
            common_close_connect($db);
            
        }
        //============ End update Order =================================  
        
        public function sv_order_management_update_cancel_bs($data,$user_action){            
            $db=common_connect();
            $db_bbia=common_connect_bbia();
            $db_sky007vn=common_connect_sky007();
            $db_mixsoon=common_connect_mixsoon();
            $db_hince=common_connect_hince();
            $db_wholesaler=common_connect_wholesaler();
            
            // check list order    
            $note_cancel="cancel before sending.";         
            $name_manager=$user_action;
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s");         
            $query_check="SELECT p.id,`post_status`,n.`ord_category` FROM `aowp_posts` p LEFT JOIN `tb_ord_note` n ON p.id =n.order_id  WHERE p.id IN ($data)";
            $fcheck=0;
            $strError="";
            $result=mysqli_query($db,$query_check);           
            
            $number_of_row= mysqli_num_rows($result);
          
            if($number_of_row==0){
                $strError="Wrong format . Please check again .";
            }else{
                while($row=mysqli_fetch_array($result)){                     
                       $status_order=$row["post_status"]  ;
                       $order_id= $row["id"]  ;
                       $categories=$row["ord_category"];
                       if($status_order=="trash" || $status_order=="wc-cancelled" || $status_order=="wc-completed"){
                        $fcheck=1;
                        $strError.="order id : $order_id status is $status_order ".",";
                       }    
                       if($categories==""){
                         $fcheck=1;
                        $strError.="order id : $order_id not found ! ".",";
                       }        
                }if($fcheck==1){
                $strError=substr($strError, 0, -1);
                echo $strError;
            }else{              
             

            $array_order_id = explode(',', $data);     
            for($i=0;$i<count($array_order_id);$i++){
                $order_id=$array_order_id[$i];                
                           
                $customer_type="";      
                $result_strShop=mysqli_query($db,"SELECT `ord_category` FROM `tb_ord_note` WHERE `order_id`='$order_id'");
               
                while($row_strShop=mysqli_fetch_array($result_strShop)){ 
                            $customer_type=$row_strShop["ord_category"];
                }
                  
                  
                  if($customer_type=="5" || $customer_type=="0"  ){
                    $customer_type="_web";          
                  }else if($customer_type=="10"|| $customer_type=="11" ||$customer_type=="52"|| $customer_type=="53" || $customer_type=="66" || $customer_type=="67"){
                    $customer_type="_shopee";
                  }else if($customer_type=="7"  ||$customer_type=="50" ||$customer_type=="51" || $customer_type=="44"|| $customer_type=="45" || $customer_type=="62"|| $customer_type=="63"){
                    $customer_type="_wholesaler" ;
                  }else if($customer_type=="18"|| $customer_type=="19"|| $customer_type=="22" || $customer_type=="32"){
                    $customer_type="_eglips";
                  }else if($customer_type=="20"|| $customer_type=="21" ||$customer_type=="54"|| $customer_type=="55" ||$customer_type=="68"|| $customer_type=="69"){
                    $customer_type="_lazada";
                  }else if($customer_type=="25"|| $customer_type=="24"){
                    $customer_type="_shopee_eglips";
                  }else if($customer_type=="26"|| $customer_type=="27"){
                    $customer_type="_lazada_eglips";
                  }else if($customer_type=="30"|| $customer_type=="31"){
                    $customer_type="_watsons";
                  }else if($customer_type=="36"|| $customer_type=="37"||$customer_type=="56"|| $customer_type=="57"){
                    $customer_type="_tiki";
                  }else if($customer_type=="38"|| $customer_type=="39"){
                    $customer_type="_shopee_c2c";
                  }else if($customer_type=="42"|| $customer_type=="43"){
                    $customer_type="_tiki_eglips";
                  }/*else if($customer_type=="44"|| $customer_type=="45"){
                    $customer_type="_sociolla";
                  }*/else if($customer_type=="46"|| $customer_type=="47"){
                    $customer_type="_bbiavn";
                  }else if($customer_type=="48"|| $customer_type=="49"){
                    $customer_type="_mixsoon_web";
                  }else if($customer_type=="58"|| $customer_type=="59"){
                    $customer_type="_tiktok";
                  }else if($customer_type=="60"|| $customer_type=="61"){
                    $customer_type="_tiktok_mixsoon";
                  }else if($customer_type=="64"|| $customer_type=="65"){
                    $customer_type="_hince_web";
                  }else if($customer_type=="70"|| $customer_type=="71"){
                    $customer_type="_tiktok_hince";
                  }       
                       
                $reslut_get_item_id=mysqli_query($db,"SELECT IF(oim_variation_id.meta_value='0', oim_item_id.meta_value,oim_variation_id.meta_value) AS `item_id`,oim_item_quantity.meta_value AS `quantity`,n.warehouse
                                                        FROM aowp_woocommerce_order_items oi
                                                        	LEFT JOIN aowp_woocommerce_order_itemmeta oim_item_id ON oi.order_item_id=oim_item_id.order_item_id
                                                        	LEFT JOIN aowp_woocommerce_order_itemmeta oim_variation_id ON oi.order_item_id=oim_variation_id.order_item_id 
                                                        	LEFT JOIN aowp_woocommerce_order_itemmeta oim_item_quantity ON oi.order_item_id=oim_item_quantity.order_item_id
                                                            LEFT JOIN tb_ord_note n ON oi.order_id=n.order_id
                                                        WHERE oi.order_item_type='line_item' 
                                                        	AND oim_item_id.meta_key='_product_id'
                                                        	AND oim_variation_id.meta_key='_variation_id'	
                                                        	AND oim_item_quantity.meta_key='_qty'
                                                        	AND oi.order_id='$order_id'");
                 while($row_get_item_id=mysqli_fetch_array($reslut_get_item_id)){ 
                    $item_id=$row_get_item_id["item_id"];
                    $item_quantity=$row_get_item_id["quantity"];
                    $warehouse=$row_get_item_id["warehouse"];
                    $strwarehouse="";
                    if($warehouse=="0"){
                        $strwarehouse="tb_stock_divide";
                    }
                    else if($warehouse=="1"){
                        $strwarehouse="tb_stock_divide_hanoi";
                    }
                    $result_check_stock_each_item=mysqli_query($db,"SELECT stock$customer_type AS `stock`,stock_total ,sku FROM $strwarehouse WHERE `product_id`='$item_id'");
                                    while($row_check_stock_each_item=mysqli_fetch_array($result_check_stock_each_item)){ 
                                        $stock=$row_check_stock_each_item["stock"];
                                        $stock_total=$row_check_stock_each_item["stock_total"];
                                        $sku=$row_check_stock_each_item["sku"];
                                        $stock_update=intval($stock)+$item_quantity;    
                                        $stock_update_total= intval($stock_total)+$item_quantity;    
                                        
                                        
                                        if($warehouse =="0" && $customer_type=="_eglips" ){
                                            $string_comment_for_log="Cancelled Order BS, order id :$order_id, item $item_id , stock quantity before : $stock , stock quantity affter : $stock_update ,($customer_type : $stock ~ $stock_update) , action :success";
                                            mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$item_id','$stock','$stock_update','$string_comment_for_log','$today','$name_manager','3','$warehouse')");  
                                            mysqli_query($db,"UPDATE $strwarehouse SET stock$customer_type='$stock_update'  WHERE `product_id`= '$item_id'");
                                        }
                                        else if($warehouse =="1" && ($customer_type=="_web" || $customer_type=="_watsons" )){
                                            $string_comment_for_log="Cancelled Order BS, order id :$order_id, item $item_id , stock quantity before : $stock , stock quantity affter : $stock_update ,($customer_type : $stock ~ $stock_update) , action :success";
                                            mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$item_id','$stock','$stock_update','$string_comment_for_log','$today','$name_manager','3','$warehouse')");  
                                            mysqli_query($db,"UPDATE $strwarehouse SET stock$customer_type='$stock_update'  WHERE `product_id`= '$item_id'");
                                        }else{
                                            $string_comment_for_log="Cancelled Order BS, order id :$order_id, item $item_id , stock quantity before : $stock_total , stock quantity affter : $stock_update_total ,($customer_type : $stock ~ $stock_update) , action :success";
                                            mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`,`warehouse`) VALUE ('$item_id','$stock_total','$stock_update_total','$string_comment_for_log','$today','$name_manager','3','$warehouse')");  
                                            mysqli_query($db,"UPDATE $strwarehouse SET stock$customer_type='$stock_update' ,stock_total='$stock_update_total' WHERE `product_id`= '$item_id'");                               
                                        }
                                        
                                       
                                        if($customer_type=="_web" && $warehouse =="0" ){
                                             $result_query_get_quantity_sky007_web=mysqli_query($db_sky007vn,"SELECT post_id FROM `aowp_postmeta` WHERE  meta_value='$sku'AND meta_key='_sku'");
                                             $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_sky007_web);
                                             if($rowcount_check_exits>0){
                                                 $row_result_query_get_quantity_sky007_web=mysqli_fetch_array($result_query_get_quantity_sky007_web);                                 
                                                 $item_id_sky007_web=$row_result_query_get_quantity_sky007_web['post_id'];   
                                                 mysqli_query($db_sky007vn,"UPDATE `aowp_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_sky007_web' AND meta_key='_stock'");                                
        
                                             }                                       
                                        } 
                                        if($warehouse==0 && $customer_type=="_bbiavn"){
                                            $result_query_get_quantity_bbiavn=mysqli_query($db_bbia,"SELECT post_id FROM wp_postmeta WHERE  meta_value='$sku' AND meta_key='_sku'");
                                            $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_bbiavn);
                                            if($rowcount_check_exits>0){
                                                $row_result_query_get_quantity_bbiavn=mysqli_fetch_array($result_query_get_quantity_bbiavn);                                  
                                                $item_id_bbiavn=$row_result_query_get_quantity_bbiavn['post_id'];  
                                                 mysqli_query($db_bbia,"UPDATE wp_postmeta SET meta_value ='$stock_update' WHERE post_id='$item_id_bbiavn' AND meta_key='_stock'");                                      
                                            }                                                                                                 
                                            
                                        //    mysqli_query($db_bbia,"UPDATE `aowp_posts` SET post_status='trash' WHERE id='$item_id_bbiavn'"); 
                                        }
                                        if($warehouse =="0" && $customer_type=="_mixsoon_web"){
                                             $result_query_get_quantity_mixsoon_web=mysqli_query($db_mixsoon,"SELECT post_id FROM `wp_postmeta` WHERE  meta_value='$sku'AND meta_key='_sku'");
                                             $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_mixsoon_web);
                                             if($rowcount_check_exits>0){
                                                 $row_result_query_get_quantity_mixsoon_web=mysqli_fetch_array($result_query_get_quantity_mixsoon_web);                                 
                                                 $item_id_mixsoon_web=$row_result_query_get_quantity_mixsoon_web['post_id'];   
                                                 mysqli_query($db_mixsoon,"UPDATE `wp_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_mixsoon_web' AND meta_key='_stock'");                                
        
                                             }
                                       }
                                       if($warehouse =="0" && $customer_type=="_wholesaler"){
                                             $result_query_get_quantity_wholesaler=mysqli_query($db_wholesaler,"SELECT post_id FROM `wpws_postmeta` WHERE  meta_value='$sku'AND meta_key='_sku'");
                                             $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_wholesaler);
                                             if($rowcount_check_exits>0){
                                                 $row_result_query_get_quantity_wholesaler=mysqli_fetch_array($result_query_get_quantity_wholesaler);                                 
                                                 $item_id_wholesaler=$row_result_query_get_quantity_wholesaler['post_id'];   
                                                 mysqli_query($db_wholesaler,"UPDATE `wpws_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_wholesaler' AND meta_key='_stock'");  
                                                 mysqli_query($db_wholesaler,"UPDATE `wpws_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_wholesaler' AND meta_key='_total_stock_quantity'");                              
        
                                             }
                                       }
                                     /*  if($warehouse =="0" && $customer_type=="_hince_web"){
                                             $result_query_get_quantity_eglips=mysqli_query($db_eglips,"SELECT post_id FROM `wp_eglips_postmeta` WHERE  meta_value='$sku'AND meta_key='_sku'");
                                             $rowcount_check_exits=mysqli_num_rows($result_query_get_quantity_eglips);
                                             if($rowcount_check_exits>0){
                                                 $row_result_query_get_quantity_eglips=mysqli_fetch_array($result_query_get_quantity_eglips);                                 
                                                 $item_id_eglips=$row_result_query_get_quantity_eglips['post_id'];   
                                                 mysqli_query($db_eglips,"UPDATE `wp_eglips_postmeta` SET meta_value ='$stock_update' WHERE post_id='$item_id_eglips' AND meta_key='_stock'");                                
        
                                             }
                                       }    */                                    
                                     
                                    }                      
                 }
                 mysqli_query($db,"UPDATE `aowp_posts` SET post_status='trash' WHERE id='$order_id'");      
                 mysqli_query($db,"UPDATE `tb_ord_note` SET `mg_delete` ='$name_manager',`time_delete`='$today' , reason_delete='$note_cancel' WHERE order_id='$order_id'");
               }  
                 echo("true");
            }
            }
            
            
            //
             common_close_connect($db_bbia);
             common_close_connect($db_sky007vn);
             common_close_connect($db);
             common_close_connect($db_mixsoon);
             common_close_connect($db_wholesaler);
             common_close_connect($db_hince);
            
        }
    //============= End Order Management ================================================================================
    //============= Stock Management ====================================================================================
        //============ update stock =====================================
        public function sv_stock_management_update_stock($warehouse){
            $db=common_connect(); 
            $db_bbia=common_connect_bbia();      
            $db_sky007=common_connect_sky007();   
            $db_mixsoon=common_connect_mixsoon();        
            $str_warehouse="";
            if($warehouse=="0"){
                $str_warehouse="`tb_stock_divide`";
            }else if($warehouse=="1"){
                $str_warehouse="`tb_stock_divide_hanoi`";
            }
          /*   $result=mysqli_query($db,"SELECT p.id,pm_sku.meta_value as `sku`,p.post_title AS `name`,pm_o_price.meta_value AS `o_price`,pm_sale_price.meta_value AS `price`,sd.`stock_total` AS `total_stock`,pm_stock.meta_value AS `stock`,pm_status.meta_value AS `status` ,p.post_status
                                        FROM `aowp_posts` p
                                        	LEFT JOIN `aowp_postmeta` pm_stock ON p.id= pm_stock.post_id                                          
                                        	LEFT JOIN `aowp_postmeta` pm_sale_price ON p.id= pm_sale_price.post_id
                                        	LEFT JOIN `aowp_postmeta` pm_o_price ON p.id= pm_o_price.post_id
                                        	LEFT JOIN `aowp_postmeta` pm_status ON p.id= pm_status.post_id
                                        	LEFT JOIN `aowp_postmeta` pm_sku ON p.id= pm_sku.post_id	
                                        	LEFT JOIN $str_warehouse sd ON p.id=sd.product_id
                                        WHERE  p.post_type='product' AND p.post_status IN ('publish','private')
                                        	AND pm_stock.meta_key='_stock'
                                        	AND pm_sale_price.meta_key='_price'  
                                        	AND pm_o_price.meta_key='_regular_price'
                                        	AND pm_status.meta_key='_stock_status'  
                                        	AND pm_sku.meta_key='_sku' 
                                        	AND pm_sku.meta_value NOT LIKE '%-R'
                                        	AND p.id NOT IN( SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)
                                        	
                                            UNION                                       	
                                            SELECT p.id,pm_sku.meta_value,CONCAT(namevariation.post_title,' - ',pm_attribute_pa_color.meta_value)  AS `name`,pm_o_price.meta_value AS `o_price`, pm_sale_price.meta_value AS `price`,sd.`stock_total` AS `total_stock`,pm_stock.meta_value AS `stock` ,pm_status.meta_value AS `status`,p.post_status
                                                FROM `aowp_posts` p
                                                	LEFT JOIN `aowp_postmeta` pm_stock ON p.id= pm_stock.post_id                                                  
                                                	LEFT JOIN `aowp_postmeta` pm_sale_price ON p.id= pm_sale_price.post_id	
                                                	LEFT JOIN `aowp_postmeta` pm_o_price ON p.id= pm_o_price.post_id
                                                	LEFT JOIN `aowp_postmeta` pm_status ON p.id= pm_status.post_id	
                                                	LEFT JOIN `aowp_postmeta` pm_sku ON p.id= pm_sku.post_id	
                                                	LEFT JOIN `aowp_postmeta` pm_attribute_pa_color ON pm_attribute_pa_color.post_id=p.id                                                	
                                                	LEFT JOIN  ( SELECT id,post_title FROM   `aowp_posts`   WHERE id IN (SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)) AS `namevariation` ON p.post_parent= namevariation.id         
							LEFT JOIN $str_warehouse sd ON p.id=sd.product_id
                                                WHERE  p.post_type='product_variation' AND p.post_status IN ('publish','private')
                                                	AND pm_stock.meta_key='_stock'
                                                	AND pm_sale_price.meta_key='_price' 
                                                	AND pm_o_price.meta_key='_regular_price'
                                                	AND pm_status.meta_key='_stock_status' 
                                                	AND pm_sku.meta_key='_sku' 
                                                	AND pm_sku.meta_value NOT LIKE '%-R'
                                                	AND pm_attribute_pa_color.meta_key='attribute_pa_color'");
            
            $result_regular=mysqli_query($db,"SELECT p.id,pm_sku.meta_value as `sku`,p.post_title AS `name`,pm_o_price.meta_value AS `o_price`,pm_sale_price.meta_value AS `price`,sd.`stock_total` AS `total_stock`,pm_stock.meta_value AS `stock`,pm_status.meta_value AS `status` ,p.post_status
                                        FROM `aowp_posts` p
                                        	LEFT JOIN `aowp_postmeta` pm_stock ON p.id= pm_stock.post_id                                          
                                        	LEFT JOIN `aowp_postmeta` pm_sale_price ON p.id= pm_sale_price.post_id
                                        	LEFT JOIN `aowp_postmeta` pm_o_price ON p.id= pm_o_price.post_id
                                        	LEFT JOIN `aowp_postmeta` pm_status ON p.id= pm_status.post_id
                                        	LEFT JOIN `aowp_postmeta` pm_sku ON p.id= pm_sku.post_id	
                                        	LEFT JOIN $str_warehouse sd ON p.id=sd.product_id
                                        WHERE  p.post_type='product' AND p.post_status IN ('publish','private')
                                        	AND pm_stock.meta_key='_stock'
                                        	AND pm_sale_price.meta_key='_price'  
                                        	AND pm_o_price.meta_key='_regular_price'
                                        	AND pm_status.meta_key='_stock_status'  
                                        	AND pm_sku.meta_key='_sku' 
                                        	AND pm_sku.meta_value LIKE '%-R'
                                        	AND p.id NOT IN( SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)
                                        	
                                            UNION                                       	
                                            SELECT p.id,pm_sku.meta_value,CONCAT(namevariation.post_title,' - ',pm_attribute_pa_color.meta_value)  AS `name`,pm_o_price.meta_value AS `o_price`, pm_sale_price.meta_value AS `price`,sd.`stock_total` AS `total_stock`,pm_stock.meta_value AS `stock` ,pm_status.meta_value AS `status`,p.post_status
                                                FROM `aowp_posts` p
                                                	LEFT JOIN `aowp_postmeta` pm_stock ON p.id= pm_stock.post_id                                                  
                                                	LEFT JOIN `aowp_postmeta` pm_sale_price ON p.id= pm_sale_price.post_id	
                                                	LEFT JOIN `aowp_postmeta` pm_o_price ON p.id= pm_o_price.post_id
                                                	LEFT JOIN `aowp_postmeta` pm_status ON p.id= pm_status.post_id	
                                                	LEFT JOIN `aowp_postmeta` pm_sku ON p.id= pm_sku.post_id	
                                                	LEFT JOIN `aowp_postmeta` pm_attribute_pa_color ON pm_attribute_pa_color.post_id=p.id                                                	
                                                	LEFT JOIN  ( SELECT id,post_title FROM   `aowp_posts`   WHERE id IN (SELECT post_parent FROM `aowp_posts` WHERE post_type='product_variation' AND post_status IN ('publish','private') GROUP BY post_parent)) AS `namevariation` ON p.post_parent= namevariation.id         
							LEFT JOIN $str_warehouse sd ON p.id=sd.product_id
                                                WHERE  p.post_type='product_variation' AND p.post_status IN ('publish','private')
                                                	AND pm_stock.meta_key='_stock'
                                                	AND pm_sale_price.meta_key='_price' 
                                                	AND pm_o_price.meta_key='_regular_price'
                                                	AND pm_status.meta_key='_stock_status' 
                                                	AND pm_sku.meta_key='_sku' 
                                                	AND pm_sku.meta_value LIKE '%-R'
                                                	AND pm_attribute_pa_color.meta_key='attribute_pa_color'");   */
            
            $result_main =mysqli_query($db,"SELECT product_id,sku,product_name,stock_total FROM $str_warehouse ORDER BY product_name");
            $result_sky007=mysqli_query($db_sky007,"SELECT p.id,pm_sku.meta_value AS `sku`,p.post_title AS `name`,pm_o_price.meta_value AS `o_price`,pm_sale_price.meta_value AS `price`,
                                                    pm_stock.meta_value AS `stock`,pm_status.meta_value AS `status` ,p.post_status
                                                    FROM `aowp_posts` p
                                                	LEFT JOIN `aowp_postmeta` pm_stock ON p.id= pm_stock.post_id                                          
                                                	LEFT JOIN `aowp_postmeta` pm_sale_price ON p.id= pm_sale_price.post_id
                                                	LEFT JOIN `aowp_postmeta` pm_o_price ON p.id= pm_o_price.post_id
                                                	LEFT JOIN `aowp_postmeta` pm_status ON p.id= pm_status.post_id
                                                	LEFT JOIN `aowp_postmeta` pm_sku ON p.id= pm_sku.post_id	
                                                    
                                                    WHERE  p.post_type IN('product','product_variation') AND p.post_status IN ('publish','private')
                                                	AND pm_stock.meta_key='_stock'
                                                	AND pm_sale_price.meta_key='_price'  
                                                	AND pm_o_price.meta_key='_regular_price'
                                                	AND pm_status.meta_key='_stock_status'  
                                                	AND pm_sku.meta_key='_sku' 	
                                                	AND p.id");
            $result_bbiavn=mysqli_query($db_bbia,"SELECT p.id,pm_sku.meta_value AS `sku`,p.post_title AS `name`,pm_o_price.meta_value AS `o_price`,pm_sale_price.meta_value AS `price`,
                                                    pm_stock.meta_value AS `stock`,pm_status.meta_value AS `status` ,p.post_status
                                                    FROM `wp_posts` p
                                                	LEFT JOIN `wp_postmeta` pm_stock ON p.id= pm_stock.post_id                                          
                                                	LEFT JOIN `wp_postmeta` pm_sale_price ON p.id= pm_sale_price.post_id
                                                	LEFT JOIN `wp_postmeta` pm_o_price ON p.id= pm_o_price.post_id
                                                	LEFT JOIN `wp_postmeta` pm_status ON p.id= pm_status.post_id
                                                	LEFT JOIN `wp_postmeta` pm_sku ON p.id= pm_sku.post_id	
                                                    
                                                    WHERE  p.post_type IN('product','product_variation') AND p.post_status IN ('publish','private')
                                                	AND pm_stock.meta_key='_stock'
                                                	AND pm_sale_price.meta_key='_price'  
                                                	AND pm_o_price.meta_key='_regular_price'
                                                	AND pm_status.meta_key='_stock_status'  
                                                	AND pm_sku.meta_key='_sku' 	
                                                	AND p.id");  
             $result_mixsoon=mysqli_query($db_mixsoon,"SELECT p.id,pm_sku.meta_value AS `sku`,p.post_title AS `name`,pm_o_price.meta_value AS `o_price`,pm_sale_price.meta_value AS `price`,
                                                    pm_stock.meta_value AS `stock`,pm_status.meta_value AS `status` ,p.post_status
                                                    FROM `wp_posts` p
                                                	LEFT JOIN `wp_postmeta` pm_stock ON p.id= pm_stock.post_id                                          
                                                	LEFT JOIN `wp_postmeta` pm_sale_price ON p.id= pm_sale_price.post_id
                                                	LEFT JOIN `wp_postmeta` pm_o_price ON p.id= pm_o_price.post_id
                                                	LEFT JOIN `wp_postmeta` pm_status ON p.id= pm_status.post_id
                                                	LEFT JOIN `wp_postmeta` pm_sku ON p.id= pm_sku.post_id	
                                                    
                                                    WHERE  p.post_type IN('product','product_variation') AND p.post_status IN ('publish','private')
                                                	AND pm_stock.meta_key='_stock'
                                                	AND pm_sale_price.meta_key='_price'  
                                                	AND pm_o_price.meta_key='_regular_price'
                                                	AND pm_status.meta_key='_stock_status'  
                                                	AND pm_sku.meta_key='_sku' 	
                                                	AND p.id");                                       
                                                    
            $rows_main=array();
            while($row=mysqli_fetch_array($result_main)){ 
                    array_push($rows_main,$row);               
                }
            $rows_sky007=array();
            while($row_sky007=mysqli_fetch_array($result_sky007)){ 
                    array_push($rows_sky007,$row_sky007);               
            }
            $rows_bbiavn=array();
            while($row_bbiavn=mysqli_fetch_array($result_bbiavn)){ 
                    array_push($rows_bbiavn,$row_bbiavn);               
            }
            $rows_mixsoon=array();
            while($row_mixsoon=mysqli_fetch_array($result_mixsoon)){ 
                    array_push($rows_mixsoon,$row_mixsoon);               
            }
            $arr_data=array("list_item_main"=>$rows_main,"list_item_sky007"=>$rows_sky007,"list_item_bbiavn"=>$rows_bbiavn,"list_item_mixsoon"=>$rows_mixsoon);
            echo json_encode($arr_data);
            common_close_connect($db);
            common_close_connect($db_bbia);
            common_close_connect($db_sky007);    
            common_close_connect($db_mixsoon);     
        }
        public function sv_stock_management_update_stock_save_stock($obj){
            date_default_timezone_set('Asia/Ho_Chi_Minh');
            $db=common_connect();
            $item_id=$obj["item_id"]; 
            $stock_total=$obj["stock_total"];
            $note=$obj["note"];
            $manager_name=$obj["manager_name"];                            
            $today = date("Y-m-d H:i:s");
           
           
            $real_stock="";
             $result_stock=mysqli_query($db,"SELECT `stock_total`  FROM `tb_stock_divide` WHERE`product_id`= '$item_id'");
             while($row=mysqli_fetch_array($result_stock)){ 
                   $real_stock= $row['stock_total'];                
             }
            mysqli_query($db,"UPDATE `tb_stock_divide` SET `stock_total`= '$stock_total' WHERE `product_id`= '$item_id'");               
            mysqli_query($db,"INSERT INTO log_update_stock(`item_id`,`old_stock`,`new_stock`,`reason`,`change_time`,`id_manager`,`type_change`,`warehouse`) VALUE('$item_id','$real_stock','$stock_total','$note','$today','$manager_name','update stock total','0')");
  
          
    
            common_close_connect($db);
        }
       public function sv_stock_management_update_stock_borrow_stock_hn($obj){
            date_default_timezone_set('Asia/Ho_Chi_Minh');
            $db=common_connect();
            $item_id=$obj["item_id"];           
            $stock_eglips=intval($obj["stock_eglips"]); 
            $stock_lazada_eglips=intval($obj["stock_lazada_eglips"]);        
            $note=$obj["note"];
            $manager_name=$obj["manager_name"];   
                              
            $today = date("Y-m-d H:i:s");     
         
            $real_stock_eglips="";
            $real_stock_lazada_eglips="";
            $stock_total="";
            $stock_eglips_affter_effect="";
            $stock_lazada_eglips_affter_effect="";
            $stock_total_affter_effect="";
            $result_stock_hn=mysqli_query($db,"SELECT `stock_total`,`stock_lazada_eglips` FROM `tb_stock_divide_hanoi` WHERE`product_id`= '$item_id'");
            while($row=mysqli_fetch_array($result_stock_hn)){                 
                  $stock_total=      intval($row['stock_total']); 
                  $real_stock_lazada_eglips=      intval($row['stock_lazada_eglips']);        
            }
            $result_stock=mysqli_query($db,"SELECT `stock_eglips` FROM `tb_stock_divide` WHERE`product_id`= '$item_id'");
            while($row=mysqli_fetch_array($result_stock)){ 
                  $real_stock_eglips= intval($row['stock_eglips']); 
                         
            }
            if($stock_total<($stock_eglips + $stock_lazada_eglips)){
                echo ("Can't give more than stock total !");
                common_close_connect($db);
                die();
                
            }else{
               $stock_eglips_affter_effect=intval($real_stock_eglips)+intval($stock_eglips);
               $stock_lazada_eglips_affter_effect=intval($real_stock_lazada_eglips)+intval($stock_lazada_eglips);
               $stock_total_affter_effect=intval($stock_total)-intval($stock_eglips) -intval($stock_lazada_eglips);
               
             
               mysqli_query($db,"UPDATE `tb_stock_divide` SET `stock_eglips`= '$stock_eglips_affter_effect'  WHERE `product_id`= '$item_id'");               
               mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_total`= '$stock_total_affter_effect',`stock_lazada_eglips`='$stock_lazada_eglips_affter_effect'  WHERE `product_id`= '$item_id'");  
               
               mysqli_query($db,"INSERT INTO log_update_stock(`item_id`,`old_stock`,`new_stock`,`reason`,`change_time`,`id_manager`,`type_change`,`warehouse`) VALUE('$item_id','$stock_total','$stock_total_affter_effect','$note','$today','$manager_name','update stock total HN give to HCM','1')");
                
               if($stock_eglips!=0){
                mysqli_query($db,"INSERT INTO log_update_stock(`item_id`,`old_stock`,`new_stock`,`reason`,`change_time`,`id_manager`,`type_change`,`warehouse`) VALUE('$item_id','$real_stock_eglips','$stock_eglips_affter_effect','$note','$today','$manager_name','update stock eglips borrow','0')");
               }
               if($stock_lazada_eglips!=0){
                mysqli_query($db,"INSERT INTO log_update_stock(`item_id`,`old_stock`,`new_stock`,`reason`,`change_time`,`id_manager`,`type_change`,`warehouse`) VALUE('$item_id','$real_stock_lazada_eglips','$stock_lazada_eglips_affter_effect','$note','$today','$manager_name','update stock lazada eglips borrow','1')");
               }
               
               echo("true");
            }
                       
            common_close_connect($db);
        }
        public function sv_stock_management_update_stock_save_stock_incoming($obj){
            date_default_timezone_set('Asia/Ho_Chi_Minh');
            $db=common_connect(); 
            $item_id=$obj["item_id"];            
            $incoming_qty=intval($obj["incoming_qty"]);
            $expiration=$obj["expiration"];
            $manager_name=$obj["manager_name"]; 
            $lot_number=$obj["lot_number"];           
            $today = date("Y-m-d H:i:s");
            if($incoming_qty>0){
             $real_stock="";
             $result_stock=mysqli_query($db,"SELECT `stock_total`  FROM `tb_stock_divide` WHERE`product_id`= '$item_id'");
             while($row=mysqli_fetch_array($result_stock)){ 
               $real_stock= $row['stock_total'];                
             }  
             $total=intval($real_stock)+intval($incoming_qty);  
            // echo("INSERT INTO `tb_incoming_stock`(`pid`,`t_incoming_qty`,`in_date`,`old_stock`,`total_stock`,`expiration_date`,`lot_number`,`product_type`) value ('$item_id','$incoming_qty','$today','$real_stock','$total','$expiration','$lot_number','$product_type')") ;
             mysqli_query($db,"INSERT INTO `tb_incoming_stock`(`pid`,`t_incoming_qty`,`in_date`,`old_stock`,`total_stock`,`expiration_date`,`lot_number`,`name_manager`,`warehouse`) value ('$item_id','$incoming_qty','$today','$real_stock','$total','$expiration','$lot_number','$manager_name','0')");
             mysqli_query($db,"UPDATE `tb_stock_divide` SET `stock_total`= '$total' WHERE `product_id`= '$item_id'");
            
            }            
                  common_close_connect($db); 
        }
        public function sv_stock_management_update_stock_save_stock_hn($obj){
            date_default_timezone_set('Asia/Ho_Chi_Minh');
            $db=common_connect();
            $item_id=$obj["item_id"]; 
            $stock_total=$obj["stock_total"]; 
            $note=$obj["note"];           
            $manager_name=$obj["manager_name"];           
            $today = date("Y-m-d H:i:s");  
            
            $real_stock="";
            $result_stock=mysqli_query($db,"SELECT `stock_total`  FROM `tb_stock_divide_hanoi` WHERE`product_id`= '$item_id'");
            while($row=mysqli_fetch_array($result_stock)){ 
                   $real_stock= $row['stock_total'];                
            }
            mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_total`= '$stock_total' WHERE `product_id`= '$item_id'");               
            mysqli_query($db,"INSERT INTO log_update_stock(`item_id`,`old_stock`,`new_stock`,`reason`,`change_time`,`id_manager`,`type_change`,`warehouse`) VALUE('$item_id','$real_stock','$stock_total','$note','$today','$manager_name','update stock total','1')");
  
            
           
            common_close_connect($db);
        }
        public function sv_stock_management_update_stock_save_stock_incoming_hn($obj){
            date_default_timezone_set('Asia/Ho_Chi_Minh');
            $db=common_connect(); 
            $item_id=$obj["item_id"];            
            $incoming_qty=intval($obj["incoming_qty"]);
            $expiration=$obj["expiration"];
            $lot_number=$obj["lot_number"];
            $manager_name=$obj["manager_name"];            
            $today = date("Y-m-d H:i:s");
            if($incoming_qty>0){
             $real_stock="";
             $result_stock=mysqli_query($db,"SELECT `stock_total`  FROM `tb_stock_divide_hanoi` WHERE`product_id`= '$item_id'");
             while($row=mysqli_fetch_array($result_stock)){ 
               $real_stock= $row['stock_total'];                
             }  
             $total=intval($real_stock)+intval($incoming_qty);  
            // echo("INSERT INTO `tb_incoming_stock`(`pid`,`t_incoming_qty`,`in_date`,`old_stock`,`total_stock`,`expiration_date`,`lot_number`,`product_type`) value ('$item_id','$incoming_qty','$today','$real_stock','$total','$expiration','$lot_number','$product_type')") ;
             mysqli_query($db,"INSERT INTO `tb_incoming_stock`(`pid`,`t_incoming_qty`,`in_date`,`old_stock`,`total_stock`,`expiration_date`,`lot_number`,`name_manager`,`warehouse`) value ('$item_id','$incoming_qty','$today','$real_stock','$total','$expiration','$lot_number','$manager_name','1')");
             mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_total`= '$total' WHERE `product_id`= '$item_id'");
            
            }            
                  common_close_connect($db); 
        }
        public function sv_stock_management_update_stock_get_history_comming($item_id,$warehouse){
            $db=common_connect();
            $result_incoming=mysqli_query($db,"SELECT `pid`,`in_date`,`t_incoming_qty`,`old_stock`,`total_stock`,`expiration_date`,`lot_number` FROM `tb_incoming_stock` WHERE pid='$item_id' and warehouse='$warehouse'");
            $rows=array();
            while($row=mysqli_fetch_array($result_incoming)){ 
                    array_push($rows,$row);               
            }   
            $result_history=mysqli_query($db,"SELECT `item_id`,`old_stock`,`new_stock`,`reason`,`change_time`,id_manager AS name_manager,`type_change` FROM `log_update_stock` WHERE item_id='$item_id' and warehouse='$warehouse'");
            $rows_h=array();
            while($row=mysqli_fetch_array($result_history)){ 
                    array_push($rows_h,$row);               
            }      
            $arr_data=array("history_update"=>$rows_h,"history_incoming"=>$rows);
            echo json_encode($arr_data);
            common_close_connect($db);
        }
        public function sv_stock_management_update_stock_item_status($obj){
            $item_id=$obj["id"];            
            $item_status=$obj["item_status"];
            $db=common_connect();
            mysqli_query($db,"UPDATE `aowp_posts` SET  post_status  ='$item_status' WHERE id='$item_id'");
            common_close_connect($db);
        }
         public function sv_stock_management_update_stock_item_status_bbiavn_sky007($obj){
            $item_id=$obj["id"];            
            $item_status=$obj["item_status"]; 
            $flat=  $obj["flat"];
        //    //flat : 0 is check stock status (instock,outofstock) . 1 : status of item(publish or private)
            $db_bbiavn=common_connect_bbia();
            $db_sky007=common_connect_sky007();
            if($flat==0){
                mysqli_query($db_bbiavn,"UPDATE wp_postmeta SET meta_value='$item_status' WHERE post_id='$item_id' AND meta_key='_stock_status'");
            }else if ($flat==1){
                mysqli_query($db_bbiavn,"UPDATE `wp_posts` SET  post_status  ='$item_status' WHERE id='$item_id'");
            }else if ($flat==3){             
                mysqli_query($db_sky007,"UPDATE aowp_postmeta SET meta_value='$item_status' WHERE post_id='$item_id' AND meta_key='_stock_status'");
            }else if ($flat==4){
             //   echo "UPDATE `aowp_posts` SET  post_status  ='$item_status' WHERE id='$item_id'";
                mysqli_query($db_sky007,"UPDATE `aowp_posts` SET  post_status  ='$item_status' WHERE id='$item_id'");
            }
           
            common_close_connect($db_bbiavn);
            common_close_connect($db_sky007);
        }
        //============ End update stock =================================
        
        //============ Check stock =================================
        public function sv_stock_management_check_stock($obj){
            $warehouse=$obj["warehouse"];            
            $brain_name=$obj["brain_name"];
          //  $flat_check_combine=$obj["flat_check_combine"];
            $today = date("Y-m-d");             
            $db=common_connect();
            $rows=array();
            $rows_remaining=array();
            $result="";
            $result_order_remaining_inventory="";
            if($warehouse=="0"){
                $string_condition_brain_name="";
                if($brain_name=="0"){
                    $string_condition_brain_name=" AND product_name LIKE 'Bbia%'";
                }else if($brain_name=="1"){
                    $string_condition_brain_name=" AND product_name LIKE 'Eglips%'";
                }else if($brain_name=="2"){
                    $string_condition_brain_name=" AND product_name LIKE 'Mixsoon%'";
                }               
                                                  
             $result=mysqli_query($db,"SELECT product_id,sku,IF(sku NOT LIKE '%-R',0,1)sku_type,product_name,stock_total , stock_eglips as `stock_borrow`
                FROM tb_stock_divide
                WHERE `sku` !='' AND `sku` NOT LIKE 'SET%' AND `sku` NOT LIKE '%1-1' AND VIEW=0  AND `sku` NOT LIKE 'BA-CB%' AND `sku` NOT LIKE 'EG-CB%'  AND `sku` NOT LIKE 'EG-GF%' AND `sku` NOT LIKE 'BA-GF%' $string_condition_brain_name") ; 
             $result_order_remaining_inventory =mysqli_query($db,"SELECT p.id ,d.`product_name`,d.sku,SUM(oim_qty.meta_value) AS quantity
                                                                    FROM   `aowp_posts` p
                                                                    LEFT JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                                                    LEFT JOIN aowp_woocommerce_order_itemmeta oim_product_id ON oi.order_item_id=oim_product_id.order_item_id
                                                                    LEFT JOIN `tb_stock_divide` d ON d.`product_id`=oim_product_id.meta_value
                                                                    LEFT JOIN aowp_woocommerce_order_itemmeta oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                                                    WHERE    p.id IN (SELECT a.id
                                                                    			FROM(SELECT p.id
                                                                    			FROM aowp_posts p 
                                                                    				LEFT JOIN `tb_ord_note` AS n ON p.id=n.order_id 
                                                                    			WHERE p.post_date> '$today 00:00:00' 
                                                                    				AND p.post_type='shop_order' AND n.warehouse='0'  
                                                                    				AND (p.post_status='wc-processing' OR p.post_status='wc-pending' OR p.post_status='wc-on-hold')) a            
                                                                    				
                                                                    		 LEFT JOIN (SELECT DISTINCT order_id FROM tb_barcode_order WHERE time_get_product >'$today 00:00:00' AND status_checkin='0') b ON a.id=b.order_id
                                                                    		 WHERE   b.order_id IS NULL  )
                                                                     AND oi.order_item_type ='line_item'
                                                                     AND oim_product_id.meta_key='_product_id' 
                                                                     AND oim_qty.meta_key='_qty'
                                                                     GROUP BY d.sku");  
            }else if($warehouse=="1"){
                $string_condition_brain_name="";
                if($brain_name=="0"){
                    $string_condition_brain_name="AND product_name  LIKE 'Bbia%'";
                }else if($brain_name=="1"){
                    $string_condition_brain_name="AND product_name  LIKE 'Eglips%'";
                }else if($brain_name=="2"){
                    $string_condition_brain_name="AND product_name  LIKE 'Mixsoon%'";
                }
                 //   echo "SELECT product_id,sku,IF(sku NOT LIKE '%-R',0,1)sku_type,product_name,stock_total , stock_web as `stock_borrow` FROM tb_stock_divide_hanoi  WHERE `sku` !='' AND `sku` NOT LIKE 'SET%' AND `sku` NOT LIKE '%1-1' AND VIEW=0  AND `sku` NOT LIKE 'BA-CB%' AND `sku` NOT LIKE 'EG-CB%'  AND `sku` NOT LIKE 'EG-GF%' AND `sku` NOT LIKE 'BA-GF%' $string_condition_brain_name"; die();
                    $result=mysqli_query($db,"SELECT product_id,sku,IF(sku NOT LIKE '%-R',0,1)sku_type,product_name,stock_total , stock_web as `stock_borrow`
                     FROM tb_stock_divide_hanoi 
                     WHERE `sku` !='' AND `sku` NOT LIKE 'SET%' AND `sku` NOT LIKE '%1-1' AND VIEW=0  AND `sku` NOT LIKE 'BA-CB%' AND `sku` NOT LIKE 'EG-CB%'  AND `sku` NOT LIKE 'EG-GF%' AND `sku` NOT LIKE 'BA-GF%' $string_condition_brain_name");
                                
                $result_order_remaining_inventory =mysqli_query($db,"SELECT p.id ,d.`product_name`,d.sku,SUM(oim_qty.meta_value) AS quantity
                                                                    FROM   `aowp_posts` p
                                                                    LEFT JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                                                    LEFT JOIN aowp_woocommerce_order_itemmeta oim_product_id ON oi.order_item_id=oim_product_id.order_item_id
                                                                    LEFT JOIN `tb_stock_divide_hanoi` d ON d.`product_id`=oim_product_id.meta_value
                                                                    LEFT JOIN aowp_woocommerce_order_itemmeta oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                                                    WHERE    p.id IN (SELECT a.id
                                                                    			FROM(SELECT p.id
                                                                    			FROM aowp_posts p 
                                                                    				LEFT JOIN `tb_ord_note` AS n ON p.id=n.order_id 
                                                                    			WHERE p.post_date> '$today 00:00:00' 
                                                                    				AND p.post_type='shop_order' AND n.warehouse='1'  
                                                                    				AND (p.post_status='wc-processing' OR p.post_status='wc-pending' OR p.post_status='wc-on-hold')) a            
                                                                    				
                                                                    		 LEFT JOIN (SELECT DISTINCT order_id FROM tb_barcode_order WHERE time_get_product >'$today 00:00:00' AND status_checkin='0') b ON a.id=b.order_id
                                                                    		 WHERE   b.order_id IS NULL  )
                                                                     AND oi.order_item_type ='line_item'
                                                                     AND oim_product_id.meta_key='_product_id' 
                                                                     AND oim_qty.meta_key='_qty'
                                                                     GROUP BY d.sku");  
                    
            }
            
            while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
            } 
            while($row=mysqli_fetch_array($result_order_remaining_inventory)){ 
                    array_push($rows_remaining,$row);               
            } 
            
            $arr_data=array();
            for($i=0;$i<count($rows);$i++){
                $product_name=$rows[$i]["product_name"];
                $sku=$rows[$i]["sku"];
                $stock_total=$rows[$i]["stock_total"];
                $sku_type= $rows[$i]["sku_type"];
                $stock_borrow= $rows[$i]["stock_borrow"];
                $obj_detail="";                
                $position=""; 
                $check_exist=0;
                $check_combine=0;                
                if(count($arr_data)==0){
                    $obj_detail=["sku_h"=>$sku,"product_name"=>$product_name,"stock_total_h"=>$stock_total,"sku_r"=>"","stock_total_r"=>"0","stock_total"=>$stock_total,"stock_borrow"=>$stock_borrow];
                    array_push($arr_data,$obj_detail);
                }else{
                for($j=0;$j<count($arr_data);$j++){   
                    $sku_h_check=$arr_data[$j]["sku_h"];
                    $sku_r_check=$arr_data[$j]["sku_r"];                   
                    if($sku_type==0){
                        $sku_reverse=$sku."-R";  
                        if($sku==$sku_h_check){
                            $check_exist=1;
                        }else{
                            if($sku_reverse==$sku_r_check){
                              
                                $check_exist=1;                           
                                $check_combine=1;
                                $position=$j;
                            }
                        }                                              
                        $obj_detail=["sku_h"=>$sku,"product_name"=>$product_name,"stock_total_h"=>$stock_total,"sku_r"=>"","stock_total_r"=>"0","stock_total"=>$stock_total,"stock_borrow"=>$stock_borrow];
                    }else{   
                        $sku_reverse=substr($sku,0,-2);   
                      //  echo     $sku_reverse. "_" .$j ." ;";                  
                        if($sku==$sku_r_check){
                            $check_exist=1;
                        }else{
                            if($sku_reverse==$sku_h_check){                              
                                $check_exist=1;                                
                                $check_combine=1;
                                $position=$j;
                            }   
                        }
                        $obj_detail=["sku_h"=>"","product_name"=>$product_name,"stock_total_h"=>"0","sku_r"=>$sku,"stock_total_r"=>$stock_total,"stock_total"=>$stock_total,"stock_borrow"=>$stock_borrow];
                    }   
                }
                    if($check_exist==0){
                         array_push($arr_data,$obj_detail);                      
                    }
                    if($check_combine==1){
                        if($sku_type==0){                             
                             $arr_data[$position]["sku_h"]=$obj_detail["sku_h"]; 
                             $arr_data[$position]["stock_total_h"]=$obj_detail["stock_total_h"];
                             $arr_data[$position]["stock_total"]=$arr_data[$position]["stock_total"]+$obj_detail["stock_total"];
                             $arr_data[$position]["stock_borrow"]=$arr_data[$position]["stock_borrow"]+$obj_detail["stock_borrow"];
                        }else{
                             $arr_data[$position]["sku_r"]=$obj_detail["sku_r"]; 
                             $arr_data[$position]["stock_total_r"]=$obj_detail["stock_total_r"]; 
                             $arr_data[$position]["stock_total"]=$arr_data[$position]["stock_total"]+$obj_detail["stock_total"];
                             $arr_data[$position]["stock_borrow"]=$arr_data[$position]["stock_borrow"]+$obj_detail["stock_borrow"];
                        }
                      
                    }
                }
            }
            
            
          //  echo json_encode($arr_data);die();
            for($i=0;$i<count($arr_data);$i++){
                $product_name=$arr_data[$i]["product_name"];
                $stock_total=$arr_data[$i]["stock_total"];
                $arr_data[$i]["total_remain"]=0;
                for($j=0;$j<count($rows_remaining);$j++){
                   $name_item= $rows_remaining[$j]["product_name"];
                   $qty=$rows_remaining[$j]["quantity"];
                   if($product_name==$name_item){
                        $arr_data[$i]["total_remain"]=$qty;
                        $arr_data[$i]["stock_total"]=$stock_total."(+".$qty.")";
                        break;
                       // echo $rows[$i]["stock_total"];
                   }
                }
            }
            echo json_encode($arr_data);
            common_close_connect($db);
            
        }
        //============End  Check stock =================================
        public function sv_borrow_stock_get_list_product($stock){
            $db=common_connect();
            $wh="";
            $stock_shop="";
            $check_mixsoon_item="0";
            if($stock==1){            
                $wh="tb_stock_divide"; 
                $stock_shop="stock_total"; 
            }else if($stock==2){            
                $wh="tb_stock_divide_hanoi"; 
                $stock_shop="stock_web"; 
            }else if ($stock==7){            
                $wh="tb_stock_divide";    
                $stock_shop="stock_eglips"; 
            }else if ($stock==8){            
                $wh="tb_stock_divide_hanoi"; 
                $stock_shop="stock_watsons"; 
            }else if ($stock==3){            
                $wh="tb_stock_divide_hanoi"; 
                $stock_shop="stock_total"; 
            }else if ($stock==4){   
                $wh="tb_stock_divide"; 
                $stock_shop="stock_eglips";  
            }else if ($stock==5){            
                $wh="tb_stock_divide_hanoi";    
                $stock_shop="stock_total";  
            }else if ($stock==6){            
               $wh="tb_stock_divide_hanoi"; 
                $stock_shop="stock_watsons";
            }else if ($stock==9){            
               $wh="tb_stock_divide"; 
                $stock_shop="stock_total";
            }else if ($stock==10){            
               $wh="tb_stock_divide"; 
                $stock_shop="stock_sociolla";
            }else if($stock==11){            
                $wh="tb_stock_divide"; 
                $stock_shop="stock_total"; 
                $check_mixsoon_item=1;
            }else if($stock==12){            
                $wh="tb_stock_divide_hanoi"; 
                $stock_shop="stock_mixsoon_web"; 
                $check_mixsoon_item=1;
            }
           /*  $query="SELECT a.product_id AS `id`,a.sku,a.product_name AS `name`,a.stock_total AS `stock` ,b.product_id AS `id_regular`,b.sku AS `sku_regular`,b.stock_total AS `stock_regular`
                FROM (SELECT `product_id`,`sku`,`product_name`,$stock_shop as `stock_total` 
                FROM `$wh` WHERE sku NOT LIKE '%-R') AS a
                LEFT JOIN  (SELECT `product_id`,`sku`,`product_name`,$stock_shop as `stock_total` 
                FROM `$wh` WHERE sku  LIKE '%-R') AS b ON a.product_name=b.product_name"; */
             $query="";
             if($check_mixsoon_item==0){
                $query="SELECT product_id AS `id`,sku,product_name AS `name`,$stock_shop AS `stock`, IF( sku LIKE '%-R','Regular','Handcarry' ) AS product_type FROM `$wh` where  product_name not like'%Mixsoon%' ";
             }else{
                $query="SELECT product_id AS `id`,sku,product_name AS `name`,$stock_shop AS `stock`, IF( sku LIKE '%-R','Regular','Handcarry' ) AS product_type FROM `$wh` where  product_name  like'%Mixsoon%' ";
             }
                              
             $result=mysqli_query($db,$query);   
            
             $rows=array();
             while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
                }        
           
            echo json_encode($rows);
            common_close_connect($db);
        }
        public function sv_borrow_stock_give_and_return_stock($obj){ 
           // $warehouse=$obj["warehouse"];
            $stock=$obj["stock"];
            $list_save_item=json_encode($obj["list_item"]);
            $list_item=$obj["list_item"];
            $po_id=$obj["po_id"];
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s"); 
            $mg_name=$obj["mg_name"];
            $db=common_connect();
            $str_warehouse="";
            $wh_from="";
            $wh_to="";
            $stock_from="";
            $stock_to="";
            
           /* 1 Stock Total From (Warehouse Ho Chi Minh) To Sky007 Borrow (Warehouse Ha Noi) 
        	2 Return Stock From Sky007 Borrow (Warehouse Ha Noi) To Stock Total (Warehouse Ho Chi Minh)	
        	3 Stock Total From (Warehouse Ha Noi) To Eglips Borrow(Warehouse Ho Chi Minh)
        	4 Return Stock From Eglips Borrow(Warehouse Ho Chi Minh) To Stock Total (Warehouse Ha Noi)
        	5 Stock Total From (Warehouse Ha Noi) To Watsons
        	6 Return Stock From Watsons To Stock Total (Warehouse Ha Noi)
        	7 Stock Eglips Borrow From (Warehouse Ho Chi Minh) To Watsons
        	8 Return Stock From Watsons To Stock Eglips Borrow  (Warehouse Ho Chi Minh)
            9 Stock Total From (Warehouse Ho Chi Minh) To Sociolla
        	10 Return Stock From Sociolla To Stock Stock Total (Warehouse Ho Chi Minh)
           */
           
           if($stock==1){            
                $wh_from="tb_stock_divide"; 
                $wh_to="tb_stock_divide_hanoi";
                $stock_from="stock_total"; 
                $stock_to="stock_web";
            }else if($stock==2){            
                $wh_from="tb_stock_divide_hanoi"; 
                $wh_to="tb_stock_divide";
                $stock_from="stock_web"; 
                $stock_to="stock_total";
            }else if ($stock==7){            
                $wh_from="tb_stock_divide";  
                $wh_to="tb_stock_divide_hanoi";  
                $stock_from="stock_eglips"; 
                $stock_to="stock_watsons";
            }else if ($stock==8){            
                $wh_from="tb_stock_divide_hanoi"; 
                $wh_to="tb_stock_divide";
                $stock_from="stock_watsons"; 
                $stock_to="stock_eglips";
            }else if ($stock==3){            
                $wh_from="tb_stock_divide_hanoi"; 
                $wh_to="tb_stock_divide";
                $stock_from="stock_total"; 
                $stock_to="stock_eglips";
            }else if ($stock==4){   
                $wh_from="tb_stock_divide"; 
                $wh_to="tb_stock_divide_hanoi";
                $stock_from="stock_eglips"; 
                $stock_to="stock_total"; 
            }else if ($stock==5){            
                $wh_from="tb_stock_divide_hanoi";  
                $wh_to="tb_stock_divide_hanoi";  
                $stock_from="stock_total";  
                $stock_to="stock_watsons";
            }else if ($stock==6){            
               $wh_from="tb_stock_divide_hanoi"; 
               $wh_to="tb_stock_divide_hanoi";
                $stock_from="stock_watsons";
                $stock_to="stock_total";
            }else if ($stock==9){            
               $wh_from="tb_stock_divide"; 
               $wh_to="tb_stock_divide";
                $stock_from="stock_total";
                $stock_to="stock_sociolla";
            } else if ($stock==10){            
               $wh_from="tb_stock_divide"; 
               $wh_to="tb_stock_divide";
                $stock_from="stock_sociolla";
                $stock_to="stock_total";
            } else if($stock==11){            
                $wh_from="tb_stock_divide"; 
                $wh_to="tb_stock_divide_hanoi";
                $stock_from="stock_total"; 
                $stock_to="stock_mixsoon_web";
            }  else if($stock==12){            
                $wh_from="tb_stock_divide_hanoi"; 
                $wh_to="tb_stock_divide";
                $stock_from="stock_mixsoon_web"; 
                $stock_to="stock_total";
            }  
        //  echo($stock); exit();
            $flag_check_stock="true";
            for($i=0;$i<count($list_item);$i++){
                $product_id=$list_item[$i]["product_id"];
                $quantity=$list_item[$i]["quantity"];
               
                
                $query_get_quantity="SELECT `$stock_from` as `stock_quantity` FROM `$wh_from` WHERE `product_id`='$product_id'";               
                $result_query_get_quantity=mysqli_query($db,$query_get_quantity);
                $row_result_query_get_quantity=mysqli_fetch_array($result_query_get_quantity);
                $quantity_product=$row_result_query_get_quantity['stock_quantity'];
                $result_stock_quantity=(intval($quantity_product) -  intval($quantity));                 
                if($quantity_product=="" || $quantity_product=='0' || $result_stock_quantity<0)
                {
                    $flag_check_stock="false";
                    break;
                }
            }   
            //-----------------------------------------------------------------------------------------------------
            if($flag_check_stock=="true"){
             $string_comment_for_log_shop="Create Action : ";        
             for($i=0;$i<count($list_item);$i++){                              
                 $product_id=$list_item[$i]["product_id"];
                 $quantity=$list_item[$i]["quantity"];
                 $exp_date=$list_item[$i]["expdate"];
                 $query_get_quantity="SELECT `$stock_from` as `stock_quantity` FROM `$wh_from` WHERE `product_id`='$product_id'";
                 $result_query_get_quantity=mysqli_query($db,$query_get_quantity);
                 $row_result_query_get_quantity=mysqli_fetch_array($result_query_get_quantity);
                 
                 $quantity_stock=$row_result_query_get_quantity['stock_quantity'];
                
                 $result_stock_quantity=0;
                 $result_stock_quantity=(intval($quantity_stock) -  intval($quantity));
                 if($quantity_stock!="" && $quantity_stock!='0')
                 {                    
                    if($result_stock_quantity<0)
                    { 
                        $flag_check_stock="false";
                        break;
                    }else{                        
                        $query_get_quantity_stock_to="SELECT `$stock_to` as `stock_quantity_to` FROM `$wh_to` WHERE `product_id`='$product_id'";
                        $result_query_get_quantity_stock_to=mysqli_query($db,$query_get_quantity_stock_to);
                        $row_result_query_get_quantity_shop_to=mysqli_fetch_array($result_query_get_quantity_stock_to);
                        $quantity_shop_to=$row_result_query_get_quantity_shop_to['stock_quantity_to'];            
                        $result_stock_shop_to=0;
                        $result_stock_shop_to=(intval($quantity_shop_to) +  intval($quantity));                        
                       
                        mysqli_query($db,"UPDATE `$wh_to` SET `$stock_to`='$result_stock_shop_to' WHERE `product_id`='$product_id'");                       
                       //--------------------------------------------------------------------------------------------------------------------------------------------------
                        $result_stock_shop_from=0;
                        $result_stock_shop_from=(intval($quantity_stock) -  intval($quantity));
                        mysqli_query($db,"UPDATE `$wh_from` SET `$stock_from`='$result_stock_shop_from' WHERE `product_id`='$product_id'");
                        $string_comment_for_log_shop.=" Product ID :$product_id  Stock from $stock_from ($wh_from) qty($quantity_stock ~  $result_stock_shop_from) To $stock_to ($wh_to) qty($quantity_shop_to ~ $result_stock_shop_to) ; ";  
                       //--------------------------------------------------------------------------------------------------------------------------------------------------
                       
                       if($stock==5||$stock==7){                        
                        $result_get_quantity_stock_watsons_total=mysqli_query($db,"SELECT `stock_watsons_total` as `watsons_total` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$product_id'");
                        $row_result_get_quantity_stock_watsons_total=mysqli_fetch_array($result_get_quantity_stock_watsons_total);
                        $quantity_watsons_total=$row_result_get_quantity_stock_watsons_total['watsons_total'];                                         
                        $watsons_final=(intval($quantity_watsons_total) +  intval($quantity)); 
                        mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_watsons_total`='$watsons_final' WHERE `product_id`='$product_id'");
                        mysqli_query($db,"INSERT INTO `tb_check_exp_product`(`product_id`,`qty`,`po_id`,`exp_date`,`create_time`,`shop_type`,`status`) VALUES('$product_id','$quantity','$po_id','$exp_date','$today','1','0')");
                         
                       }
                       if($stock==6||$stock==8){
                        $result_get_quantity_stock_watsons_return=mysqli_query($db,"SELECT `stock_watsons_return` as `watsons_return` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$product_id'");
                        $row_result_get_quantity_stock_watsons_return=mysqli_fetch_array($result_get_quantity_stock_watsons_return);
                        $quantity_watsons_return=$row_result_get_quantity_stock_watsons_return['watsons_return'];                                           
                        $watsons_return=(intval($quantity_watsons_return) +  intval($quantity)); 
                        mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_watsons_return`='$watsons_return' WHERE `product_id`='$product_id'");

                       }                                                   
                    }
                   
                 }    
                 
             } 
             if($string_comment_for_log_shop!=""){
                mysqli_query($db,"INSERT INTO `tb_history_stock_borrow`(`list_items`,`create_time`,`mg_create`,`where_stock`,`po_id`) value('$list_save_item','$today','$mg_name','$stock','$po_id') ");
                $last_id = mysqli_insert_id($db);
                mysqli_query($db,"INSERT INTO `tb_log_history_borrow`(`id_history_borrow`,`log`,`create_date`,`m_create`,`action_type`) VALUE('$last_id','$string_comment_for_log_shop','$today','$mg_name','0') ");
             }                        
            
        }
        echo $flag_check_stock;
        common_close_connect($db);
            //----------------------------------------------------------------------------------------------------
            //$result=mysqli_query($db,"");
                         
        }
        public function sv_borrow_stock_get_history_stock_borrow($obj){
            $db=common_connect();
            $startdate=$obj["start_date"];
            $enddate=$obj["end_date"]; 
            $rows_list_all_product=array();
            $result_all_product=mysqli_query($db,"SELECT product_id,product_name,IF(sku  LIKE '%-R','1','0') AS product_type
                                    FROM `tb_stock_divide`");
            while($row=mysqli_fetch_array($result_all_product)){ 
                array_push($rows_list_all_product,$row);
            }    
                
            $rows=array();
            $result=mysqli_query($db,"SELECT *
                                    FROM `tb_history_stock_borrow`                                    
                                    WHERE `create_time` BETWEEN '$startdate 00:00:00' AND '$enddate 23:59:00'");
            while($row=mysqli_fetch_array($result)){ 
                $item_infor=json_decode($row["list_items"],true);
                $rows_list_infor=array();
                for($j=0;$j<count($item_infor);$j++){
                    $product_id=$item_infor[$j]["product_id"];
                    $product_name="";
                    $product_type="";
                    $expdate="";
                    if(isset($item_infor[$j]["expdate"])){
                            $expdate=$item_infor[$j]["expdate"];
                           
                    }
                    $quantity=$item_infor[$j]["quantity"];
                    for($i=0;$i<count($rows_list_all_product);$i++){
                        $item_id=$rows_list_all_product[$i]["product_id"];
                        $item_name=$rows_list_all_product[$i]["product_name"];
                        $product_type=$rows_list_all_product[$i]["product_type"];   
                        
                        if($product_id==$item_id){
                            $product_name=$item_name;
                             break;
                        }
                        
                    }
                    $list_items = array(
                        "product_id" => $product_id,
                        "product_name" => $product_name,
                        "product_type"=> $product_type,
                        "expdate"=> $expdate,
                        "quantity" => $quantity
                    );
                    array_push($rows_list_infor,$list_items);
                  
                }
                $row["list_items"]=$rows_list_infor;         
                
                array_push($rows,$row);               
            } 
            echo json_encode($rows);
            common_close_connect($db);
        }
        public function sv_borrow_stock_setting_active($obj){
            $db=common_connect();
            $history_id=$obj["history_id"];
            $active=$obj["active"];  
            $active_change="";         
            if($active=="0"){
                $active_change=1;
            }else if ($active=="1"){
                $active_change=0;
            }
          //  echo $active_change; exit();
            mysqli_query($db,"UPDATE `tb_history_stock_borrow` SET `active`='$active_change' WHERE id='$history_id'");
            
            common_close_connect($db);
        }
        public function sv_borrow_stock_delete_moving($obj){
            $db=common_connect();
            $check_status="";
            $list_item="";
            $where_stock="";
            $po_id="";
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s"); 
            $history_id=$obj["history_id"];
            $mg_name=$obj["mg_name"];
            $result_get_row=mysqli_query($db,"select * from `tb_history_stock_borrow` where id='$history_id'");
            while($row=mysqli_fetch_array($result_get_row)){ 
                  $list_item=json_decode($row["list_items"],true) ;
                  $check_status= $row["status"] ;          
                  $where_stock=$row["where_stock"]  ;
                  $po_id=$row["po_id"]  ;
            }
            if($check_status=="2"){
                echo("That ID already deleted .");
            }else{
                $wh_from="";
                $wh_to="";
                $stock_from="";
                $stock_to="";
                $flag_check_stock="true";
                if($where_stock=="1"){            
                    $wh_from="tb_stock_divide"; 
                    $wh_to="tb_stock_divide_hanoi";
                    $stock_from="stock_total"; 
                    $stock_to="stock_web";
                }else if($where_stock=="2"){            
                    $wh_from="tb_stock_divide_hanoi"; 
                    $wh_to="tb_stock_divide";
                    $stock_from="stock_web"; 
                    $stock_to="stock_total";
                }else if ($where_stock=="7"){            
                    $wh_from="tb_stock_divide";  
                    $wh_to="tb_stock_divide_hanoi";  
                    $stock_from="stock_eglips"; 
                    $stock_to="stock_watsons";
                }else if ($where_stock=="8"){            
                    $wh_from="tb_stock_divide_hanoi"; 
                    $wh_to="tb_stock_divide";
                    $stock_from="stock_watsons"; 
                    $stock_to="stock_eglips";
                }else if ($where_stock=="3"){            
                    $wh_from="tb_stock_divide_hanoi"; 
                    $wh_to="tb_stock_divide";
                    $stock_from="stock_total"; 
                    $stock_to="stock_eglips";
                }else if ($where_stock=="4"){   
                    $wh_from="tb_stock_divide"; 
                    $wh_to="tb_stock_divide_hanoi";
                    $stock_from="stock_eglips"; 
                    $stock_to="stock_total"; 
                }else if ($where_stock=="5"){            
                    $wh_from="tb_stock_divide_hanoi";  
                    $wh_to="tb_stock_divide_hanoi";  
                    $stock_from="stock_total";  
                    $stock_to="stock_watsons";
                }else if ($where_stock=="6"){            
                   $wh_from="tb_stock_divide_hanoi"; 
                   $wh_to="tb_stock_divide_hanoi";
                    $stock_from="stock_watsons";
                    $stock_to="stock_total";
                }else if ($where_stock=="9"){            
                    $wh_from="tb_stock_divide";  
                    $wh_to="tb_stock_divide";  
                    $stock_from="stock_total"; 
                    $stock_to="stock_sociolla";
                }else if ($where_stock=="10"){            
                    $wh_from="tb_stock_divide"; 
                    $wh_to="tb_stock_divide";
                    $stock_from="stock_sociolla"; 
                    $stock_to="stock_total";
                }
                for($i=0;$i<count($list_item);$i++){
                    $product_id=$list_item[$i]["product_id"];
                    $quantity=$list_item[$i]["quantity"];
                    
                    $query_get_quantity="SELECT `$stock_to` as `stock_quantity` FROM `$wh_to` WHERE `product_id`='$product_id'";               
                    $result_query_get_quantity=mysqli_query($db,$query_get_quantity);
                    $row_result_query_get_quantity=mysqli_fetch_array($result_query_get_quantity);
                    $quantity_product=$row_result_query_get_quantity['stock_quantity'];
                    $result_stock_quantity=(intval($quantity_product) -  intval($quantity));                 
                    if($quantity_product=="" || $quantity_product=='0' || $result_stock_quantity<0)
                    {
                        $flag_check_stock="false";
                        break;
                    }
                }   
                //-----------------------------------------------------------------------------------------------------
                if($flag_check_stock=="true"){
                     $string_comment_for_log_shop="Delete Action : ";        
                     for($i=0;$i<count($list_item);$i++){                              
                         $product_id=$list_item[$i]["product_id"];
                         $quantity=$list_item[$i]["quantity"];
                         $query_get_quantity="SELECT `$stock_to` as `stock_quantity` FROM `$wh_to` WHERE `product_id`='$product_id'";
                         $result_query_get_quantity=mysqli_query($db,$query_get_quantity);
                         $row_result_query_get_quantity=mysqli_fetch_array($result_query_get_quantity);
                         
                         $quantity_stock=$row_result_query_get_quantity['stock_quantity'];
                        
                         $result_stock_quantity=0;
                         $result_stock_quantity=(intval($quantity_stock) -  intval($quantity));
                         if($quantity_stock!="" && $quantity_stock!='0')
                         {                    
                            if($result_stock_quantity<0)
                            { 
                                $flag_check_stock="false";
                                break;
                            }else{                        
                                $query_get_quantity_stock_from="SELECT `$stock_from` as `stock_quantity_from` FROM `$wh_from` WHERE `product_id`='$product_id'";
                                $result_query_get_quantity_stock_from=mysqli_query($db,$query_get_quantity_stock_from);
                                $row_result_query_get_quantity_shop_from=mysqli_fetch_array($result_query_get_quantity_stock_from);
                                $quantity_shop_from=$row_result_query_get_quantity_shop_from['stock_quantity_from'];            
                                $result_stock_shop_from=0;
                                $result_stock_shop_from=(intval($quantity_shop_from) +  intval($quantity));                        
                               
                                mysqli_query($db,"UPDATE `$wh_from` SET `$stock_from`='$result_stock_shop_from' WHERE `product_id`='$product_id'");                       
                               //--------------------------------------------------------------------------------------------------------------------------------------------------
                                $result_stock_shop_to=0;
                                $result_stock_shop_to=(intval($quantity_stock) -  intval($quantity));
                                mysqli_query($db,"UPDATE `$wh_to` SET `$stock_to`='$result_stock_shop_to' WHERE `product_id`='$product_id'");
                                $string_comment_for_log_shop.=" Product ID :$product_id  Stock To $stock_to ($wh_to) qty($quantity_stock ~  $result_stock_shop_to) From $stock_from ($wh_from) qty($quantity_shop_from ~ $result_stock_shop_from) ; ";  
                               //--------------------------------------------------------------------------------------------------------------------------------------------------
                               
                               if($where_stock==5||$where_stock==6||$where_stock==7||$where_stock==8){                        
                                $result_get_quantity_stock_watsons_total=mysqli_query($db,"SELECT `stock_watsons_total` as `watsons_total`,`stock_watsons_return` AS `watsons_return` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$product_id'");
                                $row_result_get_quantity_stock_watsons_total=mysqli_fetch_array($result_get_quantity_stock_watsons_total);
                                $quantity_watsons_total=$row_result_get_quantity_stock_watsons_total['watsons_total']; 
                                $quantity_watsons_return=$row_result_get_quantity_stock_watsons_total['watsons_return'];                               
                                if($where_stock==5||$where_stock==7){
                                    $watsons_final=(intval($quantity_watsons_total) -  intval($quantity)); 
                                    mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_watsons_total`='$watsons_final' WHERE `product_id`='$product_id'");
                                }else if($where_stock==6||$where_stock==8){
                                    $watsons_return=(intval($quantity_watsons_return) -  intval($quantity)); 
                                    mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_watsons_return`='$watsons_return' WHERE `product_id`='$product_id'");
                                }                        
                                
                               }                                                   
                            }
                           
                         }    
                         
                     } 
                     if($string_comment_for_log_shop!=""){
                        mysqli_query($db,"UPDATE `tb_history_stock_borrow` SET `status`=2,`delete_time`='$today',`mg_delete`='$mg_name' WHERE id='$history_id'");  
                        mysqli_query($db,"DELETE FROM `tb_check_exp_product` WHERE po_id='$po_id'");                     
                        mysqli_query($db,"INSERT INTO `tb_log_history_borrow`(`id_history_borrow`,`log`,`create_date`,`m_create`,`action_type`) VALUE('$history_id','$string_comment_for_log_shop','$today','$mg_name','2')");
                     }                        
                    
                }
                if($flag_check_stock=="true"){
                   echo ("Process Delete Succeed ."); 
                }else if($flag_check_stock=="false"){
                   echo ("Process Delete False Stock Return Not Enough .");
                }
                
            }
            common_close_connect($db);
        }
        public function sv_borrow_stock_update_list_borrow($obj){
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s"); 
            $history_id=$obj["history_id"];
            $mg_name=$obj["mg_name"];
            $old_list=$obj["list_old"];
            for($i=0;$i<count($old_list);$i++){
                unset($old_list[$i]["product_name"]);
                unset($old_list[$i]["product_type"]);
            }
            $new_list=$obj["list_new"];
            $where_stock=$obj["stock_where"];
            $po_id=$obj["po_id"];
            $wh_from="";
            $wh_to="";
            $stock_from="";
            $stock_to="";
            if($where_stock=="1"){            
                    $wh_from="tb_stock_divide"; 
                    $wh_to="tb_stock_divide_hanoi";
                    $stock_from="stock_total"; 
                    $stock_to="stock_web";
                }else if($where_stock=="2"){            
                    $wh_from="tb_stock_divide_hanoi"; 
                    $wh_to="tb_stock_divide";
                    $stock_from="stock_web"; 
                    $stock_to="stock_total";
                }else if ($where_stock=="7"){            
                    $wh_from="tb_stock_divide";  
                    $wh_to="tb_stock_divide_hanoi";  
                    $stock_from="stock_eglips"; 
                    $stock_to="stock_watsons";
                }else if ($where_stock=="8"){            
                    $wh_from="tb_stock_divide_hanoi"; 
                    $wh_to="tb_stock_divide";
                    $stock_from="stock_watsons"; 
                    $stock_to="stock_eglips";
                }else if ($where_stock=="3"){            
                    $wh_from="tb_stock_divide_hanoi"; 
                    $wh_to="tb_stock_divide";
                    $stock_from="stock_total"; 
                    $stock_to="stock_eglips";
                }else if ($where_stock=="4"){   
                    $wh_from="tb_stock_divide"; 
                    $wh_to="tb_stock_divide_hanoi";
                    $stock_from="stock_eglips"; 
                    $stock_to="stock_total"; 
                }else if ($where_stock=="5"){            
                    $wh_from="tb_stock_divide_hanoi";  
                    $wh_to="tb_stock_divide_hanoi";  
                    $stock_from="stock_total";  
                    $stock_to="stock_watsons";
                }else if ($where_stock=="6"){            
                   $wh_from="tb_stock_divide_hanoi"; 
                   $wh_to="tb_stock_divide_hanoi";
                    $stock_from="stock_watsons";
                    $stock_to="stock_total";
                }else if ($where_stock=="9"){            
                   $wh_from="tb_stock_divide"; 
                   $wh_to="tb_stock_divide";
                    $stock_from="stock_total";
                    $stock_to="stock_sociolla";
                }else if ($where_stock=="10"){            
                   $wh_from="tb_stock_divide"; 
                   $wh_to="tb_stock_divide";
                    $stock_from="stock_sociolla";
                    $stock_to="stock_total";
                }
            $list_item_change=array();
            for($i=0;$i<count($old_list);$i++){
                $f_check_exist=0;
                $id_item_old=$old_list[$i]["product_id"];
                $quantity_item_old=$old_list[$i]["quantity"];
                $quantity_change=0;
                $expdate=$old_list[$i]["expdate"];
                for($j=0;$j<count($new_list);$j++){
                    $id_item_new=$new_list[$j]["product_id"];
                    $quantity_item_new=$new_list[$j]["quantity"];
                    if($id_item_old==$id_item_new){
                        $f_check_exist=1;
                        $quantity_change=intval($quantity_item_new)-intval($quantity_item_old);
                        break;
                    }
                }
                if($f_check_exist==0){
                    $arr_change = array(
                        "product_id" => $id_item_old,                        
                        "quantity" => (0- intval($quantity_item_old)),
                        "expdate"=>$expdate
                    );
                }else{
                    $arr_change = array(
                        "product_id" => $id_item_old,                        
                        "quantity" => intval($quantity_change),
                        "expdate"=>$expdate
                    );
                }             
                array_push($list_item_change,$arr_change);
                
            }
            //--------------------
            for($i=0;$i<count($new_list);$i++){
                $f_check_exist=0;
                $id_item_new=$new_list[$i]["product_id"];
                $quantity_item_new=$new_list[$i]["quantity"];
                $expdate=$new_list[$i]["expdate"];
               
                for($j=0;$j<count($list_item_change);$j++){
                    $id_item_change=$list_item_change[$j]["product_id"];
                    $quantity_item_change=$list_item_change[$j]["quantity"];
                    if($id_item_change==$id_item_new){
                        $f_check_exist=1;                       
                        break;
                    }
                }
                if($f_check_exist==0){
                    $arr_change = array(
                        "product_id" => $id_item_new,                        
                        "quantity" => intval($quantity_item_new),
                        "expdate"=>$expdate
                    );
                    array_push($list_item_change,$arr_change);
                }            
               
                
            }
            //echo json_encode($list_item_change);
            $list_item_check_from=array();
            $list_item_check_to=array();
            $string_comment_for_log_shop=" Stock Log : ";
            for($i=0;$i<count($list_item_change);$i++){
                 $id_item_change=$list_item_change[$i]["product_id"];
                 $quantity_item_change=$list_item_change[$i]["quantity"];
                 $expdate=$list_item_change[$i]["expdate"];
                 $arr_change = array(
                        "product_id" => $id_item_change,                        
                        "quantity" => intval($quantity_item_change),
                        "expdate"=>$expdate
                    );
                 if($quantity_item_change<0){
                    array_push($list_item_check_to,$arr_change);
                 }else if($quantity_item_change>0){
                    array_push($list_item_check_from,$arr_change);
                 }
            } 
         //   echo json_encode($new_list); 
            //abs
          //  echo json_encode($old_list); 
            $db=common_connect();
            $flag_check_stock_to=0;  // 0:true , 1:false
            $flag_check_stock_from=0;
            for($i=0;$i<count($list_item_check_to);$i++){
                $product_id=$list_item_check_to[$i]["product_id"];
                $quantity=abs($list_item_check_to[$i]["quantity"]);
                
                $query_get_quantity="SELECT `$stock_to` as `stock_quantity` FROM `$wh_to` WHERE `product_id`='$product_id'";               
                $result_query_get_quantity=mysqli_query($db,$query_get_quantity);
                $row_result_query_get_quantity=mysqli_fetch_array($result_query_get_quantity);
                $quantity_product=$row_result_query_get_quantity['stock_quantity'];
                $result_stock_quantity=(intval($quantity_product) -  intval($quantity));                 
                if($quantity_product=="" || $quantity_product=='0' || $result_stock_quantity<0)
                {
                    $flag_check_stock_to=1;
                    break;
                }
            } 
            //------------
            for($i=0;$i<count($list_item_check_from);$i++){
                $product_id=$list_item_check_from[$i]["product_id"];
                $quantity= abs($list_item_check_from[$i]["quantity"]);
                
                $query_get_quantity="SELECT `$stock_from` as `stock_quantity` FROM `$wh_from` WHERE `product_id`='$product_id'";               
                $result_query_get_quantity=mysqli_query($db,$query_get_quantity);
                $row_result_query_get_quantity=mysqli_fetch_array($result_query_get_quantity);
                $quantity_product=$row_result_query_get_quantity['stock_quantity'];
                $result_stock_quantity=(intval($quantity_product) -  intval($quantity));  
                if($quantity_product=="" || $quantity_product=='0' || $result_stock_quantity<0)
                {
                    $flag_check_stock_from=1;
                    break;
                }
            } 
            // echo json_encode($list_item_check_from);
            // echo json_encode($list_item_check_to);
           
            if($flag_check_stock_to==1 || $flag_check_stock_from==1){
                echo ("Stock not enough please check it .");
            }
            if($flag_check_stock_to==0 && $flag_check_stock_from==0){
                //---------update stock from ------------
                  
                     for($i=0;$i<count($list_item_check_from);$i++){                              
                         $product_id=$list_item_check_from[$i]["product_id"];
                         $quantity=abs($list_item_check_from[$i]["quantity"]);
                         $exp_date=$list_item_check_from[$i]["expdate"];                       
                         $query_get_quantity="SELECT `$stock_from` as `stock_quantity` FROM `$wh_from` WHERE `product_id`='$product_id'";
                         $result_query_get_quantity=mysqli_query($db,$query_get_quantity);
                         $row_result_query_get_quantity=mysqli_fetch_array($result_query_get_quantity);
                         
                         $quantity_stock=$row_result_query_get_quantity['stock_quantity'];
                        
                         $result_stock_quantity=0;
                         $result_stock_quantity=(intval($quantity_stock) -  intval($quantity));
                         if($quantity_stock!="" && $quantity_stock!='0')
                         {                    
                            if($result_stock_quantity<0)
                            {                                 
                                break;
                            }else{                        
                                $query_get_quantity_stock_to="SELECT `$stock_to` as `stock_quantity_to` FROM `$wh_to` WHERE `product_id`='$product_id'";
                                $result_query_get_quantity_stock_to=mysqli_query($db,$query_get_quantity_stock_to);
                                $row_result_query_get_quantity_shop_to=mysqli_fetch_array($result_query_get_quantity_stock_to);
                                $quantity_shop_to=$row_result_query_get_quantity_shop_to['stock_quantity_to'];            
                                $result_stock_shop_to=0;
                                $result_stock_shop_to=(intval($quantity_shop_to) +  intval($quantity));                        
                               
                                mysqli_query($db,"UPDATE `$wh_to` SET `$stock_to`='$result_stock_shop_to' WHERE `product_id`='$product_id'");                       
                               //--------------------------------------------------------------------------------------------------------------------------------------------------
                                $result_stock_shop_from=0;
                                $result_stock_shop_from=(intval($quantity_stock) -  intval($quantity));
                                mysqli_query($db,"UPDATE `$wh_from` SET `$stock_from`='$result_stock_shop_from' WHERE `product_id`='$product_id'");
                                
                                $string_comment_for_log_shop.=" Product ID :$product_id  Stock From $stock_from ($wh_from) qty($quantity_stock ~  $result_stock_shop_from) To $stock_to ($wh_to) qty($quantity_shop_to ~ $result_stock_shop_to) ; ";  
                               //--------------------------------------------------------------------------------------------------------------------------------------------------
                               
                               if($where_stock==5||$where_stock==6||$where_stock==7||$where_stock==8){                        
                                $result_get_quantity_stock_watsons_total=mysqli_query($db,"SELECT `stock_watsons_total` as `watsons_total`,`stock_watsons_return` AS `watsons_return` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$product_id'");
                                $row_result_get_quantity_stock_watsons_total=mysqli_fetch_array($result_get_quantity_stock_watsons_total);
                                $quantity_watsons_total=$row_result_get_quantity_stock_watsons_total['watsons_total']; 
                                $quantity_watsons_return=$row_result_get_quantity_stock_watsons_total['watsons_return'];
                                if($where_stock==5||$where_stock==7){
                                    $watsons_final=(intval($quantity_watsons_total) +  intval($quantity)); 
                                    mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_watsons_total`='$watsons_final' WHERE `product_id`='$product_id'");                                    
                                    mysqli_query($db,"INSERT INTO `tb_check_exp_product`(`product_id`,`qty`,`po_id`,`exp_date`,`create_time`,`shop_type`,`status`) VALUES('$product_id','$quantity','$po_id','$exp_date','$today','1','0')");
                                }else if($where_stock==6||$where_stock==8){
                                    $watsons_return=(intval($quantity_watsons_return) +  intval($quantity)); 
                                    mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_watsons_return`='$watsons_final' WHERE `product_id`='$product_id'");
                                }                        
                                
                               }                                                   
                            }
                           
                         }    
                         
                     }                     
                //---------update stock to-----------
                for($i=0;$i<count($list_item_check_to);$i++){                              
                         $product_id=$list_item_check_to[$i]["product_id"];
                         $quantity=abs($list_item_check_to[$i]["quantity"]);
                         $exp_date=$list_item_check_to[$i]["expdate"];
                         $query_get_quantity="SELECT `$stock_to` as `stock_quantity` FROM `$wh_to` WHERE `product_id`='$product_id'";
                         $result_query_get_quantity=mysqli_query($db,$query_get_quantity);
                         $row_result_query_get_quantity=mysqli_fetch_array($result_query_get_quantity);
                         
                         $quantity_stock=$row_result_query_get_quantity['stock_quantity'];
                        
                         $result_stock_quantity=0;
                         $result_stock_quantity=(intval($quantity_stock) -  intval($quantity));
                         if($quantity_stock!="" && $quantity_stock!='0')
                         {                    
                            if($result_stock_quantity<0)
                            {                                 
                                break;
                            }else{                        
                                $query_get_quantity_stock_from="SELECT `$stock_from` as `stock_quantity_from` FROM `$wh_from` WHERE `product_id`='$product_id'";
                                $result_query_get_quantity_stock_from=mysqli_query($db,$query_get_quantity_stock_from);
                                $row_result_query_get_quantity_shop_from=mysqli_fetch_array($result_query_get_quantity_stock_from);
                                $quantity_shop_from=$row_result_query_get_quantity_shop_from['stock_quantity_from'];            
                                $result_stock_shop_from=0;
                                $result_stock_shop_from=(intval($quantity_shop_from) +  intval($quantity));                        
                               
                                mysqli_query($db,"UPDATE `$wh_from` SET `$stock_from`='$result_stock_shop_from' WHERE `product_id`='$product_id'");                       
                               //--------------------------------------------------------------------------------------------------------------------------------------------------
                                $result_stock_shop_to=0;
                                $result_stock_shop_to=(intval($quantity_stock) -  intval($quantity));
                                mysqli_query($db,"UPDATE `$wh_to` SET `$stock_to`='$result_stock_shop_to' WHERE `product_id`='$product_id'");
                                
                                $string_comment_for_log_shop.=" Product ID :$product_id  Stock From $stock_from ($wh_from) qty($quantity_shop_from ~  $result_stock_shop_from) To $stock_to ($wh_to) qty($quantity_stock ~ $result_stock_shop_to) ; ";
                                  
                               //--------------------------------------------------------------------------------------------------------------------------------------------------
                               
                               if($where_stock==5||$where_stock==6||$where_stock==7||$where_stock==8){                        
                                $result_get_quantity_stock_watsons_total=mysqli_query($db,"SELECT `stock_watsons_total` as `watsons_total`,`stock_watsons_return` AS `watsons_return` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$product_id'");
                                $row_result_get_quantity_stock_watsons_total=mysqli_fetch_array($result_get_quantity_stock_watsons_total);
                                $quantity_watsons_total=$row_result_get_quantity_stock_watsons_total['watsons_total'];  
                                $quantity_watsons_return=$row_result_get_quantity_stock_watsons_total['watsons_return'];                                
                                if($where_stock==5||$where_stock==7){
                                    $watsons_final=(intval($quantity_watsons_total) -  intval($quantity)); 
                                    mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_watsons_total`='$watsons_final' WHERE `product_id`='$product_id'");
                                    mysqli_query($db,"DELETE FROM `tb_check_exp_product` WHERE po_id='$po_id' AND product_id='$product_id'");
                                }else if($where_stock==6||$where_stock==8){
                                    $watsons_return=(intval($quantity_watsons_total) -  intval($quantity)); 
                                    mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_watsons_return`='$watsons_return' WHERE `product_id`='$product_id'");
                                }                        
                                
                               }                                                   
                            }
                           
                         }    
                         
                     }
                 
                //----------save log ----------------  *            
               
                $string_comment_for_log_shop="Update Action :  stock old : ".json_encode($old_list)." ; stock update :".json_encode($list_item_change)." .$string_comment_for_log_shop";   
                mysqli_query($db,"INSERT INTO `tb_log_history_borrow`(`id_history_borrow`,`log`,`create_date`,`m_create`,`action_type`) VALUE('$history_id','$string_comment_for_log_shop','$today','$mg_name','1')");
                $list_new_item_update=json_encode($new_list);
                mysqli_query($db,"UPDATE `tb_history_stock_borrow` SET `list_items`='$list_new_item_update',`mg_update`='$mg_name',`update_time`='$today',`status`='1' WHERE `id`='$history_id'");              
                echo ("Process update finished .");
               }
            common_close_connect($db);  
        }
        public function sv_report_shipping_by_excel($data){
            $db=common_connect();  
            $rows=array();
            $str_order="";
            for($i=0;$i<count($data);$i++){
                 
                if($data[$i]["shop_delivery_id"]!=""){
                    $shop_delivery_id="'".$data[$i]["shop_delivery_id"]."'"; 
                }             
                $str_order.=",".$shop_delivery_id;                
            }
            $str_order=substr($str_order, 1);         
            $result=mysqli_query($db,"select order_id,shop_delivery_id, shop_order_id from tb_ord_note where shop_delivery_id in ($str_order) AND mg_delete IS NULL AND mg_cancel IS NULL");
            while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
            } 
            echo json_encode($rows);
            common_close_connect($db);   
        }
        //==================== Hisroty Stock====================
        public function sv_stock_management_get_list_product(){
            $db=common_connect();            
            $rows=array();
            $result=mysqli_query($db,"SELECT `product_id`,`product_name`,IF(`sku` LIKE '%-R', 'Regular','Hand carried') AS `type`,view FROM `tb_stock_divide`");
            while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
            } 
            echo json_encode($rows);
            common_close_connect($db);
        }
        public function sv_stock_management_list_daily_stock_item($obj){
            $db=common_connect();
            $startdate=$obj["start_date"];
            $enddate=$obj["end_date"];
            $list_item=$obj["item_list"]; 
            $warehouse=$obj["warehouse"];
            $shop_type=$obj["shoptype"];          
            $strWarehouse="";
          /*  if($warehouse=="0"){
                $strWarehouse="AND warehouse=0";
            }else if($warehouse=="1"){
                $strWarehouse="AND warehouse=1";
            } */
            $strShop="";
            //$shop_type 1:Actsone ,2:Jnain(Eglips Website) ,3:Jnain(Lazada Eglips) ,4:Jnain(Watsons),5:Jnain(Sendo) 
            //,6:Jnain,7:Actsone(Sky007 Website)
            if($shop_type=="1"){
                $strShop="AND warehouse=0 AND  `comment` NOT LIKE '%_eglips :%'";
                $strWarehouse="AND warehouse=0 AND ord_category NOT IN(18,19)";
            }else if ($shop_type=="2"){
                $strShop="AND warehouse=0 AND  `comment` LIKE '%_eglips :%'";
                $strWarehouse="AND warehouse=0 AND ord_category  IN(18,19)";
            }else if ($shop_type=="3"){
                $strShop="AND warehouse=1 AND  `comment` LIKE '%_lazada_eglips :%'";
                $strWarehouse="AND warehouse=1 AND ord_category  IN(26,27)";
            }else if ($shop_type=="4"){
                $strShop="AND warehouse=1 AND  `comment` LIKE '%_watson :%'";
                $strWarehouse="AND warehouse=1 AND ord_category  IN(30,31)";
            }else if ($shop_type=="5"){
               $strShop="AND warehouse=1 AND  `comment` LIKE '%_sendo :%'"; 
               $strWarehouse="AND warehouse=1 AND ord_category  IN(16,17)";
            }else if ($shop_type=="6"){
                $strShop="AND warehouse=1 AND  `comment` NOT LIKE '%_web :%'";
                $strWarehouse="AND warehouse=1 AND ord_category NOT IN(0,5)";
            }else if ($shop_type=="7"){
                $strShop="AND warehouse=1 AND  `comment`  LIKE '%_web :%'";
                $strWarehouse="AND warehouse=1 AND ord_category  IN(0,5)";
            }
           
            $rows=array();
            $result=mysqli_query($db,"SELECT `pid`,p.post_title,`comment`,`tdate`,if(`warehouse`=0,'TP.HCM','Ha Noi') AS warehouse,`mg_id`
                                      FROM `tb_stock_log` sl
                                      LEFT JOIN aowp_posts p ON sl.pid=p.id
                                      WHERE `pid` IN($list_item) AND tdate BETWEEN '$startdate' AND '$enddate'  $strShop
                                      ORDER BY pid,tdate");
            while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
            } 
            
            $rows_order=array();
            $result_order=mysqli_query($db,"SELECT oi.order_item_name AS `name`,oim_product_id.meta_value AS product_id ,SUM(oim_qty.meta_value) AS quantity
                                        FROM `aowp_posts` p
                                        LEFT JOIN `tb_ord_note` n ON n.order_id=p.id
                                        LEFT JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        LEFT JOIN aowp_woocommerce_order_itemmeta oim_product_id ON oi.order_item_id=oim_product_id.order_item_id
                                        LEFT JOIN aowp_woocommerce_order_itemmeta oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                        WHERE p.post_type='shop_order' AND p.post_status!='trash' AND  p.post_status!='wc-cancelled' AND p.post_date BETWEEN '$startdate' AND '$enddate'
                                        	AND oi.order_item_type ='line_item'
                                        	AND oim_product_id.meta_key='_product_id' AND oim_product_id.meta_value IN ($list_item)
                                        	AND oim_qty.meta_key='_qty'
                                        	$strWarehouse
                                        GROUP BY oim_product_id.meta_value");
            while($row=mysqli_fetch_array($result_order)){ 
                    array_push($rows_order,$row);               
            }
            
            $rows_cancel=array();
            $result_cancel=mysqli_query($db,"SELECT oi.order_item_name AS `name`,oim_product_id.meta_value AS product_id ,SUM(oim_qty.meta_value) AS quantity
                                        FROM `aowp_posts` p
                                        LEFT JOIN aowp_woocommerce_order_items oi ON p.id=oi.order_id
                                        LEFT JOIN aowp_woocommerce_order_itemmeta oim_product_id ON oi.order_item_id=oim_product_id.order_item_id
                                        LEFT JOIN aowp_woocommerce_order_itemmeta oim_qty ON oi.order_item_id=oim_qty.order_item_id
                                        LEFT JOIN `tb_ord_note` n ON p.id=n.order_id 
                                        WHERE p.post_type='shop_order' AND p.post_status='wc-cancelled' AND n.time_cancel   BETWEEN '$startdate' AND '$enddate'
                                        	AND oi.order_item_type ='line_item'
                                        	AND oim_product_id.meta_key='_product_id' AND oim_product_id.meta_value IN ($list_item)
                                        	AND oim_qty.meta_key='_qty'	
                                        	$strWarehouse
                                        GROUP BY oim_product_id.meta_value");
            while($row=mysqli_fetch_array($result_cancel)){ 
                    array_push($rows_cancel,$row);               
            }
            $rows_infor=array();
            $result_infor=mysqli_query($db,"SELECT p.id as `product_id`,p.post_title as `product_name` FROM aowp_posts p WHERE id IN ($list_item)");
            while($row=mysqli_fetch_array($result_infor)){ 
                    $row["order_quantity"]=0;
                    $row["cancel_order"]=0;
                    array_push($rows_infor,$row);               
            }
            
            for($i=0;$i<count($rows_order);$i++){
               $product_id=$rows_order[$i]["product_id"];              
               $order_number=$rows_order[$i]["quantity"]; 
               $flat_check=0;
               for($j=0;$j<count($rows_infor);$j++){
                   $order_number_infor=$rows_infor[$j]["product_id"];  
                   if($product_id==$order_number_infor){
                        $rows_infor[$j]["order_quantity"]=$order_number;
                   } 
               }
                       
            } 
            for($i=0;$i<count($rows_cancel);$i++){
               $product_id=$rows_cancel[$i]["product_id"];              
               $order_number=$rows_cancel[$i]["quantity"]; 
               $flat_check=0;
               for($j=0;$j<count($rows_infor);$j++){
                   $order_number_infor=$rows_infor[$j]["product_id"];  
                   if($product_id==$order_number_infor){
                        $rows_infor[$j]["cancel_order"]=$order_number;
                   } 
               }
                       
            }
               
            $arr_obj_data=array("data_infor"=>$rows_infor,"data_log"=>$rows); 
            echo json_encode($arr_obj_data);
            common_close_connect($db);
        }
        public function sv_stock_management_list_incoming_stock($obj){
            $db=common_connect();
            $startdate=$obj["start_date"];
            $enddate=$obj["end_date"];        
            $warehouse=$obj["warehouse"];
            $strWarehouse="";
            if($warehouse=="1"){
                $strWarehouse="AND warehouse=0";
            }else if($warehouse=="2"){
                $strWarehouse="AND warehouse=1";
            } 
           
            $rows_incomming=array();
            $result_incomming=mysqli_query($db,"SELECT `pid`,p.post_title,product_type,`in_date`,`t_incoming_qty`,`old_stock`,`total_stock`,`expiration_date`,`lot_number` 
                                      FROM `tb_incoming_stock` ins
                                      LEFT JOIN `aowp_posts` p ON ins.pid=p.id
                                      WHERE   in_date BETWEEN '$startdate' AND '$enddate' $strWarehouse ");
            while($row=mysqli_fetch_array($result_incomming)){ 
                    array_push($rows_incomming,$row);               
            } 
            
            $rows_borrow=array();
            $result_borrow=mysqli_query($db,"SELECT l.`pid`,p.post_title,l.`on_rstock`,l.`on_cur_stock`,l.`comment`,l.`tdate`,l.`mg_id`,l.`warehouse`
                                            FROM `tb_stock_log` l
                                            	LEFT JOIN aowp_posts p ON l.pid=p.id
                                            WHERE l.`action` IN (5,6) AND `tdate` BETWEEN '$startdate' AND '$enddate' $strWarehouse");
            while($row=mysqli_fetch_array($result_borrow)){ 
                    array_push($rows_borrow,$row);               
            } 
            
            $rows_hisrory=array();
            $result_hisrory=mysqli_query($db,"SELECT l.`product_id`,p.post_title,l.`log_stock`,l.`time_update`,l.`manager`,l.`warehouse`
                                            FROM `tb_stock_devide_log` l
                                            	LEFT JOIN aowp_posts p ON l.product_id=p.id
                                            WHERE  `time_update` BETWEEN '$startdate' AND '$enddate' $strWarehouse
                                            UNION
                                            SELECT l.`item_id` AS `product_id`,p.post_title,CONCAT('Stock before : ',`old_stock`,' Stock Affter : ',`new_stock` ,' Reason : ',`reason`) AS `log_stock`,`change_time` AS `time_update`,`id_manager` AS manager,warehouse
                                            FROM `log_update_stock` l
                                            LEFT JOIN aowp_posts p ON l.item_id=p.id
                                            WHERE `change_time` BETWEEN '$startdate' AND '$enddate' $strWarehouse");
            while($row=mysqli_fetch_array($result_hisrory)){ 
                    array_push($rows_hisrory,$row);               
            } 
            
            
               
            $arr_obj_data=array("data_incomming"=>$rows_incomming,"data_borrow"=>$rows_borrow,"data_history"=>$rows_hisrory); 
            echo json_encode($arr_obj_data);
            common_close_connect($db);
        }
        
         public function sv_stock_management_view_product($obj){
            $db=common_connect();
            $product_id=$obj["id"];
            $view=$obj["view"];
            $str_update=0;
            if($view==0){
                $str_update=1;
            }else{
                 $str_update=0;
            }
            mysqli_query($db,"UPDATE tb_stock_divide SET `view`= '$str_update' WHERE product_id='$product_id'");
            mysqli_query($db,"UPDATE tb_stock_divide_hanoi SET `view`= '$str_update' WHERE product_id='$product_id'");
            common_close_connect($db);
            
         }
        //================ End Hisroty Stock =====================
        
        //==================== Share Stock =======================
        public function sv_stock_management_share_stock_update_new_item(){
            $db=common_connect(); 
            mysqli_query($db,"INSERT INTO `tb_stock_divide` (`product_id`,`product_name`,`sku`,`stock_web`,`price_web`,`stock_shopee`,`price_shopee`,`stock_lotte`,`price_lotte`,`stock_sendo`,`price_sendo`,`stock_eglips`,`price_eglips`,`stock_lazada`,`price_lazada`,`stock_tiki`,`price_tiki`,`stock_shopee_c2c`,`price_shopee_c2c`,`stock_total`,`category`)
                              SELECT p.id ,p.post_title ,pm_sku.meta_value AS `sku`,pm_stock.meta_value AS `stock`,pm_price.meta_value AS `price`,0,pm_price.meta_value,0,pm_price.meta_value,0,pm_price.meta_value,0,pm_price.meta_value,0,pm_price.meta_value,0,pm_price.meta_value,0,pm_price.meta_value,pm_stock.meta_value,ts.name
                              FROM `aowp_posts` p
                                 LEFT JOIN `aowp_postmeta` pm_sku ON p.id=pm_sku.post_id
                                 LEFT JOIN `aowp_postmeta` pm_stock ON p.id=pm_stock.post_id
                                 LEFT JOIN `aowp_postmeta` pm_price ON p.id=pm_price.post_id
                                 LEFT JOIN aowp_term_relationships r ON p.id=r.`object_id`
                				LEFT JOIN aowp_term_taxonomy t ON t.term_taxonomy_id=r.term_taxonomy_id
                				LEFT JOIN aowp_terms ts ON ts.term_id=t.term_id
                              WHERE p.post_type IN('product','product_variation') AND p.post_status!='draft' 
                                  AND pm_sku.meta_key='_sku' AND pm_stock.meta_key='_stock' AND pm_price.meta_key='_sale_price'  AND t.taxonomy='product_cat' AND t.term_taxonomy_id IN(176,175,174,172,171,168,167) 
                              HAVING id NOT IN(SELECT product_id FROM tb_stock_divide)");
            mysqli_query($db,"INSERT INTO `tb_stock_divide_hanoi` (`product_id`,`product_name`,`sku`,`stock_web`,`price_web`,`stock_eglips`,`price_eglips`,`stock_total`,`category`,`stock_shopee_eglips`,`price_shopee_eglips`,`stock_lazada_eglips`,`price_lazada_eglips` ,`stock_robins` ,`price_robins`, `stock_watsons`, `price_watsons`,`stock_sendo`,`price_sendo`,`stock_tiki_eglips`,`price_tiki_eglips`)
                              SELECT p.id ,p.post_title ,pm_sku.meta_value AS `sku`,0,pm_price.meta_value AS `price`,0,pm_price.meta_value,0,ts.name,0,pm_price.meta_value,0,pm_price.meta_value,0,pm_price.meta_value,0,pm_price.meta_value,0,pm_price.meta_value,0,pm_price.meta_value
                              FROM `aowp_posts` p
                                 LEFT JOIN `aowp_postmeta` pm_sku ON p.id=pm_sku.post_id
                                 LEFT JOIN `aowp_postmeta` pm_stock ON p.id=pm_stock.post_id
                                 LEFT JOIN `aowp_postmeta` pm_price ON p.id=pm_price.post_id
                                 LEFT JOIN aowp_term_relationships r ON p.id=r.`object_id`
				LEFT JOIN aowp_term_taxonomy t ON t.term_taxonomy_id=r.term_taxonomy_id
				LEFT JOIN aowp_terms ts ON ts.term_id=t.term_id
                              WHERE p.post_type IN('product','product_variation') AND p.post_status!='draft'
                                  AND pm_sku.meta_key='_sku' AND pm_stock.meta_key='_stock' AND pm_price.meta_key='_sale_price'  AND t.taxonomy='product_cat' AND t.term_taxonomy_id IN(176,175,174,172,171,168,167) 
                              HAVING id NOT IN(SELECT product_id FROM tb_stock_divide_hanoi)");
                              
                $result_check_user_create_order=mysqli_query($db,"SELECT p.id , pm_user.meta_value AS `user_id`,p.`post_excerpt`,p.post_date
                                                            FROM aowp_posts p 
                                                            	LEFT JOIN aowp_postmeta pm_user ON p.id= pm_user.post_id
                                                            	LEFT JOIN `tb_ord_note` n ON p.id=n.order_id
                                                            	LEFT JOIN aowp_postmeta pm_api_check ON p.id=pm_api_check.post_id
                                                            WHERE p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash'  AND post_date >'2018-04-18 00:00:00'
                                                            	AND pm_user.meta_key='_customer_user' AND pm_api_check.meta_key='_customer_user_agent' AND pm_api_check.meta_value NOT LIKE '%woocommerce api%'
                                                            	AND n.order_id IS NULL");
                while($row=mysqli_fetch_array($result_check_user_create_order)){ 
                              $order_id=$row['id'];
                              $user_id=$row['user_id'];                             
                              $action_type="Website Order";                           
                              $comment=$row['post_excerpt'];
                              $create_time=$row['post_date'];
                              $check_existed=mysqli_query($db,"SELECT * FROM `tb_ord_note` WHERE    order_id='$order_id'"); 
                              $rowcount=mysqli_num_rows($check_existed);
                              if($rowcount==0){           
                                   mysqli_query($db,"INSERT INTO `tb_ord_note`(order_id,user_id,order_note,mg_id,date_time,ord_category) VALUE('$order_id','$user_id','$comment','$action_type','$create_time','0')");    
                              }
                              // update stock from order website
                              $result_each_item=mysqli_query($db,"SELECT item_id.meta_value AS `product_id`,qty.meta_value AS `quantity`
                                                                FROM  `aowp_woocommerce_order_items` AS oi
                                                                	LEFT JOIN aowp_woocommerce_order_itemmeta AS qty ON oi.order_item_id=qty.order_item_id
                                                                	LEFT JOIN aowp_woocommerce_order_itemmeta AS item_id ON oi.order_item_id=item_id.order_item_id
                                                                WHERE order_item_type='line_item' AND order_id='$order_id' AND item_id.meta_key='_product_id' AND qty.meta_key='_qty'");
                              while($row=mysqli_fetch_array($result_each_item)){ 
                                $product_id=$row['product_id'];
                                $quantity_order=$row['quantity'];
                                $query_get_quantity="SELECT `stock_web` as `stock_quantity` , stock_total FROM `tb_stock_divide` WHERE `product_id`='$product_id' ";
                                $result_query_get_quantity=mysqli_query($db,$query_get_quantity);
                                $row_result_query_get_quantity=mysqli_fetch_array($result_query_get_quantity);
                                $quantity_product=$row_result_query_get_quantity['stock_quantity'];
                                $quantity_total=$row_result_query_get_quantity['stock_total'];
                                $result_stock_quantity=(intval($quantity_product) -  intval($quantity_order));
                                $result_stock_total=(intval($quantity_total) -  intval($quantity_order));
                                if($quantity_product!="" && $quantity_product!='0'){
                                    $string_comment_for_log="Create order , order id :$order_id, item $product_id , stock quantity before : $quantity_total , stock quantity affter : $result_stock_total , action :success ,warehouse : HCM";
                                    mysqli_query($db,"UPDATE `tb_stock_divide` SET stock_web ='$result_stock_quantity',stock_total='$result_stock_total' WHERE `product_id`='$product_id'");
                                    mysqli_query($db,"INSERT INTO `tb_stock_log` (`pid`,`on_rstock`,`on_cur_stock`,`comment`,`tdate`,`mg_id`,`action`) VALUE ('$product_id','$quantity_total','$result_stock_total','$string_comment_for_log','$today','Website','0')");                                 
                                }else{
                                    
                                }               
                              }                                  
                                                                                    
                }
            common_close_connect($db);
        }
        public function sv_stock_management_share_stock(){
            $db=common_connect();               
             $result_regular=mysqli_query($db,"SELECT `product_id`,`product_name`,`sku`,`regular_price_web`,`regular_stock_web`,`regular_stock_shoppe`,`regular_stock_lotte`,`regular_stock_sendo`,`regular_stock_eglips`,`regular_stock_lazada`
                                    FROM `tb_stock_divide`
                                    WHERE sku LIKE '%-R'");
            
            $result=mysqli_query($db,"SELECT `product_id`,`product_name`,`sku`,`hand_carry_price_web`,`hand_carry_stock_web`,`hand_carry_stock_shoppe`,`hand_carry_stock_lotte`,`hand_carry_stock_sendo`,`hand_carry_stock_eglips`,`hand_carry_stock_lazada`
                                            FROM `tb_stock_divide`
                                            WHERE sku NOT LIKE '%-R'");   
            
             $rows=array();
             while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
                }
            $rows_regular=array();
            while($row_regular=mysqli_fetch_array($result_regular)){ 
                    array_push($rows_regular,$row_regular);               
                }
            $arr_data=array("list_item_hand_carried"=>$rows,"list_item_regular"=>$rows_regular);
            echo json_encode($arr_data);
            common_close_connect($db);
        }
        public function sv_stock_management_share_stock_save_stock($obj){
            $db=common_connect();        
            $item_id=$obj["item_id"];
            $stock_web=$obj["stock_web"];
            $stock_shoppe=$obj["stock_shoppe"]; 
            
            $stock_lotte = $obj["stock_lotte"];
            $stock_sendo = $obj["stock_sendo"];
            $stock_eglips = $obj["stock_eglips"];
            $stock_lazada = $obj["stock_lazada"];
            
            $note = $obj["note"];
            $manager_id = $obj["manager_id"];
            $product_type = $obj["product_type"];
            if($product_type=='Regular Product'){
                mysqli_query($db,"UPDATE `tb_stock_divide` SET `regular_stock_web`='$stock_web',`regular_stock_shoppe`='$stock_shoppe',`regular_stock_lotte`='$stock_lotte',`regular_stock_sendo`='$stock_sendo',`regular_stock_eglips`='$stock_eglips',`regular_stock_lazada`='$stock_lazada' WHERE `product_id`='$item_id'");
            }else{
                //echo("UPDATE `tb_stock_divide` SET `hand_carry_stock_web`='$stock_web',`hand_carry_stock_shoppe`='$stock_shoppe',`hand_carry_stock_lotte`='$stock_lotte',`hand_carry_stock_sendo`='$stock_sendo',`hand_carry_stock_eglips`='$stock_eglips',`hand_carry_stock_lazada`='$stock_lazada' WHERE `product_id`='$item_id'");
                mysqli_query($db,"UPDATE `tb_stock_divide` SET `hand_carry_stock_web`='$stock_web',`hand_carry_stock_shoppe`='$stock_shoppe',`hand_carry_stock_lotte`='$stock_lotte',`hand_carry_stock_sendo`='$stock_sendo',`hand_carry_stock_eglips`='$stock_eglips',`hand_carry_stock_lazada`='$stock_lazada' WHERE `product_id`='$item_id'");

            }
            common_close_connect($db);
            
        }
        public function sv_stock_management_share_stock_by_excel($data,$mg_name,$warehouse){
            $db= common_connect();
            $str_error="";
            $flag_check="true";
            date_default_timezone_set("Asia/Ho_Chi_Minh");    
            $today = date("Y-m-d H:i:s");
            $lis=0;
            if($warehouse=="0"){
               // $query_stock_hcm=
               $str_list_update="";
                for($i=0;$i<count($data);$i++){
                $item_id=$data[$i]["item_id"];
                $stock_website=$data[$i]["stock_website"];
                $stock_shopee=$data[$i]["stock_shopee"];
                $stock_shopeec2c=$data[$i]["stock_shopee_c2c"];
                $stock_tiki=$data[$i]["stock_tiki"];
                $stock_lazada=$data[$i]["stock_lazada"];
                $stock_bbia=$data[$i]["stock_bbiavn"];
                $check_warehouse=$data[$i]["warehouse"];
                if($check_warehouse!="tphcm"){
                    $str_error="Update Wrong warehouse !";
                    $flag_check="false";
                    echo($str_error);                  
                    common_close_connect($db);
                    die();  
                }
                if($item_id=="" || !ctype_digit($item_id) ){
                $str_error="Have one row ITEM ID equal null !";
                $flag_check="false";
                echo($str_error);                  
                common_close_connect($db);
                die();  
                }else{
                    $flag_check_insert=0;
                    if($stock_website=="" || is_numeric($stock_website)==false) { //check number
                       
                            $stock_website=0;
                                                                      
                    }else{
                        $flag_check_insert=1;
                    } 
                    //---------------------------------
                    if($stock_shopee=="" || is_numeric($stock_shopee)==false){
                       
                            $stock_shopee=0;
                          
                    }else {
                         $flag_check_insert=1;
                    }
                     //---------------------------------
                    if($stock_tiki=="" || is_numeric($stock_tiki)==false){
                      
                            $stock_tiki=0;
                          
                    }else {
                         $flag_check_insert=1;
                    }
                      //---------------------------------
                    if($stock_bbia=="" || is_numeric($stock_bbia)==false){
                      
                            $stock_bbia=0;
                          
                    }else {
                         $flag_check_insert=1;
                    }
                     //---------------------------------
                    if($stock_lazada=="" || is_numeric($stock_lazada)==false){
                      
                            $stock_lazada=0;
                          
                    }else {
                         $flag_check_insert=1;
                    }
                     //---------------------------------
                    if ($stock_shopeec2c=="" ||is_numeric($stock_shopeec2c)==false){
                        $stock_shopeec2c=0;
                    }else{
                         $flag_check_insert=1;
                    }
                     //---------------------------------
                   if($flag_check_insert==1){
                    $query_websky007="UPDATE  aowp_postmeta SET meta_value=(meta_value+$stock_website)  WHERE post_id ='$item_id'  AND meta_key='_stock';  \n ";
                    $query_update="UPDATE `tb_stock_divide` SET `stock_web`=(`stock_web`+$stock_website) ,`stock_bbiavn`=(`stock_bbiavn`+$stock_bbia),`stock_shopee`=(`stock_shopee`+$stock_shopee),`stock_lazada`=(`stock_lazada`+$stock_lazada),`stock_tiki`=(`stock_tiki`+$stock_tiki),`stock_shopee_c2c`=(`stock_shopee_c2c`+$stock_shopeec2c) WHERE `product_id`='$item_id';  \n ";
                    $str_list_update=$str_list_update.$query_update.$query_websky007;
                    $lis++;
                   }  
                }
            }
            if(strlen($str_list_update)>0){
             //   mysqli_multi_query($db,$str_list_update); 
              //  common_close_connect($db);
            }
            echo   $str_list_update;
            }else if($warehouse=="1"){
                
            }
            
          /*  if($warehouse=="0"){
                for($i=0;$i<count($data);$i++){
                $item_id=$data[$i]["item_id"];
                $stock_website=$data[$i]["stock_website"];
                $stock_shopee=$data[$i]["stock_shopee"];
                $stock_lotte=$data[$i]["stock_lotte"];
             //   $stock_eglips_website=$data[$i]["stock_eglips_website"];
                $stock_lazada=$data[$i]["stock_lazada"];
                $check_warehouse=$data[$i]["warehouse"];
                if($check_warehouse!="tphcm"){
                    $flag="Update Wrong warehouse !";
                    $flag_check="false";
                    echo($flag);                  
                    common_close_connect($db);
                    die(1);  
                }
                if($item_id=="" || !ctype_digit($item_id) ){
                    $flag="Have one row ITEM ID equal null !";
                    $flag_check="false";
                    echo($flag);                  
                    common_close_connect($db);
                    die(1);  
                }else{
                    if($stock_website=="" || is_numeric($stock_website)==false) { //check number
                       
                            $stock_website=0;
                                                                      
                    }else if($stock_shopee=="" || is_numeric($stock_shopee)==false){
                       
                            $stock_shopee=0;
                          
                    }else if($stock_lotte=="" || is_numeric($stock_lotte)==false){
                      
                            $stock_lotte=0;
                          
                    }else if($stock_lazada=="" || is_numeric($stock_lazada)==false){
                      
                            $stock_lazada=0;
                          
                    }
                          $stock_website_curent=  0;
                          $stock_shopee_curent=  0;
                          $stock_lotte_curent=  0;
                       //   $stock_eglips_website_curent=  0;
                          $stock_lazada_curent=  0;                         
                         
                          $result_get_stock=mysqli_query($db,"SELECT `stock_total`,`stock_web`,`stock_shopee`,`stock_lotte`,`stock_lazada` FROM `tb_stock_divide` WHERE `product_id`='$item_id'");
                          while($row=mysqli_fetch_array($result_get_stock)){ 
                                  $stock_website_curent=  $row["stock_web"];
                                  $stock_shopee_curent=  $row["stock_shopee"];
                                  $stock_lotte_curent=  $row["stock_lotte"];
                                //  $stock_eglips_website_curent=  $row["stock_eglips"];
                                  $stock_lazada_curent=  $row["stock_lazada"];                    
                                    
                          }
                          $stock_website_affect= intval($stock_website_curent) + intval($stock_website);
                          $stock_shopee_affect=  intval($stock_shopee_curent) + intval($stock_shopee);
                          $stock_lotte_affect=  intval($stock_lotte_curent) + intval($stock_lotte);
                        //  $stock_eglips_website_affect=  intval($stock_eglips_website_curent) + intval($stock_eglips_website);
                          $stock_lazada_affect=  intval($stock_lazada_curent) + intval($stock_lazada);  
                                         
                          if($stock_website_affect<0){
                            $flag="ITEM ID $item_id wrong stock website quantity !";
                            $flag_check="false";
                            echo($flag);
                            common_close_connect($db);
                            die(1);
                          }                         
                          if($stock_shopee_affect<0){
                            $flag="ITEM ID $item_id wrong stock shopee quantity !";
                            $flag_check="false";
                            echo($flag);
                            common_close_connect($db);
                            die(1);
                          }
                          if($stock_lotte_affect<0){
                            $flag="ITEM ID $item_id wrong stock lotte quantity !";
                            $flag_check="false";
                            echo($flag);
                            common_close_connect($db);
                            die(1);
                          }
                        
                          if($stock_lazada_affect<0){
                            $flag="ITEM ID $item_id wrong stock lazada quantity !";
                            $flag_check="false";
                            echo($flag);
                            common_close_connect($db);
                            die(1);
                          }
                       
                   
                }
                
                
            }      
            
            if($flag_check=="true"){
                for($i=0;$i<count($data);$i++){
                $item_id=$data[$i]["item_id"];
                $stock_website=$data[$i]["stock_website"];
                $stock_shopee=$data[$i]["stock_shopee"];
                $stock_lotte=$data[$i]["stock_lotte"];
             //   $stock_eglips_website=$data[$i]["stock_eglips_website"];
                $stock_lazada=$data[$i]["stock_lazada"];
               
                if($stock_website=="" || is_numeric($stock_website)==false) { //check number
                    
                            $stock_website=0;
                                               
                }else if($stock_shopee=="" || is_numeric($stock_shopee)==false){
                   
                            $stock_shopee=0;
                          
                }else if($stock_lotte=="" || is_numeric($stock_lotte)==false){
                  
                            $stock_lotte=0;
                          
                }else if($stock_lazada=="" || is_numeric($stock_lazada)==false){
                   
                            $stock_lazada=0;
                          
                }    
                      $stock_website_curent=  0;
                      $stock_shopee_curent=  0;
                      $stock_lotte_curent=  0;
                     // $stock_eglips_website_curent=  0;
                      $stock_lazada_curent=  0;                         
                     
                      $result_get_stock=mysqli_query($db,"SELECT `stock_total`,`stock_web`,`stock_shopee`,`stock_lotte`,`stock_lazada` FROM `tb_stock_divide` WHERE `product_id`='$item_id'");
                      while($row=mysqli_fetch_array($result_get_stock)){ 
                              $stock_website_curent=  $row["stock_web"];
                              $stock_shopee_curent=  $row["stock_shopee"];
                              $stock_lotte_curent=  $row["stock_lotte"];
                             // $stock_eglips_website_curent=  $row["stock_eglips"];
                              $stock_lazada_curent=  $row["stock_lazada"];                    
                                
                      }
                      $stock_website_affect= intval($stock_website_curent) + intval($stock_website);
                      $stock_shopee_affect=  intval($stock_shopee_curent) + intval($stock_shopee);
                      $stock_lotte_affect=  intval($stock_lotte_curent) + intval($stock_lotte);
                    //  $stock_eglips_website_affect=  intval($stock_eglips_website_curent) + intval($stock_eglips_website);
                      $stock_lazada_affect=  intval($stock_lazada_curent) + intval($stock_lazada);
                      $str_message="(Warehouse TP.HCM Excel) Product ID : $item_id , Website Sky007 : curent ".$stock_website_curent." , number insert ".$stock_website." , stock change ".$stock_website_affect." 
                                    ; Shopee : curent ".$stock_shopee_curent." , number insert ".$stock_shopee." , stock change ".$stock_shopee_affect." ;
                                    ; Lotte : curent ".$stock_lotte_curent." , number insert ".$stock_lotte." , stock change ".$stock_lotte_affect." ;                                    
                                    ; Lazada : curent ".$stock_lazada_curent." , number insert ".$stock_lazada." , stock change ".$stock_lazada_affect." .";
                      mysqli_query($db,"UPDATE `aowp_postmeta` SET meta_value='$stock_website_affect' WHERE meta_key='_stock' AND post_id='$item_id'");                                 
                      mysqli_query($db,"UPDATE `tb_stock_divide` SET `stock_web`='$stock_website_affect',`stock_shopee`='$stock_shopee_affect',`stock_lotte`='$stock_lotte_affect',`stock_lazada`='$stock_lazada_affect' WHERE `product_id`= '$item_id'");                               
                      mysqli_query($db,"INSERT INTO `tb_stock_devide_log` (`product_id`,`log_stock`,`manager`,time_update) VALUE('$item_id','$str_message','$mg_name','$today')");
                
              }
            //   echo($flag);
           }
             echo($flag);
           //  echo json_encode($data);
             common_close_connect($db);
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            else if($warehouse=="1"){
                for($i=0;$i<count($data);$i++){
                $item_id=$data[$i]["item_id"];
               // $stock_website=$data[$i]["stock_website"];
             
              
                $stock_eglips_website=$data[$i]["stock_eglips_website"];
                $stock_shopee_eglips=$data[$i]["stock_shopee_eglips"];
                $stock_robins=$data[$i]["stock_robins"];
                $check_warehouse=$data[$i]["warehouse"];
                if($check_warehouse!="hanoi"){
                    $flag="Update Wrong warehouse !";
                    $flag_check="false";
                    echo($flag);                  
                    common_close_connect($db);
                    die(1);  
                }
               
                if($item_id=="" || !ctype_digit($item_id) ){
                    $flag="Have one row ITEM ID equal null !";
                    $flag_check="false";
                    echo($flag);                  
                    common_close_connect($db);
                    die(1);    
                }else{
                    if($stock_eglips_website=="" || is_numeric($stock_eglips_website)==false){
                       
                             $stock_eglips_website=0;
                                           
                    }else if($stock_shopee_eglips=="" || is_numeric($stock_shopee_eglips)==false){
                       
                             $stock_shopee_eglips=0;
                                           
                    }else if($stock_robins=="" || is_numeric($stock_robins)==false){
                       
                             $stock_robins=0;
                                           
                    }
                        // $stock_website_curent =  0;                        
                         $stock_eglips_website_curent =  0;  
                         $stock_shopee_eglips_curent = 0; 
                         $stock_robins_curent = 0;
                                                            
                         
                          $result_get_stock=mysqli_query($db,"SELECT `stock_eglips`,`stock_shopee_eglips`,`stock_robins` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$item_id'");
                          while($row=mysqli_fetch_array($result_get_stock)){ 
                               //   $stock_website_curent=  $row["stock_web"];                                  
                                  $stock_eglips_website_curent=  $row["stock_eglips"];
                                  $stock_shopee_eglips_curent= $row["stock_shopee_eglips"];
                                  $stock_robins_curent= $row["stock_robins"];
                                                
                                    
                          }
                        //  $stock_website_affect= intval($stock_website_curent) + intval($stock_website);                          
                          $stock_eglips_website_affect=  intval($stock_eglips_website_curent) + intval($stock_eglips_website);
                          $stock_shopee_eglips_affect=  intval($stock_shopee_eglips_curent) + intval($stock_shopee_eglips);
                          $stock_robins_affect=  intval($stock_robins_curent) + intval($stock_robins);
                         
                                               
                         
                          if($stock_eglips_website_affect<0){
                            $flag="ITEM ID $item_id wrong stock eglips quantity !";
                            $flag_check="false";
                            echo($flag);
                            common_close_connect($db);
                            die(1);
                          }  
                          if($stock_shopee_eglips_affect<0){
                            $flag="ITEM ID $item_id wrong stock shopee eglips quantity !";
                            $flag_check="false";
                            echo($flag);
                            common_close_connect($db);
                            die(1);
                          }
                           if($stock_robins_affect<0){
                            $flag="ITEM ID $item_id wrong stock robins quantity !";
                            $flag_check="false";
                            echo($flag);
                            common_close_connect($db);
                            die(1);
                          }   
                }
                
                
            }      
            
            if($flag_check=="true"){
                for($i=0;$i<count($data);$i++){
                $item_id=$data[$i]["item_id"];
             //   $stock_website=$data[$i]["stock_website"];
                $stock_eglips_website=$data[$i]["stock_eglips_website"];
                $stock_shopee_eglips=$data[$i]["stock_shopee_eglips"];
                $stock_robins=$data[$i]["stock_robins"];
                
               
                if($stock_eglips_website=="" || is_numeric($stock_eglips_website)==false){
                 
                       $stock_eglips_website=0;
                        
                }else if($stock_shopee_eglips=="" || is_numeric($stock_shopee_eglips)==false){
                 
                       $stock_shopee_eglips=0;
                        
                }else if($stock_robins=="" || is_numeric($stock_robins)==false){
                 
                       $stock_robins=0;
                        
                }else{    
                    //  $stock_website_curent=  0;
                     
                      $stock_eglips_website_curent=  0;
                      
                      $stock_shopee_eglips_curent=  0;
                      
                      $stock_robins_curent=  0;
                                           
                     
                      $result_get_stock=mysqli_query($db,"SELECT `stock_eglips`,`stock_shopee_eglips`,`stock_robins` FROM `tb_stock_divide_hanoi` WHERE `product_id`='$item_id'");
                      while($row=mysqli_fetch_array($result_get_stock)){ 
                            //  $stock_website_curent=  $row["stock_web"];                            
                              $stock_eglips_website_curent=  $row["stock_eglips"];
                              $stock_shopee_eglips_curent=  $row["stock_shopee_eglips"];
                              $stock_robins_curent=$row["stock_robins"];
                                            
                                
                      }
                     // $stock_website_affect= intval($stock_website_curent) + intval($stock_website);
                    
                      $stock_eglips_website_affect=  intval($stock_eglips_website_curent) + intval($stock_eglips_website);
                      
                      $stock_shopee_eglips_affect=  intval($stock_shopee_eglips_curent) + intval($stock_shopee_eglips);
                      
                      $stock_robins_affect=  intval($stock_robins_curent) + intval($stock_robins);
                      
                      $str_message="(Warehouse HaNoi Excel)  Product ID : $item_id , Eglips : curent ".$stock_eglips_website_curent." , number insert ".$stock_eglips_website." , stock change ".$stock_eglips_website_affect." 
                                    ; Shopee Eglips : curent ".$stock_shopee_eglips_curent." , number insert ".$stock_shopee_eglips." , stock change ".$stock_shopee_eglips_affect."
                                    ; Robins : curent ".$stock_robins_curent." , number insert ".$stock_robins." , stock change ".$stock_robins_affect.".";
                                                 
                      mysqli_query($db,"UPDATE `tb_stock_divide_hanoi` SET `stock_eglips`='$stock_eglips_website_affect',`stock_shopee_eglips`='$stock_shopee_eglips_affect',`stock_robins`='$stock_robins_affect' WHERE `product_id`= '$item_id'");                               
                      mysqli_query($db,"INSERT INTO `tb_stock_devide_log` (`product_id`,`log_stock`,`manager`,warehouse,time_update) VALUE('$item_id','$str_message','$mg_name','1','$today')");
                }
              }
            //   echo($flag);
           }
             echo($flag);
           //  echo json_encode($data);
             common_close_connect($db);
            }*/
           // echo($data);exit(1);
            
        }
         //================ End Share Stock =======================
         
         //================ Stock management shop mall=============
        public function sv_stock_management_get_list_product_mall(){
            $db=common_connect();  
            $result=mysqli_query($db,"SELECT * FROM `tb_shopee_items` ");
            $rows=array();
            while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
            }
            echo json_encode($rows);
            common_close_connect($db);
        }
        public function sv_stock_management_get_stock_list_product_mall_and_insert_newitems(){   
                $sv= new sever_skysys();
                $arr_data_list=array();
                $obj_data_list = $sv-> sv_stock_management_get_list_product_mall_cron(0);
                $data_list = $obj_data_list["data_item"];
               // echo json_encode($obj_data_list); exit(1);
              
                if(count($data_list)!=0){
                   /* for($i=0;$i<count($data_list);$i++){
                        array_push($arr_data_list,$data_list[$i]);
                    }*/
                    $arr_data_list=$data_list;
                    if($obj_data_list["more"]=="true"){
                        $pagination_offset=20;
                        for($i=1;$i<80;$i++){ //40x50 =2000 row data                       
                            $rows_next=$pagination_offset*$i;
                            $obj_data_list = $sv-> sv_stock_management_get_list_product_mall_cron($rows_next);
                            $data_list = $obj_data_list["data_item"];                            
                            for($j=0;$j<count($data_list);$j++){
                                array_push($arr_data_list,$data_list[$j]);
                            }
                            if($obj_data_list["more"]=="false"){
                                $i=999; //check next pages and stop
                            }
                        }
                    }
                }
               // echo json_encode($arr_data_list); die;
                
              //  echo count($arr_data_list);
                $obj_arr_data=array();
                for($i=0;$i<count($arr_data_list);$i++){
                 $name=$arr_data_list[$i]["name"];
                 $item_id=$arr_data_list[$i]["item_id"];
                 $item_sku=$arr_data_list[$i]["item_sku"];
                 $stock=$arr_data_list[$i]["stock"];
                 $price=$arr_data_list[$i]["price"];
                 $status=$arr_data_list[$i]["status"];
                 $variations=$arr_data_list[$i]["variations"];
                 $product_type="Single";
                if(count($variations)>0){
                    $product_type="Variation";
                }
                $obj_data  =array ("name"=>$name,"item_id"=>$item_id,"item_sku"=>$item_sku,"stock"=>$stock,"price"=>$price,"variation_name"=>"","variation_id"=>"","variation_sku"=>"","variation_stock"=>"","variation_price"=>$price,"status"=>$status,"product_type"=>$product_type) ;
                array_push($obj_arr_data,$obj_data);
                if(count($variations)>0){
                    for($j=0;$j<count($variations);$j++){
                         $variations_name=$variations[$j]["variation_name"];
                         $variations_id=$variations[$j]["variation_id"];
                         $variations_sku=$variations[$j]["variation_sku"];
                         $variations_stock=$variations[$j]["variation_stock"];
                         $variations_price=$variations[$j]["variation_price"];
                         $variation_obj_data  = array("name"=>$name,"item_id"=>$item_id,"item_sku"=>$item_sku,"stock"=>$stock,"price"=>$price,"variation_name"=>$variations_name,"variation_id"=>$variations_id,"variation_sku"=>$variations_sku,"variation_stock"=>$variations_stock,"variation_price"=>$variations_price,"status"=>$status,"product_type"=>$product_type) ;
                         array_push($obj_arr_data,$variation_obj_data);
                    }
                }
                 
               }
              $db=common_connect();  
              $query="SELECT * FROM `tb_shopee_items`";
              $result_tb_shopee=mysqli_query($db,$query) ;
              $data_tb_shopee=array();
              while($row=mysqli_fetch_array($result_tb_shopee)){ 
                    array_push($data_tb_shopee,$row);               
              }
              $str_value_insert="";
              for($i=0;$i<count($obj_arr_data);$i++){
                 $name=$obj_arr_data[$i]["name"];
                 $item_id=$obj_arr_data[$i]["item_id"];
                 $item_sku=$obj_arr_data[$i]["item_sku"];
                 $stock=$obj_arr_data[$i]["stock"];
                 $price=$obj_arr_data[$i]["price"];
                 $status=$obj_arr_data[$i]["status"];
                 $variations=$obj_arr_data[$i]["product_type"];
                     $variations_name=$obj_arr_data[$i]["variation_name"];
                     $variations_id=$obj_arr_data[$i]["variation_id"];
                     $variations_sku=$obj_arr_data[$i]["variation_sku"];
                     $variations_stock=$obj_arr_data[$i]["variation_stock"];
                     $variations_price=$obj_arr_data[$i]["variation_price"];
                     $flat_check_exist=0;
                for($j=0;$j<count($data_tb_shopee);$j++){
                    $tb_shopee_item_id=$data_tb_shopee[$j]["item_id"];
                    $tb_shopee_variation=$data_tb_shopee[$j]["variation_id"];                    
                    if($tb_shopee_item_id==$item_id && $tb_shopee_variation==$variations_id){
                        $flat_check_exist=1;
                        break;
                    }
                }
                if($flat_check_exist==0){
                    $str_value_insert.="('$name','$item_id','$item_sku','$price','$variations_name','$variations_id','$variations_sku','$variations_price','$variations'),";
                }                
              } 
              $str_value_insert=substr($str_value_insert, 0, -1);
              if(strlen($str_value_insert)>0){
                $query_insert_tb_shopee="INSERT INTO `tb_shopee_items`(`product_name`,`item_id`,`sku`,`price`,`variation_name`,`variation_id`,`variation_sku`,`variation_price`,`product_type`) VALUE $str_value_insert";
                 mysqli_query($db,$query_insert_tb_shopee);
              } 
              echo json_encode($obj_arr_data); 
              common_close_connect($db);
    }
       public function sv_stock_management_get_list_product_mall_cron($rows_next){  
            date_default_timezone_set("asia/ho_chi_minh");
            $now = new DateTime();
            $now->format(DateTime::ISO8601);
            
            // The parameters for our GET request. These will get signed.
            $parameters = array(
               
                "timestamp" => $now->getTimestamp() ,  
                 
                "pagination_offset" =>$rows_next,
                
                "pagination_entries_per_page" =>20,
                
                "partner_id" => 84013,    
                
                "shopid" => 9277307 
                
            );          
            //  echo json_encode($parameters);
            ksort($parameters);
            
            // URL encode the parameters.
            $encoded = array();
            foreach ($parameters as $name => $value)
            {
                $encoded[] = '"' .rawurlencode($name) .'"' . ':' . rawurlencode($value);
            }
            
            // Concatenate the sorted and URL encoded parameters into a string.
            $concatenated = implode(',', $encoded);
            
            $concatenated="https://partner.shopeemobile.com/api/v1/items/get|{".$concatenated."}";
           //  echo ($concatenated);
            
            // The API key for the user as generated in the Seller Center GUI.
            // Must be an API key associated with the UserID parameter.
            // that is parner_key of shopee
            $api_key = 'dcd20be528b96992670d2b6abc176c8315c8443f4efa719d50f594e37ce49859';
         //   $sign="3dd3831f961d6cc65c305f89020bbdf5c2d71d48855b535fa130b23f9a0c0c19";
            
            // Compute signature and add it to the parameters.
            $authToken  = rawurlencode(hash_hmac('sha256', $concatenated, $api_key, false));   
           //  echo($authToken)     ; die();
            
            // Replace with the URL of your API host.
            $url = "https://partner.shopeemobile.com/api/v1/items/get";
            
            $context = stream_context_create(array(
                'http' => array(               
                    'method' => 'POST',
                    'header' => "Authorization: {$authToken}\r\n".
                    "Content-Type: application/json\r\n",
                    'content' => json_encode($parameters)
                )
            ));
            
            // Build Query String       
            
            $json_list_items = file_get_contents('https://partner.shopeemobile.com/api/v1/items/get', FALSE, $context);     
            $obj_list_items = json_decode($json_list_items, true);         
            $check_order_exist=count($obj_list_items['items']);
            $list_items = $obj_list_items['items'];           
            if($check_order_exist!=0){
                for($i=0;$i<count($list_items);$i++){
                     $shop_item_id= $list_items[$i]["item_id"];
                      $list_items_variation=$list_items[$i]["variations"];
                   //  $sku_item= $list_items[$i]["item_sku"];
                     
                     //------------------------------------get detail items    -----------------------------------------------
                     $parameters_detail = array(               
                        "timestamp" => $now->getTimestamp() ,                           
                        "item_id" =>$shop_item_id, 
                        "partner_id" => 84013,    
                        "shopid" => 9277307 
                    ); 
                    ksort($parameters_detail);                
                    $encoded_detail = array();
                    foreach ($parameters_detail as $name => $value)
                    {
                        $encoded_detail[] = '"' .rawurlencode($name) .'"' . ':' . rawurlencode($value);
                    }
                    $concatenated_detail = implode(',', $encoded_detail);                    
                    $concatenated_detail="https://partner.shopeemobile.com/api/v1/item/get|{".$concatenated_detail."}";              
                    $authToken_detail  = rawurlencode(hash_hmac('sha256', $concatenated_detail, $api_key, false));
                    $url = "https://partner.shopeemobile.com/api/v1/item/get";
                    $context_detail = stream_context_create(array(
                        'http' => array(               
                            'method' => 'POST',
                            'header' => "Authorization: {$authToken_detail}\r\n".
                            "Content-Type: application/json\r\n",
                            'content' => json_encode($parameters_detail)
                        )
                    ));                       
                    
                    $json_list_item_detail = file_get_contents('https://partner.shopeemobile.com/api/v1/item/get', FALSE, $context_detail);  
                    $obj_list_item_detail = json_decode($json_list_item_detail, true); 
                    $list_item_detail=$obj_list_item_detail["item"];
                    $stock=$list_item_detail["stock"];
                    $product_name=$list_item_detail["name"];
                    $price=$list_item_detail["price"];
                    $obj_variation=$list_item_detail["variations"];
                    $arr_variation=array();
                    if(count($obj_variation)>0){
                        for($j=0;$j<count($obj_variation);$j++){
                            $stock_variation=$obj_variation[$j]["stock"];
                            $variation_id=$obj_variation[$j]["variation_id"];
                            $variation_sku=$obj_variation[$j]["variation_sku"];
                            $variation_name=$obj_variation[$j]["name"];
                            $variation_price=$obj_variation[$j]["price"];
                            
                            for($k=0;$k<count($list_items_variation);$k++){
                                if($variation_id==$list_items_variation[$k]["variation_id"]){
                                    $obj_va_detail=array(
                                        "variation_name"=>$variation_name,
                                        "variation_sku"=>$variation_sku,
                                        "variation_id"=>$variation_id,
                                        "variation_stock"=>$stock_variation,
                                        "variation_price"=>$variation_price
                                    );
                                    array_push($arr_variation,$obj_va_detail);
                                }
                            }
                        }
                       $list_items[$i]["variations"]= $arr_variation;
                    }
                    $list_items[$i]["stock"]=$stock;
                    $list_items[$i]["name"]=$product_name;
                    $list_items[$i]["price"]=$price;
                    
                     //------------------------------------end get detail items-----------------------------------------------                 
                }
                        
            }           
            
            $check_pages=$obj_list_items["more"];
            
            if($check_pages==1){
                $check_pages="true";
            }else{
                $check_pages="false";
            }       
            
            //---------------------------------------------------------------------------------------------------------------------------
               
           return $obj_arr_data=array("data_item"=>$list_items,"more"=>$check_pages);                
       
       }
       public function sv_stock_management_auto_divide_stock_shopee($obj){
            $db=common_connect();  
            $result_shopee=mysqli_query($db,"SELECT * FROM `tb_shopee_items`");
            $rows_shopee=array();
            while($row=mysqli_fetch_array($result_shopee)){ 
                    array_push($rows_shopee,$row);               
            }
            $obj_arr_data=array();
            $str_err="";
            for($i=0;$i<count($obj);$i++){
                $flat_check_exist=0;
                $sku=$obj[$i]["Itemsku"];              
                $stock_insert=$obj[$i]["StockInsert"];
                $product_id=$obj[$i]["product_id"];
                for($j=0;$j<count($rows_shopee);$j++){
                    $sku_s=$rows_shopee[$j]["sku"];
                    $product_name=$rows_shopee[$j]["product_name"];
                    $price=$rows_shopee[$j]["price"];
                    $variation_name=$rows_shopee[$j]["variation_name"];
                    $product_type=$rows_shopee[$j]["product_type"];
                    $shopee_item_id=$rows_shopee[$j]["item_id"];
                    $shopee_variation_id=$rows_shopee[$j]["variation_id"];
                    $variation_price=$rows_shopee[$j]["variation_price"];
                    $shopee_variation_sku=$rows_shopee[$j]["variation_sku"];
                    $main_product=$rows_shopee[$j]["main_product"];                    
                     if($sku==$sku_s && $product_type=="Single"){
                        $flat_check_exist=1;
                        $obj_item=array("item_id"=>$shopee_item_id,"product_name"=>$product_name,"sku"=>$sku_s,"price"=>$price,"variation_name"=>$variation_name,"variation_id"=>$shopee_variation_id,"variation_sku"=>$shopee_variation_sku,"variation_price"=>$variation_price,"product_type"=>$product_type,"stock_insert"=>$stock_insert,"stock_variation_insert"=>0);
                        array_push($obj_arr_data,$obj_item);
                     }
                     if($sku==$shopee_variation_sku && $product_type=="Variation"){
                        $flat_check_exist=1;
                        $obj_item=array("item_id"=>$shopee_item_id,"product_name"=>$product_name,"sku"=>$sku_s,"price"=>$price,"variation_name"=>$variation_name,"variation_id"=>$shopee_variation_id,"variation_sku"=>$shopee_variation_sku,"variation_price"=>$variation_price,"product_type"=>$product_type,"stock_insert"=>0,"stock_variation_insert"=>$stock_insert);
                         array_push($obj_arr_data,$obj_item);
                     }
                }
              if($flat_check_exist==0)  {
                $str_err.="SKU : ". $sku. " Can't found . ";
              }
               
            }
            $data_return=array("str_err"=>$str_err,"data"=>$obj_arr_data);
            echo json_encode($data_return);
            common_close_connect($db);
       }
       public function sv_stock_management_update_stock_shopee($data_insert){   
             $obj_data_single=array();
             $obj_data_variation=array();
             $api_key = 'dcd20be528b96992670d2b6abc176c8315c8443f4efa719d50f594e37ce49859';
             $str_error="";
             $now = new DateTime();
             $now->format(DateTime::ISO8601);
             $flat_check_number_of_id=0;
             for($i=0;$i<count($data_insert);$i++){
                 $item_id=  ctype_digit(($data_insert[$i]["ItemID"]));
                 $variation_id=ctype_digit(($data_insert[$i]["VariationID"]));
                 $ProductType=$data_insert[$i]["ProductType"];  
                 if($ProductType=="Single"){
                    if($item_id==""){
                         $flat_check_number_of_id=1;
                           break;
                    }
                 }else{
                    if($item_id ==""||$variation_id==""){                  
                        $flat_check_number_of_id=1;
                        break;
                     }
                 }
             }
             if($flat_check_number_of_id==1){
                echo ("ID or Variation ID wrong format . data didn't update.");
             }else{              
                for($i=0;$i<count($data_insert);$i++){
                $item_id=  intval( $data_insert[$i]["ItemID"]);
                $sku=   $data_insert[$i]["SKU"];
                $stock_insert=$data_insert[$i]["stock_insert"];
                $variation_id=intval($data_insert[$i]["VariationID"]);
                $variation_sku=   $data_insert[$i]["VariationSKU"];
                $ProductType=$data_insert[$i]["ProductType"];   
                
                //------------------------------------------------------------------------------------------------------
                $parameters_detail = array(               
                        "timestamp" => $now->getTimestamp() ,                           
                        "item_id" => $item_id, 
                        "partner_id" => 84013,    
                        "shopid" => 9277307 
                    ); 
                //    echo json_encode($parameters_detail); die();
                    ksort($parameters_detail);                
                    $encoded_detail = array();
                    foreach ($parameters_detail as $name => $value)
                    {
                        $encoded_detail[] = '"' .rawurlencode($name) .'"' . ':' . rawurlencode($value);
                    }
                    $concatenated_detail = implode(',', $encoded_detail);                    
                    $concatenated_detail="https://partner.shopeemobile.com/api/v1/item/get|{".$concatenated_detail."}";              
                    $authToken_detail  = rawurlencode(hash_hmac('sha256', $concatenated_detail, $api_key, false));
                    $url = "https://partner.shopeemobile.com/api/v1/item/get";
                    $context_detail = stream_context_create(array(
                        'http' => array(               
                            'method' => 'POST',
                            'header' => "Authorization: {$authToken_detail}\r\n".
                            "Content-Type: application/json\r\n",
                            'content' => json_encode($parameters_detail)
                        )
                    ));                       
                    
                    $json_list_item_detail = file_get_contents('https://partner.shopeemobile.com/api/v1/item/get', FALSE, $context_detail); 
                    
                    $obj_list_item_detail = json_decode($json_list_item_detail, true); 
                  //  echo json_encode($obj_list_item_detail) ; die();
                    if(count($obj_list_item_detail)>0){
                        $list_item_detail=$obj_list_item_detail["item"];
                        $stock=$list_item_detail["stock"];            
                        $obj_variation=$list_item_detail["variations"];
                        if($ProductType=="Single"){
                        $stock_update =intval($stock + $stock_insert);
                            if($stock_update>0){
                                $obj=array("item_id"=>$item_id,"stock"=>$stock_update);
                                array_push($obj_data_single,$obj);
                                
                            }else{
                                $str_error.="SKU : $sku  with ID : $item_id Stock not enough . ";
                            }
                        
                        }else{
                            $flat_check_variation=0;                          
                            $stock_variation="";
                            for($j=0;$j<($obj_variation);$j++){                                
                                if($variation_id==intval($obj_variation[$j]["variation_id"])){
                                    $stock_variation=intval($obj_variation[$j]["stock"]);
                                    $flat_check_variation=1;                                  
                                    break;
                                }                                
                               // $variation_sku=$obj_variation[$j]["variation_sku"]; 
                            }
                            if($flat_check_variation==1){                              
                                $stock_update =intval($stock_variation + $stock_insert);
                                if($stock_update>0){
                                $obj_variation=array("item_id"=>$item_id,"stock"=>$stock_update,"variation_id"=>$variation_id);
                                 array_push($obj_data_variation,$obj_variation);
                                }else{
                                    $str_error.="SKU Variation : $sku  with variation ID : $variation_id Stock not enough . ";
                                }
                                    
                            }else{
                                $str_error.="SKU Variation : $sku  with Variation ID : $variation_id Not Found . ";
                            }
                        }
                    }else{
                        $str_error.="SKU : $sku  with ID : $item_id Not Found . ";
                    }
                    
                
                //------------------------------------------------------------------------------------------------------            
                
             }
             //--------------------------------------------------------
        //     echo json_encode($obj_data_single);
            $count_list_single=count($obj_data_single);
             // Limit shopee 50 item update 1 time , we sent 40,
            $page_lengh=40;
            $page_of_single=intval($count_list_single/$page_lengh);          
            for($i=0;$i<=$page_of_single;$i++){
               $items_list=array();
               $limit_row=$page_lengh*$i;            
               $max_row=$page_lengh*($i+1); 
               if($max_row>$count_list_single){
                    $max_row=$count_list_single;
               }               
               for($j=$limit_row;$j<$max_row;$j++){
                array_push($items_list,$obj_data_single[$j]);
               }
               $parameters_update_stock_single = array(               
                    "timestamp" => $now->getTimestamp() ,                           
                    "items" =>$items_list, 
                    "partner_id" => 84013,    
                    "shopid" => 9277307 
               ); 
               echo json_encode($parameters_update_stock_single);
                
            }
             
             

             
            $count_list_variation=count($obj_variation);
            $page_of_variation_lengh=40;           
            $page_of_variation=intval($count_list_variation/$page_of_variation_lengh);          
            for($i=0;$i<=$page_of_variation;$i++){
               $items_list_variation=array();
               $limit_row=$page_of_variation_lengh*$i;            
               $max_row=$page_of_variation_lengh*($i+1); 
               if($max_row>$count_list_variation){
                    $max_row=$count_list_variation;
               }               
               for($j=$limit_row;$j<$max_row;$j++){
                array_push($items_list_variation,$obj_variation[$j]);
               }
               $parameters_update_stock_variation = array(               
                    "timestamp" => $now->getTimestamp() ,                           
                    "variations" =>$items_list_variation, 
                    "partner_id" => 84013,    
                    "shopid" => 9277307 
               ); 
               echo json_encode($parameters_update_stock_variation);
                
            }
            
             
             //--------------------------------------------------------
             
             
             
             $result_data=array("obj_single"=>$obj_data_single,"obj_variation"=>$obj_variation,"strErr"=>$str_error);
             }
             
           //  echo json_encode($str_error);
             echo json_encode($result_data);
             
       }
         
         //================ End Stock management shop mall=========
        
    //============= End Stock Management ================================================================================
    
    //============= Schedule Calendar ===================================================================================
        public function sv_schedule_calendar(){
            $db=common_connect();  
            $result=mysqli_query($db,"SELECT * FROM `tb_calendar`");
            $rows=array();
            while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
            }
            echo json_encode($rows);
            common_close_connect($db);
        }
        public function sv_schedule_calendar_update($obj){
            $db=common_connect();  
             $id=$obj["id"];
             $start=$obj["start"];
             $end=$obj["end"];
             $url=$obj["url"];
             $title=$obj["title"];
             $color=$obj["color"];
             $allday=$obj["allday"];
             $strallDay="";
             $strEnd="";
             if($end=="Invalid date"){
                $strEnd="NULL";
             }else{
                $strEnd="'".$end."'";
             }
             if($allday=="false"){  
                $strallDay= "NULL";
             }else{
                $strallDay="1"; 
             }
            // echo($title); 
             mysqli_query($db,"UPDATE `tb_calendar` SET `title`='$title',`start`='$start',`end`=$strEnd,`url`='$url',`color`='$color',`allDay`=$strallDay WHERE `id`='$id'");
            // echo ("UPDATE `tb_calendar` SET `title`='$title',`start`='$start',`end`=$strEnd,`url`='$url',`color`='$color',`allDay`=$strallDay WHERE `id`='$id'");
             common_close_connect($db);
        }
    public function sv_schedule_calendar_update_hand($obj){
        $db=common_connect();  
             $id=$obj["id"];
             $start=$obj["start"];
             $end=$obj["end"];
            
             $title=$obj["title"]; 
             $color=$obj["color"];
            
            
             $strEnd="";
             if($end==""){
                $strEnd="NULL";
             }else{
                $strEnd="'".$end."'";
             }
             mysqli_query($db,"UPDATE `tb_calendar` SET `title`='$title',`start`='$start',`end`=$strEnd,`color`='$color' WHERE `id`='$id'");
             common_close_connect($db);
    }
    public function sv_schedule_calendar_insert($obj){
         $db=common_connect();  
         $start=$obj["start"];
         $title=$obj["title"];
         $color=$obj["color"];
         mysqli_query($db,"INSERT INTO `tb_calendar`(`title`,`start`,`color`,`allDay`) VALUE('$title','$start','$color',1)");
        
         common_close_connect($db);
    }
    public function sv_schedule_calendar_delete($obj){
         $db=common_connect();          
         $id=$obj["id"];
         mysqli_query($db,"DELETE FROM `tb_calendar` WHERE `id`='$id'");
        
         common_close_connect($db);
    }
   //============= End Schedule Calendar ================================================================================     
   //============ Setting ===============================================================================================
        //==================== setting combo  =======================
        public function sv_setting_get_list_combo(){ 
            $db=common_connect();  
            $query="SELECT `product_id`,`product_name`,`sku`,price_shopee,`stock_shopee`,`stock_lazada`,`stock_tiki`,`variation_combo` ,IF(CHAR_LENGTH(`obj_combo`)>0,'connected','disconnect') AS s_connection
                    FROM `tb_stock_divide` 
                    WHERE `type_combo`=1";        
            $result=mysqli_query($db,$query);   
            
            $rows=array();
            WHILE($row=mysqli_fetch_array($result)){ 
           /*   $obj_combo=unserialize($row["obj_combo"]);                    
              if($obj_combo!=""){
                 $price=0;
                for($j=0;$j<count($obj_combo);$j++){
                    $price+=($obj_combo[$j]["price"] * $obj_combo[$j]["price"]);
                }   
                $row["price_shopee"]=   $price; 
              }*/
                        
                array_push($rows,$row);          
            }        
           
            echo json_encode($rows);
            common_close_connect($db);
        }
        public function sv_setting_get_list_item(){ 
            $db=common_connect();  
            $QUERY="SELECT a.`product_id`,a.`sku`,a.`product_name`,a.`price_web`,a.product_type
                    FROM (
                    SELECT `product_id`,`sku`,`product_name`,`price_web`,0 AS product_type,type_combo
                    FROM `tb_stock_divide` WHERE sku NOT LIKE '%-R'  AND `type_combo`=0  AND `view` =0
                    UNION
                    SELECT `product_id`,`sku`,`product_name`,`price_web`,1 AS product_type,type_combo
                    FROM `tb_stock_divide` WHERE sku  LIKE '%-R' AND `type_combo`=0 AND `view` =0) a";        
            $result=mysqli_query($db,$QUERY); 
            $ROWS=array();
            WHILE($ROW=mysqli_fetch_array($result)){ 
                array_push($ROWS,$ROW);               
            }        
           
            echo json_encode($ROWS);
            common_close_connect($db);
        } 
        public function sv_setting_get_list_detail_combo($product_id){
            $db=common_connect();
            $strquery="SELECT `product_name`,`obj_combo`,`variation_combo` FROM tb_stock_divide WHERE product_id='$product_id'";
            $result=mysqli_query($db,$strquery); 
            $rows=array();
            WHILE($row=mysqli_fetch_array($result)){ 
                $row["obj_combo"]=unserialize($row["obj_combo"]);
                array_push($rows,$row);               
            }        
           
            echo json_encode($rows);
            common_close_connect($db);
         //   echo 1;
            
        }
        public function sv_setting_event_update_detail_combo($combo_id,$obj,$text_detail){
            $db=common_connect();
            $obj=serialize($obj);
            $strquery="UPDATE `tb_stock_divide` SET `variation_combo`='$text_detail' ,`obj_combo`='$obj' WHERE `product_id`='$combo_id'";
            $result=mysqli_query($db,$strquery); 
            common_close_connect($db);
        }
        
        
        public function sv_setting_event_marketing_insert_event($obj){
            $item_id=$obj["item_id"];
            $shop_type=$obj["shop_type"];
            $str_shop="";
            $warehouse="";
            $sms="";
            if($shop_type=="1" ){
                $warehouse="tb_stock_divide";
                $str_shop="stock_shopee";
            }else if($shop_type=="2"){
                 $warehouse="tb_stock_divide";
                 $str_shop="stock_lazada";
            }
            else if($shop_type=="3"){
                 $warehouse="tb_stock_divide";
                 $str_shop="stock_tiki";
            }
            else if($shop_type=="4"){
                 $warehouse="tb_stock_divide_hanoi";
                 $str_shop="stock_shopee_eglips";
            }
            else if($shop_type=="5" ){
                 $warehouse="tb_stock_divide_hanoi";
                 $str_shop="stock_lazada_eglips";
            }
            else if($shop_type=="6" ){
                 $warehouse="tb_stock_divide_hanoi";
                 $str_shop="stock_tiki_eglips";
            }
            $db=common_connect();
            $stock="";
            $check_exist="";
            if($warehouse!=""){
                $result_check_stock=mysqli_query($db,"SELECT `product_id`,`product_name`,`sku`,`$str_shop` as `stock` FROM `$warehouse` WHERE product_id='$item_id'");
                while($row=mysqli_fetch_array($result_check_stock)){ 
                       $stock=      $row["stock"];
                       $item_name=  $row["product_name"];  
                       $sku=        $row["sku"];    
                       $stock=      $row["stock"];       
                }
                $result_check_exist=mysqli_query($db,"SELECT item_id FROM setting_event_marketing WHERE item_id='$item_id' and shop_type='$shop_type'");
                $check_exist=mysqli_num_rows($result_check_exist);
                if($stock>0 && $check_exist==0){
                    mysqli_query($db,"INSERT INTO setting_event_marketing(`item_id`,`product_name`,`sku`,`quantity_event`,`shop_type`) VALUE('$item_id','$item_name','$sku','$stock','$shop_type')");
                }else{
                    $sms="Stock not enough or exist item , Please check it .";
                } 
            }else{
                 $sms="Could not found shop type , Please check it .";
            }
            echo $sms;
                  
            common_close_connect($db);
        }   
        public function sv_setting_event_marketing_get_list_item_event($obj){           
            $shop_type=$obj["shop_type"];            
            $db=common_connect();
            $stock="";
            $check_exist="";
            $rows=array();
            if($shop_type!=0){
                $result_check_stock=mysqli_query($db,"SELECT * FROM `setting_event_marketing` WHERE shop_type='$shop_type'and `status`=0");
                while($row=mysqli_fetch_array($result_check_stock)){ 
                        array_push($rows,$row);   
                }                
            }             
            echo json_encode($rows);
            common_close_connect($db);
        } 
        public function sv_setting_marketing_get_detail_combo($obj){
             $db=common_connect();
             $string_shop="";
             $shop_type=$obj["shoptype"];
             $warehouse="";
             if($shop_type=="1" ){
                $warehouse="tb_stock_divide";
                $string_shop="_shopee";
            }else if($shop_type=="2"){
                 $warehouse="tb_stock_divide";
                 $string_shop="_lazada";
            }
            else if($shop_type=="3"){
                 $warehouse="tb_stock_divide";
                 $string_shop="_tiki";
            }
            else if($shop_type=="4"){
                 $warehouse="tb_stock_divide_hanoi";
                 $string_shop="_shopee_eglips";
            }
            else if($shop_type=="5" ){
                 $warehouse="tb_stock_divide_hanoi";
                 $string_shop="_lazada_eglips";
            }
            else if($shop_type=="6" ){
                 $warehouse="tb_stock_divide_hanoi";
                 $string_shop="_tiki_eglips";
            }
            
            
     $QUERY="SELECT a.product_id AS `id`,a.sku,a.product_name AS `name`,a.price$string_shop AS `price`,a.stock$string_shop AS `stock` ,b.product_id AS `id_regular`,b.sku AS `sku_regular`,b.price$string_shop AS `price_regular` ,b.stock$string_shop AS `stock_regular`
                    FROM (SELECT `product_id`,`sku`,`product_name`,`price$string_shop`,`stock$string_shop` 
                    FROM `$warehouse` WHERE sku NOT LIKE '%-R') AS a
                    LEFT JOIN  (SELECT `product_id`,`sku`,`product_name`,`price$string_shop`,`stock$string_shop` 
                    FROM `$warehouse` WHERE sku  LIKE '%-R') AS b ON a.product_name=b.product_name";        
             $result=mysqli_query($db,$QUERY);   
            
             $ROWS=array();
             WHILE($ROW=mysqli_fetch_array($result)){ 
                    array_push($ROWS,$ROW);               
                }
          //  $query_get_detail_list=       
           
            echo json_encode($ROWS);
            common_close_connect($db);
             
        }   
     public function sv_setting_event_marketing_delete_item_event($id){ 
          $db=common_connect();
          mysqli_query($db,"DELETE FROM  `setting_event_marketing` WHERE `id` = '$id'");        
          common_close_connect($db);
     }
    public function sv_setting_event_marketing_update_detail_item_event($obj){
        $db=common_connect();
       // $str="";
        $board_id=$obj[0]["board_id"];
        $check_exist=mysqli_query($db,"SELECT * FROM `setting_event_marketing_detail` WHERE board_id='$board_id'");      
        $rowcount=mysqli_num_rows($check_exist); 
        if($rowcount!=0){
            mysqli_query($db,"DELETE FROM  `setting_event_marketing_detail` WHERE `id` = '$id'");
        } 
        for($i=0;$i<count($obj);$i++){
            $item_id=$obj[$i]["product_id"];
            $name=$obj[$i]["product_name"];
            $item_price=$obj[$i]["price"];
            $product_type=$obj[$i]["shop"];            
            $quantity=$obj[$i]["quantity"];
            $board_id=$obj[$i]["board_id"];
            mysqli_query($db,"INSERT INTO `setting_event_marketing_detail`(`board_id`,`shop_type`,`product_id`,`product_name`,`product_price`,`product_quantity`) VALUE ('$board_id','$product_type','$item_id','$name','$item_price','$quantity')"); 
        }       
      //  echo $rowcount; 
        common_close_connect($db);
    }
        //==================== End setting combo =====================
        
        //====================  setting flash sale ===================
        
         public function sv_SETTING_get_product_sky007vn(){          
            $db_sky007=common_connect_sky007(); 
            $result=   mysqli_query($db_sky007,"SELECT p.id,p.post_title AS `product_name` ,
                                           MAX( CASE WHEN pm.meta_key = '_sku' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sku,
                                           MAX( CASE WHEN pm.meta_key = '_sale_price' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sale_price,
                                           MAX( CASE WHEN pm.meta_key = '_stock' AND p.ID = pm.post_id THEN pm.meta_value END ) AS stock
                                        FROM `aowp_posts` p  
                                        	LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id
                                        WHERE  p.post_type IN ('product','product_variation') AND p.post_status!='draft'  AND p.post_status!='trash' 
                                        GROUP BY p.id");             
            $data=array();
            WHILE($row=mysqli_fetch_array($result)){ 
                array_push($data,$row);               
            }            
            echo json_encode($data);                  
            common_close_connect($db_sky007);
        } 
         public function sv_setting_event_sale_of_insert_flash_sale($obj){
            $item_id=$obj["item_id"];
            $sku=$obj["sku"];
            $name=$obj["product_name"];
            $item_price=$obj["item_price"];     
            $shop_type=$obj["shop_type"];      
            $db=common_connect(); 
            $db_eglips=common_connect_eglips();
            $db_mixsoon =common_connect_mixsoon(); 
            $data_connect="";
            if($shop_type==0){
                $data_connect=$db;
            }else if($shop_type==1){
                 $data_connect=$db_eglips;
            }else if($shop_type==2){
                 $data_connect=$db_mixsoon;
            }
            mysqli_query($data_connect,"INSERT INTO setting_envent_flash_sale(`item_id`,`sku`,`item_name`,`original_price`) VALUE('$item_id','$sku','$name','$item_price')");                   
            common_close_connect($db);
            common_close_connect($db_eglips);
            common_close_connect($db_mixsoon);
        } 
        public function sv_setting_flash_sale_excel_insert($obj,$shop_type){
            $db=common_connect(); 
            $db_sky007=common_connect_sky007(); 
            $db_eglips=common_connect_eglips();
            $db_mmixsoon=common_connect_mixsoon();
            $db_connection="";
            $result="";  
            if($shop_type==0){
                $db_connection=$db;
                $result=mysqli_query($db_sky007,"SELECT p.id,p.post_title AS `product_name` ,
                                           MAX( CASE WHEN pm.meta_key = '_sku' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sku,
                                           MAX( CASE WHEN pm.meta_key = '_sale_price' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sale_price,
                                           MAX( CASE WHEN pm.meta_key = '_stock' AND p.ID = pm.post_id THEN pm.meta_value END ) AS stock
                                        FROM `aowp_posts` p  
                                        	LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id
                                        WHERE  p.post_type IN ('product','product_variation') AND p.post_status!='draft'  AND p.post_status!='trash' 
                                        GROUP BY p.id"); 
            }else if($shop_type==1){
                $db_connection=$db_eglips;
                $result=mysqli_query($db_eglips,"SELECT p.id,p.post_title AS `product_name` ,
                                           MAX( CASE WHEN pm.meta_key = '_sku' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sku,
                                           MAX( CASE WHEN pm.meta_key = '_sale_price' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sale_price,
                                           MAX( CASE WHEN pm.meta_key = '_stock' AND p.ID = pm.post_id THEN pm.meta_value END ) AS stock
                                        FROM `wp_eglips_posts` p  
                                        	LEFT JOIN `wp_eglips_postmeta` pm ON p.id=pm.post_id
                                        WHERE  p.post_type IN ('product','product_variation') AND p.post_status!='draft'  AND p.post_status!='trash' AND p.post_title !=''
                                        GROUP BY p.id");
            }else if($shop_type==2){
                $db_connection=$db_mmixsoon;
                $result=mysqli_query($db_mmixsoon,"SELECT p.id,p.post_title AS `product_name` ,
                                           MAX( CASE WHEN pm.meta_key = '_sku' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sku,
                                           MAX( CASE WHEN pm.meta_key = '_sale_price' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sale_price,
                                           MAX( CASE WHEN pm.meta_key = '_stock' AND p.ID = pm.post_id THEN pm.meta_value END ) AS stock
                                        FROM `wp_posts` p  
                                        	LEFT JOIN `wp_postmeta` pm ON p.id=pm.post_id
                                        WHERE  p.post_type IN ('product','product_variation') AND p.post_status!='draft'  AND p.post_status!='trash' 
                                        GROUP BY p.id");
            }              
            $data=array();
            WHILE($row=mysqli_fetch_array($result)){ 
                array_push($data,$row);               
            } 
            for($i=0;$i<count($obj);$i++){
                for($j=0;$j<count($data);$j++){
                    if($data[$j]["sku"]==$obj[$i]["sku"]){
                        $item_id=$data[$j]["id"];
                        $item_name=$data[$j]["product_name"];
                        
                        $sku=$obj[$i]["sku"];
                        $sale_price=$obj[$i]["sale_price"];
                        $original_price=$obj[$i]["original_price"];
                        $start_time=$obj[$i]["start_time"];   
                        $end_time=$obj[$i]["end_time"];                         
                        mysqli_query($db_connection,"INSERT INTO `setting_envent_flash_sale`(`item_id`,`sku`,`item_name`,`sale_price`,`original_price`,`start_time`,`end_time`) VALUE('$item_id','$sku','$item_name','$sale_price','$original_price','$start_time','$end_time')");                   
                    }
                }                 
            }            
            common_close_connect($db);
            common_close_connect($db_sky007);
            common_close_connect($db_eglips);
            common_close_connect($db_mmixsoon);
        }
        
        public function sv_setting_event_setting_excel_insert($obj){   
            $data_excel=$obj["data_excel"];
            $shop_type=$obj["shop_type"];
            $db_sky007=common_connect_sky007(); 
            $db_eglips=common_connect_eglips();
            $db_mixsoon=common_connect_mixsoon();
            if($shop_type==0){
              $result=   mysqli_query($db_sky007,"SELECT p.id,p.post_title AS `product_name` ,
                                               MAX( CASE WHEN pm.meta_key = '_sku' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sku,
                                               MAX( CASE WHEN pm.meta_key = '_sale_price' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sale_price,
                                               MAX( CASE WHEN pm.meta_key = '_stock' AND p.ID = pm.post_id THEN pm.meta_value END ) AS stock
                                            FROM `aowp_posts` p  
                                            	LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id
                                            WHERE  p.post_type IN ('product','product_variation') AND p.post_status!='draft'  AND p.post_status!='trash' 
                                            GROUP BY p.id");             
                $data=array();
                WHILE($row=mysqli_fetch_array($result)){ 
                    array_push($data,$row);               
                } 
                for($i=0;$i<count($data_excel);$i++){
                    for($j=0;$j<count($data);$j++){
                        if($data[$j]["sku"]==$data_excel[$i]["sku"]){
                            $item_id=$data[$j]["id"];
                            $item_name=$data[$j]["product_name"];
                            
                            $sku=$data_excel[$i]["sku"];
                            $sale_price=$data_excel[$i]["sale_price"];
                            $original_price=$data_excel[$i]["original_price"];
                            $start_time=$data_excel[$i]["start_time"];   
                            $end_time=$data_excel[$i]["end_time"]; 
                         //   echo        "INSERT INTO `tb_setting_time_sale_product`(`product_id`,`sku`,`product_name`,`sale_price`,`regular_price`,`start_time`,`start_time`,`flag`) VALUE('$item_id','$sku','$item_name','$sale_price','$original_price','$start_time','$end_time','0')";                
                            mysqli_query($db_sky007,"INSERT INTO `tb_setting_time_sale_product`(`product_id`,`sku`,`product_name`,`sale_price`,`regular_price`,`start_time`,`end_time`,`flag`) VALUE('$item_id','$sku','$item_name','$sale_price','$original_price','$start_time','$end_time','0')");                   
                        }
                    }                 
                }  
            }else if($shop_type==1){
              $result=   mysqli_query($db_eglips,"SELECT p.id,p.post_title AS `product_name` ,
                                               MAX( CASE WHEN pm.meta_key = '_sku' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sku,
                                               MAX( CASE WHEN pm.meta_key = '_sale_price' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sale_price,
                                               MAX( CASE WHEN pm.meta_key = '_stock' AND p.ID = pm.post_id THEN pm.meta_value END ) AS stock
                                            FROM `wp_eglips_posts` p  
                                            	LEFT JOIN `wp_eglips_postmeta` pm ON p.id=pm.post_id
                                            WHERE  p.post_type IN ('product','product_variation') AND p.post_status!='draft'  AND p.post_status!='trash' AND p.post_title !=''
                                            GROUP BY p.id");             
                $data=array();
                WHILE($row=mysqli_fetch_array($result)){ 
                    array_push($data,$row);               
                } 
                for($i=0;$i<count($data_excel);$i++){
                    for($j=0;$j<count($data);$j++){
                       
                        if($data[$j]["sku"]==$data_excel[$i]["sku"]){
                          //   echo $data[$j]["sku"]."__",$data_excel[$i]["sku"];
                            $item_id=$data[$j]["id"];
                            $item_name=$data[$j]["product_name"];
                            
                            $sku=$data_excel[$i]["sku"];
                            $sale_price=$data_excel[$i]["sale_price"];
                            $original_price=$data_excel[$i]["original_price"];
                            $start_time=$data_excel[$i]["start_time"];   
                            $end_time=$data_excel[$i]["end_time"]; 
                         //   echo        "INSERT INTO `tb_setting_time_sale_product`(`product_id`,`sku`,`product_name`,`sale_price`,`regular_price`,`start_time`,`start_time`,`flag`) VALUE('$item_id','$sku','$item_name','$sale_price','$original_price','$start_time','$end_time','0')";                
                            mysqli_query($db_eglips,"INSERT INTO `tb_setting_time_sale_product`(`product_id`,`sku`,`product_name`,`sale_price`,`regular_price`,`start_time`,`end_time`,`flag`) VALUE('$item_id','$sku','$item_name','$sale_price','$original_price','$start_time','$end_time','0')");                   
                        }
                    }                 
                }  
            }else if($shop_type==2){
              $result=   mysqli_query($db_mixsoon,"SELECT p.id,p.post_title AS `product_name` ,
                                               MAX( CASE WHEN pm.meta_key = '_sku' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sku,
                                               MAX( CASE WHEN pm.meta_key = '_sale_price' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sale_price,
                                               MAX( CASE WHEN pm.meta_key = '_stock' AND p.ID = pm.post_id THEN pm.meta_value END ) AS stock
                                            FROM `wp_posts` p  
                                            	LEFT JOIN `wp_postmeta` pm ON p.id=pm.post_id
                                            WHERE  p.post_type IN ('product','product_variation') AND p.post_status!='draft'  AND p.post_status!='trash' AND p.post_title !=''
                                            GROUP BY p.id");             
                $data=array();
                WHILE($row=mysqli_fetch_array($result)){ 
                    array_push($data,$row);               
                } 
                for($i=0;$i<count($data_excel);$i++){
                    for($j=0;$j<count($data);$j++){
                        if($data[$j]["sku"]==$data_excel[$i]["sku"]){
                            $item_id=$data[$j]["id"];
                            $item_name=$data[$j]["product_name"];
                            
                            $sku=$data_excel[$i]["sku"];
                            $sale_price=$data_excel[$i]["sale_price"];
                            $original_price=$data_excel[$i]["original_price"];
                            $start_time=$data_excel[$i]["start_time"];   
                            $end_time=$data_excel[$i]["end_time"]; 
                         //   echo        "INSERT INTO `tb_setting_time_sale_product`(`product_id`,`sku`,`product_name`,`sale_price`,`regular_price`,`start_time`,`start_time`,`flag`) VALUE('$item_id','$sku','$item_name','$sale_price','$original_price','$start_time','$end_time','0')";                
                            mysqli_query($db_mixsoon,"INSERT INTO `tb_setting_time_sale_product`(`product_id`,`sku`,`product_name`,`sale_price`,`regular_price`,`start_time`,`end_time`,`flag`) VALUE('$item_id','$sku','$item_name','$sale_price','$original_price','$start_time','$end_time','0')");                   
                        }
                    }                 
                }  
            }
                        
            common_close_connect($db_sky007);   
            common_close_connect($db_eglips);
            common_close_connect($db_mixsoon); 
        }
         
        //==================== End setting flash sale ===================
        public function sv_setting_event_get_list_product($shop_type){           
            $db_sky007=common_connect_sky007();  
            $db_hince=common_connect_hince();
            $db_bbia=common_connect_bbia();
            $result="";
            if($shop_type==0){
               $result=mysqli_query($db_sky007,"SELECT p.id,p.post_title AS `product_name` ,
                                                           MAX( CASE WHEN pm.meta_key = '_sku' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sku
                                                        FROM `aowp_posts` p  
                                                        	LEFT JOIN `aowp_postmeta` pm ON p.id=pm.post_id
                                                        WHERE  p.post_type IN ('product','product_variation')  AND p.post_status!='draft'  AND p.post_status!='trash' 
                                                        GROUP BY p.id"); 
            }else if($shop_type==1){
               $result=mysqli_query($db_bbia,"SELECT p.id,p.post_title AS `product_name` ,
                                                   MAX( CASE WHEN pm.meta_key = '_sku' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sku
                                                FROM `wp_posts` p  
                                                	LEFT JOIN `wp_postmeta` pm ON p.id=pm.post_id
                                                WHERE  p.post_type IN ('product','product_variation')  AND p.post_status!='draft'  AND p.post_status!='trash' AND p.post_title !='' AND p.post_parent =0
                                                GROUP BY p.id"); 
            }else if($shop_type==2){
               $result=mysqli_query($db_hince,"SELECT p.id,p.post_title AS `product_name` ,
                           MAX( CASE WHEN pm.meta_key = '_sku' AND p.ID = pm.post_id THEN pm.meta_value END ) AS sku   
                        FROM `wp_hince_posts` p  
                        	LEFT JOIN `wp_hince_postmeta` pm ON p.id=pm.post_id
                        WHERE  p.post_type IN ('product','product_variation')  AND p.post_status!='draft'  AND p.post_status!='trash' AND p.post_parent =0
                        GROUP BY p.id"); 
            }
            
                                                        
            $rows=array();          
            while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
            } 
            echo json_encode($rows);
             
            common_close_connect($db_sky007);
            common_close_connect($db_bbia);
            common_close_connect($db_hince);
        }
        public function sv_setting_event_sale_of_insert_event($obj){
            $item_id=$obj["item_id"];
            $name=$obj["product_name"];
            $item_price=$obj["item_price"]; 
            $sku    =        $obj["sku"]; 
            $shop_type=$obj["shop_type"]; 
            $db_sky007=common_connect_sky007();  
            $db_eglips= common_connect_eglips();  
            $db_mixsoon= common_connect_mixsoon();   
            if($shop_type==0){
                mysqli_query($db_sky007,"INSERT INTO tb_setting_time_sale_product(`product_id`,`product_name`,`sku`,`regular_price`,`flag`) VALUE('$item_id','$name','$sku','$item_price','2')");   
            }else if($shop_type==1){
                mysqli_query($db_eglips,"INSERT INTO tb_setting_time_sale_product(`product_id`,`product_name`,`sku`,`regular_price`,`flag`) VALUE('$item_id','$name','$sku','$item_price','2')"); 
            }else if($shop_type==2){
                mysqli_query($db_mixsoon,"INSERT INTO tb_setting_time_sale_product(`product_id`,`product_name`,`sku`,`regular_price`,`flag`) VALUE('$item_id','$name','$sku','$item_price','2')"); 
            }
      
            
              
            common_close_connect($db_sky007);
        }
        
        public function sv_setting_conver_membership($obj){          
            $membership=$obj;             
            $str_capabilities="";
            if($membership=="bronze"){
                $str_capabilities='a:2:{s:6:"bronze";b:1;s:8:"customer";b:1;}';
            }else if($membership=="silver"){
                $str_capabilities='a:2:{s:6:"sliver";b:1;s:8:"customer";b:1;}';
            }else if($membership=="gold"){
                $str_capabilities='a:2:{s:4:"gold";b:1;s:8:"customer";b:1;}';
            }else if($membership=="vip"){
                $str_capabilities='a:2:{s:8:"platinum";b:1;s:8:"customer";b:1;}';
            }
            $db=common_connect();
          // echo('UPDATE aowp_usermeta SET meta_value=\'a:2:{s:7:"general";b:1;s:8:"customer";b:1;}\' WHERE meta_key=\'aowp_capabilities\' AND meta_value=\''.$str_capabilities.'\'');
            mysqli_query($db,'UPDATE aowp_usermeta SET meta_value=\'a:2:{s:7:"general";b:1;s:8:"customer";b:1;}\' WHERE meta_key=\'aowp_capabilities\' AND meta_value=\''.$str_capabilities.'\'');
            common_close_connect($db);
            
        }
        public function sv_setting_update_membership($data){  
            // 1:bronze ; 2:silver ; 3 : gold ; 4 :vip
            $str_bronze="";
            $str_sliver="";
            $str_gold="";
            $str_vip="";
            for($i=0;$i<count($data);$i++){
                $user_id=$data[$i]["user_id"];
                $membership_type=strval($data[$i]["membership"]);
                if($user_id!=""){
                    if($membership_type=="1"){
                    $str_bronze.=$user_id.",";
                    }else if($membership_type=="2"){
                        $str_sliver.=$user_id.",";
                    }else if($membership_type=="3"){
                        $str_gold.=$user_id.",";
                    }else if($membership_type=="4"){
                        $str_vip.=$user_id.",";
                    }
                }                
                
            }
          
            $db=common_connect();
            if(strlen($str_bronze)>0){
                $str_bronze=rtrim($str_bronze, ',');             
                mysqli_query($db,'UPDATE aowp_usermeta SET meta_value=\'a:2:{s:6:"bronze";b:1;s:8:"customer";b:1;}\' WHERE meta_key=\'aowp_capabilities\' AND user_id IN ('.$str_bronze.')');
            }
            if(strlen($str_sliver)>0){
                $str_sliver=rtrim($str_sliver, ',');
                mysqli_query($db,'UPDATE aowp_usermeta SET meta_value=\'a:2:{s:6:"sliver";b:1;s:8:"customer";b:1;}\' WHERE meta_key=\'aowp_capabilities\' AND user_id IN ('.$str_sliver.')');
            }
            if(strlen($str_gold)>0){
                $str_gold=rtrim($str_gold, ',');               
                mysqli_query($db,'UPDATE aowp_usermeta SET meta_value=\'a:2:{s:4:"gold";b:1;s:8:"customer";b:1;}\' WHERE meta_key=\'aowp_capabilities\' AND user_id IN ('.$str_gold.')');

            }
            if(strlen($str_vip)>0){
                $str_vip=rtrim($str_vip, ',');              
                mysqli_query($db,'UPDATE aowp_usermeta SET meta_value=\'a:2:{s:8:"platinum";b:1;s:8:"customer";b:1;}\' WHERE meta_key=\'aowp_capabilities\' AND user_id IN ('.$str_vip.')');
 
            }           
            common_close_connect($db);
            
        }
        public function sv_setting_get_account(){
            $db=common_connect();                 
            $rows=array();
            $result=mysqli_query($db,"SELECT  id,email,`name`,permission,limit_menu,active FROM `tb_barcode_manager`");
            while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
            } 
            echo json_encode($rows);
            common_close_connect($db); 
        }
        public function sv_setting_account($obj){  
            $id_account=$obj["id"];
            $email=$obj["email"];
            $password=$obj["password"];
            $name=$obj["name"];
            $permission=$obj["permission"];
            $active=$obj["active"];
            $limit_menu=json_encode($obj["limit_menu"]);
            
            
            $action=$obj["action"]; // 0: create new ; 1: update
            $md5_pass=md5($password);
            $query="";
            if($action=="0"){
               $query="INSERT INTO `tb_barcode_manager`(`email`,`name`,`permission`,`limit_menu`,`password`,`active`) VALUE('$email','$name','$permission','$limit_menu','$md5_pass','$active')"; 
            }else{
                if($password==""){
                    $query="UPDATE `tb_barcode_manager` SET `email`='$email',`name`='$name',`permission`='$permission',`limit_menu`='$limit_menu',`active`='$active' WHERE id='$id_account'";
                }else{
                    $query="UPDATE `tb_barcode_manager` SET `email`='$email',`name`='$name',`permission`='$permission',`limit_menu`='$limit_menu',`active`='$active',`password`='$md5_pass' WHERE id='$id_account'";
                }
            }
            $db=common_connect(); 
            mysqli_query($db,$query);  
            common_close_connect($db); 
        }
        public function sv_setting_get_account_id($id_account){
            $db=common_connect();                 
            $rows=array();
            $result=mysqli_query($db,"SELECT limit_menu FROM `tb_barcode_manager` where id='$id_account'");
            while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
            } 
            echo json_encode($rows);
            common_close_connect($db);
        }
        public function sv_setting_get_list_product(){
            $db=common_connect();                 
            $rows=array();
            $result=mysqli_query($db,"SELECT product_id,product_name,sku,main_name,sub_name,link_img from tb_stock_divide");
            while($row=mysqli_fetch_array($result)){ 
                    array_push($rows,$row);               
            } 
            echo json_encode($rows);
            common_close_connect($db);
        }
        public function setting_update_product($obj){
            $db=common_connect();   
            $product_id=$obj["product_id"];
            $mainName=$obj["mainName"];
            $subName=$obj["subName"];
            $link_name=$obj["link_name"]; 
            if($link_name!=""){
                mysqli_query($db,"UPDATE tb_stock_divide SET main_name='$mainName',sub_name='$subName',link_img='$link_name' WHERE product_id='$product_id'");   
            }else{
                mysqli_query($db,"UPDATE tb_stock_divide SET main_name='$mainName',sub_name='$subName' WHERE product_id='$product_id'");
            }  
                       
            common_close_connect($db);
            
        }
//============ End Setting ============================================================================================== 
}

               
?>





