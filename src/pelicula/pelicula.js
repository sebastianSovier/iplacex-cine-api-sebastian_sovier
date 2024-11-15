import { Int32, ObjectId } from "mongodb";


export const Pelicula = {_id:ObjectId,nombre:String,generos:Array,anioEstreno:Int32}