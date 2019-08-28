<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/expense.php';
include_once '../shared/utilities.php';
 
// instantiate database and expense object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$expense = new Expense($db);
// utilities
$utilities = new Utilities(); // get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if($utilities->notempty($data->towardsid)){
	// query expenses
	$stmt = $expense->readUserImprest();
	$num = $stmt->rowCount();
	 
	// check if more than 0 record found
	if($num>0){
	 
		// expenses array
		$expenses_arr=array();
		$expenses_arr["records"]=array();
		$expenses_arr["success"]=true;
		// retrieve our table contents
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
			// extract row
			// this will make $row['name'] to
			// just $name only
			extract($row);
	 
			$expense_item=array(
				"id" => $id,
				"towards" => $towards,
				"towardsid" => $towardsid,
				"amount" => $amount,
				"imprest" => ($imprest == 1 ? true : false),
				"siteid" => $siteid,
				"description" => $description,
				"expensedate" => $expensedate,
				"created" => $created,
				"modified" => $modified
			);
	 
			array_push($expenses_arr["records"], $expense_item);
		}
	 
		// set response code - 200 OK
		http_response_code(200);
	 
		// show expenses data in json format
		echo json_encode($expenses_arr);	
	} else{
	 
		// set response code - 200 Not found
		http_response_code(200);
	 
		// tell the user no expenses found
		echo json_encode(
			array("message" => "No expenses found.", "success" => false)
		);
	}
}
// tell the user data is incomplete
else{
 
    // set response code - 400 bad request
    http_response_code(400);
 
    // tell the user
    echo json_encode(array("message" => "Unable to create user. Data is incomplete.", "success" => false));
}