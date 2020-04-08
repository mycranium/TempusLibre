function myfunction(trigger) { // AJAX to POST to php script. Gets punch type (trigger) from html page.
    // Returns successful data submission message when the entered information is stored in database
    var datastring = 'myTrig=' + trigger + '&pTime=' + Date.now(); // Data to POST to pho script
        $.ajax({
            type:"POST",
            url: "private/scripts/basetime.php",
            data: datastring,
            cache: false,
            success: function(html) {
                alert(html);
            }
        });
    return false;
}