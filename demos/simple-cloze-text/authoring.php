<?php
include_once '../config.php';

$init_options = file_get_contents('./question_editor_init_options.json');

$request = '
{
  "config": {
    "dependencies": {
      "question_editor_api": {
        "init_options": '.$init_options.'
      }
    }
  }
}
';
$signedRequest = signAuthoringRequest(json_decode($request, true));

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Author API - Skeleton</title>
    <script src="//authorapi.learnosity.com"></script>
    <style>
        <?php echo(file_get_contents('../sharedStyle.css')); ?>
        .response-placeholder {
            background-color: #eee;
            margin: 0 0.25em;
            content: url("https://questioneditor.learnosity.com/v3.115.2/vendor/ckeditor/plugins/lrn_underscore/icons/underscore.png")
        }
        .custom-insert-response {
            line-height: 2.5
        }
    </style>
</head>
<body>
<div id="learnosity-author"></div>
<div>
    <div class="client-request-json" data-type="initOptions">
        <div><b>Request init options</b></div>
        <textarea readonly></textarea>
    </div>
    <div class="client-request-json" data-type="htmlLayout">
        <div><b>Custom Question HTML Layout</b></div>
        <textarea readonly></textarea>
    </div>
</div>

<script>
    window.activity = <?php echo $signedRequest; ?>;

    window.authorApp = LearnosityAuthor.init(activity, {
        readyListener() {
            console.log('ready');
        
        },
        customButtons: [{
            name: 'custombutton1',
            label: 'Custom Insert Response',
            icon: 'https://questioneditor.learnosity.com/v3.115.2/vendor/ckeditor/plugins/lrn_underscore/icons/underscore.png',
            func: function customInsertResponse(attribute, callback) {
                return callback(
            `<span class="response-placeholder">{{response}}</span>&nbsp`)
            },
            attributes: [
                "template"
            ]
        }],
        errorListener(e) {
            console.error(e);
        },
    });

    // Display the current request init options & html layout
    document.querySelector('[data-type="initOptions"] > textarea').value = `${JSON.stringify(window.activity, null, 2)}`;
    document.querySelector('[data-type="htmlLayout"] > textarea').value = `<?php echo (file_get_contents('dist/authoring_custom_layout.html')) ?>`;
</script>
</body>
</html>
