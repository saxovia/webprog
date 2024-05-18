<?php
    //file imports
    session_start();
    include 'Storage.php';
    $pokemonsFile = new JsonIO('pokemons.json');
    $pokemonData = new Storage($pokemonsFile);
    $usersFile = new JsonIO('users.json');
    $userData = new Storage($usersFile);
    $pokemons = $pokemonData -> findAll();// json_decode(file_get_contents('slopes.json'), true);
    $users = $userData -> findAll();

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
    <title>IKémon | Home</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/cards.css">
</head>

<body>
    <header>
        <div id="headerleft"><h1><a href="index.php">IKémon</a> > Home</h1></div>
    </header>
    <div id="content">
        <div id="card-list">
            <?php foreach ($pokemons as $pokemon => $data) {
                echo '<div class="pokemon-card">';
                echo '<div class="image clr-' . $data['type'] . '">';
                echo '<img src="'. $data['image'] . '" alt="">';
                echo '</div>';

                echo '<div class="details">';
                echo '<h2><a href="details.php?id=' . $pokemon . '">' . $data['name'] . '</a></h2>';
                echo '<span class="card-type"><span class="icon">🏷</span> ' . $data['type'] . '</span>';
                echo '<span class="attributes">';
                echo '<span class="card-hp"><span class="icon">❤</span> ' . $data['hp'] . '</span>';
                echo '<span class="card-attack"><span class="icon">⚔</span> ' . $data['attack'] . '</span>';
                echo '<span class="card-defense"><span class="icon">🛡</span> ' . $data['defense'] . '</span>';
                echo '</span>';
                echo '</div>';
                if (isset($_SESSION['id'])){
                    echo '<div class="buy">';
                    echo '<span class="card-price"><span class="icon">💰</span> ' . $data['price'] . '</span>';
                    echo '</div>';
                }
                echo '</div>';
                echo '</a>';
            }
            ?>
        </div>
    </div>
    <footer>
        <p>IKémon | ELTE IK Webprogramozás</p>
    </footer>
</body>

</html>