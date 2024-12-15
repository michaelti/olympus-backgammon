// TODO: Import Player from types
enum Player {
    neither = 0,
    white = 1,
    black = -1,
}

export class Pip {
    constructor(
        public owner: Player = Player.neither,
        public size: number = 0,
        public isPinned: boolean = false
    ) {}
}
