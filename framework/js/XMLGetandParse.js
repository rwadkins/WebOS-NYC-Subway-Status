function XMLGetAndParse() {
    var that = this;
    this.url = '';
    this.parser = {};
    this.object = {};
    this.store = '';
    this.data = '';
    this.ondata = {};
    this.execute = function() {
        if(this.store) {
            this._load_data();
        }
        this._get_file();
    };
    this._get_file = function() {
        jQuery.get(this.url, this._get_success);
    };
    this._get_success = function(data, textStatus, jqXHR) {
        if(jqXHR.status == "200") {
            that.data = data;
            that._process_data();
            if(that.store) {
                that._save_data();
            }
            that._data_changed();
        }
    };
    this._get_error = function(jqXHR, textStatus, errorThrown) {
    };
    this._process_data = function() {
        this.parser(this.data, this.object);
    };
    this._load_data = function() {
        //console.log('attempting to save data');
        var stor = new Lawnchair({
            name : this.store
        }, function(obj) {
            this.get('appData', function(rec) {
                //console.log('loaded record');
                //console.log(rec);
                
                if (rec) {
                    //console.log('we have data, triggering data_changed');
                    that.object = rec.obj;
                    that._data_changed();
                }
            })
        });        
    }
    this._save_data = function() {
        //console.log('attempting to save data');
        var stor = new Lawnchair({
            name : this.store
        }, function(obj) {
            this.save({
                key : 'appData',
                obj : that.object
            });
        });
    }
    this._data_changed = function() {
        //trigger that the data's changed.
        if( typeof this.ondata == 'function') {
            this.ondata(this.object);
        }
    }
}