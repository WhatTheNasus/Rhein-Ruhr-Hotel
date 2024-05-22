import React, { useState, useEffect } from 'react';
import { signIn, signUp, signOut, sendEmailVerification } from './firebase'; // Import Firebase functions including sendEmailVerification
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import AuthContext
import './SignIn.css'; // Import the CSS file for styling
import { auth } from './firebase';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth(); // Get currentUser from context

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSignIn = async () => {
    try {
      const userCredential = await signIn(email, password);
      setCurrentUser(userCredential.user); // Set the user in context
      setError(''); // Clear any previous error messages
      navigate('/dashboard'); // Redirect to Dashboard
    } catch (err) {
      console.error('Signin error:', error.message);
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

    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?/~\\-]/.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character');
      return;
    }

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    } if (age < 15) {
      setError('You must be at least 15 years old to sign up');
      return;
    } else if (age > 120) {
      setError('You must be at most 120 years old to sign up');
      return;
    }
    
    try {
      const userCredential = await signUp(email, password);
      await sendEmailVerification(); // Send email verification
      setError('A verification email has been sent. Please check your inbox.');
  
      // Set up an observer on the Auth object to listen for changes in the authentication state
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          // Check if the user's email is verified
          if (user.emailVerified) {
            // Update profile and navigate to dashboard only after email is verified
            user.updateProfile({
              displayName: `${firstName} ${lastName}`,
            }).then(() => {
              setCurrentUser(user); // Set the user in context
              navigate('/dashboard'); // Redirect to Dashboard
              unsubscribe(); // Unsubscribe from the auth state observer
            });
          } else {
            // If the email is not verified, set an error message prompting the user to verify their email
            setError('Please verify your email address before proceeding');
          }
        }
      });
    } catch (err) {
      console.error('Signup error:', err.message);
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
        { error && <p className="error-message">{error.replace('.', '').replace('Firebase: ', '') }</p> }
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
    </div>
  );
}

export default SignIn;
