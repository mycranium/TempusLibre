<?php

$name2 = $_POST['name1'];
$email2 = $_POST['email1'];
$password2 = $_POST['password1'];
$contact2 = $_POST['contact1'];

$servername = "";
$username = "";
$password = "";
$dbname = "";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "INSERT INTO form_element(name, email, password, contact) VALUES ('$name2', '$email2', '$password2', '$contact2')";
    // use exec() because no results are returned
    $conn->exec($sql);
    echo "New record created successfully";
    }
catch(PDOException $e)
    {
    echo $sql . "<br>" . $e->getMessage();
    }

$conn = null;
?> 