<?php
error_reporting(0);

$host = "localhost";
$user = "root";
$pass = "";
$db = "nailart"; // Ganti dengan nama database kamu

$koneksi = mysqli_connect($host, $user, $pass, $db);
if ($koneksi->connect_error) {
    die("Connection failed: " . $koneksi->connect_error);
}

$op = $_GET['op'];
switch($op) {
    
    case 'getServices': getServices(); break;
    case 'createService': createService(); break;
    case 'updateService': updateService(); break;
    case 'getTestimonials': getTestimonials(); break;
    case 'deleteTestimonial': deleteTestimonial(); break;
    case 'getBookings': getBookings(); break;
    case 'createBooking': createBooking(); break;
    case 'createTestimonial': createTestimonial(); break;
    case 'getPromotions': getPromotions(); break;
    case 'createPromotion': createPromotion(); break;
    case 'updatePromotion': updatePromotion(); break;
    case 'deletePromotion': deletePromotion(); break;
    case 'updateTestimonial': updateTestimonial(); break;
    case 'getUsers': getUsers(); break;
    case 'createUser': createUser(); break;
    case 'updateUser': updateUser(); break;
    case 'deleteUser': deleteUser(); break;
    case 'registerUser': registerUser(); break;
    case 'loginUser': loginUser(); break;
    default: normal(); break;
}

function normal() {
    echo json_encode(['message' => 'Welcome to the Nail Art API!']);
}

// Get all services
function getServices() {
    global $koneksi;
    $sql = "SELECT * FROM Services";
    $result = mysqli_query($koneksi, $sql);
    $services = [];
    while($row = mysqli_fetch_assoc($result)) {
        $services[] = $row;
    }
    echo json_encode(['data' => $services]);
}

// Create a new service
function createService() {
    global $koneksi;
    $nama_layanan = $_POST['nama_layanan'];
    $deskripsi = $_POST['deskripsi'];
    $harga = $_POST['harga'];
    $gambar = $_POST['gambar'];

    if ($nama_layanan && $harga) {
        $sql = "INSERT INTO Services (nama_layanan, deskripsi, harga, gambar) 
                VALUES ('$nama_layanan', '$deskripsi', '$harga', '$gambar')";
        $result = mysqli_query($koneksi, $sql);
        $message = $result ? 'Service created successfully' : 'Failed to create service';
    } else {
        $message = 'Missing required fields';
    }
    echo json_encode(['message' => $message]);
}

// Update an existing service
function updateService() {
    global $koneksi;

    $id_layanan = $_GET['id_layanan'];
    $nama_layanan = $_POST['nama_layanan'];
    $deskripsi = $_POST['deskripsi'];
    $harga = $_POST['harga'];
    $gambar = $_POST['gambar'];

    if ($id_layanan) {
        $sql = "UPDATE Services SET 
                    nama_layanan='$nama_layanan', 
                    deskripsi='$deskripsi', 
                    harga='$harga', 
                    gambar='$gambar' 
                WHERE id_layanan='$id_layanan'";

        $q1 = mysqli_query($koneksi, $sql);

        if ($q1) {
            $hasil = "Service updated successfully";
            $status = "success";
        } else {
            $hasil = "Failed to update service: " . mysqli_error($koneksi);
            $status = "error";
        }
    } else {
        $hasil = "ID layanan tidak ditemukan.";
        $status = "error";
    }

    echo json_encode([ 
        "status" => $status, 
        "message" => $hasil 
    ]);
}

// Delete a service
function deleteService() {
    global $koneksi;

    $id_layanan = isset($_GET['id_layanan']) ? $_GET['id_layanan'] : null;

    if (!$id_layanan) {
        echo json_encode([ "status" => "error", "message" => "ID layanan tidak ditemukan" ]);
        return;
    }

    $sql = "DELETE FROM Services WHERE id_layanan = '$id_layanan'";
    $result = mysqli_query($koneksi, $sql);

    if ($result) {
        if (mysqli_affected_rows($koneksi) > 0) {
            echo json_encode([ "status" => "success", "message" => "Service deleted successfully" ]);
        } else {
            echo json_encode([ "status" => "error", "message" => "Service with the provided ID does not exist" ]);
        }
    } else {
        echo json_encode([ "status" => "error", "message" => "Failed to delete service", "error" => mysqli_error($koneksi) ]);
    }
}

