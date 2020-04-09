<?php
// Get data from POST
$myTrig = $_POST['myTrig'];
$pTime = $_POST['pTime'];

// Server credentials for mySQL
$servername = "";
$username = "";
$password = "";
$dbname = "";

// What to do depending on whether this is a punch IN or another kind
if ($myTrig == "in") {
//	echo "IN: " . $myTrig . ', ' . $pTime . ', ' . $servername . ', ' . $dbname . ', ' . $username . ', ' . $password;
	inPunch($myTrig, $pTime, $servername, $dbname, $username, $password);
} else {
//	echo "CHANGE: " . $myTrig . ', ' . $pTime . ', ' . $servername . ', ' . $dbname . ', ' . $username . ', ' . $password;
	outPunch($myTrig, $pTime, $servername, $dbname, $username, $password);
}

//Function for punching in
function inPunch( $trig, $time, $server, $dbn, $user, $pass) {
//	echo "IN: " . $trig;
	try {
		$conn = new PDO("mysql:host=$server;dbname=$dbn", $user, $pass);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$sql = "INSERT INTO punches(in_ms, running) VALUES ('$time', 1)"; // Insert punch in time
		// use exec() because no results are returned
		$conn->exec($sql);
		echo "You have punched in.";
    }
	catch(PDOException $e) {
		echo $sql . "<br>" . $e->getMessage();
    }
	$conn = null;
}

function outPunch($trig, $time, $server, $dbn, $user, $pass) {
//		echo "CHANGE: " . $trig;
	try {
		$conn = new PDO("mysql:host=$server;dbname=$dbn", $user, $pass);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$sqlOut = "UPDATE `punches` SET `out_ms`='$time', `running`='0' WHERE `running`=1;"; // Punch PUT - UPDATE running punch (should be only one)
		// use exec() because no results are returned
		$conn->exec($sqlOut);
		$msg = "You have punched out.";
		if ($trig == "change") { // If trigger is change, punch back in for new job
			$sqlChange = "INSERT INTO punches(in_ms, running) VALUES ('$time', 1)"; // insert time and set flag to running
			$conn->exec($sqlChange);
			$msg = "You have punched out of one job and into another";
		}
		echo $msg;
    }
	catch(PDOException $e) {
    	echo $sqlChange . "<br>" . $e->getMessage();
    }
	$conn = null;
}
?> 