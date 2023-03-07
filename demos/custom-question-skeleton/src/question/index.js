import { PREFIX } from './constants';

export default class Question {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() =>{
            this.registerPublicMethods();
            this.handleEvents();

            // PLACEHOLDER: Should we say something about updating the UI with saved responses in resume and review states here?

            if (init.state === 'review') {
                init.getFacade().disable();
            }

            init.events.trigger('ready');
        });
    }

    render() {
        const { el, init, lrnUtils } = this;
        const { question, response } = init;

        // TODO: Requires implementation
        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input">
                    Requires implementation - YOUR CONTENT GOES IN HERE
                </div>            
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

            // TODO - Requires implementation
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
        facade.showValidationUI = () => {
            // placeholder comment TODO: requires implementation
        };
        facade.resetValidationUI = () => {
            // placeholder comment TODO: requires implementation
        };
    }

    handleEvents() {
        const { events, init } = this;
        const facade = init.getFacade()

        // TODO: Requires implementation - Make sure you trigger 'changed' event after the user changes their responses to your custom quesiton:

        /**
         * 
         * 
         * when you consider that the response to your question has been changed, 
         * (such when a user clicks the choice of a multiple choice question or enters text into a free response question),
         * then you must trigger the changed event to inform questions API that the question has been attempted.
         * To do this, you must call events.trigger('changed', responses)  inside of a DOM event listener in which the user has changed their response to your question
         * (such as a 'click' event listener for a multiple choice question, or an input 'change' event listener for a free response text question)

         */

        /**
         * @respones - this variable can be any data type you would like it to be depending on the format of your responses. 
         * For instance, it might be a string for the value of a simple text input
         * Or for a quesiton asking a student plot coorinates on a graph, it might be an object containing the x and y coordinates, e.g.
         *     {
         *       x: 123,
         *       y: 408
         *     }
         */


        /** EXAMPLE implementation
         * 
         * document.getElementById('my-input').addEventListener('click', (event) => {
         *   
         *   // STEP 1: when the user clicks on your custom question's input, save its current value as the value of responses
         *  let responses = event.target.value
         *   
         *  // STEP 2: 
         *  // now notfy questions API that the user has changed their response
         *   
         *   events.trigger('changed', responses);
         * 
         * // STEP 3 - OPTIONAL
         * // If you chosen to implement facade.showValidationUI() to display visiual feedback for a correct / incorrect answer
         * when the user presses "Check Answer" for the current response:
         *  then make sure you call facade.resetValidationUI() here:
         * 
         * // facade.clearValidationUI()
         * 
         * })
         * 
         */

             


        // "validate" event can be triggered when Check Answer button is clicked or when public method .validate() is called
        // so developer needs to listen to this event to decide if he wants to display the correct answers to user or not
        // options.showCorrectAnswers will tell if correct answers for this question should be display or not.
        // The value showCorrectAnswers by default is the value of showCorrectAnswers inside initOptions object that is used
        // to initialize question app or the value of the options that is passed into public method validate (like question.validate({showCorrectAnswers: false}))
        events.on('validate', options => {
             // OPTIONAL Step 1: if you want to show changes to the UI for a correct or incorrect answer when the student presses check answer
            // do so by implementing facade.showValidationUI and calling it here.
            // this implementation uses the familiar Learnosity checkmark or x for a correct or incorrect answer
            facade.showValidationUI()


            // OPTIONAL Step 2: If you want to display the correct answer to the student when they press the check answer button,
            // then you should leverage the suggestedAnswersList.setAnswers() method.
            
            if (!facade.isValid() && options.showCorrectAnswers) {
                // pass a string of there is a single correct answer
                //OR:
                /**
                * For custom questions with multiple correct answers, you can also pass an array of objects into this method, each object containing an index key of type number for the 0-based index of the correct answer, and a label key of type string for the text of the correct answer. So, for a hypothetical question with 3 correct answers, you might pass the following array into setAnswers():

                    [
                    {index: 0, label: "correct answer 1"},
                    {index: 1, label: "correct answer 2"},
                    {index: 2, label: "correct answer 3"}
                    ]

                 */
                this.suggestedAnswersList.setAnswers();
            }

        });
    }
}
