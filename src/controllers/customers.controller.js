import customerService from "../services/customers.service.js";

export const getCustomers = async (req, res) => {

    const queryLength = Object.keys(req.query).length;

    try {
        const customers = (queryLength >= 1) ? 
            await customerService.selectCustomersByQuery(req.query)
            :
            await customerService.selectAllCustomers();

        res.send(customers.rows);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const getCustomerById = async (req, res) => {

    const { id } = req.params;

    try {
        const customer = await customerService.selectCustomerById(id);

        /* Customer not found */
        if (!customer.rows[0]) {
            return res.sendStatus(404);
        }

        res.send(customer.rows[0]);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const createCustomer = async (req, res) => {

    const { cpf } = res.locals.data;

    try {
        const customer = await customerService.selectCustomerByCPF(cpf);

        /* Customer with payload CPF already exists */
        if (customer.rows[0]) {
            return res.sendStatus(409);
        }

        await customerService.createCustomer(res.locals.data);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const updateCustomerById = async (req, res) => {

    const { cpf } = res.locals.data;
    const { id } = req.params;

    try {
        const customer = await customerService.selectCustomerByCPF(cpf);
        if (customer.rows[0]) {

            const customerId = customer.rows[0].id;

            /* Check if payload CPF is from another customer */
            if (customerId !== Number(id)) {
                return res.sendStatus(409);
            }
        }

        await customerService.updateCustomerById(res.locals.data, id);
        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}