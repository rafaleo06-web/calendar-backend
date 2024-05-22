const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, loginUsuario, revalidarToken } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
// const router = express.Router

const router = Router();

//todo: Cuando se accede a esta ruta, la función de callback se ejecuta
router.post(
  "/new",
  [
    check("name", "el nombre es obligatorio").not().isEmpty(),
    check("email", "el email es obligatorio").isEmail(),
    check("password", "el password debe tener 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  crearUsuario
);
router.post(
  "/",
  [
    check("email", "el email es obligatorio").isEmail(),
    check("password", "el password debe tener 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  loginUsuario
);

router.get("/renew", validarJWT, revalidarToken);

// router.post(
//   "/renew",
//   [
//     check("email", "el email es obligatorio").isEmail(),
//     check("password", "el password debe tener 6 caracteres").isLength({ min: 6 }),
//   ],
//   revalidarToken
// );

module.exports = router;
