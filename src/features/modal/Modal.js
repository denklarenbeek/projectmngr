
import { useEffect } from 'react';
import './Modal.css';

const Modal = ({loadingModal, handleClose, show, children}) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    const handleEsc = (event) => {
        if (event.keyCode === 27 && show) {
            handleClose()
       }
     };

     useEffect(() => {
        document.addEventListener("keydown", handleEsc, false);

        return () => {
            document.removeEventListener("keydown", handleEsc, false);
        };
     }, [show])

    let content

    if(show && loadingModal) {
        content = (
            <div className={showHideClassName}>
                {children}
            </div>
        )
    } else if(show) {
        content = (
            <div className={showHideClassName}>
                <section className="modal_container">
                    {children}
                    <button onClick={handleClose} className='close_button'>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </section>
            </div>
        )
    }

    return content
}

export default Modal