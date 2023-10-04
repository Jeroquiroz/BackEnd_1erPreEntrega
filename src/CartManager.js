
import fs from 'fs'  //Usamos fs asincrono para manejar los archivos


class CartManager {        //Definimos la clase CartManager con su Constructor y sus metodos
    constructor(path) {
        this.path = path
    }

    getCarts = async () => {        //Buscamos el archivo de la ruta del objeto y devolvemos su contenido. Si no existe dicho archivo devolvemos un array vacio
        if (fs.existsSync(`${this.path}`)) {
            let carts = await fs.promises.readFile(`${this.path}`, 'utf-8')
            return JSON.parse(carts)
        } else {
            return []
        }
    }

    addCart = async newCart => {       //Agregamos un carrito nuevo al archivo si no repite su ID con otro que ya este cargado
        let carts = await this.getCarts()
        if (carts.some(el => el.id === newCart.id)) {
            console.log(`Ya existe un carrito con el ID ${newCart.id} cargado en el sistema.`)
        } else {
            carts.push(newCart)
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(carts))
        }
    }

    getCartById = async id => {          //Buscamos en el archivo y extraemos un carrito segun su ID
        let carts = await this.getCarts()
        const comparacion = carts.filter(el => el.id === id)
        if (comparacion.length !== 0) {
            return comparacion[0]
        } else {
            return new Error('Not found')
        }
    }
    
    addItemToCart = async (id, newId) => {       //Agregamos un item al carrito segun ID de carrito y de producto
        let carts = await this.getCarts()
        const cartIndex = carts.findIndex(el => el.id === id)
        if (cartIndex === -1) {
            return new Error('No existe carrito con ese ID')
        } else {
            const productIndex = carts[cartIndex].products.findIndex(el => el.id === newId)
            if (productIndex === -1) {
                let newProduct = { id: newId, quantity: 1 }
                carts[cartIndex].products.push(newProduct)
            } else {
                carts[cartIndex].products[productIndex].quantity++
            }
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(carts))
        }
    }
    
    deleteCart = async id => {       //Eliminamos un carrito segun su ID
        let carts = await this.getCarts()
        const index = carts.findIndex(el => el.id === id)
        if (index === -1) {
            return new Error(`No se encontro el carrito con ID: ${id}.`)
        } else {
            carts.splice(index, 1)
            await fs.promises.writeFile(`${this.path}`, JSON.stringify(carts))
            return `Se elimino el carrito con ID: ${id}.`
        }
    }
    
    deleteFile = async () => {         //Borramos el archivo .json
        await fs.promises.unlink(`${this.path}`)
    }
    
    getLength = async () => {     //Obtenemos la cantidad de carritos en memoria
        let carts = await this.getCarts()
        return carts.length
    }
}

export default CartManager
