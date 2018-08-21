app.controller("dashboardController", dashboardController);

dashboardController.$inject = ["dashboardService"];

function dashboardController(dashboardService) {

    var dc = this;

    dc.totalAnimales = dashboardService.totalAnimales;
    dc.totalAnimalesAdoptados = dashboardService.totalAnimales;

    function animalCount() {
        dc.totalAnimales = dashboardService.totalAnimales;
        if (dc.totalAnimales == 0) {
            dashboardService.getAnimalCount()
                .then(function (response) {
                    dashboardService.totalAnimales = response.data.length;
                    dc.totalAnimales = dashboardService.totalAnimales;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }

    function groupIndicators(list) {

    }

    animalCount();

    dc.labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"];
    dc.series = ['Gatos', 'Perros'];
    dc.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    dc.onClick = function (points, evt) {
        console.log(points, evt);
    };
    dc.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    dc.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }
            ]
        }
    };
}
