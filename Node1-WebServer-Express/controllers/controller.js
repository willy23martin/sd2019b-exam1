'use strict'

// Define the environmental variables (see .sample-env file and edit into .env)
var environmentalConfig = require('dotenv');
environmentalConfig.config();

var IPv4networkInterface = process.env.IPV4_NETWORK_INTERFACE;

// Reference to database connection:
var connection = require('../databases/mysql_manager');

// Define the actual service IPv4 and hostname:
var operativeSystem = require('os');
var networkInterfaces = operativeSystem.networkInterfaces();
var apiServiceLocation = {
    apiServiceName: operativeSystem.hostname(),
    apiServiceAddress: '192.168 .1 .50'
};

/**
 * Define the controller functions that will serve as the action listeners to respond to API requests.
 */
var controller = {
    microservice: function(req, res) {
        var microserviceId = req.params.microserviceId;
        return res.status(200).send({
            "status": "200 OK",
            "message": `Microservices API works for microserviceId: ${microserviceId}`,
            "webServerLocation": apiServiceLocation
        });
    },
    users: function(req, res) {
        console.log('Consultando los usuarios...')
            // Connect to database:
            //connection.connect();
        connection.query('SELECT * FROM `users`', function(error, results, fields) {
            if (error) {
                throw error;
            } else {
                console.log('The solution is: ', results);
                return res.status(200).send({
                    "status": "200 OK",
                    "message": `Microservices API works for users`,
                    "results": results,
                    "webServerLocation": apiServiceLocation
                });
            }
        });
        //connection.end();
    },
    createUser: function(req, res) {
        console.log('Consultando los usuarios...')
            // Connect to database:
            //connection.connect();
        var userId = parseInt(req.body.id, 10);
        var username = req.body.name;
        var insertSQLStatement = `INSERT INTO users (\` user_id\`, name) VALUES (${userId},'${username}')`;
        connection.query(insertSQLStatement, function(error, results, fields) {
            if (error) {
                throw error;
            } else {
                console.log('The solution is: ', results);
                return res.status(200).send({
                    "status": "200 OK",
                    "message": `User was created`,
                    "results": results,
                    "webServerLocation": apiServiceLocation
                });
            }
        });
    },
    getCustomerInfo: function(req, res) {
        console.log(`Consultando la información del cliente: ${req.params.cedula} ...`);
        return res.status(200).send({
            "telephonyProvider": {
                "name": "KONECTA"
            }
        });
    },
    insertarIlocalizados: function(req, res) {
        var existeCliente = (req.body.datos[2].propiedad == "id_cliente");
        var idCliente = req.body.datos[2].valor;
        console.log(`Reportando la información del contacto ilocalizado con id_cliente: ${idCliente}`);
        if (existeCliente) {
            return res.status(200).send({
                "data": {
                    "id_respuesta": "11",
                    "mensaje": `El contacto ilocalizado ${idCliente} se registra sin inconvenientes`,
                    "codigo": 0,
                    "estado": "OK"
                }
            });
        } else {
            return res.status(500).send({
                "data": {
                    "id_respuesta": "11",
                    "mensaje": `El contacto ilocalizado ${idCliente} no se registró`,
                    "codigo": parseInt(Math.random() * (2 - 0 + 1) + 0),
                    "estado": "FAILED"
                }
            });
        }

    }

};

// Reference https://futurestud.io/tutorials/generate-a-random-number-in-range-with-javascript-node-js

module.exports = controller;