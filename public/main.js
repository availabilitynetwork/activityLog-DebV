$.ajax({
    url: '/api/participants',
    type: 'GET',
    success: function(data) {
        console.log('Received data:', data);  // Check the actual received data
        console.log('Is array:', Array.isArray(data));  // Check if data is an array
        if (Array.isArray(data)) {
            let content = '';
            data.forEach(item => {
                content += `<p>Name: ${item.name}, Email: ${item.email}</p>`;
            });
            $('#data-container').html(content);
        } else {
            $('#data-container').html('<p>Received data is not an array.</p>');
        }
    },
    error: function(xhr, status, error) {
        console.error('Error:', error);
        $('#data-container').html('Failed to load data: ' + error);
    }
});
