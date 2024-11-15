import { Int32, ObjectId } from "mongodb";


export const Actor = {_id:ObjectId,idPelicula:String,nombre:String,edad:Int32,estaRetirado:Boolean,premios:Array};