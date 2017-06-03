<?php

error_reporting(E_ERROR | E_PARSE);
$time=time() - strtotime("today");
$cpuObject->time = $time;
$cpuObject->usage = rand(1, 100);

$memoryObject->time = $time;
$memoryObject->usage = rand(1, 90);

$myObj->cpu = $cpuObject;
$myObj->memory = $memoryObject;

$myJSON = json_encode($myObj);
echo $myJSON;
?>
