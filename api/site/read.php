<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/site.php';
 
// instantiate database and site object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$site = new Site($db);
 
// query sites
$stmt = $site->read();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // sites array
    $sites_arr=array();
    $sites_arr["records"]=array();
	$sites_arr["success"]=true;
    // retrieve our table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $site_item=array(
            "id" => $id,
            "name" => $name,
            "description" => html_entity_decode($description),
            "location" => $location,
            "startdate" => $startdate,
			"enddate" => $enddate,
            "active" => $active,
            "created" => $created,
            "modified" => $modified
        );
 
        array_push($sites_arr["records"], $site_item);
    }
 
    // set response code - 200 OK
    http_response_code(200);
 
    // show sites data in json format
    echo json_encode($sites_arr);
} else{
 
    // set response code - 200 Not found
    http_response_code(200);
 
    // tell the user no sites found
    echo json_encode(
        array("message" => "No sites found.", "success" => false)
    );
}