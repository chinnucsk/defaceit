/**
 * +Template
 */

if (!Defaceit.Template){
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

Defaceit.Template = Defaceit.Model.extend({
	initialize: function(template, namespace) {
		this.templateName = template;
		namespace = namespace || 'template.defaceit.ru';
		this.template = Defaceit.Variable(template, namespace);
		this.template.on('loaded', this.parse, this);
		this.status('start');
		this.template.fetch();
	},

	parse: function(status) {
			var template = this.template.get();
			if (!template) {
				alert('Template not defined: ' + this.templateName);
				return;
			}
			this.set('text', template);

			var words = template.match(/{{[^}]+}}/g) || [];
			this.set('words', _.uniq(words));
			this.set('blocks', this.normalize(words));

			this.status('ready');
	}, 

	normalize: function(blockList) {
		var blocks = [],
			name = function(block) {return block = block.replace('{{', '').replace('}}', '').split('.')[0];}

		for( var i=0; i < blockList.length; i++) {
			blocks.push(name(blockList[i]));
		}
		return _.uniq(blocks);
	},

	status: function(status) {
		if(status) {
			this.myStatus = status;
			this.trigger('status:change');
		}
			return this.myStatus;
	},

	render: function(context) {
		return _.template(this.get('text'), context);
	}

});
}