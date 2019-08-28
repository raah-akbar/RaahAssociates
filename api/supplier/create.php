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
    $utilities->notempty($data->name) &&
    $utilities->notempty($data->description) &&
    $utilities->notempty($data->active)
){
    // set supplier property values
    $supplier->name = $data->name;
    $supplier->description = $data->description;
    $supplier->phone = $data->phone;
    $supplier->email = $data->email;
    $supplier->accountno = $data->accountno;
    $supplier->ifsccode = $data->ifsccode;
    $supplier->bankname = $data->bankname;
    $supplier->bankbranch = $data->bankbranch;
    $supplier->active = $data->active;
	$supplier->created = date('Y-m-d H:i:s');
 
    // create the supplier
    if($supplier->create()){
 
        // set response code - 201 created
        http_response_code(201);
 
        // tell the supplier
        echo json_encode(array("message" => "Supplier was created successfully.", "success" => true));
    }
 
    // if unable to create the supplier, tell the user
    else{
 
        // set response code - 503 service unavailable
        http_response_code(503);
 
        // tell the user
        echo json_encode(array("message" => "Unable to create the supplier.", "success" => false));
    }
}
 
// tell the user data is incomplete
else{
 
    // set response code - 400 bad request
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create the supplier. Data is incomplete.", "success" => false));
}
?>