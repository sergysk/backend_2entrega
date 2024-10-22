// setTimeout
//const temporizador = (callback) => {
//    setTimeout(() => {
//        callback();
//        console.log('Finalizar tarea');
//    }, 1000);
//}
//
//let operacion = () => console.log('Realizando operacion con setTimeout');
//
//console.log('Iniciamos la tarea');
//temporizador(operacion);


// setInterval
let contador = () => {
    let contador = 1;
    console.log('Realizado operacion con setInterval')

    let timer =  setInterval(() => {
        console.log(contador++)
        if (contador > 5) {
            clearInterval(timer);
        }

    }, 1000)
    console.log('Finalizamos la tarea');
}


console.log('Iniciamos operacion');
contador();