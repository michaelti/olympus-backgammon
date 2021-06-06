const { Variant, Player, reverseMove, rollDie } = require("./util");
const { Board } = require("./game");

exports.Variant = Variant;
exports.Player = Player;
exports.reverseMove = reverseMove;
exports.rollDie = rollDie;
exports.Board = Board;

exports.portes = require("./variants/portes");
exports.plakoto = require("./variants/plakoto");
exports.fevga = require("./variants/fevga");
