<?php
    $str_date=strtotime("now");    
    $dir = "../../../img/products/";
    $name=$_FILES["file"]["name"];
    $name = str_replace("#", '', $name);
    $pieces = explode(".", $name);
    $name_f=$pieces[0].$str_date.'.'.$pieces[1];
    move_uploaded_file($_FILES["file"]["tmp_name"], $dir.$name_f) ; 
    echo   $name_f;
?>