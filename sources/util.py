import cx_Oracle, sys

keywords = ['DROP', 'DELETE', 'TRUNCATE']


def getParametrosEntrada():
    parametrosEntrada = []

    for v in sys.argv[1:]:
        parametrosEntrada.append(str(v))

    return parametrosEntrada


def converte(json):
    conv = ""
    for i in json:
        conv += str(ord(i)) + "."
    return conv


def desconverte(text):
    arr = text.split(".")
    newtext = ""
    for i in range(0, len(arr) - 1):
        newtext = newtext + chr(int(arr[i]))
    return newtext

def getCursor(parametros):
    user = parametros[0]
    passwd = parametros[1]
    host = parametros[2]
    cursor = cx_Oracle.connect(
        user, passwd, host, encoding="UTF-8", nencoding="UTF-8").cursor()

    validationError = validateStatement(parametros[3])
    if (validationError != None):
        raise Exception(validationError)
    cursor.execute(parametros[3])
    return cursor

def error(err):
    json = '[{"erro":"' + str(err) + '"}]'
    print(converte(json))
    #print(json)
    sys.exit()

def parseResultToJson(result):
    listaTitulo = []
    json = ''

    #gera uma lista com o cabecalho do select
    for i in result.description:
        listaTitulo.append(i)

    #array do JSON
    json = json + '['

    #populando atributos de cada objeto
    for item in result:
        #colchete do primeiro objeto da lista JSON
        json = json + "{"
        controle = 0

        #popula o objeto com cada atributo (key:value)
        for col in listaTitulo:
            resultNovo = str(item[controle])
            json = json + '"{}" : "{}"'.format(str(col[0]).lower(),resultNovo)
            controle = controle + 1
            #verifica se não é o ultimo atributo da linha(tupla)
            if controle != len(listaTitulo):
                json = json + ", "
        #fecha o objeto
        json = json + "}, "
    #no fim removo os dois ultimos caracteres (,[espaço]) para fechar o array do json
    if len(json) > 3:
        json = json[:-2]

    json = json + "]"
    #subistituição do "None" (padrão python) para null (padrão JSON)
    json = json.replace('"None"', 'null')

    result.close();

    #imprime o json para o node pegar os dados
    return converte(json)
    #return json


def sintaxFilter(arr):
    newarr = []
    index = 0
    for i in arr:
        if index % 2 == 0:
            newarr.append(i)
        index += 1
    return newarr

def upperFormat(arr):
    newarr = []
    for i in arr:
        newarr.append(str(i).upper().strip())
    return newarr


def reduceArr(arr):
    res = ""
    for i in arr:
        res += i
    return res


def validateStatement(statement):
    try:
        statement = str(statement)
        arr = statement.split("'")
        sint = sintaxFilter(arr)
        sint = reduceArr(upperFormat(sint))
        words = sint.split(" ")
        for word in words:
            for keyword in keywords:
                if word == keyword:
                    raise PermissionError(word)

    except Exception as error:
        return error
