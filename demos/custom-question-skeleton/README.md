## Key Files

e.g. This skeleton has been developed as a proof of concept using our most commmon env *****

* assessment.php
* authoring.php

* src/question/index.js - for developing the UI of your custom question. All logic related to rendering your custom quesiton UI should go here. 
* src/scorer/index.js - for developing the scoring logic of your custom question. This code will be run on the server when your custom question is scored in Learnosity.

* scss/_question.scss - for writing CSS styling rules to be applied to your custom quesiton UI.




## Available Scripts
* Start the localhost server to start developing your custom question
```
yarn dev
```
* Bundle the production ready code of your custom question. 
Once your custom question is ready, run this script and host the resulant `question.js`, `scorer.js`, and `question.css` files on your server.
```
yarn prod
```
* Test your scorer's behavior in the server side. Update question/response in `debugServerScorer.js` to test
```
yarn debug-server-scorer
```
