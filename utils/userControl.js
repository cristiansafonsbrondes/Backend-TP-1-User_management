import { handleError } from "./handleError.js";
import { getUsers } from "../models.js"
import bcrypt from 'bcrypt';
import dotenv from "dotenv";

dotenv.config();

const PATH_FILE_USER = process.env.PATH_FILE_USER;
const PATH_FILE_ERROR = process.env.PATH_FILE_ERROR;

// VALIDACION DE NOMBRE -------------------------------------------------------
const validatedName = (firstName) => {

    try {
        if (!firstName) {
            throw new Error("firstName: Missing data");
        };

        const regex = /^[^\s@0-9]+$/;

        if (!regex.test(firstName)) {
            throw new Error("Does not have the required parameters for Name");
        };
        return true;
    }
    catch (error) {
        handleError(error, PATH_FILE_ERROR);
    };
};

// console.log(validatedName("Raul123"));


// VALIDACION DE APELLIDO ------------------------------------------------------
const validatedLastname = (lastName) => {
    try {
        if (!lastName) {
            throw new Error("LastName: Missing data");
        };

        const regex = /^[^\s@0-9]+$/;

        if (!regex.test(lastName)) {
            throw new Error("Does not have the required parameters for LastName");
        }
        return true;
    }
    catch (error) {
        handleError(error, PATH_FILE_ERROR);
    };
};
// console.log(validatedLastname("Lopez"));

// VALIDACION PARA EL EMAIL ---------------------------------------------------------
const emailValidated = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Explicación del regex:
    // ^[^\s@]+: El email debe comenzar con uno o más caracteres que no sean espacio ni el símbolo @.
    // @: Debe tener un @.
    // [^\s@]+: Después del @, debe tener uno o más caracteres que no sean espacios o @.
    // \.: Debe tener un punto literal.
    // [^\s@]+$: Debe terminar con uno o más caracteres que no sean espacios o @.
    try {
        if (!email) {
            throw new Error("Email: Missing data");
        };

        if (!regex.test(email)) {
            throw new Error("Email is not valid");
        };//controla que el mail tenga la estructura deseada

        const usersData = getUsers(PATH_FILE_USER);

        const emailControl = usersData.find((userData) => userData.email === email);

        if (emailControl) {
            throw new Error("Email already exists")
        };//controla que el mail ingresado, sea existente

        return true;

    } catch (error) {
        handleError(error, PATH_FILE_ERROR);
    };
};
//   console.log(emailValidated("ruben@garcia.com"));

// VALIDACION DE PASSWORD -----------------------------------------------------
const validatedPassword = async (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    //  ^:          Inicio de la cadena.
    // (?=.*[a-z]): Al menos una letra minúscula ([a-z]).
    // (?=.*[A-Z]): Al menos una letra mayúscula ([A-Z]).
    // (?=.*\d):    Al menos un dígito (\d).
    // [a-zA-Z\d]{8,}: Debe tener al menos 8 caracteres de longitud, formados por letras mayúsculas, minúsculas o dígitos.
    // $: Fin de la cadena.
    try {
        // Verifica que la contraseña esté definida
        if (!password) {
            throw new Error("Password: Missing data");
        };
        // Verifica que la contraseña cumpla con los criterios
        if (!regex.test(password)) {
            throw new Error("Password does not meet the required criteria (uppercase, lowercase, number, 8 characters).");
        };

        const usersData = getUsers(PATH_FILE_USER);
        const newHashPass = bcrypt.hash(password, 10);

        const passwordControl = usersData.find((userData) => userData.passwordhash === newHashPass);
        
        if (passwordControl) {
            throw new Error("Password already exists")
        };//controla que el password ingresado, no este repetido (CHEQUEAR)
        // ME FALTA VER COMO CONTROLAR QUE EL pass NO ESTE REPETIDO CON bcrypt.compare
        
            return true;

        } catch (error) {
            handleError(error, PATH_FILE_ERROR);
        };

    };
    // console.log(validatedPassword("Password123"));

    export { emailValidated, validatedName, validatedLastname, validatedPassword };