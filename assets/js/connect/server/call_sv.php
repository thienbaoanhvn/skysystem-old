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
    $delivery_company=$_POST['delivery_company'];
   
    $s_date=$_POST['s_date'];
    $e_date=$_POST['e_date'];    
  
  
     if($delivery_company=="all"){
        Editor::inst( $db, '`aowp_posts` AS p' )
        ->field(
            Field::inst( 'pm_first_name.meta_value AS `firstname` ' ),
            Field::inst( 'pm_last_name.meta_value AS `lastname`' ),
            Field::inst( 'od.order_id AS `order_id`' ),
            Field::inst( 'pm_phone.meta_value AS `phone`' ),
            Field::inst( 'pm_address.meta_value AS `address`' ),
            Field::inst( 'od.d_company AS `delivery_company`' ),
            Field::inst( 'od.d_shipping_id AS `delivery_id`' ),
            Field::inst( 'od.d_pay_status  AS `delivery_status`' ),
            Field::inst( 'p.post_date AS `order_date`' ),
            Field::inst( 'od.d_dateofarrive AS `arrive_date`' )
                ->validator( 'Validate::dateFormat', array(
                    "format"  => Format::DATE_ISO_8601,
                    "message" => "Please enter a date in the format yyyy-mm-dd"
                ) ),
            Field::inst( 'od.d_shipping_fee AS `delivery_fee`' )->validator( 'Validate::numeric' ),
            Field::inst( 'p.post_status AS `status`' ) ,    
            Field::inst( 'od.d_old_order_id  AS `old_order_id`' ),    
            Field::inst( 'pm_total_order.meta_value AS `total_order`' )  
           
        )
        ->leftjoin('`aowp_postmeta` AS pm_first_name','pm_first_name.post_id','=','p.id')   
        ->leftjoin('`aowp_postmeta` AS pm_last_name','pm_last_name.post_id','=','p.id')   
        ->leftjoin('`aowp_postmeta` AS pm_phone','pm_phone.post_id','=','p.id')
        ->leftjoin('`aowp_postmeta` AS pm_address','pm_address.post_id','=','p.id')
        ->leftjoin('`aowp_postmeta` AS pm_total_order','pm_total_order.post_id','=','p.id')
        ->leftjoin('`tb_ord_delivery` AS od','od.order_id','=','p.id')
        ->where('p.post_type','shop_order')
        //->where('p.post_status','wc-cancelled','!=')
        ->where('p.post_status','trash','!=')
        ->where('pm_first_name.meta_key','_billing_first_name')
        ->where('pm_last_name.meta_key','_billing_last_name')
        ->where('pm_address.meta_key','_billing_address_1')
        ->where('pm_phone.meta_key','_billing_phone')
        ->where('pm_total_order.meta_key','_order_total')
        ->where('p.post_date',"$s_date 00:00:00",'>')
        ->where('p.post_date',"$e_date 59:59:00",'<')        
         ->process($_POST)
        ->json();die();
    }else{
       Editor::inst( $db, '`aowp_posts` AS p' )
        ->field(
            Field::inst( 'pm_first_name.meta_value AS `firstname` ' ),
            Field::inst( 'pm_last_name.meta_value AS `lastname`' ),
            Field::inst( 'od.order_id AS `order_id`' ),
            Field::inst( 'pm_phone.meta_value AS `phone`' ),
            Field::inst( 'pm_address.meta_value AS `address`' ),
            Field::inst( 'od.d_company AS `delivery_company`' ),
            Field::inst( 'od.d_shipping_id AS `delivery_id`' ),
            Field::inst( 'od.d_pay_status  AS `delivery_status`' ),
            Field::inst( 'p.post_date AS `order_date`' ),
            Field::inst( 'od.d_dateofarrive AS `arrive_date`' )
                ->validator( 'Validate::dateFormat', array(
                    "format"  => Format::DATE_ISO_8601,
                    "message" => "Please enter a date in the format yyyy-mm-dd"
                ) ),
            Field::inst( 'od.d_shipping_fee AS `delivery_fee`' )->validator( 'Validate::numeric' ),
            Field::inst( 'p.post_status AS `status`' )  ,
            Field::inst( 'od.d_old_order_id  AS `old_order_id`' ),
            Field::inst( 'pm_total_order.meta_value AS `total_order`' )         
           
        )
        ->leftjoin('`aowp_postmeta` AS pm_first_name','pm_first_name.post_id','=','p.id')   
        ->leftjoin('`aowp_postmeta` AS pm_last_name','pm_last_name.post_id','=','p.id')   
        ->leftjoin('`aowp_postmeta` AS pm_phone','pm_phone.post_id','=','p.id')
        ->leftjoin('`aowp_postmeta` AS pm_address','pm_address.post_id','=','p.id')
        ->leftjoin('`aowp_postmeta` AS pm_total_order','pm_total_order.post_id','=','p.id')
        ->leftjoin('`tb_ord_delivery` AS od','od.order_id','=','p.id')
        ->where('p.post_type','shop_order')
        //->where('p.post_status','wc-cancelled','!=')
        ->where('p.post_status','trash','!=')
        ->where('pm_first_name.meta_key','_billing_first_name')
        ->where('pm_last_name.meta_key','_billing_last_name')
        ->where('pm_address.meta_key','_billing_address_1')
        ->where('pm_phone.meta_key','_billing_phone')
        ->where('pm_total_order.meta_key','_order_total')
        ->where('p.post_date',"$s_date 00:00:00",'>')
        ->where('p.post_date',"$e_date 59:59:00",'<')        
        ->where('od.d_company',"$delivery_company")
        ->process($_POST)
        ->json();die(); 
    }
      
   
    
    /*

SELECT CONCAT_WS(' ',pm_first_name.meta_value,pm_last_name.meta_value) AS `name`,
  od.order_id,	
  pm_phone.meta_value AS `phone`,
  pm_address.meta_value AS `address`, 
  od.d_company AS `delivery_company`,
  od.d_shipping_id AS `delivery_id`,
  p.post_date AS `order_date`,
  od.`d_dateofarrive` AS `arrive_date`,
  od.d_shipping_fee AS `delivery_fee`,
  p.post_status 
  FROM `aowp_posts` p  
	LEFT JOIN `aowp_postmeta` pm_first_name ON pm_first_name.post_id=p.id
	LEFT JOIN `aowp_postmeta` pm_last_name ON pm_last_name.post_id=p.id
	LEFT JOIN `aowp_postmeta` pm_phone ON pm_phone.post_id=p.id
	LEFT JOIN `aowp_postmeta` pm_address ON pm_address.post_id=p.id	
	LEFT JOIN  `tb_ord_delivery` od	ON od.order_id=p.id
WHERE  p.post_type='shop_order' AND p.post_status !='wc-cancelled' AND p.post_status !='trash'   
	AND pm_first_name.meta_key='_billing_first_name' AND pm_last_name.meta_key='_billing_last_name'
	AND pm_address.meta_key='_billing_address_1'
	AND pm_phone.meta_key='_billing_phone'
*/
?>
