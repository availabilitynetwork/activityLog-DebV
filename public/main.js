$(document).ready(function() {
    $('#testDbButton').click(function() {
        $.ajax({
            url: '/api/test-db',  
            type: 'GET',
            success: function(response) {
                if (response.success) {
                    alert('Database connection is successful! Server time: ' + response.time);
                } else {
                    // Check if the message is provided, fallback to a default error message
                    alert('Failed to connect to the database. Reason: ' + (response.message || 'No specific error message provided.'));
                }
            },
            error: function(xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText;
                alert('Failed to complete the request. Error - ' + errorMessage);
                console.log('Detailed error information: ', xhr.responseText);
            }
        });
    });
});
