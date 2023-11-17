const Component = require('../../classes/component/component');

class Row extends Component{
    constructor(){
        super({
            name: 'row',
            title: 'Row',
            description: 'Wrapper for elements',
            params: [],
            order: -1,

            // options for ROW
            options: [
                {
                    name: 'Full width section',
                    paramName: 'has-full-width',
                    description: 'Make the section full width, outside of the container',
                    className: "",
                    value: {
                        'No': '',
                        'Yes': 'has-full-width-section'
                    }
                }
            ]
        });
    }

    render(data){
        // options
        const bottomSpacing = this.getOptions(data.options, 'spacing');

        return `<div class="row ${bottomSpacing}" data-component-wrapper>#{DATA_CHILDREN}</div>`;
    }
}

module.exports = new Row();