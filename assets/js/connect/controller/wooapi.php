<?php
require_once 'common.php';
require_once 'woocommerce-api.php';
 
 $url         = explode('.', $_GET['controller']);
 $task        = $url[1];
 $varFunction = "$task";
 $varFunction();
 
?>
<?php
    
   
    function get_product_category()
    {
     
       $options = array(
        	'debug'           => true,
        	'return_as_array' => false,
        	'validate_url'    => false,
        	'timeout'         => 100,
        	'ssl_verify'      => false, 
            );
       $client = new WC_API_Client('61.100.180.32', 'ck_a6c4602276a7e6f166c81d4625b7a0e0d0b7110f', 'cs_4fe0492c0a06d88fbfae998facffee89491f6254', $options );
              //return $client;
       echo json_encode($client->products->get(null, array('filter[limit]' => -1))) ;// $client->products->get(null, array('filter[limit]' => -1))
    }
    
    function create_order()
    {
        try{
             $options = array(
        	'debug'           => true,
        	'return_as_array' => false,
        	'validate_url'    => false,
        	'timeout'         => 100,
        	'ssl_verify'      => false, 
            );
           $obj=$_POST['ob_data'];//http://www.sky007.vn
          // $rand_me=rand(1,20);
          // echo json_encode($obj);
          $client = new WC_API_Client( 'https://www.sky007.vn', 'ck_a6c4602276a7e6f166c81d4625b7a0e0d0b7110f', 'cs_4fe0492c0a06d88fbfae998facffee89491f6254', $options );
          echo json_encode($client->orders->create($obj));  
          //$respd= json_encode($client->orders->create($obj)); 
         // $strd= $respd['order']['id']."-".$rand_me;
         // echo $strd;
        }catch ( WC_API_Client_Exception $e ) {

        	echo $e->getMessage() . PHP_EOL;
        	echo $e->getCode() . PHP_EOL;
        
        	if ( $e instanceof WC_API_Client_HTTP_Exception ) {
        
        		echo $e->get_request() ;
        		echo $e->get_response() ;
	        }
        }
         
    }
    
    function delete_order()
    {
          $options = array(
        	'debug'           => true,
        	'return_as_array' => false,
        	'validate_url'    => false,
        	'timeout'         => 100,
        	'ssl_verify'      => false, 
            );
           $ordid=$_POST['ord_id'];
          // echo json_encode($obj);
           $client = new WC_API_Client( 'https://www.sky007.vn', 'ck_a6c4602276a7e6f166c81d4625b7a0e0d0b7110f', 'cs_4fe0492c0a06d88fbfae998facffee89491f6254', $options );
          echo json_encode($client->orders->delete($ordid,$force = true));   
    }
    
    function get_customer()
    {
          $options = array(
        	'debug'           => true,
        	'return_as_array' => false,
        	'validate_url'    => false,
        	'timeout'         => 100,
        	'ssl_verify'      => false, 
            );
           $customer_id=$_POST['cust_id'];
         //  echo json_encode($obj);
        $client = new WC_API_Client( 'https://www.sky007.vn', 'ck_a6c4602276a7e6f166c81d4625b7a0e0d0b7110f', 'cs_4fe0492c0a06d88fbfae998facffee89491f6254', $options );
        $client->customers->get( $customer_id ) ;   
    }
    
    function get_order()
    {
          $options = array(
        	'debug'           => true,
        	'return_as_array' => false,
        	'validate_url'    => false,
        	'timeout'         => 100,
        	'ssl_verify'      => false, 
            );
           $order_id=$_POST['ord_id'];
         //  echo json_encode($obj);
         $client = new WC_API_Client( 'https://www.sky007.vn', 'ck_a6c4602276a7e6f166c81d4625b7a0e0d0b7110f', 'cs_4fe0492c0a06d88fbfae998facffee89491f6254', $options );
         echo json_encode($client->orders->get( $order_id )) ;   
    }
    
    function create_user()
    {
        try{
        $options = array(
        	'debug'           => true,
        	'return_as_array' => false,
        	'validate_url'    => false,
        	'timeout'         => 100,
        	'ssl_verify'      => false, 
            );
           $user_data=$_POST['data'];
         //  echo json_encode($obj);
         $client = new WC_API_Client( 'www.sky007.vn', 'ck_a6c4602276a7e6f166c81d4625b7a0e0d0b7110f', 'cs_4fe0492c0a06d88fbfae998facffee89491f6254', $options );
         $client->customers->post("",$user_data,"");
        // echo json_encode($client->customers->post("",$user_data,"")) ; 
          
         }catch ( WC_API_Client_Exception $e ) {

        	echo $e->getMessage() . PHP_EOL;
        	echo $e->getCode() . PHP_EOL;
        
        	if ( $e instanceof WC_API_Client_HTTP_Exception ) {
        
        		echo( $e->get_request() );
        		echo( $e->get_response() );
	        }
        }
   
    }
    
    function update_note()
    {
          $options = array(
        	'debug'           => true,
        	'return_as_array' => false,
        	'validate_url'    => false,
        	'timeout'         => 100,
        	'ssl_verify'      => false, 
            );
           $ordid=$_POST['ord_id'];
           $note=$_POST['note'];
          // echo json_encode($obj);
           $client = new WC_API_Client( 'www.sky007.vn', 'ck_a6c4602276a7e6f166c81d4625b7a0e0d0b7110f', 'cs_4fe0492c0a06d88fbfae998facffee89491f6254', $options );
          echo json_encode( $client->order_notes->create( $ordid, array( 'note' => $note ) ));   
    }
    function update_status_order(){
        
          try{
             $options = array(
        	'debug'           => true,
        	'return_as_array' => false,
        	'validate_url'    => false,
        	'timeout'         => 100,
        	'ssl_verify'      => false, 
            );
           $order_id=$_POST['order_id'];//http://www.sky007.vn
          // $rand_me=rand(1,20);
          // echo json_encode($obj);
          $client = new WC_API_Client( 'https://www.sky007.vn', 'ck_a6c4602276a7e6f166c81d4625b7a0e0d0b7110f', 'cs_4fe0492c0a06d88fbfae998facffee89491f6254', $options );
          echo json_encode($client->orders->update_status( $order_id, 'completed' ));  
          //$respd= json_encode($client->orders->create($obj)); 
         // $strd= $respd['order']['id']."-".$rand_me;
         // echo $strd;
        }catch ( WC_API_Client_Exception $e ) {

        	echo $e->getMessage() . PHP_EOL;
        	echo $e->getCode() . PHP_EOL;
        
        	if ( $e instanceof WC_API_Client_HTTP_Exception ) {
        
        		echo $e->get_request() ;
        		echo $e->get_response() ;
	        }
        }        
    }
    
