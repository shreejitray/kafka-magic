angular.module('app',[]).controller('cntlr',controller);

function controller($scope) {
    $scope.list1 = [
    ]

    $scope.list2=[]

    for ( i=0;i<100;i++){
        $scope.list1.push(i)
        $scope.list2.push(i)
    }

}