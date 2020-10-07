const sql = require("./db");

const Statistic = function (statistic) {
	this.isWorkDay = statistic.isWorkDay;
	this.wakeUpDateTime = statistic.wakeUpDateTime;
	this.entryDateTime = statistic.entryDateTime;
	this.notes = statistic.notes;
};

Statistic.create = (newStatistic, result) => {

	// Check if entry has been submitted today
	//already_created
	sql.query(
		"SELECT id, DATE(entryDateTime) FROM statistics WHERE DATE(entryDateTime) = CURDATE()",
	(err, res) => {
		if (err) {
			console.error("Error: ", err);
			result(err, null);
			return;
		}
	
		if (res.length) {
			result({ kind: "already_created" }, null);
			return;
		} else {
			sql.query("INSERT INTO statistics SET ?", newStatistic, (err, res) => {
				if (err) {
					console.error("Error: ", err);
					result(err, null);
					return;
				}
		
				console.log("Added new statistic: ", { id: res.insertId, ...newStatistic });
				result(null, { id: res.insertId, ...newStatistic });
			});
		}
	});
};

Statistic.findById = (statisticId, result) => {
	sql.query(`SELECT * FROM statistics WHERE id = ${statisticId}`, (err, res) => {
		if (err) {
			console.error("Error: ", err);
			result(err, null);
			return;
		}

		if (res.length) {
			console.log("Found statistic: ", res[0]);
			result(null, res[0]);
			return;
		}

		result({ kind: "not_found" }, null);
	});
};

Statistic.getAll = result => {
	sql.query("SELECT * FROM statistics", (err, res) => {
		if (err) {
			console.error("Error: ", err);
			result(null, err);
			return;
		}

		console.log("Statistics: ", res);
		result(null, res);
	});
};

Statistic.updateById = (id, statistic, result) => {
	sql.query(
		"UPDATE statistics SET isWorkDay = ?, wakeUpDateTime = ?, entryDateTime = ?, notes = ? WHERE id = ?",
		[statistic.isWorkDay, statistic.wakeUpDateTime, statistic.entryDateTime, statistic.notes, id],
		(err, res) => {
			if (err) {
				console.error("Error: ", err);
				result(null, err);
				return;
			}

			if (res.affectedRows == 0) {
				result({ kind: "not_found" }, null);
				return;
			}

			console.log("Updated statistic: ", { id: id, ...statistic });
			result(null, { id: id, ...statistic });
		}
	);
};

Statistic.remove = (id, result) => {
	sql.query("DELETE FROM statistics WHERE id = ?", id, (err, res) => {
		if (err) {
			console.error("Error: ", err);
			result(null, err);
			return;
		}

		if (res.affectedRows == 0) {
			result({ kind: "not_found" }, null);
			return;
		}

		console.log("Deleted statistic with id: ", id);
		result(null, res);
	});
};

module.exports = Statistic;