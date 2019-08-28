<?php
class Expense{
 
    // database connection and table name
    private $conn;
    private $table_name = "expenses";
 
     // object properties
	public $id;
    public $towards;
    public $towardsid;
    public $amount;
    public $imprest;
    public $siteid;
    public $description;
	public $expensedate;
    public $created;
    public $modified;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
	
	// read expenses
	function read(sUserId){
 
		// select all query
		$query = "SELECT * FROM	" . $this->table_name . " ORDER BY expensedate DESC";
	 
		// prepare query statement
		$stmt = $this->conn->prepare($query);
	 
		// execute query
		$stmt->execute();
	 
		return $stmt;
	}
	
	// Read user imprest
	function readUserImprest(){
 
		// select all query
		$query = "SELECT * FROM	" . $this->table_name . "
				  WHERE
				  towardsid = ? AND imprest = 1";
	 
		// prepare query statement
		$stmt = $this->conn->prepare($query);
		
		// sanitize
		$this->towardsid=htmlspecialchars(strip_tags($this->towardsid));
	 
		// bind id of record 
		$stmt->bindParam(1, $this->towardsid);
	 
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
					towards=:towards, towardsid=:towardsid, amount=:amount, imprest=:imprest, siteid=:siteid, description=:description, expensedate=:expensedate, created=:created";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->towards=htmlspecialchars(strip_tags($this->towards));
		$this->towardsid=htmlspecialchars(strip_tags($this->towardsid));
		$this->amount=htmlspecialchars(strip_tags($this->amount));
		$this->imprest=htmlspecialchars(strip_tags($this->imprest));
		$this->siteid=htmlspecialchars(strip_tags($this->siteid));
		$this->description=htmlspecialchars(strip_tags($this->description));
		$this->expensedate=htmlspecialchars(strip_tags($this->expensedate));
		$this->created=htmlspecialchars(strip_tags($this->created));
		
		// bind values
		$stmt->bindParam(":towards", $this->towards);
		$stmt->bindParam(":towardsid", $this->towardsid);
		$stmt->bindParam(":amount", $this->amount);
		$stmt->bindParam(":imprest", $this->imprest);
		$stmt->bindParam(":siteid", $this->siteid);
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
					towards=:towards, towardsid=:towardsid, amount=:amount, imprest=:imprest, siteid=:siteid, description=:description, expensedate=:expensedate, modified=:modified
				WHERE
					id = :id";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->towards=htmlspecialchars(strip_tags($this->towards));
		$this->towardsid=htmlspecialchars(strip_tags($this->towardsid));
		$this->amount=htmlspecialchars(strip_tags($this->amount));
		$this->imprest=htmlspecialchars(strip_tags($this->imprest));
		$this->siteid=htmlspecialchars(strip_tags($this->siteid));
		$this->expensedate=htmlspecialchars(strip_tags($this->expensedate));
		$this->description=htmlspecialchars(strip_tags($this->description));
		$this->modified=htmlspecialchars(strip_tags($this->modified));
		
		// bind values
		$stmt->bindParam(":towards", $this->towards);
		$stmt->bindParam(":towardsid", $this->towardsid);
		$stmt->bindParam(":amount", $this->amount);
		$stmt->bindParam(":imprest", $this->imprest);
		$stmt->bindParam(":siteid", $this->siteid);
		$stmt->bindParam(":description", $this->description);
		$stmt->bindParam(":expensedate", $this->expensedate);
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