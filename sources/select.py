import util as u

try:
	parametrosEntrada = u.getParametrosEntrada()
except Exception as erro:
	u.error(erro)

try:
    result = u.getCursor(parametrosEntrada)
except Exception as erro:
    u.error(erro)

try:
    print(u.parseResultToJson(result))
except Exception as erro:
    u.error(erro)