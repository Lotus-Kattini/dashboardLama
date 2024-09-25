import { Axios } from '../../Api/Axios';
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPage from "../loading/Loading";

function Updateexpenses() {

    const [cost, setCost] = useState('');
    const [currency, setCurrency] = useState('');
    const [details, setDetails] = useState('');
    const [description, setDescription] = useState('');
    const [disable, setDisable] = useState(true);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    const nav=useNavigate()

    useEffect(() => {
        Axios.get(`/Expenses/${id}`)
        .then((data) => {
            setCost(data.data.cost);
            setCurrency(data.data.currency);
            setDetails(data.data.details);
            setDescription(data.data.description);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [id]);

    useEffect(() => {
        if (cost && currency) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    }, [cost, currency]);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await Axios.put(`/Expenses/${id}`, {
                cost: cost,
                currency: currency,
                details: details,
                description: description
            });
            console.log(res);
            setLoading(false);
            navigate('/dashboard/expences');
        } catch (err) {
            console.log(err);
            setLoading(false);
            if (cost === '' || currency === '' || details === '' || description === '') {
                setErr('Please Fill All Fields..');
            }
        }
    }

    return (
        <>
            {loading ? <LoadingPage /> :
                <Form className='bg-white w-full mx-2 p-3' onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="cost">
                        <Form.Label>Update Cost:</Form.Label>
                        <Form.Control 
                            type="number" 
                            maxLength={12}
                            name='cost' 
                            value={cost} 
                            onChange={(e) => setCost(e.target.value)} 
                            placeholder="Cost.." 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="currency">
                        <Form.Label>Update Currency:</Form.Label>
                        <Form.Select 
                            name='currency' 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="">Select Currency</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="JPY">JPY</option>
                            <option value="INR">INR</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="details">
                        <Form.Label>Update Details:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name='details' 
                            value={details} 
                            onChange={(e) => setDetails(e.target.value)} 
                            placeholder="Details.." 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Update Description:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name='description' 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder="Description.." 
                        />
                    </Form.Group>

                    {err && <p className="text-danger">{err}</p>}

                    <div className="d-flex align-items-center justify-content-between">
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        disabled={disable}
        >Update</button>
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        onClick={() => nav('/dashboard/expences', { replace: true })}
        >Cancel</button>
      </div>
                </Form>
            }
        </>
    );
}

export default Updateexpenses;
