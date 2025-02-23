// Fetch all medicines and display them in the table
function fetchAllMedicines() {
    fetch('http://localhost:5000/api/medicines')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('medicineTableBody');
            tableBody.innerHTML = ''; // Clear existing rows
            data.forEach(medicine => {
                const row_number = `<tr>
                    <td>${medicine.name}</td>
                    <td>${medicine.row_number}</td>
                    <td>${medicine.rack}</td>
                </tr>`;
                tableBody.innerHTML += row_number;
            });
        })
        .catch(error => console.error('Error fetching medicines:', error));
}

// Search for medicine and display suggestions
document.getElementById('medicineName').addEventListener('input', function () {
    const query = this.value;
    if (query.length > 0) {
        fetch(`http://localhost:5000/api/medicines?name=${query}`)
            .then(response => response.json())
            .then(data => {
                const suggestions = document.getElementById('suggestions');
                suggestions.innerHTML = '';
                data.forEach(medicine => {
                    const suggestion = `<div onclick="selectSuggestion('${medicine.name}')">${medicine.name}</div>`;
                    suggestions.innerHTML += suggestion;
                });
            })
            .catch(error => console.error('Error fetching suggestions:', error));
    } else {
        document.getElementById('suggestions').innerHTML = '';
    }
});

// Select a suggestion and search for it
function selectSuggestion(name) {
    document.getElementById('medicineName').value = name;
    document.getElementById('suggestions').innerHTML = '';
    searchMedicine();
}

// Search for medicine and announce its location
function searchMedicine() {
    const name = document.getElementById('medicineName').value;
    if (!name) return; // Exit if the search box is empty

    fetch(`http://localhost:5000/api/medicines?name=${name}`)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            if (data.length > 0) {
                const medicine = data[0];
                resultDiv.innerHTML = `Medicine: ${medicine.name}, Row: ${medicine.row_number}, Rack: ${medicine.rack}`;

                // Stop any previous speech
                window.speechSynthesis.cancel();

                // Announce the location
                const utterance = new SpeechSynthesisUtterance(
                    `Your medicine, ${medicine.name}, is located in Row ${medicine.row_number}, Rack ${medicine.rack}.`
                );
                window.speechSynthesis.speak(utterance);
            } else {
                resultDiv.innerHTML = 'Medicine not found';
            }
        })
        .catch(error => console.error('Error:', error));
}

// Open the "Add Medicine" form
function openAddMedicineForm() {
    document.getElementById('addMedicineForm').style.display = 'block';
}

// Add a new medicine
function addMedicine() {
    const name = document.getElementById('newMedicineName').value;
    const row_number = document.getElementById('newMedicineRow').value;
    const rack = document.getElementById('newMedicineRack').value;

    fetch('http://localhost:5000/api/medicines', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, row_number, rack }),
    })
        .then(response => response.json())
        .then(data => {
            alert('Medicine added successfully!');
            // Clear the form fields
            document.getElementById('newMedicineName').value = '';
            document.getElementById('newMedicineRow').value = '';
            document.getElementById('newMedicineRack').value = '';
            // Hide the form
            document.getElementById('addMedicineForm').style.display = 'none';
            // Refresh the medicine list
            fetchAllMedicines();
        })
        .catch(error => console.error('Error:', error));
}

