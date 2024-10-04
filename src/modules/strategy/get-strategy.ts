import { RobotData } from "../robot/domain/models/robot";
import getMiningStrategy from "./mining/mining-strategy";
import getMovementStrategy from "./movement/movement-strategy";
import getSellingStrategy from "./selling";

export default async function getStrategy({ robot }: { robot: RobotData }): Promise<void> {
    const sellingActionTaken = await getSellingStrategy({ robot })
    if (sellingActionTaken) return

    const miningActionTaken = await getMiningStrategy({ robot })
    if (miningActionTaken) return

    const movementActionTaken = await getMovementStrategy({ robot })
    if (movementActionTaken) return
}
