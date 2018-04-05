import util as u

parametrosEntrada = ["bpm", "bpm", "10.1.1.117/ORCL", "select * from  atendimento where rownum < 100"]

try:
    result = u.getCursor(parametrosEntrada)
except Exception as erro:
    u.error(erro)

try:
    print(u.parseResultToJson(result))
except Exception as erro:
    u.error(erro)