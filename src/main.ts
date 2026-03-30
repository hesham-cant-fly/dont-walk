import { world, Entity, system, CommandPermissionLevel, Player, EntityComponentTypes, Vector3 } from "@minecraft/server";
import defaultSpawn from "./scrolls_method/defaultSpawn";
import lastDeath from "./scrolls_method/lastDeath";

import "./transfer";
import "./lodestone";
import "./tools/lumberjack_axe";
import { PaperOfEnding } from "./scrolls/paper_of_ending";
import { PaperOfSuffering } from "./scrolls/paper_of_suffering";
import { RecallPaper } from "./scrolls/recall_paper";
import { DimentionalPhone } from "./scrolls/dimensional_phone";
import * as Compass from "./compass/index";
import { MinecraftEntityTypes, MinecraftItemTypes } from "@minecraft/vanilla-data";
import { goto_home, set_home } from "./scrolls_method/home";
// import { Vec3 } from "./mcQuery/math";

system.beforeEvents.startup.subscribe((ev) => {
	ev.itemComponentRegistry.registerCustomComponent("haste:paper_of_ending", new PaperOfEnding());
	ev.itemComponentRegistry.registerCustomComponent("haste:paper_of_suffering", new PaperOfSuffering());
	ev.itemComponentRegistry.registerCustomComponent("haste:recall_paper", new RecallPaper());
	ev.itemComponentRegistry.registerCustomComponent("haste:dimensional_phone", new DimentionalPhone());

	Compass.regesterAll(ev);

	ev.customCommandRegistry.registerCommand({
		name: "haste:sethome",
		description: "Set Home",
		permissionLevel: CommandPermissionLevel.Any,
		cheatsRequired: false,
	}, (origin) => {
		set_home(origin.sourceEntity as Player);
		return undefined;
	});

	ev.customCommandRegistry.registerCommand({
		name: "haste:home",
		description: "Set Home",
		permissionLevel: CommandPermissionLevel.Any,
		cheatsRequired: false,
	}, (origin) => {
		goto_home(origin.sourceEntity as Player);
		return undefined;
	});
});

// const PARRY_TICKS = 5;
// function set_parry_ticks(player: Player): void
// {
// 	player.setDynamicProperty("parry_tick", PARRY_TICKS);
// 	// TODO: Parry cooldown
// }

// system.runInterval(() => {
// 	const players = world.getAllPlayers();
// 	for (const player of players) {
// 		// Update parry tick
// 		const parry = player.getDynamicProperty("parry_tick") as number | undefined;
// 		if (!parry) {
// 			player.setDynamicProperty("parry_tick", 0);
// 			continue;
// 		}
// 		if (parry == 0) continue;
// 		player.setDynamicProperty("parry_tick", parry - 1);

// 		// Do parry
// 		const view_direction = player.getViewDirection();
// 		const entities = player.getEntitiesFromViewDirection({
// 			ignoreBlockCollision: false,
// 			maxDistance: 2,
// 		});
// 		for (const entity_ray of entities) {
// 			const entity = entity_ray.entity;
// 			const projectile = entity.getComponent(EntityComponentTypes.Projectile);
// 			if (!projectile) continue;

// 			const velocity = Vec3
// 				.fromVector3(view_direction)
// 				.norm()
// 				.scale(Vec3.fromVector3(entity.getVelocity()).length)
// 				.scale(1.2);

// 			projectile.owner = player;
// 			projectile.shoot(velocity);

// 			player.sendMessage("PARRY!");
// 		}
// 	}
// }, 1);

// world.afterEvents.entityHurt.subscribe((ev) => {
// 	const player = ev.hurtEntity as Player;
// 	if (player.typeId !== MinecraftEntityTypes.Player) {
// 		return;
// 	}

// 	const parry_tick = player.getDynamicProperty("parry_tick") as number | undefined;
// 	if (!parry_tick || parry_tick == 0) {
// 		return;
// 	}

