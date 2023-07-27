import db from "../database/db.connection.js";

export const getGames = async (req, res) => {

    try {
        const games = await db.query("SELECT * FROM games");
        res.send(games.rows); 

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const createGame = async (req, res) => {

    const { name, image, stockTotal, pricePerDay } = res.locals.data;

    try {
        const checkDuplicateGame = await db.query("SELECT * FROM games WHERE name = $1", [name]);
        if (checkDuplicateGame.rowCount >= 1) {
            return res.sendStatus(409);
        }

        await db.query(
            `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`,
            [name, image, stockTotal, pricePerDay]
        );

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}