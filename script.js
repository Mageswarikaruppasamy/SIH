// Predefined Comprehensive Data
        const reportData = [
            {
                truckId: '2013081234',
                driverName: 'Nikumbh',
                loadDetails: '80% Load',
                capacityUtilization: 80,
                distanceTraveled: 2500,
                eta: '2024-10-01 14:00',
                destination: 'Jaipur',
                fuelConsumption: [50, 55, 60, 65, 70],
                emissions: 1500, // CO2 kg
                maintenanceStatus: 'Up to Date',
                geofencedStatus: 'Entered Ajmer, Exited Ahmedhabad',
                detoursTaken: '2 Detours',
                apiInteractions: 'Successful API calls: 10, Failed: 1',
                delayReasons: {
                    'Traffic': 5,
                    'Mechanical': 2,
                    'Weather': 1
                },
            },
            {
                truckId: 'truck2',
                driverName: 'Driver 2',
                loadDetails: '60% Load',
                capacityUtilization: 60,
                distanceTraveled: 300,
                eta: '2024-10-02 16:30',
                destination: 'City B',
                fuelConsumption: [40, 45, 50, 55, 60],
                emissions: 1200, // CO2 kg
                maintenanceStatus: 'Scheduled Maintenance',
                geofencedStatus: 'Entered Route 2, Exited Route 3',
                detoursTaken: '1 Detour',
                apiInteractions: 'Successful API calls: 8, Failed: 0',
                delayReasons: {
                    'Traffic': 3,
                    'Mechanical': 1,
                    'Weather': 0
                },
                location: [19.0760, 72.8777] // Mumbai Coordinates
            },
            {
                truckId: 'truck3',
                driverName: 'Driver 3',
                loadDetails: '90% Load',
                capacityUtilization: 90,
                distanceTraveled: 700,
                eta: '2024-10-03 18:45',
                destination: 'City C',
                fuelConsumption: [70, 75, 80, 85, 90],
                emissions: 2000, // CO2 kg
                maintenanceStatus: 'Overdue Maintenance',
                geofencedStatus: 'Entered Route 3, Exited Route 1',
                detoursTaken: '3 Detours',
                apiInteractions: 'Successful API calls: 12, Failed: 2',
                delayReasons: {
                    'Traffic': 6,
                    'Mechanical': 3,
                    'Weather': 2
                },
                location: [12.9716, 77.5946] // Bangalore Coordinates
            }
            // Add more truck data as needed
        ];

        // Initialize Charts
        let fuelChart;
        let delayChart;
        let capacityUtilChart;

        // Function to generate the report based on selected filters
        function generateReport() {
            // Get filter values
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            const selectedTruck = document.getElementById('truckSelect').value;
            const selectedDriver = document.getElementById('driverSelect').value;
            const selectedRoute = document.getElementById('routeSelect').value;

            // Filter data based on selections
            let filteredData = reportData;

            if (selectedTruck !== 'all') {
                filteredData = filteredData.filter(data => data.truckId === selectedTruck);
            }

            if (selectedDriver !== 'all') {
                filteredData = filteredData.filter(data => data.driverName === selectedDriver);
            }

            if (selectedRoute !== 'all') {
                // Assuming route information is part of the data; if not, adjust accordingly
                // For demonstration, we'll simulate route filtering based on geofencedStatus
                filteredData = filteredData.filter(data => data.geofencedStatus.includes(selectedRoute));
            }

            // Update Report Details
            if (filteredData.length === 1) {
                const data = filteredData[0];
                document.getElementById('reportTruckID').innerText = data.truckId;
                document.getElementById('reportDriverName').innerText = data.driverName;
                document.getElementById('reportLoadDetails').innerText = data.loadDetails;
                document.getElementById('reportDistance').innerText = data.distanceTraveled;
                document.getElementById('reportETA').innerText = data.eta;
                document.getElementById('reportDestination').innerText = data.destination;
                document.getElementById('reportFuelConsumption').innerText = data.fuelConsumption.join(', ') + ' L';
                document.getElementById('reportEmissions').innerText = data.emissions + ' kg CO2';
                document.getElementById('reportMaintenance').innerText = data.maintenanceStatus;
                document.getElementById('reportGeofences').innerText = data.geofencedStatus;
                document.getElementById('reportDetours').innerText = data.detoursTaken;
                document.getElementById('reportAPIInteractions').innerText = data.apiInteractions;
            } else if (filteredData.length > 1) {
                // Aggregate data for multiple trucks
                document.getElementById('reportTruckID').innerText = `${filteredData.length} Trucks`;
                document.getElementById('reportDriverName').innerText = 'Multiple Drivers';
                document.getElementById('reportLoadDetails').innerText = 'Various Loads';
                document.getElementById('reportDistance').innerText = filteredData.reduce((acc, curr) => acc + curr.distanceTraveled, 0);
                document.getElementById('reportETA').innerText = 'Multiple ETAs';
                document.getElementById('reportDestination').innerText = 'Various Destinations';
                document.getElementById('reportFuelConsumption').innerText = 'Various';
                document.getElementById('reportEmissions').innerText = `${filteredData.reduce((acc, curr) => acc + curr.emissions, 0)} kg CO2`;
                document.getElementById('reportMaintenance').innerText = 'Various';
                document.getElementById('reportGeofences').innerText = 'Various';
                document.getElementById('reportDetours').innerText = 'Various';
                document.getElementById('reportAPIInteractions').innerText = 'Various';
            } else {
                // No data found
                document.getElementById('reportTruckID').innerText = '-';
                document.getElementById('reportDriverName').innerText = '-';
                document.getElementById('reportLoadDetails').innerText = '-';
                document.getElementById('reportDistance').innerText = '-';
                document.getElementById('reportETA').innerText = '-';
                document.getElementById('reportDestination').innerText = '-';
                document.getElementById('reportFuelConsumption').innerText = '-';
                document.getElementById('reportEmissions').innerText = '-';
                document.getElementById('reportMaintenance').innerText = '-';
                document.getElementById('reportGeofences').innerText = '-';
                document.getElementById('reportDetours').innerText = '-';
                document.getElementById('reportAPIInteractions').innerText = '-';
            }

            // Update Charts
            updateFuelChart(filteredData);
            updateDelayChart(filteredData);
            updateCapacityUtilChart(filteredData);

        }

        // Function to update Fuel Consumption Chart
        function updateFuelChart(data) {
            // Aggregate fuel consumption data
            let labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
            let fuelData = [];

            if (data.length === 1) {
                fuelData = data[0].fuelConsumption;
            } else if (data.length > 1) {
                // Calculate average fuel consumption per day
                let sum = [0, 0, 0, 0, 0];
                data.forEach(truck => {
                    truck.fuelConsumption.forEach((val, idx) => {
                        sum[idx] += val;
                    });
                });
                fuelData = sum.map(val => (val / data.length).toFixed(2));
            } else {
                fuelData = [0, 0, 0, 0, 0];
            }

            // Destroy existing chart if exists
            if (fuelChart) fuelChart.destroy();

            const ctx = document.getElementById('fuelConsumptionChart').getContext('2d');
            fuelChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Fuel Consumption (Liters)',
                        data: fuelData,
                        backgroundColor: 'rgba(231,76,60,0.2)',
                        borderColor: 'rgba(231,76,60,1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Fuel Consumption Over Time'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Function to update Delay Reasons Chart
        function updateDelayChart(data) {
            // Aggregate delay reasons
            let delayCounts = {};
            data.forEach(truck => {
                for (let reason in truck.delayReasons) {
                    if (delayCounts[reason]) {
                        delayCounts[reason] += truck.delayReasons[reason];
                    } else {
                        delayCounts[reason] = truck.delayReasons[reason];
                    }
                }
            });

            let labels = Object.keys(delayCounts);
            let counts = Object.values(delayCounts);

            // Destroy existing chart if exists
            if (delayChart) delayChart.destroy();

            const ctx = document.getElementById('delayReasonsChart').getContext('2d');
            delayChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Delay Reasons',
                        data: counts,
                        backgroundColor: [
                            '#e74c3c',
                            '#f1c40f',
                            '#3498db',
                            '#9b59b6',
                            '#2ecc71'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribution of Delay Reasons'
                        }
                    }
                }
            });
        }

        // Function to update Capacity Utilization Chart
        function updateCapacityUtilChart(data) {
            // Aggregate capacity utilization
            let labels = ['Capacity Utilization'];
            let capacityData = [0];

            if (data.length === 1) {
                capacityData = [data[0].capacityUtilization];
            } else if (data.length > 1) {
                capacityData = [(data.reduce((acc, curr) => acc + curr.capacityUtilization, 0) / data.length).toFixed(2)];
            } else {
                capacityData = [0];
            }

            // Destroy existing chart if exists
            if (capacityUtilChart) capacityUtilChart.destroy();

            const ctx = document.getElementById('capacityUtilChart').getContext('2d');
            capacityUtilChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Used', 'Available'],
                    datasets: [{
                        label: 'Capacity Utilization',
                        data: [capacityData[0], 100 - capacityData[0]],
                        backgroundColor: [
                            '#2ecc71',
                            '#bdc3c7'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Capacity Utilization'
                        }
                    }
                }
            });
        }



        // Function to download the report as PDF
        function downloadPDF() {
            const report = document.getElementById('report');
            const opt = {
                margin:       0.5,
                filename:     'RTN_MIS_Report.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().from(report).set(opt).save();
        }

        // Event Listeners
        document.getElementById('generateReportBtn').addEventListener('click', generateReport);
        document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);