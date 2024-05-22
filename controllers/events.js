const { response } = require("express");
const Evento = require("../models/Evento");

const getEvents = async (req, res = response) => {
  try {
    const events = await Evento.find().populate("user", "name");

    res.json({
      ok: true,
      msg: "Listado de eventos obtenido exitosamente",
      events,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hubo un error al obtener el listado de eventos",
    });
  }
};

const createEvents = async (req, res = response) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventSave = await evento.save();

    res.json({
      ok: true,
      eventSave,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "hable con el admin",
    });
  }
};

const updateEvents = async (req, res = response) => {
  try {
    const eventId = req.params.id;

    let event = await Evento.findById(eventId);
    // event: {
    //      _id: new ObjectId('664bf0308fb15fecd83a3d62'),
    //       title: 'graduacion tt',
    //       notes: 'pagar tt',
    //       start: 1970-01-01T00:00:00.001Z,
    //      end: 1970-01-01T00:01:40.000Z,
    //       user: new ObjectId('66383d2daaa37a37c415012b'),
    //      __v: 0
    //    }

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Event not found",
      });
    }

    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "you have not privileges",
      });
    }

    const newEvent = { ...req.body, user: req.uid };
    const eventUpdated = await Evento.findByIdAndUpdate(eventId, newEvent, { new: true });

    //''body'' sent to from POSTMAN
    // Object.assign(event, req.body);
    // await event.save();

    res.json({
      ok: true,
      msg: "Event updated successfully",
      eventUpdated,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hubo un error al actualizar el evento",
    });
  }
};

const deleteEvents = async (req, res = response) => {
  const eventId = req.params.id;

  try {
    const deletedEvent = await Evento.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado",
      });
    }

    if (deletedEvent.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "you have not privileges",
      });
    }

    res.json({
      ok: true,
      msg: "Evento eliminado exitosamente",
      deletedEvent,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hubo un error al eliminar el evento",
    });
  }
};

module.exports = {
  getEvents,
  createEvents,
  updateEvents,
  deleteEvents,
};
