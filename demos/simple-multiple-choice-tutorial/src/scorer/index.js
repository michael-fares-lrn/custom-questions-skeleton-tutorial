export default class Scorer {
    constructor(question, response) {
        this.question = question;
        this.response = response;
    }

    /**
     * Check if the current question's response is valid or not
     * (Required)
     * @returns {boolean}
     */
     isValid() {
        // destructing for easy comparision of questions correct answer
        // to the learners provided response
        const { question, response } = this
          // if a response exists, and its value is equal to the value of the 
          // question's correct answer, then we will return true
           if(response && question.valid_response.value === response.value) {
            return true
        }
        // otherwise, we will return false
        return false;
    }

    /**
     * Returns an object displaying the validation state of each individual item inside the stored response
     * For example:
     * The student response value is: { min: 10, max: 20 } and our correct answer is { min: 10, max: 30 }
     * Then we expect the result of this validateIndividualResponses will be:
     * { min: true, max: false }
     * @returns {{}|null}
     */
    validateIndividualResponses() {
        // TODO: Requires implementation
        return null;
    }

    /**
     * Returns the score of the stored response
     * @returns {number|null}
     */
     score() {
        // if the answer is correct (isValid() === true) 
        // we will return the value of maxScore() which itself returns the "score" value
        // we indicated on our question JSON (1 in this case)
        if(this.isValid()) {
            return this.maxScore()
        }
        // otherwise we will return a score of 0
        return 0;
    }

    /**
     * Returns the possible max score of the stored response
     * @returns {number}
     */
    maxScore() {
        // return the "score" value
        // we indicated on our question JSON (1 in this case)
          return this.question.score
    }

    /**
     * Check if the current question is scorable or not.
     * For example:
     * - If there is no valid response data set in the question, this method should return false
     * - If this question type is not scorable (like an essay or open ended question) then this will return false
     * @returns {boolean}
     */
    canValidateResponse() {
        return true;
    }
}
