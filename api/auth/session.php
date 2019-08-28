<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// get database connection
include_once '../config/database.php';
 
// instantiate user object
include_once '../objects/user.php';
 
$database = new Database();
$db = $database->getConnection();
 
$user = new User($db);

session_start(); 
// make sure data is not empty
if(!isset($_SESSION['userid'])){
	
     // set response code - 200 success
    http_response_code(200);
 
    // tell the user
    echo json_encode(array("message" => "Session expired!",
			"success" => false));
	die();		
}
 
// tell the user data is incomplete
else{
	$username = $_SESSION['username'];
    $password = $_SESSION['password'];
	
	// query users
	$stmt = $user->getAuthUser($username, $password);
	$num = $stmt->rowCount();
 
	// check if more than 0 record found
	if($num === 1){
	 
		// users array
		$users_arr=array();
		$users_arr["records"]=array();
		$users_arr["success"]=true;
		// retrieve our table contents
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
			// extract row
			// this will make $row['name'] to
			// just $name only
			extract($row);
	 
			$user_item=array(
				"id" => $id,
				"username" => $username,
				"password" => $password,
				"firstname" => $firstname,
				"lastname" => $lastname,
				"email" => $email,
				"orgemail" => $orgemail,
				"phone" => $phone,
				"roleid" => $roleid,
				"rolename" => $rolename,
				"active" => $active,
				"created" => $created,
				"modified" => $modified
			);
	 
			array_push($users_arr["records"], $user_item);
		}
	 
		// set response code - 200 OK
		http_response_code(200);
	 
		// show users data in json format
		echo json_encode($users_arr);
	}
	else{
		 
			// set response code - 200 success
			http_response_code(200);
		 
			// tell the user no users found
			echo json_encode(array("message" => "No users found. Invalid credentials.",
					"success" => false));
	}
}
?>