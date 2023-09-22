import { createConsumer } from '@rails/actioncable';

class ActionCable {
    _consumer = null;
    url = null;

    create() {
        if (!this.url) {
            throw new Error('no url provided');
        }
        this._consumer = createConsumer(this.url);
    }

    getConsumer() {
        if (!this._consumer) {
            this.create()
        }
        return this._consumer
    }
}

export default new ActionCable();
