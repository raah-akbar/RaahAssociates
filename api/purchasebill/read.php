<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/purchasebill.php';
 
// instantiate database and purchasebill object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$purchasebill = new PurchaseBill($db);
 
// query purchasebills
$stmt = $purchasebill->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // purchasebills array
    $purchasebills_arr=array();
    $purchasebills_arr["records"]=array();
	$purchasebills_arr["success"]=true;
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $purchasebill_item=array(
            "id" => $id,
            "supplierid" => $supplierid,
            "suppliername" => $suppliername,
            "description" => html_entity_decode($description),
            "billdate" => $billdate,
            "billno" => $billno,
			"amount" => $amount,
            "gstamount" => $gstamount,
            "totalamount" => $totalamount,
            "active" => $active,
            "created" => $created,
            "modified" => $modified
        );
 
        array_push($purchasebills_arr["records"], $purchasebill_item);
    }
 
    // set response code - 200 OK
    http_response_code(200);
 
    // show purchasebills data in json format
    echo json_encode($purchasebills_arr);
} else{
 
    // set response code - 200 Not found
    http_response_code(200);
 
    // tell the user no purchasebills found
    echo json_encode(
        array("message" => "No purchase bills found.", "success" => false)
    );
}