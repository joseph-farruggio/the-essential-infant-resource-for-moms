var socializeit = function(options) {
    function hasClass(el, className) {
        var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)");
        return regexp.test(el.className);
    }

    function addClass(el, className) {
        if (!hasClass(el, className)) {
            el.className = el.className + " " + className;
        }
    }

    function removeClass(el, className) {
        var re = new RegExp("(^|\\s)" + className + "(\\s|$)");
        while (re.test(el.className)) { // in case multiple occurrences
            el.className = el.className.replace(re, ' ');
        }
        el.className = el.className.replace(/^\s+/, '').replace(/\s+$/, '');
    }

  if (!options || !options.domain) {
    throw new Error('Error: must pass socializeit a domain (e.g. socializeit({domain:"www.example.com"})).')
  }

  if (typeof options.share_horizontal_label == "undefined") {
      options.share_horizontal_label = 'Share this page:';
  }
  if (typeof options.share_sticky_label == "undefined") {
      options.share_sticky_label = 'Share';
  }
  if (typeof options.whatIsThisLabel == "undefined") {
      options.whatIsThisLabel = 'What\'s this?';
  }

  if (!options.pack) options.pack = 1; //set a default value for whoever is using old version
  var d = document,
      l = d.location,
      e = encodeURIComponent,
      u = e(l.href),
      t = e(d.title),
      appId,
      appIdNode = d.querySelector('meta[property="fb:app_id"]');

      if (appIdNode) {
        appId = Number(appIdNode.getAttribute('content'));
      }

    //Facebook,Twitter,Pinterest,Tumblr,Reddit
  var sitesConfig = {
        'facebook':    {name: 'Facebook',
                        color: '#3b579d',
                        iconClassName: 'fab fa-facebook-square fa-2x fa-fw',
                        url: 'https://www.facebook.com/sharer.php?u='+ u +'&t=' + t},
        'twitter':     {name: 'Twitter',
                        color: '#28a9e0',
                        iconClassName: 'fab fa-twitter-square fa-2x fa-fw',
                        url: 'https://twitter.com/intent/tweet?text=Reading%20about%20this:%20'+t+'%20-%20' + u},
		'pinterest':    {name: 'Pinterest',
                        color: '#CD1D1F',
                        iconClassName: 'fab fa-pinterest-square fa-2x fa-fw',
                        url: 'https://assets.pinterest.com/js/pinmarklet.js',
                        includeScript: true},
	    'tumblr':       {name: 'Tumblr',
                        color: '#35465c',
                        iconClassName: 'fab fa-tumblr-square fa-2x fa-fw',
	                    url: 'https://www.tumblr.com/share/link?url='+ u + '&name='+ t },
	    'reddit':       {name: 'Reddit',
                        color: '#ff4500',
                        iconClassName: 'fab fa-reddit-square fa-2x fa-fw',
	                    url: 'https://reddit.com/submit?url='+ u + '&title=' + t},
      'whatsapp':     {name: 'WhatsApp',
                        color: '#25D366',
                        iconClassName: 'fab fa-whatsapp-square fa-2x fa-fw',
                        url: 'https://wa.me/?text='+u+''},
      'fbmessenger':  {name: 'Messenger',
                        color: '#0078FF',
                        iconClassName: 'fab fa-facebook-messenger fa-2x fa-fw',
                        url:'https://www.facebook.com/dialog/send?app_id='+appId+'&link='+u+'&redirect_uri='+u+'',
                        windowHeight: 500,
                        windowWidth: 850}
    };

    var sites = [];
    if (options.pack == 1) {
        sites = [sitesConfig.facebook,sitesConfig.twitter,sitesConfig.pinterest,sitesConfig.tumblr,sitesConfig.reddit, sitesConfig.whatsapp];

        if (appId) {
          sites.push(sitesConfig.fbmessenger);
        }
    }
    else
    {
        sites = [sitesConfig.facebook,sitesConfig.twitter];

    }

    arguments.callee.getURL = function(which) {

	  for (var i=0, ilen=sites.length; i<ilen; i++) {
      var site = sites[i];
      if (site.name == which) {
        return site.url;
      }
    }
  };

    var mobile = ((typeof MOBILE !== 'undefined') && MOBILE.viewMode === 'mobile');
    var html = '';
    var pack = options.pack;    // 2pack = 2, 8pack = 1(!)
    var rows = (pack == 1) ? 2 : 1;
    if (pack === 1 && mobile) {
        rows = 4;
    }
    var buttonsInRow = Math.ceil((sites.length / rows));
    var colspan = buttonsInRow + 1;
    var rowspan = 'rowspan="' + rows + '"';
    var socit_class = 'socializeIt' + ' ' + (pack==2?'socializeIt-2':'socializeIt-8');    //#20290
    var inlineStyles = 'border: 1px solid #ccc;border-collapse:separate; padding:2px;max-width:480px;';
    if (options.background_color) {
        inlineStyles += 'background-color:' + options.background_color;
    } else {
        if (options.display_variant) {
            inlineStyles += 'background-color: #fff;';
        }
    }

    // Pay it forward
    var id = 'socializeit' + (new Date()).getTime() + Math.floor(Math.random() * 1e7);
    socializeit.payItForward = function () {
        if (d.getElementById(id).style.display == 'block') {
            d.getElementById(id).style.display = 'none';
        } else {
            d.getElementById(id).style.display = 'block';
        }
    };

    if (options.version === 2) {
        // Modern markup
        socit_class += ' socializeIt-responsive';
        html = '<div class="' + socit_class + '" style="' + inlineStyles + '">';
        if (options.display_variant) {
            html += '<div class="shareHeader">' + options.share_sticky_label + '</div>';
        } else {
            html += '<div class="shareHeader">';
            html += '<strong style="font-size: 16px;">' + options.share_horizontal_label + '&nbsp;</strong>';
            if (options.whatIsThisUrl) {
                html += '<div id="whatsthis" style="font-size:11px;">' +
                    '<a href="#" onclick="window.open\(\''+options.whatIsThisUrl+'\',\'sharer\',\'toolbar=0,status=0,width=700,height=500,resizable=yes,scrollbars=yes\'\); return false;">' + options.whatIsThisLabel + '</a>' +
                    '</div>';
            }
            html += '</div>';
        }

        html += '<ul class="socialMedia">';
        for (var i = 0, ilen = sites.length; i < ilen; i += 1) {
            var site = sites[i].name;
            var url = sites[i].url;
            var windowHeight = sites[i].windowHeight || 500;
            var windowWidth = sites[i].windowWidth || 700;
            var includeScript = sites[i].includeScript;
            var onClickAction;
            if (sites[i].onClickCallback) {
                onClickAction = sites[i].onClickCallback;
            } else if (includeScript) {
                onClickAction = 'loadJavasScript(\''+url+'\');return false;';
            } else {
                onClickAction = 'window.open(socializeit.getURL(\''+site+'\'), \'sharer\', \'toolbar=0,status=0,width='+windowWidth+',height='+windowHeight+',resizable=yes,scrollbars=yes\');return false;';
            }
            html += '<li>' +
                '<a href="#share_on_'+site+'" onclick="' + onClickAction + '" class="socialIcon" style="color:'+sites[i].color+';white-space:nowrap;">' +
                '<i style="margin: 4px 0; width: 1.1em; display: inline-block; vertical-align:middle; color:'+sites[i].color+'" class="'+sites[i].iconClassName+'"></i>';
            if (!options.display_variant) {
                html += '<span style="font-size: 15px; display: inline-block; vertical-align: middle; margin: 0 4px;">'+site+'</span>';
            }
            html += '</a></li>';
        }
        html += '</ul>';

        if (options.payItText && !options.display_variant) {
            html += '<div style="background:'+options.szColor+';padding:0.5em;margin:2px;"><p style="font-size:16px;text-align:center;margin-top:0;margin-bottom:0;"><a href="#pay_it_forward" onclick="socializeit.payItForward();return false;">' +
                options.payItText + '</a></p><div class="payItForward" style="display:none;" id="'+id+'">' +
            (options.payItExpanded ? options.payItExpanded : payItForwardDefault()) +
            '<form action="#"><div style="text-align:center"><textarea cols="50" rows="2" onclick="this.select();">&lt;a href="'+l+'"&gt;'+d.title+'&lt;/a&gt;</textarea></div></form></div></div>';
        }

        html += '</div>';

        var head = d.querySelector('head');
        var css = d.createElement('style');
        css.type = "text/css";
        css.innerHTML = '' +
            '@media only screen and (max-width: 450px) {' +
            '.socializeIt-responsive .socialIcon {' +
            'white-space: normal !important;' +
            'text-align: center;' +
            'display: block !important;' +
            '}' +
            '.socializeIt-responsive .socialIcon span {' +
            'display: block !important;' +
            '}' +
            '}' +
            '.socializeIt-responsive.narrow {' +
            'white-space: normal !important;' +
            '}' +
            '.socializeIt-responsive.narrow .socialMedia {' +
            'text-align: center;' +
            '}' +
            '.socializeIt-responsive.narrow .socialIcon span {' +
            'display: block !important;' +
            '}' +
            '.socializeIt-responsive.narrow400 .shareHeader {' +
            'display: block;' +
            'text-align: center;' +
            'width: 100%;' +
            '}' +
            '.socializeIt-responsive.narrow400 .socialMedia {' +
            'width: 100%;' +
            '}' +
            '.socializeIt-responsive.narrow220.socializeIt-8 .socialMedia li{' +
            'width: 100%;' +
            '}' +
            '.socializeIt-responsive {' +
            'margin-left: auto;' +
            'margin-right: auto;' +
            'box-sizing: border-box;' +
            'padding: 4px !important;' +
            '}' +
            '.socialMedia {' +
            'width: 71%;' +
            'display: inline-block;' +
            'vertical-align: middle;' +
            '}' +
            '.socialMedia,' +
            '.socialMedia li {' +
            'margin: 0 !important;' +
            'padding: 0 !important;' +
            'list-style: none !important;' +
            'background: transparent !important;' +
            '}' +
            '.socialMedia li {' +
            'display: inline-block;' +
            'vertical-align: top;' +
            '}' +
            '.socializeIt-responsive .shareHeader {' +
            'width: 29%;' +
            'display: inline-block;' +
            'vertical-align: middle;' +
            '}' +
            '.socializeIt-2 .socialMedia li {' +
            'width: 50%;' +
            'text-align: center;' +
            '}' +
            '.socializeIt-8 .socialMedia li {' +
            'width: 33%' +
            '}' +
            '.socializeIt-responsive .fa {' +
            'font-size: 30px;' +
            '}';
        head.appendChild(css);

    } else {
        // Legacy markup
        html = '<table class="' + socit_class + '" align="center" style="' + inlineStyles + '"><tbody><tr>';
        if (options.display_variant) {
            html += '<td class="shareHeader">' + options.share_sticky_label + '<td>';
        } else {
            html += '<td '+rowspan+' style="white-space:nowrap;"><strong>' + options.share_horizontal_label + '&nbsp;</strong>';
            if (options.whatIsThisUrl) {
                html += '<br><div id="whatsthis" style="font-size:11px;"><a href="#" onclick="window.open\(\''+options.whatIsThisUrl+'\',\'sharer\',\'toolbar=0,status=0,width=700,height=500,resizable=yes,scrollbars=yes\'\); return false;">' + options.whatIsThisLabel + '</a></div>';
            }
            html += '</td>';
        }
        // visually want two rows of links

        for (var i=0, ilen=sites.length; i<ilen; i++) {
            var site = sites[i].name;
            var url = sites[i].url;
            var windowHeight = sites[i].windowHeight || 500;
            var windowWidth = sites[i].windowWidth || 700;
            var includeScript = sites[i].includeScript;
            var onClickAction;
            if (sites[i].onClickCallback) {
                onClickAction = sites[i].onClickCallback;
            } else if (includeScript) {
                onClickAction = 'loadJavasScript(\''+url+'\');return false;';
            } else {
                onClickAction = 'window.open(socializeit.getURL(\''+site+'\'), \'sharer\', \'toolbar=0,status=0,width='+windowWidth+',height='+windowHeight+',resizable=yes,scrollbars=yes\');return false;';
            }

            html += '<td><a href="#share_on_'+site+'" onclick="' + onClickAction + '" class="socialIcon" style="color:'+sites[i].color+'; white-space:nowrap;"><i style="display: inline-block; vertical-align:middle; color:'+sites[i].color+'" class="'+sites[i].iconClassName+'"></i>';
            if (!options.display_variant) {
                html += '<span style="margin-left:5px; display: inline-block; vertical-align: middle;">'+site+'</span>';
            }
            html += '</td>';
            if ((i+1) % buttonsInRow === 0) {
                html += '</tr><tr>';
            }
        }
        html += '</tr>';

        // pay it forward
        if (options.payItText && !options.display_variant) {
            html += '<tr><td colspan="'+colspan+'" style="background:'+options.szColor+';padding:1em;"><p style="text-align:center;margin-top:0;margin-bottom:0;"><a href="#pay_it_forward" onclick="socializeit.payItForward();return false;">' +
                options.payItText + '</a></p>' +
            '<div class="payItForward" style="display:none;" id="'+id+'">' +
                 (options.payItExpanded ? options.payItExpanded : payItForwardDefault()) +
            '<form action="#"><div style="text-align:center"><textarea cols="50" rows="2" onclick="this.select();">&lt;a href="'+l+'"&gt;'+d.title+'&lt;/a&gt;</textarea></div></form></div></td></tr>';
        }
        html += '</tbody></table>';
    }

    loadStyleSheet( '/plugins/fontawesome/css/font-awesome.min.css');


    if (!options.display_variant) {
        if (options.el_id) {
            var rootEl = document.getElementById(options.el_id);
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            var fragment = document.createDocumentFragment();
            while (tempDiv.firstChild){
                fragment.appendChild(tempDiv.firstChild);
            }

            if (rootEl) {
                var parent = rootEl.parentNode;
                parent.replaceChild(fragment, rootEl);
            }

        } else {
            document.writeln(html);
        }
        if ((options.version === 2) && !options.display_variant) {
            var responsiveSocializeIt = d.querySelector('.socializeIt-responsive');
            var adjustForNarrowScreens = function () {
                if (responsiveSocializeIt.clientWidth < 450) {
                    if (!hasClass(responsiveSocializeIt, 'narrow')) {
                        addClass(responsiveSocializeIt, 'narrow');
                    }
                    if (responsiveSocializeIt.clientWidth < 400) {
                        if (!hasClass(responsiveSocializeIt, 'narrow400')) {
                            addClass(responsiveSocializeIt, 'narrow400');
                        }
                        if (responsiveSocializeIt.clientWidth < 220) {
                            if (!hasClass(responsiveSocializeIt, 'narrow220')) {
                                addClass(responsiveSocializeIt, 'narrow220');
                            }
                        } else {
                            if (hasClass(responsiveSocializeIt, 'narrow220')) {
                                removeClass(responsiveSocializeIt, 'narrow220');
                            }
                        }
                    } else {
                        if (hasClass(responsiveSocializeIt, 'narrow400')) {
                            removeClass(responsiveSocializeIt, 'narrow400');
                        }
                    }
                } else {
                    if (hasClass(responsiveSocializeIt, 'narrow')) {
                        removeClass(responsiveSocializeIt, 'narrow');
                    }
                }
            };

            adjustForNarrowScreens();

            window.addEventListener('resize', function () {
                adjustForNarrowScreens();
            }, false);

        }
    } else {
        var body = d.querySelector('body');
        var stickyContainer = d.createElement('div');
        stickyContainer.className = 'stickySocializeIt';
        if (options.display_variant === 'sidebar') {
            stickyContainer.className = stickyContainer.className + ' sticky stickySidebarLeft'
        } else if (options.display_variant === 'sticky_right') {
            stickyContainer.className = stickyContainer.className + ' sticky stickySidebarRight'
        } else if (options.display_variant === 'sticky_bottom') {
            stickyContainer.className = stickyContainer.className + ' sticky stickyBarBottom'
        } else if (options.display_variant === 'sticky_top') {
            stickyContainer.className = stickyContainer.className + ' sticky stickyBarTop'
        }

        html += '<img class="hideButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkIyQ0VEMDZCOTFFMTFFNTg2NkJDMUFBQkJCMTREOTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkIyQ0VEMDdCOTFFMTFFNTg2NkJDMUFBQkJCMTREOTQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4Mjg5RTk3RkI5MUIxMUU1ODY2QkMxQUFCQkIxNEQ5NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4Mjg5RTk4MEI5MUIxMUU1ODY2QkMxQUFCQkIxNEQ5NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmVOglsAAAOzSURBVHja1FqLT1JRHD4ShJDxEkEEBRRRIUGGKKENL1tbrq22WlvP1aq1Wo+1XA9zrfmoP8u/oz+n33c7x50Q9YL33Me3ffMAeu797jnn9/hwSNM0phDrxIvEQ1UXODz8N7WXqcU2MUa8qvg6zKNw7hpxk9gk3nKzEKzGEB/vKb6WssnniHcxmJiYwI8q8Z4bhXzF3IuLi2x+fp5Jq+J1k5Ap4iMMGo0Gq9VqbHJyEi+LxKduEvIZIXdhYYFFo1H9jXK5LD77QfS7QUiS+AKD5eXlozchZGoKC8WyxFduEPKRGJidnWWJROK/DyqVihjuEC85WUiE+AaDer1+PIzNzbFcLidW7b2Thbwlhqenp1k6ne6dIWs1MfyC33WikCDfVvLNHgNEgoQoDwqOE4IDHMfW4dvnRCAkc3wgJpwkBNXtVteBPhGZTIYhGBAuE785ScgT3B/CK7/BM7GysiKGCA4ZJwi5IJ5qqVQy/Efj4+OidBnmSdJ2ISgEC9guUvY2hGazKYbPiTN2ChnipbqeI/rF6OioEI9CctdOITdxvpEzlpaWBpqg1WqJ4QPiFbuEbIvcMChCoZCIdLiPfTuEwLFojY2NyRFoMHdifV0MbyOgWS1EX42ZmXOfURYIBFi1WhVn7sBKIUjN1yORCFtdXTUlmW1sbDDMh3mJbauEHK2G12tO54p5pMj32wohZb6XTVsN+azgzOHs8YioVAiyuAeRBnvbbEhGxb5kJZkuJE+8r2I15BoslUrp3UC/9lE/QtAMeVFTIf6rAkwLjt1+7COjQvCYnnX1E0og2UfYZ4/NFvIJlWqxWGTxeJyphrQqP3m/Y4oQuOmvuy0elYBDye2jnFH7yIgQOB4jyBv8IFoCqdv8zj2BcwkZ4b31qaaCCkj2EZ7eu/MKwZaKYcJsNsushtQewBQPDSpkmB9yUdRZDmznfD4vzunWoEIQblNYiUKhwOyCFGDgm8X7FeLlCbDvXtxsIHrxBxniW6wvIShF8khMUky3DVLzBls2bVSIR1g8UhFnKxD2eZmPSnXHqBCU6WVYPEacQ6sg2UcveQF7phC9cbLzgPcCSiNuAvp62UfdQtBqNpLJZM/vOOyGZB89JJZOE2KaqaAC4XBYbHdYtXsnCYFcLRaLKWuczMDa2poY3iHWewk5Wg2Px+NYIcFgsKd9JO64Ihp+J6+GQLvd1rcZ4Uan07kmC9H/bwRK/X6/44X4fD45x/3Sl0fTNMTZP/wAuRWbIou7WQRw8FeAAQCz7XCB6pxh7AAAAABJRU5ErkJggg==">';

        stickyContainer.innerHTML = html;

        stickyContainer.querySelector('.hideButton').addEventListener('click', function () {
            if (hasClass(stickyContainer, 'hide')) {
                removeClass(stickyContainer, 'hide');
            } else {
                addClass(stickyContainer, 'hide');
            }
        }, false);

        body.appendChild(stickyContainer);

        addClass(stickyContainer, 'hide');
        setTimeout(function() {
            removeClass(stickyContainer, 'hide');
        }, 10);
        setTimeout(function() {
            addClass(stickyContainer, 'ready');
        }, 750);

        var head = d.querySelector('head');
        var css = d.createElement('style');
        css.type = "text/css";
        css.innerHTML = '.stickySocializeIt {' +
            'position: fixed;' +
            'z-index: 1000;' +
            '-ms-transition: top 0.75s, right 0.75s, bottom 0.75s, left 0.75s;' +
            'transition: top 0.75s, right 0.75s, bottom 0.75s, left 0.75s;' +
            '}' +
            '.stickySidebarLeft {' +
            'top: 10%;' +
            'left: 0;' +
            '}' +
            '.stickySidebarRight {' +
            'top: 10%;' +
            'right: 0;' +
            '}' +
            '.stickyBarTop {' +
            'top: 0;' +
            'left: 50%;' +
            '}' +
            '.stickyBarBottom {' +
            'bottom: 0;' +
            'left: 50%;' +
            '}' +
            '.stickySocializeIt .socializeIt {' +
            'margin: 0;' +
            'max-width: 37px !important;' +
            'box-sizing: border-box;' +
            'padding: 1px !important;' +
            '}' +
            '.sticky i {' +
            'margin: 0 !important;' +
            'width: 1em !important;' +
            'font-size: 30px;' +
            '}' +
            '.stickyBarTop .socializeIt,' +
            '.stickyBarBottom .socializeIt {' +
            'max-width: 100% !important;' +
            'margin-left: -50% !important;' +
            'text-align: center;' +
            '}' +
            '.stickyBarTop .socializeIt {' +
            'border-radius: 0 0 6px 6px;' +
            'border-top: 0 !important;' +
            '}' +
            '.stickyBarBottom .socializeIt {' +
            'border-radius: 6px 6px 0 0;' +
            'border-bottom: 0 !important;' +
            '}' +
            '.stickySidebarRight .socializeIt {' +
            'border-radius: 6px 0 0 6px ;' +
            'border-right: 0 !important;' +
            '}' +
            '.stickySidebarLeft .socializeIt {' +
            'border-radius: 0 6px 6px 0;' +
            'border-left: 0 !important;' +
            '}' +
            'html.mobile .stickyBarTop .socializeIt-8,' +
            'html.mobile .stickyBarBottom .socializeIt-8,' +
            '.stickyBarTop .socializeIt-8,' +
            '.stickyBarBottom .socializeIt-8 {' +
            'width: 224px !important;' +
            '}' +
            '.stickySocializeIt .payItForward {' +
            'width: 300px;' +
            'background: #fff;' +
            'overflow: auto;' +
            '}' +
            '.stickySocializeIt table,' +
            '.stickySocializeIt tbody,' +
            '.stickySocializeIt tr,' +
            '.stickySocializeIt td {' +
            'display: block;' +
            'text-align: center;' +
            'padding: 0;' +
            '}' +
            '.stickyBarTop table,' +
            '.stickyBarTop tbody,' +
            '.stickyBarTop tr,' +
            '.stickyBarTop td,' +
            '.stickyBarBottom table,' +
            '.stickyBarBottom tbody,' +
            '.stickyBarBottom tr,' +
            '.stickyBarBottom td {' +
            'display: inline-block;' +
            '}' +
            '.stickySidebarLeft tbody,' +
            '.stickySidebarRight tbody {' +
            'padding-bottom: 2px !important;' +
            '}' +
            '.shareHeader {' +
            'font-family: Arial, sans-serif !important;' +
            'font-size: 11px !important;' +
            'text-align: center;' +
            'padding: 2px !important;' +
            '}' +
            '.hideButton {'+
            'cursor: pointer;' +
            'border: 0 !important;' +
            'position: absolute;' +
            'margin-top: -4px;' +
            'margin-left: 1px;' +
            'width: 31px;' +
            'height: 31px;' +
            'opacity: 0;' +
            'padding: 10px;' +
            '-ms-transition: transform 0.75s, margin 0.75s, opacity 0.75s;' +
            'transition: transform 0.75s, margin 0.75s, opacity 0.75s;' +
            '}' +
            '.ready .hideButton {' +
            'opacity: 1;' +
            '}' +
            '.stickySidebarLeft.hide {' +
            'left: -38px;' +
            '}' +
            '.stickySidebarRight.hide {' +
            'right: -38px;' +
            '}' +
            '.stickyBarTop.hide {' +
            'top: -38px;' +
            '}' +
            '.stickyBarBottom.hide {' +
            'bottom: -38px;' +
            '}' +
            '.stickySidebarLeft .hideButton {'+
            'margin-left: 39%;' +
            '-ms-transform: rotate(-0.25turn);' +
            'transform: rotate(-0.25turn);' +
            '}' +
            '.stickySidebarLeft.hide .hideButton {' +
            'margin-left: 79%;' +
            '-ms-transform: rotate(0.25turn);' +
            'transform: rotate(0.25turn);' +
            '}' +
            '.stickySidebarRight .hideButton {'+
            'margin-left: -8px;' +
            '-ms-transform: rotate(0.25turn);' +
            'transform: rotate(0.25turn);' +
            '}' +
            '.stickySidebarRight.hide .hideButton {' +
            'margin-left: -25px;' +
            '-ms-transform: rotate(-0.25turn);' +
            'transform: rotate(-0.25turn);' +
            '}' +
            '.stickyBarTop .hideButton {'+
            'top: 10px;' +
            'left: 47%;' +
            'margin: 1px 0 0 1px;' +
            '}' +
            '.stickyBarTop.hide .hideButton {' +
            'margin-top: 19px;' +
            '-ms-transform: rotate(0.5turn);' +
            'transform: rotate(0.5turn);' +
            '}' +
            '.stickyBarBottom .hideButton {'+
            'top: -9px;' +
            'left: 47%;' +
            'margin: -1px 0 0 1px;' +
            '-ms-transform: rotate(-0.5turn);' +
            'transform: rotate(-0.5turn);' +
            '}' +
            '.stickyBarBottom.hide .hideButton {' +
            'margin-top: -19px;' +
            '-ms-transform: rotate(-1turn);' +
            'transform: rotate(-1turn);' +
            '}' +
            '';
        head.appendChild(css);

        if (options.version === 2) {
            var head = d.querySelector('head');
            var css = d.createElement('style');
            css.type = "text/css";
            css.innerHTML = '' +
                '.sticky .socializeIt-responsive .shareHeader,' +
                '.sticky .socializeIt-responsive .socialMedia {' +
                'display: inline-block;' +
                'box-sizing: border-box;' +
                'width: auto;' +
                '}' +
                '.sticky .socializeIt-responsive .shareHeader {' +
                'margin: 0;' +
                '}' +
                '.stickySidebarLeft .socializeIt-responsive .shareHeader,' +
                '.stickySidebarRight .socializeIt-responsive .shareHeader {' +
                'display: block;' +
                'width: 100%;' +
                '}' +
                '.stickySidebarLeft .socializeIt-responsive .socialMedia,' +
                '.stickySidebarRight .socializeIt-responsive .socialMedia {' +
                'width: 100%;' +
                '}' +
                '.socializeIt-responsive .socialMedia li {' +
                'text-align: center;' +
                'width: auto !important;' +
                '}' +
                '.stickySidebarLeft .socializeIt-responsive .socialMedia li,' +
                '.stickySidebarRight .socializeIt-responsive .socialMedia li {' +
                'display: block;' +
                'width: 100% !important;' +
                '}' +
            head.appendChild(css);
        }

        var ie9css = d.createElement('div');
        ie9css.innerHTML = '<!--[if IE 9]>' +
            '<style type="text/css">' +
            '.stickySidebarLeft,' +
            '.stickySidebarRight {' +
            'width: 37px;' +
            '}' +
            '.stickySidebarLeft.stickySocializeIt table,' +
            '.stickySidebarLeft.stickySocializeIt tbody,' +
            '.stickySidebarLeft.stickySocializeIt tr,' +
            '.stickySidebarLeft.stickySocializeIt td,' +
            '.stickySidebarRight.stickySocializeIt table,' +
            '.stickySidebarRight.stickySocializeIt tbody,' +
            '.stickySidebarRight.stickySocializeIt tr,' +
            '.stickySidebarRight.stickySocializeIt td {' +
            'float: left;' +
            '}' +
            '.hideButton {' +
            'clear:both;' +
            '}' +
            '.stickySidebarLeft .hideButton {' +
            'bottom: -14px;' +
            'left: 0;' +
            '}' +
            '.stickySidebarRight .hideButton {' +
            'bottom: -14px;' +
            'right: 24px;' +
            '}' +
            '.stickySidebarRight.hide .hideButton {' +
            'right: 40px;' +
            '}' +
            '</style>' +
            '<![endif]-->';
        head.appendChild(ie9css);
    }
};

