import { Subject } from 'rxjs';

class DialogService {

    selector;

    constructor() {
        if (DialogService.instance) {
            return DialogService.instance;
        }
        DialogService.instance = this;
    }

    open(component) {
        if (!component.getElement || !component.registerEvents) {
            console.error('[DialogService] must open component');
        }
        const node = document.createElement('div');
        node.classList.add('app-dialog');

        node.appendChild(component.getElement());

        const body = document.querySelector('body');
        body.appendChild(node);

        component.registerEvents();
    }

    close() {
        const dialogs = document.querySelectorAll('body > .app-dialog');
        const body = document.querySelector('body');

        dialogs.forEach((dialog) => {
            body.removeChild(dialog);
        });
    }


}

export default DialogService;
