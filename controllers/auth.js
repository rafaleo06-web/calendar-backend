const { response } = require("express");
var bcrypt = require("bcryptjs");
const Users = require("../models/Users");
const { generateJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Users.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario ya existe",
      });
    }
    usuario = new Users(req.body);
    //Encrypt password
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    //generate our=nuestros JWT=JSON Web Token
    const token = await generateJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
      // name,
      // email,
      // password,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error, hable con el admin",
      // name,
      // email,
      // password,
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Users.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario NO existe",
      });
    }

    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "password invalid",
      });
    }

    //generate our=nuestros JWT=JSON Web Token
    const token = await generateJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error, hable con el admin",
      // name,
      // email,
      // password,
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const uid = req.uid;
  const name = req.name;

  //generate token
  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
