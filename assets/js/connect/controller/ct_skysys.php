<?php
require_once 'common.php';
require_once 'server/sv_skysys.php';
 

$url         = explode('.', $_GET['controller']);
$task        = $url[1];
$varFunction = "$task";
$varFunction();
?>
<?php
//============= Login ========================================================================================
function ct_login(){
    $obj=$_POST["obj"]; 
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_login($obj);
}
//============= End Login ====================================================================================
//============= Dashboard ====================================================================================
function ct_dashboard_get_data_chart()
{   
    $postdata = file_get_contents("php://input");  
    $request = json_decode($postdata);
    @$fromdate = $request->fromdate;
    @$todate = $request->todate;
    @$category = $request->category;   
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_dashboard_get_data_chart($fromdate,$todate,$category);
  
}
 
function ct_dashboard_get_info_sale(){
    $postdata = file_get_contents("php://input");  
    $request = json_decode($postdata);
    @$fromdate = $request->fromdate;
    @$todate = $request->todate;  
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_dashboard_get_info_sale($fromdate,$todate);
}
//=============End Dashboard ====================================================================================

//============= Chart Report ====================================================================================
        //============ Customer =======================================
function ct_chart_report_customer(){
    $postdata = file_get_contents("php://input");  
    $request = json_decode($postdata);
    @$fromdate = $request->fromdate;
    @$todate = $request->todate;
    @$category = $request->category; 
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_customer($fromdate,$todate,$category);
}
        //============End Customer =====================================
        //============ Category =======================================
function ct_chart_report_category(){
    $postdata = file_get_contents("php://input");  
    $request = json_decode($postdata);
    @$fromdate = $request->fromdate;
    @$todate = $request->todate;
    @$category = $request->category; 
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_category($fromdate,$todate,$category);
}
        //============End Category =====================================
        //============ Location  =======================================
function ct_chart_report_location(){
    $obj=$_POST["obj"]; 
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_location($obj);
}
function ct_chart_report_location_compare(){
    $obj=$_POST["obj"]; 
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_location_compare($obj);
}
        //============ End Location  ===================================
        //==================== Item  ===================================
function ct_chart_report_item_get_list_product(){
    $product_type=$_POST['product_type'];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_item_get_list_product($product_type);
}
function ct_chart_report_item_get_list_daily_sale(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_item_get_list_daily_sale($obj);
} 
function ct_chart_report_item_get_list_monthly_sale(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_item_get_list_monthly_sale($obj);
}
function ct_chart_report_item_get_list_top_sale(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_item_get_list_top_sale($obj);
}            
        //============ End Item  =======================================
        
        //============ Heat Map ========================================
function ct_chart_report_heat_map(){
    $obj=$_POST["obj"];  
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_heat_map($obj);
}        
        
        
        //============= End Heat Map ===================================
        //==================== Time Based ==============================
function ct_chart_report_time_based(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_time_based($obj);
}  
function ct_chart_report_time_based_monthly_sale(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_time_based_monthly_sale($obj);
}   
function ct_chart_report_time_based_monthly_comparison(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_time_based_monthly_comparison($obj);
} 
function ct_chart_report_time_based_monthly_sale_total(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_time_based_monthly_sale_total($obj);
}    
        //==================== End Time Based ==========================
        //==================== Chart Order =============================
