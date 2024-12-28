import { Player } from "./types.js";
import { otherPlayer } from "./util.js";

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

    clear() {
        this.size = 0;
        this.owner = Player.neither;
        this.isPinned = false;
    }

    unpin() {
        if (this.owner === Player.neither) return;
        this.size = 1;
        this.owner = otherPlayer(this.owner);
        this.isPinned = false;
    }
}
