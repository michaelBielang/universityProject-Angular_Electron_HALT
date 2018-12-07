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
    const name = group['controls']['name']['value'];
    const email = group['controls']['email']['value'];
    if (id === '' && email === '' && name === '') {
      return { idOrPwRequired: true };
    }
    return undefined;
  }
}

export function validationMessagesEN() {
  return {
    'required': 'This field is required.',
    'idOrPwRequired': 'Either id, name, or email is required',
  };
}
