import db from "../database/db.connection.js";
import setQueryOptions from "../utils/setQueryOptions.js";

const selectAllGames = async () => {

    const games = await db.query(
        `SELECT * 
            FROM games;
        `
    );

    return games;
}

const selectGamesByQuery = async (query) => {

    const { name } = query;

    let queryString = `
        SELECT *
            FROM games;
    `;

    if (name) {
        queryString += ` WHERE name LIKE ${name} `;
    }

    queryString += setQueryOptions(query);

    const games = await db.query(queryString, []);
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
    selectGamesByQuery,
    selectGameById,
    selectGameByName,
    createGame
}

export default gameService;