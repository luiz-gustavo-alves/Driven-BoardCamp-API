import { stripHtml } from "string-strip-html";

export const dataSanitization = (req, res, next) => {
    
    const data = {...req.body, ...req.params};
    for (const [key, value] in Object.entries(data)) {

        if (typeof value === "string") {
            data[key] = stripHtml(value).result;
        }
    }

    res.locals.data = data;
    next();
}