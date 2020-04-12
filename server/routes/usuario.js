const express = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const _ = require('underscore')


const app = express()

app.get('/usuario', function (req, res) {

  let desde = req.query.desde
  desde = Number(desde)

  let limite = req.query.limite || 5
  limite = Number(limite)

  Usuario.find({ estado: true }, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      Usuario.count({ estado: true }, (err, conteo) => {

        res.json({
          ok: true,
          total: conteo,
          usuarios
        })
      })


    })
})

app.post('/usuario', function (req, res) {
  let body = req.body

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  })

  usuario.save((err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    return res.json({
      ok: true,
      usuario: usuarioDB
    })

  })
})

app.put('/usuario/:id', function (req, res) {
  let id = req.params.id

  // Se puede usar destructuracion
  // let { google, password, ...bodyFiltrado } = req.body
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])


  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    })
  })


})

app.delete('/usuario/:id', function (req, res) {

  let id = req.params.id

  Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado
    })

  })

})

module.exports = app