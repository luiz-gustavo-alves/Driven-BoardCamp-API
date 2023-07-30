import gameService from "../services/games.service.js";

export const getGames = async (req, res) => {

    const queryLength = Object.keys(req.query).length;

    try {
        const games = (queryLength >= 1) ? 
            await gameService.selectGamesByQuery(req.query)
            :
            await gameService.selectAllGames();

        res.send(games.rows);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const createGame = async (req, res) => {

    const { name } = res.locals.data;

    try {
        const game = await gameService.selectGameByName(name);

        /* Game with payload name already exists */
        if (game.rows[0]) {
            return res.sendStatus(409);
        }

        await gameService.createGame(res.locals.data);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}