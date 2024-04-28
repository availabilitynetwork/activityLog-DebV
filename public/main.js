$(document).ready(function() {
    $.ajax({
        url: '/api/participants',  // Make sure this endpoint is correct
        type: 'GET',
        success: function(data) {
            let content = '';
            if (data.length > 0) {
                data.forEach(item => {
                    content += `<p>Name: ${item.name}, Email: ${item.email}</p>`;
                });
            } else {
                content = "<p>No participant data found.</p>";
            }
            $('#data-container').html(content);
        },
        error: function() {
            $('#data-container').html('Failed to load participant data.');
        }
    });
});
