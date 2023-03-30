This skeleton has been developed as a proof of concept using our most commmon environment 

## Key Files

#### Javascript and CSS

* `src/question/index.js` - frontend javascript code for developing the UI of your custom question. All logic related to rendering your custom quesiton UI should go here. 
* `src/scorer/index.js` - backend javascript code for developing the scoring logic of your custom question. This code will be run on the server-side when your custom question is scored in Learnosity.

* `scss/_question.scss` - for writing CSS styling rules to be applied to your custom quesiton UI.

#### JSON
* `question.json` - REQUIRED. This file is for creating the JSON definition of your custom question to be stored inside of Learnosity.

* `question_editor_init_options.json` - OPTIONAL. Required only if you intend for new instances of your custom question to be authorable via the Learnosity Question editor UI. Please see our help article on How to Create A Custom Question Authoring Tile for more detail:

https://help.learnosity.com/hc/en-us/articles/360000755098-Authoring-Custom-Questions-Features#how-to-create-custom-question--feature-custom-tile-items

#### php

These php files are development scafolding files and their purpose is to emulate the Learnosity production environment during development so as to model how your custom question will behave as a first class citizen accross the Learnosity ecosystem from Authoring to Assessmnet to Analytics, just like any out of the box Learnosity question type.

You can therefore think of these files as a "development-server" whose language happens to be php. You don't need to make any changes to these files unless you want to. They automatically injest the JSON you create in the above 2 files.

* `assessment.php` - For modeling how your custom question will behave in a Learnosity Assessment. 
    Available at `localhost:12345/assessmnet.php`.

* `authoring.php`- If you intend to make your custom question available to authors, navigate to this file to model how your custom question will behave in on the Author Site or standalone Author API. 
    Available at `localhost:12345/authoring.php`

### html

 * `authoring_custom_layout.html` - If you intend to make your custom question available to authors, this file is for defining the question editor UI layout and appearance for authors who create new instances of your custom question. 



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
* run unit tests for your custom question
```
yarn unit-tests
```
