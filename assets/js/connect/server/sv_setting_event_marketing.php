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
  
 
       // echo("$s_date"); die();
      Editor::inst( $db, 'setting_event_marketing' )
        ->field(
            Field::inst( 'item_id' ),
            Field::inst( 'product_name' ),
            Field::inst( 'quantity_event' )->validator( 'Validate::numeric', array('message' =>'Format Number and not null'))->validator( 'Validate::notEmpty' ),
            Field::inst( 'total_price' )->validator( 'Validate::numeric', array('message' =>'Format Number and not null'))->validator( 'Validate::notEmpty' ),
            Field::inst( 'start_time' ),       
            Field::inst( 'end_time' ) ,  
            Field::inst( 'status' )        
        )      
        ->process($_POST)
        ->json();
        die();
   
?>
