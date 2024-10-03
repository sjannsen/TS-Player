import { sellResources } from "../../trading/inventory/adapters/output/commands/sellResources";
import inventoryService from "../../trading/inventory/domain/use-cases";
import makeGetSellingStrategy from "./selling-strategy";

const getSellingStrategy = makeGetSellingStrategy({ inventoryService, sellResources})

export default getSellingStrategy
