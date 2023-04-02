# Notify Project in Vanilla JavaScript

Hi! This is plugin to showing information in Notify clouds. There are few types of notifications like info notification, error notification or success notification.


> Watch example here

# Files

Plugin requires two files. **notify.js** and **notify.css**.


    <!DOCTYPE  html>
    <html  lang="en">
	    <head>
		    <meta  charset="UTF-8">
		    <meta  http-equiv="X-UA-Compatible"  content="IE=edge">
		    <meta  name="viewport"  content="width=device-width, initial-scale=1.0">
		    <link  rel="stylesheet"  href="./dist/notify.css">// add this line to head
		    <link  rel="stylesheet"  href="./index.css">
		    <title>Notify plugin</title>
		</head>

	//add this at the end of <body> selector
    <script  src="./dist/notify.js"></script>

# Usage

To use to plugin you have to declare variable wich will be the instantion of class. Then you have to add title, description of notification. Type of notification is **info** by default, but if you want to change type of your notification you have to add one more argument wich will be a string that define type of notification. 

## example 

    let  notification = new  Notify('title', 'description', 'success');

# Configuration of notification
If you want to configure more specifications you have to add one more argument wich will be an object. For now you have those type of specifications:
| property | type |
|--|--|
| vAlign | 'string' |
| hAlign | 'string' |
| autoClose| boolean |
| autoCloseDuration| number |
| closeOnCrossClick| boolean|
| closeOnNotifyClick| boolean|

### Example

    let  notification = new  Notify(
                              'title',
                              'description',
                              'success',
                              {
                                vAlign:  'bottom',
                                hAlign:  'left',
                                autoClose:  true,
                                closeOnCrossClick:  false,
                                closeOnNotifyClick:  true
                              }
                            );
							
 **Available values of properties from configuration:**
 
| property | value|
|--|--|
| vAlign | 'top' / 'bottom' |
| hAlign | 'left' / 'right' |
| autoClose| true / false|
| autoCloseDuration| from 1 to 99999 (I used for those values but i you want longer try it out 😜 )|
| closeOnCrossClick| true / false|
| closeOnNotifyClick| true / false|


