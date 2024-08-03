<?php
define('ROOT_INDEX', true);

require_once 'common.php';

if(isset($_GET['controller']))
{
    $url=explode('.',$_GET['controller']);    
    require_once 'controller/' . $url[0] .'.php';    
    return;
}

?>