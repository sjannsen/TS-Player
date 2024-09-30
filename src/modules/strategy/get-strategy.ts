import { RobotData } from "../robot/domain/models/robot";
import getMiningStrategy from "./mining-strategy";
import getMovementStrategy from "./movement-strategy";

export default async function getStrategy({ robot }: { robot: RobotData }): Promise<void> {
    const miningActionTaken = await getMiningStrategy({ robot })
    if (miningActionTaken) return

    const movementActionTaken = await getMovementStrategy({ robot })
    if (movementActionTaken) return
}
