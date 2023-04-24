import { useSelector, useDispatch } from "react-redux"
import { setMessage, getMessages, clearMessage } from "./messageSlice"

const MessageList = () => {
    const messages = useSelector(state => state.messages);
    const dispatch = useDispatch()

    console.log(messages)

    let content

    if(messages && messages.length > 0) {
        content = (
            <div className="message__container">
                {messages.map(message => {
                    return ( <div className={`message message-${message.status}`} key={message.id}>
                        <div className="message__icon">
                            <i class="fa-solid fa-xmark" onClick={() => dispatch(clearMessage(message.id))} ></i>
                        </div>
                        <div className="message_text">
                            <p>{message.message}</p>
                        </div>
                    </div>
                    )
                })}
            </div>
        )

    }

    return content
}

export default MessageList