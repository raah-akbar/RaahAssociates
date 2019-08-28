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
include_once '../objects/expensebreakup.php';
include_once '../shared/utilities.php';
 
$database = new Database();
$db = $database->getConnection();
 
$expense = new ExpenseBreakup($db);

// utilities
$utilities = new Utilities(); 
// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if(
    $utilities->notempty($data->expenseid) &&
	$utilities->notempty($data->userid) &&
	$utilities->notempty($data->siteid) &&
    $utilities->notempty($data->amount) &&
    $utilities->notempty($data->description) &&
	$utilities->notempty($data->expensedate) &&
){
 
    // set expense property values
    $expense->expenseid = $data->expenseid;
    $expense->userid = $data->userid;
    $expense->siteid = $data->siteid;
    $expense->amount = $data->amount;
    $expense->description = $data->description;
    $expense->expensedate = $data->expensedate;
	$expense->created = date('Y-m-d H:i:s');
 
    // create the expense
    if($expense->create()){
 
        // set response code - 201 created
        http_response_code(201);
 
        // tell the expense
        echo json_encode(array("message" => "Expense was created successfully.", "success" => true));
    }
 
    // if unable to create the expense, tell the user
    else{
 
        // set response code - 503 service unavailable
        http_response_code(503);
 
        // tell the user
        echo json_encode(array("message" => "Unable to create the expense.", "success" => false));
    }
}
 
// tell the expense data is incomplete
else{
 
    // set response code - 400 bad request
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create expense. Data is incomplete.", "success" => false));
}
?>