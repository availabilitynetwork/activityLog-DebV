//<!-- //////////////////////////query for above table to populate/////////////////////////////--> 

// Fetch data from the server and populate the table
      async function fetchData() {
        const response = await fetch("/api");
        const data = await response.json();

        const tbody = document.getElementById("activityLogBody");
        tbody.innerHTML = ""; // Clear existing rows

        data.forEach((entry) => {
          const row = document.createElement("tr");

          // Populate table cells with data
          // const activityDateCell = document.createElement("td");
          // activityDateCell.textContent = entry.activity_date;
          // row.appendChild(activityDateCell);
          const emailCell = document.createElement("td");
          emailCell.textContent = entry.email;
          row.appendChild(emailCell);

          const lastNameCell = document.createElement("td");
          lastNameCell.textContent = entry.last_name;
          row.appendChild(lastNameCell);

          const activityTypeCell = document.createElement("td");
          activityTypeCell.textContent = entry.activity_type;
          row.appendChild(activityTypeCell);

          const caseNotesCell = document.createElement("td");
          caseNotesCell.textContent = entry.case_notes;
          row.appendChild(caseNotesCell);

          const billableHoursCell = document.createElement("td");
          billableHoursCell.textContent = entry.billable_hours;
          row.appendChild(billableHoursCell);
        
          const authEndDate = document.createElement("td");
          authEndDate.textContent = entry.auth_end_date;
          row.appendChild(authEndDate);

          // const registrationDateCell = document.createElement("td");
          // registrationDateCell.textContent = entry.registration_date;
          // row.appendChild(registrationDateCell);

          tbody.appendChild(row); // Append row to table body
        });
      }

      // Call fetchData function to populate the table
fetchData();
      

document.addEventListener('DOMContentLoaded', function () {
    // Fetch participants from the server using the Fetch API
    fetch('/participants')
        .then(response => response.json())  // Parse the JSON response
        .then(participants => {
            // Get the dropdown element
            const selectElement = document.getElementById('selectParticipant');

            // Iterate over the participants and append <option> elements to the dropdown
            participants.forEach(participant => {
                const option = document.createElement('option');
                option.value = participant.participant_id || "";
                option.textContent = `${participant.first_name || ''} ${participant.last_name || ''}`;
                selectElement.appendChild(option); // Append the option to the dropdown
            });
        })
        .catch(error => {
            console.error('Error fetching participants:', error);
        });
});

document.addEventListener('DOMContentLoaded', function () {
    // Fetch activity types from the server using the Fetch API
    fetch('/activity_type')
        .then(response => response.json())  // Parse the JSON response
        .then(types => {
            // Get the dropdown element
            const selectElement = document.getElementById('selectActivityType');

            // Iterate over the types and append <option> elements to the dropdown
            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type.name;
                option.textContent = type.name;
                selectElement.appendChild(option); // Append the option to the dropdown
            });
        })
        .catch(error => {
            console.error('Error fetching activity types:', error);
        });
});



// JavaScript to handle the change event of the select element
document.getElementById('selectActivityType').addEventListener('change', function() {
    const customActivityTypeInput = document.getElementById('customActivityType');
    if (this.value === 'Custom') {
        customActivityTypeInput.style.display = 'block';
        customActivityTypeInput.setAttribute('required', true); // Make the input required
    } else {
        customActivityTypeInput.style.display = 'none';
        customActivityTypeInput.removeAttribute('required'); // Remove the required attribute
    }
});

