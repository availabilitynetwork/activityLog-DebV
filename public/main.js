
  $(document).ready(function() {
    $("#testDbButton").click(function() {
      $.ajax({
        url: '/test-db',
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

