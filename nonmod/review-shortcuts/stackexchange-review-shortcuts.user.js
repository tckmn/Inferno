// ==UserScript==
// @name stackexchange-review-shortcuts
// @namespace http://keyboardfire.com/
// @license MIT
// @description Hotkey shortcuts on /review for keyboard ninjas
// @version 1.0.0
// @match *://*.stackexchange.com/review/*
// @match *://*.stackoverflow.com/review/*
// @match *://*.superuser.com/review/*
// @match *://*.serverfault.com/review/*
// @match *://*.askububtu.com/review/*
// @match *://*.stackapps.com/review/*
// @match *://*.mathoverflow.net/review/*
// ==/UserScript==

var userscript = function($) {

var keymap = {};
$(window).on('keydown', function(e) {
	var ltr = String.fromCharCode(e.which);
	if (keymap[ltr]) {
		e.preventDefault()
		keymap[ltr]();
	}
});
var shortcutKeys = 'ASDFGHJKL';

$(window).on('popstate', init);

function init() {
	var reviewActionCallback = function(lbl, btn, index) {
		var action = btn.val();
		keymap = {};
		// nothing to do for the following:
		// /Edit|Improve|Leave Open|Leave Closed|Approve|Reopen|Looks OK|No Action Needed|I'm Done|Skip/
		// (pointless test for those removed)
		if (/\b(Close|Delete|Reject)\b/.test(action)) {
			var popupActionCallback = function(lbl, btn, index) {
				var action = lbl.text();
				keymap = {};
				if (/off-topic/.test(action)) {
					var offTopicActionCallback = function(lbl, btn, index) {
						var action = lbl.text();
						keymap = {};
						if (/This question belongs on another site/.test(action)) {
							var migrationActionCallback = function(lbl, btn, index) {
								keymap = {};
								$('.popup popup-submit').click();
							}, migrationActionIndex = 0;

							when(function() {
								return $('.action-list li:has(input[name="migration"])').length;
							}, function() {
								$('.action-list li:has(input[name="migration"])').each(function() {
									setupShortcut($('span:first', this), $('input:first', this), migrationActionIndex++, migrationActionCallback);
								});
							});
						} else if (/^\[.\]\s+Other \(add a comment/.test(action)) {
							// wait for the user to type stuff and press enter
							// (no-op)
						} else {
							// nothing else special to do
							$('.popup .popup-submit').click();
						}
					}, offTopicActionIndex = 0;

					when(function() {
						return $('.action-list li:has(input[name="close-as-off-topic-reason"])').length;
					}, function() {
						$('.action-list li:has(input[name="close-as-off-topic-reason"])').each(function() {
							setupShortcut($('span:first', this), $('input:first', this), offTopicActionIndex++, offTopicActionCallback);
						});
					});
				} else if (/custom|duplicate/.test(action)) {
					// wait for the user to type stuff and press enter
					// (no-op)
				} else {
					// nothing else special to do
					$('.popup .popup-submit').click();
				}
			}, popupActionIndex = 0;

			when(function() {
				return $('.popup').length;
			}, function() {
				$('.popup li:has(input[type="radio"][name!="close-as-off-topic-reason"][name!="migration"])').each(function() {
					setupShortcut($('span:first', this), $('input:first', this), popupActionIndex++, popupActionCallback);
				});
			});
		}
	}, reviewActionIndex = 0;

	keymap = {};
	when(function() {
		return $('.review-actions input').length && !($('.review-actions input[disabled]').length);
	}, function() {
		$('.review-actions input').each(function() {
			setupShortcut($(this), $(this), reviewActionIndex++, reviewActionCallback);
		});
	});
}

function setupShortcut(lbl, btn, index, callback) {
	var shortcutKey = shortcutKeys.charAt(index);
	if (lbl.val()) {
		lbl.val('[' + shortcutKey + '] ' + lbl.val());
	} else {
		lbl.text('[' + shortcutKey + '] ' + lbl.text());
	}

	keymap[shortcutKey] = (function(lbl, btn, index) { return function() {
		btn.click();
		callback(lbl, btn, index);
	}})(lbl, btn, index);
}

function when(condition, func) {
	var intr = setInterval(function() {
		if (condition()) {
			clearInterval(intr);
			func();
		}
	}, 100);
}

};

var el = document.createElement('script');
el.type = 'text/javascript';
el.text = '(' + userscript + ')(jQuery);';
document.head.appendChild(el);
