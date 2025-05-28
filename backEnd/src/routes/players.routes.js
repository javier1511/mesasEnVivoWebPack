import {Router} from "express"
const router = Router()
import * as playerController from "../controllers/player.controller"
import { checkDuplicateMobile } from "../middlewares/verifyNewPlayer";
import {authJwt} from "../middlewares"


router.get('/', playerController.getPlayer)
router.post('/', [checkDuplicateMobile,playerController.createPlayer])
router.put('/:playerId', [authJwt.verifyToken, authJwt.isUser], playerController.updatePlayersById)
router.get('/:playerId', playerController.getPlayersById)
router.delete('/:playerId',[authJwt.verifyToken, authJwt.isAdmin], playerController.deletePlayerById)


export default router;