// const kafka = require('kafka-node')
//
// client = new kafka.KafkaClient({kafkaHost:'192.168.1.10:9092'})
// admin = new kafka.Admin(client)
// offset = new kafka.Offset(client)
//
// display = function(err,data) {
//     if (err) {
//         console.log(JSON.stringify(err, null, 1))
//     } else {
//         console.log(JSON.stringify(data, null, 1))
//     }
// }
//
// // offset.fetch([{topic:'test'}],display)
//
// //offset.fetchLatestOffsets(['test'],display)
// offset.fetchCommits('test1',[{topic:'test_1'}],display)

kafkaUtility = require('../main/kafkaUtility')

config = {
    host:'invitekafka.stg.tesmdm.prod.walmart.com:9092',
    topic:'EIM.PC.PARTNER.INVITATION.OUT',
    group:'partner_invite_event',
    message:'something'
}

kafkaUtility.sendMessage(config).then((data)=>{
    console.log(JSON.stringify(data, null, 1))
},(err) => {
    console.log(JSON.stringify(err,null,1))
})

// kafkaUtility.topicDetail(config).then((data)=>{
//     console.log(JSON.stringify(data, null, 1))
// },(err) => {
//     console.log(JSON.stringify(err,null,1))
// })

