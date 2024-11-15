import constants from '../common/constants.js';
import { Actor } from "./actor.js";
import client from "../common/db.js";
import { ObjectId } from "mongodb";

export async function handleInsertActorRequest(req, res) {
    try {


        var body = req.body;
        if (!validDataBody(body)) {
            return res.status(400).send({ error: "complete todos los datos requeridos" });
        }
        var actor = Actor;

        actor.edad = body.edad
        actor.estaRetirado = body.estaRetirado
        var id = body.idPelicula
        var oid = ObjectId.createFromHexString(id)
        actor.idPelicula = oid
        actor.nombre = body.nombre
        actor.premios = body.premios

        await client.db(constants.dbName).collection(constants.collection).findOne({ "_id": oid }).then(async (data) => {

            if (data === null) { return res.status(204).send({ error: "hubo un problema encontrar pelicula" }); }

            await client.db(constants.dbName).collection(constants.collection).insertOne(actor).then((data) => {
                if (data === null) { return res.status(400).send({ error: "hubo un problema al insertar actor" }); }
                if(data.acknowledged){return res.status(200).send({ mensaje:"actor agregado correctamente." });}

                return res.send({ data });

            }).catch((e) => {
                console.error(e); res.status(500).json({ error: "error interno en la aplicación" });
            });
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "error interno en la aplicación" })
    }

}

function validDataBody(body) {
    if (!body.nombre || !body.premios || !body.idPelicula || (body.estaRetirado === undefined || body.estaRetirado === null) || !body.edad) {
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

export async function handleGetActoresRequest(req, res) {
    await client.db(constants.dbName).collection(constants.collection).find().toArray().then((data) => { data = data.filter(e => { return e.idPelicula }); if (data.length === 0) { return res.status(204).json(data) } return res.status(200).json(data) }).catch((e) => { return res.status(500).send(e) })
}

export async function handleGetActorByIdRequest(req, res) {
    try {

        var id = req.params.id
        if (!validDataParam(id)) {
            return res.status(400).send({ error: "complete todos los datos requeridos" });
        }
        var oid = ObjectId.createFromHexString(id)
        await client.db(constants.dbName).collection(constants.collection).findOne({ "_id": oid }).then((data) => {
            if (data === null) { return res.status(204).json({}) }

            return res.status(200).json(data)

        }).catch((e) => {
            console.error(e); return res.status(500).json({ error: "error interno en la aplicación" })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "error interno en la aplicación" })
    }




}
export async function handleGetActoresByPeliculaIdRequest(req, res) {
    try {
        var id = req.params.pelicula;
        if (!validDataParam(id)) {
            return res.status(400).send({ error: "complete todos los datos requeridos" });
        }
        var oid = ObjectId.createFromHexString(id);
        await client.db(constants.dbName).collection(constants.collection).find({ "idPelicula": oid }).toArray().then((data) => {
            if (data === null) { return res.status(204).json({}) }
            return res.status(200).json(data)

        }).catch((e) => { console.error(e); res.status(500).json({ error: "error interno en la aplicación" }) })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "error interno en la aplicación" })
    }



}


