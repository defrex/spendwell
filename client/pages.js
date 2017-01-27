
import $ from 'jquery'
import moment from 'moment-timezone'

import 'sass/pages'
import 'utils/page-navigation'

$('input').on('change', function () {
  const $input = $(this)
  const value = $input.val()
  if (value && value.length) {
    $input.addClass('mui--is-not-empty')
  } else {
    $input.removeClass('mui--is-not-empty')
  }
})

if ($('#id_timezone')) {
  $('#id_timezone').val(moment.tz.guess())
}
