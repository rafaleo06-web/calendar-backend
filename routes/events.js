const { Router } = require("express");
const { check } = require("express-validator");
const { createEvents, deleteEvents, getEvents, updateEvents } = require("../controllers/events");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

const router = Router();

//valid for all the requests
router.use(validarJWT);

//obtener eventos
router.get("/", getEvents);
router.post(
  "/",
  [
    check("title", "el titulo es obligatorio").not().isEmpty(),
    check("start", "fecha de inicio es obligatoria").custom(isDate),
    validarCampos,
  ],
  createEvents
);
router.put("/:id", updateEvents);
router.delete("/:id", deleteEvents);

module.exports = router;
