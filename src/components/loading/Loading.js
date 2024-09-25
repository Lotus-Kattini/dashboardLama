
import styled, { keyframes } from 'styled-components';

const LoadingPage = () => {
    return (
        <Container>
            <Spinner />
            <LoadingText>Loading...</LoadingText>
        </Container>
    );
};

export default LoadingPage;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #b0b0b0;
    width:100%;
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
    border: 7px solid #f3f3f3;
    border-radius: 50%;
    border-top: 7px solid #3498db;
    width: 100px;
    height: 100px;
    animation: ${spin} 2s linear infinite;
`;

const LoadingText = styled.div`
    margin-top: 20px;
    font-size: 1.5em;
    color: #ffffff;
`;