//try {

//	$client = new WC_API_Client( 'http://www.sky007.vn', 'ck_ff18c38c0bcee94e434aef19f33bae6b041cc7a2', 'cs_94f8eb906cdb072f3bb5f6adfeed19377393b6bb', $options );

	// coupons
	// print_r( $client->coupons->get() );
	//print_r( $client->coupons->get( $coupon_id ) );
	//print_r( $client->coupons->get_by_code( 'coupon-code' ) );
	//print_r( $client->coupons->create( array( 'code' => 'test-coupon', 'type' => 'fixed_cart', 'amount' => 10 ) ) );
	//print_r( $client->coupons->update( $coupon_id, array( 'description' => 'new description' ) ) );
	//print_r( $client->coupons->delete( $coupon_id ) );
	//print_r( $client->coupons->get_count() );

	// custom
	//$client->custom->setup( 'webhooks', 'webhook' );
	//print_r( $client->custom->get( $params ) );

	// customers
	//print_r( $client->customers->get() );
	//print_r( $client->customers->get( $customer_id ) );
	//print_r( $client->customers->get_by_email( 'help@woothemes.com' ) );
	//print_r( $client->customers->create( array( 'email' => 'woothemes@mailinator.com' ) ) );
	//print_r( $client->customers->update( $customer_id, array( 'first_name' => 'John', 'last_name' => 'Galt' ) ) );
	//print_r( $client->customers->delete( $customer_id ) );
	//print_r( $client->customers->get_count( array( 'filter[limit]' => '-1' ) ) );
	//print_r( $client->customers->get_orders( $customer_id ) );
	//print_r( $client->customers->get_downloads( $customer_id ) );
	//$customer = $client->customers->get( $customer_id );
	//$customer->customer->last_name = 'New Last Name';
	//print_r( $client->customers->update( $customer_id, (array) $customer ) );

	// index
	//print_r( $client->index->get() );

	// orders
	//print_r( $client->orders->get() );
	//print_r( $client->orders->get( $order_id ) );
	//print_r( $client->orders->update_status( $order_id, 'pending' ) );

	// order notes
	//print_r( $client->order_notes->get( $order_id ) );
	//print_r( $client->order_notes->create( $order_id, array( 'note' => 'Some order note' ) ) );
	//print_r( $client->order_notes->update( $order_id, $note_id, array( 'note' => 'An updated order note' ) ) );
	//print_r( $client->order_notes->delete( $order_id, $note_id ) );

	// order refunds
	//print_r( $client->order_refunds->get( $order_id ) );
	//print_r( $client->order_refunds->get( $order_id, $refund_id ) );
	//print_r( $client->order_refunds->create( $order_id, array( 'amount' => 1.00, 'reason' => 'cancellation' ) ) );
	//print_r( $client->order_refunds->update( $order_id, $refund_id, array( 'reason' => 'who knows' ) ) );
	//print_r( $client->order_refunds->delete( $order_id, $refund_id ) );

	// products
	//print_r( $client->products->get() );
	//print_r( $client->products->get( $product_id ) );
	//print_r( $client->products->get( $variation_id ) );
	//print_r( $client->products->get_by_sku( 'a-product-sku' ) );
	//print_r( $client->products->create( array( 'title' => 'Test Product', 'type' => 'simple', 'regular_price' => '9.99', 'description' => 'test' ) ) );
	//print_r( $client->products->update( $product_id, array( 'title' => 'Yet another test product' ) ) );
	//print_r( $client->products->delete( $product_id, true ) );
	//print_r( $client->products->get_count() );
	//print_r( $client->products->get_count( array( 'type' => 'simple' ) ) );
	//print_r( $client->products->get_categories() );
	//print_r( $client->products->get_categories( $category_id ) );

	// reports
	//print_r( $client->reports->get() );
	//print_r( $client->reports->get_sales( array( 'filter[date_min]' => '2014-07-01' ) ) );
	//print_r( $client->reports->get_top_sellers( array( 'filter[date_min]' => '2014-07-01' ) ) );

	// webhooks
	//print_r( $client->webhooks->get() );
	//print_r( $client->webhooks->create( array( 'topic' => 'coupon.created', 'delivery_url' => 'http://requestb.in/' ) ) );
	//print_r( $client->webhooks->update( $webhook_id, array( 'secret' => 'some_secret' ) ) );
	//print_r( $client->webhooks->delete( $webhook_id ) );
	//print_r( $client->webhooks->get_count() );
	//print_r( $client->webhooks->get_deliveries( $webhook_id ) );
	//print_r( $client->webhooks->get_delivery( $webhook_id, $delivery_id );

	// trigger an error
	//print_r( $client->orders->get( 0 ) );

/*} catch ( WC_API_Client_Exception $e ) {

	echo $e->getMessage() . PHP_EOL;
	echo $e->getCode() . PHP_EOL;

	if ( $e instanceof WC_API_Client_HTTP_Exception ) {

		print_r( $e->get_request() );
		print_r( $e->get_response() );
	}
} */

?>