function ct_chart_report_order(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_order($obj);
}   
function ct_chart_report_order_total(){
    
    $postdata = file_get_contents("php://input");  
    $request = json_decode($postdata);
    @$fromdate = $request->start_date;
    @$todate = $request->end_date;
    @$get_all = $request->get_all;  
    $obj_sv_sky007       = new sever_skysys();
    $data=$obj_sv_sky007->sv_chart_report_order_total_new($fromdate,$todate);
    $data_order_total=$data["order_total"];
    
    $number_order_total=0;   
    $number_cancel_total=0;
    $number_items_total=0;
    $number_itemsmt_total=0;
    $cancel_rates_total=0;
    
    $number_order_sky007=0;   
    $number_cancel_sky007=0;
    $number_items_sky007=0;
    $number_itemsmt_sky007=0;
    $cancel_rates_sky007=0;
    
    $number_order_wholesaler=0;   
    $number_cancel_wholesaler=0;
    $number_items_wholesaler=0;  
    $cancel_rates_wholesaler=0;
    
    $number_order_shopeebbia=0;   
    $number_cancel_shopeebbia=0;
    $number_items_shopeebbia=0;
    $number_itemsmt_shopeebbia=0;
    $cancel_rates_shopeebbia=0;
    
    $number_order_shopeehince=0;   
    $number_cancel_shopeehince=0;
    $number_items_shopeehince=0;
    $number_itemsmt_shopeehince=0;
    $cancel_rates_shopeehince=0;
    
    $number_order_hince=0;   
    $number_cancel_hince=0;
    $number_items_hince=0;
    $number_itemsmt_hince=0;
    $cancel_rates_hince=0;
    
    $number_order_eglipswholesaler=0;   
    $number_cancel_eglipswholesaler=0;
    $number_items_eglipswholesaler=0;  
    $cancel_rates_eglipssky007=0;
    
    $number_order_sociolla=0;   
    $number_cancel_sociolla=0;
    $number_items_sociolla=0;
    $number_itemsmt_sociolla=0;
    $cancel_rates_sociolla=0;
    
    $number_order_lazadabbia=0;   
    $number_cancel_lazadabbia=0;
    $number_items_lazadabbia=0;
    $number_itemsmt_lazadabbia=0;
    $cancel_rates_lazadabbia=0;
    
    $number_order_lazadahince=0;   
    $number_cancel_lazadahince=0;
    $number_items_lazadahince=0;
    $number_itemsmt_lazadahince=0;
    $cancel_rates_lazadahince=0;
    
    $number_order_watson=0;   
    $number_cancel_watson=0;
    $number_items_watson=0;
    $number_itemsmt_watson=0;
    $cancel_rates_watson=0;
    
    $number_order_tikibbia=0;   
    $number_cancel_tikibbia=0;
    $number_items_tikibbia=0;
    $number_itemsmt_tikibbia=0;
    $cancel_rates_tikibbia=0;
    
    $number_order_tiktokhince=0;   
    $number_cancel_tiktokhince=0;
    $number_items_tiktokhince=0;
    $number_itemsmt_tiktokhince=0;
    $cancel_rates_tiktokhince=0;
    
    $number_order_bbiavn=0;   
    $number_cancel_bbiavn=0;
    $number_items_bbiavn=0;
    $number_itemsmt_bbiavn=0;
    $cancel_rates_bbiavn=0;
    
    $number_order_mixsoon=0;   
    $number_cancel_mixsoon=0;
    $number_items_mixsoon=0;
    $number_itemsmt_mixsoon=0;
    $cancel_rates_mixsoon=0;
    
    $number_order_guardian=0;   
    $number_cancel_guardian=0;
    $number_items_guardian=0;
    $number_itemsmt_guardian=0;
    $cancel_rates_guardian=0;
    
    $number_order_shopeemixsoon=0;   
    $number_cancel_shopeemixsoon=0;
    $number_items_shopeemixsoon=0;
    $number_itemsmt_shopeemixsoon=0;
    $cancel_rates_shopeemixsoon=0;
    
    $number_order_lazadamixsoon=0;   
    $number_cancel_lazadamixsoon=0;
    $number_items_lazadamixsoon=0;
    $number_itemsmt_lazadamixsoon=0;
    $cancel_rates_lazadamixsoon=0;
    
    $number_order_tiktoksky007=0;   
    $number_cancel_tiktoksky007=0;
    $number_items_tiktoksky007=0;
    $number_itemsmt_tiktoksky007=0;
    $cancel_rates_tiktoksky007=0;
    
    $number_order_tiktokmixsoon=0;   
    $number_cancel_tiktokmixsoon=0;
    $number_items_tiktokmixsoon=0;
    $number_itemsmt_tiktokmixsoon=0;
    $cancel_rates_tiktokmixsoon=0;
    
    for($i=0;$i<count($data_order_total);$i++){
        $order_category=$data_order_total[$i]["ord_category"];
        $post_status=$data_order_total[$i]["post_status"];
        if($order_category==0){
            if($post_status==1){
                $number_order_sky007++;
            }else{
                $number_cancel_sky007++;
            }
            
        }else if ($order_category==7){
            if($post_status==1){
                $number_order_wholesaler++;
            }else{
                $number_cancel_wholesaler++;
            }
        }else if ($order_category==10){
            if($post_status==1){
                $number_order_shopeebbia++;
            }else{
                $number_cancel_shopeebbia++;
            }
        }       
        else if ($order_category==64){
            if($post_status==1){
                $number_order_hince++;
            }else{
                $number_cancel_hince++;
            }
        }
        else if ($order_category==20){
            if($post_status==1){
                $number_order_lazadabbia++;
            }else{
                $number_cancel_lazadabbia++;
            }
        }
        else if ($order_category==22){
            if($post_status==1){
                $number_order_eglipswholesaler++;
            }else{
                $number_cancel_eglipswholesaler++;
            }
        }
        else if ($order_category==66){
            if($post_status==1){
                $number_order_shopeehince++;
            }else{
                $number_cancel_shopeehince++;
            }
        }
        else if ($order_category==68){
            if($post_status==1){
                $number_order_lazadahince++;
            }else{
                $number_cancel_lazadahince++;
            }
        }      
        else if ($order_category==30){
            if($post_status==1){
                $number_order_watson++;
            }else{
                $number_cancel_watson++;
            }
        }        
        else if ($order_category==36){
            if($post_status==1){
                $number_order_tikibbia++;
            }else{
                $number_cancel_tikibbia++;
            }
        }
        else if ($order_category==70){
            if($post_status==1){
                $number_order_tiktokhince++;
            }else{
                $number_cancel_tiktokhince++;
            }
        }
         else if ($order_category==44){
            if($post_status==1){
                $number_order_sociolla++;
            }else{
                $number_cancel_sociolla++;
            }
        }
        else if ($order_category==46){
            if($post_status==1){
                $number_order_bbiavn++;
            }else{
                $number_cancel_bbiavn++;;
            }
        }
        else if ($order_category==48){
            if($post_status==1){
                $number_order_mixsoon++;
            }else{
                $number_cancel_mixsoon++;;
            }
        }else if ($order_category==50){
            if($post_status==1){
                $number_order_guardian++;
            }else{
                $number_cancel_guardian++;;
            }
        }else if ($order_category==52){
            if($post_status==1){
                $number_order_shopeemixsoon++;
            }else{
                $number_cancel_shopeemixsoon++;;
            }
        }else if ($order_category==54){
            if($post_status==1){
                $number_order_lazadamixsoon++;
            }else{
                $number_cancel_lazadamixsoon++;;
            }
        }else if ($order_category==58){
            if($post_status==1){
                $number_order_tiktoksky007++;
            }else{
                $number_cancel_tiktoksky007++;;
            }
        }else if ($order_category==60){
            if($post_status==1){
                $number_order_tiktokmixsoon++;
            }else{
                $number_cancel_tiktokmixsoon++;;
            }
        }
    }
    $data_items_total=$data["items_total"];
    for($i=0;$i<count($data_items_total);$i++){
        $category=$data_items_total[$i]["ord_category"];
        $number_of_items=intval($data_items_total[$i]["number_of_items"]);
        if($category==0){
            $number_items_sky007=intval($number_items_sky007)+$number_of_items;
        }else if($category==5){
            $number_itemsmt_sky007=intval($number_itemsmt_sky007)+$number_of_items;
        }else if($category==7){
            $number_items_wholesaler=intval($number_items_wholesaler)+$number_of_items;
        }else if($category==7){
            $number_items_wholesaler=intval($number_items_wholesaler)+$number_of_items;
        }else if($category==10){
            $number_items_shopeebbia=intval($number_items_shopeebbia)+$number_of_items;
        }else if($category==11){
            $number_itemsmt_shopeebbia=intval($number_itemsmt_shopeebbia)+$number_of_items;
        }else if($category==64){
            $number_items_hince=intval($number_items_hince)+$number_of_items;
        }else if($category==65){
            $number_itemsmt_hince=intval($number_itemsmt_hince)+$number_of_items;
        }else if($category==20){
            $number_items_lazadabbia=intval($number_items_lazadabbia)+$number_of_items;
        }else if($category==21){
            $number_itemsmt_lazadabbia=intval($number_itemsmt_lazadabbia)+$number_of_items;
        }else if($category==22){
            $number_items_eglipswholesaler=intval($number_items_eglipswholesaler)+$number_of_items;
        }else if($category==66){
            $number_items_shopeehince=intval($number_items_shopeehince)+$number_of_items;
        }else if($category==67){
            $number_itemsmt_shopeehince=intval($number_itemsmt_shopeehince)+$number_of_items;
        }else if($category==68){
            $number_items_lazadahince=intval($number_items_lazadahince)+$number_of_items;
        }else if($category==69){
            $number_itemsmt_lazadahince=intval($number_itemsmt_lazadahince)+$number_of_items;
        }else if($category==30){
            $number_items_watson=intval($number_items_watson)+$number_of_items;
        }else if($category==31){
            $number_itemsmt_watson=intval($number_itemsmt_watson)+$number_of_items;
        }else if($category==36){
            $number_items_tikibbia=intval($number_items_tikibbia)+$number_of_items;
        }else if($category==37){
            $number_itemsmt_tikibbia=intval($number_itemsmt_tikibbia)+$number_of_items;
        }else if($category==70){
            $number_items_tiktokhince=intval($number_items_tiktokhince)+$number_of_items;
        }else if($category==71){
            $number_itemsmt_tiktokhince=intval($number_itemsmt_tiktokhince)+$number_of_items;
        }else if($category==44){
            $number_items_sociolla=intval($number_items_sociolla)+$number_of_items;
        }else if($category==45){
            $number_itemsmt_sociolla=intval($number_itemsmt_sociolla)+$number_of_items;
        }else if($category==46){
            $number_items_bbiavn=intval($number_items_bbiavn)+$number_of_items;
        }else if($category==47){
            $number_itemsmt_bbiavn=intval($number_itemsmt_bbiavn)+$number_of_items;
        }else if($category==48){
            $number_items_mixsoon=intval($number_items_mixsoon)+$number_of_items;
        }else if($category==49){
            $number_itemsmt_mixsoon=intval($number_itemsmt_mixsoon)+$number_of_items;
        }else if($category==50){
            $number_items_guardian=intval($number_items_guardian)+$number_of_items;
        }else if($category==51){
            $number_itemsmt_guardian=intval($number_itemsmt_guardian)+$number_of_items;
        }else if($category==52){
            $number_items_shopeemixsoon=intval($number_items_shopeemixsoon)+$number_of_items;
        }else if($category==53){
            $number_itemsmt_shopeemixsoon=intval($number_itemsmt_shopeemixsoon)+$number_of_items;
        }else if($category==54){
            $number_items_lazadamixsoon=intval($number_items_lazadamixsoon)+$number_of_items;
        }else if($category==55){
            $number_itemsmt_lazadamixsoon=intval($number_itemsmt_lazadamixsoon)+$number_of_items;
        }else if($category==58){
            $number_items_tiktoksky007=intval($number_items_tiktoksky007)+$number_of_items;
        }else if($category==59){
            $number_itemsmt_tiktoksky007=intval($number_itemsmt_tiktoksky007)+$number_of_items;
        }
        else if($category==60){
            $number_items_tiktokmixsoon=intval($number_items_tiktokmixsoon)+$number_of_items;
        }else if($category==61){
            $number_itemsmt_tiktokmixsoon=intval($number_itemsmt_tiktokmixsoon)+$number_of_items;
        }
    }
    $number_order_total     =  intval($number_order_sky007)+intval($number_order_wholesaler)+intval($number_order_shopeebbia)+intval($number_order_shopeehince)+intval($number_order_hince)+intval($number_order_eglipswholesaler)+intval($number_order_sociolla)+intval($number_order_lazadabbia)+intval($number_order_lazadahince)+intval($number_order_watson)+intval($number_order_tikibbia)+intval($number_order_tiktokhince)+intval($number_order_bbiavn)+intval($number_order_mixsoon)+intval($number_order_guardian)+intval($number_order_shopeemixsoon)+intval($number_order_lazadamixsoon)+intval($number_order_tiktoksky007)+intval($number_order_tiktokmixsoon);
    $number_cancel_total    =  intval($number_cancel_sky007)+intval($number_cancel_wholesaler)+intval($number_cancel_shopeebbia)+intval($number_cancel_shopeehince)+intval($number_cancel_hince)+intval($number_cancel_eglipswholesaler)+intval($number_cancel_sociolla)+intval($number_cancel_lazadabbia)+intval($number_cancel_lazadahince)+intval($number_cancel_watson)+intval($number_cancel_tikibbia)+intval($number_cancel_tiktokhince)+intval($number_cancel_bbiavn)+intval($number_cancel_mixsoon)+intval($number_cancel_guardian)+intval($number_cancel_shopeemixsoon)+intval($number_cancel_lazadamixsoon)+intval($number_cancel_tiktoksky007)+intval($number_cancel_tiktokmixsoon);
    $number_items_total     =  intval($number_items_sky007)+intval($number_items_wholesaler)+intval($number_items_shopeebbia)+intval($number_items_shopeehince)+intval($number_items_hince)+intval($number_items_eglipswholesaler)+intval($number_items_sociolla)+intval($number_items_lazadabbia)+intval($number_items_lazadahince)+intval($number_items_watson)+intval($number_items_tikibbia)+intval($number_items_tiktokhince)+intval($number_items_bbiavn)+intval($number_items_mixsoon)+intval($number_items_guardian)+intval($number_items_shopeemixsoon)+intval($number_items_lazadamixsoon)+intval($number_items_tiktoksky007)+intval($number_items_tiktokmixsoon);
    $number_itemsmt_total   =  intval($number_itemsmt_sky007)+intval($number_itemsmt_shopeebbia)+intval($number_itemsmt_shopeehince)+intval($number_itemsmt_hince)+intval($number_itemsmt_sociolla)+intval($number_itemsmt_lazadabbia)+intval($number_itemsmt_lazadahince)+intval($number_itemsmt_watson)+intval($number_itemsmt_tikibbia)+intval($number_itemsmt_tiktokhince)+intval($number_itemsmt_bbiavn)+intval($number_itemsmt_mixsoon)+intval($number_itemsmt_guardian)+intval($number_itemsmt_shopeemixsoon)+intval($number_itemsmt_lazadamixsoon)+intval($number_itemsmt_tiktoksky007)+intval($number_itemsmt_tiktokmixsoon);
    
    
    $arr_data=array("total_item"=>$number_items_total,"total_item_mt"=>$number_itemsmt_total,"total_order"=>$number_order_total,"total_cancell"=>$number_cancel_total,
                    "sky007_item"=>$number_items_sky007,"sky007_item_mt"=>$number_itemsmt_sky007,"sky007_order"=>$number_order_sky007,"sky007_cancell"=>$number_cancel_sky007,
                    "wholesaler_item"=>$number_items_wholesaler,"wholesaler_order"=>$number_order_wholesaler,"wholesaler_cancell"=>$number_cancel_wholesaler,
                    "shopee_item"=>$number_items_shopeebbia,"shopee_item_mt"=>$number_itemsmt_shopeebbia,"shopee_order"=>$number_order_shopeebbia,"shopee_cancell"=>$number_cancel_shopeebbia,
                    "shopee_hince_item"=>$number_items_shopeehince,"shopee_hince_item_mt"=>$number_itemsmt_shopeehince,"shopee_hince_order"=>$number_order_shopeehince,"shopee_hince_cancell"=>$number_cancel_shopeehince,
                    "hince_item"=>$number_items_hince,"hince_item_mt"=>$number_itemsmt_hince,"hince_order"=>$number_order_hince,"hince_cancell"=>$number_cancel_hince,                    
                    "wholesaler_eglips_item"=>$number_items_eglipswholesaler,"wholesaler_eglips_order"=>$number_order_eglipswholesaler,"wholesaler_eglips_cancell"=>$number_cancel_eglipswholesaler,                    
                    "sociolla_item"=>$number_items_sociolla,"sociolla_item_mt"=>$number_itemsmt_sociolla,"sociolla_order"=>$number_order_sociolla,"sociolla_cancell"=>$number_cancel_sociolla,                    
                    "lazada_item"=>$number_items_lazadabbia,"lazada_item_mt"=>$number_itemsmt_lazadabbia,"lazada_order"=>$number_order_lazadabbia,"lazada_cancell"=>$number_cancel_lazadabbia,                    
                    "lazada_hince_item"=>$number_items_lazadahince,"lazada_hince_item_mt"=>$number_itemsmt_lazadahince,"lazada_hince_order"=>$number_order_lazadahince,"lazada_hince_cancell"=>$number_cancel_lazadahince,                    
                    "watsons_item"=>$number_items_watson,"watsons_item_mt"=>$number_itemsmt_watson,"watsons_order"=>$number_order_watson,"watsons_cancell"=>$number_cancel_watson,                                        
                    "tiki_item"=>$number_items_tikibbia,"tiki_item_mt"=>$number_itemsmt_tikibbia,"tiki_order"=>$number_order_tikibbia,"tiki_cancell"=>$number_cancel_tikibbia,                    
                    "tiktok_hince_item"=>$number_items_tiktokhince,"tiktok_hince_item_mt"=>$number_itemsmt_tiktokhince,"tiktok_hince_order"=>$number_order_tiktokhince,"tiktok_hince_cancell"=>$number_cancel_tiktokhince,
                    "bbiavn_item"=>$number_items_bbiavn,"bbiavn_item_mt"=>$number_itemsmt_bbiavn,"bbiavn_order"=>$number_order_bbiavn,"bbiavn_cancell"=>$number_cancel_bbiavn,
                    "mixsoon_item"=>$number_items_mixsoon,"mixsoon_item_mt"=>$number_itemsmt_mixsoon,"mixsoon_order"=>$number_order_mixsoon,"mixsoon_cancell"=>$number_cancel_mixsoon,
                    "guardian_item"=>$number_items_guardian,"guardian_item_mt"=>$number_itemsmt_guardian,"guardian_order"=>$number_order_guardian,"guardian_cancell"=>$number_cancel_guardian,
                    "shopeemixsoon_item"=>$number_items_shopeemixsoon,"shopeemixsoon_item_mt"=>$number_itemsmt_shopeemixsoon,"shopeemixsoon_order"=>$number_order_shopeemixsoon,"shopeemixsoon_cancell"=>$number_cancel_shopeemixsoon,
                    "lazadamixsoon_item"=>$number_items_lazadamixsoon,"lazadamixsoon_item_mt"=>$number_itemsmt_lazadamixsoon,"lazadamixsoon_order"=>$number_order_lazadamixsoon,"lazadamixsoon_cancell"=>$number_cancel_lazadamixsoon,
                    "tiktoksky007_item"=>$number_items_tiktoksky007,"tiktoksky007_item_mt"=>$number_itemsmt_tiktoksky007,"tiktoksky007_order"=>$number_order_tiktoksky007,"tiktoksky007_cancell"=>$number_cancel_tiktoksky007,
                    "tiktokmixsoon_item"=>$number_items_tiktokmixsoon,"tiktokmixsoon_item_mt"=>$number_itemsmt_tiktokmixsoon,"tiktokmixsoon_order"=>$number_order_tiktokmixsoon,"tiktokmixsoon_cancell"=>$number_cancel_tiktokmixsoon
                    );            
    echo  json_encode($arr_data);
}  
function ct_chart_report_order_total_monthly(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_order_total_monthly($obj);
}      
        //==================== End Chart Order =========================
        //==================== Chart Membership Order ==================
