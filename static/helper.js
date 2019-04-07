function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function valueIsIn(text, search)
{
    if (text == undefined || text == null)
        return false;
    else
        return text.toLowerCase().indexOf(search.toLowerCase()) > -1;
}

ko.bindingHandlers.numeric = {
    init: function (element, valueAccessor) {
        $(element).on("keydown", function (event) {
            // Allow: backspace, delete, tab, escape, and enter
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: . ,
                (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) ||
                // Allow: home, end, left, right
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });
    }
};

function formatCurrency (symbol, value, precision) {
    return (value < 0 ? "-" : "") + symbol + Math.abs(value).toFixed(precision).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

function rawNumber (val) {
    return Number(val.replace(/[^\d\.\-]/g, ""));
}

ko.bindingHandlers.currency = {
    symbol: ko.observable("£"),
    init: function (element, valueAccessor, allBindingsAccessor) {
        //only inputs need this, text values don't write back
        if ($(element).is("input") === true) {
            var underlyingObservable = valueAccessor(),
                interceptor = ko.computed({
                read: underlyingObservable,
                write: function (value) {
                    if (value === "") {
                        underlyingObservable(null);
                    } else {
                        underlyingObservable(rawNumber(value));
                    }
                }
            });
            ko.bindingHandlers.value.init(element, function () {
                return interceptor;
            }, allBindingsAccessor);
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var symbol = ko.unwrap(allBindingsAccessor().symbol !== undefined ? allBindingsAccessor().symbol : ko.bindingHandlers.currency.symbol),
            value = ko.unwrap(valueAccessor());
        if ($(element).is("input") === true) {
            //leave the boxes empty by default
            value = value !== null && value !== undefined && value !== "" ? formatCurrency(symbol, parseFloat(value), 2) : "";
            $(element).val(value);
        } else {
            //text based bindings its nice to see a 0 in place of nothing
            value = value || 0;
            $(element).text(formatCurrency(symbol, parseFloat(value), 2));
        }
    }
};

ko.components.register('numeric', {
    template: { element: 'numeric-input-template' },
    viewModel: function(params) {
        this.number = ko.observable(params.number);
    }
});


function formatPercentage (value, precision) {
    return (value < 0 ? "-" : "") + Math.abs(value).toFixed(precision) + "%";
}

function rawNumber (val) {
    return Number(val.replace(/[^\d\.\-]/g, ""));
}

ko.bindingHandlers.percentage = {
    precision: ko.observable(2),
    init: function (element, valueAccessor, allBindingsAccessor) {
        //only inputs need this, text values don't write back
        if ($(element).is("input") === true) {
            var underlyingObservable = valueAccessor(),
                interceptor = ko.computed({
                read: underlyingObservable,
                write: function (value) {
                    if (value === "") {
                        underlyingObservable(null);
                    } else {
                        underlyingObservable(rawNumber(value));
                    }
                }
            });
            ko.bindingHandlers.value.init(element, function () {
                return interceptor;
            }, allBindingsAccessor);
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var precision = ko.unwrap(allBindingsAccessor().precision !== undefined ? allBindingsAccessor().precision : ko.bindingHandlers.percentage.precision),
            value = ko.unwrap(valueAccessor());
        if ($(element).is("input") === true) {
            //leave the boxes empty by default
            value = value !== null && value !== undefined && value !== "" ? formatPercentage(parseFloat(value), precision) : "";
            $(element).val(value);
        } else {
            //text based bindings its nice to see a 0 in place of nothing
            value = value || 0;
            $(element).text(formatPercentage(parseFloat(value), precision));
        }
    }
};

ko.bindingHandlers.date = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        //only inputs need this, text values don't write back
        if ($(element).is("input") === true) {
            var options = {
                format: "MM/DD/YYYY",
                defaultDate: ko.unwrap(valueAccessor())
            };
            ko.utils.extend(options, allBindingsAccessor().dateTimePickerOptions);
            var underlyingObservable = valueAccessor(),
                interceptor = ko.computed({
                read: underlyingObservable,
                write: function (value) {
                    underlyingObservable(value);
                }
            });
            $(element).parent().datetimepicker(options).on("dp.change", function (e) {
                if (e.date !== undefined) {
                    var picker = $(this).data("DateTimePicker"),
                        d = picker.getDate();
                    interceptor(d.format(picker.format));
                }
            });
            ko.bindingHandlers.value.init(element, function () {
                return interceptor;
            }, allBindingsAccessor);
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(),
            allBindings = allBindingsAccessor(),
            valueUnwrapped = ko.unwrap(value),
            pattern = allBindings.dateTimePickerOptions && allBindings.dateTimePickerOptions.format ? allBindings.dateTimePickerOptions.format : "MM/DD/YYYY",
            output = "";
        //Date formats: http://momentjs.com/docs/#/displaying/format/
        if (valueUnwrapped !== null && valueUnwrapped !== undefined && valueUnwrapped.length > 0) {
            output = moment(valueUnwrapped).format(pattern);
        }
        if ($(element).is("input") === true) {
            $(element).val(output);
        } else {
            $(element).text(output);
        }
    }
};

$.fn.semanticModal = function(options) {
    var self= this;
    if (options == "close")
    {
        self.modal("hide");
        return;
    }
    self.modal();

    self.find(".actions").empty();
    Object.keys(options.buttons).forEach(function(key) {

        var btn = $("<button class='ui button primary'>"+key+"</button>");
        btn.click(options.buttons[key]);
        self.find(".actions").append(btn);
    });
    self.modal("show");
    self.close = function(){
        self.modal("hide");
    }
    return this;
}