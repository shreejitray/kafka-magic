var kafka = require('kafka-node')

Producer = kafka.Producer
KeyedMessage = kafka.KeyedMessage
client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'})

producer = new Producer(client)

payloads = [
    {
        topic: 'test',messages:'message from node'
    }
]

producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        console.log('message sent')
        console.log(data)
        process.exit()
    });
});


producer.on('error', function (err) {
    console.log('error sending message');
    console.log(err)
})
