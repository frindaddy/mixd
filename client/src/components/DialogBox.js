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
                    {declineText && <span onClick={onDecline} className='dialog-option'>{declineText}</span>}
                </div>
            </div>}
        </>
    )
}

export default DialogBox;