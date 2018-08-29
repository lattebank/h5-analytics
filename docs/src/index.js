import $ready from 'vanilla.js/jquery/ready'; // eslint-disable-line import/no-extraneous-dependencies
import $find from 'vanilla.js/jquery/find'; // eslint-disable-line import/no-extraneous-dependencies
import $on from 'vanilla.js/jquery/on'; // eslint-disable-line import/no-extraneous-dependencies


$ready(function () { // eslint-disable-line prefer-arrow-callback
  const $type = $find('.js-type');
  const $secret = $find('.js-type-secret');

  $on('.js-click', 'click', function () { // eslint-disable-line prefer-arrow-callback
    h5a('send', 'track', 'CLICK');
  });

  $on('.js-type', 'input', function () { // eslint-disable-line prefer-arrow-callback
    h5a('send', 'track', 'TYPE', { value: $type.value });
  });

  $on('.js-type-secret', 'input', function () { // eslint-disable-line prefer-arrow-callback
    h5a('send', 'track', 'TYPE_SECRET', { value: $secret.value }, { $exclude: 'GA' });
  });
});