// 	if (ev.damageSource.damagingEntity) {
// 		player.sendMessage("PARRY!");
// 		ev.damageSource.damagingEntity.applyDamage(ev.damage + 2);
// 		const h = player.getComponent(EntityComponentTypes.Health);
// 		if (!h) return;
// 		h.setCurrentValue(h.currentValue + ev.damage);
// 		return;
// 	}
// 	if (ev.damageSource.damagingProjectile) {
// 		console.info("Unimplemented!");
// 		return;
// 	}
// });

// world.afterEvents.itemUse.subscribe(({ itemStack: item, source }) => {
// 	if (item.typeId !== MinecraftItemTypes.Stick) return;
// 	if (source.typeId !== MinecraftEntityTypes.Player) return;

// 	const player = source as Player;
// 	set_parry_ticks(player);
// });

world.beforeEvents.itemUse.subscribe(({ itemStack: item, source }) => {
	if (item.typeId !== MinecraftItemTypes.Mace) return;
	const { dimension, location } = source;
	const speed = 2;
	const viewDirection = source.getViewDirection();
	const velocity: Vector3 = {
		x: viewDirection.x * speed,
		y: viewDirection.y * speed,
		z: viewDirection.z * speed,
	};
	const spawnLocation: Vector3 = {
		x: location.x + viewDirection.x * 0.5,
		y: location.y + source.getHeadLocation().y - location.y,
		z: location.z + viewDirection.z * 0.5,
	};
	system.run(() => {
		const wind_charge = dimension.spawnEntity(
			MinecraftEntityTypes.WindChargeProjectile,
			spawnLocation,
		);
		const component = wind_charge.getComponent(EntityComponentTypes.Projectile);
		if (!component) throw new Error("Couldn't find projectile component.");
		component.owner = source as Entity;
		component.shoot(velocity, {uncertainty: 0});
	});
});

world.beforeEvents.itemUse.subscribe(({ itemStack: item, source }) => {
	if (item.typeId !== "haste:snipearl") return;
	const { dimension, location } = source;
	const speed = 100;
	const viewDirection = source.getViewDirection();
	const velocity: Vector3 = {
		x: viewDirection.x * speed,
		y: viewDirection.y * speed,
		z: viewDirection.z * speed,
	};
	const spawnLocation: Vector3 = {
		x: location.x + viewDirection.x * 0.5,
		y: location.y + source.getHeadLocation().y - location.y, // Spawn at eye level
		z: location.z + viewDirection.z * 0.5,
	};

	system.run(() => {
		const ender_perl = dimension.spawnEntity(
			"haste:snipearl_projectile",
			spawnLocation,
		);
		const component = ender_perl.getComponent(EntityComponentTypes.Projectile);
		if (!component) throw new Error("Couldn't find projectile component.");
		component.gravity = 0;
		component.owner = source as Entity;
		component.shoot(velocity, {uncertainty: 0});
	});
});

// Prevents Creeper from breaking blocks
world.beforeEvents.explosion.subscribe((ev) => {
	if (ev.source?.typeId === "minecraft:creeper") {
		ev.setImpactedBlocks([]);
	}
});

world.afterEvents.entityDie.subscribe((ev) => {
	const entity: Entity = ev.deadEntity;

	if (entity.typeId !== "minecraft:player") return;
	entity.setDynamicProperty("death_dimention", entity.dimension.id);
	entity.setDynamicProperty("death_pos", entity.location);
});

world.afterEvents.itemCompleteUse.subscribe((ev) => {
	if (ev.itemStack.typeId !== "minecraft:goat_horn") return;
	ev.source.addEffect("bad_omen", 9999999, {
		showParticles: false,
		amplifier: 3,
	});
});

world.afterEvents.itemUse.subscribe(({ itemStack: item, source }) => {
	switch (item.typeId) {
	case "minecraft:recovery_compass":
		lastDeath(source);
		break;
	case "minecraft:compass":
		if (!source.isSneaking) break;
		defaultSpawn(source);
		break;
	}
});
