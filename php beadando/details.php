<?php
    session_start();
    include 'Storage.php';
    $pokemonsFile = new JsonIO('pokemons.json');
    $pokemonData = new Storage($pokemonsFile);
    $usersFile = new JsonIO('users.json');
    $userData = new Storage($usersFile);
    $pokemons = $pokemonData -> findAll();
    $users = $userData -> findAll();

    if(count($_GET) > 0){
        if (isset($_GET['id'])){
            $pokemon = $pokemonData->findById($_GET['id']);
            if ($pokemon === null){
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
    <title>IKémon | Pikachu</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/details.css">
</head>

<body>
    <header>
        <h1><a href="index.php">IKémon</a> > <?php echo $pokemon['name'];?></h1>
    </header>
    <div id="content">
        <div id="details">
            <div class="image clr-<?php echo $pokemon['type'];?>">
                <img src="<?php echo $pokemon['image'];?>" alt="">
            </div>
            <div class="info">
                <div class="description">
                    <?php echo $pokemon['description'];?> </div>
                <span class="card-type"><span class="icon">🏷</span> Type: <?php echo $pokemon['type'];?></span>
                <div class="attributes">
                    <div class="card-hp"><span class="icon">❤</span> Health: <?php echo $pokemon['hp'];?></div>
                    <div class="card-attack"><span class="icon">⚔</span> Attack: <?php echo $pokemon['attack'];?></div>
                    <div class="card-defense"><span class="icon">🛡</span> Defense: <?php echo $pokemon['defense'];?></div>
                </div>
            </div>
        </div>
    </div>
    <footer>
        <p>IKémon | ELTE IK Webprogramozás</p>
    </footer>
</body>
</html>