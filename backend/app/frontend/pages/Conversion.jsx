import { createConsumer } from "@rails/actioncable"

// TODO make smth more robust
const cableEndpoint = () => {
    // TODO That's definetly not good, may be this path should be send from backend
    const actionCableUrl = `ws://${window.location.host}/cable`;
    console.log(actionCableUrl, 'actionCableUrl');
    // should be called once for tab
    return createConsumer(actionCableUrl);
}

cableEndpoint().subscriptions.create(
    'TaskChannel',
    {
            received: (data) => { console.log(data); }
    }
);

export default function Resource({ conversionTask }) {
    console.log(conversionTask);
    return (
        <>
            <div>Conversion page</div>
        </>
    )
}
