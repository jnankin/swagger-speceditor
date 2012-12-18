<?
header("Content-type: application/json");
$ret = array('success' => true);
$ret['data'] = json_decode(file_get_contents($_FILES["file"]["tmp_name"]), true);
if (!$ret['data']){
	$ret['success'] = false;
	$ret['error'] = 'The file you provided does not contain valid json!';
}
echo json_encode($ret);
