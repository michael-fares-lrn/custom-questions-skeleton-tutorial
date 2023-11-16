import { PREFIX } from './constants';
import * as d3 from 'd3';
import { sliderHorizontal } from 'd3-simple-slider';

export default class Question {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() =>{
            this.registerPublicMethods();
            this.handleEvents();

             if (init.state === 'resume') {
              
                if(init.response) {
                    console.log('init.response in reusme', init.response)
                    this.slider.value(init.response);
                    
                }
            }

            if (init.state === 'review') {
    
                if(init.response) {
                    console.log('init.response in review', init.response)
                    this.slider.value(init.response);
                    init.getFacade().disable();
                }
                
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
                <div class="container">
                    <div class="slider"></div>
                    <p class="value">0</p>
                </div>
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

            const slider = sliderHorizontal()
                    .handle('M60,60L60,60L50,80L40,60')
                    .min(0)
                    .max(100)
                    .step(1)
                    .width(600)
                    .displayValue(false)
                    .fill('royalblue')
                    
            this.slider = slider
            this.sliderHook = el.querySelector('div.slider')
            this.sliderValue = el.querySelector('p.value')
            

            d3.select(this.sliderHook)
                .append('svg')
                .attr('width', 800)
                .attr('height', 200)
                .append('g')
                .attr('transform', 'translate(80,80)')
                .call(this.slider);
                
            // move the slider up
            // reposition the thickened line strokes

            d3.selectAll('path.handle')
                .attr('transform', 'translate(-65,-120) scale(1.2)')
                .attr('fill', 'black')

            d3.selectAll('line.track-fill')
                .attr('transform','translate(-25,0)')
            d3.selectAll('line.track-inset')
                .attr('transform','translate(-25,0)')
                .attr('x2', '600')
            d3.selectAll('line.track')
                .attr('transform','translate(-25,0)')
                .attr('x2', '600')
            // axis
            d3.selectAll('g.axis')
                .attr('transform', 'translate(-5,7)')
           
        });
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     * 
     */
    registerPublicMethods() {
        const { init, el } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
                
            
            // TODO: Requires implementation
            /**
             * The purpose of this method is to prevent learner interaction with your question's UI.
             * 
             * If you plan to display your custom question in "review" state, then you need to implement this
             * method to prevent a learner or instructor who is reviewing their completed results from being able to change the responses in your question UI.
             */

            // EXAMPLE implementation
            // document.getElementById('my-input').setAttribute('disabled', true)

        };
        facade.enable = () => {
            /**
             * The purpose of this method is to re-enable learner interaction with your question's UI
             * after it has been previously disabled.
             *               
             * (For example, you plan to temporarily disable the question UI for a student taking the assessment until they complete another task like spend a set time reading the instructions.)
             */

            // EXAMPLE implementation
            // document.getElementById('my-input').removeAttribute('disabled')
        };
        facade.resetResponse = () => {
            /**
             * The purpose of this method is to support removal of a previously entered response to your custom question
             * and restoring the question to its initial blank state before a response was entered.
             * (For example, in a multiple choice question where a student has picked a choice, you reset the question so that no choices are picked at all.)
             */

            // TODO: Requires implementation, you could use the following steps

            // trigger a 'resetResponse' event to reset the value of response
            // this.events.trigger('resetResponse');

            // reset other states if you need

            // re-render the component, manage the 'reset' state by yourself
        };
        facade.showValidationUI = () => {
            // TODO: requires implementation
            /**
             * The purpose of this method is to update your custom question's UI with visual feedback 
             * after the learner presses the Check Answer button.
             * 
             * The following is an example implementation that shows the standard Learnosity "checkmark / tick" for a correct answer
             * or the standard Learnosity "x mark / cross" for an incorrect answer. 
             */
            
            // EXAMPLE implemetation:

            const answerIsCorrect = facade.isValid();
            /**
             * update the UI based on the result
             * IMPORTANT: In both cases we need to target the element with the classname lrn_response_input
             */
            if (answerIsCorrect) {
                /** if the answer is correct we will add the Learnosity utility class lrn_correct, which will automatically show the Learnosity
                 * checkmark (tick) you are used to on regular Learnosity quesiton types
                 */
                el.querySelector(".lrn_response_input").classList.add("lrn_correct");
            } else {
                /** if the answer is incorrect we will add the Learnosity utility class lrn_incorrect, which will automatically show the Learnosity
                 * x (cross) you are used to on regular Learnosity quesiton types
                 */
                el.querySelector(".lrn_response_input").classList.add("lrn_incorrect");
            }
                          
        };
        facade.resetValidationUI = () => {
            el.querySelector(".lrn_response_input").classList.remove("lrn_correct");
            el.querySelector(".lrn_response_input").classList.remove("lrn_incorrect");
            this.suggestedAnswersList.reset()
        };
    }

    handleEvents() {
        const { events, init } = this;
        const facade = init.getFacade()
        
        let response = 0;
        this.slider.on('onchange', (val) => {
            console.log("slider value is", val)
            d3.select(this.sliderValue).text(val);
            response = val;
            events.trigger('changed', response)
            console.log(facade.getResponse())
            facade.resetValidationUI()
        });

        
        
     
        events.on('validate', options => {

            console.log(facade.isValid())
         
            facade.showValidationUI()
            
            if (!facade.isValid() && options.showCorrectAnswers) {
        
                 this.suggestedAnswersList.setAnswers(init.question.valid_response);
            }
            

        });
    }
}
