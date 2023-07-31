import db from "../database/db.connection.js";
import setQueryOptions from "../utils/setQueryOptions.js";

const selectAllCustomers = async () => {

    const customers = await db.query(
        `SELECT *, 
            TO_CHAR(birthday, 'YYYY-MM-DD') birthday 
            FROM customers;
        `
    );

    return customers;
}

const selectCustomersByQuery = async (query) => {

    const { cpf } = query;

    const tableName = "customers";
    let queryString = `
        SELECT *,
            TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday
            FROM customers
    `;

    if (cpf) {
        queryString += ` WHERE cpf LIKE '%${cpf}%' `;
    }

    queryString += setQueryOptions(query, tableName);
    const customers = await db.query(queryString, []);

    return customers;
}

const selectCustomerById = async (id) => {

    const customer = await db.query(
        `SELECT *,
            TO_CHAR(birthday, 'YYYY-MM-DD') birthday
            FROM customers 
            WHERE id = $1;
        `, [id]
    );

    return customer;
}

const selectCustomerByCPF = async (cpf) => {

    const customer = await db.query(
        `SELECT *,
            TO_CHAR(birthday, 'YYYY-MM-DD') birthday
            FROM customers 
            WHERE cpf = $1;
        `, [cpf]
    );

    return customer;
}

const createCustomer = async (payload) => {

    const { name, phone, cpf, birthday } = payload;

    await db.query(
        `INSERT INTO customers 
            (name, phone, cpf, birthday) 
            VALUES ($1, $2, $3, $4);
        `, [name, phone, cpf, birthday]
    );
}

const updateCustomerById = async (payload, id) => {

    const { name, phone, cpf, birthday } = payload;

    const customer = await db.query(
        `UPDATE customers SET 
            name = $1,
            phone = $2,
            cpf = $3,
            birthday = $4
            WHERE id = $5;
        `, [name, phone, cpf, birthday, id]
    );

    return customer;
}

const customerService = {
    selectAllCustomers,
    selectCustomersByQuery,
    selectCustomerById,
    selectCustomerByCPF,
    createCustomer,
    updateCustomerById
}

export default customerService;