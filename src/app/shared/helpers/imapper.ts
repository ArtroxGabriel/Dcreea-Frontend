import { Deck, Game } from "../models/api";
import { DeckViewModel, GameViewModel } from "../models/viewmodel";

export function mapg(game: GameViewModel): Game {
  return {
    _id: game._id,
    user: game.user,
    audience: game.audience,
    description: game.description,
    knowledgeField: game.knowledgeField,
    requirements: game.requirements,
    authors: game.authors,
    minNumberPlayers: game.minNumberPlayers,
    maxNumberPlayers: game.maxNumberPlayers,
    name: game.name,
    simplyGameplay: game.simplyGameplay,
    decks: [],
    roles: [],
    tokens: [],
    states: [],
  };
}

export function mapd(game: DeckViewModel): Deck {
  return {
    _id: game._id,
    game: game.game,
    name: game.name,
    description: game.description,
    color: game.color,
    cards: [],
    deckFront: game.deckFront,
    deckBack: game.deckBack,
  };
}