function loadStyleSheet( path, fn, scope ) {
    var head = document.getElementsByTagName( 'head' )[0], // reference to document.head for appending/ removing link nodes
        link = document.createElement( 'link' );           // create the link node
    link.setAttribute( 'href', path );
    link.setAttribute( 'rel', 'stylesheet' );
    link.setAttribute( 'type', 'text/css' );

    var sheet, cssRules;
// get the correct properties to check for depending on the browser
    if ( 'sheet' in link ) {
        sheet = 'sheet'; cssRules = 'cssRules';
    }
    else {
        sheet = 'styleSheet'; cssRules = 'rules';
    }

    head.appendChild( link );  // insert the link node into the DOM and start loading the style sheet

    return link; // return the link node;
}

function loadJavasScript( url ) {
    var script = document.createElement('script');
    script.setAttribute("type","text/javascript");
    script.setAttribute("src", url);
    document.getElementsByTagName("head")[0].appendChild(script);
}

function payItForwardDefault() {
    return '<p>Would you prefer to share this page with others by linking to it?</p>'+
        '<ol>' +
        '<li>Click on the HTML link code below.</li>' +
        '<li>Copy and paste it, adding a note of your own, into your blog, a Web page, forums, a blog comment, ' +
        'your Facebook account, or anywhere that someone would find this page valuable.</li>' +
        '</ol>';
}

var socializeit_options = socializeit_options || [];
for (var i = 0; i < socializeit_options.length; i++) {
    socializeit(socializeit_options[i]);
}
window.socializeit_options = null;
