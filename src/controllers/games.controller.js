import gameService from "../services/games.service.js";

export const getGames = async (req, res) => {

    try {
        const games = await gameService.selectAllGames();
        res.send(games.rows); 

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const createGame = async (req, res) => {

    const { name } = res.locals.data;

    try {
        const game = await gameService.selectGameByName(name);
        if (game.rows[0]) {
            return res.sendStatus(409);
        }

        await gameService.createGame(res.locals.data);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}