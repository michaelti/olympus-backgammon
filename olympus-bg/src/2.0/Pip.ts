import { Player } from "./types.js";

export class Pip {
    constructor(
        public size: number = 0,
        public owner: Player = Player.neither,
        public isPinned: boolean = false,
    ) {}

    set(size: number, owner: Player, isPinned?: boolean) {
        this.size = size;
        this.owner = owner;
        this.isPinned = isPinned ?? this.isPinned;
    }
}
