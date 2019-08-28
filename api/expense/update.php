<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate expense object
include_once '../objects/expense.php';
include_once '../shared/utilities.php';
 
$database = new Database();
$db = $database->getConnection();
 
$expense = new Expense($db);

// utilities
$utilities = new Utilities(); 
 
// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if(
	$utilities->notempty($data->id) &&
    $utilities->notempty($data->towards) &&
    $utilities->notempty($data->category) &&
    $utilities->notempty($data->totalamount) &&
    $utilities->notempty($data->description) &&
    $utilities->notempty($data->expensedate)
){
 
    // set expense property values
	$expense->id = $data->id;
    $expense->site = $data->site;
    $expense->siteid = $data->siteid;
    $expense->category = $data->category;
    $expense->towards = $data->towards;
    $expense->towardsid = $data->towardsid;
    $expense->purchasebillno = $data->purchasebillno;
    $expense->imprest = $data->imprest;
    $expense->totalamount = $data->totalamount;
    $expense->description = $data->description;
    $expense->expensedate = $data->expensedate;
	$expense->modified = date('Y-m-d H:i:s');
 
    // update the expense
    if($expense->update()){
 
        // set response code - 200 updated
        http_response_code(200);
 
        // tell the user
        echo json_encode(array("message" => "Expense was updated successfully.", "success" => true));
    }
 
    // if unable to update the expense, tell the user
    else{
 
        // set response code - 503 service unavailable
        http_response_code(503);
 
        // tell the user
        echo json_encode(array("message" => "Unable to update the expense.", "success" => false));
    }
}
 
// tell the user data is incomplete
else{
 
    // set response code - 400 bad request
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to update the expense. Data is incomplete.", "success" => false));
}
?>