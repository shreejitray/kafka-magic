const kafka = require('kafka-node')

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
                if(err){
                    client = null
                    producer = null
                    reject({Error:err})
                }else {
                    client = null
                    producer = null
                    console.log('message sent')
                    console.log(data)
                    resolve({message: "Message sent successfully"})
                }
            });
        });


        producer.on('error', function (err) {
            client = null
            producer = null
            console.log('error sending message');
            console.log(err)
            reject({err:"Message not sent"})
        })
    })
}

function clusterDetail(config){
    return new Promise((resolve, reject) => {
        client = new kafka.KafkaClient({kafkaHost: `${config.host}:${config.port}`})
        consumerGroups =[]

        admin = new kafka.Admin(client)

        admin.listGroups((err, groups) => {
            if(err){
                client = null
                admin = null
                reject({Error:err})
            }else{
                groupNames = [];
                for( key in groups) {
                    groupNames.push(key)
                }
                consumerGroups = groupNames
                admin.listTopics((err, topicData) =>{
                    if(err){
                        client = null
                        admin = null
                        reject({Error:err})
                    }else{
                        client = null
                        admin = null
                        topics = []
                        for (key in topicData[1].metadata) {
                            if(key != '__consumer_offsets')
                            topics.push(key)
                        }
                        resolve({groups:consumerGroups, topics:topics})
                    }
                })
            }
        })
    })
}

function topicDetail(config){
    return new Promise((resolve, reject) => {
        client = new kafka.KafkaClient({kafkaHost: `${config.host}:${config.port}`})
        offset = new kafka.Offset(client)
        offset.fetchLatestOffsets([config.topic], (err, data) => {
            if(err){
                client = null
                offset = null
                reject({Error:err})
            }else{
                client = null
                offset = null
                offsets = processOffsets(data,config.topic)
                resolve({data:data,offsets:offsets})
            }
        })
    })
}

function consumerDetail(config){
    return new Promise((resolve, reject) => {
        topicDetail(config).then(topicOffsets => {
            client = new kafka.KafkaClient({kafkaHost: `${config.host}:${config.port}`})
            offset = new kafka.Offset(client)
            offset.fetchCommits(config.group,[{topic:config.topic}],(err,data)=>{
                if(err){
                    reject({Error:err})
                    client = null
                    offset = null
                }else{
                    client = null
                    offset=null
                    offsets = processOffsets(data,config.topic,topicOffsets.data)
                    resolve(offsets)

                }
            })
        }, err => {
            reject(err)
        })
    })
}

function processOffsets(data,topic,baseData){
    offsets=[]
    detail = data[topic]
    baseDetail = {}
    if(baseData != undefined){
        baseDetail = baseData[topic]
    }
    for( partition in detail) {
        if (detail[partition] != -1) {
            shard = {
                partition: partition,
                offset: detail[partition]
            }
            if (baseDetail[partition] != undefined) {
                shard.lag = baseDetail[partition] - shard.offset
            }
            offsets.push(shard)
        }
        return offsets
    }
}

module.exports = {
    topicDetail,
    clusterDetail,
    consumerDetail,
    sendMessage
}


