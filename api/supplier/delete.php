<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate supplier object
include_once '../objects/supplier.php';
include_once '../shared/utilities.php';
 
$database = new Database();
$db = $database->getConnection();
 
$supplier = new Supplier($db);

// utilities
$utilities = new Utilities(); 
 
// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if(
	$utilities->notempty($data->id) 
){
 
    // set supplier property values
	$supplier->id = $data->id;
    
    // delete the supplier
    if($supplier->delete()){
 
        // set response code - 200 deleted
        http_response_code(200);
 
        // tell the user
        echo json_encode(array("message" => "Supplier was deleted successfully.", "success" => true));
    }
 
    // if unable to delete the supplier, tell the user
    else{
 
        // set response code - 503 service unavailable
        http_response_code(503);
 
        // tell the user
        echo json_encode(array("message" => "Unable to delete the supplier.", "success" => false));
    }
}
 
// tell the user data is incomplete
else{
 
    // set response code - 400 bad request
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to delete the supplier. Data is incomplete.", "success" => false));
}
?>