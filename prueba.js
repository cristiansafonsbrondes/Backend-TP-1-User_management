import bcrypt from "bcrypt";

const password = "1234";

const hasspassword = async (password)=>{
const passhas = await bcrypt.hash(password, 10);

console.log(password);
console.log(passhas);
return passhas;

};

const controlPass = (pass) => {
    passplana = pass
    user = {
        user = "andres";
        password = 
    }


}

// const hashRecibido = hasspassword(password);
// console.log(hashRecibido);