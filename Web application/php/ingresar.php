<?php
//if (isset($_POST["user"]) && isset($_POST["pass"])) {
    $user = $_POST["user"];
    $password = $_POST["pass"];

    $serverurl = "http://20.42.107.153:3000/usuarios/$user/$password";
    $curl = curl_init($serverurl);

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    
    curl_close($curl);

    if ($response === false) {
        header("Location: ../../trabajo_iot/index.html");
        exit; // Exit to prevent further execution
    }

    $resp = json_decode($response);

    if (is_array($resp) && count($resp) != 0) {
        session_start();
        $_SESSION["usuario"] = $resp[0]->nombre;

        if ($resp[0]->tipo == 2) {
            header("Location: ../../trabajo_iot/admin.html");
            exit; // Exit to prevent further execution
        }
        if ($resp[0]->tipo == 1) {
            header("Location: ../../trabajo_iot/oficina1.html");
            exit; // Exit to prevent further execution
        }
    } else {
        echo "<script>alert('Ingrese usuario y contraseña'); window.location.href = '../../trabajo_iot/index.html';</script>";
        exit; // Exit to  prevent further execution
    }
// } else {
//     // Handle the case where "user" or "pass" are not set in $_POST.
//     //header("Location: ../../trabajo_iot/login.html");
//     echo("response = sadfasd");
//     exit; // Exit to prevent further execution
// }
?>