// Function to fetch and display medicines in the table
// Function to fetch and display medicines in the table
// Function to fetch and display medicines in the table
// Hardcoded medicine data
const medicines = [
    // Row 1: Headache Medicines
    { name: 'Paracetamol', row_number: '1', rack: 'Rack 1' },
    { name: 'Ibuprofen', row_number: '1', rack: 'Rack 2' },
    { name: 'Aspirin', row_number: '1', rack: 'Rack 3' },
    { name: 'Naproxen', row_number: '1', rack: 'Rack 4' },
    { name: 'Sumatriptan', row_number: '1', rack: 'Rack 5' },

    // Row 2: Fever Medicines
    { name: 'Acetaminophen', row_number: '2', rack: 'Rack 1' },
    { name: 'Diclofenac', row_number: '2', rack: 'Rack 2' },
    { name: 'Celecoxib', row_number: '2', rack: 'Rack 3' },
    { name: 'Indomethacin', row_number: '2', rack: 'Rack 4' },
    { name: 'Meloxicam', row_number: '2', rack: 'Rack 5' },

    // Row 3: Allergy Medicines
    { name: 'Cetirizine', row_number: '3', rack: 'Rack 1' },
    { name: 'Loratadine', row_number: '3', rack: 'Rack 2' },
    { name: 'Fexofenadine', row_number: '3', rack: 'Rack 3' },
    { name: 'Diphenhydramine', row_number: '3', rack: 'Rack 4' },
    { name: 'Chlorpheniramine', row_number: '3', rack: 'Rack 5' },

    // Row 4: Cold and Flu Medicines
    { name: 'Phenylephrine', row_number: '4', rack: 'Rack 1' },
    { name: 'Pseudoephedrine', row_number: '4', rack: 'Rack 2' },
    { name: 'Dextromethorphan', row_number: '4', rack: 'Rack 3' },
    { name: 'Guaifenesin', row_number: '4', rack: 'Rack 4' },
    { name: 'Oxymetazoline', row_number: '4', rack: 'Rack 5' },

    // Row 5: Pain Relievers
    { name: 'Tramadol', row_number: '5', rack: 'Rack 1' },
    { name: 'Codeine', row_number: '5', rack: 'Rack 2' },
    { name: 'Morphine', row_number: '5', rack: 'Rack 3' },
    { name: 'Oxycodone', row_number: '5', rack: 'Rack 4' },
    { name: 'Hydrocodone', row_number: '5', rack: 'Rack 5' },

    // Row 6: Antibiotics
    { name: 'Amoxicillin', row_number: '6', rack: 'Rack 1' },
    { name: 'Ciprofloxacin', row_number: '6', rack: 'Rack 2' },
    { name: 'Azithromycin', row_number: '6', rack: 'Rack 3' },
    { name: 'Doxycycline', row_number: '6', rack: 'Rack 4' },
    { name: 'Cephalexin', row_number: '6', rack: 'Rack 5' },

    // Row 7: Antacids
    { name: 'Omeprazole', row_number: '7', rack: 'Rack 1' },
    { name: 'Ranitidine', row_number: '7', rack: 'Rack 2' },
    { name: 'Famotidine', row_number: '7', rack: 'Rack 3' },
    { name: 'Esomeprazole', row_number: '7', rack: 'Rack 4' },
    { name: 'Lansoprazole', row_number: '7', rack: 'Rack 5' },

    // Row 8: Antidepressants
    { name: 'Sertraline', row_number: '8', rack: 'Rack 1' },
    { name: 'Fluoxetine', row_number: '8', rack: 'Rack 2' },
    { name: 'Citalopram', row_number: '8', rack: 'Rack 3' },
    { name: 'Escitalopram', row_number: '8', rack: 'Rack 4' },
    { name: 'Paroxetine', row_number: '8', rack: 'Rack 5' },

    // Row 9: Antidiabetics
    { name: 'Metformin', row_number: '9', rack: 'Rack 1' },
    { name: 'Insulin', row_number: '9', rack: 'Rack 2' },
    { name: 'Glimepiride', row_number: '9', rack: 'Rack 3' },
    { name: 'Pioglitazone', row_number: '9', rack: 'Rack 4' },
    { name: 'Sitagliptin', row_number: '9', rack: 'Rack 5' },

    // Row 10: Antihypertensives
    { name: 'Lisinopril', row_number: '10', rack: 'Rack 1' },
    { name: 'Amlodipine', row_number: '10', rack: 'Rack 2' },
    { name: 'Metoprolol', row_number: '10', rack: 'Rack 3' },
    { name: 'Losartan', row_number: '10', rack: 'Rack 4' },
    { name: 'Valsartan', row_number: '10', rack: 'Rack 5' },

    // Row 11: Antivirals
    { name: 'Acyclovir', row_number: '11', rack: 'Rack 1' },
    { name: 'Valacyclovir', row_number: '11', rack: 'Rack 2' },
    { name: 'Oseltamivir', row_number: '11', rack: 'Rack 3' },
    { name: 'Ribavirin', row_number: '11', rack: 'Rack 4' },
    { name: 'Remdesivir', row_number: '11', rack: 'Rack 5' },

    // Row 12: Antifungals
    { name: 'Fluconazole', row_number: '12', rack: 'Rack 1' },
    { name: 'Ketoconazole', row_number: '12', rack: 'Rack 2' },
    { name: 'Itraconazole', row_number: '12', rack: 'Rack 3' },
    { name: 'Terbinafine', row_number: '12', rack: 'Rack 4' },
    { name: 'Amphotericin B', row_number: '12', rack: 'Rack 5' },

    // Row 13: Antiemetics
    { name: 'Ondansetron', row_number: '13', rack: 'Rack 1' },
    { name: 'Metoclopramide', row_number: '13', rack: 'Rack 2' },
    { name: 'Domperidone', row_number: '13', rack: 'Rack 3' },
    { name: 'Prochlorperazine', row_number: '13', rack: 'Rack 4' },
    { name: 'Promethazine', row_number: '13', rack: 'Rack 5' },

    // Row 14: Anticoagulants
    { name: 'Warfarin', row_number: '14', rack: 'Rack 1' },
    { name: 'Heparin', row_number: '14', rack: 'Rack 2' },
    { name: 'Rivaroxaban', row_number: '14', rack: 'Rack 3' },
    { name: 'Dabigatran', row_number: '14', rack: 'Rack 4' },
    { name: 'Apixaban', row_number: '14', rack: 'Rack 5' },

    // Row 15: Antihistamines
    { name: 'Desloratadine', row_number: '15', rack: 'Rack 1' },
    { name: 'Levocetirizine', row_number: '15', rack: 'Rack 2' },
    { name: 'Bilastine', row_number: '15', rack: 'Rack 3' },
    { name: 'Ebastine', row_number: '15', rack: 'Rack 4' },
    { name: 'Rupatadine', row_number: '15', rack: 'Rack 5' },

    // Row 16: Bronchodilators
    { name: 'Salbutamol', row_number: '16', rack: 'Rack 1' },
    { name: 'Formoterol', row_number: '16', rack: 'Rack 2' },
    { name: 'Salmeterol', row_number: '16', rack: 'Rack 3' },
    { name: 'Theophylline', row_number: '16', rack: 'Rack 4' },
    { name: 'Ipratropium', row_number: '16', rack: 'Rack 5' },

    // Row 17: Corticosteroids
    { name: 'Prednisone', row_number: '17', rack: 'Rack 1' },
    { name: 'Hydrocortisone', row_number: '17', rack: 'Rack 2' },
    { name: 'Dexamethasone', row_number: '17', rack: 'Rack 3' },
    { name: 'Betamethasone', row_number: '17', rack: 'Rack 4' },
    { name: 'Methylprednisolone', row_number: '17', rack: 'Rack 5' },

    // Row 18: Diuretics
    { name: 'Furosemide', row_number: '18', rack: 'Rack 1' },
    { name: 'Hydrochlorothiazide', row_number: '18', rack: 'Rack 2' },
    { name: 'Spironolactone', row_number: '18', rack: 'Rack 3' },
    { name: 'Amiloride', row_number: '18', rack: 'Rack 4' },
    { name: 'Triamterene', row_number: '18', rack: 'Rack 5' },

    // Row 19: Anticonvulsants
    { name: 'Phenytoin', row_number: '19', rack: 'Rack 1' },
    { name: 'Carbamazepine', row_number: '19', rack: 'Rack 2' },
    { name: 'Valproate', row_number: '19', rack: 'Rack 3' },
    { name: 'Lamotrigine', row_number: '19', rack: 'Rack 4' },
    { name: 'Levetiracetam', row_number: '19', rack: 'Rack 5' },

    // Row 20: Antipsychotics
    { name: 'Risperidone', row_number: '20', rack: 'Rack 1' },
    { name: 'Olanzapine', row_number: '20', rack: 'Rack 2' },
    { name: 'Quetiapine', row_number: '20', rack: 'Rack 3' },
    { name: 'Aripiprazole', row_number: '20', rack: 'Rack 4' },
    { name: 'Clozapine', row_number: '20', rack: 'Rack 5' },

    // Add more rows as needed...
];

