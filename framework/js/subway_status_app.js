function SubwayStatus() {
	var dataUrl = "http://www.mta.info/status/serviceStatus.txt";
	var statuses = {
		"PLANNED WORK": {
			text: "Planned Work"
		},
		"GOOD SERVICE": {
			text: "Good Service"
		},
		"SERVICE CHANGE": {
			text: "Service Change"
		},
		"DELAYS": {
			text: "Delays"
		}
	};
	var that = this;
	this.subways = [];
	jQuery('.entry').live('click', entryClick);
	jQuery('#header').click(function() {that.getData();});
	this.refreshTimer = {};
	this.refreshTimerDuration = 300000;
	this.start = function () {
		debug.log("app started, awesome 100");
		this.myScroll = new iScroll("status_list", {
			hScroll: false,
			hScrollbar: false,
			vScrollbar: false,
			checkDOMChanges: false
		});
		//TODO: check if we have a network connection first
		this.getData();
	};
	this.getData = function () {
		clearTimeout(that.refreshTimer);
		var dataObject = new XMLGetAndParse;
		dataObject.url = dataUrl;
		dataObject.store = 'subwayStatus';
		dataObject.parser = that.Parser;
		dataObject.ondata = that.dataChangeHandler;
		dataObject.onGetStart = this.getStartHandler;
		dataObject.onGetEnd = this.getEndHandler;
		dataObject.onGetError = this.getErrorHandler;
		dataObject.execute();
		this.refreshTimer = setTimeout(that.getData, that.refreshTimerDuration); 
	};
	this.Parser = function(source, object) {
		_get_timestamp();
		_get_subways();

		function _get_timestamp() {
			object.timestamp = jQuery(source).find('timestamp').html();
		}
		function _get_subways() {
			object.subways = [];
			var subway_lines = jQuery(source).find('subway line');
			subway_lines.each( function (i, o) { _get_line(i, jQuery(o)) });
		}
		function _get_line(i, line) {
			var line = {
				line: line.find('name').html(),
				status: line.find('status').html(),
				text: line.find('text').html(),
				plannedworkheadline: line.find('plannedworkheadline').html()
			};
			object.subways.push(line);
		}
	};	
	this.dataChangeHandler = function (object) {
		debug.log('Data has been changed');
		that.subways = object.subways;
		var entries = [];
		jQuery.each(object.subways, function(i, entry) {
			entries.push(statusListItem(entry));
		});
		jQuery("#status_list ul").empty().append(entries);
		that.myScroll.refresh();
		jQuery("#lastUpdated").html("Last Updated: " + object.timestamp);
	};

    this.getStartHandler = function() {
        debug.log('StartHandler Called');
        jQuery("#refresh img").addClass("spinner");
    };
    
    this.getEndHandler = function() {
        debug.log('endHandler Called');
        jQuery("#refresh img").removeClass("spinner");
    };
    
    this.getErrorHandler = function(jqXHR, textStatus, errorThrown) {
        toasterPopup("An error has occurred\n" + errorThrown);
    };
    
	function statusListItem(entry) {
		var line_image = jQuery("<img />").attr("src","images/icons/" + entry.line + ".png");
		var line = jQuery("<span />").addClass("line").append(line_image);
		var status = jQuery("<span />").addClass("status").html(statuses[entry.status].text);
		var entryDiv = jQuery("<div />").addClass("entry").append(line, status);
		var headline = jQuery("<div />").addClass("headline").addClass("hidden").html(decodeEntities(entry.plannedworkheadline || entry.text));
		var li = jQuery("<li />").append(entryDiv);
		li.append(headline);
		li.attr("id",entry.line);
		li.data(entry);
		return li[0];
	};
	
	function entryClick(event) {
		debug.log('click event fired');
		currentHeadline = jQuery(this).parent().find(".headline");
		jQuery(".headline").not(currentHeadline).slideUp();
  		currentHeadline.slideToggle( "fast", function() { setTimeout( function() {that.myScroll.refresh();}, 0 ) });
		
	}
	
	function decodeEntities(html) {
		return jQuery("<div />").html(html).text();
	}
	
	function toasterPopup(message) {
	    var toaster = jQuery('#toasterMessage');
	    
	    toaster.html(message);
	    toaster.removeClass("hidden");
	    
	    toaster.css("bottom", 0);
	    
	    var timer = setTimeout(toasterClose, 5000);
	    
	    function toasterClose() {
	        toaster.innerHTML = "";
	        toaster.css("bottom", "-40px");
	    }
	}
}

