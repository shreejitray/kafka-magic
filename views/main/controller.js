const {remote,ipcRenderer} = require('electron');

angular.module('app',[]).controller('cntlr',controller);

function controller($scope) {
    $scope.host='invitekafka.stg.tesmdm.prod.walmart.com'
    $scope.port='9092'

    $scope.fetchDetail = function(){
        config = {
            host:$scope.host,
            port:$scope.port,
            topic:$scope.topic
        }

        response = ipcRenderer.sendSync('fetchClusterDetails', config)
        if(response!=null && response.err == undefined){
            detail = response.details
            $scope.consumers = detail.consumers
            $scope.topics = detail.topics
            $scope.showConsumer=true
            $scope.selectedConsumer = 0
            $scope.selectedTopic = 0
        }
    }

    $scope.selectConsumer = function(index){
        $scope.showConsumer = true
        $scope.selectedConsumer = index
    }
    $scope.selectTopic = function(index){
        $scope.selectedTopic = index
    }
    $scope.removeConsumer = function(){
        $scope.showConsumer = false
    }

    $scope.fetchMoreDetails = function(){
        config = {
            host:$scope.host,
            port:$scope.port,
            topic:$scope.topic
        }
        config.topic = $scope.topics[$scope.selectedTopic]
        if($scope.showConsumer){
            config.group = $scope.consumers[$scope.selectedConsumer]
            response = ipcRenderer.sendSync('consumerDetails',config)
            if(response!= undefined && response.err == undefined){
                $scope.showMoreDetails=true
                $scope.offsets = response
            }
        }else{
            response = ipcRenderer.sendSync('topicDetails',config)
        }
        response = ipcRenderer.sendSync('fetchClusterDetails', config)
    }


}