const {remote,ipcRenderer} = require('electron');

angular.module('app',[]).controller('cntlr',controller);

function controller($scope) {

    config = ipcRenderer.sendSync('fetchConfig')
    $scope.host = config.host
    $scope.topic = config.topic

    $scope.sendMessage = function (){
        config.message = $scope.message
       response = ipcRenderer.sendSync('sendMessage',config)
        if(response != undefined && response.err == undefined){
            $scope.response ="Success"
            setTimeout(()=>{
                remote.getCurrentWindow().close();
            },3000);
        }else{
            $scope.response = "Error in sending message"
        }


    }
}