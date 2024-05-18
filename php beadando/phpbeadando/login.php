<?php
    session_start();
    include 'Storage.php';
    $usersFile = new JsonIO('users.json');
    $userData = new Storage($usersFile);
    $users = $userData -> findAll();

?>
    <?php
        $errors = [];
    if (isset($_SESSION['id'])) {
        header("Location: index.php");
        exit();
    }
    if ($_SERVER['REQUEST_METHOD'] === 'POST'){
        if (!(isset($_GET['username']))){
            $errors[] = 'Please enter a name.';
        }
        if(!(isset($_GET['password']))){
            $errors[] = 'Please enter a password.';
        }
        if (isset($_POST['username']) && isset($_POST["password"])) {
            $username = $_POST['username'];
            $password = $_POST["password"];
            if($userData->findOne(['username' => $_POST['username']]) === null) {
                $errors[] =("Invalid username or password.");
            }else{
                $usersByName = $userData->findOne(['username' => $_POST['username']]);
                if ($userData->findById(($usersByName['id']))['password'] == $password) {
                    $_SESSION['id'] = $usersByName['id'];
                    header("Location: /index.php?{$username}");
                    exit();
                }
                else{
                    $errors[] =("Invalid username or password.");
                }
            }
        }
    }
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/details.css">
</head>
<body>
    <header>
        <h1><a href="index.php">IKémon</a> > Login</h1>
    </header>
    <div id="content">
    <h2>Login</h2>
    <p>Please enter your username and password.</p>
    <div id="errors">
        <?php if (count($errors) > 0){
            echo '<ul>';
            foreach ($errors as $error){
                echo "<li>$error</li>";
            }
            echo '</ul>';
        } ?>
    </div>
    <form method="POST" action="login.php" novalidate>
        <label for='name'>Username:</label>
        <input type="text" id='username' name='username' required><br><br>
        
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required><br><br>
        
        <input type="submit" value="Login">
    </form>

    <br>
    Don't have an account? <a href="signup.php">Sign up here.</a>
    <br>

    </div>
    <footer>
        <p>IKémon | ELTE IK Webprogramozás</p>
    </footer>
</body>
</html>
