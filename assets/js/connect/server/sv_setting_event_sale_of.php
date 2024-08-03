<?php 
    include( "../php/DataTables_sky007.php" );
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
  
 
       // echo("$s_date"); die();
      Editor::inst( $db, 'tb_setting_time_sale_product' )
        ->field(
            Field::inst( 'product_id' ),
            Field::inst( 'product_name' ),
            Field::inst( 'sku' ),
            Field::inst( 'sale_price' ),
            Field::inst( 'regular_price' ),
            Field::inst( 'start_time' ),       
            Field::inst( 'end_time' ) ,  
            Field::inst( 'flag' )        
        )      
        ->process($_POST)
        ->json();
        die();
   
?>
