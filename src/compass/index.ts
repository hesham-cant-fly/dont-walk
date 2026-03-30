import { type StartupEvent } from "@minecraft/server";
import { Comperfort } from "./comperfort";

export function regesterAll(ev: StartupEvent): void {
    ev.itemComponentRegistry.registerCustomComponent("haste:comperfort", new Comperfort());
}