// Get all users
function getUsers() {
    global $koneksi;
    $sql = "SELECT * FROM users";
    $result = mysqli_query($koneksi, $sql);
    $users = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }
    echo json_encode(['data' => $users]);
}

// Create a new user
function createUser() {
    global $koneksi;

    $nama = $_POST['nama'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $telepon = $_POST['telepon'];
    $alamat = $_POST['alamat'];
    $role = $_POST['role'];

    if ($nama && $email && $password) {
        $sql = "INSERT INTO users (nama, email, password, telepon, alamat, role) 
                VALUES ('$nama', '$email', '$password', '$telepon', '$alamat', '$role')";
        $result = mysqli_query($koneksi, $sql);
        $message = $result ? 'User created successfully' : 'Failed to create user';
    } else {
        $message = 'Missing required fields';
    }
    echo json_encode(['message' => $message]);
}

// Update an existing user
function updateUser() {
    global $koneksi;

    $id_user = $_GET['id_user'] ?? null;

    if (empty($id_user)) {
        echo json_encode(['message' => 'ID User is required']);
        return;
    }

    $nama = $_POST['nama'] ?? null;
    $email = $_POST['email'] ?? null;
    $password = isset($_POST['password']) ? password_hash($_POST['password'], PASSWORD_BCRYPT) : null;
    $telepon = $_POST['telepon'] ?? null;
    $alamat = $_POST['alamat'] ?? null;
    $role = $_POST['role'] ?? null;

    if (empty($nama) && empty($email) && empty($password) && empty($telepon) && empty($alamat) && empty($role)) {
        echo json_encode(['message' => 'No data to update']);
        return;
    }

    $sql_check = "SELECT 1 FROM users WHERE id_user = ?";
    $stmt_check = mysqli_prepare($koneksi, $sql_check);

    if (!$stmt_check) {
        echo json_encode(['message' => 'Database error during ID check']);
        return;
    }

    mysqli_stmt_bind_param($stmt_check, 'i', $id_user);
    mysqli_stmt_execute($stmt_check);
    mysqli_stmt_store_result($stmt_check);

    if (mysqli_stmt_num_rows($stmt_check) == 0) {
        echo json_encode(['message' => 'User not found']);
        return;
    }

    $updates = [];
    $params = [];

    if ($nama) { $updates[] = "nama=?"; $params[] = $nama; }
    if ($email) { $updates[] = "email=?"; $params[] = $email; }
    if ($password) { $updates[] = "password=?"; $params[] = $password; }
    if ($telepon) { $updates[] = "telepon=?"; $params[] = $telepon; }
    if ($alamat) { $updates[] = "alamat=?"; $params[] = $alamat; }
    if ($role) { $updates[] = "role=?"; $params[] = $role; }

    if (!empty($updates)) {
        $sql_update = "UPDATE users SET " . implode(', ', $updates) . " WHERE id_user=?";
        $stmt_update = mysqli_prepare($koneksi, $sql_update);
        $params[] = $id_user;
        $types = str_repeat('s', count($params) - 1) . 'i';
        mysqli_stmt_bind_param($stmt_update, $types, ...$params);

        if (mysqli_stmt_execute($stmt_update)) {
            echo json_encode(["status" => "success", "message" => "User updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update user"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Missing fields to update"]);
    }
}

// Delete a user
function deleteUser() {
    global $koneksi;

    $id_user = isset($_GET['id_user']) ? $_GET['id_user'] : null;

    if (!$id_user) {
        echo json_encode([ "status" => "error", "message" => "ID user not found" ]);
        return;
    }

    $sql = "DELETE FROM users WHERE id_user='$id_user'";
    $result = mysqli_query($koneksi, $sql);

    if ($result) {
        echo json_encode([ "status" => "success", "message" => "User deleted successfully" ]);
    } else {
        echo json_encode([ "status" => "error", "message" => "Failed to delete user" ]);
    }
}

// API.php
function registerUser() {
    global $koneksi;

    // Mengambil input JSON dari request body
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Memastikan data ter-parse dengan benar
    if (!$data) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
        return;
    }

    // Mengambil data dari input JSON
    $nama = $data['nama'] ?? null;
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;
    $telepon = $data['telepon'] ?? null;
    $alamat = $data['alamat'] ?? null;
    $role = $data['role'] ?? 'pelanggan'; // Default role 'pelanggan'

    // Validasi input
    if (empty($nama) || empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Nama, email, dan password wajib diisi']);
        return;
    }

    // Validasi nilai role
    if (!in_array($role, ['admin', 'pelanggan'])) {
        echo json_encode(['status' => 'error', 'message' => 'Role tidak valid']);
        return;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Cek apakah email sudah terdaftar
    $sql_check = "SELECT 1 FROM users WHERE email = ?";
    $stmt_check = mysqli_prepare($koneksi, $sql_check);
    mysqli_stmt_bind_param($stmt_check, 's', $email);
    mysqli_stmt_execute($stmt_check);
    mysqli_stmt_store_result($stmt_check);

    if (mysqli_stmt_num_rows($stmt_check) > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email sudah terdaftar']);
        return;
    }

    // Insert user ke database
    $sql = "INSERT INTO users (nama, email, password, telepon, alamat, role) 
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($koneksi, $sql);
    mysqli_stmt_bind_param($stmt, 'ssssss', $nama, $email, $hashedPassword, $telepon, $alamat, $role);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success', 'message' => 'User registered successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to register user']);
    }
}

function loginUser() {
    global $koneksi;

    // Ambil input JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    // Validasi input
    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Email dan password wajib diisi']);
        return;
    }

    // Validasi format email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Format email tidak valid']);
        return;
    }

    // Ambil data user berdasarkan email
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = mysqli_prepare($koneksi, $sql);
    mysqli_stmt_bind_param($stmt, 's', $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    // Cek apakah user ditemukan
    if (!$result) {
        echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan saat mengambil data']);
        return;
    }

    $user = mysqli_fetch_assoc($result);

    if ($user && password_verify($password, $user['password'])) {
        // Password cocok, kirimkan respons sukses
        echo json_encode([
            'status' => 'success',
            'message' => 'Login berhasil',
            'data' => [
                'id_user' => $user['id_user'],
                'nama' => $user['nama'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } else {
        // Login gagal
        echo json_encode(['status' => 'error', 'message' => 'Email atau password salah']);
    }

    // Debugging log untuk memastikan apakah fungsi dipanggil
    error_log("Login function executed for email: " . $email);
}




// Get all testimonials
function getTestimonials() {
    global $koneksi;
    $sql = "SELECT * FROM testimonials";
    $result = mysqli_query($koneksi, $sql);
    $testimonials = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $testimonials[] = $row;
    }
    echo json_encode(['data' => $testimonials]);
}

// Create a new testimonial
function createTestimonial() {
    global $koneksi;

    // Mengambil data dari body request JSON
    $data = json_decode(file_get_contents("php://input"), true);

    // Memeriksa apakah semua kolom yang diperlukan ada
    $id_layanan = $data['id_layanan'] ?? null;
    $id_user = $data['id_user'] ?? null;
    $rating = $data['rating'] ?? null;
    $komentar = $data['komentar'] ?? null;
    $tanggal = $data['tanggal'] ?? null;

    // Validasi data
    if ($id_layanan && $id_user && $rating && $komentar && $tanggal) {
        // Memastikan format tanggal yang diterima sudah benar
        $date_format = 'Y-m-d';
        $tanggal_obj = DateTime::createFromFormat($date_format, $tanggal);
        
        // Memeriksa apakah format tanggal valid
        if ($tanggal_obj && $tanggal_obj->format($date_format) === $tanggal) {
            // Menyisipkan data ke database
            $sql = "INSERT INTO testimonials (id_layanan, id_user, rating, komentar, tanggal)
                    VALUES ('$id_layanan', '$id_user', '$rating', '$komentar', '$tanggal')";
            
            $result = mysqli_query($koneksi, $sql);

            if ($result) {
                $message = 'Testimonial created successfully';
            } else {
                $message = 'Failed to create testimonial: ' . mysqli_error($koneksi);
            }
        } else {
            $message = 'Invalid date format. Please use YYYY-MM-DD.';
        }
    } else {
        $message = 'Missing required fields';
    }

    // Mengirimkan response dalam format JSON
    echo json_encode(['message' => $message]);
}

function updateTestimonial() {
    global $koneksi;

    // Mengambil data dari body request JSON
    $data = json_decode(file_get_contents("php://input"), true);

    // Memeriksa apakah ID testimonial dan kolom yang diperlukan ada
    $id_testimoni = $data['id_testimoni'] ?? null;
    $id_layanan = $data['id_layanan'] ?? null;
    $id_user = $data['id_user'] ?? null;
    $rating = $data['rating'] ?? null;
    $komentar = $data['komentar'] ?? null;
    $tanggal = $data['tanggal'] ?? null;

    // Validasi input: memastikan ID testimonial ada dan kolom lainnya tidak kosong
    if ($id_testimoni && $id_layanan && $id_user && $rating && $komentar && $tanggal) {
        // Memastikan format tanggal yang diterima sudah benar
        $date_format = 'Y-m-d';
        $tanggal_obj = DateTime::createFromFormat($date_format, $tanggal);
        
        // Memeriksa apakah format tanggal valid
        if ($tanggal_obj && $tanggal_obj->format($date_format) === $tanggal) {
            // Menyusun query UPDATE untuk memperbarui data testimonial
            $sql = "UPDATE testimonials
                    SET id_layanan = '$id_layanan', id_user = '$id_user', rating = '$rating', komentar = '$komentar', tanggal = '$tanggal'
                    WHERE id_testimoni = '$id_testimoni'";

            // Eksekusi query
            $result = mysqli_query($koneksi, $sql);

            if ($result) {
                $message = 'Testimonial updated successfully';
            } else {
                $message = 'Failed to update testimonial: ' . mysqli_error($koneksi);
            }
        } else {
            $message = 'Invalid date format. Please use YYYY-MM-DD.';
        }
    } else {
        $message = 'Missing required fields';
    }

    // Mengirimkan response dalam format JSON
    echo json_encode(['message' => $message]);
}


function deleteTestimonial() {
    global $koneksi;

    // Mengambil data ID testimonial dari request
    $data = json_decode(file_get_contents("php://input"), true);

    // Memeriksa apakah ID testimonial ada
    $id_testimoni = $data['id_testimoni'] ?? null;

    // Validasi: Pastikan ID testimonial diberikan
    if ($id_testimoni) {
        // Menyusun query DELETE untuk menghapus testimonial berdasarkan ID
        $sql = "DELETE FROM testimonials WHERE id_testimoni = '$id_testimoni'";

        // Eksekusi query
        $result = mysqli_query($koneksi, $sql);

        if ($result) {
            $message = 'Testimonial deleted successfully';
        } else {
            $message = 'Failed to delete testimonial: ' . mysqli_error($koneksi);
        }
    } else {
        $message = 'Missing required fields';
    }

    // Mengirimkan response dalam format JSON
    echo json_encode(['message' => $message]);
}


// Get all bookings
function getBookings() {
    global $koneksi;
    $sql = "SELECT * FROM bookings";
    $result = mysqli_query($koneksi, $sql);
    $bookings = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $bookings[] = $row;
    }
    echo json_encode(['data' => $bookings]);
}

// Create a new booking
function createBooking() {
    global $koneksi;
    $id_layanan = $_POST['id_layanan'];
    $id_user = $_POST['id_user'];
    $tanggal = $_POST['tanggal'];
    $waktu = $_POST['waktu'];

    if ($id_layanan && $id_user && $tanggal && $waktu) {
        $sql = "INSERT INTO bookings (id_layanan, id_user, tanggal, waktu) 
                VALUES ('$id_layanan', '$id_user', '$tanggal', '$waktu')";
        $result = mysqli_query($koneksi, $sql);
        $message = $result ? 'Booking created successfully' : 'Failed to create booking';
    } else {
        $message = 'Missing required fields';
    }
    echo json_encode(['message' => $message]);
}

// Get all promotions
function getPromotions() {
    global $koneksi;
    $sql = "SELECT * FROM promotions";
    $result = mysqli_query($koneksi, $sql);
    $promotions = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $promotions[] = $row;
    }
    echo json_encode(['data' => $promotions]);
}

// Create a new promotion
function createPromotion()
{
    global $koneksi;

    // Ambil data dari POST
    $judul = $_POST['judul'] ?? null;
    $deskripsi = $_POST['deskripsi'] ?? null;
    $tanggal_mulai = $_POST['tanggal_mulai'] ?? null;
    $tanggal_akhir = $_POST['tanggal_akhir'] ?? null;

    // Validasi data
    if ($judul && $deskripsi && $tanggal_mulai && $tanggal_akhir) {
        $sql = "INSERT INTO promotions (judul, deskripsi, tanggal_mulai, tanggal_akhir) 
                VALUES ('$judul', '$deskripsi', '$tanggal_mulai', '$tanggal_akhir')";
        $result = mysqli_query($koneksi, $sql);

        $message = $result ? 'Promotion created successfully' : 'Failed to create promotion';
    } else {
        $message = 'Missing required fields';
    }

    echo json_encode(['message' => $message]);
}

function updatePromotion()
{
    global $koneksi;

    // Ambil data dari JSON Body
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Validasi jika data tidak valid
    if (!$data) {
        echo json_encode(['message' => 'Invalid JSON format']);
        exit;
    }

    // Ambil data dari JSON
    $id_promosi = $data['id_promosi'] ?? null;
    $judul = $data['judul'] ?? null;
    $deskripsi = $data['deskripsi'] ?? null;
    $tanggal_mulai = $data['tanggal_mulai'] ?? null;
    $tanggal_akhir = $data['tanggal_akhir'] ?? null;

    // Validasi data
    if ($id_promosi && $judul && $deskripsi && $tanggal_mulai && $tanggal_akhir) {
        $sql = "UPDATE promotions SET 
                judul = '$judul', 
                deskripsi = '$deskripsi', 
                tanggal_mulai = '$tanggal_mulai', 
                tanggal_akhir = '$tanggal_akhir' 
                WHERE id_promosi = $id_promosi";
        $result = mysqli_query($koneksi, $sql);

        if (!$result) {
            $error = mysqli_error($koneksi);
            echo json_encode(['message' => 'Failed to update promotion', 'error' => $error]);
        } else {
            echo json_encode(['message' => 'Promotion updated successfully']);
        }
    } else {
        echo json_encode(['message' => 'Missing required fields']);
    }
}


function deletePromotion()
{
    global $koneksi;

    // Ambil id_promosi dari URL (query string)
    $id_promosi = $_GET['id_promosi'] ?? null;

    // Validasi data
    if ($id_promosi) {
        $sql = "DELETE FROM promotions WHERE id_promosi = $id_promosi";
        $result = mysqli_query($koneksi, $sql);

        if ($result) {
            echo json_encode(['message' => 'Promotion deleted successfully']);
        } else {
            $error = mysqli_error($koneksi);
            echo json_encode(['message' => 'Failed to delete promotion', 'error' => $error]);
        }
    } else {
        echo json_encode(['message' => 'Missing required fields']);
    }
}



?>