<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate user object
include_once '../objects/user.php';
include_once '../shared/utilities.php';
 
$database = new Database();
$db = $database->getConnection();
 
$user = new User($db);

// utilities
$utilities = new Utilities(); 
 
// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if(
	$utilities->notempty($data->id) 
){
 
    // set user property values
	$user->id = $data->id;
    
    // delete the user
    if($user->delete()){
 
        // set response code - 200 deleted
        http_response_code(200);
 
        // tell the user
        echo json_encode(array("message" => "User was deleted successfully.", "success" => true));
    }
 
    // if unable to delete the user, tell the user
    else{
 
        // set response code - 503 service unavailable
        http_response_code(503);
 
        // tell the user
        echo json_encode(array("message" => "Unable to delete the user.", "success" => false));
    }
}
 
// tell the user data is incomplete
else{
 
    // set response code - 400 bad request
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to delete the user. Data is incomplete.", "success" => false));
}
?>