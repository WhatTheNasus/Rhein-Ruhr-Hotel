import React, { useState } from 'react';
import { signIn, signUp } from './firebase'; // Import your Firebase configuration
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import AuthContext
import './SignIn.css'; // Import the CSS file for styling

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); // Get setCurrentUser from context

  const handleSignIn = async () => {
    try {
      const userCredential = await signIn(email, password);
      setCurrentUser(userCredential.user); // Set the user in context
      setError(''); // Clear any previous error messages
      navigate('/dashboard'); // Redirect to Dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await signUp(email, password);
      setCurrentUser(userCredential.user); // Set the user in context
      setError(''); // Clear any previous error messages
      navigate('/dashboard'); // Redirect to Dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError(''); // Clear any previous error messages
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signin-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signin-input"
        />
        {isSignUp ? (
          <button onClick={handleSignUp} className="signin-button">Sign Up</button>
        ) : (
          <button onClick={handleSignIn} className="signin-button">Sign In</button>
        )}
        <p className="toggle-link" onClick={toggleSignUp}>
          {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
        </p>
      </div>
    </div>
  );
}

export default SignIn;
