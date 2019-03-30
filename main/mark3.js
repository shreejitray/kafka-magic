const {app, BrowserWindow, ipcMain} = require('electron')
const kafkaUtility = require('./kafkaUtility')

let mainwindow

function startApplication(){
    mainwindow = new BrowserWindow(
        {
            width:800,
            height:800
        }
    )
    mainwindow.on('closed',function(){
        mainwindow=null
    })
    mainwindow.loadFile('views/main/main.html')
}

ipcMain.on('sendMessage',(event,config) =>{
    kafkaUtility.sendMessage(config).then(response => {
        event.returnValue = response
    }, response => {
        event.returnValue=response
    })

})

ipcMain.on('consumerDetails',(event,config) =>{
    kafkaUtility.consumerDetail(config).then(response => {
        event.returnValue = response
    }, response => {
        event.returnValue=response
    })

})
ipcMain.on('topicDetails',(event,config) =>{
    kafkaUtility.topicDetail(config).then(response => {
        event.returnValue = response.offsets
    }, response => {
        event.returnValue=response
    })

})

ipcMain.on('fetchClusterDetails', (event, config) => {
    kafkaUtility.clusterDetail(config).then(response => {
        details = {
            consumers:response.groups,
            topics: response.topics
        }

        event.returnValue = {details: details}
    }, response => {
        event.returnValue = response
    })
})
app.on('ready',startApplication)

process.on('uncaughtException', function (error) {
    console.log('error occured')
})
