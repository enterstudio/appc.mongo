module.exports = function (Arrow, server) {
	var Collection = Arrow.Collection;
	return function query(Model, options, next) {
		var collection = this.getCollection(Model);
		options = this.translateQueryKeys(Model, options);
		options = this.calculateQueryParams(options);

		collection.find(options.where, options.fields, {
			limit: options.limit,
			skip: options.skip,
			sort: options.order
		}, function (err, cursor) {
			if (err) { return next(err); }
			var array = [];
			cursor.each(function (err, doc) {
				if (null === doc) {
					next(null, new Collection(Model, array));
				}
				else {
					array.push(this.createInstanceFromResult(Model, doc));
				}
			}.bind(this));
		}.bind(this));
	};
};