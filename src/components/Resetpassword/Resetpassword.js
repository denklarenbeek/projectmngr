
import { useParams } from "react-router-dom"
import Modal from "../../features/modal/Modal"
import ChangePassword from "../../features/users/ChangePassword"

const ResetpasswordPage = () => {

    const { token } = useParams()


    return (
        <Modal show={true}>
            <ChangePassword token={token} />
        </Modal>
    )
}

export default ResetpasswordPage