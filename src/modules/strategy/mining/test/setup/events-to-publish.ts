import eventBus from '../../../../../event-handling/event-bus'
import { bankAccountInitializedEventContext, tradablePricesEventContext } from './trading-setup.events'
import { roundStatusEventContext2, roundStatusEventContext3 } from './game-setup-events'
import {
  planetDiscoveredEventContext1,
  planetDiscoveredEventContext2,
  planetDiscoveredEventContext3,
  planetDiscoveredEventContext4,
} from './planet-setup-events'
import {
  robotSpawnedEventContext1,
  robotSpawnedEventContext2,
  robotSpawnedEventContext3,
} from './robot-setup-spawn-events'

export const events = [
  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('Initialized BankAccount')
      eventBus.publish('BankAccountInitialized', bankAccountInitializedEventContext)
      resolve()
    }, 150)
  ),

  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('TradablePrices')
      eventBus.publish('TradablePrices', tradablePricesEventContext)
      resolve()
    }, 250)
  ),

  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('Event1')
      eventBus.publish('PlanetDiscovered', planetDiscoveredEventContext1)
      resolve()
    }, 500)
  ),

  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('Event2')
      eventBus.publish('PlanetDiscovered', planetDiscoveredEventContext2)
      resolve()
    }, 1000)
  ),

  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('Event3')
      eventBus.publish('PlanetDiscovered', planetDiscoveredEventContext3)
      resolve()
    }, 2000)
  ),

  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('Event4')
      eventBus.publish('PlanetDiscovered', planetDiscoveredEventContext4)
      resolve()
    }, 2500)
  ),

  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('RobotSpawned 1')
      eventBus.publish('RobotSpawned', robotSpawnedEventContext1)
      resolve()
    }, 3000)
  ),

  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('RobotSpawned 2')
      eventBus.publish('RobotSpawned', robotSpawnedEventContext2)
      resolve()
    }, 3500)
  ),

  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('RobotSpawned 3')
      eventBus.publish('RobotSpawned', robotSpawnedEventContext3)
      resolve()
    }, 4000)
  ),

  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('Round 2')
      eventBus.publish('RoundStatus', roundStatusEventContext2)
      resolve()
    }, 6000)
  ),

  new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('Round 3')
      eventBus.publish('RoundStatus', roundStatusEventContext3)
      resolve()
    }, 2000)
  ),
]
