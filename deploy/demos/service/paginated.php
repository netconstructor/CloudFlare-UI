<?php
    
    define("MAX_REMOTE_VALUES", 1337); // TODO
    
    if(!isset($_REQUEST['error'])) {
    
        $offset = isset($_REQUEST['o']) ? $_REQUEST['o'] : 0;
        $max = isset($_REQUEST['m']) ? $_REQUEST['m'] : 10;
        $page = isset($_REQUEST['p']) ? $_REQUEST['p'] : floor($offset / $max);
        
        $results = array();
        
        for($i = $page * $max; $i < $page * $max + $max; $i++) {
            
            array_push($results, $i);
        }
        
        $response = array(
            'success' => 'The operation was successful.',
            'data' => array(
                'page' => $page,
                'results' => $results
            )
        );
    
    } else {
        
        $response = array(
            'error' => 'There was an error performing the operation!'
        );
    }
    
    header('Content-Type: application/json');
    
    echo(json_encode($response));
    
?>