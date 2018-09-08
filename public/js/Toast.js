/**
 * Toast notifications.
 */

let queue = [];

/**
 * Toast ntification contructor.
 */
function Toast(text, duration, buttons) {
  const toast = this;
  this.text = text;
  this.duration = duration;
  this.buttons = buttons;

  this.answer = new Promise(function(resolve) {
    toast._answerResolver = resolve;
  });

  this.gone = new Promise(function(resolve) {
    toast._goneResolver = resolve;
  });
}

/**
 * Create toast notification.
 * @param message text message to display
 * @param duration time in seconds before dismissing
 * @param buttons array of buttons
 */
Toast.prototype.create = (message = 'No message', duration = null, buttons = ['dismiss']) => {
  const toast = new Toast(message, duration, buttons);

  const toastElement = document.createElement('div');
  toastElement.id = 'toast';
  toastElement.className = 'toast';
  toastElement.tabIndex = '-1';
  const textElement = document.createElement('span');
  textElement.innerHTML = message;
  textElement.className = 'toast-text';
  toastElement.appendChild(textElement);

  if (buttons) {
    const buttonsElement = document.createElement('span');
    buttonsElement.className = 'toast-buttons'
    buttons.forEach((button) => {
      const toastButton = document.createElement('button');
      toastButton.id = button;
      toastButton.innerHTML = button;
      toastButton.className = 'unbutton';
      buttonsElement.appendChild(toastButton);
    });
    toastElement.appendChild(buttonsElement);

    buttonsElement.addEventListener('click', function(event) {
      const button = event.target;
      if (!button) return;
      toast._answerResolver(button.innerHTML);
      toast.dismiss(toastElement, toast);
    });

    buttonsElement.addEventListener('scroll', function(event) {
      if (buttonsElement.scrollLeft > 10) {
        textElement.className = 'toast-text_scrolled';
      } else {
        textElement.className = 'toast-text';
      }
    });
  }

  queue.push({toastElement, toast});
  toast.show(toast);

  return toast;
}

/**
 * Display toast notification from queue.
 */
Toast.prototype.show = () => {
  if (!document.getElementById('toast')) {
    const notification = queue.shift();
    document.body.appendChild(notification.toastElement);
    notification.toastElement.focus();

    if (notification.toast.duration) {
      this._hideTimeout = setTimeout(() => {
        notification.toast.dismiss(notification.toastElement, notification.toast);
      }, notification.toast.duration * 1000);
    }
  }
}

/**
 * Dismiss toast notification.
 */
Toast.prototype.dismiss = (toastElement, toast) => {
  clearTimeout(this._hideTimeout);
  toast._answerResolver();

  toastElement.classList.add('toast-dismissed');

  setTimeout(() => {
    toastElement.parentNode.removeChild(toastElement);
    if (queue.length > 0) {
      toast.show();
    }
  }, 400);

  return toast._goneResolver();
}
