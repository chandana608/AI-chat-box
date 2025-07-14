<?php
$success = 0;
$user = 0;

if($_SERVER['REQUEST_METHOD']=='POST'){
    include 'connect.php';
    $username=$_POST['username'];
    $password=$_POST['password'];

    $sql ="Select * from `registration` where username= '$username'";

    $result=mysqli_query($conn,$sql);

    if ($result) {
        $num = mysqli_num_rows($result);
        if ($num>0) {
            // echo 'user already exist';
            $user=1;
        } else {
            $sql ="insert into `registration`(username,password) values('$username','$password')";
           $result=mysqli_query($conn,$sql);
           if ($result) {
                // echo 'User registeres successfully';
                $success=1;
           } else {
            die(mysqli_error($conn));
           }
        }
    }
}

?>


<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Signup Page</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
    <style>
      body {
        min-height: 100vh;
        background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
      }
      .card {
        border-radius: 1.5rem;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        background: rgba(255,255,255,0.9);
      }
      .form-label {
        color: #185a9d;
        font-weight: 600;
      }
      .btn-primary {
        background: linear-gradient(90deg, #ff512f 0%, #dd2476 100%);
        border: none;
      }
      .btn-primary:hover {
        background: linear-gradient(90deg, #dd2476 0%, #ff512f 100%);
      }
      .login-link {
        background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        border: none;
        color: #fff;
      }
      .login-link:hover {
        background: linear-gradient(90deg, #2575fc 0%, #6a11cb 100%);
        color: #fff;
      }
    </style>
  </head>
  <body>
    <div class="d-flex justify-content-center align-items-center" style="min-height:100vh;">
      <div class="card p-4" style="width: 100%; max-width
      : 400px;">
        <?php
        if ($user) {
          echo '<div class="alert alert-danger alert-dismissible fade show" role="alert">
         <strong>Ohh !</strong> User already exist.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>';
        }
        ?>
        <?php
        if ($success) {
          echo '<div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Success</strong> You are successfully Sign up.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>';
        }
        ?>
        <h1 class="text-center mb-4" style="color:#185a9d; font-weight:700;">Signup Page</h1>
        <form action="signup.php" method="post">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Name</label>
            <input type="text" class="form-control" placeholder="Enter your Username" name="username"/>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control" placeholder="Enter Your Password" name="password" />
          </div>
          <button type="submit" class="btn btn-primary w-100 mb-3">Sign up</button>
          <a href="login.php" class='btn login-link w-100'>Login</a>
        </form>
      </div>
    </div>
  </body>
</html>