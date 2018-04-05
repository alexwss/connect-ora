import util as u

parametrosEntrada = ["user", "password", "127.0.0.1/ORCL", "select * from  atendimento where rownum < 100"]

try:
    result = u.getCursor(parametrosEntrada)
except Exception as erro:
    u.error(erro)

try:
    print(u.parseResultToJson(result))
except Exception as erro:
    u.error(erro)
