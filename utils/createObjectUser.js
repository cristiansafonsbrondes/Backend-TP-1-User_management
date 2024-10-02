// 1° objetener los argumentos pasador por terminal (que vienen del index)
// 2° desarrollar las funciones que crean los objetos para añadir un usario y actualizar un usuario
// 3° aplicar control de errores entorno a las posibilidades de que surja uno

import { handleError } from "./handleError.js";
import dotenv from "dotenv";

dotenv.config();
const args = process.argv;

const PATH_FILE_USER = process.env.PATH_FILE_USER;
const PATH_FILE_ERROR = process.env.PATH_FILE_ERROR;

const createUserObject = (args) => {
  try {
    const [name, lastname, email, password] = args.slice(2);
    if (!name || !lastname || !email || !password) {
      throw new Error("Missing data");
    };
    return {
      name,
      lastname,
      email,
      password
    };
  } catch (error) {
    handleError(error, PATH_FILE_ERROR);
  };
};

const createUpdateUserObject = (args) => {
  try {
    const [id, name, lastname, email, password] = args.slice(2);
    return {
      id,
      name,
      lastname,
      email,
      password
    };
  } catch (error) {
    handleError(error, PATH_FILE_ERROR);
  };
};

export { createUserObject, createUpdateUserObject };

// const userObject = createUpdateUserObject(args);
// if (userObject) {
//   console.log(userObject);
// } else {
//   console.log("No se pudo crear el usuario debido a un error.");
// };
// console.log(typeof createUserObject(args));