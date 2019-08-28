<?php
class Supplier{
 
    // database connection and table name
    private $conn;
    private $table_name = "suppliers";
 
    // object properties
	public $id;
    public $supplierid;
    public $suppliername;
    public $description;
    public $billdate;
    public $billno;
    public $amount;
    public $gstamount;
    public $totalamount;
    public $active;
    public $created;
    public $modified;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
	
	// read sites
	function read(){
 
		// select all query
		$query = "SELECT * FROM	" . $this->table_name;
	 
		// prepare query statement
		$stmt = $this->conn->prepare($query);
	 
		// execute query
		$stmt->execute();
	 
		return $stmt;
	}
	
	// create user
	function create(){
		// query to insert record
		$query = "INSERT INTO
					" . $this->table_name . "
				SET
					name=:name, description=:description, location=:location, startdate=:startdate, enddate=:enddate, active=:active, created=:created";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->name=htmlspecialchars(strip_tags($this->name));
		$this->description=htmlspecialchars(strip_tags($this->description));
		$this->location=htmlspecialchars(strip_tags($this->location));
		$this->startdate=htmlspecialchars(strip_tags($this->startdate));
		$this->enddate=htmlspecialchars(strip_tags($this->enddate));
		$this->active=htmlspecialchars(strip_tags($this->active));
		$this->created=htmlspecialchars(strip_tags($this->created));
		
		// bind values
		$stmt->bindParam(":name", $this->name);
		$stmt->bindParam(":description", $this->description);
		$stmt->bindParam(":location", $this->location);
		$stmt->bindParam(":startdate", $this->startdate);
		$stmt->bindParam(":enddate", $this->enddate);
		$stmt->bindParam(":active", $this->active);
		$stmt->bindParam(":created", $this->created);
	 
		// execute query
		if($stmt->execute()){
			return true;
		}
	 
		return false;          
	}
	
	// update user
	function update(){
		// query to insert record
		$query = "UPDATE
					" . $this->table_name . "
				SET
					name=:name, description=:description, location=:location, startdate=:startdate, enddate=:enddate, active=:active, modified=:modified
				WHERE
					id = :id";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->name=htmlspecialchars(strip_tags($this->name));
		$this->description=htmlspecialchars(strip_tags($this->description));
		$this->location=htmlspecialchars(strip_tags($this->location));
		$this->startdate=htmlspecialchars(strip_tags($this->startdate));
		$this->enddate=htmlspecialchars(strip_tags($this->enddate));
		$this->active=htmlspecialchars(strip_tags($this->active));
		$this->modified=htmlspecialchars(strip_tags($this->modified));
		
		// bind values
		$stmt->bindParam(":name", $this->name);
		$stmt->bindParam(":description", $this->description);
		$stmt->bindParam(":location", $this->location);		
		$stmt->bindParam(":startdate", $this->startdate);		
		$stmt->bindParam(":enddate", $this->enddate);
		$stmt->bindParam(":active", $this->active);
		$stmt->bindParam(":modified", $this->modified);
		$stmt->bindParam(":id", $this->id);
	 
		// execute query
		if($stmt->execute()){
			return true;
		}
	 
		return false;
	}
	
	// delete the product
	function delete(){
 
		// delete query
		$query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->id=htmlspecialchars(strip_tags($this->id));
	 
		// bind id of record to delete
		$stmt->bindParam(1, $this->id);
	 
		// execute query
		if($stmt->execute()){
			return true;
		}
	 
		return false;
	}
}