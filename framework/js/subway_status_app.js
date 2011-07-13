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
	this.start = function () {
		debug.log("app started, awesome 100");
		this.myScroll = new iScroll("status_list");
		//TODO: check if we have a network connection first
		this.getData();
	};
	this.getData = function () {
		var dataObject = new XMLGetAndParse;
		dataObject.url = dataUrl;
		dataObject.parser = this.Parser;
		dataObject.ondata = this.dataChangeHandler;
		dataObject.execute();
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
		return li[0];
	};
	
	function entryClick(event) {
		debug.log('click event fired');
		currentHeadline = jQuery(this).parent().find(".headline");
		jQuery(".headline").not(currentHeadline).slideUp();
		currentHeadline.slideToggle();
	}
	
	function decodeEntities(html) {
		return jQuery("<div />").html(html).text();
	}
}

