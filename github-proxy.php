<?php

/**
	Example AJAX proxy to grab the response of the remote GitHub API
**/

if (!isset($_GET['location'])) {
	exit();
}

// Removes Multiple Slashes eg. //dir//abc/ returns /dir/abc/
function fix_path($path) {
	$path = preg_replace('/\/+/', '/', $path);
	return $path;
}

function get_json($url){
  $base = "api.github.com/";
  $curl = curl_init();
  curl_setopt($curl, CURLOPT_URL, "https://".fix_path($base . $url));
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
  $content = curl_exec($curl);
  curl_close($curl);
  return $content;
}
print get_json($_GET['location']);

?>