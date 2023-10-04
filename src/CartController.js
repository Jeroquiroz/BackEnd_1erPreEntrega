'use strict'

import Car from './Car.js'
import { product, carts } from './helpers.js'
import { v4 as uuidv4 } from 'uuid'

export const CreaCar = async (req, res) => {    //Generamos un ID y creamos un nuevo carro vacio con ese ID
    let newID = uuidv4()
    let newCart = new Car(newID)

    let currentLength = await carts.getLength()   //Almacenamos la cantidad de carros actualmente en el sistema e intentamos cargar el nuevo carro
    await carts.addCart(newCart)

    res.status((await carts.getLength()) !== currentLength ? 200 : 409).json({   //Comparamos la cantidad de carros actual con la almacenada anteriormente. Si es igual el nuevo carrito no se cargo
        info: {
            status: (await carts.getLength()) !== currentLength ? 200 : 409,
            message: (await carts.getLength()) !== currentLength ? 'Carro creado' : 'No se pudo crear el carro',
        },
        results: newCart,
    })
}


export const cartGetterById = async (req, res) => {
    let cid = req.params.cid
    let filteredCart = await carts.getCartById(cid)

    res.status(filteredCart.products ? 200 : 404).json({    //Verificamos que se haya encontrado un carro con ese ID, en caso contrario mostramos un 404
        info: {
            status: filteredCart.products ? 200 : 404,
            message: filteredCart.products ? 'Carrito encontrado' : 'No se pudo encontro el carrito con ese ID',
        },
        results: filteredCart.products,
    })
}

export const addProductToCart = async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let filteredProduct = await product.getProductById(pid)

    let productStatus = Object.keys(filteredProduct).length !== 0   //Verificamos que existan producto y carrito con sus IDs antes de cargar al carrito, en caso contrario devolvemos 404
    let cartStatus = Object.keys(await carts.getCartById(cid)).length !== 0
    if (productStatus && cartStatus) {
        await carts.addItemToCart(cid, pid)
    }

    res.status(productStatus && cartStatus ? 200 : 404).json({
        info: {
            status: productStatus && cartStatus ? 200 : 404,
            message:
                productStatus && cartStatus
                    ? 'Carro actualizado'
                    : productStatus
                    ? 'Car ID inexistente'
                    : 'Product ID inexistente',
        },
        results: await carts.getCartById(cid),
    })
}
