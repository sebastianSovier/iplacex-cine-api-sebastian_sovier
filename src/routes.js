import  express  from 'express';
import { handleGetPeliculaByIdRequest,handleGetPeliculasRequest,handleInsertPeliculaRequest,handleUpdatePeliculaByIdRequest,handleDeletePeliculaByIdRequest} from "../src/pelicula/controller.js"
import { handleGetActorByIdRequest,handleGetActoresByPeliculaIdRequest,handleGetActoresRequest,handleInsertActorRequest} from "../src/actor/controller.js"

const peliculaRoutes = express.Router();

const actorRoutes = express.Router();




peliculaRoutes.post('/pelicula',handleInsertPeliculaRequest);
peliculaRoutes.get("/peliculas",handleGetPeliculasRequest);
peliculaRoutes.get("/pelicula/:id",handleGetPeliculaByIdRequest);
peliculaRoutes.put("/pelicula/:id",handleUpdatePeliculaByIdRequest);
peliculaRoutes.delete("/pelicula/:id",handleDeletePeliculaByIdRequest);


actorRoutes.post('/actor',handleInsertActorRequest);
actorRoutes.get("/actores",handleGetActoresRequest);
actorRoutes.get("/actor/:id",handleGetActorByIdRequest);
actorRoutes.get("/actor/:pelicula/pelicula",handleGetActoresByPeliculaIdRequest);

export { peliculaRoutes, actorRoutes };
