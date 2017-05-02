function setColClass($el) {
    // column count for row
    var ROW_COUNT = 12;
    var COLUMN_COUNT = 3;
    var index = $el.find('.col-sm-4').length;
    var lastIndex = $el.find('.col-sm-4').last().index();
    var colClass;

    if (index === COLUMN_COUNT) {
        return
    }

    if (index > COLUMN_COUNT) {
        while (index > COLUMN_COUNT) {
            index -= COLUMN_COUNT;
        }
    }

    colClass = ROW_COUNT / index;

    while (index) {
        --index;
        $el.find($("[class*='col-sm-']"))
            .eq(lastIndex - index)
            .removeClass('col-sm-4')
            .addClass('col-sm-' + colClass);
    }
}

function getInputLabelText(keyText) {
    var text = '';
    var result = [];

    keyText.split(/(?=[A-Z])/).filter(function (item) {
        if (item.length === 1) {
            text += item;
        } else {
            text += ' ';
            text += item;
        }
    });
    text = text.trim();
    text = text[0].toUpperCase() + text.substr(1);

    text.split(' ').filter(function (item, index) {
        if (item.length === 1 && index !== text.split(' ').length - 1) {
            result.push(item + '-');
        } else {
            result.push(item);
        }
    });

    return result.join(' ').replace(/-\s/, '-');
}

function updateTextForIndicatorTypeSelect($select) {
    if ($select.val()) {
        if ($select.val().length > 1) {
            $select.find('option:selected').each(function () {
                $(this).text($(this).attr('data-abbr'))
            });
        } else {
            $select.find('option:selected').each(function () {
                $(this).text($(this).attr('data-full-text'))
            });
        }

        $select.selectpicker('refresh').closest('.bootstrap-select').find('.dropdown-menu.inner').find('span.text').each(function (index) {
            $(this).text($select.find('option').eq(index).attr('data-full-text'));
        });
    }
}