exports.getDefaultResponse = function(){
	return {
	  "version": "1.0",
	  "sessionAttributes": {
	    "supportedHoriscopePeriods": {
	      "daily": true,
	      "weekly": false,
	      "monthly": false
	    }
	  },
	  "response": {
	    "outputSpeech": {
	      "type": "PlainText",
	      "text": "Hello there, I'm quite cool."
	    },
	    "card": {
	      "type": "Simple",
	      "title": "Horoscope",
	      "content": "Today will provide you a new learning opportunity.  Stick with it and the possibilities will be endless."
	    },
	    "reprompt": {
	      "outputSpeech": {
		"type": "PlainText",
		"text": "Can I help you with anything else?"
	      }
	    },
	    "shouldEndSession": false
	  }
	};
};


