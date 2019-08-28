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
    $utilities->notempty($data->username) &&
    $utilities->notempty($data->password) &&
    $utilities->notempty($data->firstname) &&
    $utilities->notempty($data->roleid) &&
    $utilities->notempty($data->rolename) &&
    $utilities->notempty($data->active)
){
 
    // set user property values
    $user->username = $data->username;
    $user->password = $data->password;
    $user->firstname = $data->firstname;
    $user->lastname = $data->lastname;
    $user->email = $data->email;
    $user->orgemail = $data->orgemail;
    $user->phone = $data->phone;
    $user->roleid = $data->roleid;
    $user->rolename = $data->rolename;
    $user->active = $data->active;
	$user->created = date('Y-m-d H:i:s');
 
    // create the user
    if($user->create()){
 
        // set response code - 201 created
        http_response_code(201);
 
        // tell the user
        echo json_encode(array("message" => "User was created successfully.", "success" => true));
    }
 
    // if unable to create the user, tell the user
    else{
 
        // set response code - 503 service unavailable
        http_response_code(503);
 
        // tell the user
        echo json_encode(array("message" => "Unable to create the user.", "success" => false));
    }
}
 
// tell the user data is incomplete
else{
 
    // set response code - 400 bad request
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create user. Data is incomplete.", "success" => false));
}
?>