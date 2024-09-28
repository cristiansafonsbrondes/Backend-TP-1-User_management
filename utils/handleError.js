import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const handleError = (error, path) => {

    const dbError = JSON.parse(readFileSync(path));

    const newError = {
        id: randomUUID(),
        type: error.message,
        date: new Date().toISOString(),
    };
  
    console.log(`Error en el ingreso de datos: ${newError.type}`);
    dbError.push(newError);
    writeFileSync(path, JSON.stringify(dbError, null, 2));

};

export { handleError };
