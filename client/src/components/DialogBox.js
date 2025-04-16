import "../format/DialogBox.css";
const DialogBox = ({display, dialogText, acceptText, declineText, onAccept, onDecline}) => {

    return (
        <>
            {display && <div className='dialog-box'>
                <div className='dialog-flexbox'>
                    <span className='dialog-text'>{dialogText}</span>
                </div>
                <div className='dialog-flexbox'>
                    <span className='dialog-option' onClick={onAccept}>{acceptText || 'Ok'}</span>
                    {onDecline && <span onClick={onDecline} className='dialog-option'>{declineText || 'No'}</span>}
                </div>
            </div>}
        </>
    )
}

export default DialogBox;