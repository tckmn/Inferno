// ==UserScript==
// @name stackexchange-mod-easy-timeline
// @namespace http://keyboardfire.com/
// @license MIT
// @description Easy timeline access for Stack Exchange mods
// @version 1.0.0
// @match *://*.stackexchange.com/*
// @match *://*.stackoverflow.com/*
// @match *://*.superuser.com/*
// @match *://*.serverfault.com/*
// @match *://*.askububtu.com/*
// @match *://*.stackapps.com/*
// @match *://*.mathoverflow.net/*
// ==/UserScript==

var userscript = function($) {

if (!StackExchange.moderator) return;

// post issue boxes are loaded via AJAX, so wait a bit until the page is ready
setTimeout(function() {

// add timeline boxes to posts that don't have them
$('#question,.answer').each(function(){
    if (!$('.post-issue', this).length) {
        $(this).prepend($('<div>').addClass('post-issue').append(
            $('<div>').addClass('post-issue-display').append(
                $('<a>') // dummy element (no deleted comments)
            ).append(
                $('<a>').attr('href', '/admin/posts/timeline/' + ($(this).attr('data-answerid') || $(this).attr('data-questionid'))).text('timeline')
            )
        ));
    }
});

// "post issues" to the side of posts
$('.post-issue-display a:last-child').click(function(e) {
    e.preventDefault();
    ajaxTimelinePopup($(this));
}).each(function() {
    addNoAjaxLink($(this));
});

// the timeline link in the mod actions popup
$('.post-moderator-link').click(function() {
    addNoAjaxLink($('.popup .action-list a').click(function(e) {
        e.preventDefault();
        ajaxTimelinePopup($(this));
    }));
});

function ajaxTimelinePopup(timelineLink) {
    $.ajax({
        url: timelineLink.attr('href'), success: function(data) {
            var timelineData = data.match(/<table class="post-timeline">[\s\S]*?<\/table>/)[0];

            var wrapper = $('<div>').css({
                position: 'absolute',
                top: timelineLink.offset().top + 'px',
                left: timelineLink.offset().left + 'px',
                width: '1000px',
                backgroundColor: '#def',
                maxHeight: '80%',
                overflow: 'scroll',
                overflowX: 'hidden'
            }).html(timelineData).prepend(
                $('<button>').text('Close').click(function() { wrapper.remove(); })
            ).appendTo(document.body);

            $('td', wrapper).css({
                padding: '4px'
            });

            $('.toggle-date-format', wrapper).hide();
        }
    });
}

function addNoAjaxLink(timelineLink) {
    timelineLink.parent().append($('<a>').text('timeline (no ajax)').attr('href', timelineLink.attr('href')));
}

}, 2000); // setTimeout

};

var el = document.createElement('script');
el.type = 'text/javascript';
el.text = '(' + userscript + ')(jQuery);';
document.head.appendChild(el);
