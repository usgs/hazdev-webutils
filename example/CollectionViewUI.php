<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Collection View Example';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="hazdev-webutils.css"/>
  ';

  $FOOT = '
    <script src="hazdev-webutils.js"></script>
    <script src="CollectionViewUI.js"></script>
  ';
}

include '_example.inc.php';

?>

<button class="collection-add">Add Model</button>
<button class="collection-remove">Remove First Model</button>
<button class="collection-reset">Reset to Defaults</button>

<ul class="collection-view"></ul>
