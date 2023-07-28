import db from "../database/db.connection.js";

const selectAllGames = async () => {

    const games = await db.query(
        `SELECT * 
            FROM games;
        `
    );

    return games;
}

const selectGameById = async (id) => {

    const game = await db.query(
        `SELECT * 
            FROM games 
            WHERE id = $1;
        `, [id]
    );

    return game;
}

const selectGameByName = async (name) => {

    const game = await db.query(
        `SELECT * 
            FROM games 
            WHERE name = $1;
        `, [name]
    );

    return game;
}

const createGame = async (payload) => {

    const { name, image, stockTotal, pricePerDay } = payload;

    await db.query(
        `INSERT INTO games 
            (name, image, "stockTotal", "pricePerDay") 
            VALUES ($1, $2, $3, $4);
        `, [name, image, stockTotal, pricePerDay]
    );
}

const gameService = {
    selectAllGames,
    selectGameById,
    selectGameByName,
    createGame
}

export default gameService;