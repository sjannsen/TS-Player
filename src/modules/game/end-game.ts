import { closeConnectionToNeo4j } from '../../db/neo4j-connection'
import eventBus from '../../event-handling/event-bus'
import { EventContext } from '../../event-handling/events'

export default function setUpGameEndListener() {
  eventBus.subscribe('GameStatus', async ({ event }: EventContext<'GameStatus'>) => {
    if (event.payload.status === 'ended') {
      console.log('Game ended, shutting down service... 👌☕')
      await closeConnectionToNeo4j()
      process.exit(0)
    }
  })
}
