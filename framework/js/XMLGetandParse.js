function XMLGetAndParse() {
	var that = this;
	this.url = '';
	this.parser = {};
	this.object = {};
	this.store = '';
	this.data = '';
	this.ondata = {};
	this.execute = function () {
		this._get_file();
	};
	this._get_file = function () {
		jQuery.get(this.url, this._get_success);
	};
	this._get_success = function (data, textStatus, jqXHR) {
		if (jqXHR.status == "200") {
			that.data = data;
			that._process_data();
		}
	};
	this._get_error = function(jqXHR, textStatus, errorThrown) {
	};
	this._process_data = function () {
		this.parser(this.data, this.object);
		//trigger that the data's changed.
		if (typeof this.ondata == 'function') {
			this.ondata(this.object);
		}
	};
	
}
