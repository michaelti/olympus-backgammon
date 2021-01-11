const {
    Board,
    Pip,
    Move,
    Player,
    Variant,
    reverseMove,
    rollDie,
    clamp,
    pipDistance,
} = require("./game");

const { range } = require("./util");

exports.Board = Board;
exports.Pip = Pip;
exports.Move = Move;
exports.Player = Player;
exports.Variant = Variant;
exports.reverseMove = reverseMove;
exports.rollDie = rollDie;
exports.clamp = clamp;
exports.pipDistance = pipDistance;

exports.range = range;

exports.portes = require("./variants/portes");
exports.plakoto = require("./variants/plakoto");
exports.fevga = require("./variants/fevga");
