function SubwayStatus() {
	var dataUrl = "http://www.mta.info/status/serviceStatus.txt";
	this.start = function () {
		debug.log("app started, awesome 100");
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
	this.dataChangeHandler = function () {
		debug.log('Data has been changed')
	}
}
