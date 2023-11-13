class Component{
    constructor(config){
        const {name, title, description, params, options} = this.validateConfig(config);
        this.name = name;
        this.title = title;
        this.description = description;
        this.params = params;
        this.order = config.order ?? 0;
        this.options = options;
    }

    validateConfig(config){
        // default options for each component
        const defaultOptions = [
            {
                name: 'Spacing',
                paramName: 'spacing',
                value: {
                    'Default': '',
                    'Small': 'margin-bottom-small',
                    'Medium': 'margin-bottom-medium',
                    'Large': 'margin-bottom-default'
                }
            },
        ];

        config.options = Array.isArray(config.options) ? [...defaultOptions, ...config.options] : defaultOptions;
        return config;
    }

    getParam(params, paramName){
        return params.find(p => p.key === paramName)?.value || '';
    }

    getOptions(options, optionName){
        return options.find(o => o.key === optionName)?.value || '';
    }

    render(data){
    }
}

module.exports = Component;