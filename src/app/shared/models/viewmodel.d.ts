import { Deck, DeckBack, DeckFront, Game, State } from "./api";
import { cardBackFields, cardFrontFields } from "./requests-api";

export interface DeckViewModel {
  id: string;
  name: string;
  type: string;
  description: string;
  color: string;
  cardFrontFields: cardFrontFields;
  cardBackFields: cardBackFields;
}

export interface CreateGameResponse {
  game: GameViewModel;
  decks: DeckViewModel[];
  states: State[];
}

export interface GameViewModel {
  _id: string;
  name: string;
  user: string;
  description: string;
  simplyGameplay: string;
  audience: string;
  knowledgeField: string;
  requirements: string;
  authors: string[];
  minNumberPlayers: number;
  maxNumberPlayers: number;
}

export interface DeckViewModel {
  _id: string;
  game: string;
  name: string;
  description: string;
  color: string;
  deckFront: DeckFront;
  deckBack: DeckBack;
}
