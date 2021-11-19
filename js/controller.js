var app = angular.module("mainApp", ['ui.bootstrap']);
app.controller("travelData", function($scope, $http) {
    $http.get("https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c")
        .success(function(response) {
            $scope.info = response.data.XML_Head.Infos.Info;
            $scope.filteredSelectZoneData = $scope.info;
            var dataLen = $scope.info.length;
            placeObjects = {};
            for (var i = 0; i < dataLen; i++) {
                if (!($scope.info[i].Zipcode in placeObjects)) { //如果這個zipcode沒有在陣列裡，則新增一筆該地區的資料
                    var firstIndexOf = $scope.info[i].Add.indexOf($scope.info[i].Zipcode);
                    var lastIndexOf = $scope.info[i].Add.indexOf('區');
                    zone = $scope.info[i].Add.slice(firstIndexOf + $scope.info[i].Zipcode.length, lastIndexOf + 1);
                    placeObjects[$scope.info[i].Zipcode] = {
                        zipcode: $scope.info[i].Zipcode,
                        zone: zone,
                        info: [$scope.info[i]]
                    }
                } else { //如果zipcode已存在了，則在這個陣列的該位置放入其景點資料
                    placeObjects[$scope.info[i].Zipcode].info.push($scope.info[i]);
                }
            }
            $scope.contents = placeObjects;
            console.log(placeObjects);
        });

    $scope.updateData = function(selectZipcode) {
        for (var i in placeObjects) {
            if (i === selectZipcode) {
                $scope.selectZoneData = placeObjects[i].info;
                $scope.zone = placeObjects[i].zone;
                $scope.selectValue = placeObjects[i].zipcode; //按按鈕時同時更改下拉選單內的值
            }
        }
        $scope.itemsPerPage = 6; //每頁顯示6筆資料
        $scope.currentPage = 1; //點選換地區後回到該地區的第一頁資料
        $scope.totalItems = $scope.selectZoneData.length;
        $scope.$watch('currentPage + itemsPerPage', function() { //頁數改變後更動顯示資料的起始值
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;
            $scope.filteredSelectZoneData = $scope.selectZoneData.slice(begin, end);
        });
    }
});