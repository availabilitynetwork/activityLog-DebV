document.addEventListener('DOMContentLoaded', function() {
    // Event listener for submitting a participant
    document.getElementById('submitParticipantBtn').addEventListener('click', async function(event) {
        // Prevent default form submission behavior
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phone = document.getElementById('phone').value;

        try {
            const response = await fetch('/participants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, firstName, lastName, phone })
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Participant added successfully:", data); // Log the added participant data
                alert('Participant added successfully');
            } else {
                const text = await response.text();
                console.error("Failed to add participant:", text); // Log the error
                throw new Error('Failed to add participant' || text);
            }
        } catch (error) {
            alert(error.message);
        }
    });


    // Event listener for adding an activity
    document.getElementById('addActivityBtn').addEventListener('click', async function() {
        const participantId = document.getElementById('selectParticipant').value;
        const activityType = document.getElementById('selectActivityType').value;
        const activityDescription = document.getElementById('activityDescription').value;
        const caseNotes = document.getElementById('caseNotes').value;
        const billableHours = document.getElementById('billableHours').value;

        try {
            const response = await fetch('/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participantId, activityType, activityDescription, caseNotes, billableHours })
            });
            if (response.ok) {
                const data = await response.json();
                alert('Activity added successfully');
            } else {
                const text = await response.text();
                throw new Error(text || 'Failed to add activity');
            }
        } catch (error) {
            alert(error.message);
        }
    });

    document.getElementById('selectActivityType').addEventListener('change', function() {
        var customInput = document.getElementById('customActivityType');
        if (this.value === 'Custom') {
            customInput.style.display = 'block';
            customInput.setAttribute('required', 'required');
        } else {
            customInput.style.display = 'none';
            customInput.removeAttribute('required');
        }
    });

    // Get the current date
    var currentDate = new Date();
    
    // Format the date with the day of the week (e.g., "Mon, Apr 25, 2024")
    var options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    var formattedDate = currentDate.toLocaleDateString('en-US', options);
    
    // Update the content of the span element with the current date
    document.getElementById('currentDate').textContent = formattedDate;
});
