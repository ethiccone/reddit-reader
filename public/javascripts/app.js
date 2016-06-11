'use strict';

(function (params) {
	var operations = {
		aggregation: {
			elements: ['aggregationPanel', 'aggregationDelimiter', 'aggregationButton'],
			panel: 'aggregationPanel',
			submitButton: 'aggregationButton',
			submit: function () {
				submit({
					operation: activeOperation,
					url: elements.redditUrl.value,
					delimiter: elements.aggregationDelimiter.value
				});
			}
		},
		sorting: {
			elements: [
				'sortingPanel', 'sortingDelimiter', 'sortingButton',
				'field', 'direction',
				'tableName', 'id', 'title', 'created', 'score'
			],
			panel: 'sortingPanel',
			submitButton: 'sortingButton',
			submit: function () {
				var format;
				var radios = document.getElementsByName('sortingOutputFormat');
				for (var i = 0, len = radios.length; i < len; ++i) {
					if (radios[i].checked) {
						format = radios[i].value;
						break;
					}
				}

				var tableName = elements.tableName.value;
				if (!tableName && format === 'sql') {
					return alert('Table name is required!');
				}

				submit({
					operation: activeOperation,
					url: elements.redditUrl.value,
					delimiter: elements.sortingDelimiter.value,
					format: format,
					field: elements.field.value,
					direction: elements.direction.value,
					tableName: tableName,
					id: elements.id.value,
					title: elements.title.value,
					created: elements.created.value,
					score: elements.score.value
				})
			}
		}
	};
	var activeOperation;
	var elements = findElements();

	init();

	function findElements() {
		var result = {};
		var ids = ['redditUrl', 'operationsSelect', '_submitForm'];

		forIn(params.operations, function (op) {
			ids = ids.concat(operations[op].elements);
		});

		ids.forEach(function (id) {
			result[id] = document.getElementById(id);
		});

		return result;
	}

	function panelsSwitcher(activePanel) {
		forIn(params.operations, function (op) {
			var panelId = operations[op].panel;
			elements[panelId].style.display = activePanel === panelId ? 'block' : 'none';
		});
	}

	function activateOperation (operation) {
		activeOperation = operation;
		panelsSwitcher(operations[operation].panel);
	}

	function addEventListeners () {
		elements.operationsSelect.onchange = function (event) {
			activateOperation (event.target.value);
		};

		forIn(params.operations, function (value, key) {
			var operation = operations[value];
			elements[operation.submitButton].onclick = operation.submit;
		});
	}

	function init() {
		addEventListeners();
		elements.operationsSelect.value = params.activeOperation;
		activateOperation(params.activeOperation);
	}

	function submit (parameters) {
		if (!elements.redditUrl.value) {
			return alert('URL field is empty');
		}

		var form = elements._submitForm;
		// remove all inputs from the form
		while (form.firstChild) {
			form.removeChild(form.firstChild);
		}
		// add inputs into the form
		forIn(parameters, function (value, key) {
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = key;
			input.value = value;

			form.appendChild(input);
		});

		form.submit();
	}

	function forIn (obj, callback) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				callback(obj[key], key);
			}
		}
	}
})(document.params);