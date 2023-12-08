const { Router, json } = require("express");
const router = Router();
const mysql = require("mysql");

// se crea la conexión a mysql
const connection = mysql.createPool({
  connectionLimit: 500,
  host: "localhost",
  user: "root",
  password: "My!sqli2023", //el password de ingreso a mysql
  database: "proyectoIoT",
  port: 3306,
});

// INICIO GET ALL //
router.get("/usuarios", (req, res) => {
  var json1 = {}; //variable para almacenar cada registro que se lea, en formato json
  var arreglo = []; //variable para almacenar todos los datos, en formato arreglo de json
  connection.getConnection(function (error, tempConn) {
    //conexion a mysql
    if (error) {
      throw error; //si no se pudo conectar
    } else {
      console.log("Conexion correcta.");
      //ejecución de la consulta
      tempConn.query("SELECT * FROM usuarios", function (error, result) {
        var resultado = result; //se almacena el resultado de la consulta en la variable resultado
        if (error) {
          throw error;
          res.send("error en la ejecución del query");
        } else {
          tempConn.release(); //se librea la conexión
          for (i = 0; i < resultado.length; i++) {
            //se lee el resultado y se arma el json
            json1 = {
              username: resultado[i].username,
              nombre: resultado[i].nombre,
              tipo: resultado[i].tipo,
              password: resultado[i].password,
            };
            console.log(json1); //se muestra el json en la consola
            arreglo.push(json1); //se añade el json al arreglo
          }
          res.json(arreglo); //se retorna el arreglo
        }
      });
    }
  });
});
// FIN GET ALL //


// INICIO GET IDENTIFICADOR //
router.get("/usuarios/:username", (req, res) => {
    var json1 = {}; //variable para almacenar cada registro que se lea, en formato json
    var arreglo = []; //variable para almacenar todos los datos, en formato arreglo de json
    var id = req.params.username; //recogemos el parámetro enviado en la url
    connection.getConnection(function (error, tempConn) {
      //conexion a mysql
      if (error) {
        throw error; //si no se pudo conectar
      } else {
        console.log("Conexion correcta.");
        //ejecución de la consulta
        tempConn.query(
          "SELECT * FROM usuarios where username=?",
          [id],
          function (error, result) {
            var resultado = result; //se almacena el resultado de la consulta en la variable resultado
            if (error) {
              throw error;
              //res.send("error en la ejecución del query");
            } else {
              tempConn.release(); //se libera la conexión
              for (i = 0; i < resultado.length; i++) {
                //se lee el resultado y se arma el json
                json1 = {
                    username: resultado[i].username,
                    nombre: resultado[i].nombre,
                    tipo: resultado[i].tipo,
                    password: resultado[i].password,
                };
                console.log(json1); //se muestra el json en la consola
                arreglo.push(json1); //se añade el json al arreglo
              }
              res.json(arreglo); //se retorna el arreglo
            }
          }
        );
      }
    });
  });
// FIN GET IDENTIFICADOR //

// INICIO POST //
router.post("/usuarios", (req, res) => {
    console.log(req.body); //mustra en consola el json que llego
    json1 = req.body; //se almacena el json recibido en la variable json1
    connection.getConnection(function (error, tempConn) {
      //conexion a mysql
      if (error) {
        throw error; //en caso de error en la conexion
      } else {
        console.log("Conexion correcta.");
        tempConn.query(
          "INSERT INTO usuarios VALUES(?, ?,?,?)", // SACAR EL TIEMPO ACTUAL DESDE LA DB
          [json1.username, json1.nombre, json1.tipo, json1.password],
          function (error, result) {
            var resultado = result; //se almacena el resultado de la consulta en la variable resultado
            //se ejecuta la inserción
            if (error) {
              res.send("error al ejecutar el query");
            } else {
              tempConn.release();
              res.send("datos almacenados"); //mensaje de respuesta
              for (i = 0; i < resultado.length; i++) {
                //se lee el resultado y se arma el json
                json1 = {
                    username: resultado[i].username,
                    nombre: resultado[i].nombre,
                    tipo: resultado[i].tipo,
                    password: resultado[i].password,
                };
              }  
            }
          }
        );
      }
    });
  });
// FIN POST //

// INICIO PUT //
router.put("/usuarios/:username", (req, res) => {
        const username = req.params.username; // Obtener el ID del usuario a actualizar desde los parámetros de la URL
        const user = req.body; // Obtener los datos actualizados del usuario desde el cuerpo de la solicitud
    
        connection.getConnection(function (error, tempConn) {
            // Conexión a MySQL
            if (error) {
                throw error; // En caso de error en la conexión
            } else {
                console.log("Conexión correcta.");
                tempConn.query(
                    "UPDATE usuarios SET username = ?, nombre = ?, tipo = ?, password = ? WHERE username = ?",
                    [user.username, user.nombre, user.tipo, user.password, username],
                    function (error, result) {
                        if (error) {
                            res.send("Error al ejecutar el query");
                        } else {
                            tempConn.release();
                            res.send("Usuario actualizado exitosamente");
                        }
                    }
                );
            }
        });
    });
//FINAL PUT //

// INICIO DELETE //
router.delete("/usuarios/:username", (req, res) => {
  var username = req.params.username; //recogemos el parámetro enviado en la url
  connection.getConnection(function (error, tempConn) {
    //conexion a mysql
    if (error) {
      throw error; //si no se pudo conectar
    } else {
      console.log("Conexion correcta.");
      //ejecución de la consulta
      tempConn.query(
        "DELETE FROM usuarios where username=?",
        [username],
        function (error, result) {
          var resultado = result; //se almacena el resultado de la consulta en la variable resultado
          if (error) {
            throw error;
            res.send("error en la ejecución del query");
          } else {
            tempConn.release(); //se libera la conexión
            res.send("Usuario eliminado")
          }
        }
      );
    }
  });
});
// FINAL DELETE //

// INICIO GET VALIDAR USUARIO //
router.get("/usuarios/:username/:password", (req, res) => {
  var json1 = {}; //variable para almacenar cada registro que se lea, en formato json
  var arreglo = []; //variable para almacenar todos los datos, en formato arreglo de json
  var user = req.params.username; //recogemos el parámetro (username) enviado en la url
  var password = req.params.password; //recogemos el parámetro (password) enviado en la url
  connection.getConnection(function (error, tempConn) {
    //conexion a mysql
    if (error) {
      throw error; //si no se pudo conectar
    } else {
      console.log("Conexion correcta.");
      //ejecución de la consulta
      tempConn.query(
        "SELECT * FROM usuarios where username=? AND password=?",
        [user, password],
        function (error, result) {
          var resultado = result; //se almacena el resultado de la consulta en la variable resultado
          if (error) {
            throw error;
            //res.send("error en la ejecución del query");
          } else {
            tempConn.release(); //se libera la conexión
            for (i = 0; i < resultado.length; i++) {
              //se lee el resultado y se arma el json
              json1 = {
                  username: resultado[i].username,
                  nombre: resultado[i].nombre,
                  tipo: resultado[i].tipo,
                  password: resultado[i].password,
              };
              console.log(json1); //se muestra el json en la consola
              console.log("Usuario validado")
              arreglo.push(json1); //se añade el json al arreglo
            }
            //res.json({ message: "Acceso concedido", data: arreglo });
            res.json(arreglo);
          }
        }
      );
    }
  });
});
// FIN GET VALIDAR USUARIO //
module.exports = router;