// Function to display medicines in the table
function displayMedicines() {
    const tableBody = document.getElementById('medicineTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Map row numbers to descriptive names
    const rowNames = {
        '1': 'Headache Medicines',
        '2': 'Fever Medicines',
        '3': 'Allergy Medicines',
        '4': 'Cold and Flu Medicines',
        '5': 'Pain Relievers',
        '6': 'Antibiotics',
        '7': 'Antacids',
        '8': 'Antidepressants',
        '9': 'Antidiabetics',
        '10': 'Antihypertensives',
        '11': 'Antivirals',
        '12': 'Antifungals',
        '13': 'Antiemetics',
        '14': 'Anticoagulants',
        '15': 'Antihistamines',
        '16': 'Bronchodilators',
        '17': 'Corticosteroids',
        '18': 'Diuretics',
        '19': 'Anticonvulsants',
        '20': 'Antipsychotics',
        '21': 'Antiemetics',
        '22': 'Antifungals',
        '23': 'Antivirals',
        '24': 'Anticoagulants',
        '25': 'Antihistamines',
        '26': 'Bronchodilators',
        '27': 'Corticosteroids',
        '28': 'Diuretics',
        '29': 'Anticonvulsants',
        '30': 'Antipsychotics',
        '31': 'Antiemetics',
        '32': 'Antifungals',
        '33': 'Antivirals',
        '34': 'Anticoagulants',
        '35': 'Antihistamines',
        '36': 'Bronchodilators',
        '37': 'Corticosteroids',
        '38': 'Diuretics',
        '39': 'Anticonvulsants',
        '40': 'Antipsychotics'
    };

    // Group medicines by row_number
    const rows = {};
    medicines.forEach(medicine => {
        if (!rows[medicine.row_number]) {
            rows[medicine.row_number] = Array(5).fill('-'); // Initialize 5 racks per row
        }
        const rackNumber = parseInt(medicine.rack.split(' ')[1]) - 1; // Convert "Rack X" to index
        rows[medicine.row_number][rackNumber] = medicine.name;
    });

    // Populate the table
    for (const [row, racks] of Object.entries(rows)) {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${rowNames[row] || `Row ${row}`}</td>
            <td>${racks[0]}</td>
            <td>${racks[1]}</td>
            <td>${racks[2]}</td>
            <td>${racks[3]}</td>
            <td>${racks[4]}</td>
        `;
        tableBody.appendChild(tableRow);
    }
}

// Call the function when the page loads
displayMedicines();

function showSuggestions(suggestions) {
    const suggestionsDiv = document.getElementById('suggestions');
    if (suggestions.length > 0) {
        suggestionsDiv.innerHTML = suggestions.map(suggestion => `
            <div>${suggestion}</div>
        `).join('');
        suggestionsDiv.style.display = 'block'; // Show suggestions
    } 
    
}

function displayResult(medicine, row, rack) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <strong>Medicine:</strong> ${medicine}, <strong>Row:</strong> ${row}, <strong>Rack:</strong> ${rack}
    `;
}