'use strict';
(function () {
	var elementsIDs = [
		'redditUrl',
		'submitButton',
		'aggregationAction', 'aggregationPanel', 'aggDelimiter',
		'sortingAction', 'sortingPanel',
		'_submitForm', '_url', '_operation', '_delimiter'
	];
	var elements = findElements(elementsIDs);

	var operations = [{
		name: 'aggregation',
		radioId: 'aggregationAction',
		panelId: 'aggregationPanel',
		activationHandler: function () {
			toogleVisibility (operations, this.panelId);
		}
	}, {
		name: 'sorting',
		radioId: 'sortingAction',
		panelId: 'sortingPanel',
		activationHandler: function () {
			toogleVisibility (operations, this.panelId);
		}
	}];

	var state = {
		operation: operations[0].name
	};
	operations[0].activationHandler();



	elements.submitButton.onclick = function () {
		if (elements.aggregationAction.checked) {
			return submitAggregation();
		}
		if (elements.sortingAction.checked) {
			return submitSorting();
		}
	};

	operations.forEach(function (operation) {
		elements[operation.radioId].onchange = function () {
			state.operation = operation.name;
			operation.activationHandler();
		}
	});


	function submit (parameters) {
		for (var key in parameters) {
			if (parameters.hasOwnProperty(key)) {
				elements['_' + key].value = parameters[key];
			}
		}
		elements._submitForm.submit();
	}

	function findElements (elementsIDs) {
		var result = {};

		elementsIDs.forEach(function (elementId) {
			result[elementId] = document.getElementById(elementId);
		});

		return result;
	}

	function submitSorting () {
		console.log('sorting submitted');
	}

	function submitAggregation () {
		submit({
			operation: state.operation,
			url: elements.redditUrl.value,
			delimiter: elements.aggDelimiter.value
		});
	}

	function toogleVisibility (operations, visibleElementId) {
		operations.forEach(function (operation) {
			elements[operation.panelId].style.display = operation.panelId === visibleElementId ? 'block' : 'none';
		})
	}
})();
