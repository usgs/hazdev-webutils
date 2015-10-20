<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Download View Example';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="hazdev-webutils.css"/>
  ';

  $FOOT = '
    <script src="hazdev-webutils.js"></script>
    <script src="DownloadViewUITest.js"></script>
  ';
}

include '_example.inc.php';

?>

<div id="example"></div>
