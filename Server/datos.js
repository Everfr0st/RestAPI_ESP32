const { Router } = require("express");
const router = Router();
const mysql = require("mysql");

// se crea la conexi√≥n a mysql
const connection = mysql.createPool({
  connectionLimit: 500,
  host: "localhost",
  user: "root",
  password: "My!sqli2023", //el password de ingreso a mysql
  database: "proyectoIoT",
  port: 3306,
});

//function get en la ruta /datos, que trae todos los datos almacenados en la tabla
router.get("/datos", (req, res) => {
  var json1 = {}; //variable para almacenar cada registro que se lea, en formato json
  var arreglo = []; //variable para almacenar todos los datos, en formato arreglo de json
  connection.getConnection(function (error, tempConn) {
    //conexion a mysql
    if (error) {
      throw error; //si no se pudo conectar
    } else {
      console.log("Conexion correcta.");
      //ejecuci√≥n de la consulta
      tempConn.query("SELECT * FROM datosNodo", function (error, result) {
        var resultado = result; //se almacena el resultado de la consulta en la variable resultado
        if (error) {
          throw error;
          res.send("error en la ejecuci√≥n del query");
        } else {
          tempConn.release(); //se librea la conexi√≥n
          for (i = 0; i < resultado.length; i++) {
            //se lee el resultado y se arma el json
            json1 = {
	      id: resultado[i].id,
              idnodo: resultado[i].idnodo,
              temperatura: resultado[i].temperatura,
              humo: resultado[i].humo,
              fecha: resultado[i].tiempo,
            };
            console.log(json1); //se muestra el json en la consola
            arreglo.push(json1); //se a√±ade el json al arreglo
          }
          res.json(arreglo); //se retorna el arreglo
        }
      });
    }
  });
});

//funciÛn post en la ruta /datos que recibe datos
router.post("/datos", (req, res) => {
  console.log(req.body); //mustra en consola el json que llego
  json1 = req.body; //se almacena el json recibido en la variable json1
  connection.getConnection(function (error, tempConn) {
    //conexion a mysql
    if (error) {
      throw error; //en caso de error en la conexion
    } else {
      console.log("Conexion correcta.");
      tempConn.query(
        "INSERT INTO datosNodo VALUES(null, ?, ?, ?, ?,now(6))", // SACAR EL TIEMPO ACTUAL DESDE LA DB
        //le cambiÈ el valor tiempo por now()
        //poner la hora con mysql
        // "select * from datosNodo where fecha between valor1 and valor2"
        [json1.idnodo, json1.temperatura, json1.humo, json1.estado],
        function (error, result) {
          //se ejecuta la inserciÛn
          if (error) {
            res.send("error al ejecutar el query");
          } else {
            tempConn.release();
            res.send("datos almacenados"); //mensaje de respuesta
          }
        }
      );
    }
  });
});

router.get("/datos/:idnodo", (req, res) => {
  var json1 = {}; //variable para almacenar cada registro que se lea, en formato json
  var arreglo = []; //variable para almacenar todos los datos, en formato arreglo de json
  var id = req.params.idnodo; //recogemos el par√°metro enviado en la url
  connection.getConnection(function (error, tempConn) {
    //conexion a mysql
    if (error) {
      throw error; //si no se pudo conectar
    } else {
      console.log("Conexion correcta.");
      //ejecuci√≥n de la consulta
      tempConn.query(
        "SELECT * FROM datosNodo where idnodo=?",
        [id],
        function (error, result) {
          var resultado = result; //se almacena el resultado de la consulta en la variable resultado
          if (error) {
            throw error;
            //res.send("error en la ejecuci√≥n del query");
          } else {
            tempConn.release(); //se libera la conexi√≥n
            for (i = 0; i < resultado.length; i++) {
              //se lee el resultado y se arma el json
              json1 = {
                idnodo: resultado[i].idnodo,
                temperatura: resultado[i].temperatura,
                humo: resultado[i].humo,
                fecha: resultado[i].tiempo,
              };
              console.log(json1); //se muestra el json en la consola
              arreglo.push(json1); //se a√±ade el json al arreglo
            }
            res.json(arreglo); //se retorna el arreglo
          }
        }
      );
    }
  });
});

router.get('/datos-ultimos/:idnodo', (req, res) => {
    var json1 = {}; //variable para almacenar cada registro que se lea, en formato json
    var arreglo = []; //variable para almacenar todos los datos, en formato arreglo de json
    var id = req.params.idnodo; //recogemos el par·metro enviado en la url

    connection.getConnection(function (error, tempConn) { //conexion a mysql
        if (error) {
            throw error;  //si no se pudo conectar
        } else {
            console.log('Conexion correcta.');
            //ejecuciÛn de la consulta
            tempConn.query('SELECT * FROM datosNodo where idnodo=? ORDER BY id DESC LIMIT 1 ', [id], function (error, result) {
                var resultado = result; //se almacena el resultado de la consulta en la variable resultado
                if (error) {
                    throw error;
                    //res.send("error en la ejecuciÛn del query");
                } else {
                    tempConn.release(); //se libera la conexiÛn
                    for (i = 0; i < resultado.length; i++) { 		//se lee el resultado y se arma el json
                        json1 = { "idnodo": resultado[i].idnodo, "temperatura": resultado[i].temperatura, "humo": resultado[i].humo, "estado": resultado[i].estado, "fecha": resultado[i].timestamp };
                        console.log(json1); //se muestra el json en la consola
                        arreglo.push(json1); //se aÒade el json al arreglo
                    }
                    res.json(arreglo); //se retorna el arreglo
                }
            }
            );
        }
    });
});
module.exports = router;
