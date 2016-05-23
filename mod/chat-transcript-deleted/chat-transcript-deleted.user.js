// ==UserScript==
// @name Show deleted chat messages for Stack Exchange
// @grant none
// @match *://chat.stackexchange.com/*
// @match *://chat.stackoverflow.com/*
// @match *://chat.meta.stackexchange.com/*
// ==/UserScript==

var userscript = function($) {

    $(document).on("keydown", function(e) {
        if(e.ctrlKey && e.which == 68) {  // Ctrl-D activates the script
            e.preventDefault();
            $('span.deleted').closest('.message').each(function() {
                var id = this.id.replace('message-', ''), _this = this;
                $.get('//chat.stackexchange.com/messages/' + id + '/history', function(data) {
                    var msgtxt = data.match(/<div class="content">([\s\S]+?)<\/div>/)[1].trim();
                    $('.content > span', _this).html(msgtxt).css({backgroundColor: '#f4eaea', color: '#000'});
                });
            });
        }
    });

};

var el = document.createElement('script');
el.type = 'text/javascript';
el.text = '(' + userscript + ')(jQuery);';
document.head.appendChild(el);
