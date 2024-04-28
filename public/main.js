 $(document).ready(function() {
    $("#testDbButton").click(function() {
      $.ajax({
        url: '/api/test-db', // Update this line to match the new route
        type: 'GET',
        success: function(response) {
          if (response.success) {
            alert("Database connection is successful! Server time: " + response.time);
          } else {
            alert("Failed to connect to the database.");
          }
        },
        error: function() {
          alert("Error making the request.");
        }
      });
    });
  });