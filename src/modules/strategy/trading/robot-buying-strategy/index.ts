import { buyRobots } from "../../../robot/adapters/output/commands";
import robotService from "../../../robot/domain/use-cases";
import bankAccountService from "../../../trading/bank-account/domain/use-cases";
import itemService from "../../../trading/item/domain/use-cases";
import makeGetRobotBuyingStrategy from "./get-robot-buying-strategy";

const getRobotBuyingStrategy = makeGetRobotBuyingStrategy({ itemService, bankAccountService, robotService, buyRobots })

export default getRobotBuyingStrategy
