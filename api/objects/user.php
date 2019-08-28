<?php
class User{
 
    // database connection and table name
    private $conn;
    private $table_name = "users";
 
     // object properties
	public $id;
    public $username;
    public $password;
    public $firstname;
    public $lastname;
    public $email;
    public $orgemail;
    public $phone;
    public $roleid;
    public $rolename;
    public $active;
    public $created;
    public $modified;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }
	
	// read users
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
					username=:username, password=:password, firstname=:firstname, lastname=:lastname, email=:email, orgemail=:orgemail, phone=:phone, roleid=:roleid, rolename=:rolename, active=:active, created=:created";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->username=htmlspecialchars(strip_tags($this->username));
		$this->password=htmlspecialchars(strip_tags($this->password));
		$this->firstname=htmlspecialchars(strip_tags($this->firstname));
		$this->lastname=htmlspecialchars(strip_tags($this->lastname));
		$this->email=htmlspecialchars(strip_tags($this->email));
		$this->orgemail=htmlspecialchars(strip_tags($this->orgemail));
		$this->phone=htmlspecialchars(strip_tags($this->phone));
		$this->roleid=htmlspecialchars(strip_tags($this->roleid));
		$this->rolename=htmlspecialchars(strip_tags($this->rolename));
		$this->active=htmlspecialchars(strip_tags($this->active));
		$this->created=htmlspecialchars(strip_tags($this->created));
		
		// bind values
		$stmt->bindParam(":username", $this->username);
		$stmt->bindParam(":password", $this->password);
		$stmt->bindParam(":firstname", $this->firstname);
		$stmt->bindParam(":lastname", $this->lastname);
		$stmt->bindParam(":email", $this->email);
		$stmt->bindParam(":orgemail", $this->orgemail);
		$stmt->bindParam(":phone", $this->phone);
		$stmt->bindParam(":roleid", $this->roleid);
		$stmt->bindParam(":rolename", $this->rolename);
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
					username=:username, password=:password, firstname=:firstname, lastname=:lastname, email=:email, orgemail=:orgemail, phone=:phone, roleid=:roleid, rolename=:rolename, active=:active, modified=:modified
				WHERE
					id = :id";
	 
		// prepare query
		$stmt = $this->conn->prepare($query);
	 
		// sanitize
		$this->username=htmlspecialchars(strip_tags($this->username));
		$this->password=htmlspecialchars(strip_tags($this->password));
		$this->firstname=htmlspecialchars(strip_tags($this->firstname));
		$this->lastname=htmlspecialchars(strip_tags($this->lastname));
		$this->email=htmlspecialchars(strip_tags($this->email));
		$this->orgemail=htmlspecialchars(strip_tags($this->orgemail));
		$this->phone=htmlspecialchars(strip_tags($this->phone));
		$this->roleid=htmlspecialchars(strip_tags($this->roleid));
		$this->rolename=htmlspecialchars(strip_tags($this->rolename));
		$this->active=htmlspecialchars(strip_tags($this->active));
		$this->modified=htmlspecialchars(strip_tags($this->modified));
		
		// bind values
		$stmt->bindParam(":username", $this->username);
		$stmt->bindParam(":password", $this->password);
		$stmt->bindParam(":firstname", $this->firstname);
		$stmt->bindParam(":lastname", $this->lastname);
		$stmt->bindParam(":email", $this->email);
		$stmt->bindParam(":orgemail", $this->orgemail);
		$stmt->bindParam(":phone", $this->phone);
		$stmt->bindParam(":roleid", $this->roleid);
		$stmt->bindParam(":rolename", $this->rolename);
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
	
	// read auth user
	function getAuthUser($username, $password){
 
		// select all query
		$query = "SELECT * FROM	" . $this->table_name . " WHERE active = 1 and username = ? and password = ? COLLATE utf8_bin";
	 
		// prepare query statement
		$stmt = $this->conn->prepare($query);
 
		// bind id of record to delete
		$stmt->bindParam(1, $username);
		
		$stmt->bindParam(2, $password);
	 
		// execute query
		$stmt->execute();
	 
		return $stmt;
	}
}