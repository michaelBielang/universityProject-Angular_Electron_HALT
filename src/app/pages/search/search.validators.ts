/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { FormGroup } from '@angular/forms';

export class SearchCustomValidators {
  idOrEmailRequired(group: FormGroup) {
    if (!group['controls']) {
      return undefined;
    }
    const id = group['controls']['id']['value'];
    const email = group['controls']['email']['value'];
    if (id === '' && email === '') {
      return { idOrPwRequired: true };
    }
    return undefined;
  }
}

export function validationMessagesEN() {
  return {
    'required': 'This field is required.',
    'idOrPwRequired': 'Either id or email is required',
  };
}
