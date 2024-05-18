<?php
    session_start();
    include 'Storage.php';
    $usersFile = new JsonIO('users.json');
    $userData = new Storage($usersFile);
    $users = $userData -> findAll();
    $errors = [];
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        if (!isset($_POST['username'])){
            $errors[] = 'Please enter a name.';
        }
        else if (strlen($_POST['username']) < 3){
            $errors[] = 'Name must be at least 3 characters long.';
        }
        else if (strlen($_POST['username']) > 25){
            $errors[] = 'Name must be at most 25 characters long.';
        }
        if (!isset($_POST['email'])){
            $errors[] = 'Please enter an email.';
        }
        else if (strlen($_POST['email']) < 3){
            $errors[] = 'Email must be at least 3 characters long.';
        }
        else if (strlen($_POST['email']) > 25){
            $errors[] = 'Email must be at most 25 characters long.';
        }
        else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid email format.';
        }
        if (!isset($_GET['password'])){
            $errors[] = 'Please enter a password.';
        }
        else if (strlen($_POST['password']) < 3){
            $errors[] = 'Password must be at least 3 characters long.';
        }
        else if (strlen($_POST['password']) > 25){
            $errors[] = 'Password must be at most 25 characters long.';
        }
        if (!isset($_GET['password2'])){
            $errors[] = 'Please enter a password again.';
        }
        else if (strlen($_POST['password2']) < 3){
            $errors[] = 'Password must be at least 3 characters long.';
        }
        else if (strlen($_POST['password2']) > 25){
            $errors[] = 'Password must be at most 25 characters long.';
        }
        else if ($_POST['password'] != $_POST['password2']){
            $errors[] = 'Passwords must match.';
        }
        if (count($errors) <= 0){
            $data = ([
                'username' => $_POST['username'],
                'email' => $_POST['email'],
                'password' => $_POST['password'],
                'money' => 1000,
                'adminaccess' => false,
                'cards' => []
            ]);
            $recordsByName = $userData->findOne(['username' => $_POST['username']]);
            if ($recordsByName === null) {
                $id = uniqid();
                $data['id'] = $id;
                $userData->addUser($data, $id);
                $_SESSION['id'] = $id;
                $username = $_POST['username'];
                header("Location: /index.php?{$username}");
                exit();
            }
            else{
                $errors[] = 'Username already exists.';
            }
        }
    }

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <header>
        <h1><a href="index.php">IKémon</a> > Signup</h1>
    </header>
    
    <div id="content">
    <h2>Signup</h2>
    <p>Please enter your username and password.</p>
    <form method="POST" action="signup.php" novalidate>
        <label for='username'>Username:</label>
        <input type="text" id='username' name='username' required value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : ''; ?>"><br><br>
        <label for='email'>Email:</label>
        <input type="text" id='email' name='email' required value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>"><br><br>

        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required><br><br>
        <label for="password2">Password again:</label>
        <input type="password" id="password2" name="password2" required><br><br>
        <input type="submit" value="Signup">
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