import { RobotData } from "../../robot/domain/models/robot";
import { buyUpgrade } from "../../trading/upgrade/output/commands/buyUpgrade";
import makeBuyMiningLevelUpgrade from "./buy-mining-leve-upgrade";

const buyMiningLevelUpgrade = ({ robot }: { robot: RobotData}) => makeBuyMiningLevelUpgrade({ robot, buyUpgrade: buyUpgrade })

export { buyMiningLevelUpgrade }
