const amqp = require('amqplib/callback_api');

module.exports = {
    addToQueue: function (code) {
        return new Promise((resolve, reject) => {
            amqp.connect('amqp://ikjxfagn:BgDGP3UVp2x6hIbY1OusfL1r2IXWCJXp@stingray.rmq.cloudamqp.com/ikjxfagn', function (error0, connection) {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue('', {
                        exclusive: true
                    }, function (error2, q) {
                        if (error2) {
                            throw error2;
                        }
                        var correlationId = Math.random().toString() + Math.random().toString() + Math.random().toString();

                        console.log(' [x] Requesting scrape code=(%d)', code);

                        channel.consume(q.queue, function (msg) {
                            if (msg.properties.correlationId == correlationId) {
                                console.log(`ch= ${channel.ch} [.] Got recive data `);
                                const urls = msg.content.toString().split(",");
                                setTimeout(function () {
                                    connection.close();
                                    // process.exit(0) 
                                    resolve(urls);
                                }, 500);
                            }
                        }, {
                            noAck: true
                        });

                        channel.sendToQueue('rpc_queue',
                            Buffer.from(code.toString()), {
                            correlationId: correlationId,
                            replyTo: q.queue
                        });
                    });
                });
            });

        });
    }
}