<?php
class PurchaseBill{
 
    // database connection and table name
    private $conn;
    private $table_name = "purchasebills";
 
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
	// create user
	function create(){
		// query to insert record
		$query = "INSERT INTO
					" . $this->table_name . "
				SET
					supplierid=:supplierid, suppliername=:suppliername, description=:description, billdate=:billdate, billno=:billno, amount=:amount, gstamount=:gstamount, totalamount=:totalamount, active=:active, created=:created";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->supplierid=htmlspecialchars(strip_tags($this->supplierid));
		$this->suppliername=htmlspecialchars(strip_tags($this->suppliername));
		$this->description=htmlspecialchars(strip_tags($this->description));
		$this->billdate=htmlspecialchars(strip_tags($this->billdate));
		$this->billno=htmlspecialchars(strip_tags($this->billno));
		$this->amount=htmlspecialchars(strip_tags($this->amount));
		$this->gstamount=htmlspecialchars(strip_tags($this->gstamount));
		$this->totalamount=htmlspecialchars(strip_tags($this->totalamount));
		$this->active=htmlspecialchars(strip_tags($this->active));
		$this->created=htmlspecialchars(strip_tags($this->created));
		
		// bind values
		$stmt->bindParam(":supplierid", $this->supplierid);
		$stmt->bindParam(":suppliername", $this->suppliername);
		$stmt->bindParam(":description", $this->description);
		$stmt->bindParam(":billdate", $this->billdate);
		$stmt->bindParam(":billno", $this->billno);
		$stmt->bindParam(":amount", $this->amount);
		$stmt->bindParam(":gstamount", $this->gstamount);
		$stmt->bindParam(":totalamount", $this->totalamount);
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
					supplierid=:supplierid, suppliername=:suppliername, description=:description, billdate=:billdate, billno=:billno, amount=:amount, gstamount=:gstamount, totalamount=:totalamount, active=:active, modified=:modified
				WHERE
					id = :id";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->supplierid=htmlspecialchars(strip_tags($this->supplierid));
		$this->suppliername=htmlspecialchars(strip_tags($this->suppliername));
		$this->description=htmlspecialchars(strip_tags($this->description));
		$this->billdate=htmlspecialchars(strip_tags($this->billdate));
		$this->billno=htmlspecialchars(strip_tags($this->billno));
		$this->amount=htmlspecialchars(strip_tags($this->amount));
		$this->gstamount=htmlspecialchars(strip_tags($this->gstamount));
		$this->totalamount=htmlspecialchars(strip_tags($this->totalamount));
		$this->active=htmlspecialchars(strip_tags($this->active));
		$this->modified=htmlspecialchars(strip_tags($this->modified));
		
		// bind values
		$stmt->bindParam(":supplierid", $this->supplierid);
		$stmt->bindParam(":suppliername", $this->suppliername);
		$stmt->bindParam(":description", $this->description);
		$stmt->bindParam(":billdate", $this->billdate);
		$stmt->bindParam(":billno", $this->billno);
		$stmt->bindParam(":amount", $this->amount);
		$stmt->bindParam(":gstamount", $this->gstamount);
		$stmt->bindParam(":totalamount", $this->totalamount);
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