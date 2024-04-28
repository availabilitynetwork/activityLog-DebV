$(document).ready(function() {
    $('#testDbButton').click(function() {
        $.ajax({
            url: '/api/test-db',  // Make sure this matches the server-side endpoint.
            type: 'GET',
            success: function(response) {
                if (response.success) {
                    alert('Database connection is successful! Server time: ' + response.time);
                } else {
                    alert('Failed to connect to the database. Reason: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                // Detailed error handling
                var errorMessage = xhr.status + ': ' + xhr.statusText;
                alert('Failed to complete the request. Error - ' + errorMessage);
                console.log('Detailed error information: ', xhr.responseText);
            }
        });
    });
});
