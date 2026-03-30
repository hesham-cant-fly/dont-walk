import { Player, system, world } from "@minecraft/server";
import defaultSpawn from "./defaultSpawn";
import { Vec3 as Vector } from "../mcQuery/math";

export enum SetHomeError {
	InvalidDimention,
};

export function set_home(source: Player) {
	if (source.dimension.id != "minecraft:overworld") {
		throw SetHomeError.InvalidDimention;
	}

	// source.setDynamicProperty("home_pos", toFString(source.location));
	source.setDynamicProperty("home_pos", source.location);
	source.setDynamicProperty("home_dimention", source.dimension.id);
	system.run(() => {
		source.playSound("beacon.activate");
	});
}

export function goto_home(source: Player) {
	system.run(() => {
		if (!source.getDynamicProperty("home_pos")) {
			try {
				const spawn = source.getSpawnPoint();
				source.teleport(
					new Vector(
						spawn?.x as number,
						spawn?.y as number,
						spawn?.z as number
					),
					{ dimension: world.getDimension("overworld") }
				);
			} catch (e) {
				defaultSpawn(source);
			}
			return;
		}
		source.teleport(source.getDynamicProperty("home_pos") as Vector, {
			dimension: world.getDimension(
				source.getDynamicProperty("home_dimention") as string
			),
		});
	});
}

export default function home(source: Player) {
    if (source.isSneaking) {
		try {
			set_home(source);
		} catch {
			source.sendMessage(
				`Recall Scroll only works in overworld dimention`
			);
			return;
		}
    } else {
		goto_home(source);
    }
}
