<?php
    session_start();
    include 'Storage.php';
    $usersFile = new JsonIO('users.json');
    $userData = new Storage($usersFile);
    $users = $userData -> findAll();
    $pokemonFile = new JsonIO('pokemons.json');
    $pokemonData = new Storage($pokemonFile);
    $pokemons = $pokemonData -> findAll();

    if(count($_GET) > 0){
        if (isset($_GET['id'])){
            $user = $userData->findById($_GET['id']);
            if ($user === null){
                header("Location: index.php");
                exit();
            }
        }
        else{
            header("Location: index.php");
            exit();
        }
    }
    else{
        header("Location: index.php");
        exit();
    }
    if (isset($_SESSION['id'])){ // user is logged in
        if($userData->findById($_SESSION['id'])['adminaccess'] == true){ //admin
            $user = $userData->findById($_SESSION['id']);
            echo '<div id="sessionheader"><h1><a href="admin.php">Create a card</a> | <a href="user.php?id='. $user['id'] .'">'. $user['username'] . '</a> | <a href="logout.php">Logout</a></h1></div>';
        }
        else{ // standard user
            $user = $userData->findById($_SESSION['id']);
            echo '<div id="sessionheader"><h1> <a href="user.php?id='. $user['id'] .'">'. $user['username'] . '</a> | ' . $user['money'] . '$ | <a href="logout.php">Logout</a></h1></div>';
        }
    }
    else{
        echo '<div id="sessionheader"><h1><a href="login.php">Login</a> | <a href="signup.php">Sign Up</a></h1></div>';
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $user['username'];?></title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    
<header>
        <h1><a href="index.php">IKémon</a> > <?php echo $user['username'];?></h1>
    </header>
    <div id="content">
        <div id="details">
            Username: <?php echo $user['username'];?><br>
            E-mail: <?php echo $user['email'];?><br>
            Money: <?php echo $user['money'];?><br>
            Cards: <?php 
                if ($userData->findById($_SESSION['id'])['adminaccess'] == true){
                    foreach($pokemons as $pokemon){
                        if($pokemon['userid'] == $user['id'] || $pokemon['userid'] == 0  || $pokemon['userid'] == null){
                            echo $pokemon['name'] . ', ';
                        } 
                    }
                }
                else{
                    foreach ($user['cards'] as $card) {
                        echo $card . ', ';
                    }
                }
        ?> <br>

        </div>
    </div>
    <footer>
        <p>IKémon | ELTE IK Webprogramozás</p>
    </footer>
</body>
</html>