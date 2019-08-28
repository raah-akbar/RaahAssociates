<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate site object
include_once '../objects/site.php';
include_once '../shared/utilities.php';
 
$database = new Database();
$db = $database->getConnection();
 
$site = new Site($db);

// utilities
$utilities = new Utilities(); 
// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if(
    $utilities->notempty($data->name) &&
    $utilities->notempty($data->description) &&
    $utilities->notempty($data->startdate) &&
    $utilities->notempty($data->active)
){
 
    // set site property values
    $site->name = $data->name;
    $site->description = $data->description;
    $site->location = $data->location;
    $site->startdate = $data->startdate;
    $site->enddate = $data->enddate;
    $site->active = $data->active;
	$site->created = date('Y-m-d H:i:s');
 
    // create the site
    if($site->create()){
 
        // set response code - 201 created
        http_response_code(201);
 
        // tell the site
        echo json_encode(array("message" => "Site was created successfully.", "success" => true));
    }
 
    // if unable to create the site, tell the user
    else{
 
        // set response code - 503 service unavailable
        http_response_code(503);
 
        // tell the user
        echo json_encode(array("message" => "Unable to create the site.", "success" => false));
    }
}
 
// tell the user data is incomplete
else{
 
    // set response code - 400 bad request
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create the site. Data is incomplete.", "success" => false));
}
?>