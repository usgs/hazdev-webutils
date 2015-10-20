<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Select View UI Example';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="hazdev-webutils.css"/>
  ';

  $FOOT = '
    <script src="hazdev-webutils.js"></script>
    <script src="SelectViewUITest.js"></script>
  ';

  include 'template.inc.php';
}

?>

<p class="alert warning">
  This is the Old Select View and you should
  probably use the <a href="CollectionSelectBoxUITest.html">Collection
  Select Box View</a>.
</p>

<p class="instructions">
  Below are two select views that are bound to the same collection. By
  selecting an item in either select box, the select items in both box select
  boxes should update.
</p>

<select id="selectBox1"></select>
<select id="selectBox2"></select>

<p class="instructions">
  Use the buttons below to add, remove, or clear items to/from the underlying
  collection. You should see the results of your action reflected in both
  select boxes above.
</p>

<button id="addItem">Add New Item</button>
<button id="removeItem">Remove First Item</button>
<button id="resetItems">Clear All Items</button>
