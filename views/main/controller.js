const {remote,ipcRenderer} = require('electron');
const ipcMain = remote.ipcMain

angular.module('app',[]).controller('cntlr',controller);

function controller($scope) {
    $scope.host='invitekafka.stg.tesmdm.prod.walmart.com:9092'

    $scope.fetchDetail = function(){
        config = {
            host:$scope.host,
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
            topic:$scope.topic
        }
        config.topic = $scope.topics[$scope.selectedTopic]
        if($scope.showConsumer){
            config.group = $scope.consumers[$scope.selectedConsumer]
            response = ipcRenderer.sendSync('consumerDetails',config)
            if(response!= undefined && response.err == undefined){
                $scope.showMoreTopicDetails=false
                $scope.showMoreConsumerDetails=true
                $scope.offsets = response
            }
        }else{
            response = ipcRenderer.sendSync('topicDetails',config)
            if(response!= undefined && response.err == undefined){
                $scope.showMoreTopicDetails=true
                $scope.showMoreConsumerDetails=false
                $scope.offsets = response
            }
        }
        response = ipcRenderer.sendSync('fetchClusterDetails', config)
    }

    $scope.sendMessage = function(){
        currentWindow = remote.getCurrentWindow();
        sendWindow = new remote.BrowserWindow(
            {
                width:400,
                height:400,
                parent:currentWindow
            }
        )
        sendWindow.loadFile('views/publish/main.html')

        sendWindow.on('closed',function(){
            sendWindow=null
        })
    }
    ipcMain.on('fetchConfig',(event,arg)=>{
        config={
            host:$scope.host,
            topic:$scope.topics[$scope.selectedTopic]
        }
        event.returnValue= config
    })

    // ipcMain.on('sendMessage',(event,config)=>{
    //     response = ipcRenderer.sendSync('sendMessage',config)
    //     event.returnValue= response
    // })
}