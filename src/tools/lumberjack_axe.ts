import {
    system,
    world,
} from "@minecraft/server";
import { doVienMine } from "../utils";
import { Blocks } from "../mcQuery/blocks";

world.beforeEvents.playerBreakBlock.subscribe(
    ({ block, dimension, itemStack }) => {
        if (!itemStack) return;
        if (itemStack?.typeId !== "haste:lumberjack_axe") return;
        if (Blocks.isLog(block)) {
            const blockType = block.type;
            system.run(() =>
                doVienMine(blockType, block, itemStack, dimension, 200, true)
            );
        }
    }
);
