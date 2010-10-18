<?php
    
    if(!isset($_REQUEST['error'])) {
        
        $max = isset($_REQUEST['m']) ? $_REQUEST['m'] : 10;
        
        $results = array();
        
        for($i = 0; $i < $max; $i++) {
            
            array_push($results, rand());
        }
        
        $response = array(
            'success' => 'The operation was successful',
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