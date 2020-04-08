function myfunction() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var contact = document.getElementById("contact").value;

    // Returns successful data submission message when the entered information is stored in database
    var datastring = 'name1=' + name + "&email1=" + email + "&password1=" + password + "&contact1=" + contact;
    if (name == '' || email == '' || password == '' || contact == '') {
        alert("Please fill in the information, bitch.");
    } else {
    // AJAX code to submit form
        $.ajax({
            type:"POST",
            url: "private/scripts/ajaxjs.php",
            data: datastring,
            cache: false,
            success: function(html) {
                alert(html);
            }
        });
    }return false;
}