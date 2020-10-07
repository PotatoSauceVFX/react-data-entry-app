const sql = require("./db");

// Constructor
const Customer = function(customer) {
	this.email = customer.email;
	this.name = customer.name;
	this.active = customer.active;
};

// Create customer
Customer.create = (newCustomer, result) => {
	sql.query("INSERT INTO customers SET ?", newCustomer, (err, res) => {
		if (err) {
			console.error("Error: ", err);
      		result(err, null);
      		return;
		}

		console.log("Created customer: ", { id: res.insertId, ...newCustomer });
    	result(null, { id: res.insertId, ...newCustomer });
	});
};

// Get customer by id
Customer.findById = (customerId, result) => {
	sql.query(`SELECT * FROM customers WHERE id = ${customerId}`, (err, res) => {
		if (err) {
			console.error("Error: ", err);
			result(err, null);
			return;
		}
	
		if (res.length) {
			console.log("Found customer: ", res[0]);
			result(null, res[0]);
			return;
		}
	
		// Not found Customer with the id
		result({ kind: "not_found" }, null);
	  });
};

// Get all customers
Customer.getAll = result => {
	sql.query("SELECT * FROM customers", (err, res) => {
		if (err) {
			console.error("Error: ", err);
			result(null, err);
			return;
		}
	
		console.log("Customers: ", res);
		result(null, res);
	});
};

// Update customer
Customer.updateById = (id, customer, result) => {
	sql.query(
		"UPDATE customers SET email = ?, name = ?, active = ? WHERE id = ?",
		[customer.email, customer.name, customer.active, id],
		(err, res) => {
			if (err) {
				console.error("Error: ", err);
				result(null, err);
				return;
			}

			if (res.affectedRows == 0) {
				// Not found Customer with the id
				result({ kind: "not_found" }, null);
				return;
			}

			console.log("Updated customer: ", { id: id, ...customer });
			result(null, { id: id, ...customer });
		}
	);
};

// Remove customer
Customer.remove = (id, result) => {
	sql.query("DELETE FROM customers WHERE id = ?", id, (err, res) => {
		if (err) {
			console.error("Error: ", err);
			result(null, err);
			return;
		}
	
		if (res.affectedRows == 0) {
			// Not found Customer with the id
			result({ kind: "not_found" }, null);
			return;
		}
	
		console.log("Deleted customer with id: ", id);
		result(null, res);
	});
};

// Remove all customers
Customer.removeAll = result => {
	sql.query("DELETE FROM customers", (err, res) => {
		if (err) {
			console.error("Error: ", err);
			result(null, err);
			return;
		}
	
		console.log(`Deleted ${res.affectedRows} customers`);
		result(null, res);
	});
};

module.exports = Customer;