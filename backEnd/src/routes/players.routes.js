import {Router} from "express"
const router = Router()
import * as playerController from "../controllers/player.controller"
import { checkDuplicateMobile } from "../middlewares/verifyNewPlayer";


router.get('/', playerController.getPlayer)
router.post('/', [checkDuplicateMobile,playerController.createPlayer])
router.put('/:playerId', playerController.updatePlayersById)
router.get('/:playerId', playerController.getPlayersById)
router.delete('/:playerId', playerController.deletePlayerById)


export default router;