<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/supplier.php';
 
// instantiate database and supplier object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$supplier = new Supplier($db);
 
// query suppliers
$stmt = $supplier->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // suppliers array
    $suppliers_arr=array();
    $suppliers_arr["records"]=array();
	$suppliers_arr["success"]=true;
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
        $supplier_item=array(
            "id" => $id,
            "name" => $name,
            "description" => html_entity_decode($description),
            "phone" => $phone,
            "email" => $email,
			"accountno" => $accountno,
            "ifsccode" => $ifsccode,
            "bankname" => $bankname,
			"bankbranch" => $bankbranch,
            "active" => $active,
            "created" => $created,
            "modified" => $modified
        );
 
        array_push($suppliers_arr["records"], $supplier_item);
    }
 
    // set response code - 200 OK
    http_response_code(200);
 
    // show suppliers data in json format
    echo json_encode($suppliers_arr);
} else{
 
    // set response code - 200 Not found
    http_response_code(200);
 
    // tell the user no suppliers found
    echo json_encode(
        array("message" => "No suppliers found.", "success" => false)
    );
}