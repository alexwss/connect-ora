'use strict';

/**
 * Module dependencies
 * @api private
 */


const files = {
    'select': __dirname + '//sources//select.py'
}

const u = require('./util');

const config = {};


/**
 * Não faz nada, o 'str' entra e só retorna texto fixo
 * @param {String} str
 * @return {String}
 * @api private 
 */
exports.teste = function teste(str) {
    return 'Oi eu sou o gugu ,' + str;
}

/**
 * Configuração de acesso ao banco de dados 
 * @param {String} user
 * @param {String} password
 * @param {String} hostname
 * @return {Void}
 * @api private
 *
 */
exports.setConfig = function setDB(user, password, hostname) {
    config.user = user;
    config.password = password;
    config.hostname = hostname;
}

/**
 *Configuração do path ou alias do Python <Não Obrigatório>
 * @param {String} alias
 * @return {Void}
 * @api private
 */
exports.setPythonAlias = function setPythonAlias(alias) {
    config.pythonAlias = alias;
}

/**
 * Execução do Select, parameter será lista de objeto Key:Value exemplo: 
 * [{key:0,value:"String"},{key:1,value:"Decimal"}]
 * @param {String} statement
 * @param {Object} parameter
 * @return {Object}
 * @api private
 */
exports.select = function select(statement, parameter) {
    return new Promise(function(resolve, reject) {
        u.callPython(files['select'], config, statement, parameter)
            .then(function(value) {
                resolve(value);
            })
            .catch(function(reason) {
                reject(new Error('reason'));
            });
    });
}

/**
 * Biblioteca de tipos de dados para parametros, identificados por "?"
 @ @property
 * @api private
 */
exports.type = {
    /**
     * Opção de Tipo de dado String para parametros
     * Antonio Kleber Rodrigues
     */
    "String": "string",
    "Decimal": "decimal",
    "PQP": "blashbla"
};

/**
 * Opção de Tipo de dado String para parametros
 * @property {String}
 * @api private
 */
exports.type.string = "String";

/**
 * Opção de Tipo de dado Decimal para parametros
 * @property {String}
 * @api private
 */
exports.type.decimal = "Decimal";