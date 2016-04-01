// Saves options to chrome.storage.sync.
function save_options() {
  var PWS = document.getElementById('PWS').value;
  var ForC = document.getElementById('C').checked;

  chrome.storage.sync.set({
    PWS: PWS,
	ForC: ForC
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    PWS: 'StationID',
	ForC: 0,
  }, function(items) {
    document.getElementById('PWS').value = items.PWS;
	if (items.ForC) {
		document.getElementById('C').checked = true;
	} else {
		document.getElementById('F').checked = true;
	}
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);