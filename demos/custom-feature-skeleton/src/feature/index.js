import { PREFIX } from './constants';

export default class Feature {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() =>{
            this.registerPublicMethods();
            this.handleEvents();


            init.events.trigger('ready');
        });
    }

    render() {
        const { el, init } = this;
        const { feature } = init;

        // TODO: Requires implementation
        el.innerHTML = `
                <div class="lrn_feature_wrapper ${PREFIX}">
                    Requires implementation - YOUR CONTENT GOES IN HERE
                    This element is the hook into which your custom feature's UI should be rendered.
                </div>            
        `;

        return Promise.all([]).then(() => {
              // TODO - Requires implementation
            /**  The logic to render the UI of your custom question should go here. 
             * 
             * For example this might be a call to a function or instantiation of a class to render your UI component(s).
             * 
             * 
             */ 

            /** Example implementation below that renders a simple decarative h1 display
             *  - you may replace the following lines below with your own code */
            
                // create a simple h1
                const myFeatureHeading = document.createElement('h1')
                myFeatureHeading.classList.add('my-custom-feature-heading')
                // add the text given for our custom feature JSON's example_custom_property in feature.json
                myFeatureHeading.innerHTML = feature.example_custom_property;
                // append the h1 to the custom feature wrapper hook element
                el.querySelector('.lrn_feature_wrapper').appendChild(myFeatureHeading)

        });
    }

    /**
     * Add public methods to the created feature instance that is accessible during runtime
     *
     * Example: questionsApp.feature('my-custom-feature-feature-id').myNewMethod();
     * 
     */
    registerPublicMethods() {
        const { init } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        // default methods that come with the custom Q skeleton - can ignore
        facade.disable = () => {

        };
        facade.enable = () => {

        };
    }

    handleEvents() {
        const { events, init, el } = this;
        const facade = init.getFacade()
 
    }
}
