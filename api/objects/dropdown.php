<?php
class Dropdown{
 
    // database connection and table name
    private $conn;
    private $table_name = "dropdowns";
 
    // object properties
	public $id;
    public $text;
    public $textid;
    public $category;
    public $active;
    public $created;
    public $modified;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
	
	// read expenses
	function read(){
 
		// select all query
		$query = "SELECT * FROM	" . $this->table_name;
	 
		// prepare query statement
		$stmt = $this->conn->prepare($query);
	 
		// execute query
		$stmt->execute();
	 
		return $stmt;
	}
	
	// read roles
	function readRoles(){
 
		// select all query
		$query = "SELECT text, textid FROM	" . $this->table_name ." WHERE active=1 and category='RolesDD'";
	 
		// prepare query statement
		$stmt = $this->conn->prepare($query);
	 
		// execute query
		$stmt->execute();
	 
		return $stmt;
	}
}