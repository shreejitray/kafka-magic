const {app, BrowserWindow, ipcMain} = require('electron')
const kafka = require('kafka-node')

let Producer = kafka.Producer
let KeyedMessage = kafka.KeyedMessage

let mainwindow

function startApplication(){
    mainwindow = new BrowserWindow(
        {
            width:800,
            height:800,

        }
    )
    mainwindow.on('closed',function(){
        mainwindow=null
    })
    mainwindow.loadFile('views/main.html')
}

ipcMain.on('sendMessage',(event,config) =>{
    sendMessage(config).then(response => {
        event.returnValue = response
    }, response => {
        event.returnValue=response
    })

})

function sendMessage(config){
    return new Promise((resolve, reject)=>{
        client = new kafka.KafkaClient({kafkaHost: `${config.host}:${config.port}`})
        let producer = new Producer(client)
        payloads = [
            {
                topic: config.topic ,messages:config.message
            }
        ]
        producer.on('ready', function () {
            producer.send(payloads, function (err, data) {
                console.log('message sent')
                console.log(data)
                resolve({message:"Message sent successfully"})
            });
        });


        producer.on('error', function (err) {
            console.log('error sending message');
            console.log(err)
            reject({err:"Message not sent"})
        })
    })
}
app.on('ready',startApplication)
