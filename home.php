<?php
session_start();
if(!isset($_SESSION['username'])){
    header('location:login.php');
}
?>

<!-- <!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome Page</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
  </head>
  <body>
  <h1>Welcome 
  <?php
  echo $_SESSION['username'];
  ?>
  </h1>
  <div class="container">
    <a href="logout.php" class='btn btn-primary'>Logout</a>
  </div>
  </body>
</html> -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>AI Chat Bot</title>
  <link rel="stylesheet" href="styles.css"/>
</head>
<body>

  <div class="chat-container">
    <div class="ai-chat-box">
      <img src="ai.png" alt="AI" width="50"/>
      <div class="ai-chat-aera">
        Hello! How can I help you today?
      </div>
    </div>
  </div>

  <div class="prompt-area">
    <!-- ✅ ONE input for both message and URL -->
    <input type="text" id="prompt" placeholder="Type message or paste URL..." />

    <!-- Submit button -->
    <button id="submit">
      <img src="submit.svg" alt="Submit" />
    </button>

    <!-- Upload image button -->
    <button id="image">
      <img src="image-icon.svg" alt="Upload Image" />
    </button>
    <input type="file" id="image-input" accept="image/png, image/jpeg" hidden />
    <a href="logout.php" class='btn btn-primary w-100'>Logout</a>
  </div>

  <script src="script.js"></script>

</body>
</html>
