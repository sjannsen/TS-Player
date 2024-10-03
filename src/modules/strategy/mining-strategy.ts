import { AxiosError, isAxiosError } from 'axios'
import { ResourceType } from '../../shared/types'
import logger from '../../utils/logger'
import planetService from '../map/domain/use-cases'
import { mineResources } from '../robot/adapters/output/commands'
import { RobotData } from '../robot/domain/models/robot'
import bankAccountService from '../trading/bank-account/domain/use-cases'
import itemService from '../trading/item/domain/use-cases'
import { buyUpgrade } from '../trading/upgrade/output/commands/buyUpgrade'

function mapResourceToMiningLevel(resource: ResourceType): number {
    switch (resource) {
        case 'COAL': return 1
        case 'IRON': return 2
        case 'GEM': return 3
        case 'GOLD': return 4
        case 'PLATIN': return 5
    }
}

const miningLevels: {[key: number]: string} = {
    1: 'MINING_1',
    2: 'MINING_2',
    3: 'MINING_3',
    4: 'MINING_4',
    5: 'MINING_5'
}

export default async function getMiningStrategy({ robot }: { robot: RobotData }): Promise<boolean> {
    const planet = await planetService.getPlanet({ mapServiceId: robot.currentPlanet })
    const planetResource = planet?.resource
    const planetResourceType = planet?.resource?.resourceType

    if (!planet) throw new Error(`Planet of robot with ID ${robot.id} is not found`)
    if (!planetResource) return false
    if (planetResource.currentAmount == 0) return false

    if (planetResourceType) {
        const resourceLevel = mapResourceToMiningLevel(planetResourceType ?? 'PLATIN')
        const currentMiningLevel = robot.levels.miningLevel
        const isMiningLevelTooLow = currentMiningLevel < resourceLevel

        if (isMiningLevelTooLow) {
            const nextMiningUpgrade = miningLevels[currentMiningLevel + 1]
            const { price: upgradePrice } = await itemService.findByName({ name: nextMiningUpgrade }) ?? {}
            const currentBalance = bankAccountService.getBalance()

            const PRICE_UNDEFINED_MESSAGE = `Can not upgrade mining level of 🤖: ${robot.robotServiceId}. No price could be found for the upgrade: ${nextMiningUpgrade}`
            if (!upgradePrice) throw new Error(PRICE_UNDEFINED_MESSAGE)

            if (currentBalance < upgradePrice) {
                const BALANCE_TOO_LOW_MESSAGE = `Can not buy upgrade: ${nextMiningUpgrade} for robot: ${robot.robotServiceId} 💰🙄, the current balance is too low: ${currentBalance} < ${upgradePrice}`

                logger.warn(BALANCE_TOO_LOW_MESSAGE)
                return false
            }

            try {
                await buyUpgrade({ robotId: robot.robotServiceId, planetId: robot.currentPlanet, itemName: nextMiningUpgrade, itemQuantity: 1})
            } catch (error) {
                if (isAxiosError(error)) error as AxiosError
                logger.error({error}, 'Error while buying upgrade')
                throw error
            }

            return false
        }
    }

    mineResources({ robotId: robot.robotServiceId })
    return true
}
