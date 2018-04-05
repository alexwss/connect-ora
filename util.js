const PythonShell = require('python-shell');

const keywords = ['DROP', 'DELETE', 'TRUNCATE'];


exports.callPython = function callPython(file, config, statement, params) {
    return new Promise(function(resolve, reject) {
        let validationError = validateStatement(statement);
        if (validationError != undefined) {
            reject(new Error('Error ' + err));
        }

        let options = {
            mode: 'text',
            pythonOptions: ['-u'],
            args: [config.user, config.password, config.hostname, statement]
        };

        if (config.pythonAlias !== "undefined") {
            options.pythonPath = config.pythonAlias
        };

        let pyShell;

        try {
            pyShell = new PythonShell(file, options);
        } catch (err) {
            reject(new Error('Error ' + err));
        }

        pyShell.on('message', function(message) {
            let result;
            try {
                result = JSON.parse(decToString(message));
                resolve(result);
            } catch (err) {
                reject(new Error('Error ' + err));
            }
        });
    });
}

let decToString = function(message) {
    /*
    Font: https://stackoverflow.com/questions/14432165/uncaught-syntaxerror-unexpected-token-with-json-parse
    */
    let arr = message.split(".");
    let result = "";
    arr.forEach(element => result += String.fromCharCode(element));
    result = result.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    result = result.replace(/[\u0000-\u0019]+/g, "");
    return result;
}

exports.decToString = decToString;

let validateStatement = function(statement) {
    try {
        statement = statement.toString();
        let arr = statement.split("'");
        let sint = arr.filter((element, index) => {
            if (index % 2 == 0) return element;
        }).map(element => element.toUpperCase().trim());

        sint = sint.reduce((value, element) => value + element);
        let words = sint.split(" ");
        for (let i = 0; i < words.length; i++) {
            for (let j = 0; j < keywords.length; j++) {
                if (words[i] == keywords[j]){
                    throw keywords[j];
				}
            }
        }
    } catch (err) {
        return err;
    }
}

exports.validateStatement = validateStatement;