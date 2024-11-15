import constants from '../common/constants.js';
import { Pelicula } from "./pelicula.js";
import client from "../common/db.js";
import { ObjectId } from "mongodb";



function validDataBody(body) {
    if (!body.nombre || !body.generos || !body.anioEstreno) {
        return false;
    }
    return true;
}
function validDataParam(param) {
    if (!param || param.length !== 24) {
        return false;
    }
    return true;
}



export async function handleInsertPeliculaRequest(req, res) {

    var body = req.body;
    var pelicula = Pelicula;
    if (!validDataBody(body)) {
        return res.status(400).send({ mensaje: "complete todos los datos requeridos" });
    }
    pelicula.nombre = body.nombre
    pelicula.generos = body.generos
    pelicula.anioEstreno = body.anioEstreno;

    await client.db(constants.dbName).collection(constants.collection).insertOne(pelicula).then((data) => {
        if (data === null) { return res.status(400).send({ mensaje: "hubo un problema al insertar pelicula" }); }
        if(data.acknowledged){return res.status(200).send({ mensaje:"pelicula agregada correctamente." });}
        
    }).catch((e) => {
        console.error(e); return res.status(500).json({ mensaje: "error interno en la aplicación" })
    });
}

export async function handleGetPeliculasRequest(req, res) {
    await client.db(constants.dbName).collection(constants.collection).find().toArray().then((data) => {
        data = data.filter(e => { return e.anioEstreno });
        if (data === null || data.length === 0) {
            res.status(204).json({});
            return;
        }
        res.status(200).json(data)
    }).catch((e) => { console.error(e); res.status(500).json({ mensaje: "error interno en la aplicación" }) })
}

export async function handleGetPeliculaByIdRequest(req, res) {
    try {
        var id = req.params.id
        var oid = ObjectId.createFromHexString(id)
        await client.db(constants.dbName).collection(constants.collection).findOne({ "_id": oid }).then((data) => {
            if (data === null || data === 0) {
                return res.status(204).json({})
            }
            return res.status(200).json(data)

        }).catch((e) => { console.error(e); return res.status(500).json({ mensaje: "error interno en la aplicación" }) })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensaje: "error interno en la aplicación" })
    }



}
export async function handleUpdatePeliculaByIdRequest(req, res) {
    try {

        var id = req.params.id;
        if (!validDataParam(id)) {
            return res.status(400).send({ mensaje: "complete todos los datos requeridos" });
        }
        var oid = ObjectId.createFromHexString(id)
        var body = req.body

        if (!validDataBody(body)) {
            return res.status(400).send({ mensaje: "complete todos los datos requeridos" });
        }
        var query = {
            $set: {
                nombre: body.nombre,
                generos: body.generos,
                anioEstreno: body.anioEstreno
            }
        }
        await client.db(constants.dbName).collection(constants.collection).updateOne({ "_id": oid }, query).then((data) => {
            if (data === null || data.modifiedCount === 0) { return res.json({}) }
            if(data.modifiedCount){return res.status(200).send({ mensaje:"pelicula modificada correctamente." });}
        }).catch((e) => { console.error(e); res.status(500).json({ mensaje: "error interno en la aplicación" }) })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensaje: "error interno en la aplicación" })
    }
}

export async function handleDeletePeliculaByIdRequest(req, res) {
    try {

        var id = req.params.id;
        if (!validDataParam(id)) {
            return res.status(400).send({ mensaje: "complete todos los datos requeridos" });
        }
        var oid = ObjectId.createFromHexString(id)
        await client.db(constants.dbName).collection(constants.collection).deleteOne({ _id: oid }).then((data) => {
            if (data === null || data.deletedCount === 0) { return res.status(204).json({}) }
            if(data.deletedCount){
                return res.status(200).json({ mensaje:"pelicula eliminada correctamente" })

            }
        }).catch((e) => { console.error(e); return res.status(500).json({ mensaje: "error interno en la aplicación" }) })
    } catch (error) {
        console.log(error)
        returnres.status(500).json({ mensaje: "error interno en la aplicación" })
    }

}


