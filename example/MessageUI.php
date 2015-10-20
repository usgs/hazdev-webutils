<?php

if (!isset($TEMPLATE)) {
  $TITLE = 'Message View Example';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="hazdev-webutils.css"/>
  ';

  $FOOT = '
    <script src="hazdev-webutils.js"></script>
    <script src="MessageUI.js"></script>
  ';

  include 'template.inc.php';
}

?>


<div class="alert-inputs">
  <label for="alert-message">Enter a Message</label>
  <textarea id="alert-message">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
sagittis justo ac lacus elementum, vel fringilla nibh bibendum.
Pellentesque tellus felis, pulvinar eget consectetur eget, tristique
ut ligula. Phasellus consequat varius ligula, eget lacinia nulla
rutrum quis. Donec tristique mollis efficitur. Phasellus facilisis
tincidunt ex. Aliquam tincidunt elementum odio sed bibendum. Sed et
maximus sapien, ac accumsan erat. In venenatis tellus non porttitor
sagittis. Pellentesque sit amet viverra metus, vitae luctus ipsum.
Praesent tincidunt augue et lorem vestibulum lobortis. Integer
euismod dapibus nisl, sed consectetur metus vulputate vel.
Vivamus condimentum fringilla ex vitae maximus.
  </textarea>

  <label for="alert-type">Message Type</label>
  <select id="alert-type">
    <option value="">Default</option>
    <option value="info">Info</option>
    <option value="warning">Warning</option>
    <option value="error">Error</option>
  </select>

  <input id="alert-insert-before" type="checkbox"/>
  <label for="alert-insert-before">
    Insert this message at top of messages
  </label>

  <input id="alert-autoclose" type="checkbox"/>
  <label for="alert-autoclose">
    Auto-close message after 3 seconds
  </label>

  <button class="alert-create">Create Message</button>
</div>

<div class="alert-outputs"></div>
