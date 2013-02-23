<?php  
session_start();

function user_key( $length ) {

	$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";	

	$size = strlen( $chars );
	for( $i = 0; $i < $length; $i++ ) {
		$str .= $chars[ rand( 0, $size - 1 ) ];
	}

	return $str;
}

$_SESSION['user_key'] = user_key(10);

$target_path = "../uploads/".$_SESSION['user_key'].'/';

if(!is_dir($target_path)){
	mkdir($target_path);
}

$img_data['sw'] = $_POST['sprite_width'];
$img_data['sh'] = $_POST['sprite_height'];
$img_data['sx'] = $_POST['start_x'];
$img_data['sy'] = $_POST['start_y'];
$img_data['sc'] = $_POST['sprite_cols'];

$target_path = $target_path . basename( $_FILES['uploadedfile']['name']); 

if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)){
	$fp = fopen($target_path.'.json', 'w');
	fwrite($fp, json_encode($img_data));
	fclose($fp);
}

header('location: ../?user_key='.$_SESSION['user_key']);