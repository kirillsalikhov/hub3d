import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShareButton } from './ShareButton';
import { SharePopup } from './SharePopup';

export const Share = ({resourceId, model}) => {
    const [showModal, setShowModal] = useState(false);

    const openPopup = useCallback(() => {
        setShowModal(true);
    }, []);

    const closePopup = useCallback(() => {
        setShowModal(false);
    }, []);

    return (
        <>
            <ShareButton onClick={openPopup}/>
            {showModal && createPortal(
                <SharePopup
                    onClose={closePopup}
                    resourceId={resourceId}
                    hasLinkPassword={model.hasLinkPassword}
                    setHasLinkPassword={model.setHasLinkPassword}
                />,
                document.body
            )}
        </>
    );
}
