<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Examples';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="hazdev-webutils.css"/>
  ';

  $FOOT = '
    <script src="hazdev-webutils.js"></script>
    <script src="DownloadViewUITest.js"></script>
  ';

  include 'template.inc.php';
}

?>

<ul>
  <li><a href="CollectionViewUI.php">Collection View</a></li>
  <li>
    <a href="CollectionSelectBoxUITest.php">Collection Select Box View</a>
  </li>
  <li><a href="DownloadViewUITest.php">Download View</a></li>
  <li><a href="FileInputViewUI.php">File Input View UI</a></li>
  <li><a href="MessageUI.php">Message UI</a></li>
  <li><a href="ModalViewUITest.php">Modal View</a></li>
  <li><a href="SelectViewUITest.php">Select View</a></li>
</ul>
