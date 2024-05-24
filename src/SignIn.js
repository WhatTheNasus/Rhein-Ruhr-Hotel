import React, { useState, useEffect } from 'react';
import { signIn, signUp } from './firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './SignIn.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    document.title = 'Sign in';
    if (currentUser) {
      if (currentUser.emailVerified) {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  const handleSignIn = async () => {
    try {
      const userCredential = await signIn(email, password);
      setCurrentUser(userCredential.user);
      setError('');
      navigate('/');
    } catch (err) {
      console.error('Sign-in error:', err.message);
      setError(err.message);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!email || !password || !confirmPassword || !dateOfBirth) {
      setError('All fields are required');
      return;
    }

    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+{}[\]:;<>,.?/~\\-]/.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character');
      return;
    }

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    } 
    if (age < 15) {
      setError('You must be at least 15 years old to sign up');
      return;
    } 
    if (age > 120) {
      setError('You must be at most 120 years old to sign up');
      return;
    }

    try {
      const userCredential = await signUp(email, password);
      await userCredential.user.sendEmailVerification();
      setVerificationSent(true);
    } catch (err) {
      console.error('Signup error:', err.message);
      setError(err.message);
    }
  };

  const toggleSignUp = () => {
    document.title = isSignUp ? 'Sign in' : 'Sign up';
    setIsSignUp(!isSignUp);
    setError('');
  };

  const handleContinueToSignIn = () => {
    handleSignIn();
    setVerificationSent(false);
    setIsSignUp(false);
  };

  return (
    <div className="signin-container">
      {verificationSent ? (
        <div className="verification-box">
          <h2>Email Verification Sent</h2>
          <p>Please verify your email address before signing in.</p>
          <button onClick={handleContinueToSignIn} className="signin-button">Continue to Sign In</button>
        </div>
      ) : (
        <div className="signin-form">
          <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          {error && <p className="error-message">{error.replace('.', '').replace('Firebase: ', '')}</p>}
          {info && <p className="info-message">{info.replace('.', '').replace('Firebase: ', '')}</p>}
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
          {isSignUp && (
            <>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="signin-input"
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="signin-input"
              />
            </>
          )}
          {isSignUp ? (
            <button onClick={handleSignUp} className="signin-button">Sign Up</button>
          ) : (
            <button onClick={handleSignIn} className="signin-button">Sign In</button>
          )}
          <p className="toggle-link" onClick={toggleSignUp}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </p>
        </div>
      )}
    </div>
  );
}

export default SignIn;
