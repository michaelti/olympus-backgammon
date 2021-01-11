const { Variant, Player, Board, reverseMove, rollDie } = require("./game");

exports.Variant = Variant;
exports.Player = Player;
exports.Board = Board;
exports.reverseMove = reverseMove;
exports.rollDie = rollDie;

exports.portes = require("./variants/portes");
exports.plakoto = require("./variants/plakoto");
exports.fevga = require("./variants/fevga");
