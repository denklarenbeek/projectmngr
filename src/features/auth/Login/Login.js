import { useEffect, useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { useDispatch } from "react-redux"
import { setCredentials } from "../authSlice"
import { useLoginMutation } from "../authApiSlice"

import Modal from "../../modal/Modal"
import Resetpassword from "../../users/Resetpassword"

import usePersist from "../../../hooks/usePersist"

import './Login.css'
import ChangePassword from "../../users/ChangePassword"
import Spinner from "../../../helpers/spinner"

const Login = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] =  useState('')
  const [persist, setPersist]= usePersist()
  const [modal, setModal] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, {isLoading}] = useLoginMutation()

  const errClass = errMsg ? 'errmsg' : 'offscreen'

  useEffect(() => {
    userRef.current.focus() // On load focus on the email field
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [email, password])

  const hanldeUserInput = (e) => setEmail(e.target.value)
  const handlePswdInput = (e) => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)
  const handleClose = () => setModal(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ email, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setEmail('')
      setPassword('')
      navigate('/dashboard')
    } catch (err) {
      if(!err.status) {
        setErrMsg('No Server Response')
      } else if(err.status === 400) {
        setErrMsg('Missing Username or Password')
      } else if (err.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg(err.data?.message)
      }
      errRef.current.focus()
    }
  }

  if (isLoading) return <Spinner />


  const content = (
    <div className="public">
      <section>
        <header>
          <h1>Login</h1>
        </header>
        <main className="login">
          <p ref={errRef} className={errClass} aria-live='assertive'>{errMsg}</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="text" name="email" id="email" ref={userRef} value={email} onChange={hanldeUserInput} autoComplete='off' required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" name="password" id="password" value={password} onChange={handlePswdInput} required />
            </div>
            <div className="form-group">
              <button type="submit">Login</button>
            </div>
            <div className="form-group checkbox">
              <label htmlFor="persist">Trust this device</label>
              <input type="checkbox" name="persist" id="persist" checked={persist} onChange={handleToggle}/>
            </div>
          </form>
        </main>
        <footer>
          <button className="forgot" onClick={() => setModal(true)} >Reset Password</button>
          {/* <Link to='/'>Back to homepage</Link> */}
        </footer>
      </section>
        <Modal Modal show={modal} handleClose={handleClose} title={"Reset password"}>
          <Resetpassword handleClose={handleClose} title={'Reset password'} />
        </Modal>
    </div>
  )

  return content
}

export default Login