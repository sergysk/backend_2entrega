const fs = require('fs').promises;

class UserManager {
    constructor() {
        this.fileUser = 'users.json';
    }

    /**
     * 
     */
    async createFile() {
        try {
            await fs.access(this.fileUser);
            //console.log(`El archivo ${this.fileUser} ya existe`);
        } catch (err) {
            await fs.writeFile(this.fileUser, '[]');
            console.log(`Creamos el archivo ${this.fileUser}`)
        }
    }

    /**
     * 
     * @param {Object} user 
     */
    async addUser(user) {
        try {
            const data = JSON.stringify(user)
            const file = await fs.readFile(this.fileUser, 'utf8');
            const editFile = JSON.parse(file);
            editFile.push(user);

            // ident ref: https://www.alextomas.com/blog/json-stringify-indexar-formato-codigo/
            await fs.writeFile(this.fileUser, JSON.stringify(editFile, null, 2));
            console.log(`Has agregado a: ${data}`);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * 
     * @param {String} nombre
     * @returns {String(Object)}
     */
    async findUser(nombre) {
        if (await this.existsUser(nombre)) {
            const file = await fs.readFile(this.fileUser, 'utf8');
            const users = JSON.parse(file);
            const filterUser = users.find(usr => usr.nombre === nombre)
            return `Resultado: ${JSON.stringify(filterUser)}`;
        } 
        return `Resultado: el usuario ${nombre} no existe..!!`;
    }

    /**
     * 
     * @param {String} nombre 
     * @returns {Boolean}
     */
    async existsUser(nombre) {
        const file = await fs.readFile(this.fileUser, 'utf8');
        const users = JSON.parse(file);
        const exists = users.some(usr => usr.nombre === nombre);
        return exists;
    }


}


/**
 * 
 * @param {Array[Object]} arr
 */
const main = async (arr) => {
    // Create a file
    await user.createFile();

    for (const usr of arr) {
        await user.existsUser(usr.nombre) ?  null : await user.addUser(usr);

        // Find a user
        console.log(await user.findUser('lisa'));
    }
}





const user = new UserManager();
const usersArray= [
    {nombre: 'pablo', apellido: 'lopez', edad: 20, curso: 'estudiante'},
    {nombre: 'hemoero', apellido: 'simpson', edad: 100, curso: 'loco'},
    {nombre: 'lisa', apellido: 'simpson', edad: 20, curso: 'nerd'}
];

main(usersArray);