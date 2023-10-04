'use strict'

import ProductManager from './ProductManager.js'
import CartManager from './CartManager.js'

export let product = new ProductManager('./src/Productos.json') //Creamos una variable product vinculada al archivo Productos.json

export let carts = new CartManager('./src/Carritos.json')  //Creamos una variable carts vinculada al archivo Carritos.json
