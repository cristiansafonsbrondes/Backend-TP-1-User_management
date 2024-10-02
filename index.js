// 1° recibir los argumentos pasados por la terminal
// 2° enviarselos a ./utils/createObjectUser (en caso de crear o actualizar el usuario)
// 3° evaluar que acción quiere realizar el usuario (list, search/get, add, update, delete)
// 4° DEVOLVER EL OUTPUT AL CLIENTE FINAL

import { getUsers, getUserById, addUser, updateUser, deleteUser } from "./models.js";
import dotenv from "dotenv";
import { handleError } from "./utils/handleError.js";
import { createUpdateUserObject, createUserObject } from "./utils/createObjectUser.js";

dotenv.config();

const PATH_FILE_USER = process.env.PATH_FILE_USER;
const PATH_FILE_ERROR = process.env.PATH_FILE_ERROR;

const args = process.argv.splice(2);
const option = args[0]; //va a tomar el primer argumento, la opcion

// console.log("List: see all users");
// console.log("Search: Search by ID");
// console.log("Add: Add user (name, lastname, email, password");
// console.log("Update: uptdate parameter (name, lastname, email, password");
// console.log("Delete: delete user by ID");
// if (option !== "List" || option !== "Search" || option !== "Add" || option !== "Update" || option !== "Delete") {
//     console.log("Comand Incorrect1");
// };

switch (option) {
    case "List":
        console.log(getUsers(PATH_FILE_USER));
        break;
    case "Search":
        console.log(getUserById(args[1]));
        break;
    case "Add":
        const newUser = createUserObject(args);
        console.log(await addUser(newUser));
        break;
    case "Update":
        const updatedUser = createUpdateUserObject(args);
        console.log(updateUser(updatedUser));
        break;
    case "Delete":
        console.log(deleteUser(args[1]));
        break;
    default:
        const error = "Error Default";
        console.log("Error", handleError(error, PATH_FILE_ERROR));

};

