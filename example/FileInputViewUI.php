<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'File Input View Example';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="hazdev-webutils.css"/>
  ';

  $FOOT = '
    <script src="hazdev-webutils.js"></script>
    <script src="FileInputViewUI.js"></script>
  ';
}

include '_example.inc.php';

?>

  <button class="file-view-show">Show View</button>

  <h3>Results</h3>
  <pre class="results"></pre>
