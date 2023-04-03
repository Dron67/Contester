import {ElementRef} from '@angular/core';

declare var M;

export interface MaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

export interface MaterialInstanceSelect {
  getSelectedValues?(): any;
  destroy?(): void;
}

export class MaterialService {
  static toast(message: string) {
    M.toast({html: message});
  }

  static updateTextInputs() {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement);
  }

  static initSidenav(ref: ElementRef): MaterialInstance {
    return M.Sidenav.init(ref.nativeElement);
  }

  static initSelect(ref: ElementRef): MaterialInstanceSelect {
    return M.FormSelect.init(ref.nativeElement);
  }

  static initCollapsible(ref: ElementRef): MaterialInstance {
    return M.Collapsible.init(ref.nativeElement);
  }
}
