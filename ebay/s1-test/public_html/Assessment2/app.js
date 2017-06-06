var app = angular.module('myApp', ['nvd3']).config(function ($provide) {
    return $provide.decorator('$rootScope', function ($delegate) {
        $delegate.safeApply = function (func) {
            var currentPhase = $delegate.$$phase;
            if (currentPhase === "$apply" ||
                    currentPhase === "$digest") {
                if (typeof func === 'function') {
                    func();
                }
            } else {
                $delegate.$apply(func);
            }
        };
        return $delegate;
    });
}).controller('MainCtrl', function ($scope, $http) {
    $scope.optionsCurve = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function (d) {
                return d.x;
            },
            y: function (d) {
                return d.y;
            },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function (e) {
                    console.log("stateChange");
                },
                changeState: function (e) {
                    console.log("changeState");
                },
                tooltipShow: function (e) {
                    console.log("tooltipShow");
                },
                tooltipHide: function (e) {
                    console.log("tooltipHide");
                }
            },
            xAxis: {
                axisLabel: 'Time (seconds)'
            },
            yAxis: {
                axisLabel: 'Usage (%)',
                tickFormat: function (d) {
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: -10
            },
            callback: function (chart) {
                console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'CPU/Memory time based chart.'
        },
    };


    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 180,
            margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function (d) {
                return d.x;
            },
            y: function (d) {
                return d.y;
            },
            useInteractiveGuideline: true,
            duration: 500,
            yAxis: {
                tickFormat: function (d) {
                    return d3.format('.01f')(d);
                }
            }
        }
    };

    $scope.options1 = angular.copy($scope.optionsCurve);
    $scope.options1.chart.duration = 0;
    $scope.options1.chart.yDomain = [0, 100];

    $scope.data = [{values: [], key: 'CPU'}, {values: [], key: 'MEMORY', disabled: true}];

    setInterval(function () {
        $http({
            method: 'GET',
            url: 'http://localhost/dashboard/statistics.php'
        }).then(function successCallback(response) {
            if (response.data.cpu) {
                $scope.data[0].values.push({
                    x: response.data.cpu.time,
                    y: response.data.cpu.usage
                });
                if ($scope.data[0].values.length > 20) {
                    $scope.data[0].values.shift();
                }
            }

            if (response.data.memory) {
                $scope.data[1].values.push({
                    x: response.data.memory.time,
                    y: response.data.memory.usage
                });

                if ($scope.data[1].values.length > 20) {
                    $scope.data[1].values.shift();
                }
            }
            $scope.safeApply();
        }, function errorCallback(response) {
            console.log("Error", response);
        });
    }, 1000);
});
