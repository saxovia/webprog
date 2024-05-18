<?php
    session_start();
    include 'Storage.php';
    $pokemonsFile = new JsonIO('pokemons.json');
    $pokemonData = new Storage($pokemonsFile);
    $usersFile = new JsonIO('users.json');
    $userData = new Storage($usersFile);
    $pokemons = $pokemonData -> findAll();
    $users = $userData -> findAll();

    if(!isset($_SESSION['id'])|| $_SESSION['id'] != 'admin'){
        header("Location: index.php");
        exit();
    }
    $errors = [];


    if(count($_GET) > 0){
        if (!isset($_GET['name']) || $_GET['name'] == ''){
            $errors[] = 'Please enter a name.';
        }
        else if (strlen($_GET['name']) < 3){
            $errors[] = 'Name must be at least 3 characters long.';
        }
        else if (strlen($_GET['name']) > 25){
            $errors[] = 'Name must be at most 25 characters long.';
        }
        if (!isset($_GET['type'])|| $_GET['type'] == ''){
            $errors[] = 'Please enter a type.';
        }
        if (!isset($_GET['hp']) || $_GET['hp'] == ''){
            $errors[] = 'Please enter a health value.';
        }
        else if ($_GET['hp'] < 1 || $_GET['hp'] > 100){
            $errors[] = 'Health value must be between 1 and 100.';
        }
        if (!isset($_GET['attack']) || $_GET['attack'] == ''){
            $errors[] = 'Please enter an attack value.';
        }
        else if ($_GET['attack'] < 1 || $_GET['attack'] > 100){
            $errors[] = 'Attack value must be between 1 and 100.';
        }
        if (!isset($_GET['defense']) || $_GET['defense'] == ''){
            $errors[] = 'Please enter a defense value.';
        }
        else if ($_GET['defense'] < 1 || $_GET['defense'] > 100){
            $errors[] = 'Defense value must be between 1 and 100.';
        }
        if (!isset($_GET['price'])|| $_GET['price'] == ''){
            $errors[] = 'Please enter a price.';
        }
        else if ($_GET['price'] < 1 || $_GET['price'] > 1000){
            $errors[] = 'Price must be between 1 and 1000.';
        }
        if (!isset($_GET['description'])|| $_GET['description'] == ''){
            $errors[] = 'Please enter a description.';
        }
        else if (strlen($_GET['description']) < 10){
            $errors[] = 'Description must be at least 10 characters long.';
        }
        else if (strlen($_GET['description']) > 500){
            $errors[] = 'Description must be at most 500 characters long.';
        }
        if (!isset($_GET['image']) || $_GET['image'] == ''){
            $errors[] = 'Please enter an image.';
        }
        if (count($errors) <= 0){
            $data = ([
                'name' => $_GET['name'],
                'type' => $_GET['type'],
                'hp' => $_GET['hp'],
                'attack' => $_GET['attack'],
                'defense' => $_GET['defense'],
                'price' => $_GET['price'],
                'description' => $_GET['description'],
                'image' => $_GET['image'],
                'userid' => '0'
            ]);
            $recordsByName = $pokemonData->findOne(['name' => $_GET['name']]);
            if ($recordsByName === null) {
                $id = (count($pokemons));
                $data['userid'] = $_SESSION['id'];
                $pokemonData->add($data, $id);
                $user = $userData->findById($_SESSION['id']);
                $user['cards'][] = $id;                
            } else {
                $existingRecord = $pokemonData->findById($recordsByName['id']);
                $data['id'] = $recordsByName['id'];
                $pokemonData->update($recordsByName['id'] ,$data);
            }
            header("Location: index.php");
            exit();
        }
    }

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Page</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <header>
        <h1><a href="index.php">IKémon</a> > Admin</h1>
    </header>
    
    <div id="content">
    <h2>Create a new Pokémon</h2>
    <form action="admin.php" novalidate>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required><br><br>
        
        <label for="type">Type:</label>
        <select id="type" name="type">
            <option value="normal">normal</option>
            <option value="fire">fire</option>
            <option value="water">water</option>
            <option value="grass">grass</option>
            <option value="electric">electric</option>
            <option value="ice">ice</option>
            <option value="fighting">fighting</option>
            <option value="poison">poison</option>
            <option value="ground">ground</option>
            <option value="flying">flying</option>
            <option value="psychic">psychic</option>
            <option value="bug">bug</option>
            <option value="rock">rock</option>
            <option value="ghost">ghost</option>
            <option value="dark">dark</option>
            <option value="dragon">dragon</option>
            <option value="steel">steel</option>
            <option value="fairy">fairy</option>
        </select><br><br>
        <label for="hp">Health:</label>
        <input type="number" id="hp" name="hp" min="1" max="100" required><br><br>
        <label for="attack">Attack:</label>
        <input type="number" id="attack" name="attack" min="1" max="100" required><br><br>
        <label for="defense">Defense:</label>
        <input type="number" id="defense" name="defense" min="1" max="100" required><br><br>
        <label for="price">Price:</label>
        <input type="number" id="price" name="price" min="1" max="1000" required><br><br>
        <label for="description">Description:</label>
        <input type="text" id="description" name="description" required><br><br>
        <label for="image">Image:</label>
        <input type="text" id="image" name="image" required><br><br>
        
        <input type="submit" value="Add">
    </form>
    <div id="errors">
        <?php if (count($errors) > 0){
            echo '<ul>';
            foreach ($errors as $error){
                echo "<li>$error</li>";
            }
            echo '</ul>';
        } ?>
    </div>
    </div>
</body>
</html>