function ct_chart_report_membership_order(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_membership_order($obj);
}  
function ct_chart_report_membership_total_order(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_membership_total_order($obj);
}               
function ct_chart_report_monthly_membership_order(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_chart_report_monthly_membership_order($obj);
}
        //==================== End Chart Memvership Order ==============
//============= End Chart Report ====================================================================================
//============= Data Report =========================================================================================
        //==================== Shippung ==============================
function ct_data_report_shipping(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_shipping($obj);
   
}        
        //==================== End Shippung ==========================
        //==================== Direct order ==============================
function ct_data_report_direct_order(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_direct_order($obj);
}        
        //==================== End direct order ==========================
          //==================== order ==============================
function ct_data_report_order(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_order($obj);
}        
        //==================== End order ==========================
          //==================== order vnpay ==============================
function ct_data_report_order_vnpay(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_order_vnpay($obj);
}        
        //==================== End order vnpay ==========================
         //==================== order ==============================
function ct_data_report_order_marketing(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_order_marketing($obj);
}        
        //==================== End order ==========================
        
        //==================== Data report Location ==============================
function ct_data_report_location(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_location($obj);
}        
        //==================== End Data report Location ==========================
        //==================== Data report Location ==============================
function ct_data_report_location_compare(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_location_compare($obj);
}        
        //==================== End Data report Location ==========================        
        //====================  Shop Items =============================
