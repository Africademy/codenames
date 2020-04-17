import { withFilter } from 'graphql-subscriptions'
import { get } from 'lodash'
import {
    startGame,
    joinGame,
    JoinGameInput,
    pickWord,
    PickWordInput,
    endTurn,
    EndTurnInput,
    getGame,
    GetGameInput,
    resetGame,
    ResetGameInput,
    StartGameInput,
} from './controllers/game.controller'
import {} from './constants'
import { pubsub } from './app'
import User from './models/user.model'
import { IGame } from './models/game.model'
import { GAME_UPDATED, GAME_RESET } from './constants'

const resolvers = {
    Subscription: {
        GameUpdated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([GAME_UPDATED]),
                (payload, variables) => {
                    const permalink = get(variables, 'input.permalink', null)
                    const payloadPermalink = get(
                        payload,
                        'GameUpdated.permalink',
                        null
                    )

                    return (
                        permalink &&
                        payloadPermalink &&
                        permalink === payloadPermalink
                    )
                }
            ),
        },

        GameReset: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([GAME_RESET]),
                (payload, variables) => {
                    const permalink = get(variables, 'input.permalink', null)
                    const payloadPermalink = get(
                        payload,
                        'GameUpdated.permalink',
                        null
                    )

                    return (
                        permalink &&
                        payloadPermalink &&
                        permalink === payloadPermalink
                    )
                }
            ),
        },
    },
    Query: {
        game: (_: null, { input }: { input: GetGameInput }) => {
            return getGame(input)
        },
    },
    Mutation: {
        StartGame: (_: null, { input }: { input: StartGameInput }) => {
            return startGame(input)
        },
        JoinGame: (_: null, { input }: { input: JoinGameInput }) => {
            return joinGame(input)
        },
        PickWord: (_: null, { input }: { input: PickWordInput }) => {
            return pickWord(input)
        },
        EndTurn: (_: null, { input }: { input: EndTurnInput }) => {
            return endTurn(input)
        },
        ResetGame: (_: null, { input }: { input: ResetGameInput }) => {
            return resetGame(input)
        },
    },
    Game: {
        users: ({ users }: IGame) => {
            return User.find({ _id: { $in: users } })
                .lean()
                .exec()
        },
    },
}

export default resolvers
