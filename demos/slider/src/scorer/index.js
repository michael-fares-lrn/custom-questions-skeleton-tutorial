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
        console.log("this.question.valid_response", this.question.valid_response)
        console.log("this.response", this.response)

        return this.question.valid_response && this.response && this.response === this.question.valid_response
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
        return this.isValid();
    }

    /**
     * Returns the score of the stored response
     * @returns {number|null}
     */
     score() {
        return this.isValid() ? this.maxScore() : 0;
    }

    maxScore() {
        return this.question.score || 0;
    }

    /**
     * Check if the current question is scorable or not.
     * For example:
     * - If there is no valid response data set in the question, this method should return false
     * - If this question type is not scorable (like an essay or open ended question) then this will return false
     * @returns {boolean}
     */
    canValidateResponse() {
        return true
    }
}
