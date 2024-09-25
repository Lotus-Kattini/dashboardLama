import axios from "axios";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../Api/Api";
import Cookie from 'cookie-universal';
import LoadingPage from "../components/loading/Loading";
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const nav = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  console.log(form);

  const cookie = Cookie();


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let res = await axios.post(`${BASEURL}/Account/Login`, form);
      notify()
      setLoading(false);
      console.log(res);
      const token = res.data.token;
      cookie.set('token', token);
      cookie.set('email',form.email)
      setTimeout(() => {
        nav('/dashboard-main');
      }, 1000);
    } catch (err) {
      setLoading(false);
      errorNotify();
      if (err.response && err.response.status === 401) {
        setErr('Wrong Email or Password..');
      } else {
        setErr('Internal Server Error..');
      }
    }
  }

  const notify = () => toast.success(`Welcome ${form.email}`,{
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const errorNotify=()=>toast.error('Something Went Wrong', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });

  return (
    <div>
      {loading ? <LoadingPage /> : (
        <div className="container">
          <div className="row" style={{ height: '100vh' }}>
            <Form className="form" onSubmit={handleSubmit}>
              <div className="custom-form">
                <h1 className="my-5 font-bold text-[2rem]">Log In</h1>

                <Form.Group className="form-custom" controlId="exampleForm.ControlInput1">
                  <Form.Control
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                  <Form.Label className="custom-label">Email:</Form.Label>
                </Form.Group>

                <Form.Group className="form-custom" controlId="exampleForm.ControlInput2">
                  <Form.Control
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password..."
                    required
                    minLength="6"
                  />
                  <Form.Label className="custom-label">Password:</Form.Label>
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </Form.Group>

                <button className="btn btn-primary">Login</button>
                {err !== '' && <span className="error">{err}</span>}
              </div>
            </Form>
          </div>
        </div>
      )}
        <ToastContainer />
    </div>
  );
}

export default Login;
