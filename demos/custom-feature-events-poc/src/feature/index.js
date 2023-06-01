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
                <div class="lrn_feature wrapper ${PREFIX}">
                    <button id="my-button">${feature.text}</button>
                </div>            
        `;

        // Optional - Render optional Learnosity components like Check Answer Button, Suggested Answers List
        // first before rendering your question's components
        return Promise.all([]).then(([]) => {});
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
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

        const myButton = el.querySelector('#my-button');

        // A normal DOM event listener to listen for the target interaction with 
        // the feature
        // this example uses simple button with a click event listener
        // that once clicked disabled the button and then triggers a custom event called 'my-custom-event'.
        myButton.addEventListener('click', () => {
            myButton.innerText = "Okay, you've interacted with me. Thank you!";
            myButton.setAttribute("disabled", true)
            
            // trigger a custom event to Learnosity using the events.trigger() method
            events.trigger('my-custom-event')

        })

        events.on('my-custom-event', () => {
            console.log('my-custom-event FIRED')
        }
    ) 
           


      
  
    }
}
