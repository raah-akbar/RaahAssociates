<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/expensebreakup.php';
 
// instantiate database and expense object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$expense = new ExpenseBreakup($db);
 
// query expenses
$stmt = $expense->read();
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
            "userid" => $userid,
            "siteid" => $siteid,
            "towards" => $towards,
            "amount" => $amount,
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