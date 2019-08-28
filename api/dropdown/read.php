<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/dropdown.php';
 
// instantiate database and user object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$dropdown = new Dropdown($db);
 
// query users
$stmt = $dropdown->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // users array
    $dropdowns_arr=array();
    $dropdowns_arr["records"]=array();
	$dropdowns_arr["success"]=true;
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $dropdown_item=array(
            "id" => $id,
            "text" => $text,
            "textid" => $textid,
            "category" => $category,
            "active" => $active
        );
 
        array_push($dropdowns_arr["records"], $dropdown_item);
    }
 
    // set response code - 200 OK
    http_response_code(200);
 
    // show dropdowns data in json format
    echo json_encode($dropdowns_arr);
} else{
 
    // set response code - 200 Not found
    http_response_code(200);
 
    // tell the user no dropdowns found
    echo json_encode(
        array("message" => "No data found.", "success" => false)
    );
}