function ct_data_report_shop_items(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_shop_items_new($obj);
}        
        //====================  End Shop Items =========================
                //====================  Items =============================
function ct_data_report_items(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_items($obj);
}        
        //====================  End Items =========================
                        //====================  report data heatmap =============================
function ct_data_report_heatmap(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_heatmap($obj);
}        
        //====================  End Report data heatmap =========================
        
        //====================  Data report Preparing Order =============================
function ct_data_report_preparing_order(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_preparing_order($obj);
}        
        //====================  End Data report Preparing Order =========================
        //====================  Tax =============================
function ct_data_report_tax(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_tax($obj);
}        
        //====================  End Tax =========================
        
        //====================  Cancelled =========================
function ct_data_report_order_cancelled(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_order_cancelled($obj);
}        
        //====================  End Items =========================
        //====================  Order Membership ==================
function ct_data_report_order_membership(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_order_membership($obj);
}
        //================== End Order Membership =================
       //==================== report Coupon ==================
function ct_data_report_coupon_list(){   
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_coupon_list();
}
function ct_data_report_coupon_detail(){
    $coupon_id=$_POST["coupon_id"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_coupon_detail($coupon_id);
}
        //================== End report Coupon =================
//============= End Data Report =====================================================================================
//============= Customer Management =================================================================================
        //====================  Customer ==============================
function ct_customer_management_customer(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_customer_management_customer($obj);
}
function ct_customer_management_customer_detail(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_customer_management_customer_detail($obj);
}  
        //====================  End Customer ==========================
        //====================  History Order =========================
function ct_customer_management_history_order(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_customer_management_history_order($obj);
}
function ct_customer_management_history_order_detail(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_customer_management_history_order_detail($obj);
}        
        //====================  End History Order =====================
//============ End Customer Management ==============================================================================
//============ Order Management =====================================================================================
        //====================  Update Order ===========================
function ct_order_management_update_order(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_order($obj);
}
function ct_order_management_update_order_cancelled(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_order_cancelled($obj);
}
function ct_order_management_update_order_delete(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_order_delete($obj);
}
function ct_order_management_update_order_list_product(){  
    $shoptype=$_POST['shoptype'];
    $wh=$_POST['warehouse'];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_list_product($shoptype,$wh);
}
function ct_order_management_update_order_infor_order(){  
    $order_id=$_POST["order_id"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_infor_order($order_id);    
}
 
function ct_order_management_update_order_update_order(){  
    $data=$_POST["data"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_update_order($data);
}
function ct_order_management_update_order_infor_order_delete(){  
    $order_id=$_POST["order_id"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_order_infor_order_delete($order_id);
}
function ct_order_management_update_order_insert_delivery(){      
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_order_insert_delivery();
}
function ct_order_management_update_order_by_excel(){   
    $data=$_POST["data"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_order_by_excel($data);
}
function ct_order_management_update_order_by_excel_shipping_fee(){   
    $data=$_POST["data"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_order_by_excel_shipping_fee($data);
}

function ct_order_management_update_order_by_excel_complete(){   
    $data=$_POST["data"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_order_by_excel_complete($data);
}
function ct_order_management_update_order_cancel_by_excel_check(){
    $data=$_POST["data"];   
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_order_cancel_by_excel_check($data);
}
function ct_order_management_update_order_cancel_by_excel(){
    $data=$_POST["data"];
    $mg_name=$_POST['mg_name'];
    $obj_sv_sky007       = new sever_skysys();   
    $obj_sv_sky007->sv_order_management_update_order_cancel_by_excel($data,$mg_name);
    
}
function ct_order_management_shipping_get_order(){
    $obj=$_POST["obj"];   
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_shipping_get_order($obj);
}
 
        //====================  End Update Order =======================
        
        //====================  Cancel before sent =======================
        
function ct_order_management_update_cancel_bs(){
    $data=$_POST['list_order'];
    $user_action=$_POST['user_action'];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_order_management_update_cancel_bs($data,$user_action);
}
     //====================  END Cancel before sent =======================
//============ End Order Management ==================================================================================
//============ Stock Management ======================================================================================
        //==================== Update Stock =======================
function ct_stock_management_update_stock(){      
    $warehouse=$_POST["warehouse"];  
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_update_stock($warehouse);
}
function ct_stock_management_update_stock_save_stock(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_update_stock_save_stock($obj);
}


function ct_stock_management_update_stock_borrow_stock_hn(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_update_stock_borrow_stock_hn($obj);
}
function ct_stock_management_update_stock_save_stock_incoming(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_update_stock_save_stock_incoming($obj);
}
function ct_stock_management_update_stock_save_stock_hn(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_update_stock_save_stock_hn($obj);
}
function ct_stock_management_update_stock_save_stock_incoming_hn(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_update_stock_save_stock_incoming_hn($obj);
}
function ct_stock_management_update_stock_get_history_comming(){
    $item_id=$_POST["item_id"];    
    $warehouse=$_POST["warehouse"]; 
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_update_stock_get_history_comming($item_id,$warehouse);
}
function ct_stock_management_update_stock_item_status(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_update_stock_item_status($obj);
}
function ct_stock_management_update_stock_item_status_bbiavn_sky007(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_update_stock_item_status_bbiavn_sky007($obj);
}
function ct_stock_management_check_stock(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_check_stock($obj);
}
function ct_borrow_stock_get_list_product(){
    $stock=$_POST["stock"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_borrow_stock_get_list_product($stock);
}
function ct_borrow_stock_give_and_return_stock(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_borrow_stock_give_and_return_stock($obj);
}
function ct_borrow_stock_get_history_stock_borrow(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_borrow_stock_get_history_stock_borrow($obj);
}
function ct_borrow_stock_setting_active(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_borrow_stock_setting_active($obj);
}
function ct_borrow_stock_delete_moving(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_borrow_stock_delete_moving($obj);
}
function ct_borrow_stock_update_list_borrow(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_borrow_stock_update_list_borrow($obj);
}
function ct_report_shipping_by_excel(){
    $obj=$_POST["data"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_report_shipping_by_excel($obj);
}
function ct_stock_management_get_list_product_watsons(){  
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_get_list_product_watsons($obj);
}
function ct_data_report_update_status_exp_watsons(){  
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_data_report_update_status_exp_watsons($obj);
}

        //====================End Update Stock ===================
        //==================== Share Stock ======================= 
function ct_stock_management_share_stock_update_new_item(){
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_share_stock_update_new_item();
}
function ct_stock_management_share_stock_by_excel(){
    $warehouse=$_POST["warehouse"];
    $data=$_POST["data"];
    $name_management=$_POST["name_management"]; 
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_share_stock_by_excel($data,$name_management,$warehouse);
}        
         //====================End Share Stock =================== 
        //==================== Hisroty Stock =======================
function ct_stock_management_get_list_product(){     
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_get_list_product();
} 
function ct_stock_management_list_daily_stock_item(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_list_daily_stock_item($obj);
} 
function ct_stock_management_list_incoming_stock(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_list_incoming_stock($obj);
}  
function ct_stock_management_view_product(){     
    $obj_sv_sky007       = new sever_skysys();
    $data=$_POST["data"];
    $obj_sv_sky007->sv_stock_management_view_product($data);
}      
        //================ End Hisroty Stock =======================
        
         //==================== Share Stock =======================
function ct_stock_management_share_stock(){   
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_share_stock();
} 
function ct_stock_management_share_stock_save_stock(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_share_stock_save_stock($obj);
}       
        //================ End Share Stock =======================
        //================ stock management shop mall ============
function ct_stock_management_get_stock_list_product_mall_and_insert_newitems(){      
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_get_stock_list_product_mall_and_insert_newitems();
}  
function ct_stock_management_get_list_product_mall(){      
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_get_list_product_mall();
}  
function ct_stock_management_auto_divide_stock_shopee(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_auto_divide_stock_shopee($obj);
} 
function ct_stock_management_update_stock_shopee(){
    $data_insert=$_POST["data_insert"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_stock_management_update_stock_shopee($data_insert);
}     
        //================ END stock management shop mall ========


//============ End Stock Management ===================================================================================

//============ Schedule calendar ======================================================================================
function ct_schedule_calendar(){
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_schedule_calendar();
}
function ct_schedule_calendar_update(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_schedule_calendar_update($obj);
}
function ct_schedule_calendar_update_hand(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_schedule_calendar_update_hand($obj);
}
function ct_schedule_calendar_insert(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_schedule_calendar_insert($obj);
}
function ct_schedule_calendar_delete(){
    $obj=$_POST["obj"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_schedule_calendar_delete($obj);
}

//============End  Schedule calendar ==================================================================================
//============ Setting ================================================================================================
        //==================== Marketing Event =======================
function ct_setting_get_list_combo(){
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_get_list_combo();
    
} 
function ct_setting_get_list_item(){
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_get_list_item();
} 
function ct_setting_get_list_detail_combo(){
    $product_id=$_POST["product_id"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_get_list_detail_combo($product_id); 
} 
function ct_setting_event_update_detail_combo(){
    $obj=$_POST["obj"];    
    $combo_id=$_POST["combo_id"]; 
    $text_detail=$_POST["text_detail"];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_event_update_detail_combo($combo_id,$obj,$text_detail); 
}

function ct_setting_event_marketing_insert_event(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_event_marketing_insert_event($obj); 
} 
function ct_setting_event_marketing_get_list_item_event(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_event_marketing_get_list_item_event($obj); 
}
function ct_setting_marketing_get_detail_combo(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_marketing_get_detail_combo($obj); 
}
function ct_setting_event_marketing_delete_item_event(){
    $id=$_POST["id"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_event_marketing_delete_item_event($id); 
}
function ct_setting_event_marketing_update_detail_item_event(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_event_marketing_update_detail_item_event($obj); 
}

      
        //==================== End Marketing Event ===================
  
        //==================== Setting flash sale ====================
function ct_SETTING_get_product_sky007vn(){   
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_SETTING_get_product_sky007vn(); 
}
function ct_setting_event_sale_of_insert_flash_sale(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_event_sale_of_insert_flash_sale($obj); 
}
function ct_setting_flash_sale_excel_insert(){
    $obj=$_POST["obj"];  
    $shop_type=$_POST["shop_type"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_flash_sale_excel_insert($obj,$shop_type); 
}

  
        //==================== END flash sale ====================
        
        //==================== Sale Of Event =========================
function ct_setting_event_sale_of_insert_event(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_event_sale_of_insert_event($obj); 
}
function ct_setting_event_get_list_product(){       
    $obj_sv_sky007       = new sever_skysys();
    $shop_type=$_POST["shoptype"];
    $obj_sv_sky007->sv_setting_event_get_list_product($shop_type); 
}
 function ct_setting_event_sale_of_delete_cache(){
    $memcache = new Memcache;
    $memcache->connect('tcp://localhost:11211', 11211) or die ("Could not connect");
 //   $datacache=memcache_get($memcache, 'data');  
   $memcache->delete('data');  
}         
function ct_setting_get_list_product(){   
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_get_list_product(); 
}
function ct_setting_event_setting_excel_insert(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_event_setting_excel_insert($obj); 
}       
        //==================== End Sale Of Event =====================
        //==================== Membership ============================        
function ct_setting_conver_membership(){   
    $obj=$_POST["membership"];  
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_conver_membership($obj);
}
function ct_setting_update_membership(){   
    $data=$_POST["data"];  
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_update_membership($data);
}
function ct_setting_get_account(){
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_get_account();
}
function ct_setting_account(){
    $obj=$_POST["obj"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_account($obj); 
}
function ct_setting_get_account_id(){
    $id_account=$_POST["id_account"];    
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->sv_setting_get_account_id($id_account);
}
function ct_upload_img(){
     $obj_sv_sky007       = new sever_skysys();
     $obj_sv_sky007->upload_img();
}
function ct_setting_update_product(){
    $obj=$_POST['obj'];
    $obj_sv_sky007       = new sever_skysys();
    $obj_sv_sky007->setting_update_product($obj); 
}
        //==================== END Membership =========================
        //==================== SETTING EVENT MEMBERSHIP ===============================

//============ End Setting ============================================================================================
?>
