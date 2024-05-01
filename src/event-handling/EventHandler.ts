import ampqlib from 'amqplib'
import logger from '../utils/logger'
import { EventHeader } from './events'

const rabbitMQConfig = {
  protocol: 'amqp',
  hostname: '127.0.0.1',
  port: 5672,
  username: 'admin',
  password: 'admin',
}

export default async function setUpRabbitMQ(playerId: string, playerExchange: string) {
  logger.info({ playerId, playerExchange }, 'Setup RabbitMQ')

  const connection = await ampqlib.connect(rabbitMQConfig)

  connection.on('error', (error) => {
    logger.error(error, '[AMQP]: Error while connection to player queue')
  })

  connection.on('close', () => {
    logger.warn('[AMQP]: Connection closed. Reconnecting to player queue...')
    setUpRabbitMQ(playerId, playerExchange)
  })

  connection.on('connection', (stream) => {
    logger.info(stream, '[AMQP]: Connection established')
  })

  const channel = await connection.createChannel()
  const queue = `player-${playerId}-all`
  const exchange = playerExchange

  await channel.assertQueue(queue)
  await channel.bindQueue(queue, exchange, '#')

  channel.consume(queue, (message) => {
    if (message === null) {
      logger.warn('Could not consume message. Message is null. Consumer cancelled by server?')
      return
    }

    const headers = message.properties.headers
    if (!headers) {
      logger.warn(message, 'Headers are undefined')
      return
    }

    const entries = Object.entries(headers)
    const eventHeaders = entries.map(([key, value]) => ({ key, value: value.toString() }))

    const eventHeader: EventHeader = eventHeaders.reduce(
      (acc, { key, value }) => ({ ...acc, [key]: value }),
      {}
    ) as EventHeader

    const event = JSON.parse(message.content.toString())
    logger.info(eventHeader, 'Received Event')

    channel.ack(message)
  })
}
