
$(document).ready(function() {
    $.ajax({
        url: '/api/participant',  // Updated endpoint
        type: 'GET',
        success: function(data) {
            let content = '';
            data.forEach(item => {
                // Example: Assuming 'name' and 'email' are columns in your 'participant' table
                content += `<p>Name: ${item.name}, Email: ${item.email}</p>`;
            });
            $('#data-container').html(content);
        },
        error: function() {
            $('#data-container').html('Failed to load participant data.');
        }
    });
});