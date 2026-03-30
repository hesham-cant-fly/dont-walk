import { ItemComponentUseEvent, ItemCustomComponent } from "@minecraft/server";

export class Comperfort implements ItemCustomComponent {
    onUse({ source: _, itemStack: __ }: ItemComponentUseEvent): void {
        // source.applyImpulse(Vector3);
    }
}
