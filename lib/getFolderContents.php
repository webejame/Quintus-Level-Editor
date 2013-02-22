<?php
session_start();

$images = glob('../uploads/'.$_SESSION['user_key'].'/*{.png,.jpg}',GLOB_BRACE);
for($i = 0; $i < count($images); $i++){
	$image[$i]["image"] = $images[$i];
	$image[$i]["data"] = file_get_contents($image[$i]["image"].'.json');
}

echo json_encode($image);
