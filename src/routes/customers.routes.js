import { Router } from "express";
import { getCustomers, getCustomerById, createCustomer, updateCustomerById } from "../controllers/customers.controller.js";
import { schemaValidation } from "../middlewares/schemaValidation.js";
import { dataSanitization } from "../middlewares/dataSanitization.js";
import { customerSchema } from "../schemas/customers.schema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", schemaValidation(customerSchema), dataSanitization, createCustomer);
customersRouter.put("/customers/:id", schemaValidation(customerSchema), dataSanitization, updateCustomerById);

export default customersRouter;