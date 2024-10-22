const fs = require('fs');


class FileSystem {
    constructor(file) {
        this.file = file;
    }

    createFile(msg) {
        if (!fs.existsSync(`${this.file}`)) {
            console.log(`Hemos creado el archivo ${this.file}`);
            return fs.writeFileSync(this.file, msg)
        }
        console.log(`El archivo ${this.file} ya existe !!!`)
    }

    createDirectory(dir) {
        if (!fs.existsSync(dir)) {
            console.log(`Hemos creado el directorio: ${dir}`)
            return fs.mkdirSync(dir)
        }
        console.log(`El directorio ${dir} ya existe !!!`)
    }

    writeFile() {
        
    }

}


const file = new FileSystem('mytest.txt')
file.createFile("Hola me llamo harold!!");
file.createDirectory('myDirectory');