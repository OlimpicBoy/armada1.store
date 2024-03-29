<?php
$token = "6693234690:AAGjcy23MIvLSuuWUcMbCovPJomA3tlh3rA"; // tg токен
$chat_ids = array("-1002029188734", "613725202");       // id чату
$name = $_POST['name'];       // Ім'я покупця
$phone = $_POST['phone'];     // Номер телефону
$comment = $_POST['comment']; // комментар в CRM
$product = 'oblivion';           // назва товару
$number_of_pieces = '1';
$site = $_SERVER['SERVER_NAME'];

$arr = array(
  '<b>→ ЗАМОВЛЕННЯ НА</b>' => $site,
  '💁🏻‍♂️ Імʼя: ' => $name,
  '📱 Телефон: ' => $phone,
  '📦 Товар: ' => $product,
);

foreach($arr as $key => $value) {
  $txt .= "<b>".$key."</b> ".$value."%0A";
};


foreach($chat_ids as $chat_id) {
  $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");
};

header("Location: thanks.html");
?>

