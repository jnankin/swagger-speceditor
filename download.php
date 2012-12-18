<?
$data = json_decode(stripslashes($_REQUEST['data']), true);
$fileName = str_replace(' ', '_', $data['name']) . '-' . $data['apiVersion'] . '.json';
header('Content-disposition: attachment; filename=' . $fileName); 
header("Content-type: application/json"); 
echo json_encode($data);
