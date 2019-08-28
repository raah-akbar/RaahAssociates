<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate purchasebill object
include_once '../objects/purchasebill.php';
include_once '../shared/utilities.php';
 
$database = new Database();
$db = $database->getConnection();
 
$purchasebill = new PurchaseBill($db);

// utilities
$utilities = new Utilities(); 
// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if(
    $utilities->notempty($data->supplierid) &&
    $utilities->notempty($data->suppliername) &&
    $utilities->notempty($data->description) &&
    $utilities->notempty($data->billdate) &&
    $utilities->notempty($data->billno) &&
    $utilities->notempty($data->amount) &&
    $utilities->notempty($data->gstamount) &&
    $utilities->notempty($data->totalamount) &&
    $utilities->notempty($data->active)
){
    // set purchasebill property values
    $purchasebill->supplierid = $data->supplierid;
    $purchasebill->suppliername = $data->suppliername;
    $purchasebill->description = $data->description;
    $purchasebill->billdate = $data->billdate;
    $purchasebill->billno = $data->billno;
    $purchasebill->amount = $data->amount;
    $purchasebill->gstamount = $data->gstamount;
    $purchasebill->totalamount = $data->totalamount;
    $purchasebill->active = $data->active;
	$purchasebill->created = date('Y-m-d H:i:s');
 
    // create the purchasebill
    if($purchasebill->create()){
 
        // set response code - 201 created
        http_response_code(201);
 
        // tell the purchasebill
        echo json_encode(array("message" => "Purchase Bill was created successfully.", "success" => true));
    }
 
    // if unable to create the purchasebill, tell the user
    else{
 
        // set response code - 503 service unavailable
        http_response_code(503);
 
        // tell the user
        echo json_encode(array("message" => "Unable to create the purchasebill.", "success" => false));
    }
}
 
// tell the user data is incomplete
else{
 
    // set response code - 400 bad request
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create the purchasebill. Data is incomplete.", "success" => false));
}
?>