import styled, { keyframes } from 'styled-components';

const LoadingDelete = () => {
    return (
        <Container>
            <Spinner />
            <LoadingText>Loading...</LoadingText>
        </Container>
    );
};

export default LoadingDelete;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background: rgba(211, 211, 211, 0.5);  /* Light gray background */
    backdrop-filter: blur(10px);
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
    border: 7px solid rgba(8, 91, 200, 0.3); /* Light blue border */
    border-radius: 50%;
    border-top: 7px solid #085bc8;  /* Solid blue border on top */
    width: 70px;
    height: 70px;
    animation: ${spin} 1.5s linear infinite; /* Faster and smoother spin */
`;

const LoadingText = styled.div`
    margin-top: 20px;
    font-size: 1.5em;
    color: #000000;  /* Black text color */
`;
