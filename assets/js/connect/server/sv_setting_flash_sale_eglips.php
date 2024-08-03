<?php 

   include( "../php/DataTables_eglips.php" );
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
      Editor::inst( $db, 'setting_envent_flash_sale' )
        ->field(
            Field::inst( 'item_id' ),
            Field::inst( 'sku' ),
            Field::inst( 'item_name' ),                      
            Field::inst( 'sale_price' ),
            Field::inst( 'original_price' ),
            Field::inst( 'start_time' ),       
            Field::inst( 'end_time' ),
            Field::inst( 'status' )  
        )      
        ->process($_POST)
        ->json();
        die();
   
?>