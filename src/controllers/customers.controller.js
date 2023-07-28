import db from "../database/db.connection.js";

export const getCustomers = async (req, res) => {

    try {
        const customers = await db.query(
            "SELECT *, TO_CHAR(birthday, 'YYYY-MM-DD') birthday FROM customers"
        );

        res.send(customers.rows);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const getCustomerById = async (req, res) => {

    const { id } = req.params;

    try {
        const customerById = await db.query(
            "SELECT * FROM customers WHERE id = $1", [id]
        );

        if (customerById.rowCount < 1) {
            return res.sendStatus(404);
        }

        res.send(customerById.rows[0]);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const createCustomer = async (req, res) => {

    const { name, phone, cpf, birthday } = res.locals.data;

    try {
        const checkDuplicateCustomer = await db.query(
            "SELECT * FROM customers WHERE cpf = $1", [cpf]
        );

        if (checkDuplicateCustomer.rowCount >= 1) {
            return res.sendStatus(409);
        }

        await db.query(
            "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
            [name, phone, cpf, birthday]
        );

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const updateCustomerById = async (req, res) => {

    const { name, phone, cpf, birthday } = res.locals.data;
    const { id } = req.params;

    try {
        const checkCpf = await db.query(
            "SELECT * FROM customers WHERE cpf = $1", [cpf]
        );

        if (checkCpf.rowCount >= 1) {

            /* Payload CPF is from another customer */
            if (checkCpf.rows[0].id !== Number(id)) {
                return res.sendStatus(409);
            }
        }

        await db.query(
            "UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5",
            [name, phone, cpf, birthday, id]
        );

        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}