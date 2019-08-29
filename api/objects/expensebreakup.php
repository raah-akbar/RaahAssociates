<?php
class ExpenseBreakup{
 
    // database connection and table name
    private $conn;
    private $table_name = "expensebreakup";

     // object properties
	public $id;
    public $userid;
    public $siteid;
    public $amount;
    public $description;
    public $expensedate;
    public $created;
    public $modified;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
	
	// read expenses
	function read(){
 
		// select all query
		$query = "SELECT * FROM	" . $this->table_name . " ORDER BY expensedate DESC";
	 
		// prepare query statement
		$stmt = $this->conn->prepare($query);
	 
		// execute query
		$stmt->execute();
	 
		return $stmt;
	}
	
	// create expense
	function create(){
		// query to insert record
		$query = "INSERT INTO
					" . $this->table_name . "
				SET
					userid=:userid, siteid=:siteid, amount=:amount, description=:description, expensedate=:expensedate, created=:created";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->userid=htmlspecialchars(strip_tags($this->userid));
		$this->siteid=htmlspecialchars(strip_tags($this->siteid));
		$this->amount=htmlspecialchars(strip_tags($this->amount));
		$this->description=htmlspecialchars(strip_tags($this->description));
		$this->expensedate=htmlspecialchars(strip_tags($this->expensedate));
		$this->created=htmlspecialchars(strip_tags($this->created));
		
		// bind values
		$stmt->bindParam(":userid", $this->userid);
		$stmt->bindParam(":siteid", $this->siteid);
		$stmt->bindParam(":amount", $this->amount);
		$stmt->bindParam(":description", $this->description);
		$stmt->bindParam(":expensedate", $this->expensedate);
		$stmt->bindParam(":created", $this->created);
	 
		// execute query
		if($stmt->execute()){
			return true;
		}
	 
		return false;
	}
	
	// update expense
	function update(){
		// query to insert record
		$query = "UPDATE
					" . $this->table_name . "
				SET
					userid=:userid, siteid=:siteid, amount=:amount, description=:description, expensedate=:expensedate, modified=:modified
				WHERE
					id = :id";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->siteid=htmlspecialchars(strip_tags($this->siteid));
		$this->amount=htmlspecialchars(strip_tags($this->amount));
		$this->description=htmlspecialchars(strip_tags($this->description));
		$this->expensedate=htmlspecialchars(strip_tags($this->expensedate));
		$this->modified=htmlspecialchars(strip_tags($this->modified));
		
		// bind values
		$stmt->bindParam(":userid", $this->userid);
		$stmt->bindParam(":siteid", $this->siteid);
		$stmt->bindParam(":amount", $this->amount);
		$stmt->bindParam(":description", $this->description);
		$stmt->bindParam(":expensedate", $this->expensedate);
		$stmt->bindParam(":modified", $this->modified);
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