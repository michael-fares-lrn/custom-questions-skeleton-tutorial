import { PREFIX } from './constants';
import { renderUI } from './renderUI.js';

export default class Question {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() =>{
            this.registerPublicMethods();
            this.handleEvents();

            if (init.state === 'review') {
                init.getFacade().disable();
            }

            init.events.trigger('ready');
        });
    }

    render() {
        const { el, init, lrnUtils } = this;
        const { question, response, state } = init;

        // TODO: Requires implementation
        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input"></div>            
                <div class="${PREFIX}-checkAnswer-wrapper"></div>
                <div class="${PREFIX}-suggestedAnswers-wrapper"></div>
            </div>
        `;

        // Optional - Render optional Learnosity components like Check Answer Button, Suggested Answers List
        // first before rendering your question's components
        return Promise.all([
            lrnUtils.renderComponent('SuggestedAnswersList', el.querySelector(`.${PREFIX}-suggestedAnswers-wrapper`)),
            lrnUtils.renderComponent('CheckAnswerButton', el.querySelector(`.${PREFIX}-checkAnswer-wrapper`))
        ]).then(([suggestedAnswersList]) => {
            this.suggestedAnswersList = suggestedAnswersList;

            renderUI(el, question, response, state)
        });
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     */
    registerPublicMethods() {
        const { init } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
            // TODO: Requires implementation
        };
        facade.enable = () => {
            // TODO: Requires implementation
        };
        facade.resetResponse = () => {
            // TODO: Requires implementation, you could use the following steps

            // trigger a 'resetResponse' event to reset the value of response
            // this.events.trigger('resetResponse');

            // reset other states if you need

            // re-render the component, manage the 'reset' state by yourself
        };
    }

    handleEvents() {
        // we are going to need all of these properties eventually, so let's desctructure them now
        const { events, el, init } = this;
        const { question } = init;
     
        // first we will access the runtime facade of our custom question
        // this is important, because we are going to call the getResponse() method on this facade
        // after saving our responses to verify that Questions API has picked them up and saved them.
        const facade = init.getFacade();

        // get an HTML collection of the choices in our question
        const choices = el.querySelectorAll(`input[type="radio"]`);

        // for each choice in the collection, add a click event listner to detect a change in the choice the user clicks
        choices.forEach((choice) => {
            choice.addEventListener("click", (event) => {
                // whenever the user clicks a choice radio button input, 
                // we will set the "value" of the questions response
                // to the value of the clicked input (event.target.value)
                // this will allow for easy comparision between valid_response.value and response.value when we 
                // work on scoring the question later
                let responseObject = { value: event.target.value };
                /**
                 * IMPORTANT: we now must MAKE SURE TO TRIGGER a "changed" event 
                 * in order to tell the Questions API register whenever there is a change to the repsonse object
                 * above. This tells Questions API that the user has changed their response and to keep track of the current response
                 */
                events.trigger("changed", responseObject);
                
                // Finally, lets call getResponse() on the runtime facade of our question, to make sure we see an output
                console.log("You clicked a choice! The current response is: ", facade.getResponse());
                // if questions API has sucessfully picked up the learners changed repsonse
                // then when clicking on "Choice A - Denver" in our question, 
                // we should see the following logged to the console:
                /************************************************************
             
                {
                    "value": {
                        "value": "0"
                    },
                    "type": "object",
                    "apiVersion": "v2.194.3-rc.7",
                    "revision": 1
                }
                 *************************************************************/
                /**
                 * NOTE that the TOP level "value" object is a default object applied by the Questions API getResponse() method
                 * to responses that are saved via triggering the "changed" event above.
                 * The NESTED value object here (value.value) is the value of the choice the learner picked.
                 *  we will work directly with this nested value property above and compare it to the valid_response object on
                 * our custom question when implementing the scoring logic in src/scorer/index.js
                 */

            });
        });


        // "validate" event can be triggered when Check Answer button is clicked or when public method .validate() is called
        // so developer needs to listen to this event to decide if he wants to display the correct answers to user or not
        // options.showCorrectAnswers will tell if correct answers for this question should be display or not.
        // The value showCorrectAnswers by default is the value of showCorrectAnswers inside initOptions object that is used
        // to initialize question app or the value of the options that is passed into public method validate (like question.validate({showCorrectAnswers: false}))
        events.on('validate', options => {
            // TODO: Requires implementation
        });
    }
}
