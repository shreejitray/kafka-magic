const {remote,ipcRenderer} = require('electron');

angular.module('app',[]).controller('cntlr',controller);

function controller($scope) {
    $scope.sendMessage = function (){
        $scope.response="processing"
        config = {
            host:$scope.hostname,
            port:$scope.port,
            topic:$scope.topic,
            message:$scope.message
        }
       response = ipcRenderer.sendSync('sendMessage',config)
        if(response != undefined && response.err == undefined){
            $scope.response ="Success"
        }else{
            $scope.response = "Error in sending message"
        }
        // ipcRenderer.on('response',(event,response)=>{
        //     if(response!= undefined && response.err == undefined){
        //         console.log(`message response received ${response}`)
        //         $scope.response1="success"
        //     }else{
        //         $scope.response1="error"
        //     }
        // })


    }
}